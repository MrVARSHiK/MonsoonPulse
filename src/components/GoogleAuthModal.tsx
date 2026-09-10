import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  LogOut, 
  MapPin, 
  Languages, 
  Smartphone, 
  Mail, 
  User, 
  LogIn,
  AlertCircle,
  Sparkles,
  Database,
  Phone,
  KeyRound,
  Sprout,
  ArrowRight,
  RefreshCw,
  Send
} from 'lucide-react';
import { AuthUser, UserRole, Language, CropId } from '../types';
import { STATES, DISTRICTS, CROPS } from '../data/climatologyData';
import { STATE_DISTRICT_LOOKUP } from '../data/stateDistrictMapping';
import { SUPPORTED_LANGUAGES, getLanguageMeta } from '../data/languages';
import { soundFx } from '../utils/soundFx';
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  firebaseSignOut, 
  db, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  serverTimestamp 
} from '../lib/firebase';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AuthUser | null;
  onLogin: (user: AuthUser) => void;
  onLogout: () => void;
  defaultTab?: 'phone' | 'email' | 'google';
}

// Format clean name from email address
const deriveNameFromEmail = (email: string): string => {
  if (!email || !email.includes('@')) return 'User';
  const namePart = email.split('@')[0];
  const cleaned = namePart.replace(/[._\-0-9]/g, ' ').trim();
  if (!cleaned) return 'User';
  return cleaned
    .split(' ')
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// Generates an avatar URL based on email/name
const getAvatarUrl = (email: string, name: string): string => {
  const seed = email.trim().toLowerCase() || name.trim().toLowerCase() || 'user';
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(seed)}&backgroundColor=059669,2563eb,7c3aed,d97706&fontSize=42`;
};

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onLogout,
  defaultTab = 'phone'
}) => {
  // Auth method: 'phone' (dedicated for farmers), 'email', 'google'
  const [authMethod, setAuthMethod] = useState<'phone' | 'email' | 'google'>(defaultTab);
  const [selectedRole, setSelectedRole] = useState<UserRole>('farmer');

  // Common fields
  const [selectedState, setSelectedState] = useState('Maharashtra');
  const [selectedDistrictId, setSelectedDistrictId] = useState('nashik');
  const [farmerLanguage, setFarmerLanguage] = useState<Language>('mr');
  const [authError, setAuthError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);

  // Phone registration specific fields
  const [farmerPhone, setFarmerPhone] = useState<string>('');
  const [farmerName, setFarmerName] = useState<string>('');
  const [farmerCrop, setFarmerCrop] = useState<CropId>('soybean');
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [otpStep, setOtpStep] = useState<'phone_entry' | 'otp_verify'>('phone_entry');
  const [generatedOtp, setGeneratedOtp] = useState<string>('');
  const [enteredOtp, setEnteredOtp] = useState<string>('');
  const [otpError, setOtpError] = useState<string | null>(null);

  // Email registration fields
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);

  // Profile edit field for phone
  const [profilePhoneEdit, setProfilePhoneEdit] = useState('');
  const [isSavingProfilePhone, setIsSavingProfilePhone] = useState(false);
  const [phoneSaveSuccess, setPhoneSaveSuccess] = useState(false);

  // Initialize or reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      soundFx.playChime();
      setAuthError(null);
      setEmailError(null);
      setPhoneError(null);
      setOtpError(null);
      setOtpStep('phone_entry');
      setEnteredOtp('');

      if (currentUser) {
        setEmail(currentUser.email || '');
        setFullName(currentUser.name || '');
        setSelectedRole(currentUser.role || 'farmer');
        setSelectedState(currentUser.state || 'Maharashtra');
        if (currentUser.preferredLanguage) {
          setFarmerLanguage(currentUser.preferredLanguage);
        }
        if (currentUser.phone) {
          setFarmerPhone(currentUser.phone);
          setProfilePhoneEdit(currentUser.phone);
        }
      } else {
        setAuthMethod(defaultTab);
        const savedLang = localStorage.getItem('monsoonpulse_farmer_lang') as Language;
        if (savedLang) setFarmerLanguage(savedLang);
        const savedPhone = localStorage.getItem('monsoonpulse_farmer_phone');
        if (savedPhone) {
          setFarmerPhone(savedPhone);
          setProfilePhoneEdit(savedPhone);
        }
        const savedCrop = localStorage.getItem('monsoonpulse_farmer_crop') as CropId;
        if (savedCrop && CROPS[savedCrop]) setFarmerCrop(savedCrop);
        setEmail('');
        setFullName('');
      }
    }
  }, [isOpen, currentUser, defaultTab]);

  // Keep district list in sync with state
  const availableDistricts = STATE_DISTRICT_LOOKUP[selectedState] || [];
  useEffect(() => {
    if (availableDistricts.length > 0) {
      if (!availableDistricts.some(d => d.id === selectedDistrictId)) {
        setSelectedDistrictId(availableDistricts[0].id);
      }
    }
  }, [selectedState, availableDistricts, selectedDistrictId]);

  if (!isOpen) return null;

  const validateEmail = (val: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(val.trim());
  };

  // Sync user with Firestore database
  const saveUserToFirestore = async (user: AuthUser) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        await updateDoc(userRef, {
          displayName: user.name,
          role: user.role,
          state: user.state || 'Maharashtra',
          districtId: user.districtId || 'nashik',
          preferredLanguage: user.preferredLanguage || 'en',
          phone: user.phone || '',
          lastLoginAt: serverTimestamp()
        });
      } else {
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.name,
          photoURL: user.picture,
          role: user.role,
          state: user.state || 'Maharashtra',
          districtId: user.districtId || 'nashik',
          preferredLanguage: user.preferredLanguage || 'en',
          phone: user.phone || '',
          createdAt: serverTimestamp(),
          lastLoginAt: serverTimestamp()
        });
      }
    } catch (err) {
      console.warn('Firestore user save warning:', err);
    }
  };

  // ================= PHONE REGISTRATION HANDLERS =================
  const handleSendPhoneOtp = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playClick();
    setPhoneError(null);
    setOtpError(null);

    const cleanDigits = farmerPhone.replace(/\D/g, '');
    if (cleanDigits.length < 10) {
      setPhoneError('Please enter a valid 10-digit mobile number (e.g. 98220 41289).');
      return;
    }

    // Generate random 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setOtpStep('otp_verify');
    soundFx.playChime();
  };

  const handleVerifyPhoneAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playClick();
    setOtpError(null);

    const cleanOtp = enteredOtp.trim();
    if (!cleanOtp || cleanOtp !== generatedOtp) {
      setOtpError('Invalid OTP code. Please enter the 6-digit code or click Auto-Fill.');
      return;
    }

    setIsSubmitting(true);
    try {
      const cleanDigits = farmerPhone.replace(/\D/g, '').slice(-10);
      const formattedPhone = `+91 ${cleanDigits.slice(0, 5)} ${cleanDigits.slice(5)}`;
      const finalName = farmerName.trim() || `Kisan (${cleanDigits.slice(-4)})`;
      const uid = `kisan-${cleanDigits}`;

      const farmerUser: AuthUser = {
        uid,
        name: finalName,
        email: `${cleanDigits}@kisan.monsoonpulse.gov.in`,
        picture: `https://api.dicebear.com/7.x/bottts/svg?seed=kisan-${cleanDigits}&backgroundColor=059669`,
        role: 'farmer',
        state: selectedState,
        districtId: selectedDistrictId,
        token: 'phone-token-' + Math.random().toString(36).substring(2, 12),
        authProvider: 'phone',
        loginTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
        preferredLanguage: farmerLanguage,
        phone: formattedPhone
      };

      // Persist in Firestore
      await saveUserToFirestore(farmerUser);

      // Save local preferences
      localStorage.setItem('monsoonpulse_farmer_phone', formattedPhone);
      localStorage.setItem('monsoonpulse_farmer_lang', farmerLanguage);
      localStorage.setItem('monsoonpulse_farmer_crop', farmerCrop);

      onLogin(farmerUser);
      setIsSubmitting(false);
      setShowSuccess(true);
      soundFx.playSuccess();

      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 750);
    } catch (err: any) {
      console.warn('Phone registration error:', err);
      setIsSubmitting(false);
      setAuthError('Registration error: ' + (err?.message || 'Unknown error'));
    }
  };

  // ================= GOOGLE SIGN-IN HANDLER =================
  const handleFirebaseGoogleSignIn = async () => {
    soundFx.playClick();
    setIsGoogleLoading(true);
    setAuthError(null);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;

      if (!fbUser || !fbUser.email) {
        throw new Error('Could not retrieve Google account profile.');
      }

      let userRole: UserRole = selectedRole;
      let userState: string = selectedState;
      let userLang: Language = farmerLanguage;
      let userPhone: string = farmerPhone;

      try {
        const userRef = doc(db, 'users', fbUser.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.role) userRole = data.role as UserRole;
          if (data.state) userState = data.state;
          if (data.preferredLanguage) userLang = data.preferredLanguage as Language;
          if (data.phone) userPhone = data.phone;
        }
      } catch (dbErr) {
        console.warn('Error reading from Firestore:', dbErr);
      }

      const authUserData: AuthUser = {
        uid: fbUser.uid,
        name: fbUser.displayName || deriveNameFromEmail(fbUser.email),
        email: fbUser.email,
        picture: fbUser.photoURL || getAvatarUrl(fbUser.email, fbUser.displayName || ''),
        role: userRole,
        state: userState,
        districtId: selectedDistrictId,
        token: await fbUser.getIdToken(),
        authProvider: 'google',
        loginTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
        preferredLanguage: userRole === 'farmer' ? userLang : undefined,
        phone: userPhone.trim().length > 4 ? userPhone.trim() : undefined
      };

      await saveUserToFirestore(authUserData);

      if (userRole === 'farmer') {
        localStorage.setItem('monsoonpulse_farmer_lang', userLang);
        if (userPhone.trim().length > 4) {
          localStorage.setItem('monsoonpulse_farmer_phone', userPhone.trim());
        }
      }

      onLogin(authUserData);
      setIsGoogleLoading(false);
      setShowSuccess(true);
      soundFx.playSuccess();

      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 750);
    } catch (error: any) {
      setIsGoogleLoading(false);
      const errorCode = error?.code || '';

      if (errorCode === 'auth/popup-closed-by-user' || errorCode === 'auth/cancelled-popup-request') {
        setAuthError('Google sign-in popup was dismissed. You can try again or register directly with your phone number.');
      } else if (errorCode === 'auth/popup-blocked') {
        setAuthError('Sign-in popup was blocked by your browser. Please allow popups or use phone registration below.');
      } else {
        setAuthError(error?.message || 'Failed to sign in with Google.');
      }
    }
  };

  // ================= DIRECT EMAIL SIGN-IN =================
  const handleDirectSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playClick();

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setEmailError('Please enter your email address.');
      return;
    }

    if (!validateEmail(cleanEmail)) {
      setEmailError('Please enter a valid email format (e.g. name@example.com).');
      return;
    }

    setEmailError(null);
    setAuthError(null);
    setIsSubmitting(true);

    try {
      const finalName = fullName.trim() || deriveNameFromEmail(cleanEmail);
      const generatedUid = 'usr-' + btoa(cleanEmail).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);

      const userPayload: AuthUser = {
        uid: generatedUid,
        name: finalName,
        email: cleanEmail,
        picture: getAvatarUrl(cleanEmail, finalName),
        role: selectedRole,
        state: selectedState,
        districtId: selectedDistrictId,
        token: 'token-' + Math.random().toString(36).substring(2, 12),
        authProvider: 'google',
        loginTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
        preferredLanguage: selectedRole === 'farmer' ? farmerLanguage : undefined,
        phone: farmerPhone.trim().length > 4 ? farmerPhone.trim() : undefined
      };

      await saveUserToFirestore(userPayload);

      if (selectedRole === 'farmer') {
        localStorage.setItem('monsoonpulse_farmer_lang', farmerLanguage);
        if (farmerPhone.trim().length > 4) {
          localStorage.setItem('monsoonpulse_farmer_phone', farmerPhone.trim());
        }
      }

      onLogin(userPayload);
      setIsSubmitting(false);
      setShowSuccess(true);
      soundFx.playSuccess();

      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 700);
    } catch (err: any) {
      console.warn('Direct sign-in warning:', err);
      setIsSubmitting(false);
      setAuthError('Sign-in error: ' + (err?.message || 'Unknown error'));
    }
  };

  // ================= ROLE SWITCHER FOR LOGGED IN USER =================
  const handleSwitchUserRole = async (newRole: UserRole) => {
    if (!currentUser) return;
    soundFx.playClick();
    setIsUpdatingRole(true);

    try {
      const updatedUser: AuthUser = {
        ...currentUser,
        role: newRole,
        preferredLanguage: newRole === 'farmer' ? (currentUser.preferredLanguage || farmerLanguage) : currentUser.preferredLanguage
      };

      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        role: newRole,
        lastLoginAt: serverTimestamp()
      });

      onLogin(updatedUser);
      setIsUpdatingRole(false);
      soundFx.playSuccess();
    } catch (e) {
      console.warn('Failed to update role in Firestore:', e);
      onLogin({ ...currentUser, role: newRole });
      setIsUpdatingRole(false);
    }
  };

  // Update phone in profile
  const handleSaveProfilePhone = async () => {
    if (!currentUser) return;
    const cleanDigits = profilePhoneEdit.replace(/\D/g, '').slice(-10);
    if (cleanDigits.length < 10) return;
    const formatted = `+91 ${cleanDigits.slice(0, 5)} ${cleanDigits.slice(5)}`;

    setIsSavingProfilePhone(true);
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, { phone: formatted });
      localStorage.setItem('monsoonpulse_farmer_phone', formatted);
      onLogin({ ...currentUser, phone: formatted });
      setIsSavingProfilePhone(false);
      setPhoneSaveSuccess(true);
      setTimeout(() => setPhoneSaveSuccess(false), 2500);
      soundFx.playSuccess();
    } catch (e) {
      console.warn('Error saving phone to Firestore:', e);
      setIsSavingProfilePhone(false);
    }
  };

  // Sign out handler
  const handleSignOut = async () => {
    soundFx.playClick();
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      console.warn('Firebase signout error:', e);
    }
    onLogout();
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-[#070D1B]/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ type: 'spring', damping: 25, stiffness: 320 }}
          className="bg-[#141E33] border border-slate-700/80 rounded-2xl max-w-md w-full shadow-2xl p-6 relative text-slate-200 overflow-hidden my-auto"
        >
          {/* Top Accent Strip */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-indigo-500 to-cyan-500" />
          
          {/* Close Button */}
          <button
            id="close-auth-modal-btn"
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="absolute top-4 right-4 p-2 rounded-lg bg-[#0B1329] text-slate-400 hover:text-white hover:bg-slate-800 transition border border-slate-700"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>

          {currentUser ? (
            /* ================= LOGGED-IN USER PROFILE VIEW ================= */
            <div>
              <div className="flex items-center gap-3 pb-4 border-b border-slate-800 mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-emerald-500 shadow-md bg-slate-800 flex items-center justify-center">
                  <img 
                    src={currentUser.picture} 
                    alt={currentUser.name} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">{currentUser.name}</h3>
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" /> 
                      {currentUser.authProvider === 'phone' ? 'Kisan Mobile Verified' : 'Firebase Auth'}
                    </span>
                  </div>
                  <p className="text-xs text-emerald-300 font-mono">
                    {currentUser.authProvider === 'phone' ? (currentUser.phone || currentUser.email) : currentUser.email}
                  </p>
                </div>
              </div>

              {/* Notice of Active View Mode based on Role */}
              <div className={`p-3 rounded-xl border mb-4 text-xs ${
                currentUser.role === 'farmer'
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                  : 'bg-indigo-950/40 border-indigo-500/40 text-indigo-200'
              }`}>
                <div className="flex items-center gap-2 font-bold mb-1">
                  <Sparkles className="w-4 h-4" />
                  {currentUser.role === 'farmer' 
                    ? '🌾 Farmer Access: Crop Advisory Engine Only' 
                    : '📊 Full Access: Complete Meteorological & Agronomic Dashboard'}
                </div>
                <p className="text-[11px] opacity-90">
                  {currentUser.role === 'farmer'
                    ? 'You are accessing personalized sowing windows, soil moisture thresholds, and localized break monsoon alerts.'
                    : 'You have full access to all dashboards including S2S Teleconnections, Risk Maps, KVK Broadcast Consoles, and Model Validation.'}
                </p>
              </div>

              {/* Registered Phone Management (Crucial for Farmers) */}
              <div className="bg-[#0B1329] p-3 rounded-xl border border-slate-800 mb-4 space-y-2">
                <label className="text-[11px] font-semibold text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                    Registered Mobile for SMS & WhatsApp:
                  </span>
                  {phoneSaveSuccess && (
                    <span className="text-emerald-400 text-[10px] flex items-center gap-0.5">
                      <CheckCircle2 className="w-3 h-3" /> Saved!
                    </span>
                  )}
                </label>
                <div className="flex gap-2">
                  <input 
                    type="tel"
                    value={profilePhoneEdit}
                    onChange={(e) => setProfilePhoneEdit(e.target.value)}
                    placeholder="+91 98220 41289"
                    className="flex-1 bg-[#141E33] border border-slate-700 text-xs rounded-lg px-2.5 py-1.5 text-white font-mono focus:outline-none focus:border-emerald-400"
                  />
                  <button
                    type="button"
                    onClick={handleSaveProfilePhone}
                    disabled={isSavingProfilePhone}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition"
                  >
                    {isSavingProfilePhone ? 'Saving...' : 'Update'}
                  </button>
                </div>
                <p className="text-[10px] text-slate-400">
                  Used to dispatch localized Kharif rainfall advisories and break monsoon warnings.
                </p>
              </div>

              {/* Role Switcher in Profile */}
              <div className="mb-4">
                <label className="block text-[11px] font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Switch Account Persona</span>
                  {isUpdatingRole && <span className="text-indigo-400 text-[10px]">Updating...</span>}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleSwitchUserRole('farmer')}
                    className={`p-2 rounded-lg border text-left text-xs transition ${
                      currentUser.role === 'farmer'
                        ? 'bg-emerald-600/30 border-emerald-400 text-white font-bold shadow'
                        : 'bg-[#0B1329] border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    🌾 <span className="font-semibold">Farmer</span>
                    <p className="text-[10px] text-slate-400 mt-0.5">Crop Advisory Engine only</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSwitchUserRole('officer')}
                    className={`p-2 rounded-lg border text-left text-xs transition ${
                      currentUser.role === 'officer'
                        ? 'bg-indigo-600/30 border-indigo-400 text-white font-bold shadow'
                        : 'bg-[#0B1329] border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    🏢 <span className="font-semibold">KVK Officer</span>
                    <p className="text-[10px] text-slate-400 mt-0.5">Full dashboard access</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSwitchUserRole('scientist')}
                    className={`p-2 rounded-lg border text-left text-xs transition ${
                      currentUser.role === 'scientist'
                        ? 'bg-indigo-600/30 border-indigo-400 text-white font-bold shadow'
                        : 'bg-[#0B1329] border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    🔬 <span className="font-semibold">Scientist</span>
                    <p className="text-[10px] text-slate-400 mt-0.5">Full dashboard access</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSwitchUserRole('general')}
                    className={`p-2 rounded-lg border text-left text-xs transition ${
                      currentUser.role === 'general'
                        ? 'bg-indigo-600/30 border-indigo-400 text-white font-bold shadow'
                        : 'bg-[#0B1329] border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    👤 <span className="font-semibold">General User</span>
                    <p className="text-[10px] text-slate-400 mt-0.5">Full dashboard access</p>
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  id="sign-out-btn"
                  onClick={handleSignOut}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 font-semibold text-xs transition flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
                <button
                  id="close-profile-btn"
                  onClick={() => {
                    soundFx.playClick();
                    onClose();
                  }}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition shadow-md"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* ================= REGISTRATION & SIGN-IN MODES ================= */
            <div>
              <div className="flex items-center gap-3 pb-3 border-b border-slate-800 mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
                  <Sprout className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    MonsoonPulse Kisan Portal
                  </h3>
                  <p className="text-xs text-slate-400">
                    Kharif Sowing Forecasts & Hyperlocal Agrometeorology
                  </p>
                </div>
              </div>

              {/* Method Switcher Tabs */}
              <div className="grid grid-cols-3 gap-1 bg-[#0B1329] p-1 rounded-xl border border-slate-800 mb-4">
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    setAuthMethod('phone');
                    setSelectedRole('farmer');
                  }}
                  className={`py-2 px-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    authMethod === 'phone'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>📱 Phone</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    setAuthMethod('email');
                  }}
                  className={`py-2 px-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    authMethod === 'email'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>✉️ Email</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    setAuthMethod('google');
                  }}
                  className={`py-2 px-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    authMethod === 'google'
                      ? 'bg-slate-700 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>🌐 Google</span>
                </button>
              </div>

              {authError && (
                <div className="mb-3 p-2.5 bg-rose-950/40 border border-rose-500/40 rounded-lg text-rose-300 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}

              {showSuccess ? (
                <div className="py-8 flex flex-col items-center justify-center text-center space-y-2">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 animate-bounce" />
                  <h4 className="text-sm font-bold text-white">Registered Successfully!</h4>
                  <p className="text-xs text-emerald-300 font-mono">
                    🌾 Farmer View Activated (Crop Advisory Engine)
                  </p>
                </div>
              ) : (
                <div>
                  {/* ================= TAB 1: PHONE REGISTRATION (FARMER FOCUSED) ================= */}
                  {authMethod === 'phone' && (
                    <div className="space-y-3.5">
                      <div className="bg-emerald-950/25 border border-emerald-500/30 rounded-xl p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                            <Sprout className="w-4 h-4 text-emerald-400" />
                            Kisan Mobile Registration (शेतकरी नोंदणी)
                          </span>
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 font-mono">
                            Free SMS / WhatsApp
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300">
                          Register your mobile number to receive timely sowing dates, dry spell alerts, and crop advisories.
                        </p>
                      </div>

                      {otpStep === 'phone_entry' ? (
                        /* STEP 1: ENTER PHONE & DETAILS */
                        <form onSubmit={handleSendPhoneOtp} className="space-y-3">
                          {/* Phone Number */}
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                              Mobile Number (मोबाईल क्रमांक) <span className="text-rose-400">*</span>
                            </label>
                            <div className="flex gap-2">
                              <div className="px-2.5 py-2 bg-[#0B1329] border border-slate-700 rounded-lg text-xs font-mono font-bold text-slate-300 flex items-center gap-1 shrink-0">
                                <span>🇮🇳</span>
                                <span>+91</span>
                              </div>
                              <input
                                id="farmer-phone-input"
                                type="tel"
                                value={farmerPhone}
                                onChange={(e) => {
                                  setFarmerPhone(e.target.value);
                                  if (phoneError) setPhoneError(null);
                                }}
                                placeholder="98220 41289"
                                className={`flex-1 bg-[#0B1329] border ${phoneError ? 'border-rose-500' : 'border-slate-700 focus:border-emerald-500'} rounded-lg px-3 py-2 text-xs text-white focus:outline-none font-mono placeholder:text-slate-600`}
                              />
                            </div>
                            {phoneError && (
                              <p className="text-[11px] text-rose-400 mt-1 font-medium">{phoneError}</p>
                            )}
                          </div>

                          {/* Farmer Name */}
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                              Farmer Name (नाव) <span className="text-slate-500 font-normal">(Optional)</span>
                            </label>
                            <div className="relative">
                              <div className="absolute left-3 top-2.5 text-slate-500 pointer-events-none">
                                <User className="w-4 h-4" />
                              </div>
                              <input
                                id="farmer-name-input"
                                type="text"
                                value={farmerName}
                                onChange={(e) => setFarmerName(e.target.value)}
                                placeholder="Ramesh Patil"
                                className="w-full bg-[#0B1329] border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 placeholder:text-slate-600"
                              />
                            </div>
                          </div>

                          {/* State & District Selector */}
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                                State (राज्य)
                              </label>
                              <select
                                id="farmer-state-select"
                                value={selectedState}
                                onChange={(e) => setSelectedState(e.target.value)}
                                className="w-full bg-[#0B1329] border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                              >
                                {STATES.map(s => (
                                  <option key={s} value={s}>{s}</option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                                District (जिल्हा)
                              </label>
                              <select
                                id="farmer-district-select"
                                value={selectedDistrictId}
                                onChange={(e) => setSelectedDistrictId(e.target.value)}
                                className="w-full bg-[#0B1329] border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                              >
                                {availableDistricts.map(d => (
                                  <option key={d.id} value={d.id}>{d.name}</option>
                                ))}
                              </select>
                            </div>
                          </div>

                          {/* Primary Crop & Language */}
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                                Primary Crop (पीक)
                              </label>
                              <select
                                id="farmer-crop-select"
                                value={farmerCrop}
                                onChange={(e) => setFarmerCrop(e.target.value as CropId)}
                                className="w-full bg-[#0B1329] border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-emerald-300 font-medium focus:outline-none focus:border-emerald-500 cursor-pointer"
                              >
                                {Object.values(CROPS).map(c => (
                                  <option key={c.id} value={c.id}>
                                    {c.name} {c.nameMr ? `(${c.nameMr})` : c.nameHi ? `(${c.nameHi})` : ''}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                                Language (भाषा)
                              </label>
                              <select
                                id="farmer-phone-lang-select"
                                value={farmerLanguage}
                                onChange={(e) => setFarmerLanguage(e.target.value as Language)}
                                className="w-full bg-[#0B1329] border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-emerald-300 font-medium focus:outline-none focus:border-emerald-500 cursor-pointer"
                              >
                                {SUPPORTED_LANGUAGES.map(l => (
                                  <option key={l.code} value={l.code}>
                                    {l.nativeName}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          {/* Submit OTP Request */}
                          <button
                            id="send-phone-otp-btn"
                            type="submit"
                            className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 active:scale-[0.98] mt-2 cursor-pointer"
                          >
                            <Send className="w-4 h-4" />
                            <span>Send Kisan OTP (ओटीपी मिळवा)</span>
                          </button>
                        </form>
                      ) : (
                        /* STEP 2: VERIFY OTP */
                        <form onSubmit={handleVerifyPhoneAndRegister} className="space-y-3">
                          {/* Simulated SMS Alert Box */}
                          <div className="bg-[#0B1329] border border-emerald-500/40 rounded-xl p-3 space-y-1.5">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-emerald-400 font-bold flex items-center gap-1">
                                📩 Kisan SMS Gateway (mKisan)
                              </span>
                              <span className="text-slate-500 font-mono text-[10px]">Just now</span>
                            </div>
                            <p className="text-xs text-slate-200">
                              Your MonsoonPulse Kisan registration code is <strong className="text-emerald-300 font-mono text-sm tracking-wider">{generatedOtp}</strong>. Valid for 10 minutes.
                            </p>
                            <div className="pt-1 flex justify-end">
                              <button
                                type="button"
                                onClick={() => {
                                  soundFx.playClick();
                                  setEnteredOtp(generatedOtp);
                                  setOtpError(null);
                                }}
                                className="text-[11px] text-emerald-400 hover:text-emerald-300 font-bold underline underline-offset-2 flex items-center gap-1 cursor-pointer"
                              >
                                ⚡ 1-Click Auto-Fill Code ({generatedOtp})
                              </button>
                            </div>
                          </div>

                          {/* OTP Input */}
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                              Enter 6-Digit OTP Code
                            </label>
                            <div className="relative">
                              <div className="absolute left-3 top-2.5 text-slate-500 pointer-events-none">
                                <KeyRound className="w-4 h-4" />
                              </div>
                              <input
                                id="phone-otp-input"
                                type="text"
                                maxLength={6}
                                value={enteredOtp}
                                onChange={(e) => {
                                  setEnteredOtp(e.target.value.replace(/\D/g, ''));
                                  if (otpError) setOtpError(null);
                                }}
                                placeholder="e.g. 582914"
                                className="w-full bg-[#0B1329] border border-emerald-500/50 rounded-lg pl-9 pr-3 py-2 text-sm text-center tracking-widest text-emerald-300 font-mono font-bold focus:outline-none focus:border-emerald-400 placeholder:text-slate-600 placeholder:tracking-normal placeholder:font-normal"
                              />
                            </div>
                            {otpError && (
                              <p className="text-[11px] text-rose-400 mt-1 font-medium">{otpError}</p>
                            )}
                          </div>

                          <div className="flex gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => {
                                soundFx.playClick();
                                setOtpStep('phone_entry');
                              }}
                              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                            >
                              Edit Phone
                            </button>

                            <button
                              id="verify-phone-register-btn"
                              type="submit"
                              disabled={isSubmitting}
                              className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              <span>{isSubmitting ? 'Registering...' : 'Verify & Register Farmer (नोंदणी पूर्ण करा)'}</span>
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  )}

                  {/* ================= TAB 2: EMAIL SIGN-IN ================= */}
                  {authMethod === 'email' && (
                    <form onSubmit={handleDirectSignIn} className="space-y-3">
                      {/* Role selection */}
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">
                          Select Persona Role
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              soundFx.playClick();
                              setSelectedRole('farmer');
                            }}
                            className={`p-2 rounded-lg border text-left text-xs transition ${
                              selectedRole === 'farmer' 
                                ? 'bg-emerald-600/30 border-emerald-400 text-white font-bold' 
                                : 'bg-[#0B1329] border-slate-800 text-slate-400'
                            }`}
                          >
                            🌾 <span>Farmer</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              soundFx.playClick();
                              setSelectedRole('officer');
                            }}
                            className={`p-2 rounded-lg border text-left text-xs transition ${
                              selectedRole === 'officer' 
                                ? 'bg-indigo-600/30 border-indigo-400 text-white font-bold' 
                                : 'bg-[#0B1329] border-slate-800 text-slate-400'
                            }`}
                          >
                            🏢 <span>KVK Officer</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              soundFx.playClick();
                              setSelectedRole('scientist');
                            }}
                            className={`p-2 rounded-lg border text-left text-xs transition ${
                              selectedRole === 'scientist' 
                                ? 'bg-indigo-600/30 border-indigo-400 text-white font-bold' 
                                : 'bg-[#0B1329] border-slate-800 text-slate-400'
                            }`}
                          >
                            🔬 <span>Scientist</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              soundFx.playClick();
                              setSelectedRole('general');
                            }}
                            className={`p-2 rounded-lg border text-left text-xs transition ${
                              selectedRole === 'general' 
                                ? 'bg-indigo-600/30 border-indigo-400 text-white font-bold' 
                                : 'bg-[#0B1329] border-slate-800 text-slate-400'
                            }`}
                          >
                            👤 <span>General User</span>
                          </button>
                        </div>
                      </div>

                      {/* Email input */}
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                          Email Address <span className="text-rose-400">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute left-3 top-2.5 text-slate-500 pointer-events-none">
                            <Mail className="w-4 h-4" />
                          </div>
                          <input
                            id="auth-email-input"
                            type="email"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              if (emailError) setEmailError(null);
                              if (e.target.value.includes('@') && !fullName) {
                                setFullName(deriveNameFromEmail(e.target.value));
                              }
                            }}
                            className={`w-full bg-[#0B1329] border ${emailError ? 'border-rose-500' : 'border-slate-700 focus:border-indigo-500'} rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none font-mono placeholder:text-slate-600`}
                            placeholder="officer@icar.gov.in"
                          />
                        </div>
                        {emailError && (
                          <p className="text-[11px] text-rose-400 mt-1 font-medium">{emailError}</p>
                        )}
                      </div>

                      {/* Name input */}
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                          Full Name
                        </label>
                        <div className="relative">
                          <div className="absolute left-3 top-2.5 text-slate-500 pointer-events-none">
                            <User className="w-4 h-4" />
                          </div>
                          <input
                            id="auth-name-input"
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full bg-[#0B1329] border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 placeholder:text-slate-600"
                            placeholder="Dr. S. K. Deshmukh"
                          />
                        </div>
                      </div>

                      {/* State */}
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                          State
                        </label>
                        <select
                          id="auth-state-select"
                          value={selectedState}
                          onChange={(e) => setSelectedState(e.target.value)}
                          className="w-full bg-[#0B1329] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                        >
                          {STATES.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>

                      <button
                        id="signin-submit-btn"
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
                      >
                        <LogIn className="w-4 h-4" />
                        <span>{isSubmitting ? 'Signing in...' : 'Sign In with Email'}</span>
                      </button>
                    </form>
                  )}

                  {/* ================= TAB 3: GOOGLE SIGN-IN ================= */}
                  {authMethod === 'google' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">
                          Select Role Before Google Login
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedRole('farmer')}
                            className={`p-2 rounded-lg border text-left text-xs transition ${
                              selectedRole === 'farmer' 
                                ? 'bg-emerald-600/30 border-emerald-400 text-white font-bold' 
                                : 'bg-[#0B1329] border-slate-800 text-slate-400'
                            }`}
                          >
                            🌾 <span>Farmer</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedRole('officer')}
                            className={`p-2 rounded-lg border text-left text-xs transition ${
                              selectedRole === 'officer' 
                                ? 'bg-indigo-600/30 border-indigo-400 text-white font-bold' 
                                : 'bg-[#0B1329] border-slate-800 text-slate-400'
                            }`}
                          >
                            🏢 <span>KVK Officer</span>
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                          Primary State
                        </label>
                        <select
                          value={selectedState}
                          onChange={(e) => setSelectedState(e.target.value)}
                          className="w-full bg-[#0B1329] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                        >
                          {STATES.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>

                      <button
                        id="firebase-google-login-btn"
                        type="button"
                        disabled={isGoogleLoading}
                        onClick={handleFirebaseGoogleSignIn}
                        className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-xs shadow-md transition flex items-center justify-center gap-2.5 border border-slate-200 active:scale-[0.98] cursor-pointer mt-2"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                          <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                          <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.02 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                          <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                        </svg>
                        <span>
                          {isGoogleLoading ? 'Connecting to Google...' : `Sign In with Google as ${selectedRole === 'farmer' ? 'Farmer' : 'Officer'}`}
                        </span>
                      </button>
                    </div>
                  )}

                  {/* Guest Access Link */}
                  <div className="pt-3 text-center">
                    <button
                      id="skip-auth-guest-btn"
                      type="button"
                      onClick={() => {
                        soundFx.playClick();
                        onClose();
                      }}
                      className="text-xs text-slate-400 hover:text-emerald-400 transition underline underline-offset-4 py-1 cursor-pointer"
                    >
                      Continue as Guest (Preview Full System)
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
