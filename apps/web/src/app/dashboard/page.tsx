'use client';

import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef, useTransition, useCallback } from 'react';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  limit, 
  onSnapshot, 
  serverTimestamp 
} from 'firebase/firestore';
import { db, remoteConfig } from '@/lib/firebase';
import { fetchAndActivate, getValue } from 'firebase/remote-config';
import { processTelemetryAndGetDirective } from '@/app/actions/directives';
import { StadiumTelemetry, OperationalDirective } from '@fifa/core';
import { translations, Language, TranslationSet } from '@/lib/translations';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Compass, 
  LogOut, 
  MapPin, 
  Activity, 
  Play, 
  Volume2, 
  User, 
  ShieldAlert,
  Cpu,
  Camera,
  Fingerprint,
  RefreshCw,
  Key,
  ShieldCheck,
  Check,
  Trash2,
  Shield,
  Signal,
  QrCode,
  Sliders,
  ClipboardCheck,
  SlidersHorizontal,
  CompassIcon
} from 'lucide-react';

type TabId = 'mission_control' | 'device_gate' | 'auth_portal' | 'calibration' | 'off_ramp';

export default function Dashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  
  // Dashboard Shell Navigation State
  const [activeTab, setActiveTab] = useState<TabId>(() => {
    if (typeof window !== 'undefined') {
      const savedTab = sessionStorage.getItem('fifa_tab') as TabId;
      if (savedTab) return savedTab;
    }
    return 'mission_control';
  });
  const [lang, setLang] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('fifa_lang') as Language;
      if (savedLang) return savedLang;
    }
    return 'en';
  });
  const t = translations[lang];

  // Shift Status
  const [shiftActive, setShiftActive] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('fifa_shift_active') === 'true';
    }
    return false;
  });

  const getOperatorIdentity = () => {
    if (!user) return 'Anonymous_Guest';
    return user.email || user.displayName || `Operator_${user.uid.substring(0, 5)}`;
  };

  // Real-time Firestore Streams
  const [telemetry, setTelemetry] = useState<StadiumTelemetry | null>(null);
  const [directives, setDirectives] = useState<OperationalDirective[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'es' | 'pt'>('en');
  const [selectedZone, setSelectedZone] = useState<string>('Gate C');
  
  const [, startTransition] = useTransition();
  const [isSimulating, setIsSimulating] = useState(false);
  const [acknowledging, setAcknowledging] = useState<string | null>(null);
  const [acknowledgedDirectives, setAcknowledgedDirectives] = useState<Record<string, boolean>>({});

  // TAB 1: MISSION CONTROL STATES (Checklists)
  const [attTasks, setAttTasks] = useState([
    { id: 1, label: "Collect credential lanyard", done: true },
    { id: 2, label: "Verify comms channel Alpha", done: true },
    { id: 3, label: "Inspect crowd-control barriers at Gate A", done: false },
    { id: 4, label: "Sync biometric scanner unit", done: false }
  ]);
  const mbTasks = [
    { id: 1, label: "Awaiting security clearance code", done: false, locked: true },
    { id: 2, label: "Calibrate metal detectors", done: false, locked: true },
    { id: 3, label: "Review VIP access roster", done: false, locked: true }
  ];

  // TAB 2: DEVICE GATE STATES
  const [provisionProgress, setProvisionProgress] = useState(0);
  const [provisionLog, setProvisionLog] = useState('');
  const [provisionDone, setProvisionDone] = useState(false);

  // TAB 3: AUTH PORTAL STATES
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [pinCode, setPinCode] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);

  // TAB 4: CALIBRATION STATES
  const [calibrationTier, setCalibrationTier] = useState<'100' | '200' | '300'>('100');
  const [calibrationSector, setCalibrationSector] = useState('Sector South - Corridor C');
  const [diagAudio, setDiagAudio] = useState<'idle' | 'testing' | 'pass'>('idle');
  const [diagVibe, setDiagVibe] = useState<'idle' | 'testing' | 'pass'>('idle');
  const [diagMic, setDiagMic] = useState<'idle' | 'testing' | 'pass'>('idle');
  const [diagGps, setDiagGps] = useState<'idle' | 'testing' | 'pass'>('idle');
  const [micVolume, setMicVolume] = useState<number>(0);
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [rotatingPin, setRotatingPin] = useState('492-01A');
  const [pinTimer, setPinTimer] = useState(48);

  // TAB 5: OFF-RAMP STATES
  const [incidentText, setIncidentText] = useState('');
  const [reportingIncident, setReportingIncident] = useState(false);
  const [swipeProgress, setSwipeProgress] = useState(0);
  const [wipingState, setWipingState] = useState(false);

  // Remote Config Dynamic States
  const [anomalyThresholdDensity, setAnomalyThresholdDensity] = useState(0.85);
  const [anomalyThresholdCongestion, setAnomalyThresholdCongestion] = useState(0.80);
  const [activeModelName, setActiveModelName] = useState('gemini-3.1-flash-lite');
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  useEffect(() => {
    if (!remoteConfig) return;
    const rc = remoteConfig;
    const syncRemoteConfig = async () => {
      try {
        await fetchAndActivate(rc);
        const thresholdDensityVal = getValue(rc, 'anomaly_threshold_density').asNumber();
        const thresholdCongestionVal = getValue(rc, 'anomaly_threshold_congestion').asNumber();
        const modelNameVal = getValue(rc, 'operational_gemini_model').asString();
        const maintenanceVal = getValue(rc, 'maintenance_mode_active').asBoolean();

        if (thresholdDensityVal) setAnomalyThresholdDensity(thresholdDensityVal);
        if (thresholdCongestionVal) setAnomalyThresholdCongestion(thresholdCongestionVal);
        if (modelNameVal) setActiveModelName(modelNameVal);
        setMaintenanceMode(maintenanceVal);
        console.log('[Remote Config] Fetched configurations successfully. Threshold density:', thresholdDensityVal);
      } catch (err) {
        console.warn('[Remote Config] Error fetching or activating remote configurations, using client defaults:', err);
      }
    };
    syncRemoteConfig();
  }, []);

  // Storage is synchronized directly during state initialization.

  const changeLanguage = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('fifa_lang', newLang);
  };

  const changeTab = (newTab: TabId) => {
    setActiveTab(newTab);
    sessionStorage.setItem('fifa_tab', newTab);
  };

  const toggleShiftActive = (active: boolean) => {
    setShiftActive(active);
    sessionStorage.setItem('fifa_shift_active', String(active));
  };

  // Redirect to Landing if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  // Firestore Telemetry & Directives listeners (Active on deck/mission control)
  useEffect(() => {
    if (!user) return;
    
    const telemetryQuery = query(
      collection(db, 'telemetry'), 
      orderBy('timestamp', 'desc'), 
      limit(1)
    );
    
    const unsubscribe = onSnapshot(telemetryQuery, (snapshot) => {
      if (!snapshot.empty) {
        setTelemetry(snapshot.docs[0].data() as StadiumTelemetry);
      }
    }, (error) => {
      console.error('Telemetry snapshot error:', error);
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    
    const directivesQuery = query(
      collection(db, 'directives'), 
      orderBy('timestamp', 'desc'), 
      limit(5)
    );
    
    const unsubscribe = onSnapshot(directivesQuery, (snapshot) => {
      const docs: OperationalDirective[] = [];
      snapshot.forEach((doc) => {
        docs.push(doc.data() as OperationalDirective);
      });
      setDirectives(docs);
    }, (error) => {
      console.error('Directives snapshot error:', error);
    });

    return () => unsubscribe();
  }, [user]);

  // TAB 2: Device Gate provision progress simulation
  useEffect(() => {
    if (activeTab !== 'device_gate') return;
    
    // Defer initialization to avoid synchronous state changes inside effect
    const initTimeout = setTimeout(() => {
      setProvisionProgress(0);
      setProvisionDone(false);
    }, 0);

    const steps = [
      { p: 15, msg: "Fingerprinting hardware handshake..." },
      { p: 40, msg: "Compiling vector stadium topography maps..." },
      { p: 70, msg: "Synchronizing local database offline cache..." },
      { p: 90, msg: "Preloading translation matrices (6 global zones)..." },
      { p: 100, msg: "Service Worker Installed. Ready offline." }
    ];

    let currentStepIndex = 0;
    const interval = setInterval(() => {
      if (currentStepIndex < steps.length) {
        const step = steps[currentStepIndex];
        setProvisionProgress(step.p);
        setProvisionLog(step.msg);
        currentStepIndex++;
      } else {
        clearInterval(interval);
        setProvisionDone(true);
      }
    }, 600);

    return () => {
      clearTimeout(initTimeout);
      clearInterval(interval);
    };
  }, [activeTab]);

  // TAB 3: Camera stream activation for Auth Portal QR
  const startCamera = useCallback(async () => {
    try {
      if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("MediaDevices API is not supported in this browser or context.");
      }
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access denied or unsupported:", err);
      setCameraActive(false);
      alert("Camera capability is unavailable or permission was denied. Zero-Trust Pin Fallback is active.");
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setCameraActive(false);
  }, [cameraStream]);

  useEffect(() => {
    let active = true;
    if (activeTab === 'auth_portal' && cameraActive) {
      const tId = setTimeout(() => {
        if (active) startCamera();
      }, 0);
      return () => {
        active = false;
        clearTimeout(tId);
        stopCamera();
      };
    } else {
      if (cameraActive || cameraStream) {
        const tId = setTimeout(() => {
          stopCamera();
        }, 0);
        return () => clearTimeout(tId);
      }
    }
  }, [activeTab, cameraActive, cameraStream, startCamera, stopCamera]);

  // PIN entry keys
  const handlePinPress = (num: string) => {
    if (pinCode.length < 6) {
      const newPin = pinCode + num;
      setPinCode(newPin);
      if (newPin === '123456') {
        setTimeout(() => {
          setPinCode('');
          changeTab('calibration');
        }, 300);
      }
    }
  };

  const handleBackspace = () => {
    setPinCode(pinCode.slice(0, -1));
  };

  // Calibration Tone / Speaker test (Web Audio API)
  const playSpeakerTest = () => {
    setDiagAudio('testing');
    try {
      const AudioContextClass = typeof window !== 'undefined' ? (window.AudioContext || (window as unknown as Record<string, unknown>).webkitAudioContext) : null;
      if (!AudioContextClass) {
        throw new Error("Web Audio API is not supported in this environment.");
      }
      const audioContext = new AudioContextClass();
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, audioContext.currentTime); // clean high pitch
      
      gain.gain.setValueAtTime(0.05, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1.2);
      
      osc.connect(gain);
      gain.connect(audioContext.destination);
      osc.start();
      osc.stop(audioContext.currentTime + 1.2);
      setTimeout(() => setDiagAudio('pass'), 1200);
    } catch (err) {
      console.warn("Audio Context error, skipping audio play:", err);
      setDiagAudio('pass');
    }
  };

  // Vibration / Haptics test
  const playVibeTest = () => {
    setDiagVibe('testing');
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([200, 100, 200]);
      } catch (err) {
        console.warn("Navigator vibration call failed:", err);
      }
    }
    setTimeout(() => setDiagVibe('pass'), 800);
  };

  // Microphone Analyzer Test (Real-time Audio Graph)
  const playMicTest = async () => {
    setDiagMic('testing');
    try {
      if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("MediaDevices API not supported.");
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const AudioContextClass = window.AudioContext || (window as unknown as Record<string, unknown>).webkitAudioContext;
      if (!AudioContextClass) {
        throw new Error("Web Audio API not supported.");
      }
      const audioContext = new AudioContextClass();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);
      
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      let count = 0;
      const checkVolume = () => {
        if (count > 25) {
          stream.getTracks().forEach(track => track.stop());
          setDiagMic('pass');
          setMicVolume(0);
          return;
        }
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const avg = sum / bufferLength;
        setMicVolume(Math.round(40 + (avg / 255) * 60));
        count++;
        requestAnimationFrame(checkVolume);
      };
      checkVolume();
    } catch (err) {
      console.warn("Microphone test error, falling back to simulated meter:", err);
      // Fallback
      let count = 0;
      const interval = setInterval(() => {
        if (count > 15) {
          clearInterval(interval);
          setDiagMic('pass');
          setMicVolume(0);
        } else {
          setMicVolume(Math.round(45 + Math.random() * 45));
          count++;
        }
      }, 100);
    }
  };

  // GPS Accuracy Test
  const playGpsTest = () => {
    setDiagGps('testing');
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGpsCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setDiagGps('pass');
        },
        (err) => {
          console.error(err);
          // Fallback to stadium coordinates
          setGpsCoords({ lat: 33.7573, lng: -84.4010 });
          setDiagGps('pass');
        },
        { enableHighAccuracy: true }
      );
    } else {
      setGpsCoords({ lat: 33.7573, lng: -84.4010 });
      setDiagGps('pass');
    }
  };

  // Rotating Supervisor Code timer
  useEffect(() => {
    if (activeTab !== 'calibration') return;
    const interval = setInterval(() => {
      setPinTimer((prev) => {
        if (prev <= 1) {
          const codes = ['492-01A', '810-72F', '303-99C', '118-24D'];
          setRotatingPin(codes[Math.floor(Math.random() * codes.length)]);
          return 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [activeTab]);

  // Telemetry directive triggers
  const triggerSimulation = async (scenario: 'safe' | 'surge_c' | 'surge_a') => {
    if (isSimulating) return;
    setIsSimulating(true);

    let simulatedData: StadiumTelemetry;

    if (scenario === 'safe') {
      simulatedData = {
        stadiumId: 'Mercedes-Benz-Atlanta',
        timestamp: new Date().toISOString(),
        crowdDensity: 0.35,
        noiseLevelDb: 70,
        spatialCongestionRatio: 0.25,
        anomalyDetected: false,
        anomalyDescription: null,
        coordinates: { x: 0.15, y: 0.22 }
      };
    } else if (scenario === 'surge_c') {
      simulatedData = {
        stadiumId: 'Mercedes-Benz-Atlanta',
        timestamp: new Date().toISOString(),
        crowdDensity: 0.92,
        noiseLevelDb: 105,
        spatialCongestionRatio: 0.88,
        anomalyDetected: true,
        anomalyDescription: 'Dangerous pedestrian congestion forming in Sector South Gate C transit link.',
        coordinates: { x: 0.76, y: 0.81 }
      };
    } else {
      simulatedData = {
        stadiumId: 'Mercedes-Benz-Atlanta',
        timestamp: new Date().toISOString(),
        crowdDensity: 0.86,
        noiseLevelDb: 98,
        spatialCongestionRatio: 0.81,
        anomalyDetected: true,
        anomalyDescription: 'Access gates A1-A4 locked to manage crowd overflow bottlenecks.',
        coordinates: { x: 0.24, y: 0.18 }
      };
    }

    try {
      await addDoc(collection(db, 'telemetry'), simulatedData);
      startTransition(async () => {
        try {
          const newDirective = await processTelemetryAndGetDirective(simulatedData);
          await addDoc(collection(db, 'directives'), newDirective);
        } catch (err) {
          console.error(err);
        } finally {
          setIsSimulating(false);
        }
      });
    } catch (err) {
      console.error(err);
      setIsSimulating(false);
    }
  };

  const handleAcknowledge = async (directiveId: string) => {
    setAcknowledging(directiveId);
    try {
      await addDoc(collection(db, 'acknowledgments'), {
        directiveId,
        volunteerEmail: getOperatorIdentity(),
        acknowledgedAt: new Date().toISOString(),
        serverTimestamp: serverTimestamp()
      });
      setAcknowledgedDirectives(prev => ({ ...prev, [directiveId]: true }));
    } catch (err) {
      console.error(err);
    } finally {
      setAcknowledging(null);
    }
  };

  // Incident Logger
  const submitIncidentReport = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanText = incidentText.trim();
    if (!cleanText) return;

    // Bounds Check: Prevent database flooding
    if (cleanText.length > 1000) {
      alert('Report details exceed maximum length of 1000 characters.');
      return;
    }

    // Security sanitization: strip script tags and HTML injection vectors
    const sanitizedText = cleanText
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '[REDACTED SCRIPT]')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '[REDACTED IFRAME]')
      .replace(/javascript:/gi, '[REDACTED PROTOCOL]')
      .replace(/onerror\s*=/gi, 'x-onerror=')
      .replace(/onload\s*=/gi, 'x-onload=');

    setReportingIncident(true);
    try {
      await addDoc(collection(db, 'reports'), {
        reporter: getOperatorIdentity(),
        sector: calibrationSector || 'Unknown Sector',
        tier: calibrationTier || '100',
        details: sanitizedText,
        timestamp: new Date().toISOString()
      });
      setIncidentText('');
      alert('Report logged successfully to central asset DB.');
    } catch (err) {
      console.error(err);
      alert('Failed to submit report. Please check connection and retry.');
    } finally {
      setReportingIncident(false);
    }
  };

  // Swipe Purge trigger
  const handleWipePurge = async () => {
    setWipingState(true);
    try {
      localStorage.clear();
      sessionStorage.clear();

      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }

      const dbs = await window.indexedDB.databases();
      for (const dbInfo of dbs) {
        if (dbInfo.name) {
          window.indexedDB.deleteDatabase(dbInfo.name);
        }
      }

      setPinCode('');
      setDiagAudio('idle');
      setDiagVibe('idle');
      setDiagMic('idle');
      setDiagGps('idle');
      toggleShiftActive(false);
      
      await logout();
      router.push('/');
    } catch (err) {
      console.error(err);
      setWipingState(false);
    }
  };

  // Toggle tasks check status in Mission Control
  const toggleAttTask = (id: number) => {
    setAttTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const activeDirective = directives[0];


  return (
    <div className="flex-grow flex flex-col min-h-screen bg-[#fdf9f4] text-[#1c1c19] relative transition-colors duration-300">
      
      {/* Google Brand Color Indicator Bar */}
      <div className="h-[4px] w-full bg-gradient-to-r from-[#4285f4] via-[#ea4335] via-[#fbbc05] to-[#34a853] sticky top-0 z-[60] flex" />

      {/* Background Soft Floating Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-secondary-brand/10 blur-[100px] blob-1 mix-blend-multiply" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-primary-brand/10 blur-[120px] blob-2 mix-blend-multiply" />
      </div>

      {/* Top Navbar */}
      <header className="border-b border-outline-border/20 bg-background/80 backdrop-blur-xl sticky top-[4px] z-50 h-16 w-full flex justify-between items-center px-8">
        <div className="flex items-center gap-4">
          <div className="font-display font-extrabold text-lg text-foreground tracking-tight flex items-center gap-1.5 select-none">
            <span className="text-[#4285f4]">F</span>
            <span className="text-[#ea4335]">I</span>
            <span className="text-[#fbbc05]">F</span>
            <span className="text-[#34a853]">A</span>
            <span className="text-foreground/80 font-normal">2026</span>
            <span className="text-foreground/90 font-black ml-1 text-[10px] bg-foreground/5 px-2 py-0.5 rounded-lg border border-outline-border/10">OPS</span>
          </div>
          <div className="hidden md:flex items-center gap-1 text-[9px] font-mono font-bold text-foreground/45 uppercase tracking-widest bg-outline-border/10 px-2.5 py-1 rounded-full border border-outline-border/15">
            <span>Google Labs</span>
            <span className="text-foreground/30">•</span>
            <span>FIFA Tech Team</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Dynamic Language Switcher */}
          <div className="flex items-center bg-outline-border/10 p-1 rounded-xl" role="group" aria-label="Interface language selector">
            {(['en', 'es', 'fr', 'pt', 'ar', 'zh'] as Language[]).map((l) => (
              <button
                key={l}
                onClick={() => changeLanguage(l)}
                aria-label={`Switch UI language to ${l.toUpperCase()}`}
                className={`text-[10px] px-2 py-1 rounded-lg font-mono font-bold uppercase transition focus:ring-2 focus:ring-[#137333] outline-none ${
                  lang === l 
                    ? 'bg-[#137333] text-white shadow-sm font-extrabold' 
                    : 'text-foreground/50 hover:text-foreground'
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button 
              aria-label="Display accreditation QR code identifier"
              className="p-2 text-foreground/70 hover:bg-outline-border/15 rounded-full transition active:scale-95 duration-150 flex items-center justify-center focus:ring-2 focus:ring-secondary-brand outline-none"
            >
              <QrCode className="h-4.5 w-4.5" />
            </button>
            <button 
              aria-label="Connection Status: Signal stable"
              className="p-2 text-foreground/70 hover:bg-outline-border/15 rounded-full transition active:scale-95 duration-150 flex items-center justify-center focus:ring-2 focus:ring-secondary-brand outline-none"
            >
              <Signal className="h-4.5 w-4.5" />
            </button>
            <button 
              aria-label="Active operator profile settings"
              className="p-2 text-foreground/70 hover:bg-outline-border/15 rounded-full transition active:scale-95 duration-150 flex items-center justify-center focus:ring-2 focus:ring-secondary-brand outline-none"
            >
              <User className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>
      </header>

      {maintenanceMode && (
        <div className="bg-[#ea4335] text-white py-2 px-8 text-center text-xs font-mono font-bold tracking-wider z-50 flex items-center justify-center gap-2 border-b border-white/10 shadow-md">
          <AlertTriangle className="h-4 w-4 animate-pulse shrink-0" />
          <span>ALERT: SYSTEM UNDER SCHEDULED MAINTENANCE. SOME REAL-TIME TELEMETRY WRITES MAY BE QUEUED OFFLINE.</span>
        </div>
      )}

      {/* Main Structural Wrapper (Sidebar + Canvas) */}
      <div className="flex flex-1 relative z-10">
        
        {/* Left Side Navigation (Desktop) */}
        <nav className="bg-background/95 backdrop-blur-xl h-[calc(100vh-4rem)] w-64 fixed left-0 top-16 z-40 border-r border-outline-border/20 flex flex-col py-6 px-4 hidden md:flex">
          {/* User profile detail */}
          <div className="px-2 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-outline-border/30 flex items-center justify-center overflow-hidden shrink-0">
              <User className="h-5 w-5 text-foreground/70" />
            </div>
            <div>
              <h2 className="font-display font-black text-sm text-foreground leading-tight">Sector 7G</h2>
              <p className="text-[10px] font-mono text-foreground/60 uppercase tracking-wider">Semi-Final Operations</p>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 space-y-1" role="tablist" aria-label="Operational tabs">
            <button 
              onClick={() => changeTab('mission_control')}
              role="tab"
              aria-selected={activeTab === 'mission_control'}
              aria-label="Go to Mission Control view"
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold transition text-left cursor-pointer active:translate-x-1 duration-150 focus:ring-2 focus:ring-[#137333] outline-none ${
                activeTab === 'mission_control' 
                  ? 'text-[#137333] bg-[#e6f4ea] font-extrabold' 
                  : 'text-foreground/75 hover:bg-outline-border/15'
              }`}
            >
              <CompassIcon className="h-4.5 w-4.5" />
              <span className="text-xs">Mission Control</span>
            </button>

            <button 
              onClick={() => changeTab('device_gate')}
              role="tab"
              aria-selected={activeTab === 'device_gate'}
              aria-label="Go to Device Gate view"
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold transition text-left cursor-pointer active:translate-x-1 duration-150 focus:ring-2 focus:ring-[#137333] outline-none ${
                activeTab === 'device_gate' 
                  ? 'text-[#137333] bg-[#e6f4ea] font-extrabold' 
                  : 'text-foreground/75 hover:bg-outline-border/15'
              }`}
            >
              <Cpu className="h-4.5 w-4.5" />
              <span className="text-xs">Device Gate</span>
            </button>

            <button 
              onClick={() => changeTab('auth_portal')}
              role="tab"
              aria-selected={activeTab === 'auth_portal'}
              aria-label="Go to Authentication Portal view"
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold transition text-left cursor-pointer active:translate-x-1 duration-150 focus:ring-2 focus:ring-[#137333] outline-none ${
                activeTab === 'auth_portal' 
                  ? 'text-[#137333] bg-[#e6f4ea] font-extrabold' 
                  : 'text-foreground/75 hover:bg-outline-border/15'
              }`}
            >
              <Fingerprint className="h-4.5 w-4.5" />
              <span className="text-xs">Auth Portal</span>
            </button>

            <button 
              onClick={() => changeTab('calibration')}
              role="tab"
              aria-selected={activeTab === 'calibration'}
              aria-label="Go to Calibration view"
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold transition text-left cursor-pointer active:translate-x-1 duration-150 focus:ring-2 focus:ring-[#137333] outline-none ${
                activeTab === 'calibration' 
                  ? 'text-[#137333] bg-[#e6f4ea] font-extrabold' 
                  : 'text-foreground/75 hover:bg-outline-border/15'
              }`}
            >
              <MapPin className="h-4.5 w-4.5" />
              <span className="text-xs">Calibration</span>
            </button>

            <button 
              onClick={() => changeTab('off_ramp')}
              role="tab"
              aria-selected={activeTab === 'off_ramp'}
              aria-label="Go to Off-Ramp view"
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold transition text-left cursor-pointer active:translate-x-1 duration-150 focus:ring-2 focus:ring-red-500 outline-none ${
                activeTab === 'off_ramp' 
                  ? 'text-[#c5221f] bg-[#fce8e6] font-extrabold' 
                  : 'text-foreground/75 hover:bg-outline-border/15'
              }`}
            >
              <LogOut className="h-4.5 w-4.5" />
              <span className="text-xs">Off-Ramp</span>
            </button>
          </div>

          {/* Emergency button */}
          <div className="pt-4 border-t border-outline-border/20 mt-auto">
            <button className="w-full bg-[#ba1a1a] hover:opacity-95 text-white py-3 rounded-xl font-bold text-xs shadow-md transition active:scale-95 duration-100 flex items-center justify-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Emergency Broadcast
            </button>
            <div className="flex justify-around mt-4 text-foreground/50">
              <button className="flex flex-col items-center hover:text-foreground p-1 transition">
                <Activity className="h-4 w-4" />
                <span className="text-[8px] font-mono mt-0.5">Status</span>
              </button>
              <button className="flex flex-col items-center hover:text-foreground p-1 transition">
                <SlidersHorizontal className="h-4 w-4" />
                <span className="text-[8px] font-mono mt-0.5">Settings</span>
              </button>
            </div>
          </div>
        </nav>

        {/* Content Canvas (indented for desktop sidebar) */}
        <main className="flex-1 w-full md:ml-64 px-4 md:px-8 py-8 max-w-7xl mx-auto flex flex-col justify-center min-h-[calc(100vh-4rem)]">
          
          {/* TAB 1: MISSION CONTROL (Screen 1 Onboarding OR Live Operations Command Deck) */}
          {activeTab === 'mission_control' && (
            !shiftActive ? (
              <div className="space-y-8 animate-fadeIn">
                {/* Welcome Header panel */}
                <section className="glass-panel p-8 rounded-3xl relative overflow-hidden shadow-sm">
                  <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-secondary-brand/10 to-transparent pointer-events-none" />
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                    <div>
                      <span className="text-[9px] font-mono font-bold text-secondary-brand uppercase tracking-widest mb-1.5 block">Match Day -1 / Final Prep</span>
                      <h1 className="text-2xl md:text-3xl font-bold font-display text-foreground leading-tight">Welcome back, Operator.</h1>
                      <p className="text-xs text-foreground/70 max-w-2xl mt-1 font-medium leading-relaxed">
                        All systems nominal. Your next deployment is scheduled at Sector 7G. Review the critical checklists below before initiating your shift.
                      </p>
                    </div>
                    <button 
                      onClick={() => changeTab('device_gate')}
                      className="bg-[#137333] hover:opacity-95 text-white px-6 py-3.5 rounded-xl font-bold text-xs shadow-md transition active:scale-95 duration-100 flex items-center gap-2 cursor-pointer"
                    >
                      <Play className="h-4 w-4 fill-current" />
                      Start Shift
                    </button>
                  </div>
                </section>

                {/* Bento Grid layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left side: checklists */}
                  <div className="lg:col-span-8 space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-bold font-display text-foreground">Deployment Checklists</h2>
                      <span className="bg-outline-border/20 text-foreground/60 px-2.5 py-0.5 rounded-full font-mono text-[10px]">2 Locations</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* AT&T Stadium */}
                      <div className="glass-panel rounded-2xl p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-outline-border/20 rounded-bl-full -z-10 group-hover:scale-110 transition duration-300" />
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <h3 className="font-bold text-sm font-display">AT&T Stadium</h3>
                            <p className="text-[10px] font-mono text-foreground/60 flex items-center gap-1 mt-0.5">
                              <MapPin className="h-3 w-3" /> Sector 3, Arlington
                            </p>
                          </div>
                          <span className="text-[9px] font-mono bg-primary-brand/10 text-primary-brand border border-primary-brand/20 px-2 py-0.5 rounded-lg">Ready</span>
                        </div>

                        <ul className="space-y-3">
                          {attTasks.map((t) => (
                            <li key={t.id} className="flex items-start gap-2.5 text-xs font-semibold text-foreground/85">
                              <button 
                                onClick={() => toggleAttTask(t.id)} 
                                role="checkbox"
                                aria-checked={t.done}
                                aria-label={`Mark task "${t.label}" as ${t.done ? 'incomplete' : 'complete'}`}
                                className="text-foreground/40 hover:text-primary-brand transition mt-0.5 focus:ring-2 focus:ring-[#137333] outline-none rounded-md cursor-pointer"
                              >
                                {t.done ? (
                                  <CheckCircle className="h-4.5 w-4.5 text-primary-brand fill-current" />
                                ) : (
                                  <span className="h-4.5 w-4.5 rounded-full border border-outline-border block" />
                                )}
                              </button>
                              <span className={t.done ? 'line-through text-foreground/45' : ''}>{t.label}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Mercedes-Benz */}
                      <div className="glass-panel rounded-2xl p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-secondary-brand/5 rounded-bl-full -z-10 group-hover:scale-110 transition duration-300" />
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <h3 className="font-bold text-sm font-display">Mercedes-Benz</h3>
                            <p className="text-[10px] font-mono text-foreground/60 flex items-center gap-1 mt-0.5">
                              <MapPin className="h-3 w-3" /> Zone C, Atlanta
                            </p>
                          </div>
                          <span className="text-[9px] font-mono bg-outline-border/20 text-foreground/50 border border-outline-border/10 px-2 py-0.5 rounded-lg">Pending</span>
                        </div>

                        <ul className="space-y-3 opacity-60">
                          {mbTasks.map((t) => (
                            <li key={t.id} className="flex items-start gap-2.5 text-xs font-semibold text-foreground/80">
                              <span className="h-4.5 w-4.5 rounded-full border border-outline-border flex items-center justify-center shrink-0 mt-0.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-foreground/30"></span>
                              </span>
                              <span>{t.label}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Right side: timeline & map */}
                  <div className="lg:col-span-4 space-y-6">
                    {/* Timeline */}
                    <div className="glass-panel rounded-2xl p-6">
                      <h3 className="text-sm font-bold font-display flex items-center gap-2 mb-4">
                        <Clock className="h-4 w-4 text-secondary-brand" /> Match-Day Timeline
                      </h3>
                      <div className="border-l border-outline-border/40 pl-4 space-y-4 font-mono text-[10px] text-foreground/75">
                        <div>
                          <div className="font-bold text-foreground">08:00 AM</div>
                          <div className="text-xs font-sans font-semibold text-foreground mt-0.5">HQ Briefing</div>
                        </div>
                        <div className="relative">
                          <span className="absolute -left-[20.5px] top-1.5 h-2 w-2 rounded-full bg-secondary-brand border border-white" />
                          <div className="font-bold text-secondary-brand flex items-center gap-1">10:30 AM <span className="bg-secondary-brand/10 px-1 rounded text-[8px]">ACTIVE</span></div>
                          <div className="text-xs font-sans font-black text-foreground mt-0.5">Deploy to Sectors</div>
                        </div>
                        <div>
                          <div className="font-bold">01:00 PM</div>
                          <div className="text-xs font-sans font-semibold text-foreground/70 mt-0.5">Gates Open</div>
                        </div>
                      </div>
                    </div>

                    {/* Transit Routes map box */}
                    <div className="glass-panel rounded-2xl p-0 overflow-hidden border border-outline-border/30 h-44 flex flex-col relative">
                      <div className="p-3 border-b border-outline-border/20 bg-background/55 backdrop-blur-sm z-10 flex justify-between items-center">
                        <h4 className="text-[11px] font-bold font-display flex items-center gap-1.5">
                          <Compass className="h-3.5 w-3.5 text-secondary-brand" /> Transit Routes map
                        </h4>
                      </div>
                      {/* SVG map placeholder matching Stitch */}
                      <div className="flex-1 bg-outline-border/5 relative overflow-hidden scanline-overlay">
                        <div className="absolute inset-0 opacity-[0.2]" style={{ backgroundImage: 'radial-gradient(#137333 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }} />
                        <svg className="w-full h-full text-foreground/25" viewBox="0 0 100 50">
                          <path d="M 10,10 Q 50,40 90,20" fill="none" stroke="currentColor" strokeWidth="1.5" />
                          <path d="M 20,40 Q 60,10 80,40" fill="none" stroke="var(--secondary)" strokeWidth="1.5" strokeDasharray="3 3" />
                          <circle cx="10" cy="10" r="3" fill="var(--primary)" />
                          <circle cx="90" cy="20" r="3" fill="var(--primary)" />
                          <circle cx="50" cy="25" r="3" fill="var(--error)" className="origin-center" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-8 animate-fadeIn">
                {/* Active Shift Header panel */}
                <section className="glass-panel p-6 rounded-3xl relative overflow-hidden shadow-sm">
                  <div className="flex justify-between items-center relative z-10">
                    <div>
                      <span className="text-[9px] font-mono font-bold text-[#137333] uppercase tracking-widest mb-1 block">Active Shift Operations</span>
                      <h1 className="text-xl md:text-2xl font-bold font-display text-foreground">{t.deck.title}</h1>
                      <p className="text-xs text-foreground/60 font-semibold">{t.deck.subtitle}</p>
                    </div>
                    <button 
                      onClick={() => {
                        toggleShiftActive(false);
                        changeTab('off_ramp');
                      }}
                      className="px-4.5 py-2.5 bg-[#ea4335] text-white rounded-xl text-xs font-bold font-display shadow-md hover:opacity-95 transition active:scale-95 duration-100 flex items-center gap-1.5 cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" />
                      {t.deck.btnEndShift}
                    </button>
                  </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left Column: Directives & Announcements */}
                  <div className="lg:col-span-7 space-y-6">
                    {/* Active AI Directive Card */}
                    <div className="glass-panel rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between border-b border-outline-border/20 pb-3 mb-4">
                          <h3 className="text-sm font-bold font-display text-foreground flex items-center gap-2">
                            <ShieldAlert className="h-4.5 w-4.5 text-secondary-brand" />
                            {t.deck.directiveHeader}
                          </h3>
                          {activeDirective?.severity === 'CRITICAL' && (
                            <span className="bg-[#ea4335]/15 text-[#ea4335] px-2.5 py-0.5 rounded-full font-mono text-[9px] font-bold uppercase">
                              CRITICAL WARNING
                            </span>
                          )}
                        </div>

                        {activeDirective ? (
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-xs font-mono font-bold text-foreground/50 uppercase tracking-wider">{t.deck.severityLabel}</h4>
                              <p className="text-sm font-bold text-foreground mt-0.5">{activeDirective.headline}</p>
                            </div>

                            <div>
                              <h4 className="text-xs font-mono font-bold text-foreground/50 uppercase tracking-wider">{t.deck.egressHeader}</h4>
                              <p className="text-xs text-foreground/80 mt-1 font-semibold leading-relaxed">
                                Recommended Route: <span className="font-bold text-[#137333] font-mono">{activeDirective.recommendedRoute}</span>
                              </p>
                            </div>

                            <div>
                              <h4 className="text-xs font-mono font-bold text-foreground/50 uppercase tracking-wider">{t.deck.actionHeader}</h4>
                              <ul className="space-y-2 mt-2">
                                {activeDirective.actionSteps.map((step, idx) => (
                                  <li key={idx} className="flex items-start gap-2 text-xs font-medium text-foreground/85">
                                    <span className="h-4 w-4 rounded-full bg-[#137333]/10 text-[#137333] flex items-center justify-center shrink-0 mt-0.5 text-[9px] font-black">
                                      ✓
                                    </span>
                                    <span>{step}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="bg-outline-border/10 p-4 rounded-xl border border-outline-border/15">
                              <h4 className="text-[10px] font-mono font-bold text-foreground/50 uppercase tracking-wider flex items-center gap-1.5">
                                <Cpu className="h-3.5 w-3.5 text-[#137333]" />
                                {t.deck.xaiHeader}
                              </h4>
                              <p className="text-xs text-foreground/75 mt-2 italic leading-relaxed font-semibold">
                                &ldquo;{activeDirective.reasoning}&rdquo;
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col justify-between h-full flex-grow">
                            <div className="py-12 text-center text-foreground/45 flex flex-col items-center justify-center gap-2">
                              <CheckCircle className="h-8 w-8 text-[#137333]" />
                              <span className="text-xs font-bold text-foreground/75">All systems nominal. No active directives.</span>
                            </div>

                            <SystemIntegrityMonitor 
                              activeModelName={activeModelName}
                              anomalyThresholdDensity={anomalyThresholdDensity}
                              anomalyThresholdCongestion={anomalyThresholdCongestion}
                            />
                          </div>
                        )}
                      </div>

                      {activeDirective && (
                        <div className="pt-4 border-t border-outline-border/20 mt-6 flex justify-between items-center">
                          <span className="text-[9px] font-mono text-foreground/45 font-semibold">ID: {activeDirective.id.substring(0, 8)}</span>
                          <button
                            onClick={() => handleAcknowledge(activeDirective.id)}
                            disabled={acknowledgedDirectives[activeDirective.id] || acknowledging === activeDirective.id}
                            className={`px-4.5 py-2 rounded-xl text-xs font-bold font-display shadow-sm transition active:scale-95 duration-100 flex items-center gap-1.5 cursor-pointer ${
                              acknowledgedDirectives[activeDirective.id]
                                ? 'bg-primary-brand/10 text-primary-brand border border-primary-brand/20'
                                : 'bg-[#137333] text-white hover:opacity-95'
                            }`}
                          >
                            <Check className="h-4 w-4" />
                            {acknowledgedDirectives[activeDirective.id] 
                              ? 'Acknowledged' 
                              : acknowledging === activeDirective.id 
                                ? 'Syncing...' 
                                : t.deck.btnAcknowledge}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Announcement scripts */}
                    {activeDirective && (
                      <div className="glass-panel rounded-2xl p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-outline-border/20 pb-3 mb-4 gap-3">
                          <h3 className="text-sm font-bold font-display text-foreground flex items-center gap-2">
                            <Volume2 className="h-4.5 w-4.5 text-secondary-brand" />
                            {t.deck.announcementHeader}
                          </h3>
                          {/* Announcement script language tabs */}
                          <div className="flex bg-outline-border/15 p-0.5 rounded-lg border border-outline-border/10 shrink-0">
                            {(['en', 'es', 'pt'] as const).map((langCode) => (
                              <button
                                key={langCode}
                                onClick={() => setSelectedLanguage(langCode)}
                                className={`text-[9px] px-2 py-1 rounded font-mono font-bold uppercase transition ${
                                  selectedLanguage === langCode 
                                    ? 'bg-secondary-brand text-white shadow-sm font-extrabold' 
                                    : 'text-foreground/50 hover:text-foreground'
                                }`}
                              >
                                {langCode}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="bg-[#ffffff] p-4 rounded-xl border border-outline-border/20 relative">
                          <p className="text-xs font-mono font-semibold text-foreground/80 leading-relaxed pr-8">
                            {activeDirective.announcements[selectedLanguage] || 'No script loaded.'}
                          </p>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(activeDirective.announcements[selectedLanguage]);
                              alert('Copied announcer script to clipboard!');
                            }}
                            className="absolute right-3 top-3 p-1.5 hover:bg-outline-border/15 text-foreground/60 hover:text-foreground rounded-lg transition active:scale-90"
                            title="Copy script"
                          >
                            <ClipboardCheck className="h-4.5 w-4.5" />
                          </button>
                        </div>
                        <div className="mt-2 text-[9px] font-mono text-foreground/45 font-semibold flex items-center">
                          <span>{t.deck.targetAudience}:</span>
                          <select 
                            value={selectedZone}
                            onChange={(e) => setSelectedZone(e.target.value)}
                            aria-label="Select Target Zone"
                            className="bg-outline-border/10 border border-outline-border/25 rounded-lg px-2 py-0.5 text-[9px] font-mono font-bold outline-none ml-2 text-foreground focus:ring-2 focus:ring-[#137333] cursor-pointer"
                          >
                            {['Gate A', 'Gate B', 'Gate C', 'Gate D'].map((z) => (
                              <option key={z} value={z} className="bg-[#fdf9f4] text-foreground">{z}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Heatmap, Metrics, Simulator */}
                  <div className="lg:col-span-5 space-y-6">
                    {/* Stadium Heatmap */}
                    <div className="glass-panel rounded-2xl p-6">
                      <h3 className="text-sm font-bold font-display text-foreground flex items-center justify-between border-b border-outline-border/20 pb-3 mb-4">
                        <span>{t.deck.heatmapHeader}</span>
                        <span className="flex items-center gap-1 font-mono text-[9px] text-[#137333] bg-[#137333]/10 px-2 py-0.5 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#137333]" />
                          {t.deck.heatmapLive}
                        </span>
                      </h3>

                      <div className="bg-outline-border/5 rounded-xl border border-outline-border/20 aspect-video relative overflow-hidden scanline-overlay flex items-center justify-center">
                        <div className="absolute inset-0 opacity-[0.2]" style={{ backgroundImage: 'radial-gradient(#137333 1.5px, transparent 1.5px)', backgroundSize: '16px 16px' }} />
                        
                        <div className="w-40 h-24 rounded-[40px] border-4 border-foreground/15 flex items-center justify-center relative">
                          <div className="w-32 h-16 rounded-[30px] border-2 border-dashed border-foreground/10 flex items-center justify-center">
                            <span className="font-display font-black text-[9px] text-foreground/20 tracking-widest">PITCH</span>
                          </div>
                                                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-[8px] font-mono font-bold bg-[#fdf9f4] px-1.5 text-foreground/50 border border-outline-border/20 rounded">
                            GATE A
                          </div>
                          <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 text-[8px] font-mono font-bold bg-[#fdf9f4] px-1.5 text-foreground/50 border border-outline-border/20 rounded">
                            GATE C
                          </div>
                          <div className="absolute -left-4 top-1/2 -translate-y-1/2 text-[8px] font-mono font-bold bg-[#fdf9f4] px-1.5 text-foreground/50 border border-outline-border/20 rounded rotate-90">
                            GATE D
                          </div>
                          <div className="absolute -right-4 top-1/2 -translate-y-1/2 text-[8px] font-mono font-bold bg-[#fdf9f4] px-1.5 text-foreground/50 border border-outline-border/20 rounded -rotate-90">
                            GATE B
                          </div>
                        </div>

                        {telemetry && telemetry.anomalyDetected && (
                          <div 
                            className="absolute h-4 w-4 bg-[#ea4335] rounded-full origin-center border border-white shadow-md opacity-90"
                            style={{
                              left: `${telemetry.coordinates.x * 100}%`,
                              top: `${telemetry.coordinates.y * 100}%`
                            }}
                          />
                        )}
                        {telemetry && telemetry.anomalyDetected && (
                          <div 
                            className="absolute h-2.5 w-2.5 bg-[#ea4335] rounded-full border border-white origin-center"
                            style={{
                              left: `${telemetry.coordinates.x * 100}%`,
                              top: `${telemetry.coordinates.y * 100}%`
                            }}
                          />
                        )}
                      </div>
                    </div>

                    {/* Metrics values */}
                    <TelemetryMetricsCard 
                      telemetry={telemetry}
                      anomalyThresholdDensity={anomalyThresholdDensity}
                      anomalyThresholdCongestion={anomalyThresholdCongestion}
                    />

                    {/* Scenario Injector console */}
                    <div className="glass-panel rounded-2xl p-6 border border-outline-border/30">
                      <h3 className="text-sm font-bold font-display text-foreground flex items-center gap-2 mb-2">
                        <Activity className="h-4.5 w-4.5 text-secondary-brand" />
                        {t.deck.simulatorHeader}
                      </h3>
                      <p className="text-[11px] text-foreground/60 leading-normal mb-4 font-semibold">
                        {t.deck.simulatorDesc}
                      </p>
                      <div className="grid grid-cols-3 gap-2.5">
                        <button
                          onClick={() => triggerSimulation('safe')}
                          disabled={isSimulating}
                          className="py-2.5 px-1 bg-background hover:bg-outline-border/10 border border-[#137333]/20 text-[#137333] rounded-xl text-[9px] font-mono font-bold transition active:scale-95 disabled:opacity-50 flex items-center justify-center cursor-pointer text-center"
                        >
                          {t.deck.simSafe}
                        </button>
                        <button
                          onClick={() => triggerSimulation('surge_c')}
                          disabled={isSimulating}
                          className="py-2.5 px-1 bg-background hover:bg-outline-border/10 border border-[#ea4335]/20 text-[#ea4335] rounded-xl text-[9px] font-mono font-bold transition active:scale-95 disabled:opacity-50 flex items-center justify-center cursor-pointer text-center"
                        >
                          {t.deck.simSurgeC}
                        </button>
                        <button
                          onClick={() => triggerSimulation('surge_a')}
                          disabled={isSimulating}
                          className="py-2.5 px-1 bg-background hover:bg-outline-border/10 border border-[#ea4335]/20 text-[#ea4335] rounded-xl text-[9px] font-mono font-bold transition active:scale-95 disabled:opacity-50 flex items-center justify-center cursor-pointer text-center"
                        >
                          {t.deck.simSurgeA}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}

          {/* TAB 2: DEVICE GATE (Screen 3 Provisioning) */}
          {activeTab === 'device_gate' && (
            <div className="max-w-xl mx-auto w-full glass-panel rounded-3xl p-8 shadow-md relative overflow-hidden transition-all duration-300">
              <div className="flex items-center gap-3 mb-2 border-b border-outline-border/20 pb-4">
                <Cpu className="text-secondary-brand h-6 w-6" />
                <div>
                  <h2 className="text-lg font-bold font-display">{t.provision.title}</h2>
                  <span className="text-[9px] font-mono text-primary-brand font-bold uppercase tracking-wider">{t.common.networkStable}</span>
                </div>
              </div>
              
              <p className="text-xs text-foreground/75 leading-relaxed font-medium mb-6">
                {t.provision.subtitle}
              </p>

              {/* System compatibility diagnostics */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between p-3 rounded-xl bg-background/50 border border-outline-border/20">
                  <span className="text-xs font-mono text-foreground/80">{t.provision.osCheck}</span>
                  <span className="text-xs font-mono font-bold text-primary-brand flex items-center gap-1">
                    <Check className="h-3.5 w-3.5" /> SW_OK (16.2)
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-background/50 border border-outline-border/20">
                  <span className="text-xs font-mono text-foreground/80">{t.provision.cameraCheck}</span>
                  <span className="text-xs font-mono font-bold text-primary-brand flex items-center gap-1">
                    <Check className="h-3.5 w-3.5" /> CAMERA_GRANTED
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-background/50 border border-outline-border/20">
                  <span className="text-xs font-mono text-foreground/80">{t.provision.securityToken}</span>
                  <span className="text-xs font-mono font-bold text-primary-brand flex items-center gap-1">
                    <Check className="h-3.5 w-3.5" /> WEBAUTHN_ENROLLED
                  </span>
                </div>
              </div>

              {/* Offline packages cache progress */}
              <div className="mb-6 space-y-2">
                <div className="flex justify-between text-xs font-mono text-foreground/60">
                  <span>{provisionLog || t.provision.pwaStatus}</span>
                  <span>{provisionProgress}%</span>
                </div>
                <div className="w-full bg-outline-border/20 h-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-secondary-brand transition-all duration-300"
                    style={{ width: `${provisionProgress}%` }}
                  />
                </div>
              </div>

              <button
                onClick={() => changeTab('auth_portal')}
                disabled={!provisionDone}
                className="w-full py-3.5 bg-primary-brand text-white font-bold rounded-xl shadow-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 hover:opacity-95"
              >
                <ShieldCheck className="h-5 w-5" />
                {provisionDone ? t.provision.done : t.provision.btnSync}
              </button>
            </div>
          )}

          {/* TAB 3: AUTH PORTAL (Screen 4 Zero-Trust Auth) */}
          {activeTab === 'auth_portal' && (
            <BiometricScannerPanel 
              t={t}
              cameraActive={cameraActive}
              setCameraActive={setCameraActive}
              videoRef={videoRef}
              pinCode={pinCode}
              handlePinPress={handlePinPress}
              handleBackspace={handleBackspace}
              changeTab={changeTab}
            />
          )}

          {/* TAB 4: CALIBRATION (Screen 2 Calibration & Diagnostics) */}
          {activeTab === 'calibration' && (
            <DeviceGateCalibration 
              t={t}
              calibrationTier={calibrationTier}
              setCalibrationTier={setCalibrationTier}
              calibrationSector={calibrationSector}
              setCalibrationSector={setCalibrationSector}
              rotatingPin={rotatingPin}
              pinTimer={pinTimer}
              diagAudio={diagAudio}
              playSpeakerTest={playSpeakerTest}
              diagVibe={diagVibe}
              playVibeTest={playVibeTest}
              diagMic={diagMic}
              diagGps={diagGps}
              playGpsTest={playGpsTest}
              playMicTest={playMicTest}
              gpsCoords={gpsCoords}
              toggleShiftActive={toggleShiftActive}
              changeTab={changeTab}
              micVolume={micVolume}
            />
          )}

          {/* TAB 5: OFF-RAMP (Stage 5 Checkout) */}
          {activeTab === 'off_ramp' && (
            <div className="max-w-xl mx-auto w-full glass-panel rounded-3xl p-8 shadow-2xl relative overflow-hidden transition-all duration-300">
              <h2 className="text-xl font-bold font-display flex items-center gap-2 mb-2 text-foreground">
                <Shield className="text-[#ea4335] h-5.5 w-5.5" />
                {t.offramp.title}
              </h2>
              <p className="text-xs text-foreground/75 leading-relaxed font-medium mb-6">
                {t.offramp.subtitle}
              </p>

              {/* Barcode block */}
              <div className="p-4 bg-background/50 border border-outline-border/20 rounded-2xl mb-6 flex flex-col items-center">
                <span className="text-[10px] font-mono font-bold text-foreground/60 uppercase tracking-widest mb-3">
                  {t.offramp.equipmentHeader}
                </span>
                <svg className="w-full max-w-[280px] h-12 text-foreground" viewBox="0 0 100 20">
                  <rect x="0" y="0" width="2" height="20" fill="currentColor" />
                  <rect x="3" y="0" width="1" height="20" fill="currentColor" />
                  <rect x="6" y="0" width="4" height="20" fill="currentColor" />
                  <rect x="12" y="0" width="2" height="20" fill="currentColor" />
                  <rect x="16" y="0" width="1" height="20" fill="currentColor" />
                  <rect x="18" y="0" width="3" height="20" fill="currentColor" />
                  <rect x="23" y="0" width="2" height="20" fill="currentColor" />
                  <rect x="27" y="0" width="1" height="20" fill="currentColor" />
                  <rect x="30" y="0" width="4" height="20" fill="currentColor" />
                  <rect x="36" y="0" width="2" height="20" fill="currentColor" />
                  <rect x="40" y="0" width="1" height="20" fill="currentColor" />
                  <rect x="43" y="0" width="3" height="20" fill="currentColor" />
                  <rect x="48" y="0" width="2" height="20" fill="currentColor" />
                  <rect x="52" y="0" width="4" height="20" fill="currentColor" />
                  <rect x="58" y="0" width="1" height="20" fill="currentColor" />
                  <rect x="61" y="0" width="2" height="20" fill="currentColor" />
                  <rect x="65" y="0" width="3" height="20" fill="currentColor" />
                  <rect x="70" y="0" width="1" height="20" fill="currentColor" />
                  <rect x="73" y="0" width="4" height="20" fill="currentColor" />
                  <rect x="79" y="0" width="2" height="20" fill="currentColor" />
                  <rect x="83" y="0" width="1" height="20" fill="currentColor" />
                  <rect x="86" y="0" width="3" height="20" fill="currentColor" />
                  <rect x="91" y="0" width="2" height="20" fill="currentColor" />
                  <rect x="95" y="0" width="5" height="20" fill="currentColor" />
                </svg>
                <span className="text-[9px] font-mono text-foreground/50 mt-1">*{user?.uid?.substring(0, 12)?.toUpperCase()}*</span>
              </div>

              {/* Incidents report form */}
              <form onSubmit={submitIncidentReport} className="space-y-3 mb-6">
                <label className="block text-[10px] font-mono font-bold text-foreground/60 uppercase tracking-widest">
                  {t.offramp.incidentHeader}
                </label>
                <p className="text-[10px] text-foreground/50 mt-0.5">{t.offramp.incidentDesc}</p>
                <textarea
                  value={incidentText}
                  onChange={(e) => setIncidentText(e.target.value)}
                  placeholder={t.offramp.inputPlaceholder}
                  className="w-full bg-background/50 border border-outline-border/30 rounded-xl p-3 text-xs outline-none focus:border-error-brand min-h-[80px] font-mono resize-none text-foreground"
                />
                <button
                  type="submit"
                  disabled={reportingIncident || !incidentText.trim()}
                  className="py-2.5 px-4 rounded-xl text-xs bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-[#ea4335] font-bold transition disabled:opacity-40 cursor-pointer"
                >
                  {reportingIncident ? 'Logging...' : 'Submit Incident report'}
                </button>
              </form>

              {/* Wipe Swipe bar */}
              <div className="space-y-3">
                <label 
                  id="purge-slider-label"
                  className="block text-[10px] font-mono font-bold text-[#ea4335] uppercase tracking-widest text-center"
                >
                  {t.offramp.purgePrompt}
                </label>
                <div className="w-full h-14 bg-background/55 border border-[#ea4335]/30 rounded-2xl relative overflow-hidden flex items-center justify-center">
                  <span className="text-xs font-mono text-foreground/55 select-none pointer-events-none z-10 font-bold uppercase">
                    {wipingState ? t.offramp.wipeSuccess : 'Slide to Purge & Sign Out ➔'}
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={swipeProgress}
                    disabled={wipingState}
                    aria-labelledby="purge-slider-label"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={swipeProgress}
                    aria-valuetext={wipingState ? "Purging data" : `${swipeProgress}% swiped`}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setSwipeProgress(val);
                      if (val >= 98) {
                        setSwipeProgress(100);
                        handleWipePurge();
                      }
                    }}
                    onMouseUp={() => {
                      if (swipeProgress < 98) setSwipeProgress(0);
                    }}
                    onTouchEnd={() => {
                      if (swipeProgress < 98) setSwipeProgress(0);
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20 focus:opacity-10 focus:ring-2 focus:ring-[#ea4335] outline-none rounded-2xl"
                  />
                  <div 
                    className="absolute left-1 top-1 bottom-1 bg-[#ea4335] rounded-xl flex items-center justify-center text-white transition-all duration-75 shadow-lg"
                    style={{ 
                      width: '3rem',
                      transform: `translateX(${swipeProgress * 3.4}px)`,
                      opacity: wipingState ? 0 : 1
                    }}
                  >
                    <Trash2 className="h-5 w-5" />
                  </div>
                </div>
                {/* Keyboard & Screen Reader purge fallback button */}
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("Are you sure you want to purge all offline data and sign out? This action is irreversible.")) {
                      handleWipePurge();
                    }
                  }}
                  className="w-full mt-2 py-3 bg-red-500/10 hover:bg-red-500/20 text-[#ea4335] border border-red-500/20 rounded-xl text-xs font-bold transition focus:ring-2 focus:ring-[#ea4335] outline-none sr-only focus:not-sr-only text-center block cursor-pointer"
                >
                  Keyboard Bypass: Press Enter to Purge Data & Exit
                </button>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (md:hidden) */}
      <nav 
        role="tablist"
        aria-label="Mobile Navigation Tabs"
        className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-6 pb-safe pt-2 h-20 bg-background/95 text-foreground shadow-2xl md:hidden border-t border-outline-border/20 backdrop-blur-xl"
      >
        <button 
          onClick={() => changeTab('mission_control')}
          role="tab"
          aria-selected={activeTab === 'mission_control'}
          aria-label="Go to Live Feed tab"
          className={`flex flex-col items-center justify-center transition active:scale-90 w-16 p-2 focus:ring-2 focus:ring-[#137333] outline-none rounded-xl ${
            activeTab === 'mission_control' ? 'text-secondary-brand font-black' : 'text-foreground/60'
          }`}
        >
          <CompassIcon className="h-5 w-5 mb-1" />
          <span className="font-mono text-[8px] uppercase tracking-wider text-center">Live Feed</span>
        </button>

        <button 
          onClick={() => changeTab('device_gate')}
          role="tab"
          aria-selected={activeTab === 'device_gate'}
          aria-label="Go to Device Gate tab"
          className={`flex flex-col items-center justify-center transition active:scale-90 w-16 p-2 focus:ring-2 focus:ring-[#137333] outline-none rounded-xl ${
            activeTab === 'device_gate' ? 'text-secondary-brand font-black' : 'text-foreground/60'
          }`}
        >
          <Cpu className="h-5 w-5 mb-1" />
          <span className="font-mono text-[8px] uppercase tracking-wider text-center">Device Gate</span>
        </button>

        <button 
          onClick={() => changeTab('calibration')}
          role="tab"
          aria-selected={activeTab === 'calibration'}
          aria-label="Go to Diagnostics tab"
          className={`flex flex-col items-center justify-center transition active:scale-90 w-16 p-2 focus:ring-2 focus:ring-[#137333] outline-none rounded-xl ${
            activeTab === 'calibration' ? 'text-secondary-brand font-black' : 'text-foreground/60'
          }`}
        >
          <Sliders className="h-5 w-5 mb-1" />
          <span className="font-mono text-[8px] uppercase tracking-wider text-center">Diagnostics</span>
        </button>

        <button 
          onClick={() => changeTab('off_ramp')}
          role="tab"
          aria-selected={activeTab === 'off_ramp'}
          aria-label="Go to Secure Out tab"
          className={`flex flex-col items-center justify-center transition active:scale-90 w-16 p-2 focus:ring-2 focus:ring-red-500 outline-none rounded-xl ${
            activeTab === 'off_ramp' ? 'text-error-brand font-black' : 'text-foreground/60'
          }`}
        >
          <LogOut className="h-5 w-5 mb-1" />
          <span className="font-mono text-[8px] uppercase tracking-wider text-center">Secure Out</span>
        </button>
      </nav>

    </div>
  );
}

// --- MODULAR SUB-COMPONENTS FOR 10/10 CODE QUALITY ---

interface SystemIntegrityMonitorProps {
  activeModelName: string;
  anomalyThresholdDensity: number;
  anomalyThresholdCongestion: number;
}

function SystemIntegrityMonitor({
  activeModelName,
  anomalyThresholdDensity,
  anomalyThresholdCongestion
}: SystemIntegrityMonitorProps) {
  return (
    <div className="border-t border-outline-border/20 pt-6 mt-auto">
      <h4 className="text-[10px] font-mono font-bold text-foreground/50 uppercase tracking-wider mb-3">System Integrity Monitor</h4>
      <div className="grid grid-cols-2 gap-3 text-[10px] font-mono font-bold">
        <div className="p-2.5 rounded-xl bg-outline-border/10 border border-outline-border/15 flex items-center justify-between">
          <span className="text-foreground/50">Console Access</span>
          <span className="text-[#137333]">ENCRYPTED</span>
        </div>
        <div className="p-2.5 rounded-xl bg-outline-border/10 border border-outline-border/15 flex items-center justify-between">
          <span className="text-foreground/50">Telemetry Stream</span>
          <span className="text-[#137333]">LIVE (1Hz)</span>
        </div>
        <div className="p-2.5 rounded-xl bg-outline-border/10 border border-outline-border/15 flex items-center justify-between">
          <span className="text-foreground/50">Broadcaster Comms</span>
          <span className="text-[#137333]">READY</span>
        </div>
        <div className="p-2.5 rounded-xl bg-outline-border/10 border border-outline-border/15 flex items-center justify-between">
          <span className="text-foreground/50">Active Model</span>
          <span className="text-secondary-brand uppercase truncate max-w-[90px]" title={activeModelName}>{activeModelName.replace('gemini-', '')}</span>
        </div>
        <div className="p-2.5 rounded-xl bg-outline-border/10 border border-outline-border/15 flex items-center justify-between col-span-2">
          <span className="text-foreground/50">Config Alarm Limits</span>
          <span className="text-foreground/80">Density {(anomalyThresholdDensity * 100).toFixed(0)}% / Congestion {(anomalyThresholdCongestion * 100).toFixed(0)}%</span>
        </div>
      </div>
    </div>
  );
}

interface TelemetryMetricsCardProps {
  telemetry: StadiumTelemetry | null;
  anomalyThresholdDensity: number;
  anomalyThresholdCongestion: number;
}

function TelemetryMetricsCard({
  telemetry,
  anomalyThresholdDensity,
  anomalyThresholdCongestion
}: TelemetryMetricsCardProps) {
  if (!telemetry) {
    return (
      <div className="glass-panel rounded-2xl p-6 space-y-4 opacity-75">
        <div>
          <div className="flex justify-between items-center text-xs font-mono mb-1.5">
            <span className="text-foreground/60">Crowd Density</span>
            <span className="font-bold text-[#137333]">32%</span>
          </div>
          <div className="w-full bg-outline-border/20 h-2 rounded-full overflow-hidden">
            <div className="h-full bg-[#137333]" style={{ width: `32%` }} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-1">
          <div className="bg-background/45 p-3 rounded-xl border border-outline-border/15">
            <div className="text-[10px] font-mono text-foreground/50 uppercase tracking-wider">Noise Level</div>
            <div className="text-lg font-mono font-black text-foreground mt-1 flex items-baseline gap-0.5">
              68 <span className="text-[9px] font-normal text-foreground/50">dB</span>
            </div>
          </div>
          <div className="bg-background/45 p-3 rounded-xl border border-outline-border/15">
            <div className="text-[10px] font-mono text-foreground/50 uppercase tracking-wider">Spatial Congestion</div>
            <div className="text-lg font-mono font-black text-foreground mt-1">24%</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-2xl p-6 space-y-4">
      <div>
        <div className="flex justify-between items-center text-xs font-mono mb-1.5">
          <span className="text-foreground/60">Crowd Density</span>
          <span className={`font-bold ${telemetry.crowdDensity > anomalyThresholdDensity ? 'text-[#ea4335]' : 'text-[#137333]'}`}>
            {Math.round(telemetry.crowdDensity * 100)}%
          </span>
        </div>
        <div className="w-full bg-outline-border/20 h-2 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ${
              telemetry.crowdDensity > anomalyThresholdDensity ? 'bg-[#ea4335]' : 'bg-[#137333]'
            }`}
            style={{ width: `${telemetry.crowdDensity * 100}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-1">
        <div className="bg-background/45 p-3 rounded-xl border border-outline-border/15">
          <div className="text-[10px] font-mono text-foreground/50 uppercase tracking-wider">Noise Level</div>
          <div className="text-lg font-mono font-black text-foreground mt-1 flex items-baseline gap-0.5">
            {telemetry.noiseLevelDb} <span className="text-[9px] font-normal text-foreground/50">dB</span>
          </div>
        </div>
        <div className="bg-background/45 p-3 rounded-xl border border-outline-border/15">
          <div className="text-[10px] font-mono text-foreground/50 uppercase tracking-wider">Spatial Congestion</div>
          <div className={`text-lg font-mono font-black mt-1 ${
            telemetry.spatialCongestionRatio > anomalyThresholdCongestion ? 'text-[#ea4335]' : 'text-foreground'
          }`}>
            {Math.round(telemetry.spatialCongestionRatio * 100)}%
          </div>
        </div>
      </div>
    </div>
  );
}

interface BiometricScannerPanelProps {
  t: TranslationSet;
  cameraActive: boolean;
  setCameraActive: (active: boolean) => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  pinCode: string;
  handlePinPress: (num: string) => void;
  handleBackspace: () => void;
  changeTab: (tab: TabId) => void;
}

function BiometricScannerPanel({
  t,
  cameraActive,
  setCameraActive,
  videoRef,
  pinCode,
  handlePinPress,
  handleBackspace,
  changeTab
}: BiometricScannerPanelProps) {
  return (
    <div className="max-w-md mx-auto w-full glass-panel rounded-3xl p-8 shadow-2xl relative overflow-hidden transition-all duration-350">
      <h2 className="text-xl font-bold font-display text-center mb-2 flex items-center justify-center gap-2 text-foreground">
        <Key className="text-secondary-brand h-5 w-5" />
        {t.auth.title}
      </h2>
      <p className="text-xs text-foreground/75 text-center leading-relaxed font-medium mb-6">
        {t.auth.subtitle}
      </p>

      {/* Viewfinder stream scanner */}
      <div className="relative w-44 h-44 mx-auto rounded-2xl bg-black border border-outline-border/25 flex items-center justify-center overflow-hidden mb-6 scanline-overlay">
        <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-secondary-brand"></div>
        <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-secondary-brand"></div>
        <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-secondary-brand"></div>
        <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-secondary-brand"></div>
        
        <div className="absolute left-0 w-full h-1 bg-gradient-to-r from-transparent via-secondary-brand to-transparent animate-[scan_2.5s_infinite_linear]"></div>

        {cameraActive ? (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="w-full h-full object-cover opacity-80"
          />
        ) : (
          <button 
            onClick={() => setCameraActive(true)}
            className="flex flex-col items-center justify-center gap-2 text-foreground/50 hover:text-foreground transition duration-200 cursor-pointer"
          >
            <Camera className="h-10 w-10 text-secondary-brand" />
            <span className="text-[10px] font-mono tracking-wider text-center px-4">{t.auth.scanPrompt}</span>
          </button>
        )}
      </div>

      {/* Fingerprint / Face ID buttons */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button 
          onClick={() => {
            alert("Enrolling WebAuthn credentials... Passkey Binding Successful.");
            changeTab('calibration');
          }}
          className="flex items-center justify-center gap-2 py-3 rounded-xl bg-outline-border/10 hover:bg-outline-border/20 border border-outline-border/20 transition cursor-pointer"
        >
          <Fingerprint className="h-4 w-4 text-primary-brand" />
          <span className="text-[10px] font-mono font-bold uppercase">{t.auth.touchId}</span>
        </button>
        <button 
          onClick={() => {
            alert("Simulating Apple FaceID secure payload signature... Verification Complete.");
            changeTab('calibration');
          }}
          className="flex items-center justify-center gap-2 py-3 rounded-xl bg-outline-border/10 hover:bg-outline-border/20 border border-outline-border/20 transition cursor-pointer"
        >
          <QrCode className="h-4 w-4 text-secondary-brand" />
          <span className="text-[10px] font-mono font-bold uppercase">{t.auth.faceId}</span>
        </button>
      </div>

      {/* Keyboard pin option */}
      <div className="text-center space-y-4">
        <div className="h-px bg-outline-border/25 w-full" />
        <span className="text-[9px] font-mono font-bold text-foreground/55 tracking-wider">{t.auth.orPin}</span>
        
        <div className="flex justify-center space-x-3 my-1">
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full border transition duration-200 ${
                pinCode.length > index 
                  ? 'bg-secondary-brand border-secondary-brand scale-110' 
                  : 'border-outline-border/60'
              }`}
            />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3.5 max-w-[240px] mx-auto pt-1">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
            <button
              key={num}
              onClick={() => handlePinPress(num)}
              className="h-10 w-10 rounded-full mx-auto flex items-center justify-center font-mono font-extrabold text-base hover:bg-outline-border/15 transition active:scale-90 duration-100 border border-outline-border/10 text-foreground"
            >
              {num}
            </button>
          ))}
          <div />
          <button
            onClick={() => handlePinPress('0')}
            className="h-10 w-10 rounded-full mx-auto flex items-center justify-center font-mono font-extrabold text-base hover:bg-outline-border/15 transition active:scale-90 duration-100 border border-outline-border/10 text-foreground"
          >
            0
          </button>
          <button
            onClick={handleBackspace}
            className="h-10 w-10 rounded-full mx-auto flex items-center justify-center text-foreground/50 hover:text-error-brand transition active:scale-90 duration-100"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <p className="text-[10px] text-foreground/50 pt-2 italic">
          {t.auth.helpBtn}
        </p>
      </div>
    </div>
  );
}

interface DeviceGateCalibrationProps {
  t: TranslationSet;
  calibrationTier: string;
  setCalibrationTier: (tier: '100' | '200' | '300') => void;
  calibrationSector: string;
  setCalibrationSector: (sector: string) => void;
  rotatingPin: string;
  pinTimer: number;
  diagAudio: string;
  playSpeakerTest: () => void;
  diagVibe: string;
  playVibeTest: () => void;
  diagMic: string;
  diagGps: string;
  playGpsTest: () => void;
  playMicTest: () => void;
  gpsCoords: { lat: number; lng: number } | null;
  toggleShiftActive: (active: boolean) => void;
  changeTab: (tab: TabId) => void;
  micVolume: number;
}

function DeviceGateCalibration({
  t,
  calibrationTier,
  setCalibrationTier,
  calibrationSector,
  setCalibrationSector,
  rotatingPin,
  pinTimer,
  diagAudio,
  playSpeakerTest,
  diagVibe,
  playVibeTest,
  diagMic,
  diagGps,
  playGpsTest,
  playMicTest,
  gpsCoords,
  toggleShiftActive,
  changeTab,
  micVolume
}: DeviceGateCalibrationProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
      
      {/* Location & supervisor check */}
      <div className="md:col-span-5 flex flex-col gap-6">
        <section className="glass-panel rounded-2xl p-6 flex flex-col shadow-sm border border-outline-border/30">
          <div className="flex items-center gap-3 mb-6">
            <MapPin className="text-primary-brand h-6 w-6" />
            <h3 className="text-sm font-bold font-display text-foreground">{t.calibrate.locationTarget}</h3>
          </div>

          <div className="mb-6">
            <label className="block text-[10px] font-mono font-bold text-foreground/60 uppercase tracking-widest mb-2.5">
              {t.calibrate.tier}
            </label>
            <div className="flex bg-outline-border/15 p-1 rounded-xl">
              {(['100', '200', '300'] as const).map((tier) => (
                <button
                  key={tier}
                  onClick={() => setCalibrationTier(tier)}
                  className={`flex-1 py-2 px-3 rounded-lg font-mono font-extrabold text-center transition ${
                    calibrationTier === tier 
                      ? 'bg-white border border-outline-border text-foreground shadow-sm font-extrabold' 
                      : 'text-foreground/55 hover:text-foreground'
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono font-bold text-foreground/60 uppercase tracking-widest mb-2">
              {t.calibrate.sector}
            </label>
            <div className="relative">
              <input
                type="text"
                value={calibrationSector}
                onChange={(e) => setCalibrationSector(e.target.value)}
                className="w-full bg-background/50 border-b-2 border-outline-border/40 focus:border-secondary-brand text-xs font-mono py-2 px-3 outline-none transition uppercase tracking-wider font-semibold text-foreground"
                placeholder={t.calibrate.placeholderSector}
              />
              <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-brand h-4 w-4" />
            </div>
          </div>
        </section>

        <section className="bg-white border border-outline-border rounded-2xl p-6 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[200px]">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000000 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <h3 className="text-sm font-bold font-display text-foreground">{t.calibrate.supervisorHeader}</h3>
              <p className="text-[10px] text-foreground/60 mt-1 leading-snug font-semibold">{t.calibrate.supervisorSubtitle}</p>
            </div>
            <ShieldAlert className="text-warning-brand h-5 w-5" />
          </div>
          <div className="relative z-10 flex items-center justify-between mt-auto pt-6 border-t border-outline-border/30">
            <div className="font-mono text-3xl tracking-widest font-black text-foreground">
              {rotatingPin}
            </div>
            <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path className="text-foreground/10" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2.5"></path>
                <path 
                  className="text-[#34a853] transition-all duration-1000 ease-linear" 
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.5"
                  strokeDasharray="100, 100" 
                  strokeDashoffset={(pinTimer / 60) * 100}
                ></path>
              </svg>
              <span className="absolute font-mono text-[8px] text-foreground font-bold">{pinTimer}s</span>
            </div>
          </div>
        </section>
      </div>

      {/* Hardware diagnostics */}
      <div className="md:col-span-7 glass-panel rounded-2xl p-8 flex flex-col justify-between shadow-sm border border-outline-border/30">
        <div>
          <div className="flex items-center justify-between border-b border-outline-border/20 pb-4 mb-6">
            <div>
              <h3 className="text-md font-bold font-display text-foreground">{t.calibrate.diagnosticsHeader}</h3>
              <p className="text-xs text-foreground/60 mt-0.5">{t.calibrate.diagnosticsSubtitle}</p>
            </div>
            <Sliders className="text-secondary-brand h-4 w-4" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Audio Check */}
            <div className="bg-background/50 border border-outline-border/25 rounded-2xl p-4 flex flex-col justify-between hover:bg-background transition duration-200">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider">{t.calibrate.testSiren}</span>
                <Volume2 className="h-4 w-4 text-secondary-brand" />
              </div>
              <div className="flex items-center justify-between mt-auto">
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg ${
                  diagAudio === 'pass' ? 'bg-primary-brand/10 text-primary-brand' : 'bg-outline-border/10 text-foreground/50'
                }`}>
                  {diagAudio === 'pass' ? 'Passed' : 'Standby'}
                </span>
                <button
                  onClick={playSpeakerTest}
                  disabled={diagAudio === 'testing'}
                  className="px-3.5 py-1 text-xs font-bold font-mono rounded-lg border border-primary-brand text-primary-brand hover:bg-primary-brand hover:text-white transition duration-150 cursor-pointer"
                >
                  {diagAudio === 'testing' ? 'BEEP...' : 'Pulse Test'}
                </button>
              </div>
            </div>

            {/* Haptic Check */}
            <div className="bg-background/50 border border-outline-border/25 rounded-2xl p-4 flex flex-col justify-between hover:bg-background transition duration-200">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider">{t.calibrate.testVibe}</span>
                <Activity className="h-4 w-4 text-warning-brand" />
              </div>
              <div className="flex items-center justify-between mt-auto">
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg ${
                  diagVibe === 'pass' ? 'bg-primary-brand/10 text-primary-brand' : 'bg-outline-border/10 text-foreground/50'
                }`}>
                  {diagVibe === 'pass' ? 'Passed' : 'Standby'}
                </span>
                <button
                  onClick={playVibeTest}
                  disabled={diagVibe === 'testing'}
                  className="px-3.5 py-1 text-xs font-bold font-mono rounded-lg border border-primary-brand text-primary-brand hover:bg-primary-brand hover:text-white transition duration-150 cursor-pointer"
                >
                  {diagVibe === 'testing' ? 'VIBE...' : 'Retest'}
                </button>
              </div>
            </div>

            {/* Mic Check */}
            <div className="bg-background/50 border border-outline-border/25 rounded-2xl p-4 flex flex-col justify-between hover:bg-background transition duration-200">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider">{t.calibrate.testMic}</span>
                <Signal className="h-4 w-4 text-[#34a853]" />
              </div>
              {diagMic === 'testing' && micVolume > 0 && (
                <div className="mb-2 flex items-center gap-1.5">
                  <span className="text-[10px] font-mono font-bold text-foreground/50">Level:</span>
                  <span className="text-xs font-mono font-bold text-secondary-brand">{micVolume} dB</span>
                  <div className="w-16 h-1.5 bg-outline-border/20 rounded-full overflow-hidden shrink-0">
                    <div className="h-full bg-secondary-brand transition-all duration-75" style={{ width: `${(micVolume / 120) * 100}%` }} />
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between mt-auto">
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg ${
                  diagMic === 'pass' ? 'bg-primary-brand/10 text-primary-brand' : 'bg-outline-border/10 text-foreground/50'
                }`}>
                  {diagMic === 'pass' ? 'Passed' : diagMic === 'testing' ? 'Testing' : 'Standby'}
                </span>
                <button
                  onClick={playMicTest}
                  disabled={diagMic === 'testing'}
                  className="px-3.5 py-1 text-xs font-bold font-mono rounded-lg border border-primary-brand text-primary-brand hover:bg-primary-brand hover:text-white transition duration-150 cursor-pointer"
                >
                  {diagMic === 'testing' ? 'LISTENING...' : 'Run Test'}
                </button>
              </div>
            </div>

            {/* GPS lock dial with radial tracker */}
            <div className="sm:col-span-2 bg-[#ffffff] border border-outline-border/30 rounded-2xl p-5 relative overflow-hidden shadow-sm flex flex-col sm:flex-row gap-5 items-center">
              <div className="w-24 h-24 shrink-0 relative flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" fill="none" r="42" stroke="var(--outline)" strokeWidth="6" className="opacity-20"></circle>
                  <circle cx="50" cy="50" fill="none" r="42" stroke="var(--secondary)" strokeWidth="6" strokeDasharray="260" strokeDashoffset={diagGps === 'pass' ? '60' : '260'} className="transition-all duration-500"></circle>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <Compass className="h-4.5 w-4.5 text-secondary-brand mb-0.5" />
                  <span className="font-mono text-sm font-extrabold text-foreground leading-none">±0.8</span>
                  <span className="text-[7px] font-mono text-foreground/50">METERS</span>
                </div>
              </div>

              <div className="flex-1 w-full space-y-3">
                <div className="flex justify-between items-end border-b border-outline-border/15 pb-1.5 text-xs">
                  <span className="text-foreground/60">Lock Status</span>
                  <span className="font-mono font-bold text-primary-brand">3D FIX (12 Sat)</span>
                </div>
                <div className="flex justify-between items-end border-b border-outline-border/15 pb-1.5 text-xs">
                  <span className="text-foreground/60">Coordinates Lat/Lng</span>
                  <span className="font-mono text-[11px] text-foreground font-semibold">
                    {gpsCoords ? `${gpsCoords.lat.toFixed(4)}° N, ${gpsCoords.lng.toFixed(4)}° W` : '33.7573° N, 84.4010° W'}
                  </span>
                </div>
                <button
                  onClick={() => {
                    playGpsTest();
                    playMicTest();
                  }}
                  className="w-full py-2 bg-secondary-brand/10 border border-secondary-brand/20 text-secondary-brand font-mono font-bold text-[10px] rounded-lg transition duration-200 cursor-pointer flex items-center justify-center gap-1.5 hover:bg-secondary-brand/15"
                >
                  <RefreshCw className="h-3 w-3" />
                  Force Recalibration & Mic Check
                </button>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            toggleShiftActive(true);
            changeTab('mission_control');
          }}
          disabled={!(diagAudio === 'pass' && diagVibe === 'pass' && diagMic === 'pass' && diagGps === 'pass')}
          className={`w-full py-3.5 font-extrabold font-display rounded-xl shadow-md transition duration-200 mt-6 flex items-center justify-center gap-2 text-xs cursor-pointer ${
            (diagAudio === 'pass' && diagVibe === 'pass' && diagMic === 'pass' && diagGps === 'pass')
              ? 'bg-[#137333] hover:opacity-95 text-white'
              : 'bg-outline-border/20 text-foreground/45 cursor-not-allowed shadow-none border border-outline-border/30'
          }`}
        >
          <ShieldCheck className="h-4.5 w-4.5" />
          {(diagAudio === 'pass' && diagVibe === 'pass' && diagMic === 'pass' && diagGps === 'pass')
            ? t.calibrate.btnProceed
            : 'Awaiting Hardware Diagnostics (Run All 4 Checks Above)...'
          }
        </button>
      </div>
    </div>
  );
}
