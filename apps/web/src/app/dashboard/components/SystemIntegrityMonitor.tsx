export interface SystemIntegrityMonitorProps {
  activeModelName: string;
  anomalyThresholdDensity: number;
  anomalyThresholdCongestion: number;
}

export function SystemIntegrityMonitor({
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
