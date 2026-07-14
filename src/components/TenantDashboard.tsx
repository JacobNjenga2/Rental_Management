import React, { useState } from 'react';
import { Property, Unit, Lease, Payment, MaintenanceRequest, Message } from '../types';
import { 
  CreditCard, Calendar, DollarSign, Wrench, FileText, Send, 
  MessageSquare, Check, CheckCircle2, Clock, AlertCircle, ArrowUpRight, ShieldCheck, RefreshCw
} from 'lucide-react';

interface TenantDashboardProps {
  lease: Lease | undefined;
  property: Property | undefined;
  unit: Unit | undefined;
  payments: Payment[];
  maintenance: MaintenanceRequest[];
  messages: Message[];
  onPayRent: (paymentId: string, amount: number, method: string) => void;
  onSubmitMaintenance: (title: string, description: string, category: string, priority: string, photo?: string) => void;
  onSendMessage: (content: string) => void;
}

export default function TenantDashboard({
  lease,
  property,
  unit,
  payments,
  maintenance,
  messages,
  onPayRent,
  onSubmitMaintenance,
  onSendMessage
}: TenantDashboardProps) {
  // Rent form states
  const [paymentMethod, setPaymentMethod] = useState<'M-Pesa' | 'Credit Card' | 'Bank Transfer'>('M-Pesa');
  const [routingNumber, setRoutingNumber] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [isAutoPay, setIsAutoPay] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Maintenance form states
  const [maintTitle, setMaintTitle] = useState('');
  const [maintDesc, setMaintDesc] = useState('');
  const [maintCategory, setMaintCategory] = useState('Plumbing');
  const [maintPriority, setMaintPriority] = useState('Medium');
  const [maintPhoto, setMaintPhoto] = useState('');
  const [maintSuccess, setMaintSuccess] = useState(false);

  // Chat states
  const [chatInput, setChatInput] = useState('');

  // Find due payment
  const activeRentDue = payments.find(p => p.status === 'Pending' || p.status === 'Overdue');

  const handlePayRentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRentDue) return;

    setPaymentProcessing(true);
    setTimeout(() => {
      onPayRent(activeRentDue.id, activeRentDue.amount, paymentMethod);
      setPaymentProcessing(false);
      setPaymentSuccess(true);
      setTimeout(() => setPaymentSuccess(false), 5000);
    }, 2000);
  };

  const handleMaintenanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!maintTitle.trim() || !maintDesc.trim()) return;

    onSubmitMaintenance(maintTitle, maintDesc, maintCategory, maintPriority, maintPhoto);
    setMaintTitle('');
    setMaintDesc('');
    setMaintCategory('Plumbing');
    setMaintPriority('Medium');
    setMaintPhoto('');
    setMaintSuccess(true);
    setTimeout(() => setMaintSuccess(false), 4000);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    onSendMessage(chatInput);
    setChatInput('');
  };

  return (
    <div className="space-y-6">
      {/* Overview Greeting */}
      <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-950">Welcome Home, {lease?.tenantName || 'Resident'}!</h2>
          <p className="text-xs text-slate-500 mt-1">
            Current Resident of <span className="font-semibold text-slate-800">{property?.name || 'Kilimani Heights Apartments'}</span>, Unit {unit?.number || '101'}.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span>Lease Ends: <span className="font-bold text-slate-800">{lease?.endDate || 'N/A'}</span></span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Payments & Lease Terms */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Rent Payment card */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-150 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-950 tracking-tight flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-blue-600" />
                  Rent & Balances
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Pay securely via M-Pesa STK push or credit card. Autopay enabled for monthly drafts.</p>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  id="autopay-toggle"
                  onClick={() => setIsAutoPay(!isAutoPay)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-hidden ${
                    isAutoPay ? 'bg-blue-600' : 'bg-slate-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ${
                      isAutoPay ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
                <span className="text-[11px] font-bold text-slate-600">Autopay {isAutoPay ? 'ON' : 'OFF'}</span>
              </div>
            </div>

            {activeRentDue ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Due status details */}
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Amount Outstanding</span>
                    <div className="text-2xl font-extrabold text-slate-950 mt-1 font-mono">Ksh {activeRentDue.amount.toLocaleString()}</div>
                    
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-2 font-semibold">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      <span>Due Date: {activeRentDue.dueDate}</span>
                    </div>

                    {activeRentDue.status === 'Overdue' && (
                      <div className="bg-red-50 text-red-700 text-[10px] p-2.5 rounded-lg border border-red-100 flex items-center gap-1.5 mt-4 font-bold">
                        <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                        <span>Overdue! A late fee of Ksh {(activeRentDue.lateFeeCharged || 1500).toLocaleString()} has been applied.</span>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-slate-200/50 pt-4 mt-4 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span className="text-[10px] text-slate-400 font-medium">PCI-DSS & ODPC Secure Transits.</span>
                  </div>
                </div>

                {/* Form pay */}
                <form onSubmit={handlePayRentSubmit} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Payment Method</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['M-Pesa', 'Credit Card', 'Bank Transfer'] as const).map((method) => (
                        <button
                          key={method}
                          id={`pay-method-${method.replace(' ', '')}`}
                          type="button"
                          onClick={() => setPaymentMethod(method)}
                          className={`py-2 text-[10px] font-bold rounded-lg border text-center transition-all cursor-pointer ${
                            paymentMethod === method 
                              ? 'bg-blue-50 text-blue-600 border-blue-500/30 ring-1 ring-blue-500/20' 
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {method}
                        </button>
                      ))}
                    </div>
                  </div>

                  {paymentMethod === 'M-Pesa' && (
                    <div className="space-y-2">
                      <div className="space-y-0.5">
                        <label className="text-[9px] font-bold text-slate-400 uppercase">M-Pesa Mobile Number</label>
                        <input
                          id="input-mpesa-phone"
                          type="text"
                          required
                          value={routingNumber}
                          onChange={(e) => setRoutingNumber(e.target.value)}
                          placeholder="e.g. 0712345678"
                          className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-hidden"
                        />
                      </div>
                      <p className="text-[9px] text-slate-400 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-150">
                        An STK Push PIN prompt will be sent immediately to this line. Authorize with your M-Pesa PIN to complete payment.
                      </p>
                    </div>
                  )}

                  {paymentMethod === 'Credit Card' && (
                    <div className="space-y-2">
                      <div className="space-y-0.5">
                        <label className="text-[9px] font-bold text-slate-400 uppercase">Card Number</label>
                        <input
                          id="input-card-number"
                          type="text"
                          required
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="4111 2222 3333 4444"
                          className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-hidden"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-0.5">
                          <label className="text-[9px] font-bold text-slate-400 uppercase">Expiration</label>
                          <input
                            id="input-card-expiry"
                            type="text"
                            required
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            placeholder="MM/YY"
                            maxLength={5}
                            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-hidden"
                          />
                        </div>
                        <div className="space-y-0.5">
                          <label className="text-[9px] font-bold text-slate-400 uppercase">CVV</label>
                          <input
                            id="input-card-cvv"
                            type="password"
                            required
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            placeholder="3-digits"
                            maxLength={4}
                            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-hidden"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'Bank Transfer' && (
                    <div className="bg-slate-50 p-3 rounded-lg text-[10px] text-slate-500 leading-relaxed border border-slate-200">
                      Use Kenyan local bank routing with Pesalink or direct SWIFT/RTGS parameters to process. Real-time bank checks occur automatically.
                    </div>
                  )}

                  {paymentSuccess && (
                    <div className="bg-emerald-50 text-emerald-700 text-[10px] p-2.5 rounded-lg border border-emerald-100 flex items-center gap-1.5 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>Payment Authorized! M-Pesa STK push receipt generated successfully.</span>
                    </div>
                  )}

                  <button
                    id="btn-submit-rent-payment"
                    type="submit"
                    disabled={paymentProcessing}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold py-2.5 rounded-lg text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                  >
                    {paymentProcessing ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Waiting for PIN on your phone...</span>
                      </>
                    ) : (
                      <>
                        <span>Pay Ksh {activeRentDue.amount.toLocaleString()} Now</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              <div className="bg-emerald-50/70 border border-emerald-250 p-4 rounded-xl flex items-center gap-3">
                <div className="bg-emerald-500 text-white p-2 rounded-lg">
                  <Check className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-emerald-900">Your account is fully paid!</h4>
                  <p className="text-[10px] text-emerald-600 mt-0.5">Your next rent payment statement will generate in 23 days.</p>
                </div>
              </div>
            )}
          </div>

          {/* Active Lease Terms Details */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-950 tracking-tight flex items-center gap-1.5 border-b border-slate-150 pb-3">
              <FileText className="w-4 h-4 text-blue-600" />
              Active Digital Lease Profile
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <p className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Monthly Rent</p>
                <p className="text-slate-800 font-extrabold text-sm mt-0.5 font-mono">Ksh {lease?.rentAmount?.toLocaleString() || 'N/A'}</p>
              </div>
              <div>
                <p className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Security Deposit</p>
                <p className="text-slate-800 font-extrabold text-sm mt-0.5 font-mono">Ksh {lease?.depositAmount?.toLocaleString() || 'N/A'}</p>
              </div>
              <div>
                <p className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Agreement Term</p>
                <p className="text-slate-800 font-bold mt-0.5">12 Months (Fixed)</p>
              </div>
              <div>
                <p className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Rent Grace Period</p>
                <p className="text-slate-800 font-bold mt-0.5">5 days (Late fee of Ksh 1,500)</p>
              </div>
              <div>
                <p className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Signed Agreement Date</p>
                <p className="text-slate-800 font-bold mt-0.5">{lease?.signedDate || 'N/A'}</p>
              </div>
              <div>
                <p className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Authorized Utilities</p>
                <p className="text-slate-800 font-bold mt-0.5">Trash & Borehole Water Inc.</p>
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-[11px] text-slate-600 leading-relaxed font-sans italic">
              "{lease?.terms || 'Standard terms apply.'}"
            </div>
          </div>
        </div>

        {/* Right Column: Submit Maintenance Request & Status Timeline */}
        <div className="space-y-6">
          
          {/* Submit maintenance */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-950 tracking-tight flex items-center gap-1.5">
                <Wrench className="w-4 h-4 text-amber-500" />
                Submit Repair Ticket
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Direct link to manager. Priority dispatches occur automatically.</p>
            </div>

            <form onSubmit={handleMaintenanceSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-0.5">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">Category</label>
                  <select
                    id="select-maint-category"
                    value={maintCategory}
                    onChange={(e) => setMaintCategory(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 font-semibold text-slate-700 focus:outline-hidden"
                  >
                    <option>Plumbing</option>
                    <option>Electrical</option>
                    <option>HVAC</option>
                    <option>Appliance</option>
                    <option>General</option>
                  </select>
                </div>
                <div className="space-y-0.5">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">Priority</label>
                  <select
                    id="select-maint-priority"
                    value={maintPriority}
                    onChange={(e) => setMaintPriority(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 font-semibold text-slate-700 focus:outline-hidden"
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Emergency</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Issue Title</label>
                <input
                  id="input-maint-title"
                  type="text"
                  required
                  value={maintTitle}
                  onChange={(e) => setMaintTitle(e.target.value)}
                  placeholder="e.g. Toilet is constantly overflowing"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Detailed Description</label>
                <textarea
                  id="textarea-maint-desc"
                  rows={3}
                  required
                  value={maintDesc}
                  onChange={(e) => setMaintDesc(e.target.value)}
                  placeholder="What is happening? When did it start? How can technicians access the unit?"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Photo Upload Link (Optional)</label>
                <input
                  id="input-maint-photo"
                  type="text"
                  value={maintPhoto}
                  onChange={(e) => setMaintPhoto(e.target.value)}
                  placeholder="Unsplash image URL or image link"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-hidden"
                />
              </div>

              {maintSuccess && (
                <div className="bg-emerald-50 text-emerald-700 text-[10px] p-2.5 rounded-lg border border-emerald-100 flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Ticket Submitted! Checked and queued for immediate dispatcher alert.</span>
                </div>
              )}

              <button
                id="btn-submit-maint-request"
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 rounded-lg text-xs transition-all cursor-pointer"
              >
                File Repair Request
              </button>
            </form>
          </div>

          {/* Active Maintenance Request Timeline Status */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-950 tracking-tight flex items-center gap-1.5 border-b border-slate-150 pb-3">
              <RefreshCw className="w-4 h-4 text-blue-600 animate-spin-slow" />
              Active Repair Timeline Logs
            </h3>

            <div className="space-y-4">
              {maintenance.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs">
                  No active repair logs filed yet.
                </div>
              ) : (
                maintenance.map((m) => (
                  <div key={m.id} className="border border-slate-200 rounded-lg p-3 bg-slate-50/50 space-y-2 text-xs">
                    <div className="flex justify-between items-center gap-2 border-b border-slate-150 pb-1.5">
                      <span className="font-bold text-slate-800 truncate">{m.title}</span>
                      <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded-full ${
                        m.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' :
                        m.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                        m.status === 'Assigned' ? 'bg-indigo-100 text-indigo-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {m.status}
                      </span>
                    </div>

                    <div className="space-y-2 mt-2">
                      {m.logs.map((log, index) => (
                        <div key={index} className="flex gap-2">
                          <div className="flex flex-col items-center">
                            <span className={`w-2 h-2 rounded-full block ${
                              log.status === m.status ? 'bg-blue-600 ring-4 ring-blue-50' : 'bg-slate-300'
                            }`} />
                            {index < m.logs.length - 1 && <span className="w-0.5 h-6 bg-slate-200 block" />}
                          </div>
                          <div>
                            <p className="font-bold text-[10px] text-slate-700">{log.status}</p>
                            <p className="text-[10px] text-slate-500 leading-normal">{log.note}</p>
                            <p className="text-[8px] text-slate-400 font-semibold mt-0.5">{new Date(log.updatedAt).toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
