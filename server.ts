import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Lazy initialization for Google GenAI client to prevent startup crashes when GEMINI_API_KEY is not set
  let geminiClient: GoogleGenAI | null = null;
  function getGemini(): GoogleGenAI | null {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key.trim() === "" || key === "MY_GEMINI_API_KEY") {
      return null;
    }
    if (!geminiClient) {
      geminiClient = new GoogleGenAI({ apiKey: key });
    }
    return geminiClient;
  }

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // Check Gemini API status
  app.get("/api/gemini/status", (_req, res) => {
    const key = process.env.GEMINI_API_KEY;
    const isConfigured = !!(key && key.trim() !== "" && key !== "MY_GEMINI_API_KEY");
    res.json({
      configured: isConfigured,
      model: "gemini-3.1-flash-lite",
      status: isConfigured ? "ready" : "key_missing"
    });
  });

  // Scientific agrometeorology advisory generator for offline / high-demand resilience
  function generateScientificAdvisory(params: {
    blockName?: string;
    districtName?: string;
    stateName?: string;
    cropName?: string;
    stage?: string;
    forecast?: any;
    language?: string;
    question?: string;
  }) {
    const { blockName = 'District', districtName = 'Region', cropName = 'Kharif Crop', forecast, language = 'en' } = params;
    const breakRisk = forecast?.breakRiskPct ?? 25;
    const heavyRain = forecast?.heavyRainRiskPct ?? 15;
    const deficit = forecast?.soilMoistureDeficitPct ?? 20;
    const p90 = forecast?.projectedWeeklyRainfallMm?.p90 ?? 60;
    const expectedDate = forecast?.expectedOnsetDate ?? 'mid-June';

    const isDelay = breakRisk > 35 || deficit > 35;
    const isDrainage = heavyRain > 40;

    if (language === 'mr') {
      const verdict = isDelay
        ? '🔴 पेरणी थांबवा (DELAY SOWING) - पाऊस खंड पडण्याचा धोका अधिक'
        : isDrainage
        ? '🟠 निचरा व्यवस्था करा (DRAINAGE PREPARATION) - अतिवृष्टीचा इशारा'
        : '🟢 पुरेशा पावसानंतरच पेरणी करा (PROCEED AFTER 75-100mm RAIN)';

      return `### 🌾 मान्सूनपल्स कृषी हवामान सल्ला (${cropName} - ${districtName}, ${blockName})\n\n**निर्णय:** ${verdict}\n\n**महत्त्वाच्या शिफारशी (ICAR & IMD मानके):**\n- **पेरणीची वेळ व ओलावा निकष**: जमिनीत किमान ७५ ते १०० मिमी दमदार पाऊस पडून १५ सेमी खोलीपर्यंत योग्य वाफसा आल्याशिवाय धुळवाफ पेरणी करू नका. सध्या पाऊस खंड पडण्याचा अंदाज ${breakRisk}% आहे.\n- **ओलावा संवर्धन तंत्रज्ञान**: पाऊस लहरी असल्यामुळे रुंद चर व सरी (BBF - Broad Bed Furrow) पद्धतीचा वापर करा. यामुळे अतिवृष्टीच्या काळात (${p90} मिमी) अतिरिक्त पाण्याचा निचरा होईल आणि पावसाच्या खंडाच्या काळात ओलावा टिकून राहील.\n- **बीजप्रक्रिया व वाण निवड**: ट्रायकोडर्मा (५ ग्रॅम/किलो) व रायझोबियमची बीजप्रक्रिया आवर्जून करा. मान्सून लांबल्यास (${expectedDate} नंतर) कमी कालावधीत येणाऱ्या दुष्काळ-सहनशील वाणांची निवड करा.\n- **खत व पाणी व्यवस्थापन**: कोरडवाहू क्षेत्रात नत्र खतांचा पहिला हप्ता पेरणीच्या वेळी द्यावा; पावसाचा खंड पडल्यास पोटॅश व सिलिकॉनची फवारणी करून रोपांचे बाष्पीभवन रोखा.`;
    }

    if (language === 'hi') {
      const verdict = isDelay
        ? '🔴 बुवाई स्थगित करें (DELAY SOWING) - मानसून में लंबे अंतराल का जोखिम'
        : isDrainage
        ? '🟠 जल निकासी की तैयारी (DRAINAGE PREPARATION) - भारी वर्षा की संभावना'
        : '🟢 75-100 मिमी वर्षा के बाद ही बुवाई करें (PROCEED AFTER 75-100mm RAIN)';

      return `### 🌾 मानसूनपल्स वैज्ञानिक कृषि परामर्श (${cropName} - ${districtName}, ${blockName})\n\n**फैसला:** ${verdict}\n\n**प्रमुख कृषि-मौसम सिफारिशें (ICAR व IMD मानक):**\n- **बुवाई का समय एवं नमी मानक**: जब तक खेत में 75 से 100 मिमी अच्छी बारिश न हो जाए और मिट्टी में 15 सेमी गहराई तक पर्याप्त नमी न पहुंचे, तब तक धूल बुवाई न करें। शुष्क दौर (Dry Spell) का जोखिम ${breakRisk}% है।\n- **नमी संरक्षण तकनीक**: ब्रॉड बेड फरो (BBF) या मेड़-नाली विधि अपनाएं। यह संभावित भारी वर्षा (${p90} मिमी) में जल निकासी सुनिश्चित करेगा और सूखे के समय मिट्टी की नमी को संरक्षित रखेगा।\n- **बीजोपचार एवं आकस्मिक किस्में**: ट्राइकोडर्मा और राइजोबियम से बीजोपचार अवश्य करें। यदि मानसून आगमन ${expectedDate} से अधिक विलंबित होता है, तो कम अवधि वाली सूखा-सहनशील किस्मों का चयन करें।\n- **पोषक तत्व रणनीति**: प्रारंभिक अवस्था में संतुलित NPK दें। वर्षा में 7+ दिनों का व्यवधान होने पर पोटेशियम नाइट्रेट (1%) का पर्णीय छिड़काव करें।`;
    }

    // Default English
    const verdict = isDelay
      ? '🔴 DELAY SOWING - High Break-Monsoon Dry Spell Risk'
      : isDrainage
      ? '🟠 DRAINAGE PREPARATION - Heavy Rainfall Surge Expected'
      : '🟢 PROCEED CAUTIOUSLY AFTER 75-100mm SOAKING RAIN';

    return `### 🌾 MonsoonPulse Scientific Agronomic Advisory (${cropName} - ${districtName}, ${blockName})\n\n**Verdict:** ${verdict}\n\n**Key Operational Guidelines (ICAR & IMD Agrometeorology Standards):**\n- **Sowing Rule & Soil Moisture Threshold**: Do not attempt premature or dust-sowing until cumulative rainfall crosses 75-100 mm with wetting depth reaching 15+ cm. Current break-monsoon risk is calibrated at ${breakRisk}%.\n- **Moisture Conservation & Drainage**: Implement Broad Bed Furrow (BBF) ridges or ridge-and-furrow planting. This dual-purpose strategy channels excess surge rainfall (${p90} mm) into farm ponds while preventing seedling desiccation during dry spells.\n- **Seed Treatment & Contingency Varieties**: Treat seeds with Trichoderma viride (5g/kg) and Rhizobium/Azotobacter. If monsoon onset is delayed beyond ${expectedDate}, switch to short-duration, drought-tolerant certified seed varieties.\n- **Microclimate & Stress Mitigation**: For dry intervals exceeding 5-7 days post-emergence, apply 1% potassium nitrate or brassinolide foliar spray to minimize stomatal transpiration and protect seedling vigor.`;
  }

  // Interactive Gemini Agro-Meteorologist Advisory endpoint
  app.post("/api/gemini/advisory", async (req, res) => {
    const { blockName, districtName, stateName, cropName, stage, forecast, language, question } = req.body || {};
    try {
      const ai = getGemini();

      if (!ai) {
        return res.json({
          source: "offline_engine",
          configured: false,
          answer: generateScientificAdvisory({ blockName, districtName, stateName, cropName, stage, forecast, language, question })
        });
      }

      const langMap: Record<string, string> = {
        mr: "Marathi (मराठी)",
        hi: "Hindi (हिंदी)",
        te: "Telugu (తెలుగు)",
        kn: "Kannada (ಕನ್ನಡ)",
        gu: "Gujarati (ગુજરાતી)",
        ta: "Tamil (தமிழ்)",
        bn: "Bengali (বাংলা)",
        pa: "Punjabi (ਪੰਜਾਬੀ)",
        or: "Odia (ଓଡ଼ିଆ)",
        ml: "Malayalam (മലയാളം)",
        ur: "Urdu (اردو)",
        as: "Assamese (অसमীয়া)",
        en: "English"
      };
      const requestedLangName = langMap[language] || "English";

      const prompt = `You are MonsoonPulse AI, an expert Senior Agro-Meteorologist and ICAR-certified Extension Scientist specialized in Indian Kharif monsoon dynamics, probabilistic S2S forecasts, and district-level crop advisory.

Current Farm Profile & Hyperlocal Weather:
- Location: ${blockName || 'Block'}, ${districtName || 'District'}, ${stateName || 'India'}
- Target Kharif Crop: ${cropName || 'Kharif Crop'}
- Crop Growth Stage: ${stage || 'Sowing Window'}
- Probabilistic Monsoon Parameters:
  * Expected Onset Date: ${forecast?.expectedOnsetDate || 'June 10-15'}
  * Onset Shift: ${forecast?.onsetDelayShiftDays > 0 ? `+${forecast.onsetDelayShiftDays} days DELAY` : forecast?.onsetDelayShiftDays < 0 ? `${forecast.onsetDelayShiftDays} days early` : 'Normal on-time'}
  * Break-Monsoon (Dry Spell) Risk: ${forecast?.breakRiskPct || 25}% (Expected Duration: ~${forecast?.breakDurationExpectedDays || 4} days)
  * Heavy Rainfall Risk: ${forecast?.heavyRainRiskPct || 15}%
  * Topsoil Moisture Deficit: ${forecast?.soilMoistureDeficitPct || 20}%
  * Weekly Rain Projection: P10 (Dry)=${forecast?.projectedWeeklyRainfallMm?.p10 || 5}mm, P50 (Median)=${forecast?.projectedWeeklyRainfallMm?.p50 || 30}mm, P90 (Surge)=${forecast?.projectedWeeklyRainfallMm?.p90 || 75}mm
  * Model Confidence: ${forecast?.modelConfidenceScorePct || 85}%

User / Extension Question:
${question ? `"${question}"` : `Provide an actionable, comprehensive scientific agronomic advisory for this farmer's block.`}

Output Language: Respond strictly in ${requestedLangName}.
Tone & Formatting:
1. Begin with a clear 1-line traffic light verdict: [🟢 PROCEED / 🟡 CAUTION - IRRIGATE FIRST / 🔴 DELAY SOWING / 🟠 DRAINAGE PREPARATION].
2. Provide 3-4 concise, highly practical bullet points:
   - Specific Sowing Timing & Soil Moisture Rule (e.g. 75-100mm cumulative soaking threshold)
   - Moisture Conservation Technique (Broad Bed Furrow, contour ploughing, mulching, farm pond reserve)
   - Seed Treatment & Contingency (Trichoderma/Rhizobium, short-duration drought-tolerant varieties)
3. Direct, farmer-friendly terminology (सरल आणि स्पष्ट भाषा). No generic fillers.`;

      // Candidate models prioritized by speed, availability and quota resilience
      // gemini-3.1-flash-lite has high availability & low latency during peak traffic
      const candidateModels = [
        "gemini-3.1-flash-lite",
        "gemini-3.6-flash",
        "gemini-3.8-flash",
        "gemini-flash-latest"
      ];

      let responseText = "";
      let modelUsed = candidateModels[0];

      for (const modelCandidate of candidateModels) {
        try {
          const response = await ai.models.generateContent({
            model: modelCandidate,
            contents: prompt
          });
          if (response && response.text) {
            responseText = response.text;
            modelUsed = modelCandidate;
            break;
          }
        } catch (geminiErr: any) {
          const errMsg = geminiErr?.message || "";
          
          // Check for quota exceeded or rate limit
          if (errMsg.includes("resource_exhausted") || errMsg.includes("quota") || errMsg.includes("rate-limits")) {
            return res.json({
              source: "offline_fallback_quota",
              configured: true,
              warning: "Your Gemini API Key has exceeded its hourly/daily quota on Google AI Studio.",
              answer: generateScientificAdvisory({ blockName, districtName, stateName, cropName, stage, forecast, language, question })
            });
          }
          // For 503 / temporary high demand spikes, smoothly attempt the next model
          continue;
        }
      }

      // If all live models are experiencing temporary upstream high demand (503),
      // seamlessly return the ICAR/IMD agrometeorology advisory without erroring
      if (!responseText) {
        return res.json({
          source: "icar_imd_agrometeorology_engine",
          configured: true,
          notice: "Live Gemini models are experiencing temporary high traffic. Activated ICAR-calibrated agrometeorology engine.",
          answer: generateScientificAdvisory({ blockName, districtName, stateName, cropName, stage, forecast, language, question })
        });
      }

      return res.json({
        source: modelUsed,
        configured: true,
        answer: responseText
      });
    } catch {
      // Graceful fallback for unexpected exceptions
      return res.status(200).json({
        source: "offline_engine",
        configured: false,
        answer: generateScientificAdvisory({ blockName, districtName, stateName, cropName, stage, forecast, language, question })
      });
    }
  });

  // Vite middleware in development; static serve in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
