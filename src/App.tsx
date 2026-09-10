import React, { useState, useMemo, useEffect } from 'react';
import { 
  DistrictInfo, 
  HistoricalScenario, 
  Language, 
  RiskMetricType, 
  ForecastHorizon, 
  ProbabilisticForecast,
  AuthUser,
  UserRole
} from './types';
import { DISTRICTS, BLOCKS } from './data/climatologyData';
import { HISTORICAL_SCENARIOS } from './data/historicalScenarios';
import { calculateProbabilisticForecast } from './models/predictionEngine';
import { Navbar } from './components/Navbar';
import { TeleconnectionPanel } from './components/TeleconnectionPanel';
import { RiskMapLeaflet } from './components/RiskMapLeaflet';
import { BlockDetailDrawer } from './components/BlockDetailDrawer';
import { CropAdvisoryPanel } from './components/CropAdvisoryPanel';
import { FalseOnsetAlarmCard } from './components/FalseOnsetAlarmCard';
import { FarmerSimplifiedView } from './components/FarmerSimplifiedView';
import { ExtensionOfficerDashboard } from './components/ExtensionOfficerDashboard';
import { ValidationTrustPanel } from './components/ValidationTrustPanel';
import { HowItWorksModal } from './components/HowItWorksModal';
import { FirstTimeGuideModal } from './components/FirstTimeGuideModal';
import { GoogleAuthModal } from './components/GoogleAuthModal';
import { LanguageSettingsModal } from './components/LanguageSettingsModal';
import { JudgeModeModal } from './components/JudgeModeModal';
import { Award } from 'lucide-react';
import { auth, db, doc, getDoc, onAuthStateChanged, firebaseSignOut } from './lib/firebase';

export default function App() {
  const [currentView, setCurrentView] = useState<'map' | 'advisory' | 'farmer' | 'extension' | 'validation' | 'pipeline'>('map');
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictInfo>(DISTRICTS[0]);
  const [selectedBlockId, setSelectedBlockId] = useState<string>('nashik_haveli');
  const [selectedScenario, setSelectedScenario] = useState<HistoricalScenario>(HISTORICAL_SCENARIOS[0]);
  const [indices, setIndices] = useState(HISTORICAL_SCENARIOS[0].indices);
  const [metric, setMetric] = useState<RiskMetricType>('break');
  const [horizon, setHorizon] = useState<ForecastHorizon>(1);
  const [language, setLanguage] = useState<Language>(() => {
    try {
      return localStorage.getItem('monsoonpulse_language') || 'en';
    } catch {
      return 'en';
    }
  });
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    try {
      localStorage.setItem('monsoonpulse_language', newLang);
    } catch (e) {
      console.warn('Language save error:', e);
    }
  };
  // Pop up of how to use this whenever user opens this
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(() => {
    try {
      const pref = localStorage.getItem('monsoonpulse_auto_open_guide');
      return pref !== 'false'; // Default to true so it pops up whenever user opens this!
    } catch {
      return true;
    }
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'phone' | 'email' | 'google'>('phone');
  const [isJudgeModeOpen, setIsJudgeModeOpen] = useState(false);

  const handleOpenAuth = (tab: 'phone' | 'email' | 'google' = 'phone') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  // Authenticated user state from localStorage
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem('monsoonpulse_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const handleJudgeSelectRole = (newRole: UserRole) => {
    if (currentUser) {
      const updated: AuthUser = { ...currentUser, role: newRole };
      setCurrentUser(updated);
      try {
        localStorage.setItem('monsoonpulse_auth_user', JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed saving user role:', e);
      }
    } else {
      const demoUser: AuthUser = {
        uid: 'judge-eval-demo',
        email: 'evaluator@sih.gov.in',
        name: newRole === 'farmer' ? 'Ramesh Patil (Farmer)' : newRole === 'officer' ? 'Dr. Sunita Deshmukh (KVK)' : 'Jury Evaluator',
        picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        role: newRole,
        state: selectedDistrict.state,
        districtId: selectedDistrict.id,
        authProvider: 'google',
        preferredLanguage: language,
        loginTime: new Date().toISOString()
      };
      setCurrentUser(demoUser);
      try {
        localStorage.setItem('monsoonpulse_auth_user', JSON.stringify(demoUser));
      } catch (e) {
        console.warn('Failed saving demo user:', e);
      }
    }
  };

  // Listen to Firebase Auth state changes and restore session from Firestore
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          const userDocRef = doc(db, 'users', fbUser.uid);
          const snap = await getDoc(userDocRef);
          if (snap.exists()) {
            const data = snap.data();
            const loadedUser: AuthUser = {
              uid: fbUser.uid,
              name: data.displayName || fbUser.displayName || 'User',
              email: fbUser.email || data.email,
              picture: fbUser.photoURL || data.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fbUser.email || 'user')}`,
              role: data.role || 'farmer',
              state: data.state || 'Maharashtra',
              districtId: data.districtId || 'nashik',
              token: await fbUser.getIdToken(),
              authProvider: 'google',
              loginTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
              preferredLanguage: data.preferredLanguage,
              phone: data.phone
            };
            setCurrentUser(loadedUser);
            localStorage.setItem('monsoonpulse_auth_user', JSON.stringify(loadedUser));
            if (loadedUser.role === 'farmer') {
              setCurrentView('advisory');
            }
          }
        } catch (err) {
          console.warn('Firebase auth state fetch warning:', err);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Strict Role Constraint: If farmer is logged in, show ONLY the Crop Advisory Engine
  useEffect(() => {
    if (currentUser?.role === 'farmer' && currentView !== 'advisory') {
      setCurrentView('advisory');
    }
  }, [currentUser?.role, currentView]);

  const handleLogin = (user: AuthUser) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('monsoonpulse_auth_user', JSON.stringify(user));
    } catch (e) {
      console.warn('Auth save error:', e);
    }
    // If farmer, immediately direct to Crop Advisory Engine
    if (user.role === 'farmer') {
      setCurrentView('advisory');
    }
  };

  const handleLogout = async () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('monsoonpulse_auth_user');
      await firebaseSignOut(auth);
    } catch (e) {
      console.warn('Auth remove error:', e);
    }
  };

  // Trigger Sign-in popup after How-to-Use guide is dismissed
  const handleGuideClose = () => {
    setIsGuideOpen(false);
    if (!currentUser) {
      setTimeout(() => {
        setIsAuthModalOpen(true);
      }, 350);
    }
  };

  const handleGuideOpenAuth = () => {
    setIsGuideOpen(false);
    setTimeout(() => {
      setIsAuthModalOpen(true);
    }, 250);
  };

  // When scenario changes, update indices
  const handleSelectScenario = (scenario: HistoricalScenario) => {
    setSelectedScenario(scenario);
    setIndices(scenario.indices);
  };

  // When district changes, update selected block to first block of district
  const handleSelectDistrict = (district: DistrictInfo) => {
    setSelectedDistrict(district);
    if (district.blocks.length > 0 && !district.blocks.includes(selectedBlockId)) {
      setSelectedBlockId(district.blocks[0]);
    }
  };

  // If selected block is changed, ensure district matches
  const handleSelectBlock = (blockId: string) => {
    setSelectedBlockId(blockId);
    const block = BLOCKS[blockId];
    if (block && block.districtId !== selectedDistrict.id) {
      const parentDistrict = DISTRICTS.find(d => d.id === block.districtId);
      if (parentDistrict) setSelectedDistrict(parentDistrict);
    }
  };

  // Recalculate forecasts for all blocks whenever indices or horizon change
  const forecasts = useMemo<Record<string, ProbabilisticForecast>>(() => {
    const map: Record<string, ProbabilisticForecast> = {};
    Object.values(BLOCKS).forEach(block => {
      map[block.id] = calculateProbabilisticForecast(block, indices, horizon);
    });
    return map;
  }, [indices, horizon]);

  const activeBlock = BLOCKS[selectedBlockId] || BLOCKS['nashik_haveli'];
  const activeForecast = forecasts[selectedBlockId] || forecasts['nashik_haveli'];

  const handleNavigateToCropAdvisory = (blockId: string) => {
    setSelectedBlockId(blockId);
    setCurrentView('advisory');
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        selectedDistrict={selectedDistrict}
        setSelectedDistrict={handleSelectDistrict}
        selectedScenario={selectedScenario}
        setSelectedScenario={handleSelectScenario}
        language={language}
        setLanguage={handleLanguageChange}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
        currentUser={currentUser}
        onOpenAuth={() => handleOpenAuth(currentUser ? 'phone' : 'phone')}
        onOpenLanguageModal={() => setIsLanguageModalOpen(true)}
        onOpenJudgeMode={() => setIsJudgeModeOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        
        {/* VIEW 1: RISK MAP & TELECONNECTIONS */}
        {currentView === 'map' && (
          <div className="space-y-6">
            {/* Global Teleconnections Parameter Controller */}
            <TeleconnectionPanel
              indices={indices}
              setIndices={setIndices}
              selectedScenario={selectedScenario}
              onSelectScenario={handleSelectScenario}
            />

            {/* CRITICAL FALSE ONSET ALARM (Emotional & Functional Centerpiece) */}
            <FalseOnsetAlarmCard
              block={activeBlock}
              forecast={activeForecast}
              language={language}
              onNavigateToAdvisory={() => handleNavigateToCropAdvisory(activeBlock.id)}
            />

            {/* Risk Map & Block Detail Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Choropleth Map (7 Cols) */}
              <div className="lg:col-span-7">
                <RiskMapLeaflet
                  district={selectedDistrict}
                  onSelectDistrict={(dist) => {
                    setSelectedDistrict(dist);
                    if (dist.blocks.length > 0) {
                      handleSelectBlock(dist.blocks[0]);
                    }
                  }}
                  forecasts={forecasts}
                  selectedBlockId={selectedBlockId}
                  onSelectBlock={handleSelectBlock}
                  metric={metric}
                  setMetric={setMetric}
                  horizon={horizon}
                  setHorizon={setHorizon}
                  language={language}
                />
              </div>

              {/* Block Probability Inspector (5 Cols) */}
              <div className="lg:col-span-5">
                <BlockDetailDrawer
                  block={activeBlock}
                  forecast={activeForecast}
                  horizon={horizon}
                  onNavigateToCropAdvisory={handleNavigateToCropAdvisory}
                  language={language}
                />
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: CROP ADVISORY ENGINE */}
        {currentView === 'advisory' && (
          <CropAdvisoryPanel
            selectedBlockId={selectedBlockId}
            onSelectBlockId={handleSelectBlock}
            forecasts={forecasts}
            language={language}
          />
        )}

        {/* VIEW 3: FARMER-FACING MOBILE & DISPATCH */}
        {currentView === 'farmer' && (
          <FarmerSimplifiedView
            selectedBlockId={selectedBlockId}
            onSelectBlockId={handleSelectBlock}
            forecasts={forecasts}
            language={language}
            setLanguage={setLanguage}
            currentUser={currentUser}
            onOpenAuthModal={() => handleOpenAuth('phone')}
            onUpdateUser={handleLogin}
            onNavigateToAdvisory={() => setCurrentView('advisory')}
          />
        )}

        {/* VIEW 4: EXTENSION OFFICER / KVK CONSOLE */}
        {currentView === 'extension' && (
          <ExtensionOfficerDashboard
            district={selectedDistrict}
            forecasts={forecasts}
            horizon={horizon}
            onSelectBlock={handleSelectBlock}
            currentUser={currentUser}
            language={language}
          />
        )}

        {/* VIEW 5: VALIDATION & DEFENSIBILITY PANEL */}
        {currentView === 'validation' && (
          <ValidationTrustPanel
            selectedScenario={selectedScenario}
            onSelectScenario={handleSelectScenario}
          />
        )}

        {/* VIEW 6: PIPELINE DIAGRAM */}
        {currentView === 'pipeline' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-[#1E293B] border border-slate-800 p-4 rounded-xl">
              <div>
                <h2 className="text-lg font-bold text-white">System Architecture & Pipeline Flow</h2>
                <p className="text-xs text-slate-400">Integrated sub-seasonal downscaling and agronomic dispatch</p>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* First Time User Onboarding / How to Use Guide Modal */}
      <FirstTimeGuideModal
        isOpen={isGuideOpen}
        onClose={handleGuideClose}
        onOpenAuth={handleGuideOpenAuth}
        lang={language}
        onLanguageChange={setLanguage}
        onNavigateToView={(view) => {
          if (currentUser?.role === 'farmer') {
            setCurrentView('advisory');
          } else {
            setCurrentView(view);
          }
        }}
      />

      {/* Google Authentication & Profile Modal */}
      <GoogleAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
        defaultTab={authModalTab}
      />

      {/* How It Works Pipeline Architecture Modal */}
      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
        lang={language}
      />

      {/* Language & Regional Settings Modal */}
      <LanguageSettingsModal
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
        currentLanguage={language}
        onSelectLanguage={handleLanguageChange}
      />

      {/* SIH 26086 Judge & Jury Evaluation Deck Modal */}
      <JudgeModeModal
        isOpen={isJudgeModeOpen}
        onClose={() => setIsJudgeModeOpen(false)}
        currentRole={currentUser?.role}
        onSelectRole={handleJudgeSelectRole}
        onNavigateView={(view) => {
          setCurrentView(view);
        }}
      />

      {/* Floating Quick Trigger for Judges & Evaluators */}
      <div className="fixed bottom-4 right-4 z-40">
        <button
          id="floating-judge-mode-btn"
          onClick={() => setIsJudgeModeOpen(true)}
          className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black px-3.5 py-2 rounded-full shadow-2xl flex items-center gap-2 text-xs border border-yellow-200/80 transition-all transform hover:scale-105 active:scale-95 ring-2 ring-amber-400/40"
          title="Open SIH 26086 Judge Mode Presentation Deck"
        >
          <Award className="w-4 h-4 fill-slate-950 text-slate-950" />
          <span>Judge Mode</span>
          <span className="bg-slate-950/20 text-slate-950 text-[10px] px-1.5 py-0.2 rounded-full font-mono font-black">
            SIH 26086
          </span>
        </button>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-[#0F172A] py-5 px-6 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <strong className="text-slate-300">MonsoonPulse</strong> — Smart India Hackathon (SIH Problem Statement 26086)
          </div>
          <div>
            Developed for Ministry of Earth Sciences (MoES) & NCMRWF • Kharif Hyperlocal Agrometeorology
          </div>
        </div>
      </footer>
    </div>
  );
}
