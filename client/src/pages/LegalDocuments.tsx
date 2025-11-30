import Header from '../components/Header';
import Footer from '../components/Footer';
import { useState } from 'react';

const LegalDocuments = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="min-h-screen flex flex-col bg-light-lighter">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-blue-700 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Legal Documents</h1>
            <p className="text-xl opacity-90">Important information about our terms and policies</p>
          </div>
        </section>

        {/* Legal Documents Section */}
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            
            {/* Terms and Conditions */}
            <div className="card mb-4">
              <button
                onClick={() => toggleSection('terms')}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 transition"
                aria-expanded={expandedSection === 'terms'}
              >
                <h2 className="text-xl font-bold text-heading">Terms and Conditions</h2>
                <svg
                  className={`w-6 h-6 text-primary transform transition-transform ${
                    expandedSection === 'terms' ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {expandedSection === 'terms' && (
                <div className="px-4 pb-4 border-t pt-4">
                  <div className="prose max-w-none">
                    <h3 className="text-xl font-bold mb-4">1. Acceptance of Terms</h3>
                    <p className="text-gray-700 mb-4">
                      By accessing and using NovalCapitalFX platform, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                    </p>
                    
                    <h3 className="text-xl font-bold mb-4">2. Use License</h3>
                    <p className="text-gray-700 mb-4">
                      Permission is granted to temporarily access the materials (information or software) on NovalCapitalFX's platform for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                    </p>
                    <ul className="list-disc pl-6 mb-4 text-gray-700">
                      <li>Modify or copy the materials</li>
                      <li>Use the materials for any commercial purpose or for any public display</li>
                      <li>Attempt to reverse engineer any software contained on NovalCapitalFX's platform</li>
                      <li>Remove any copyright or other proprietary notations from the materials</li>
                    </ul>

                    <h3 className="text-xl font-bold mb-4">3. Account Registration</h3>
                    <p className="text-gray-700 mb-4">
                      To access certain features of our platform, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
                    </p>

                    <h3 className="text-xl font-bold mb-4">4. Trading Services</h3>
                    <p className="text-gray-700 mb-4">
                      NovalCapitalFX provides trading services for various financial instruments including forex, stocks, cryptocurrencies, and commodities. All trades are subject to market conditions and platform availability.
                    </p>

                    <h3 className="text-xl font-bold mb-4">5. Limitation of Liability</h3>
                    <p className="text-gray-700 mb-4">
                      In no event shall NovalCapitalFX or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on NovalCapitalFX's platform.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Risks and Disclosure */}
            <div className="card mb-4">
              <button
                onClick={() => toggleSection('risks')}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 transition"
                aria-expanded={expandedSection === 'risks'}
              >
                <h2 className="text-xl font-bold text-heading">Risks and Disclosure</h2>
                <svg
                  className={`w-6 h-6 text-primary transform transition-transform ${
                    expandedSection === 'risks' ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {expandedSection === 'risks' && (
                <div className="px-4 pb-4 border-t pt-4">
                  <div className="prose max-w-none">
                    <h3 className="text-xl font-bold mb-4">Trading Risks</h3>
                    <p className="text-gray-700 mb-4">
                      <strong>WARNING:</strong> Trading in financial instruments involves substantial risk and is not suitable for all investors. You can lose more than your initial investment.
                    </p>

                    <h3 className="text-xl font-bold mb-4">Market Risk</h3>
                    <p className="text-gray-700 mb-4">
                      The value of investments and the income from them can go down as well as up, and you may not get back the amount you originally invested. Market conditions can change rapidly, and past performance is not indicative of future results.
                    </p>

                    <h3 className="text-xl font-bold mb-4">Leverage Risk</h3>
                    <p className="text-gray-700 mb-4">
                      Trading with leverage can magnify both profits and losses. A small market movement can have a proportionally larger impact on your leveraged position. You should only trade with leverage if you understand the risks involved.
                    </p>

                    <h3 className="text-xl font-bold mb-4">Currency Risk</h3>
                    <p className="text-gray-700 mb-4">
                      If you trade in foreign currencies, changes in exchange rates may cause the value of your investment to fluctuate. Movements in exchange rates can have an adverse effect on the value, price, or income of your investments.
                    </p>

                    <h3 className="text-xl font-bold mb-4">Technology Risk</h3>
                    <p className="text-gray-700 mb-4">
                      Electronic trading systems may be subject to interruption or failure. Your ability to execute trades or monitor positions may be affected by system outages or connectivity issues.
                    </p>

                    <h3 className="text-xl font-bold mb-4">Important Disclosure</h3>
                    <p className="text-gray-700 mb-4">
                      Before trading, you should carefully consider your investment objectives, level of experience, and risk appetite. You should only invest money you can afford to lose. Seek independent financial advice if necessary.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Anti Money Laundering (AML) */}
            <div className="card mb-4">
              <button
                onClick={() => toggleSection('aml')}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 transition"
                aria-expanded={expandedSection === 'aml'}
              >
                <h2 className="text-xl font-bold text-heading">Anti Money Laundering (AML)</h2>
                <svg
                  className={`w-6 h-6 text-primary transform transition-transform ${
                    expandedSection === 'aml' ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {expandedSection === 'aml' && (
                <div className="px-4 pb-4 border-t pt-4">
                  <div className="prose max-w-none">
                    <h3 className="text-xl font-bold mb-4">AML Policy</h3>
                    <p className="text-gray-700 mb-4">
                      NovalCapitalFX is committed to preventing money laundering and terrorist financing. We comply with all applicable anti-money laundering (AML) and counter-terrorist financing (CTF) laws and regulations.
                    </p>

                    <h3 className="text-xl font-bold mb-4">Customer Due Diligence</h3>
                    <p className="text-gray-700 mb-4">
                      We are required to verify the identity of all our customers. During the account opening process, you will be asked to provide:
                    </p>
                    <ul className="list-disc pl-6 mb-4 text-gray-700">
                      <li>Valid government-issued photo identification (passport, driver's license, or national ID card)</li>
                      <li>Proof of residential address (utility bill, bank statement, or similar document)</li>
                      <li>Additional documentation may be required based on your jurisdiction and account type</li>
                    </ul>

                    <h3 className="text-xl font-bold mb-4">Enhanced Due Diligence</h3>
                    <p className="text-gray-700 mb-4">
                      For certain high-risk customers or transactions, we may conduct enhanced due diligence, which may include additional verification steps and documentation requirements.
                    </p>

                    <h3 className="text-xl font-bold mb-4">Transaction Monitoring</h3>
                    <p className="text-gray-700 mb-4">
                      We monitor all transactions to detect suspicious activity. Unusual patterns or large transactions may be flagged for review. We reserve the right to request additional information about the source of funds for any transaction.
                    </p>

                    <h3 className="text-xl font-bold mb-4">Suspicious Activity Reporting</h3>
                    <p className="text-gray-700 mb-4">
                      If we detect or suspect suspicious activity, we are legally required to report it to the relevant authorities. We may be prohibited from informing you of such reports.
                    </p>

                    <h3 className="text-xl font-bold mb-4">Compliance Requirements</h3>
                    <p className="text-gray-700 mb-4">
                      By using our services, you agree to:
                    </p>
                    <ul className="list-disc pl-6 mb-4 text-gray-700">
                      <li>Provide accurate and truthful information during the verification process</li>
                      <li>Not use the platform for any illegal purposes, including money laundering or terrorist financing</li>
                      <li>Cooperate with our compliance team if additional information is requested</li>
                      <li>Notify us of any changes to your personal information</li>
                    </ul>

                    <h3 className="text-xl font-bold mb-4">Record Keeping</h3>
                    <p className="text-gray-700 mb-4">
                      We maintain records of all customer identification documents and transaction records for at least five years, or as required by applicable law.
                    </p>
                  </div>
                </div>
              )}
            </div>

          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default LegalDocuments;
