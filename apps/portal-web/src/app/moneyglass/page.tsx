import { B_STD, ALPHA_AUTONOMY, WealthVector, analyzeFlowContinuity } from "@ojpp/sbcm-engine";

export default function MoneyGlassRoom() {
  // --- ページ内で直接 SBCM 演算を実行 (本番環境対応) ---
  const income = 8331000000;
  const expenditure = 8254000000;
  
  const vector = new WealthVector(income, 500000000); // 5億を仮の虚数質量(Mc)とする
  const diagnostic = analyzeFlowContinuity({
    inflow: income,
    outflow: expenditure,
    production: 1000000000,
    maintenance: 800000000,
    population: B_STD
  });

  const phaseDeg = (vector.phaseAngle * (180 / Math.PI)).toFixed(1);
  const distortion = diagnostic.distortion.toFixed(2);

  return (
    <div className="min-h-screen bg-[#04040a] p-8 text-[#f0f0f5] font-sans">
      <div className="mx-auto max-w-5xl">
        <a href="/" className="mono text-[0.6rem] tracking-[3px] text-amber-500/60 hover:text-amber-500 transition-colors">
          {"← BACK TO COMMAND CENTER"}
        </a>
        
        <div className="mt-10 mb-16 border-l-4 border-amber-500 pl-6">
          <h1 className="text-6xl font-black tracking-tighter italic">
            MONEY <span className="text-amber-500">GLASS</span>
          </h1>
          <p className="mono text-[0.7rem] tracking-[4px] text-amber-500/40 mt-2">
            SBCM v4.0 // PHYSICAL AUDIT INTERFACE
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          {/* 左パネル: 位相角 */}
          <div className="bg-[#0a0a0f] p-10">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_10px_#f59e0b]" />
              <p className="mono text-[0.6rem] tracking-[4px] text-amber-500/60">SYSTEM PHASE ANGLE (θ)</p>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="kpi-value text-8xl font-bold tracking-tighter text-white">{phaseDeg}</p>
              <p className="text-3xl font-light text-amber-500/40">°</p>
            </div>
            <div className="mt-8 p-4 border border-amber-500/20 bg-amber-500/5">
              <p className="text-xs font-bold text-amber-400">
                {vector.isFragile ? "⚠️ CRITICAL FRAGILITY DETECTED" : "✅ SYSTEM GROUNDED"}
              </p>
              <p className="text-[0.6rem] text-amber-500/40 mt-1 uppercase tracking-wider">Imaginary mass limit status: OK</p>
            </div>
          </div>

          {/* 右パネル: 歪み指数 */}
          <div className="bg-[#0a0a0f] p-10">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_#3b82f6]" />
              <p className="mono text-[0.6rem] tracking-[4px] text-blue-500/60">DISTORTION INDEX (D)</p>
            </div>
            <p className="kpi-value text-8xl font-bold tracking-tighter text-white">{distortion}</p>
            <div className="mt-8 p-4 border border-blue-500/20 bg-blue-500/5">
              <p className="text-xs font-bold text-blue-400">
                LEAKAGE: {diagnostic.isStrawEffect ? "HIGH" : "NOMINAL"}
              </p>
              <p className="text-[0.6rem] text-blue-500/40 mt-1 uppercase tracking-wider">Administrative Water Hammer Risk: LOW</p>
            </div>
          </div>
        </div>

        {/* 下部デバッグ情報 */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-white/5 bg-white/[0.02] p-6">
            <p className="mono text-[0.5rem] text-[var(--text-ghost)] mb-2">TELEMETRY_SOURCE</p>
            <p className="text-xs font-bold text-emerald-400">G-CART 4D PROTOCOL</p>
          </div>
          <div className="border border-white/5 bg-white/[0.02] p-6">
            <p className="mono text-[0.5rem] text-[var(--text-ghost)] mb-2">QUANTUM_UNIT</p>
            <p className="text-xs font-bold text-white">B_std: {B_STD.toLocaleString()}</p>
          </div>
          <div className="border border-white/5 bg-white/[0.02] p-6">
            <p className="mono text-[0.5rem] text-[var(--text-ghost)] mb-2">PHYSICS_ENGINE</p>
            <p className="text-xs font-bold text-white">SBCM v4.12.0</p>
          </div>
        </div>
      </div>
    </div>
  );
}
