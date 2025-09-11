import { Connection, PublicKey } from '@solana/web3.js';
import { getMint } from '@solana/spl-token';

export type TokenCheckResult = {
  hasMintAuthority: boolean;
  hasFreezeAuthority: boolean;
  decimals: number;
  supply: string;
};

export async function runTokenAuthorityChecks(connection: Connection, mintStr: string): Promise<TokenCheckResult> {
  const mint = new PublicKey(mintStr);
  const info = await getMint(connection, mint, 'confirmed');

  return {
    hasMintAuthority: info.mintAuthority !== null,
    hasFreezeAuthority: info.freezeAuthority !== null,
    decimals: info.decimals,
    supply: info.supply.toString()
  };
}


