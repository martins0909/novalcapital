import React, { useEffect, useRef, memo } from 'react';

function TradingViewWidgetTickerTape() {
  const container = useRef(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = `{
      "symbols": [
        { "proName": "FOREXCOM:SPXUSD", "title": "S&P 500 Index" },
        { "proName": "FOREXCOM:NSXUSD", "title": "US 100 Cash CFD" },
        { "proName": "FX_IDC:EURUSD", "title": "EUR to USD" },
        { "proName": "BITSTAMP:BTCUSD", "title": "Bitcoin" },
        { "proName": "BITSTAMP:ETHUSD", "title": "Ethereum" }
      ],
      "colorTheme": "dark",
      "locale": "en",
      "largeChartUrl": "",
      "isTransparent": false,
      "showSymbolLogo": true,
      "displayMode": "adaptive"
    }`;
    if (container.current) container.current.appendChild(script);
  }, []);

  return (
    <div className="tradingview-widget-container" ref={container} style={{ width: '100%', margin: '0 auto', background: '#0f0f0f', borderRadius: '12px', boxShadow: '0 2px 16px rgba(0,0,0,0.12)', marginBottom: '32px', minHeight: '60px', maxHeight: '80px', overflow: 'auto' }}>
      <div className="tradingview-widget-container__widget"></div>
      <div className="tradingview-widget-copyright" style={{ textAlign: 'center', color: '#DBDBDB', padding: '8px 0' }}>
        <a href="https://www.tradingview.com/markets/" rel="noopener nofollow" target="_blank"><span className="blue-text">Ticker tape</span></a><span className="trademark"> by TradingView</span>
      </div>
    </div>
  );
}

export default memo(TradingViewWidgetTickerTape);
