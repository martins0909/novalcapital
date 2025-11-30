import React, { useEffect, useRef, memo } from 'react';

function TradingViewWidget() {
  const container = useRef(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-forex-cross-rates.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = `{
      "colorTheme": "dark",
      "isTransparent": false,
      "locale": "en",
      "currencies": [
        "EUR",
        "USD",
        "JPY",
        "GBP",
        "CHF",
        "AUD",
        "CAD",
        "NZD",
        "CNY"
      ],
      "backgroundColor": "#0F0F0F",
      "width": "100%",
      "height": "600"
    }`;
    if (container.current) container.current.appendChild(script);
  }, []);

  return (
    <div
      className="tradingview-widget-container"
      ref={container}
      style={{
        width: '100%',
        margin: '0 auto',
        background: '#0F0F0F',
        borderRadius: '12px',
        boxShadow: '0 2px 16px rgba(0,0,0,0.12)',
        marginBottom: '48px', // Add extra space below widget
        minHeight: '600px', // Ensure enough height for widget
        maxHeight: '700px', // Prevent excessive height
        overflow: 'auto',
      }}
    >
      <div className="tradingview-widget-container__widget"></div>
      <div className="tradingview-widget-copyright" style={{ textAlign: 'center', color: '#DBDBDB', padding: '8px 0' }}>
        <a href="https://www.tradingview.com/markets/currencies/" rel="noopener nofollow" target="_blank"><span className="blue-text">Forex market</span></a><span className="trademark"> by TradingView</span>
      </div>
    </div>
  );
}

export default memo(TradingViewWidget);
