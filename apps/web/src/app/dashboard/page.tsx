'use client';

import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  limit, 
  onSnapshot 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { StadiumTelemetry, OperationalDirective } from '@fifa/core';
import { translations, Language } from '@/lib/translations';

// Storage persistence helpers
import {
  getSavedLanguage,
  saveLanguage,
  getSavedTab,
  saveTab,
  getSavedLayout,
  saveLayout,
  getSavedShiftActive,
  saveShiftActive
} from '@/lib/storage';

// Modular Layout Wrapper & Subcomponents
import { DashboardShell } from './components/DashboardShell';
import { MissionControl } from './components/MissionControl';
import { OffRampPanel } from './components/OffRampPanel';

type TabId = 'mission_control' | 'off_ramp';

export default function Dashboard() {
  const { user, loading, isDemo, getOperatorIdentity, logout } = useAuth();
  const router = useRouter();

  // Unified persistent configurations loaded lazily from storage
  const [lang, setLang] = useState<Language>(() => getSavedLanguage());
  const [activeTab, setActiveTab] = useState<TabId>(() => getSavedTab());
  const [layoutMode, setLayoutMode] = useState<'grid' | 'list'>(() => getSavedLayout());
  const [shiftActive, setShiftActive] = useState<boolean>(() => getSavedShiftActive());

  const t = translations[lang];

  // Real-time telemetry streams from Firestore
  const [telemetry, setTelemetry] = useState<StadiumTelemetry | null>(null);
  const [directives, setDirectives] = useState<OperationalDirective[]>([]);
  // Derive announcement language from interface language (only en/es/pt have announcements)
  const announcementLang: 'en' | 'es' | 'pt' = (lang === 'es' || lang === 'pt') ? lang : 'en';
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'es' | 'pt'>(announcementLang);
  const [selectedZone, setSelectedZone] = useState<string>('Gate C');

  const [isSimulating, setIsSimulating] = useState(false);
  const [acknowledging, setAcknowledging] = useState<string | null>(null);
  const [acknowledgedDirectives, setAcknowledgedDirectives] = useState<Record<string, boolean>>({});

  // Active Model configuration state (Gemini 3.1 Flash Lite as standard)
  const activeModelName = 'gemini-3.1-flash-lite';
  const anomalyThresholdDensity = 0.85;
  const anomalyThresholdCongestion = 0.80;

  // Onboarding checklists states (mission control view)
  const [attTaskStates, setAttTaskStates] = useState([
    { id: 1, key: 'taskCollectLanyard' as const, done: true },
    { id: 2, key: 'taskVerifyComms' as const, done: true },
    { id: 3, key: 'taskInspectBarriers' as const, done: false },
    { id: 4, key: 'taskSyncBiometric' as const, done: false }
  ]);
  const attTasks = attTaskStates.map(task => ({ ...task, label: t.mission[task.key] }));

  const mbTaskKeys = [
    { id: 1, key: 'taskSecurityClearance' as const, done: false, locked: true },
    { id: 2, key: 'taskCalibrateDetectors' as const, done: false, locked: true },
    { id: 3, key: 'taskReviewVipRoster' as const, done: false, locked: true }
  ];
  const mbTasks = mbTaskKeys.map(task => ({ ...task, label: t.mission[task.key] }));

  const toggleAttTask = (id: number) => {
    setAttTaskStates(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };
  // Off-Ramp State Purge logic
  const [reportingIncident, setReportingIncident] = useState(false);
  const [wipingState, setWipingState] = useState(false);

  // Sync announcement language when interface language changes
  useEffect(() => {
    const next: 'en' | 'es' | 'pt' = (lang === 'es' || lang === 'pt') ? lang : 'en';
    setSelectedLanguage(next);
  }, [lang]);

  // Auth Redirect Gate
  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  // Firestore Telemetry Intake Streams
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

  // State Persistence syncs
  const changeTab = (tab: TabId) => {
    setActiveTab(tab);
    saveTab(tab);
  };

  const changeLanguage = (newLang: Language) => {
    setLang(newLang);
    saveLanguage(newLang);
  };

  const toggleLayoutMode = () => {
    const nextLayout = layoutMode === 'grid' ? 'list' : 'grid';
    setLayoutMode(nextLayout);
    saveLayout(nextLayout);
  };

  const toggleShiftActive = (active: boolean) => {
    setShiftActive(active);
    saveShiftActive(active);
  };

  // Firestore Directive acknowledgment action
  const handleAcknowledge = async (directiveId: string) => {
    if (acknowledging === directiveId) return;
    setAcknowledging(directiveId);
    try {
      await addDoc(collection(db, 'acknowledgments'), {
        directiveId,
        acknowledgedAt: new Date().toISOString(),
        volunteerEmail: getOperatorIdentity(),
      });
      setAcknowledgedDirectives(prev => ({ ...prev, [directiveId]: true }));
    } catch (err) {
      console.error('Acknowledgment log failed:', err);
      // Offline fallback state update
      setAcknowledgedDirectives(prev => ({ ...prev, [directiveId]: true }));
    } finally {
      setAcknowledging(null);
    }
  };

  // Incident Logger Guardrail
  const submitIncidentReport = async (text: string) => {
    const cleanText = text.trim();
    if (!cleanText) return;

    // Bounds Check: Prevent database flooding
    if (cleanText.length > 1000) {
      alert(t.alerts.reportTooLong || 'Incident details exceed the 1000 characters limit.');
      return;
    }

    // Security sanitization: strip dangerous HTML tags and injection vectors
    const sanitizedText = cleanText
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '[REDACTED]')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '[REDACTED]')
      .replace(/<img\b[^>]*>/gi, '[REDACTED]')
      .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '[REDACTED]')
      .replace(/javascript:/gi, '[REDACTED PROTOCOL]')
      .replace(/onerror\s*=/gi, 'x-onerror=')
      .replace(/onload\s*=/gi, 'x-onload=');

    setReportingIncident(true);
    try {
      await addDoc(collection(db, 'reports'), {
        reporter: getOperatorIdentity(),
        sector: selectedZone || 'Gate C',
        tier: '100',
        details: sanitizedText,
        timestamp: new Date().toISOString()
      });
      alert(t.alerts.reportSuccess);
    } catch (err) {
      console.error(err);
      alert(t.alerts.reportFailed);
    } finally {
      setReportingIncident(false);
    }
  };

  // Telemetry AI Directive simulator scenario trigger
  const triggerSimulation = async (scenario: 'safe' | 'surge_c' | 'surge_a') => {
    if (isSimulating) return;
    setIsSimulating(true);

    let simulatedData: StadiumTelemetry;

    if (scenario === 'safe') {
      simulatedData = {
        stadiumId: 'MetLife-NYNJ',
        timestamp: new Date().toISOString(),
        crowdDensity: 0.35,
        noiseLevelDb: 70,
        spatialCongestionRatio: 0.25,
        anomalyDetected: false,
        anomalyDescription: 'Sensors nominal. Flow streams moving normally for the Argentina vs Spain FIFA World Cup 2026 Final.',
        coordinates: { x: 0.5, y: 0.5 }
      };
    } else if (scenario === 'surge_c') {
      simulatedData = {
        stadiumId: 'MetLife-NYNJ',
        timestamp: new Date().toISOString(),
        crowdDensity: 0.94,
        noiseLevelDb: 104,
        spatialCongestionRatio: 0.92,
        anomalyDetected: true,
        anomalyDescription: 'ALERT: Crowd bottleneck surge at Gate C turnstile. High density of fans from Spain and Argentina trying to enter. Local cellular networks congested.',
        coordinates: { x: 0.8, y: 0.85 }
      };
    } else {
      simulatedData = {
        stadiumId: 'MetLife-NYNJ',
        timestamp: new Date().toISOString(),
        crowdDensity: 0.90,
        noiseLevelDb: 98,
        spatialCongestionRatio: 0.88,
        anomalyDetected: true,
        anomalyDescription: 'ALERT: East Ramp egress route blocked by tournament presentation and broadcast equipment for the Messi vs Lamine Yamal trophy ceremony. Redirection required.',
        coordinates: { x: 0.72, y: 0.45 }
      };
    }

    try {
      // Write telemetry to Firestore for audit trail
      await addDoc(collection(db, 'telemetry'), simulatedData);

      // Generate directive via server action (Gemini API key stays server-side)
      const { processTelemetryAndGetDirective } = await import('@/app/actions/directives');
      const directive = await processTelemetryAndGetDirective(simulatedData);
      await addDoc(collection(db, 'directives'), directive);
    } catch (err) {
      console.error('Simulation pipeline error:', err);
    } finally {
      setIsSimulating(false);
    }
  };

  // Secure purge on offramp signout
  const handleWipePurge = async () => {
    setWipingState(true);
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('fifa_lang');
        localStorage.removeItem('fifa_layout');
        sessionStorage.removeItem('fifa_active_tab');
        sessionStorage.removeItem('fifa_shift_active');
      }
      await logout();
      router.push('/');
    } catch (err) {
      console.error('Wipe failed:', err);
    } finally {
      setWipingState(false);
    }
  };

  // Active Directive (Latest directive matching telemetry timestamp)
  const activeDirective = directives.find(d => {
    if (!telemetry) return false;
    return d.telemetryId === (telemetry.timestamp + '_' + telemetry.stadiumId);
  }) || directives[0] || null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdf9f4]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-emerald-500/35 border-t-emerald-500 rounded-full animate-spin"></div>
          <p className="text-foreground/75 font-mono text-sm tracking-widest uppercase">Securing Accreditations...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardShell
      t={t}
      activeTab={activeTab}
      changeTab={changeTab}
      layoutMode={layoutMode}
      toggleLayoutMode={toggleLayoutMode}
      lang={lang}
      changeLanguage={changeLanguage}
      user={user}
      selectedZone={selectedZone}
      maintenanceMode={isDemo}
    >
      {activeTab === 'mission_control' && (
        <MissionControl
          t={t}
          shiftActive={shiftActive}
          changeTab={changeTab}
          layoutMode={layoutMode}
          attTasks={attTasks}
          mbTasks={mbTasks}
          toggleAttTask={toggleAttTask}
          telemetry={telemetry}
          activeDirective={activeDirective}
          acknowledgedDirectives={acknowledgedDirectives}
          acknowledging={acknowledging}
          handleAcknowledge={handleAcknowledge}
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
          selectedZone={selectedZone}
          setSelectedZone={setSelectedZone}
          isSimulating={isSimulating}
          triggerSimulation={triggerSimulation}
          toggleShiftActive={toggleShiftActive}
          anomalyThresholdDensity={anomalyThresholdDensity}
          anomalyThresholdCongestion={anomalyThresholdCongestion}
          activeModelName={activeModelName}
        />
      )}
      {activeTab === 'off_ramp' && (
        <OffRampPanel
          t={t}
          user={user}
          submitIncidentReport={submitIncidentReport}
          reportingIncident={reportingIncident}
          wipingState={wipingState}
          handleWipePurge={handleWipePurge}
        />
      )}
    </DashboardShell>
  );
}
