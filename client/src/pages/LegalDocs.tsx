import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

const LegalDocs = () => {

  return (
    <div className="min-h-screen flex flex-col bg-light-lighter">
      <Header />
      <main className="flex-grow">
        <section className="bg-gradient-to-r from-primary to-blue-700 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Company <span className="text-info">Legal Docs</span></h1>
            <p className="text-xl opacity-90">Transparency and compliance you can trust</p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="card p-6">
                <div className="flex items-center mb-3">
                  <div className="icon-wrap bg-info text-white w-10 h-10 rounded flex items-center justify-center mr-2">📄</div>
                  <h3 className="text-lg font-bold">Terms of Service</h3>
                </div>
                <p className="text-gray-600 mb-3">Read the Terms of Service and License Agreement for NovalCapitalFX as well as our NovalCapitalFX & Developer Agreements.</p>
                <div className="text-sm text-primary underline">
                  License Agreement
                  <br />
                  <Link to="/legal-documents" className="font-bold underline hover:text-blue-700 transition">Term of Services for Trade</Link>
                </div>
              </div>
              <div className="card p-6">
                <div className="flex items-center mb-3">
                  <div className="icon-wrap bg-info text-white w-10 h-10 rounded flex items-center justify-center mr-2">🌐</div>
                  <h3 className="text-lg font-bold">Policies</h3>
                </div>
                <p className="text-gray-600 mb-3">Find out more about what information we collect at NovalCapitalFX, how we use it, and what control you have over your data.</p>
                <Link to="/legal-documents" className="text-sm text-primary underline hover:text-blue-700 transition">Privacy Statement</Link>
              </div>
              <div className="card p-6">
                <div className="flex items-center mb-3">
                  <div className="icon-wrap bg-info text-white w-10 h-10 rounded flex items-center justify-center mr-2">🛡️</div>
                  <h3 className="text-lg font-bold">Security</h3>
                </div>
                <p className="text-gray-600 mb-3">Learn more about how we keep your work and personal data safe when you’re using our services.</p>
                <div className="text-sm text-primary underline">
                  <span className="font-bold">Trade Security</span>
                  <br />
                  <Link to="/legal-documents" className="font-bold underline hover:text-blue-700 transition">Responsible Disclosure Policy</Link>
                </div>
              </div>
            </div>

            <div className="mt-12 grid md:grid-cols-3 gap-6">
              <div className="card p-6"><h4 className="font-bold mb-2">Licensing & Regulation</h4><p className="text-gray-600">We operate with strict compliance standards and strong internal controls.</p></div>
              <div className="card p-6"><h4 className="font-bold mb-2">Data Protection</h4><p className="text-gray-600">Industry-grade encryption and security to protect your personal data.</p></div>
              <div className="card p-6"><h4 className="font-bold mb-2">Responsible Trading</h4><p className="text-gray-600">We encourage responsible trading practices and risk management.</p></div>
            </div>
          </div>
        </section>

        {/* Top FAQs (verbatim) */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-2xl font-bold mb-2">Top FAQs</h2>
            <p className="text-gray-600 mb-6">These are our most asked questions.</p>
            <div className="space-y-4">
              <details className="card p-4" open>
                <summary className="font-semibold cursor-pointer">How do i contact the team</summary>
                <p className="text-gray-700 mt-2">NovalCapitalFX contact or support team usually take less than 24hrs to respond to any reasonable messages. How do you contact us? Easy, you can navigate to the contact section on the menu, where you can write us a mail. Or you can chat with out live support at the right corner of your screen.</p>
              </details>
              <details className="card p-4">
                <summary className="font-semibold cursor-pointer">Registration failed? How to fix</summary>
                <p className="text-gray-700 mt-2">Most at times registration issues could be as a result of poor internet connection, we advice you try again with a better network. And if it still fails you can contact our support team.</p>
              </details>
              <details className="card p-4">
                <summary className="font-semibold cursor-pointer">Website response taking time?</summary>
                <p className="text-gray-700 mt-2">if NovalCapitalFX.com starts having long load times we advice yo clear your browser history and cache, as most times is the cause of slow pages. Or better still get a better network.</p>
              </details>
              <details className="card p-4">
                <summary className="font-semibold cursor-pointer">Can my company request a custom plan?</summary>
                <p className="text-gray-700 mt-2">At NovalCapitalFX our investors are at our best intrest and yes your company can request for a new plan if the available doesnt suite you. On the condition that the agreement is to be made between the admins and your company.</p>
              </details>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default LegalDocs;
