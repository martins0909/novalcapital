import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const employmentOptions = ["Employed", "Unemployed", "Self-employed", "Retired"];
const jobTitleOptions = ["Director", "Founder", "Employee"];
const incomeOptions = ["Less than $25,000", "$25,000 - $50,000", "$50,000 - $100,000", "$100,000 - $250,000", "Above $250,000"];
const currencyOptions = ["Dollar", "Pounds", "Euro"];

const TellUsMore: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    username: "",
    employmentStatus: "",
    jobTitle: "",
    annualIncome: "",
    currency: "",
    phone: "",
    city: "",
    contactAddress: "",
    zipCode: ""
  });

  // Get user data from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const referralCode = user.referralCode;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // You can add validation or API call here
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col bg-light-lighter">
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-stretch min-h-screen">
            <div className="hidden md:flex md:w-1/2 items-center justify-center bg-gray-50">
              <img src="/other-img/call.jpg" alt="Tell us more visual" className="max-w-full h-auto object-cover rounded-3xl shadow-lg shadow-white" />
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div className="max-w-md mx-auto">
                <div className="card p-8">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Tell us more about yourself</h2>
                    <p className="text-gray-600">make your trading journey easy and fun!</p>
                    {referralCode && (
                      <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                        <p className="text-green-800 font-semibold">Your Referral Code:</p>
                        <p className="text-green-600 text-lg font-mono">{referralCode}</p>
                        <p className="text-sm text-green-700 mt-1">Share this code to earn $5 for each successful referral!</p>
                      </div>
                    )}
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">FULL NAME</label>
                      <input type="text" name="fullName" value={form.fullName} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">USERNAME</label>
                      <input type="text" name="username" value={form.username} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">EMPLOYMENT STATUS</label>
                      <select name="employmentStatus" value={form.employmentStatus} onChange={handleChange} className="w-full border rounded px-3 py-2" required>
              <option value="">Select status</option>
              {employmentOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">JOB TITLE</label>
            <select name="jobTitle" value={form.jobTitle} onChange={handleChange} className="w-full border rounded px-3 py-2" required>
              <option value="">Select job title</option>
              {jobTitleOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">ANNUAL INCOME</label>
            <select name="annualIncome" value={form.annualIncome} onChange={handleChange} className="w-full border rounded px-3 py-2" required>
              <option value="">Select income</option>
              {incomeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">CURRENCY</label>
            <select name="currency" value={form.currency} onChange={handleChange} className="w-full border rounded px-3 py-2" required>
              <option value="">Select currency</option>
              {currencyOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">PHONE</label>
            <input type="text" name="phone" value={form.phone} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">CITY</label>
            <input type="text" name="city" value={form.city} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">CONTACT ADDRESS</label>
            <input type="text" name="contactAddress" value={form.contactAddress} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">ZIP CODE</label>
            <input type="text" name="zipCode" value={form.zipCode} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
          </div>
                    <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded font-bold mt-4">CONTINUE</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TellUsMore;
