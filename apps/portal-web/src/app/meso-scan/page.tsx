import { prisma } from "@ojpp/db";
import { B_STD, WealthVector, analyzeFlowContinuity } from "@ojpp/sbcm-engine";

export default async function MesoScanner() {
  // 1. データベースから本物の自治体データを取得
  const blocks = await prisma.governanceBlock.findMany({
    orderBy: { code: 'asc' }
  });

  return (
    <div className="min-h-screen bg-[#04040a] p-6 text-[#f0f0f5]">
      <div className="mx-auto max-w-5xl">
        <a href="/" className="mono text-[0.6rem] tracking-[3px] text-emerald-500/60 hover:text-emerald-500">
          {"← BACK TO COMMAND CENTER"}
        </a>
        
        <div className="mt-8 mb-10 border-l-4 border-emerald-500 pl-6">
          <h1 className="text-4xl font-black tracking-tighter italic italic">MESO <span className="text-emerald-500">SCANNER</span></h1>
          <p className="mono text-[0.7rem] tracking-[4px] text-emerald-500/40 mt-1">SBCM v4.0 // REAL DATA TELEMETRY ACTIVE</p>
        </div>

        <div className="space-y-4">
          {blocks.length === 0 ? (
            <p className="text-center py-20 text-gray-500">No telemetry data. Execute ingest script.</p>
          ) : (
            blocks.map((block) => {
              // 本物の実数値で物理演算を実行
              const mw = Number(block.productionSigma);
              const mc = mw * 0.4; // 虚数質量は一旦40%と仮定
              
              const vector = new WealthVector(mw, mc);
              const diagnostic = analyzeFlowContinuity({
                inflow: mw + Number(block.inflowFlux),
                outflow: Number(block.maintenanceDelta), // 仮の簡略化
                production: mw,
                maintenance: Number(block.maintenanceDelta),
                population: block.population
              });

              return (
                <div key={block.code} className="bg-[#0a0a0f] border border-white/5 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-white/5">
                  <div className="min-w-[200px]">
                    <p className="mono text-[0.5rem] text-emerald-500/50 mb-1">BLOCK_{block.code}</p>
                    <h3 className="text-xl font-bold">{block.name}</h3>
                    <p className="text-[0.6rem] text-white/30 mt-1">POP: {block.population.toLocaleString()}</p>
                  </div>

                  <div className="grid grid-cols-2 flex-1 gap-8">
                    <div>
                      <p className="mono text-[0.5rem] text-amber-500/60">PHASE (θ)</p>
                      <p className="kpi-value text-2xl font-bold">{(vector.phaseAngle * (180 / Math.PI)).toFixed(1)}°</p>
                    </div>
                    <div>
                      <p className="mono text-[0.5rem] text-blue-500/60">DISTORTION (D)</p>
                      <p className="kpi-value text-2xl font-bold">{diagnostic.distortion.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="md:text-right">
                     <p className="mono text-[0.5rem] text-white/20">STATUS</p>
                     <p className={`text-xs font-bold ${diagnostic.isStrawEffect ? 'text-red-400' : 'text-emerald-400'}`}>
                       {diagnostic.isStrawEffect ? '🚨 LEAKAGE' : '✅ STABLE'}
                     </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
