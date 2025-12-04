import React, { useEffect, useRef, memo, useState } from 'react';

function TradingViewWidget() {
  const container = useRef(null);
  const [height, setHeight] = useState(() => (typeof window !== 'undefined' && window.innerWidth < 640 ? 180 : 420));

  useEffect(() => {
    const handleResize = () => {
      setHeight(window.innerWidth < 640 ? 180 : 420);
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Remove any existing script children to avoid duplicates
    if (container.current) {
      while (container.current.firstChild) container.current.removeChild(container.current.firstChild);
    }

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      colorTheme: 'dark',
      dateRange: '12M',
      locale: 'en',
      largeChartUrl: '',
      isTransparent: false,
      showFloatingTooltip: false,
      plotLineColorGrowing: 'rgba(41, 98, 255, 1)',
      plotLineColorFalling: 'rgba(41, 98, 255, 1)',
      gridLineColor: 'rgba(240, 243, 250, 0)',
      scaleFontColor: '#DBDBDB',
      belowLineFillColorGrowing: 'rgba(41, 98, 255, 0.12)',
      belowLineFillColorFalling: 'rgba(41, 98, 255, 0.12)',
      belowLineFillColorGrowingBottom: 'rgba(41, 98, 255, 0)',
      belowLineFillColorFallingBottom: 'rgba(41, 98, 255, 0)',
      symbolActiveColor: 'rgba(41, 98, 255, 0.12)',
      tabs: [
        {
          title: 'Indices',
          symbols: [
            { s: 'FOREXCOM:SPXUSD', d: 'S&P 500 Index' },
            { s: 'FOREXCOM:NSXUSD', d: 'US 100 Cash CFD' },
            { s: 'FOREXCOM:DJI', d: 'Dow Jones Industrial Average Index' },
            { s: 'INDEX:NKY', d: 'Japan 225' },
            { s: 'INDEX:DEU40', d: 'DAX Index' },
            { s: 'FOREXCOM:UKXGBP', d: 'FTSE 100 Index' }
          ],
          originalTitle: 'Indices'
        },
        {
          title: 'Futures',
          symbols: [
            { s: 'BMFBOVESPA:ISP1!', d: 'S&P 500' },
            { s: 'BMFBOVESPA:EUR1!', d: 'Euro' },
            { s: 'CMCMARKETS:GOLD', d: 'Gold' },
            { s: 'PYTH:WTI3!', d: 'WTI Crude Oil' },
            { s: 'BMFBOVESPA:CCM1!', d: 'Corn' }
          ],
          originalTitle: 'Futures'
        },
        {
          title: 'Bonds',
          symbols: [
            { s: 'EUREX:FGBL1!', d: 'Euro Bund' },
            { s: 'EUREX:FBTP1!', d: 'Euro BTP' },
            { s: 'EUREX:FGBM1!', d: 'Euro BOBL' }
          ],
          originalTitle: 'Bonds'
        },
        {
          title: 'Forex',
          symbols: [
            { s: 'FX:EURUSD', d: 'EUR to USD' },
            { s: 'FX:GBPUSD', d: 'GBP to USD' },
            { s: 'FX:USDJPY', d: 'USD to JPY' },
            { s: 'FX:USDCHF', d: 'USD to CHF' },
            { s: 'FX:AUDUSD', d: 'AUD to USD' },
            { s: 'FX:USDCAD', d: 'USD to CAD' }
          ],
          originalTitle: 'Forex'
        }
      ],
      support_host: 'https://www.tradingview.com',
      backgroundColor: '#0f0f0f',
      width: '100%',
      height: String(height),
      showSymbolLogo: true,
      showChart: true,
    });
    if (container.current) container.current.appendChild(script);
  }, [height]);

  return (
    <div
      className="tradingview-widget-container"
      ref={container}
      style={{
        width: '100%',
        margin: '0 auto',
        background: '#0f0f0f',
        borderRadius: '12px',
        boxShadow: '0 2px 16px rgba(0,0,0,0.12)',
        marginBottom: '24px',
        minHeight: height < 400 ? '140px' : '260px',
        maxHeight: 'none',
        overflow: 'hidden',
      }}
    >
      <div className="tradingview-widget-container__widget"></div>
      <div className="tradingview-widget-copyright" style={{ textAlign: 'center', color: '#DBDBDB', padding: '8px 0' }}>
        <a href="https://www.tradingview.com/markets/" rel="noopener nofollow" target="_blank"><span className="blue-text">Market summary</span></a><span className="trademark"> by TradingView</span>
      </div>
    </div>
  );
}

export default memo(TradingViewWidget);
