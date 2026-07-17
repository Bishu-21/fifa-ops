'use client';

import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ShieldAlert, Laptop } from 'lucide-react';

export default function Home() {
  const { user, loading, loginWithGoogle, loginAsDemo } = useAuth();
  const router = useRouter();
  const [demoLoading, setDemoLoading] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  // Bypass Google OAuth block for easy local testing/judging
  const loginAsDemoVolunteer = async () => {
    setDemoLoading(true);
    try {
      await loginAsDemo();
    } catch (error) {
      console.error('Demo login failed:', error);
      alert('Firebase connection error. Ensure your Firebase configuration matches the project.');
    } finally {
      setDemoLoading(false);
    }
  };

  if (loading || demoLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#fdf9f4] transition-colors duration-300">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-emerald-500/35 border-t-emerald-500 rounded-full animate-spin"></div>
          <p className="text-foreground/75 font-mono text-sm tracking-widest uppercase">Initialising Security Gate...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[#fdf9f4] text-[#1c1c19] relative overflow-hidden select-none">
      
      {/* Background Soft Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-15%] left-[-10%] w-[600px] h-[600px] rounded-full bg-secondary-brand/10 blur-[120px] blob-1 mix-blend-multiply" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[600px] h-[600px] rounded-full bg-primary-brand/10 blur-[120px] blob-2 mix-blend-multiply" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10 px-4">
        <div className="flex justify-center mb-5">
          <div className="flex items-center gap-1.5 font-display font-extrabold text-4xl tracking-tight select-none">
            <span className="text-[#4285f4]">F</span>
            <span className="text-[#ea4335]">I</span>
            <span className="text-[#fbbc05]">F</span>
            <span className="text-[#34a853]">A</span>
            <span className="text-foreground/80 font-normal">2026</span>
          </div>
        </div>
        
        <h2 className="text-center text-xl font-extrabold font-display tracking-tight text-foreground">
          MatchDay Co-Pilot
        </h2>
        <p className="mt-1.5 text-center text-xs font-mono text-foreground/50 uppercase tracking-widest">
          Google Labs × FIFA Operational Terminal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4">
        <div className="glass-panel py-8 px-4 shadow-2xl sm:rounded-3xl sm:px-10 border border-outline-border/30">
          <div className="space-y-6">
            
            {/* Real World Constraints details */}
            <div className="space-y-4">
              <div className="flex items-start space-x-3.5">
                <div className="p-2 bg-secondary-brand/15 rounded-xl text-secondary-brand shrink-0 mt-0.5">
                  <Laptop className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold font-mono uppercase tracking-wide">Browser-Based Operations</h4>
                  <p className="text-xs text-foreground/70 mt-1 leading-relaxed">
                    No app store downloads needed. The dashboard runs entirely in your browser — accessible from any device with a modern web browser.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="p-2 bg-primary-brand/15 rounded-xl text-primary-brand shrink-0 mt-0.5">
                  <ShieldAlert className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold font-mono uppercase tracking-wide">Firebase Authentication</h4>
                  <p className="text-xs text-foreground/70 mt-1 leading-relaxed">
                    Sign in with your Google account for full access, or launch a demo session with anonymous credentials to explore the system immediately.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-outline-border/20 pt-6 space-y-4">
              {/* Quick bypass button for testing */}
              <button
                onClick={loginAsDemoVolunteer}
                className="w-full flex justify-center items-center py-3.5 px-4 bg-[#137333] hover:opacity-95 text-white font-extrabold text-sm rounded-xl shadow-lg transition duration-200 cursor-pointer"
              >
                Launch local Demo Session
              </button>
              <p className="text-[10px] text-center text-foreground/50 font-mono mt-2">
                * Runs on anonymous credentials. Database logs will be tagged as DEMO.
              </p>

              <div className="flex items-center my-4">
                <div className="flex-grow border-t border-outline-border/20" />
                <span className="mx-3 text-[9px] uppercase font-mono font-bold text-foreground/50 tracking-widest">or login with account</span>
                <div className="flex-grow border-t border-outline-border/20" />
              </div>

              {/* Google login provider */}
              <button
                onClick={loginWithGoogle}
                className="w-full flex justify-center items-center py-2.5 px-4 border border-outline-border/30 rounded-xl text-xs font-bold text-foreground/75 bg-background/50 hover:bg-outline-border/10 hover:border-outline-border/40 transition duration-200 cursor-pointer"
              >
                {/* Google Icon SVG */}
                <svg className="w-4 h-4 mr-3 text-foreground/80" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                Sign in with official Google Account
              </button>
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-[10px] font-mono text-foreground/50 max-w-sm mx-auto leading-relaxed uppercase">
          Authorized personnel only. All operations are logged to Firestore.
        </p>
      </div>
    </div>
  );
}
