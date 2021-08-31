export interface Asset {
  name: string;
  slug: string;
  symbol: string;
  id: string;
}

export interface Params {
  name: string | undefined;
  symbol: string | undefined;
}

export interface GraphProps {
  width: number;
  height: number;
}

export interface Value {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface Metric {
  currentUSDPrice: number;
  ath: number;
  athDate: string;
  marketCapRank: number;
  marketCapUSD: number;
}

export interface GetMetrics {
  getMetrics: Metric;
}
