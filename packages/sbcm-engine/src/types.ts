// 基礎型定義

/** 複素経済質量 (Vectorial Wealth) */
export interface ComplexMass {
  real: number;      // Mw: 実数質量（労働、資源）
  imaginary: number; // iMc: 虚数質量（信用、期待）
}

/** 3次元座標とポテンシャル */
export interface Coordinate {
  x: number;
  y: number;
  z: number;
  potential: number; // 重力ポテンシャル Phi
}

/** フロー状態 */
export interface FlowState {
  inflow: number;
  outflow: number;
  production: number; // sigma
  maintenance: number; // delta
  population: number;
}
