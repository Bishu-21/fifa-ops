import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  X, 
  Menu, 
  QrCode, 
  Signal, 
  User, 
  LogOut, 
  CompassIcon, 
  SlidersHorizontal, 
  Sliders, 
  Activity, 
  ShieldCheck 
} from 'lucide-react';
import { TranslationSet, Language } from '@/lib/translations';
import type { User as FirebaseUser } from 'firebase/auth';

// WCAG 2.1 Focus Trap Hook for Modal Dialogs and Menus
function useFocusTrap(isOpen: boolean) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      if (!modalRef.current) return;

      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (!firstElement) return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    const previousActiveElement = document.activeElement as HTMLElement;

    setTimeout(() => {
      if (modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length > 0) {
          (focusableElements[0] as HTMLElement).focus();
        }
      }
    }, 50);

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
        previousActiveElement.focus();
      }
    };
  }, [isOpen]);

  return modalRef;
}

type TabId = 'mission_control' | 'off_ramp';

export interface DashboardShellProps {
  t: TranslationSet;
  activeTab: TabId;
  changeTab: (tab: TabId) => void;
  layoutMode: 'grid' | 'list';
  toggleLayoutMode: () => void;
  lang: Language;
  changeLanguage: (lang: Language) => void;
  user: FirebaseUser | null;
  selectedZone: string;
  maintenanceMode: boolean;
  children: React.ReactNode;
}

export function DashboardShell({
  t,
  activeTab,
  changeTab,
  layoutMode,
  toggleLayoutMode,
  lang,
  changeLanguage,
  user,
  selectedZone,
  maintenanceMode,
  children
}: DashboardShellProps) {
  // Mobile menu control state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Unified Terminal Modal visibility state
  const [showTerminalModal, setShowTerminalModal] = useState(false);

  // WCAG 2.1 Focus Trap references
  const terminalModalRef = useFocusTrap(showTerminalModal);
  const mobileMenuRef = useFocusTrap(isMobileMenuOpen);

  // Close all modals on Escape key
  const closeAllModals = useCallback(() => {
    setShowTerminalModal(false);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeAllModals();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [closeAllModals]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans relative select-none antialiased">
      
      {/* Background Soft Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[800px] h-[800px] rounded-full bg-secondary-brand/5 blur-[150px] blob-1 mix-blend-multiply" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[800px] h-[800px] rounded-full bg-primary-brand/5 blur-[150px] blob-2 mix-blend-multiply" />
      </div>

      {/* Global Command Header Panel (Desktop / Mobile Top nav unified) */}
      <header className="h-20 bg-background/80 backdrop-blur-xl border-b border-outline-border/20 flex items-center justify-between px-6 md:px-8 sticky top-0 z-50 select-none">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 font-display font-extrabold text-2xl tracking-tight select-none">
            <span className="text-[#4285f4]">F</span>
            <span className="text-[#ea4335]">I</span>
            <span className="text-[#fbbc05]">F</span>
            <span className="text-[#34a853]">A</span>
            <span className="text-foreground/80 font-normal">2026</span>
          </div>
          <div className="h-4 w-px bg-outline-border/20 hidden md:block"></div>
          <span className="text-xs font-mono text-foreground/50 uppercase tracking-widest hidden md:inline">{t.header.googleLabs} × {t.header.techTeam}</span>
        </div>

        {/* Right side controls (Desktop Mode) */}
        <div className="hidden md:flex items-center gap-4">
          
          {/* Navigation selectors (Unified tab switcher) */}
          <div className="flex items-center gap-1 bg-outline-border/10 p-1 rounded-xl border border-outline-border/15" role="tablist" aria-label="Desktop primary tabs">
            {(['mission_control', 'off_ramp'] as TabId[]).map((tab) => (
              <button
                key={tab}
                onClick={() => changeTab(tab)}
                role="tab"
                aria-selected={activeTab === tab}
                className={`text-[10px] font-mono uppercase font-black px-2.5 py-1.5 rounded-lg transition outline-none focus:ring-1 focus:ring-[#137333] cursor-pointer ${
                  activeTab === tab 
                    ? 'bg-[#137333] text-white shadow-sm' 
                    : 'text-foreground/60 hover:text-foreground hover:bg-outline-border/10'
                }`}
              >
                {tab === 'mission_control' ? t.header.liveFeed : t.sidebar.offRamp}
              </button>
            ))}
          </div>

          {/* Dynamic Language Selector select dropdown */}
          <div className="relative">
            <select
              value={lang}
              onChange={(e) => changeLanguage(e.target.value as Language)}
              aria-label="Interface language selector"
              className="bg-outline-border/10 hover:bg-outline-border/15 border border-outline-border/15 text-xs font-mono font-black uppercase pl-3 pr-8 py-2.5 rounded-xl focus:ring-2 focus:ring-[#137333] outline-none cursor-pointer appearance-none min-h-[44px] text-foreground font-extrabold"
            >
              <option value="en">EN</option>
              <option value="es">ES</option>
              <option value="fr">FR</option>
              <option value="pt">PT</option>
              <option value="ar">AR</option>
              <option value="zh">ZH</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-foreground/50 text-[8px] font-mono select-none">
              ▼
            </div>
          </div>

          {/* Layout Switcher (Desktop) with proper 48x48px target */}
          <button
            onClick={toggleLayoutMode}
            title={t.header.layoutTooltip}
            aria-label={t.header.layoutTooltip}
            className="w-12 h-12 text-foreground/75 hover:bg-outline-border/15 rounded-full transition active:scale-95 duration-150 flex items-center justify-center focus:ring-2 focus:ring-secondary-brand outline-none border border-outline-border/10 cursor-pointer"
          >
            {layoutMode === 'grid' ? <SlidersHorizontal className="h-4.5 w-4.5" /> : <Sliders className="h-4.5 w-4.5" />}
          </button>

          <div className="h-6 w-px bg-outline-border/25"></div>

          {/* Unified Operator Profile & Terminal Status Button */}
          <button 
            onClick={() => setShowTerminalModal(true)}
            aria-label="Open operator status terminal"
            className="h-12 px-4 text-foreground/75 hover:bg-outline-border/15 border border-outline-border/10 rounded-xl transition active:scale-95 duration-150 flex items-center justify-center gap-2 focus:ring-2 focus:ring-[#137333] outline-none cursor-pointer"
          >
            <User className="h-4.5 w-4.5 text-secondary-brand shrink-0" />
            <span className="text-[11px] font-display font-extrabold">{t.header.profile}</span>
          </button>
        </div>

        {/* Mobile Header Menu / Burger Button */}
        <div className="flex md:hidden items-center gap-1.5">
          <button 
            onClick={() => setShowTerminalModal(true)}
            aria-label="Open operator status terminal"
            className="w-12 h-12 flex items-center justify-center text-foreground/75 hover:bg-outline-border/10 rounded-full transition cursor-pointer focus:ring-2 focus:ring-[#137333] outline-none"
          >
            <User className="h-4.5 w-4.5 text-secondary-brand" />
          </button>
          
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle mobile menu"
            className="w-12 h-12 flex items-center justify-center ml-1 text-foreground/75 hover:bg-outline-border/15 rounded-full transition outline-none focus:ring-2 focus:ring-[#137333] cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Collapsible Mobile Menu panel */}
      {isMobileMenuOpen && (
        <div ref={mobileMenuRef} className="md:hidden fixed top-20 left-4 right-4 z-40 bg-background/95 backdrop-blur-xl border border-outline-border/20 rounded-2xl shadow-2xl p-5 space-y-4 animate-slideDown max-h-[80vh] overflow-y-auto">
          <div className="space-y-1.5">
            <h4 className="text-[9px] font-mono font-bold text-foreground/50 uppercase tracking-widest px-2">{t.mobileMenu.navigation}</h4>
            <div className="grid grid-cols-2 gap-2">
              {(['mission_control', 'off_ramp'] as TabId[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    changeTab(tab);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`text-xs font-mono font-bold px-3 py-2.5 rounded-xl border transition text-center cursor-pointer ${
                    activeTab === tab 
                      ? 'bg-[#137333] border-[#137333] text-white shadow-sm' 
                      : 'bg-background/50 border-outline-border/15 text-foreground hover:bg-outline-border/10'
                  }`}
                >
                  {tab === 'mission_control' ? t.sidebar.missionControl : t.sidebar.offRamp}
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-outline-border/10" />

          {/* Mobile Language Selector */}
          <div className="space-y-2">
            <h4 className="text-[9px] font-mono font-bold text-foreground/50 uppercase tracking-widest px-2">{t.mobileMenu.interfaceLanguage}</h4>
            <div className="flex flex-wrap gap-1.5 p-1 bg-outline-border/5 rounded-xl border border-outline-border/10">
              {(['en', 'es', 'fr', 'pt', 'ar', 'zh'] as Language[]).map((l) => (
                <button
                  key={l}
                  onClick={() => {
                    changeLanguage(l);
                  }}
                  className={`flex-1 text-[11px] py-3.5 rounded-lg font-mono font-black uppercase transition cursor-pointer text-center min-w-[44px] min-h-[44px] flex items-center justify-center ${
                    lang === l 
                      ? 'bg-[#137333] text-white shadow-sm font-black' 
                      : 'text-foreground/75 hover:text-foreground hover:bg-outline-border/10'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-outline-border/10" />

          {/* Mobile Layout switcher */}
          <div className="flex justify-between items-center px-2 py-1">
            <div>
              <h4 className="text-xs font-bold text-foreground">{t.mobileMenu.bentoGridView}</h4>
              <p className="text-[10px] text-foreground/50">{t.mobileMenu.bentoDesc}</p>
            </div>
            <button
              onClick={() => {
                toggleLayoutMode();
                setIsMobileMenuOpen(false);
              }}
              className="px-4 py-3 bg-outline-border/10 border border-outline-border/20 rounded-xl text-xs font-mono font-black uppercase hover:bg-outline-border/20 transition cursor-pointer min-h-[48px] flex items-center justify-center"
            >
              {layoutMode === 'grid' ? t.mobileMenu.gridMode : t.mobileMenu.listMode}
            </button>
          </div>

          <div className="h-px bg-outline-border/10" />

          {/* Quick diagnostics info */}
          <div className="bg-[#fcf7f2] border border-outline-border/15 p-3.5 rounded-xl text-xs flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#34a853] animate-pulse"></span>
              <span className="font-semibold text-foreground/80">{t.mobileMenu.syncLedgerReady}</span>
            </div>
            <span className="font-mono text-[10px] font-bold bg-[#e6f4ea] text-[#137333] px-2 py-0.5 rounded">{t.mobileMenu.online}</span>
          </div>
        </div>
      )}

      {maintenanceMode && (
        <div className="bg-[#f0f4f9] border-b border-[#d2e3fc] text-[#1a73e8] py-2 px-8 text-center text-[11px] font-medium tracking-wide z-50 flex items-center justify-center gap-2 select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1a73e8] shrink-0" />
          <span>Demo Mode — Using simulated credentials · Telemetry is locally generated</span>
        </div>
      )}

      {/* Main Structural Wrapper (Sidebar + Canvas) */}
      <div className="flex-1 flex flex-col md:flex-row w-full max-w-[1400px] mx-auto relative z-10">
        
        {/* Left Side Navigation (Desktop) */}
        <aside className="w-64 border-r border-outline-border/20 flex flex-col py-8 px-4 hidden md:flex sticky top-20 h-[calc(100vh-5rem)] shrink-0 bg-background/50 overflow-y-auto">
          {/* User profile detail */}
          <div className="px-2 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-outline-border/30 flex items-center justify-center overflow-hidden shrink-0">
              <User className="h-5 w-5 text-foreground/70" />
            </div>
            <div>
              <h2 className="font-display font-black text-sm text-foreground leading-tight">Sector 7G</h2>
              <p className="text-[10px] font-mono text-foreground/60 uppercase tracking-wider">{t.sidebar.semiFinalOps}</p>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="space-y-1" role="tablist" aria-label="Operational tabs">
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
              <span className="text-xs">{t.sidebar.missionControl}</span>
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
              <span className="text-xs">{t.sidebar.offRamp}</span>
            </button>
          </div>

          {/* Sidebar Footer Info */}
          <div className="mt-auto pt-6 border-t border-outline-border/10 space-y-4">
            <div className="bg-[#fdf9f4] border border-[#ebdcd0]/60 p-3.5 rounded-2xl text-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-foreground/50 tracking-wider">Firestore</span>
                <span className="font-mono text-[9px] font-extrabold bg-[#e6f4ea] text-[#137333] px-2 py-0.5 rounded-md flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#137333]" />
                  Connected
                </span>
              </div>
            </div>
            
            <div className="flex justify-center text-foreground/50 border-t border-outline-border/10 pt-4 pb-2">
              <button 
                onClick={() => setShowTerminalModal(true)}
                aria-label="Open status terminal"
                className="w-full flex items-center justify-center gap-1.5 hover:text-foreground px-3 py-2 rounded-xl transition hover:bg-outline-border/10 focus:ring-2 focus:ring-secondary-brand outline-none cursor-pointer"
              >
                <SlidersHorizontal className="h-3.5 w-3.5 text-[#137333]" />
                <span className="text-xs font-bold">Terminal Status</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Content Canvas */}
        <main className="flex-1 min-w-0 px-4 md:px-8 py-8 flex flex-col justify-center">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (md:hidden) */}
      <nav 
        role="tablist"
        aria-label="Mobile Navigation Tabs"
        className="fixed bottom-0 left-0 w-full z-50 flex justify-between items-center px-6 pb-safe pt-2 h-20 bg-background/95 text-foreground shadow-2xl md:hidden border-t border-outline-border/20 backdrop-blur-xl"
      >
        <button 
          onClick={() => changeTab('mission_control')}
          role="tab"
          aria-selected={activeTab === 'mission_control'}
          aria-label="Go to Live Feed tab"
          className={`flex-1 min-w-[48px] min-h-[48px] py-2 flex flex-col items-center justify-center transition active:scale-95 focus:ring-2 focus:ring-[#137333] outline-none rounded-xl ${
            activeTab === 'mission_control' ? 'text-secondary-brand font-black bg-outline-border/5' : 'text-foreground/60 hover:text-foreground'
          }`}
        >
          <CompassIcon className="h-5 w-5 mb-1" />
          <span className="font-mono text-[9px] uppercase tracking-wider text-center font-bold">{t.sidebar.missionControl}</span>
        </button>

        <button 
          onClick={() => changeTab('off_ramp')}
          role="tab"
          aria-selected={activeTab === 'off_ramp'}
          aria-label="Go to Secure Out tab"
          className={`flex-1 min-w-[48px] min-h-[48px] py-2 flex flex-col items-center justify-center transition active:scale-95 focus:ring-2 focus:ring-red-500 outline-none rounded-xl ${
            activeTab === 'off_ramp' ? 'text-error-brand font-black bg-outline-border/5' : 'text-foreground/60 hover:text-foreground'
          }`}
        >
          <LogOut className="h-5 w-5 mb-1" />
          <span className="font-mono text-[9px] uppercase tracking-wider text-center font-bold">{t.sidebar.offRamp}</span>
        </button>
      </nav>

      {/* Unified Operator Terminal Modal */}
      {showTerminalModal && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-fadeIn"
          role="dialog"
          aria-modal="true"
          aria-labelledby="terminal-modal-title"
          onClick={(e) => { if (e.target === e.currentTarget) setShowTerminalModal(false); }}
        >
          <div ref={terminalModalRef} className="bg-background w-full max-w-md rounded-3xl p-6 shadow-2xl border border-outline-border/20 relative animate-scaleUp">
            <button 
              onClick={() => setShowTerminalModal(false)}
              className="absolute top-4 right-4 p-2 text-foreground/50 hover:text-foreground rounded-full hover:bg-outline-border/10 transition min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer focus:ring-2 focus:ring-[#137333] outline-none"
              aria-label="Close status terminal"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="text-center pt-2">
              <div className="w-14 h-14 rounded-full bg-outline-border/30 flex items-center justify-center mx-auto mb-3 border border-outline-border/20 overflow-hidden shadow-sm">
                <User className="h-7 w-7 text-foreground/60" />
              </div>
              <h3 id="terminal-modal-title" className="text-base font-bold font-display text-foreground">{t.modals.profileTitle}</h3>
              <p className="text-[11px] text-foreground/60 mt-0.5">{user?.email || t.modals.profileEmail}</p>

              {/* Grid Layout: Left QR Code, Right status/details */}
              <div className="grid grid-cols-2 gap-4 mt-5 mb-5">
                <div className="p-3 bg-background/50 border border-outline-border/20 rounded-2xl flex flex-col items-center justify-center shadow-inner">
                  <div className="w-24 h-24 bg-foreground/5 rounded-xl border border-outline-border/30 p-2 flex items-center justify-center">
                    <svg className="w-full h-full text-foreground/80" viewBox="0 0 100 100">
                      <rect x="0" y="0" width="20" height="20" fill="currentColor" />
                      <rect x="0" y="0" width="8" height="8" fill="white" />
                      <rect x="80" y="0" width="20" height="20" fill="currentColor" />
                      <rect x="80" y="0" width="8" height="8" fill="white" />
                      <rect x="0" y="80" width="20" height="20" fill="currentColor" />
                      <rect x="0" y="80" width="8" height="8" fill="white" />
                      <rect x="30" y="10" width="10" height="30" fill="currentColor" />
                      <rect x="15" y="40" width="25" height="10" fill="currentColor" />
                      <rect x="60" y="30" width="20" height="40" fill="currentColor" />
                      <rect x="40" y="60" width="20" height="20" fill="currentColor" />
                      <rect x="70" y="80" width="15" height="10" fill="currentColor" />
                      <rect x="85" y="60" width="10" height="30" fill="currentColor" />
                    </svg>
                  </div>
                  <span className="text-[8px] font-mono text-foreground/50 tracking-wider mt-2.5 bg-outline-border/10 px-2 py-0.5 rounded border border-outline-border/15 uppercase">
                    ID: {user?.uid?.substring(0, 8) || 'GUEST-0'}
                  </span>
                </div>

                <div className="p-3 bg-outline-border/10 rounded-2xl border border-outline-border/15 text-left text-[10px] space-y-2 flex flex-col justify-center">
                  <div className="flex flex-col">
                    <span className="text-foreground/50 uppercase font-mono text-[8px] tracking-wider">{t.modals.primaryAssignment}</span>
                    <span className="font-bold text-foreground truncate">{t.mission.attStadium} ({t.mission.attSector})</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-foreground/50 uppercase font-mono text-[8px] tracking-wider">{t.modals.currentRole}</span>
                    <span className="font-bold text-foreground truncate">{t.modals.roleAnnouncer}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-foreground/50 uppercase font-mono text-[8px] tracking-wider">{t.modals.securityAccess}</span>
                    <span className="font-bold text-[#137333]">{t.modals.securityLevel}</span>
                  </div>
                </div>
              </div>

              {/* Connection Status panel */}
              <div className="p-3.5 bg-outline-border/10 rounded-2xl border border-outline-border/15 text-left text-xs space-y-2.5 mb-5">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-foreground/60">{t.modals.ledgerCache}</span>
                  <span className="font-mono font-bold text-[#137333]">{t.modals.ledgerActive}</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-foreground/60">{t.modals.pipeline}</span>
                  <span className="font-mono font-bold text-[#137333]">{t.modals.pipelineConnected}</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-foreground/60">Biometrics</span>
                  <span className="font-mono font-bold text-[#137333] flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5 fill-current" /> {t.modals.biometricEnrolled}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setShowTerminalModal(false)}
                  className="py-3 bg-outline-border/10 hover:bg-outline-border/20 border border-outline-border/20 text-foreground font-bold rounded-xl text-xs transition cursor-pointer focus:ring-1 focus:ring-[#137333] outline-none"
                >
                  {t.modals.btnReturn}
                </button>
                <button
                  onClick={() => {
                    setShowTerminalModal(false);
                    changeTab('off_ramp');
                  }}
                  className="py-3 bg-[#ea4335]/10 hover:bg-[#ea4335]/20 border border-[#ea4335]/20 text-[#ea4335] font-bold rounded-xl text-xs transition cursor-pointer focus:ring-1 focus:ring-[#ea4335] outline-none"
                >
                  {t.modals.btnProceedOfframp}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
