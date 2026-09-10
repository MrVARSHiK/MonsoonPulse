# 🌧️ MonsoonPulse

**Hyperlocal Monsoon Onset & Break Prediction System (Block/Village Scale)**

> Built for Smart India Hackathon 2026 — Problem Statement #26086  
> Organization: Ministry of Earth Sciences (MoES) | Department: NCMRWF  
> Theme: Agriculture, FoodTech & Rural Development

## The Problem

Millions of Kharif farmers make sowing decisions based on monsoon forecasts that 
are accurate at the state/subdivision level but meaningless at the village level. 
When a farmer sows during a **false onset** — a few days of early rain followed by 
a 2–3 week dry spell (a "break-monsoon" phase) — the crop fails from moisture 
stress, causing devastating financial loss. Existing forecasts lack the spatial 
and temporal granularity to warn against this.

## What MonsoonPulse Does

MonsoonPulse ingests global climate teleconnection signals — **ENSO** (El Niño-
Southern Oscillation), **IOD** (Indian Ocean Dipole), and **MJO** (Madden-Julian 
Oscillation) — and downscales them using a **hybrid empirical Bayesian + ML model** 
to produce **7-to-30-day probabilistic forecasts** of monsoon onset, break-phase, 
and heavy-rainfall risk at **block and panchayat scale**.

These probabilities are converted by a rule-based **crop advisory engine** into 
clear, crop-specific guidance (e.g., "delay cotton sowing 10 days") and delivered 
directly to farmers via a mobile-optimized web app, WhatsApp, and SMS — in 
regional Indian languages, reaching farmers regardless of smartphone access.

## Key Features

- 🗺️ **Dynamic risk maps** — color-coded onset/break/heavy-rain probability at 
  block/panchayat resolution, across 1–4 week forecast horizons
- 🌍 **Real-time teleconnection analyzer** — live ENSO/IOD/MJO/SST monitoring
- 🌾 **Crop-specific advisory engine** — sowing/irrigation guidance tailored to 
  each crop's sensitivity window
- ⚠️ **False Onset Alarm** — dedicated early-warning module for the system's core 
  failure scenario
- 📱 **Multi-channel delivery** — web dashboard, WhatsApp, SMS, in regional 
  languages, built for low-bandwidth rural connectivity
- 👥 **KVK/Extension Officer dashboard** — bulk risk monitoring and advisory 
  broadcast across all blocks in a district
- ✅ **Backtest & validation panel** — model performance replayed against real 
  historical false-onset years, for transparency and trust

## Tech Stack

**Frontend:** Next.js (React), Tailwind CSS, Recharts, Leaflet.js, Mapbox GL  
**Backend:** Node.js, Express.js, REST API, Cron Jobs, Redis  
**AI/ML:** Google Vertex AI, AutoML, Gemini API, custom Bayesian downscaling model  
**Data:** BigQuery, Firestore, Cloud Storage, Cloud Functions  
**External Data Sources:** NOAA, NASA, IMD, ECMWF (ERA5), Copernicus, JAXA, NCMRWF

## Team

**Team ID:** 179 | **Team Name:** BATTALION

## References

- IMD — [mausam.imd.gov.in](https://mausam.imd.gov.in)
- IITM Pune (Monsoon Mission) — [tropmet.res.in](https://www.tropmet.res.in)
- NOAA Climate Prediction Center — [cpc.ncep.noaa.gov](https://www.cpc.ncep.noaa.gov)
- Digital Agriculture Mission — [agricoop.gov.in](https://agricoop.gov.in)
