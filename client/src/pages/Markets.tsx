import Header from '../components/Header';
import Footer from '../components/Footer';
import TradingViewWidgetMarkets from '../components/TradingViewWidgetMarkets';
import { useEffect, useState } from 'react';
import { marketAPI } from '../services/api';
import { Link } from 'react-router-dom';

const Markets = () => {
  const markets = [
    {
      category: 'Forex',
      icon: '💱',
      pairs: [
        { name: 'EUR/USD', price: '1.0856', change: '+0.23%', trend: 'up' },
        { name: 'GBP/USD', price: '1.2634', change: '-0.15%', trend: 'down' },
        { name: 'USD/JPY', price: '149.82', change: '+0.45%', trend: 'up' },
        { name: 'AUD/USD', price: '0.6523', change: '+0.18%', trend: 'up' },
      ],
    },
    {
      category: 'Cryptocurrencies',
      icon: '₿',
      pairs: [
        { name: 'Bitcoin', price: '$43,250', change: '+2.35%', trend: 'up' },
        { name: 'Ethereum', price: '$2,287', change: '+1.82%', trend: 'up' },
        { name: 'Ripple', price: '$0.5234', change: '-0.95%', trend: 'down' },
        { name: 'Cardano', price: '$0.4156', change: '+3.21%', trend: 'up' },
      ],
    },
    {
      category: 'Stocks',
      icon: '📈',
      pairs: [
        { name: 'Apple Inc.', price: '$182.45', change: '+1.23%', trend: 'up' },
        { name: 'Microsoft', price: '$378.91', change: '+0.87%', trend: 'up' },
        { name: 'Tesla', price: '$242.15', change: '-2.15%', trend: 'down' },
        { name: 'Amazon', price: '$151.94', change: '+0.56%', trend: 'up' },
      ],
    },
    {
      category: 'Commodities',
      icon: '🥇',
      pairs: [
        { name: 'Gold', price: '$2,045.30', change: '+0.65%', trend: 'up' },
        { name: 'Silver', price: '$24.18', change: '+0.32%', trend: 'up' },
        { name: 'Crude Oil', price: '$78.45', change: '-1.12%', trend: 'down' },
        { name: 'Natural Gas', price: '$2.87', change: '+2.34%', trend: 'up' },
      ],
    },
  ];

  const [quotes, setQuotes] = useState<Array<{ symbol: string; price: number; changePercent: number; trend: 'up' | 'down' | 'flat' }>>([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const data = await marketAPI.getTicker(['GBPUSD','EURUSD','USDJPY','USDCAD','USDCHF']);
        if (mounted) setQuotes(data);
      } catch (e) {
        if (mounted) setQuotes([
          { symbol: 'GBPUSD', price: 1.25, changePercent: -0.11, trend: 'down' },
          { symbol: 'EURUSD', price: 1.08, changePercent: 0.05, trend: 'up' },
          { symbol: 'USDJPY', price: 151.3, changePercent: 0.02, trend: 'up' },
          { symbol: 'USDCAD', price: 1.37, changePercent: -0.03, trend: 'down' },
          { symbol: 'USDCHF', price: 0.90, changePercent: 0.01, trend: 'up' },
        ]);
      }
    };
    load();
    const id = setInterval(load, 30000);
    return () => { mounted = false; clearInterval(id); };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-light-lighter">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-blue-700 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Global Markets</h1>
            <p className="text-xl opacity-90">Real-time pricing across multiple asset classes</p>
          </div>
        </section>

        {/* Relationship Intro Section */}
        <section className="py-10">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">A relationship on your terms.</h2>
              <p className="text-lg text-gray-700 mb-2">Work with us the way you want.</p>
              <p className="text-base text-gray-600">Some believe you must choose between an online broker and a wealth management firm. At BlueStockfx, you don’t need to compromise. Whether you invest on your own, with an advisor, or a little of both — we can support you.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="rounded-lg p-6 text-center font-semibold bg-primary text-white shadow">
                <Link to="/stocks" className="flex items-center justify-center text-lg font-bold mb-2 group">
                  <img src="/other-img/record.svg" alt="Stock icon" className="h-6 w-6 mr-2 inline" />
                  <span className="underline">Stocks</span>
                  <svg className="h-5 w-5 ml-2 text-white group-hover:text-yellow-300 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </Link>
                <p className="text-base font-normal">A wide selection and variation of stocks to help you grow your investment.</p>
              </div>
              <div className="rounded-lg p-6 text-center font-semibold bg-info text-white shadow">
                <Link to="/stocks" className="flex items-center justify-center text-lg font-bold mb-2 group">
                  <img src="/other-img/chart.svg" alt="Chart icon" className="h-6 w-6 mr-2 inline" />
                  <span className="underline">Indices</span>
                  <svg className="h-5 w-5 ml-2 text-white group-hover:text-yellow-300 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </Link>
                <p className="text-base font-normal">Indices measures the price performance of a basket of securities using a standardized metric and methodology.</p>
              </div>
              <div className="rounded-lg p-6 text-center font-semibold bg-cyan-600 text-white shadow">
                <Link to="/stocks" className="flex items-center justify-center text-lg font-bold mb-2 group">
                  <img src="/other-img/bitcoin.svg" alt="Bitcoin icon" className="h-6 w-6 mr-2 inline" />
                  <span className="underline">Crypto Currency's</span>
                  <svg className="h-5 w-5 ml-2 text-white group-hover:text-yellow-300 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </Link>
                <p className="text-base font-normal">Acess to over a 100 safe crypto currency's to invest/stake in.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-lg p-6 text-center font-semibold bg-gray-800 text-white shadow">
                <Link to="/stocks" className="flex items-center justify-center text-lg font-bold mb-2 group">
                  <svg className="h-6 w-6 mr-2 inline" fill="currentColor" viewBox="0 0 20 20"><path d="M2 4a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2h-5v2h3a1 1 0 110 2H6a1 1 0 110-2h3v-2H4a2 2 0 01-2-2V4zm2 0v10h12V4H4z" /></svg>
                  <span className="underline">Etfs</span>
                  <svg className="h-5 w-5 ml-2 text-white group-hover:text-yellow-300 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </Link>
                <p className="text-base font-normal">The funds that trade on exchanges, generally tracking a specific index.</p>
              </div>
              <div className="rounded-lg p-6 text-center font-semibold bg-yellow-400 text-gray-900 shadow">
                <Link to="/stocks" className="flex items-center justify-center text-lg font-bold mb-2 group">
                  <svg className="h-6 w-6 mr-2 inline" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1.07A7.001 7.001 0 0117 10a1 1 0 11-2 0 5 5 0 10-5 5v1a1 1 0 11-2 0v-1.07A7.001 7.001 0 013 10a1 1 0 112 0 5 5 0 105-5V3a1 1 0 011-1z" /></svg>
                  <span className="underline">Commodities</span>
                  <svg className="h-5 w-5 ml-2 text-gray-900 group-hover:text-yellow-700 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </Link>
                <p className="text-base font-normal">A revolutionary, fully-automated investment service equiped with over 20 commodities</p>
              </div>
            </div>
          </div>
        </section>

        {/* White info section below last three boxes, before Forex text */}
        <div className="mt-10 bg-white rounded-lg shadow flex flex-col md:flex-row p-8 items-start">
          <div className="md:w-1/2 w-full mb-6 md:mb-0">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Why trade with NovalCapitalFX?</h2>
            <p className="text-gray-700 text-base mb-6">We provide 100% commission-free stock, options, ETF and cryptocurrency trades, making it attractive to investors who trade frequently. Still, these days many big-name brokers also offer free trades, so it makes sense to compare other features when picking a broker.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-gray-800 text-sm font-medium mb-6">
              <div className="flex items-center gap-2"><svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Direct Market Access (DMA)</div>
              <div className="flex items-center gap-2"><svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Leverage up to 1:500</div>
              <div className="flex items-center gap-2"><svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>T+0 settlement</div>
              <div className="flex items-center gap-2"><svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Dividends paid in cash</div>
              <div className="flex items-center gap-2"><svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Free from UK Stamp Duty</div>
              <div className="flex items-center gap-2"><svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Short selling available</div>
              <div className="flex items-center gap-2"><svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Commissions from 0.08%</div>
              <div className="flex items-center gap-2"><svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Access to 1500 global shares</div>
            </div>
            <div className="mb-8 flex flex-col md:flex-row items-center justify-start gap-4 bg-blue-50 border border-blue-200 rounded-lg p-4 w-full max-w-xl">
              <span className="text-base font-semibold text-blue-900">Get up to $600 plus 60 days of commission-free stocks</span>
              <Link to="/signup">
                <button className="ml-2 px-5 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition">Open Account</button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 w-full flex flex-col justify-center items-center">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Our Shares offer</h3>
            <table className="min-w-[220px] border border-gray-300 rounded overflow-hidden shadow-sm">
              <tbody>
                <tr className="bg-gray-100">
                  <td className="px-4 py-2 font-semibold border-b border-gray-300">Name</td>
                  <td className="px-4 py-2 font-semibold border-b border-gray-300">Initial Deposit</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border-b border-gray-200">Apple Inc CFD</td>
                  <td className="px-4 py-2 border-b border-gray-200">10%</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border-b border-gray-200">Facebook CFD</td>
                  <td className="px-4 py-2 border-b border-gray-200">10%</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Alibaba CFD</td>
                  <td className="px-4 py-2">10%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        {/* Forex text below info section */}
        <div className="mt-8">
          <h3 className="text-xl font-bold text-gray-900">Forex</h3>
        </div>

        {/* Markets Grid */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="space-y-8">
              {markets.map((market, index) => (
                <div key={index} className="card p-6">
                  <div className="flex items-center mb-6">
                    <span className="text-4xl mr-3">{market.icon}</span>
                    <h2 className="text-2xl font-bold">{market.category}</h2>
                  </div>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {quotes.map((q) => (
                      <div key={q.symbol} className="border rounded-lg p-4 hover:shadow-md transition bg-white">
                        <div className="flex items-center justify-between mb-1">
                          <div className="font-semibold text-gray-900">{q.symbol}</div>
                          <span className={`${q.trend === 'up' ? 'badge-up' : q.trend === 'down' ? 'badge-down' : 'bg-gray-500 text-white px-2 py-1 rounded text-sm'}`}>
                            {q.changePercent.toFixed(2)}%
                          </span>
                        </div>
                        <div className="text-2xl font-bold text-primary">{q.price.toFixed(5)}</div>
                        <div className="text-xs text-gray-500 mt-1">Live market data</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {/* Trading products icons (restored) */}
            <div className="mt-12">
              <div className="grid grid-cols-2 md:grid-cols-6 gap-6 items-center">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center bg-white rounded-lg p-3 shadow-sm">
                    <img src="/other-img/euro.svg" alt="Forex" className="w-10 h-10" />
                  </div>
                  <p className="text-gray-600 mt-2">Forex</p>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center bg-white rounded-lg p-3 shadow-sm">
                    <img src="/other-img/bitcoin.svg" alt="Crypto" className="w-10 h-10" />
                  </div>
                  <p className="text-gray-600 mt-2">Crypto</p>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center bg-white rounded-lg p-3 shadow-sm">
                    <img src="/other-img/chart.svg" alt="Indexes" className="w-10 h-10" />
                  </div>
                  <p className="text-gray-600 mt-2">Indexes</p>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center bg-white rounded-lg p-3 shadow-sm">
                    <img src="/other-img/record.svg" alt="Stocks" className="w-10 h-10" />
                  </div>
                  <p className="text-gray-600 mt-2">Stocks</p>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center bg-white rounded-lg p-3 shadow-sm">
                    <img src="/other-img/oil-drop.svg" alt="Energy" className="w-10 h-10" />
                  </div>
                  <p className="text-gray-600 mt-2">Energy</p>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center bg-white rounded-lg p-3 shadow-sm">
                    <img src="/other-img/box.svg" alt="Commodities" className="w-10 h-10" />
                  </div>
                  <p className="text-gray-600 mt-2">Commodities</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary text-white py-12">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to start trading?</h2>
            <p className="text-xl mb-6 opacity-90">
              Join thousands of traders on our platform
            </p>
            <a href="/signup" className="btn btn-warning">
              Open Trading Account
            </a>
          </div>
        </section>
      </main>
      
      {/* TradingView Forex Cross Rates Widget */}
      <div className="mt-12 mb-4">
        <h2 className="text-2xl font-bold text-center mb-4">Forex Cross Rates</h2>
        <TradingViewWidgetMarkets />
      </div>
      <Footer />
    </div>
  );
};

export default Markets;
