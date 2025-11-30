import Header from '../components/Header';
import Footer from '../components/Footer';

const Customers = () => {
  const testimonials = [
    {
      name: 'Gabrielle Barger',
      role: 'Help Desk at Pushbullet',
      quote:
        'The extension makes collecting feedback so much easier! Shipright then really helps us make decisions based on the data we collected.',
      avatar: '/img/blockit/in-client-testi-1.svg',
    },
    {
      name: 'Melvin Cortez',
      role: 'Cloud Architect at Stormpath',
      quote:
        'Quick, easy, and super helpful to collect and organise feedback from all kinds of channels we use to communicate with our customers.',
      avatar: '/img/blockit/in-client-testi-2.svg',
    },
    {
      name: 'Franklin Clark',
      role: 'Sales Analyst at Eventbrite',
      quote:
        'Has been a great tool for me on monthly updates & helps to communicate the key issues/plan with our team.',
      avatar: '/img/blockit/in-client-testi-3.svg',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-light-lighter">
      <Header />
      <main className="flex-grow">
        <section className="bg-gradient-to-r from-primary to-blue-700 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Customers</h1>
            <p className="text-xl opacity-90">Stories from traders and investors using BlueStockFX</p>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-10">
              <h2 className="text-3xl font-bold mb-2">We <span className="text-info">help</span> our customers.</h2>
              <p className="text-gray-600">To engage investors so their can grow</p>
              <p className="text-gray-700 mt-3">Our customers look to us as guides, and we weave our deep legal and technical experience into our software and services.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <div key={i} className="card p-6 bg-white">
                  <div className="flex items-center mb-4">
                    <img src={t.avatar} alt={t.name} className="w-10 h-10 mr-3" />
                    <div>
                      <div className="font-semibold">{t.name}</div>
                      <div className="text-sm text-gray-500">{t.role}</div>
                    </div>
                  </div>
                  <p className="text-gray-700">“{t.quote}”</p>
                </div>
              ))}
            </div>

            <div className="mt-16">
              <h2 className="text-center text-2xl font-bold mb-6">Featured by</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
                <img className="opacity-75 mx-auto h-6" src="/other-img/in-cirro-press-1.svg" alt="press-1" />
                <img className="opacity-75 mx-auto h-6" src="/other-img/in-cirro-press-2.svg" alt="press-2" />
                <img className="opacity-75 mx-auto h-6" src="/other-img/in-cirro-press-3.svg" alt="press-3" />
                <img className="opacity-75 mx-auto h-6" src="/other-img/in-cirro-press-4.svg" alt="press-4" />
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
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Customers;
