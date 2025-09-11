import { Connection, Commitment, clusterApiUrl } from '@solana/web3.js';
import { SolanaClients } from '../types.js';

type CreateSolanaClientsParams = {
  rpcEndpoints: string[];
  wsEndpoint?: string;
  commitment?: Commitment;
};

export async function createSolanaClients(
  params: CreateSolanaClientsParams
): Promise<SolanaClients> {
  const rpcUrl = params.rpcEndpoints[0] ?? clusterApiUrl('mainnet-beta');
  const connection = new Connection(rpcUrl, {
    wsEndpoint: params.wsEndpoint,
    commitment: params.commitment ?? 'confirmed'
  });

  return { rpcUrl, connection };
}


