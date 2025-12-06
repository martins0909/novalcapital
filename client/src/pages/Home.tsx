import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { loadTawk, unloadTawk } from '../utils/tawk';
import { marketAPI } from '../services/api';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Home = () => {
  const [tickerData, setTickerData] = useState<Array<{ symbol: string; price: number; changePercent: number; trend: 'up' | 'down' | 'flat' }>>([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const data = await marketAPI.getTicker(['XAUUSD','GBPUSD','EURUSD','USDJPY','USDCAD','USDCHF']);
        if (mounted) setTickerData(data);
      } catch (e) {
        // fallback: static minimal data if API fails
        if (mounted) setTickerData([
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

  // Tawk is loaded globally from App.tsx; do not unload on page unmount so widget stays persistent.

  // Hero slider images (served from /public)
  const slides = [
    '/slider-img/in-cirro-slide-1.jpg',
    '/slider-img/in-cirro-slide-2.jpg',
    '/slider-img/in-cirro-slide-3.jpg',
    '/slider-img/Бухгалтерские услуги в Израиле – для бизнеса любого масштаба.jpg',
    '/slider-img/business, technology, laptop, smartphone….jpg',
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchDeltaX, setTouchDeltaX] = useState(0);

  // Respect prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReducedMotion(mq.matches);
    setReducedMotion(mq.matches);
    // addEventListener is preferred; fallback to addListener for older browsers
    // @ts-ignore
    (mq.addEventListener ? mq.addEventListener('change', onChange) : mq.addListener(onChange));
    return () => {
      // @ts-ignore
      (mq.removeEventListener ? mq.removeEventListener('change', onChange) : mq.removeListener(onChange));
    };
  }, []);

  // Autoplay when not hovered and not reduced motion
  useEffect(() => {
    if (reducedMotion || isHovered) return;
    const id = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(id);
  }, [reducedMotion, isHovered, slides.length]);

  const nextSlide = () => setCurrentSlide((p) => (p + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((p) => (p - 1 + slides.length) % slides.length);
  const goToSlide = (i: number) => setCurrentSlide(i);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section - Image Slider with Overlay Text */}
        <section
          className="relative h-[420px] md:h-[640px] overflow-hidden bg-black"
          role="region"
          aria-roledescription="carousel"
          aria-label="Hero slideshow"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') { nextSlide(); }
            if (e.key === 'ArrowLeft') { prevSlide(); }
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={(e) => {
            setTouchStartX(e.touches[0].clientX);
            setTouchDeltaX(0);
          }}
          onTouchMove={(e) => {
            if (touchStartX !== null) {
              setTouchDeltaX(e.touches[0].clientX - touchStartX);
            }
          }}
          onTouchEnd={() => {
            const threshold = 50;
            if (touchDeltaX > threshold) prevSlide();
            if (touchDeltaX < -threshold) nextSlide();
            setTouchStartX(null);
            setTouchDeltaX(0);
          }}
        >
          {/* Slides */}
          <div className="absolute inset-0">
            {slides.map((src, idx) => (
              <img
                key={idx}
                src={encodeURI(src)}
                alt=""
                role="group"
                aria-roledescription="slide"
                aria-label={`${idx + 1} of ${slides.length}`}
                aria-hidden={idx !== currentSlide}
                className={`absolute inset-0 w-full h-full min-w-full min-h-full object-cover transition-opacity duration-700 ${idx === currentSlide ? 'opacity-100' : 'opacity-0'}`}
              />
            ))}
            {/* subtle gradient for contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-black/10" />
          </div>

          {/* Overlay content */}
          <div className="relative h-full">
            <div className="container mx-auto h-full px-4 flex items-center">
              <div className="max-w-xl bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-card">
                <h1 className="text-4xl md:text-5xl font-heading font-black mb-4 text-heading">
                  Access a wealth of trading opportunities
                </h1>
                <p className="text-lg md:text-xl mb-6 text-body">
                  Trusting in the security of the Global leader in broker, more than 3 million products are waiting for you.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link to="/signup" className="btn btn-warning">
                    Create account
                    <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                  <Link to="/markets" className="btn bg-white text-primary border border-border hover:bg-gray-100">
                    Browse options
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <button
            type="button"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-2 shadow focus:outline-none focus:ring-2 focus:ring-primary"
            onClick={prevSlide}
            aria-label="Previous slide"
          >
            <svg className="w-6 h-6 text-heading" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M12.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L8.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-2 shadow focus:outline-none focus:ring-2 focus:ring-primary"
            onClick={nextSlide}
            aria-label="Next slide"
          >
            <svg className="w-6 h-6 text-heading" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M7.293 4.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414-1.414L11.586 10 8.707 7.121A1 1 0 017.293 5.535z" clipRule="evenodd" />
            </svg>
          </button>

          {/* Dots */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 z-30 bottom-8 md:bottom-4">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                className={`w-2.5 h-2.5 rounded-full border border-white/70 ${idx === currentSlide ? 'bg-white' : 'bg-white/40'} focus:outline-none focus:ring-2 focus:ring-primary`}
                aria-label={`Go to slide ${idx + 1}`}
                aria-current={idx === currentSlide ? 'true' : 'false'}
                onClick={() => goToSlide(idx)}
              />
            ))}
          </div>
        </section>

        {/* Price Ticker */}
        <section className="bg-transparent md:bg-gray-200 mt-0 py-1 md:py-3">
          <div className="container mx-auto px-4">
            <div className="ticker" aria-label="Live market prices" role="region">
              <div className="ticker__track">
                <div className="flex items-center space-x-8 pr-8">
                  {(Array.isArray(tickerData) ? tickerData : []).map((item, index) => (
                    <div key={`a-${index}`} className="flex items-center space-x-2 whitespace-nowrap">
                      <span className="font-semibold">{item.symbol}</span>
                      <span className={`${item.trend === 'up' ? 'badge-up' : item.trend === 'down' ? 'badge-down' : 'bg-gray-500 text-white px-2 py-1 rounded text-sm'}`}>
                        {item.price.toFixed(5)} ({item.changePercent.toFixed(2)}%)
                        <svg className="w-4 h-4 inline ml-1" fill="currentColor" viewBox="0 0 20 20">
                          {item.trend === 'up' ? (
                            <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          ) : (
                            <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          )}
                        </svg>
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center space-x-8 pr-8">
                  {(Array.isArray(tickerData) ? tickerData : []).map((item, index) => (
                    <div key={`b-${index}`} className="flex items-center space-x-2 whitespace-nowrap">
                      <span className="font-semibold">{item.symbol}</span>
                      <span className={`${item.trend === 'up' ? 'badge-up' : 'badge-down'}`}>
                        {item.price.toFixed(5)} ({item.changePercent.toFixed(2)}%)
                        <svg className="w-4 h-4 inline ml-1" fill="currentColor" viewBox="0 0 20 20">
                          {item.trend === 'up' ? (
                            <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          ) : (
                            <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          )}
                        </svg>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why BlueStockfx Section */}
        <section className="bg-primary text-white py-12">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-6">
            <img src="/other-img/logoicon1.png" alt="NovalCapitalFX logo" className="h-14 w-14 mb-4 md:mb-0 md:mr-6 rounded-full bg-white p-2 shadow-2xl" />
            <div className="flex-1 flex flex-col items-start justify-center max-w-xl">
              <h3 className="text-xl font-bold mb-2">Why NovalCapitalFX is a trusted broker</h3>
              <p className="text-base opacity-90">NovalCapitalFX gives you privilege and access to invest in a wide range of stocks, ETFs, commodities and cryptocurrencies, with safer access to long term and short term plans.</p>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div className="grid grid-cols-2 grid-rows-2 gap-6 w-full max-w-md">
                <div className="bg-primary/80 rounded-lg p-4 text-center font-semibold shadow">
                  Wide Range of Instruments
                </div>
                <div className="bg-primary/80 rounded-lg p-4 text-center font-semibold shadow">
                  Unparalleled Trading Conditions
                </div>
                <div className="bg-primary/80 rounded-lg p-4 text-center font-semibold shadow">
                  Globally Licensed &amp; Regulated
                </div>
                <div className="bg-primary/80 rounded-lg p-4 text-center font-semibold shadow">
                  Committed to Forex Education
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Markets Section */}
        <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Connect to global capital markets</h2>
              <p className="text-xl text-gray-600">
                Access 40,000+ trading instruments and professional asset management on award-winning platforms.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Forex', icon: '💱', desc: 'Trade 70 major, minor & exotic currency pairs with competitive trading conditions.' },
                { title: 'Metals', icon: '🥇', desc: 'Trade metal commodities such as Gold, Silver & Platinum.' },
                { title: 'Cryptocurrencies', icon: '₿', desc: 'Trade Bitcoin, Ether, Doge & more crypto & altcoin CFDs' },
                { title: 'Shares', icon: '📈', desc: 'Hundreds of public companies from the US, UK, France & Germany available to trade.' },
              ].map((market, index) => (
                <div key={index} className="card p-6 text-center hover:shadow-xl transition">
                  <div className="text-5xl mb-4">{market.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{market.title}</h3>
                  <p className="text-gray-600">{market.desc}</p>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Link to="/markets" className="btn btn-info">
                See other Instruments
                <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* Trade Types */}
        <section className="py-16 bg-primary text-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
              <div className="flex items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Trade types</h2>
                  <p className="text-lg opacity-90 mb-4">Explore different trade types to trade on your preferred market.</p>
                  <Link to="/signup" className="btn btn-link text-white">
                    Start Trading
                  </Link>
                </div>
              </div>
              <div className="card text-center p-6">
                <img className="mx-auto w-14 h-14" src="/img/in-cirro-2-icon-5.svg" alt="Margin trading" />
                <h5 className="font-bold mt-4 underline">Margin trading</h5>
                <p className="mt-2 text-gray-700 text-sm">collateral that a holder of a financial instrument has to deposit to cover the risk the holder poses.</p>
              </div>
              <div className="card text-center p-6">
                <img className="mx-auto w-14 h-14" src="/img/in-cirro-2-icon-2.svg" alt="Options" />
                <h5 className="font-bold mt-4 underline">Options</h5>
                <p className="mt-2 text-gray-700 text-sm">We grant you the right but not the obligation to buy or sell an underlying asset at a set price.</p>
              </div>
              <div className="card text-center p-6">
                <img className="mx-auto w-14 h-14" src="/img/in-cirro-2-icon-6.svg" alt="Multipliers" />
                <h5 className="font-bold mt-4 underline">Multipliers</h5>
                <p className="mt-2 text-gray-700 text-sm">An investor is able to manage an asset larger than the amount of money he or she has.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured On */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-6">
              <div className="lg:col-span-2 text-center lg:text-left">
                <h6 className="text-sm font-semibold text-gray-500">Featured on</h6>
              </div>
              <div className="lg:col-span-10">
                {/* Moving logos marquee (no extra text) */}
                <div className="ticker mt-2" aria-label="Featured logos marquee" role="region">
                  <div className="ticker__track items-center">
                    <div className="pr-8"><img className="opacity-75 h-6" src="/other-img/in-cirro-press-1.svg" alt="CNBC" /></div>
                    <div className="pr-8"><img className="opacity-75 h-6" src="/other-img/in-cirro-press-2.svg" alt="The Guardian" /></div>
                    <div className="pr-8"><img className="opacity-75 h-6" src="/other-img/in-cirro-press-3.svg" alt="Bloomberg" /></div>
                    <div className="pr-8"><img className="opacity-75 h-6" src="/other-img/in-cirro-press-4.svg" alt="Reuters" /></div>
                    {/* duplicate for seamless loop */}
                    <div className="pr-8"><img className="opacity-75 h-6" src="/other-img/in-cirro-press-1.svg" alt="CNBC" /></div>
                    <div className="pr-8"><img className="opacity-75 h-6" src="/other-img/in-cirro-press-2.svg" alt="The Guardian" /></div>
                    <div className="pr-8"><img className="opacity-75 h-6" src="/other-img/in-cirro-press-3.svg" alt="Bloomberg" /></div>
                    <div className="pr-8"><img className="opacity-75 h-6" src="/other-img/in-cirro-press-4.svg" alt="Reuters" /></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-info to-cyan-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to start your investment journey?</h2>
            <p className="text-xl mb-8 opacity-90">Join thousands of investors who trust NovalCapitalFX</p>
            <Link to="/signup" className="btn btn-warning text-lg">
              Get Started Today
            </Link>
          </div>
        </section>

        {/* Awards Section */}
        <section className="bg-white py-10">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-8">Our Company Awards</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 items-center">
              <div className="flex flex-col items-center">
                <img src="/other-img/awardicon.png" alt="Best Trading Platform" className="h-16 w-16 mb-3" />
                <span className="text-center text-gray-700 font-semibold">Best Trading Platform 2024</span>
              </div>
              <div className="flex flex-col items-center">
                <img src="/other-img/awardicon.png" alt="Best Trading App" className="h-16 w-16 mb-3" />
                <span className="text-center text-gray-700 font-semibold">Best Trading App<br />London Summit 2023</span>
              </div>
              <div className="flex flex-col items-center">
                <img src="/other-img/awardicon.png" alt="Best ECN Broker" className="h-16 w-16 mb-3" />
                <span className="text-center text-gray-700 font-semibold">Best ECN Broker<br />Forex Expo Dubai 2023</span>
              </div>
              <div className="flex flex-col items-center">
                <img src="/other-img/awardicon.png" alt="Global Excellence" className="h-16 w-16 mb-3" />
                <span className="text-center text-gray-700 font-semibold">Global Excellence 2025</span>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;
