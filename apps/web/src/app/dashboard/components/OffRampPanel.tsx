import React, { useState } from 'react';
import { Shield, ClipboardCheck, UserCheck, KeyRound } from 'lucide-react';
import { TranslationSet } from '@/lib/translations';
import type { User } from 'firebase/auth';

export interface OffRampPanelProps {
  t: TranslationSet;
  user: User | null;
  submitIncidentReport: (text: string) => Promise<void>;
  reportingIncident: boolean;
  wipingState: boolean;
  handleWipePurge: () => Promise<void>;
}

export function OffRampPanel({
  t,
  user,
  submitIncidentReport,
  reportingIncident,
  wipingState,
  handleWipePurge
}: OffRampPanelProps) {
  // Encapsulated local form states
  const [incidentText, setIncidentText] = useState('');
  const [swipeProgress, setSwipeProgress] = useState(0);

  // Gear Return Checklist state
  const [gearMega, setGearMega] = useState(false);
  const [gearVest, setGearVest] = useState(false);
  const [gearLanyard, setGearLanyard] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanText = incidentText.trim();
    if (!cleanText) return;
    await submitIncidentReport(cleanText);
    setIncidentText('');
  };

  return (
    <div className="w-full space-y-8 animate-fadeIn max-w-6xl mx-auto">
      
      {/* Intro Header */}
      <section className="glass-panel p-8 rounded-3xl relative overflow-hidden shadow-sm">
        <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-red-500/5 to-transparent pointer-events-none" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div>
            <span className="text-[9px] font-mono font-bold text-[#ea4335] uppercase tracking-widest mb-1.5 block">Shift Wrap-Up</span>
            <h1 className="text-2xl md:text-3xl font-bold font-display text-foreground leading-tight">{t.offramp.title}</h1>
            <p className="text-xs text-foreground/70 max-w-2xl mt-1 font-medium leading-relaxed">
              {t.offramp.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Two-Column Spacing Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Equipment Return Checkoff & Accreditation Identification card */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* 1. Gear Return Checklist Card */}
          <div className="glass-panel p-6 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-outline-border/10">
              <ClipboardCheck className="h-4.5 w-4.5 text-[#137333]" />
              <h2 className="text-sm font-bold font-display text-foreground">{t.offramp.equipmentHeader}</h2>
            </div>
            
            <p className="text-[11px] text-foreground/60 leading-relaxed font-medium">
              Volunteers must hand back all physical items. Please check off all returned gear below:
            </p>

            <div className="space-y-2.5 pt-2">
              <label className="flex items-center gap-3 p-3 bg-background/40 hover:bg-background/80 border border-outline-border/15 rounded-xl transition cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={gearMega} 
                  onChange={(e) => setGearMega(e.target.checked)} 
                  className="h-4 w-4 rounded border-outline-border text-[#137333] focus:ring-[#137333] cursor-pointer"
                />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-foreground">Steward Megaphone & Radio</span>
                  <span className="text-[10px] text-foreground/50">Return charger and battery pack</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-background/40 hover:bg-background/80 border border-outline-border/15 rounded-xl transition cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={gearVest} 
                  onChange={(e) => setGearVest(e.target.checked)} 
                  className="h-4 w-4 rounded border-outline-border text-[#137333] focus:ring-[#137333] cursor-pointer"
                />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-foreground">High-Vis Sector Vest</span>
                  <span className="text-[10px] text-foreground/50">Verify high-vis print is clean and intact</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-background/40 hover:bg-background/80 border border-outline-border/15 rounded-xl transition cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={gearLanyard} 
                  onChange={(e) => setGearLanyard(e.target.checked)} 
                  className="h-4 w-4 rounded border-outline-border text-[#137333] focus:ring-[#137333] cursor-pointer"
                />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-foreground">RFID Badge & Lanyard</span>
                  <span className="text-[10px] text-foreground/50">Drop in secure key card deposit bin</span>
                </div>
              </label>
            </div>
          </div>

          {/* 2. Accreditation Display Card */}
          <div className="bg-[#fdfbf7] border border-[#ebdcd0] p-6 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#ebdcd0]/60">
              <UserCheck className="h-4.5 w-4.5 text-[#b45309]" />
              <h2 className="text-sm font-bold font-display text-foreground">{t.modals.operatorName}</h2>
            </div>

            <div className="flex items-center gap-4 py-2">
              <div className="w-12 h-12 rounded-full bg-[#f4ece1] border border-[#ebdcd0] flex items-center justify-center text-foreground/70 text-lg font-bold">
                7G
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] font-mono font-bold uppercase text-[#b45309] bg-[#fef3c7] px-2 py-0.5 rounded-md">
                  {t.alerts.activeSteward}
                </span>
                <h3 className="text-xs font-bold text-foreground">{user?.email || 'Demo Operator'}</h3>
                <p className="text-[10px] text-foreground/50 font-mono">UID: {user?.uid?.substring(0, 16)?.toUpperCase()}</p>
              </div>
            </div>

            <div className="p-4 bg-white border border-[#ebdcd0] rounded-xl flex flex-col items-center justify-center space-y-2.5">
              <span className="text-[9px] font-mono font-bold text-foreground/50 uppercase tracking-widest">
                {t.offramp.equipmentBarcode}
              </span>
              <svg className="w-full max-w-[240px] h-10 text-foreground" viewBox="0 0 100 20">
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
              <span className="text-[8px] font-mono text-foreground/40 font-bold">*{user?.uid?.substring(0, 12)?.toUpperCase()}*</span>
            </div>
          </div>
        </div>

        {/* Right Side: Incident Logger & Wipe Swipe off-ramp */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* 3. Incidents logger form */}
          <div className="glass-panel p-6 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-outline-border/10">
              <Shield className="text-[#ea4335] h-4.5 w-4.5" />
              <h2 className="text-sm font-bold font-display text-foreground">{t.offramp.incidentHeader}</h2>
            </div>
            
            <p className="text-[11px] text-foreground/60 leading-relaxed font-medium">
              {t.offramp.incidentDesc}
            </p>

            <form onSubmit={handleSubmit} className="space-y-3 pt-1">
              <textarea
                value={incidentText}
                onChange={(e) => setIncidentText(e.target.value)}
                placeholder={t.offramp.inputPlaceholder}
                className="w-full bg-background/55 border border-outline-border/30 rounded-xl p-3 text-xs outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/25 min-h-[90px] font-mono resize-none text-foreground"
              />
              <button
                type="submit"
                disabled={reportingIncident || !incidentText.trim()}
                className="w-full py-2.5 px-4 rounded-xl text-xs bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-[#ea4335] font-bold transition disabled:opacity-40 cursor-pointer flex items-center justify-center gap-1.5 focus:ring-2 focus:ring-red-500 outline-none"
              >
                {reportingIncident ? 'Logging...' : 'Submit Incident Report'}
              </button>
            </form>
          </div>

          {/* 4. Purge & Sign Out Slider */}
          <div className="glass-panel p-6 rounded-2xl shadow-sm border border-red-500/15 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-red-500/10">
              <KeyRound className="h-4.5 w-4.5 text-[#ea4335]" />
              <h2 className="text-sm font-bold font-display text-[#ea4335]">Security Data Purge</h2>
            </div>
            
            <p className="text-[11px] text-[#ea4335]/75 leading-relaxed font-medium">
              {t.offramp.purgePrompt}
            </p>

            <div className="space-y-3 pt-2">
              <div className="w-full h-14 bg-[#fff5f5] border border-red-500/25 rounded-2xl relative overflow-hidden flex items-center justify-center">
                <span className="text-[11px] font-mono text-red-700/80 select-none pointer-events-none z-10 font-bold uppercase flex items-center gap-1.5">
                  {wipingState ? t.offramp.wipeSuccess : 'Slide to Purge & Sign Out ➔'}
                </span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={swipeProgress}
                  disabled={wipingState || !(gearMega && gearVest && gearLanyard)}
                  aria-label={wipingState ? t.offramp.wipeSuccess : t.offramp.purgePrompt}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={swipeProgress}
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
                  className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize disabled:cursor-not-allowed z-20"
                />
                <div 
                  className="absolute left-0 top-0 bottom-0 bg-red-500/25 transition-all duration-75 pointer-events-none rounded-2xl"
                  style={{ width: `${swipeProgress}%` }}
                />
              </div>

              {/* Slider disable warning */}
              {!(gearMega && gearVest && gearLanyard) && (
                <p className="text-[9px] font-mono text-center text-foreground/40 font-bold animate-pulse">
                  * Complete all Gear Audit checkboxes to unlock slide gesture.
                </p>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Screen Reader accessible alternative */}
      <button
        type="button"
        onClick={() => {
          if (confirm(t.offramp.purgePrompt)) {
            handleWipePurge();
          }
        }}
        className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-[#ea4335] border border-red-500/20 rounded-xl text-xs font-bold transition focus:ring-2 focus:ring-[#ea4335] outline-none sr-only focus:not-sr-only text-center block cursor-pointer"
      >
        {t.offramp.btnWipe}
      </button>

    </div>
  );
}
