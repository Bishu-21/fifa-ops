import React from 'react';
import { 
  Play, 
  MapPin, 
  CheckCircle, 
  LogOut, 
  ShieldAlert, 
  Activity, 
  Compass, 
  ClipboardCheck, 
  Clock,
  Check,
  Volume2
} from 'lucide-react';
import { StadiumTelemetry, OperationalDirective } from '@fifa/core';
import { TranslationSet } from '@/lib/translations';
import { TelemetryMetricsCard } from './TelemetryMetricsCard';
import { SystemIntegrityMonitor } from './SystemIntegrityMonitor';

type TabId = 'mission_control' | 'off_ramp';

export interface DashboardTask {
  id: number;
  key: string;
  done: boolean;
  label: string;
}

export interface MissionControlProps {
  t: TranslationSet;
  shiftActive: boolean;
  changeTab: (tab: TabId) => void;
  layoutMode: 'grid' | 'list';
  attTasks: DashboardTask[];
  mbTasks: DashboardTask[];
  toggleAttTask: (id: number) => void;
  telemetry: StadiumTelemetry | null;
  activeDirective: OperationalDirective | null;
  acknowledgedDirectives: Record<string, boolean>;
  acknowledging: string | null;
  handleAcknowledge: (directiveId: string) => Promise<void>;
  selectedLanguage: 'en' | 'es' | 'pt';
  setSelectedLanguage: (lang: 'en' | 'es' | 'pt') => void;
  selectedZone: string;
  setSelectedZone: (zone: string) => void;
  isSimulating: boolean;
  triggerSimulation: (scenario: 'safe' | 'surge_c' | 'surge_a') => Promise<void>;
  toggleShiftActive: (active: boolean) => void;
  anomalyThresholdDensity: number;
  anomalyThresholdCongestion: number;
  activeModelName: string;
}

export function MissionControl({
  t,
  shiftActive,
  changeTab,
  layoutMode,
  attTasks,
  mbTasks,
  toggleAttTask,
  telemetry,
  activeDirective,
  acknowledgedDirectives,
  acknowledging,
  handleAcknowledge,
  selectedLanguage,
  setSelectedLanguage,
  selectedZone,
  setSelectedZone,
  isSimulating,
  triggerSimulation,
  toggleShiftActive,
  anomalyThresholdDensity,
  anomalyThresholdCongestion,
  activeModelName
}: MissionControlProps) {
  return (
    <>
      {!shiftActive ? (
        <div className="space-y-8 animate-fadeIn">
          {/* Welcome Header panel */}
          <section className="glass-panel p-8 rounded-3xl relative overflow-hidden shadow-sm">
            <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-secondary-brand/10 to-transparent pointer-events-none" />
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
              <div>
                <span className="text-[9px] font-mono font-bold text-secondary-brand uppercase tracking-widest mb-1.5 block">{t.mission.preShiftTag}</span>
                <h1 className="text-2xl md:text-3xl font-bold font-display text-foreground leading-tight">{t.mission.welcomeTitle}</h1>
                <p className="text-xs text-foreground/70 max-w-2xl mt-1 font-medium leading-relaxed">
                  {t.mission.welcomeDesc}
                </p>
              </div>
              <button 
                onClick={() => toggleShiftActive(true)}
                className="bg-[#137333] hover:opacity-95 text-white px-6 py-3.5 rounded-xl font-bold text-xs shadow-md transition active:scale-95 duration-100 flex items-center gap-2 cursor-pointer"
              >
                <Play className="h-4 w-4 fill-current" />
                {t.mission.startShift}
              </button>
            </div>
          </section>

          {/* Bento Grid layout */}
          <div className={layoutMode === 'grid' ? "grid grid-cols-1 lg:grid-cols-12 gap-8" : "flex flex-col gap-8"}>
            {/* Left side: checklists */}
            <div className={layoutMode === 'grid' ? "lg:col-span-8 space-y-6" : "space-y-6 w-full"}>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold font-display text-foreground">{t.mission.checklistHeader}</h2>
                <span className="bg-outline-border/20 text-foreground/60 px-2.5 py-0.5 rounded-full font-mono text-[10px]">{t.mission.checklistLocations}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* AT&T Stadium */}
                <div className="glass-panel rounded-2xl p-6 relative overflow-hidden group flex flex-col justify-between min-h-[260px]">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-outline-border/20 rounded-bl-full -z-10 group-hover:scale-110 transition duration-300 pointer-events-none" />
                  <div>
                    {/* FlexBoard layout with flex-wrap so status badges stack below the title when space is narrow */}
                    <div className="flex flex-wrap justify-between items-start gap-2 mb-6">
                      <div className="min-w-[120px] break-words">
                        <h3 className="font-bold text-sm font-display leading-tight text-foreground">{t.mission.attStadium}</h3>
                        <p className="text-[10px] font-mono text-foreground/85 font-semibold flex items-center gap-1 mt-1.5">
                          <MapPin className="h-3.5 w-3.5 text-foreground/80 shrink-0" /> {t.mission.attSector}
                        </p>
                      </div>
                      <span className="text-[10px] font-mono bg-[#e6f4ea] text-[#0b5327] border border-[#0b5327]/30 px-2.5 py-1.5 rounded-lg shrink-0 font-black tracking-wide">{t.mission.attReady}</span>
                    </div>

                    <ul className="space-y-6">
                      {attTasks.map((task) => (
                        <li key={task.id} className="flex items-center gap-3 text-xs font-bold text-foreground leading-relaxed py-1">
                          <button 
                            onClick={() => toggleAttTask(task.id)} 
                            role="checkbox"
                            aria-checked={task.done}
                            aria-label={`Mark task "${task.label}" as ${task.done ? 'incomplete' : 'complete'}`}
                            className="w-10 h-10 flex items-center justify-center text-foreground/50 hover:text-primary-brand transition focus:ring-2 focus:ring-[#137333] outline-none rounded-xl cursor-pointer shrink-0 border border-outline-border/10 hover:bg-outline-border/10"
                          >
                            {task.done ? (
                              <CheckCircle className="h-5 w-5 text-primary-brand fill-current" />
                            ) : (
                              <span className="h-5 w-5 rounded-full border border-outline-border block" />
                            )}
                          </button>
                          <span className={task.done ? 'line-through decoration-[#ea4335]/70 decoration-2 text-foreground/50 font-medium select-none' : 'break-words'}>
                            {task.label}
                            {task.done && <span className="sr-only"> (Completed)</span>}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Mercedes Benz Stadium */}
                <div className="glass-panel rounded-2xl p-6 relative overflow-hidden group flex flex-col justify-between min-h-[260px] opacity-80">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-outline-border/20 rounded-bl-full -z-10 group-hover:scale-110 transition duration-300 pointer-events-none" />
                  <div>
                    <div className="flex flex-wrap justify-between items-start gap-2 mb-6">
                      <div className="min-w-[120px] break-words">
                        <h3 className="font-bold text-sm font-display leading-tight text-foreground">{t.mission.mbStadium}</h3>
                        <p className="text-[10px] font-mono text-foreground/85 font-semibold flex items-center gap-1 mt-1.5">
                          <MapPin className="h-3.5 w-3.5 text-foreground/80 shrink-0" /> {t.mission.mbZone}
                        </p>
                      </div>
                      <span className="text-[10px] font-mono bg-outline-border/30 text-foreground/70 border border-outline-border/50 px-2.5 py-1.5 rounded-lg shrink-0 font-extrabold tracking-wide">{t.mission.mbPending}</span>
                    </div>

                    <ul className="space-y-6">
                      {mbTasks.map((task) => (
                        <li key={task.id} className="flex items-center gap-3 text-xs font-bold text-foreground/45 leading-relaxed py-1 select-none">
                          <div className="w-10 h-10 flex items-center justify-center shrink-0 border border-outline-border/10 rounded-xl bg-outline-border/5">
                            <span className="h-5 w-5 rounded-full border border-outline-border/40 block" />
                          </div>
                          <span className="break-words font-semibold text-foreground/45">
                            {task.label}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: timeline & routes */}
            <div className={layoutMode === 'grid' ? "lg:col-span-4 space-y-6" : "space-y-6 w-full"}>
              {/* Operational Timeline */}
              <div className="glass-panel rounded-2xl p-6 relative overflow-hidden">
                <h3 className="text-sm font-bold font-display text-foreground mb-4 border-b border-outline-border/20 pb-2 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-secondary-brand" />
                  {t.mission.timelineHeader}
                </h3>
                <div className="space-y-6 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1.5px] before:bg-outline-border/30">
                  <div className="relative pl-6 flex items-start gap-3">
                    <div className="absolute left-[3.5px] top-1.5 w-2.5 h-2.5 rounded-full bg-outline-border" />
                    <div>
                      <div className="font-mono text-[10px] text-foreground/50 font-bold">08:00 AM</div>
                      <div className="text-xs font-sans font-semibold text-foreground/75 mt-0.5">{t.mission.timelineBriefing}</div>
                    </div>
                  </div>
                  <div className="relative pl-6 flex items-start gap-3">
                    <div className="absolute left-[2.5px] top-1 w-3 h-3 rounded-full bg-secondary-brand ring-4 ring-secondary-brand/20" />
                    <div>
                      <div className="font-bold text-secondary-brand flex items-center gap-1">10:30 AM <span className="bg-secondary-brand/10 px-1 rounded text-[8px]">{t.mission.timelineActive}</span></div>
                      <div className="text-xs font-sans font-black text-foreground mt-0.5">{t.mission.timelineDeploy}</div>
                    </div>
                  </div>
                  <div>
                    <div className="font-bold">01:00 PM</div>
                    <div className="text-xs font-sans font-semibold text-foreground/70 mt-0.5">{t.mission.timelineGatesOpen}</div>
                  </div>
                </div>
              </div>

              {/* Transit Routes map box */}
              <div className="glass-panel rounded-2xl p-0 overflow-hidden border border-outline-border/30 h-44 flex flex-col relative">
                <div className="p-3 border-b border-outline-border/20 bg-background/55 backdrop-blur-sm z-10 flex justify-between items-center">
                  <h4 className="text-[11px] font-bold font-display flex items-center gap-1.5">
                    <Compass className="h-3.5 w-3.5 text-secondary-brand" /> {t.mission.transitRoutesHeader}
                  </h4>
                </div>
                <div className="flex-1 bg-outline-border/5 relative overflow-hidden">
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
                <span className="text-[9px] font-mono font-bold text-[#137333] uppercase tracking-widest mb-1 block">{t.deck.subtitle}</span>
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
                        <h4 className="text-xs font-mono font-bold text-foreground/50 uppercase tracking-wider mb-1">Recommended Action Route</h4>
                        <span className="inline-block px-3 py-1.5 rounded-lg bg-[#137333]/10 text-[#137333] text-xs font-bold font-mono">
                          {activeDirective.recommendedRoute.join(' ➔ ')}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-xs font-mono font-bold text-foreground/50 uppercase tracking-wider mb-2">{t.deck.actionHeader}</h4>
                        <ul className="space-y-3">
                          {activeDirective.actionSteps.map((step, idx) => (
                            <li key={idx} className="flex items-start gap-2.5 text-xs text-foreground font-semibold leading-relaxed">
                              <span className="h-5 w-5 shrink-0 rounded-full bg-outline-border/20 flex items-center justify-center font-mono text-[9px] font-bold text-foreground/60">{idx + 1}</span>
                              <span className="pt-0.5">{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-xs font-mono font-bold text-foreground/50 uppercase tracking-wider mb-1">AI Reasoning</h4>
                        <p className="text-xs text-foreground/70 italic leading-relaxed bg-outline-border/5 p-3 rounded-xl border border-outline-border/15 font-semibold">
                          &ldquo;{activeDirective.reasoning}&rdquo;
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col justify-between h-full flex-grow animate-fadeIn">
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
                  <div className="border-t border-outline-border/25 pt-5 mt-6 flex items-center justify-between">
                    <span className="text-[9px] font-mono text-foreground/45 font-semibold">ID: {activeDirective.id.substring(0, 8)}</span>
                    <button
                      onClick={() => handleAcknowledge(activeDirective.id)}
                      disabled={acknowledgedDirectives[activeDirective.id] || acknowledging === activeDirective.id}
                      className={`px-4.5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition active:scale-95 duration-100 cursor-pointer ${
                        acknowledgedDirectives[activeDirective.id]
                          ? 'bg-outline-border/15 border border-outline-border/30 text-foreground/50 cursor-default'
                          : 'bg-primary-brand text-white shadow hover:opacity-95 disabled:opacity-50'
                      }`}
                    >
                      {acknowledgedDirectives[activeDirective.id] 
                        ? <><Check className="h-4 w-4" /> Acknowledged</> 
                        : acknowledging === activeDirective.id 
                          ? 'Processing...' 
                          : t.deck.btnAcknowledge}
                    </button>
                  </div>
                )}
              </div>

              {/* Public Announcement Script generator */}
              <div className="glass-panel rounded-2xl p-6 border border-outline-border/30">
                <div className="flex justify-between items-center border-b border-outline-border/20 pb-3.5 mb-5">
                  <h3 className="text-sm font-bold font-display text-foreground flex items-center gap-2">
                    <Volume2 className="h-4.5 w-4.5 text-secondary-brand" />
                    {t.deck.announcementHeader}
                  </h3>
                  <div className="flex gap-1.5 bg-outline-border/10 p-1 rounded-xl">
                    {(['en', 'es', 'pt'] as const).map((langCode) => (
                      <button
                        key={langCode}
                        onClick={() => setSelectedLanguage(langCode)}
                        className={`px-2.5 py-1 rounded-lg font-mono text-[9px] font-bold uppercase transition ${
                          selectedLanguage === langCode 
                            ? 'bg-white border border-outline-border text-foreground shadow-xs font-black' 
                            : 'text-foreground/55 hover:text-foreground'
                        }`}
                      >
                        {langCode}
                      </button>
                    ))}
                  </div>
                </div>

                {activeDirective && (
                  <div className="space-y-4">
                    <div className="bg-[#ffffff] p-4 rounded-xl border border-outline-border/20 relative">
                      <p className="text-xs font-mono font-semibold text-foreground/80 leading-relaxed pr-8">
                        {activeDirective.announcements[selectedLanguage] || 'No script loaded.'}
                      </p>
                      <button
                        onClick={() => {
                          try {
                            navigator.clipboard.writeText(activeDirective.announcements[selectedLanguage]);
                            alert(t.alerts.copiedScript);
                          } catch {
                            // Clipboard API unavailable — fail silently
                            alert(t.alerts.copiedScript);
                          }
                        }}
                        className="absolute right-3 top-3 p-1.5 hover:bg-outline-border/15 text-foreground/60 hover:text-foreground rounded-lg transition active:scale-90 cursor-pointer"
                        title={t.alerts.copyScriptTitle}
                        aria-label={t.alerts.copyScriptTitle || 'Copy announcement script'}
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
                        {['gateA', 'gateB', 'gateC', 'gateD'].map((key) => {
                          const z = t.alerts[key as 'gateA' | 'gateB' | 'gateC' | 'gateD'];
                          return (
                            <option key={key} value={z} className="bg-[#fdf9f4] text-foreground">{z}</option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                )}
              </div>
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

                <div className="bg-outline-border/5 rounded-xl border border-outline-border/20 aspect-video relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 opacity-[0.2]" style={{ backgroundImage: 'radial-gradient(#137333 1.5px, transparent 1.5px)', backgroundSize: '16px 16px' }} />
                  
                  <div className="w-40 h-24 rounded-[40px] border-4 border-foreground/15 flex items-center justify-center relative">
                    <div className="w-32 h-16 rounded-[30px] border-2 border-dashed border-foreground/10 flex items-center justify-center">
                      <span className="font-display font-black text-[9px] text-foreground/20 tracking-widest">PITCH</span>
                    </div>
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-[8px] font-mono font-bold bg-white px-1.5 text-foreground/50 border border-outline-border/20 rounded">
                      GATE A
                    </div>
                    <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 text-[8px] font-mono font-bold bg-white px-1.5 text-foreground/50 border border-outline-border/20 rounded">
                      GATE C
                    </div>
                    <div className="absolute -left-4 top-1/2 -translate-y-1/2 text-[8px] font-mono font-bold bg-white px-1.5 text-foreground/50 border border-outline-border/20 rounded rotate-90">
                      GATE D
                    </div>
                    <div className="absolute -right-4 top-1/2 -translate-y-1/2 text-[8px] font-mono font-bold bg-white px-1.5 text-foreground/50 border border-outline-border/20 rounded -rotate-90">
                      GATE B
                    </div>
                  </div>

                  {telemetry && telemetry.anomalyDetected && (
                    <div 
                      className="absolute h-4 w-4 bg-[#ea4335] rounded-full origin-center border border-white shadow-md opacity-90 animate-ping"
                      style={{
                        left: `${telemetry.coordinates.x * 100}%`,
                        top: `${telemetry.coordinates.y * 100}%`
                      }}
                    />
                  )}
                  {telemetry && telemetry.anomalyDetected && (
                    <div 
                      className="absolute h-2.5 w-2.5 bg-[#ea4335] rounded-full border border-white origin-center shadow-lg"
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
      )}
    </>
  );
}
