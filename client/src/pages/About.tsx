import Header from '../components/Header';
import Footer from '../components/Footer';
import { useEffect, useRef, useState } from 'react';
import { loadTawk, unloadTawk } from '../utils/tawk';

const About = () => {
  const [counts, setCounts] = useState({ users: 0, instruments: 0, countries: 0 });
  const [hasAnimated, setHasAnimated] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            animateCounters();
          }
        });
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  // Tawk is loaded globally from App.tsx; do not unload on page unmount so widget stays persistent.

  const animateCounters = () => {
    const targets = { users: 3000000, instruments: 40000, countries: 190 };
    const duration = 2000;
    const steps = 60;
    const increment = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setCounts({
        users: Math.floor(targets.users * easeOut),
        instruments: Math.floor(targets.instruments * easeOut),
        countries: Math.floor(targets.countries * easeOut),
      });

      if (step >= steps) {
        setCounts(targets);
        clearInterval(timer);
      }
    }, increment);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  return (
    <div className="min-h-screen flex flex-col bg-light-lighter">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-blue-700 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About NovalCapitalFX</h1>
            <p className="text-xl opacity-90">Your trusted partner in global investment markets</p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1">
              <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
              <p className="text-lg text-gray-700 mb-4">
                NovalCapitalFX is one of the fastest-growing online trading brands in the world. We are committed to providing our clients with access to global capital markets through cutting-edge technology and competitive pricing.
              </p>
              <p className="text-lg text-gray-700">
                Our platform enables traders and investors to access over 40,000 trading instruments across multiple asset classes, including forex, stocks, cryptocurrencies, and commodities.
              </p>
              </div>
              <div className="order-1 md:order-2">
                <img src="/slider-img/in-cirro-slide-2.jpg" alt="About NovalCapitalFX" className="rounded-xl shadow-lg" />
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Our Core Values</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="card p-6 text-center">
                <img className="mx-auto w-14 h-14 mb-4" src="/img/in-cirro-2-icon-3.svg" alt="Security" />
                <h3 className="text-xl font-bold mb-3">Security</h3>
                <p className="text-gray-600">
                  Your funds and data are protected with industry-leading security measures and encryption.
                </p>
              </div>
              <div className="card p-6 text-center">
                <img className="mx-auto w-14 h-14 mb-4" src="/img/in-cirro-2-icon-4.svg" alt="Innovation" />
                <h3 className="text-xl font-bold mb-3">Innovation</h3>
                <p className="text-gray-600">
                  We continuously improve our platform with the latest technology and trading tools.
                </p>
              </div>
              <div className="card p-6 text-center">
                <img className="mx-auto w-14 h-14 mb-4" src="/img/in-cirro-2-icon-6.svg" alt="Trust" />
                <h3 className="text-xl font-bold mb-3">Trust</h3>
                <p className="text-gray-600">
                  We are globally licensed and regulated, ensuring transparency in all our operations.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16" ref={statsRef}>
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold">Trusted by traders worldwide</h2>
              <p className="text-gray-600 mt-2">Featured on leading finance and technology publications</p>
            </div>
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-primary mb-2">{formatNumber(counts.users)}+</div>
                <div className="text-gray-600">Active Users</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">{formatNumber(counts.instruments)}+</div>
                <div className="text-gray-600">Trading Instruments</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">{counts.countries}+</div>
                <div className="text-gray-600">Countries Served</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">24/7</div>
                <div className="text-gray-600">Customer Support</div>
              </div>
            </div>
            {/* Moving logos marquee */}
            <div className="mt-12 ticker" aria-label="Featured logos marquee" role="region">
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
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
