import { SolanaClients, TokenEvent, RiskScore } from '../types.js';
import { runTokenAuthorityChecks } from '../checks/tokenChecks.js';
import { runLiquidityChecks } from '../checks/liquidityChecks.js';

export async function scoreTokenRisk(clients: SolanaClients, evt: TokenEvent): Promise<RiskScore> {
  const breakdown: Record<string, number> = {};
  const reasons: string[] = [];
  let total = 0;

  const token = await runTokenAuthorityChecks(clients.connection, evt.mint);
  if (token.hasMintAuthority) {
    breakdown.mintAuthorityActive = 30; total += 30; reasons.push('Mint authority active');
  }
  if (token.hasFreezeAuthority) {
    breakdown.freezeAuthorityActive = 20; total += 20; reasons.push('Freeze authority active');
  }

  // Decimals sanity
  if (token.decimals > 12 || token.decimals < 0) {
    breakdown.decimalsWeird = 5; total += 5; reasons.push(`Uncommon decimals: ${token.decimals}`);
  }

  const liq = await runLiquidityChecks(evt.mint);
  if (liq.initialLiquiditySol !== undefined && liq.initialLiquiditySol < 5) {
    breakdown.lowInitialLiquidity = 15; total += 15; reasons.push('Low initial liquidity');
  }
  if (liq.lpLocked === false) {
    breakdown.lpNotLocked = 20; total += 20; reasons.push('LP not locked');
  }

  return { total: Math.min(100, total), reasons, breakdown };
}


