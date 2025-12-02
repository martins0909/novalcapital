import { Router, Request, Response } from 'express';

const router = Router();

type TickerItem = {
  symbol: string;
  price: number;
  changePercent: number;
  trend: 'up' | 'down' | 'flat';
};

async function fetchRates(base: string, symbols: string[], date?: string) {
  const baseUrl = 'https://api.exchangerate.host';
  const path = date ? `/${date}` : '/latest';
  const url = `${baseUrl}${path}?base=${encodeURIComponent(base)}&symbols=${encodeURIComponent(symbols.join(','))}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch rates: ${res.status}`);
  const data = await res.json() as { rates?: Record<string, number> };
  if (!data.rates) {
    console.error('Rates not found in response:', JSON.stringify(data));
    // Provide fallback: return empty object so dashboard doesn't break
    return {};
  }
  return data.rates;
}

function computeChange(current: number, previous: number) {
  if (!previous || previous === 0) return { changePercent: 0, trend: 'flat' as const };
  const changePercent = ((current - previous) / previous) * 100;
  const trend: 'up' | 'down' | 'flat' = changePercent > 0.0001 ? 'up' : changePercent < -0.0001 ? 'down' : 'flat';
  return { changePercent, trend };
}

router.get('/ticker', async (req: Request, res: Response) => {
  try {
    const symbolsParam = (req.query.symbols as string) || 'GBPUSD,EURUSD,USDJPY,USDCAD,USDCHF,XAUUSD';
    const symbols = symbolsParam.split(',').map(s => s.trim().toUpperCase());

    // Determine previous date (yesterday)
    const now = new Date();
    const prev = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const prevDate = prev.toISOString().slice(0, 10);

    // Group requests by base
    const bases: Record<string, Set<string>> = {};
    for (const pair of symbols) {
      if (pair === 'XAUUSD') continue; // handle later
      const base = pair.slice(0, 3);
      const quote = pair.slice(3, 6);
      if (!bases[base]) bases[base] = new Set<string>();
      bases[base].add(quote);
    }

    // Fetch current and previous rates per base
    const currentByBase: Record<string, Record<string, number>> = {};
    const previousByBase: Record<string, Record<string, number>> = {};
    for (const base of Object.keys(bases)) {
      const quotes = Array.from(bases[base]);
      currentByBase[base] = await fetchRates(base, quotes);
      previousByBase[base] = await fetchRates(base, quotes, prevDate);
    }

    const results: TickerItem[] = [];
    for (const pair of symbols) {
      if (pair === 'XAUUSD') {
        // Simple fallback for gold spot (simulate around 2000)
        const price = 1950 + Math.random() * 150; // 1950 - 2100
        const changePercent = (Math.random() - 0.5) * 0.5; // +/- 0.25%
        results.push({ symbol: pair, price: Number(price.toFixed(4)), changePercent: Number(changePercent.toFixed(3)), trend: changePercent > 0 ? 'up' : 'down' });
        continue;
      }
      const base = pair.slice(0, 3);
      const quote = pair.slice(3, 6);
      const current = currentByBase[base]?.[quote];
      const previous = previousByBase[base]?.[quote];
      if (!current) continue;
      const { changePercent, trend } = previous ? computeChange(current, previous) : { changePercent: 0, trend: 'flat' as const };
      results.push({ symbol: pair, price: Number(current.toFixed(5)), changePercent: Number(changePercent.toFixed(3)), trend: trend });
    }

    res.json({ symbols, data: results });
  } catch (err: any) {
    console.error('Market ticker error:', err);
    res.status(500).json({ error: 'Failed to fetch market data' });
  }
});

export default router;
