import { StadiumTelemetry } from '@fifa/core';

export interface TelemetryMetricsCardProps {
  telemetry: StadiumTelemetry | null;
  anomalyThresholdDensity: number;
  anomalyThresholdCongestion: number;
}

export function TelemetryMetricsCard({
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
          <div className="w-full bg-outline-border/20 h-2 rounded-full overflow-hidden" role="progressbar" aria-valuenow={32} aria-valuemin={0} aria-valuemax={100} aria-label="Crowd density">
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
        <div className="w-full bg-outline-border/20 h-2 rounded-full overflow-hidden" role="progressbar" aria-valuenow={Math.round(telemetry.crowdDensity * 100)} aria-valuemin={0} aria-valuemax={100} aria-label="Crowd density">
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
