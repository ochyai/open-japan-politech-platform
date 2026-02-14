import { BUCKLING_THRESHOLD } from "../constants";
import type { ComplexMass } from "../types";

/**
 * 2つのブロック間のひずみエネルギー密度 (u) を計算
 */
export function calculateStrainEnergy(
  blockA: ComplexMass,
  blockB: ComplexMass,
  bondStrength: number, // 結合エネルギー
): number {
  // 質量差による圧力
  const massDifference = Math.abs(blockA.real - blockB.real);

  // 虚数質量の膨張による「幻影の領土」圧力を加算
  const imaginaryPressure = (blockA.imaginary + blockB.imaginary) * 0.5;

  // ひずみエネルギー u
  return (massDifference + imaginaryPressure) / (bondStrength || 1);
}

/** 座屈（戦争）判定 */
export function checkBucklingRisk(strainEnergy: number): boolean {
  return strainEnergy > BUCKLING_THRESHOLD;
}
