import React, { useState } from 'react';
import { Property, Unit, Lease, Payment, MaintenanceRequest } from '../types';
import { 
  TrendingUp, TrendingDown, DollarSign, Activity, FileSpreadsheet, 
  Share2, Download, ArrowUpRight, PieChart, Calendar, ChevronRight
} from 'lucide-react';

interface FinancialReportsProps {
  properties: Property[];
  units: Unit[];
  leases: Lease[];
  payments: Payment[];
  maintenance: MaintenanceRequest[];
}

export default function FinancialReports({
  properties,
  units,
  leases,
  payments,
  maintenance
}: FinancialReportsProps) {
  const [selectedProperty, setSelectedProperty] = useState('all');

  // Filter payments & maintenance based on chosen property
  const filteredPayments = payments.filter(p => {
    if (selectedProperty === 'all') return true;
    const prop = properties.find(prop => prop.id === selectedProperty);
    return prop ? p.propertyName === prop.name : true;
  });

  const filteredMaintenance = maintenance.filter(m => {
    if (selectedProperty === 'all') return true;
    const prop = properties.find(prop => prop.id === selectedProperty);
    return prop ? m.propertyName === prop.name : true;
  });

  // Financial calculations
  const totalInvoiced = filteredPayments.reduce((sum, p) => sum + p.amount, 0);
  const collectedRent = filteredPayments.filter(p => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0);
  const outstandingRent = filteredPayments.filter(p => p.status === 'Pending' || p.status === 'Overdue').reduce((sum, p) => sum + p.amount, 0);

  // Resolved maintenance counts as operating expenses
  const operatingExpenses = filteredMaintenance.filter(m => m.status === 'Resolved').reduce((sum, m) => sum + (m.cost || 0), 0);
  const netOperatingIncome = collectedRent - operatingExpenses;

  // Collection performance rate
  const collectionRate = totalInvoiced > 0 ? Math.round((collectedRent / totalInvoiced) * 100) : 100;

  // Maintenance cost by category
  const categories: Record<string, number> = { Plumbing: 0, HVAC: 0, Electrical: 0, Appliance: 0, General: 0 };
  filteredMaintenance.forEach(m => {
    if (m.status === 'Resolved' && m.cost) {
      categories[m.category] = (categories[m.category] || 0) + m.cost;
    }
  });

  return (
    <div className="space-y-6">
      {/* Property selector */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-slate-950 tracking-tight">Reporting & Analytics Suite</h2>
          <p className="text-[11px] text-slate-500 mt-0.5">Filter by property assets to analyze income, vacancy patterns, and repair budgets.</p>
        </div>

        <select
          id="report-property-selector"
          value={selectedProperty}
          onChange={(e) => setSelectedProperty(e.target.value)}
          className="text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-700 focus:outline-hidden"
        >
          <option value="all">Consolidated Portfolio (All)</option>
          {properties.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* collected */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gross Income Collected</span>
          <div className="text-2xl font-bold text-slate-950 mt-1 font-mono">Ksh {collectedRent.toLocaleString()}</div>
          <div className="text-[10px] text-slate-500 mt-2 font-semibold">Realized rental deposits</div>
        </div>

        {/* expenses */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Operating Expenses (CapEx)</span>
          <div className="text-2xl font-bold text-slate-950 mt-1 font-mono">Ksh {operatingExpenses.toLocaleString()}</div>
          <div className="text-[10px] text-red-500 font-bold flex items-center gap-0.5 mt-2">
            <TrendingUp className="w-3.5 h-3.5" /> Maintenance resolution bills
          </div>
        </div>

        {/* Net Operating Income */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs relative overflow-hidden">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Net Operating Income (NOI)</span>
          <div className="text-2xl font-bold text-blue-600 mt-1 font-mono">Ksh {netOperatingIncome.toLocaleString()}</div>
          <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 mt-2">
            <TrendingUp className="w-3.5 h-3.5" /> Yield margin positive
          </div>
          <div className="absolute bottom-0 inset-x-0 h-1 bg-blue-500" />
        </div>

        {/* Collection performance */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Collection Efficiency</span>
          <div className="text-2xl font-bold text-slate-950 mt-1 font-mono">{collectionRate}%</div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2.5 overflow-hidden">
            <div className="bg-emerald-500 h-full transition-all" style={{ width: `${collectionRate}%` }} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Profit & Loss statement breakdown */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-slate-150 pb-3">
            <h3 className="text-sm font-bold text-slate-950 tracking-tight">Statement of Profit & Loss</h3>
            <span className="text-[10px] font-bold font-mono text-slate-400">JULY 2026</span>
          </div>

          <div className="space-y-3.5 text-xs">
            {/* Income */}
            <div className="space-y-2">
              <div className="font-bold text-blue-600 uppercase text-[10px] tracking-wider">Revenues & Inflows</div>
              <div className="flex justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                <span>Rental Inflow receipts</span>
                <span className="font-mono font-bold text-slate-800">+Ksh {collectedRent.toLocaleString()}</span>
              </div>
            </div>

            {/* Expenses */}
            <div className="space-y-2">
              <div className="font-bold text-red-500 uppercase text-[10px] tracking-wider">Expenses & Cash Outflows</div>
              <div className="flex justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                <span>Contractor Dispatches (Plumbing, HVAC)</span>
                <span className="font-mono font-bold text-slate-800">-Ksh {operatingExpenses.toLocaleString()}</span>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                <span>Legal Templates Compliance Filing</span>
                <span className="font-mono font-bold text-slate-800">-Ksh 15,000</span>
              </div>
            </div>

            {/* Summary */}
            <div className="border-t border-slate-150 pt-4 flex justify-between items-center font-extrabold text-sm text-slate-950">
              <span>Total Consolidated Net Income</span>
              <span className="text-emerald-600 font-mono">Ksh {(netOperatingIncome - 15000).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Operating Costs per maintenance categories */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-5">
          <div>
            <h3 className="text-sm font-bold text-slate-950 tracking-tight flex items-center gap-1.5 border-b border-slate-150 pb-3">
              <PieChart className="w-4 h-4 text-emerald-600" />
              Capital Expenditures by Category
            </h3>
          </div>

          <div className="space-y-3.5">
            {Object.entries(categories).map(([category, amt]) => {
              const maxAmt = Math.max(...Object.values(categories), 1);
              const percentage = Math.round((amt / maxAmt) * 100);

              return (
                <div key={category} className="space-y-1.5 text-xs">
                  <div className="flex justify-between font-bold text-slate-700">
                    <span>{category} Repair Bills</span>
                    <span className="font-mono">Ksh {amt.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-slate-50 h-2 rounded-full overflow-hidden border border-slate-200">
                    <div 
                      className="bg-emerald-500 h-full rounded-full transition-all" 
                      style={{ width: `${Math.max(percentage, amt > 0 ? 5 : 0)}%` }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-blue-50/60 border border-blue-200 p-4 rounded-lg text-[10px] text-blue-800 font-semibold">
            Automated alerts will notify managers if maintenance categories exceed 15% of gross property rent yields.
          </div>
        </div>

      </div>
    </div>
  );
}
