import { FlowState } from "../types";

export function analyzeFlowContinuity(state: FlowState) {
  // フラックスの発散 (Divergence)
  // div J > 0 ならばエネルギーが流出している（ストロー現象）
  const divergence = state.outflow - state.inflow;
  
  // 経済密度 (rho) の変化率
  const densityChange = (state.production - state.maintenance) - divergence;

  // ストロー現象の判定 (High Positive Divergence)
  // 地域が生み出した価値以上に流出している、かつ維持コストが高い
  const isStrawEffect = divergence > 0 && state.maintenance > state.production;

  // 正規化された歪み指数 (Distortion Index)
  const distortion = state.maintenance / (state.production || 1);

  return {
    divergence,
    densityChange,
    isStrawEffect,
    distortion
  };
}
