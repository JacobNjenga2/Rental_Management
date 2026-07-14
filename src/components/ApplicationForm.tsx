import React, { useState } from 'react';
import { TenantApplication, Property, Unit } from '../types';
import { 
  UserCheck, ShieldAlert, CheckCircle2, XCircle, RefreshCw, 
  HelpCircle, AlertTriangle, FileText, UploadCloud
} from 'lucide-react';

interface ApplicationFormProps {
  properties: Property[];
  units: Unit[];
  onSubmitApplication: (app: Omit<TenantApplication, 'id' | 'createdAt'>) => void;
}

export default function ApplicationForm({
  properties,
  units,
  onSubmitApplication
}: ApplicationFormProps) {
  // Form states
  const [applicantName, setApplicantName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedPropertyId, setSelectedPropertyId] = useState(properties[0]?.id || '');
  const [selectedUnitId, setSelectedUnitId] = useState('');
  const [requestedStartDate, setRequestedStartDate] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [creditScore, setCreditScore] = useState('');

  // Simulation states
  const [isScreening, setIsScreening] = useState(false);
  const [backgroundPassed, setBackgroundPassed] = useState<'Passed' | 'Failed' | 'Pending'>('Pending');
  const [creditPassed, setCreditPassed] = useState<'Passed' | 'Failed' | 'Pending'>('Pending');
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Available units for chosen property
  const availableUnits = units.filter(u => u.propertyId === selectedPropertyId && u.status === 'Vacant');

  const handleScreeningTrigger = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !email || !selectedPropertyId || !monthlyIncome || !creditScore) return;

    setIsScreening(true);

    // Simulate real-time background and credit screening checks
    setTimeout(() => {
      const scoreNum = parseInt(creditScore);
      const incomeNum = parseInt(monthlyIncome);

      const creditRes = scoreNum >= 620 ? 'Passed' : 'Failed';
      const bgRes = scoreNum >= 580 ? 'Passed' : 'Failed';

      setCreditPassed(creditRes);
      setBackgroundPassed(bgRes);
      setIsScreening(false);

      const chosenProperty = properties.find(p => p.id === selectedPropertyId);
      const chosenUnit = units.find(u => u.id === selectedUnitId);

      onSubmitApplication({
        applicantName,
        email,
        phone,
        propertyId: selectedPropertyId,
        propertyName: chosenProperty?.name || 'Unknown Property',
        unitId: selectedUnitId,
        unitNumber: chosenUnit?.number || 'N/A',
        requestedStartDate,
        monthlyIncome: incomeNum,
        creditScore: scoreNum,
        backgroundCheckStatus: bgRes,
        creditCheckStatus: creditRes,
        status: creditRes === 'Passed' && bgRes === 'Passed' ? 'Screening' : 'Received'
      });

      setFormSubmitted(true);
      setTimeout(() => {
        setFormSubmitted(false);
        // Clear inputs
        setApplicantName('');
        setEmail('');
        setPhone('');
        setMonthlyIncome('');
        setCreditScore('');
      }, 5000);

    }, 2000);
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs max-w-4xl mx-auto space-y-6">
      <div className="border-b border-slate-150 pb-4">
        <h2 className="text-lg font-bold text-slate-950 tracking-tight flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-blue-600" />
          Resident Screening & Application form
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Apply online securely. Submissions undergo immediate background certification & financial credit checks.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Screening form */}
        <form onSubmit={handleScreeningTrigger} className="md:col-span-2 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Applicant Full Name</label>
              <input
                id="applicant-name"
                type="text"
                required
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                placeholder="e.g. Angela Atieno"
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-hidden focus:border-blue-500 font-semibold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Email Address</label>
              <input
                id="applicant-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="angela.atieno@gmail.com"
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-hidden focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Phone Number</label>
              <input
                id="applicant-phone"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+254 712 345678"
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-hidden focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Requested Move-In Date</label>
              <input
                id="applicant-startdate"
                type="date"
                required
                value={requestedStartDate}
                onChange={(e) => setRequestedStartDate(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-hidden focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Target Property Asset</label>
              <select
                id="applicant-property"
                value={selectedPropertyId}
                onChange={(e) => {
                  setSelectedPropertyId(e.target.value);
                  setSelectedUnitId('');
                }}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-hidden font-semibold text-slate-700"
              >
                {properties.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Target Apartment Unit</label>
              <select
                id="applicant-unit"
                required
                value={selectedUnitId}
                onChange={(e) => setSelectedUnitId(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-hidden font-semibold text-slate-700"
              >
                <option value="">Select Vacant Unit</option>
                {availableUnits.map(u => (
                  <option key={u.id} value={u.id}>Unit {u.number} (Ksh {u.rentAmount.toLocaleString()}/mo)</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 pt-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Provable Gross Monthly Income (Ksh)</label>
              <input
                id="applicant-income"
                type="number"
                required
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(e.target.value)}
                placeholder="e.g. 150000"
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-hidden focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Credit Score (Estimate)</label>
              <input
                id="applicant-credit"
                type="number"
                required
                value={creditScore}
                onChange={(e) => setCreditScore(e.target.value)}
                placeholder="e.g. 720"
                min={300}
                max={850}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-hidden focus:border-blue-500"
              />
            </div>
          </div>

          {/* Form alert and submittals */}
          {formSubmitted && (
            <div className="bg-emerald-50 text-emerald-700 text-[11px] p-3 rounded-lg border border-emerald-200 flex items-center gap-2 font-semibold">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <span>Application received! Credit Reference Bureau (CRB) and background checks cleared.</span>
            </div>
          )}

          <button
            id="btn-apply-tenant-submit"
            type="submit"
            disabled={isScreening}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold py-3 rounded-lg text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            {isScreening ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Querying Credit Reference Bureau (CRB) Database...</span>
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                <span>Submit Rental Application</span>
              </>
            )}
          </button>
        </form>

        {/* Info panel with checks */}
        <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl space-y-4 shadow-xs">
          <h3 className="text-xs font-bold text-slate-950 uppercase tracking-wider">Screening Criteria</h3>
          
          <div className="space-y-3.5 text-xs text-slate-600">
            <div className="flex gap-2.5">
              <CheckCircle2 className="w-4.5 h-4.5 text-blue-600 shrink-0" />
              <div>
                <p className="font-bold text-slate-800">Income Threshold</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Gross monthly earnings must exceed 3x the unit’s monthly rent amount.</p>
              </div>
            </div>

            <div className="flex gap-2.5">
              <CheckCircle2 className="w-4.5 h-4.5 text-blue-600 shrink-0" />
              <div>
                <p className="font-bold text-slate-800">Credit Benchmark</p>
                <p className="text-[10px] text-slate-500 mt-0.5">A credit score of 620+ is required. High credit scores waive deposits.</p>
              </div>
            </div>

            <div className="flex gap-2.5">
              <CheckCircle2 className="w-4.5 h-4.5 text-blue-600 shrink-0" />
              <div>
                <p className="font-bold text-slate-800">Background Checks</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Eviction searches, court records, and bankruptcy scans compiled instantly.</p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-4 space-y-3">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase">Interactive Check Results</h4>
            
            <div className="space-y-2 text-[10px] font-bold">
              <div className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-500">CRB Credit Check</span>
                <span className={`px-2 py-0.5 rounded-full ${
                  creditPassed === 'Passed' ? 'bg-emerald-50 text-emerald-600' :
                  creditPassed === 'Failed' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-500'
                }`}>{creditPassed}</span>
              </div>

              <div className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-500">Background Verification</span>
                <span className={`px-2 py-0.5 rounded-full ${
                  backgroundPassed === 'Passed' ? 'bg-emerald-50 text-emerald-600' :
                  backgroundPassed === 'Failed' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-500'
                }`}>{backgroundPassed}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
