export type TokenEvent = {
  mint: string;
  symbol?: string;
  name?: string;
  deployer?: string;
  programId?: string;
  slot?: number;
};

export type RiskScore = {
  total: number; // 0-100
  reasons: string[];
  breakdown: Record<string, number>;
};

export type SolanaClients = {
  rpcUrl: string;
  connection: import('@solana/web3.js').Connection;
};


