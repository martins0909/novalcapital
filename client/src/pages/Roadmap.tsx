import Header from '../components/Header';
import Footer from '../components/Footer';

const Roadmap = () => {
  const items = [
    {
      quarter: 'Q1',
      year: '2025',
      title: 'Core Platform Enhancements',
      points: [
        'Live pricing improvements',
        'Investment growth simulator v2',
        'Withdrawal and transactions rollout',
      ],
    },
    {
      quarter: 'Q2',
      year: '2025',
      title: 'Security & Compliance',
      points: [
        '2FA and device approvals',
        'KYC workflow & reviews',
        'Extended audit logs',
      ],
    },
    {
      quarter: 'Q3',
      year: '2025',
      title: 'Payments & Deposits',
      points: [
        'Payment gateway integration',
        'Deposit and recurring plans',
        'Email notifications and alerts',
      ],
    },
    {
      quarter: 'Q4',
      year: '2025',
      title: 'Realtime & Mobile',
      points: [
        'WebSocket realtime updates',
        'Mobile app (React Native)',
        'Admin analytics dashboards',
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-light-lighter">
      <Header />
      <main className="flex-grow">
        <section className="bg-gradient-to-r from-primary to-blue-700 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Product Roadmap</h1>
            <p className="text-xl opacity-90">A transparent look at where we're headed</p>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-6">
              {items.map((item, i) => (
                <div key={i} className="card p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-gray-500">{item.quarter} {item.year}</div>
                    <img src="/img/in-cirro-2-icon-4.svg" className="w-6 h-6" alt="milestone" />
                  </div>
                  <h3 className="text-lg font-bold mb-3">{item.title}</h3>
                  <ul className="list-disc pl-5 text-gray-700 space-y-1">
                    {item.points.map((p, idx) => (
                      <li key={idx}>{p}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Roadmap;
