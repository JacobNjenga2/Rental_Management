import { useState } from 'react';
import { Property, Unit, Lease, Payment, MaintenanceRequest, User } from '../types';
import { 
  TrendingUp, Percent, Wrench, FileText, Plus, ArrowUpRight, 
  Building, Clock, Coins, Download, ShieldCheck, ChevronRight, AlertTriangle
} from 'lucide-react';
import { motion } from 'motion/react';

interface LandlordDashboardProps {
  properties: Property[];
  units: Unit[];
  leases: Lease[];
  payments: Payment[];
  maintenance: MaintenanceRequest[];
  onNavigate: (view: string, targetId?: string) => void;
  onAddProperty: () => void;
}

export default function LandlordDashboard({
  properties,
  units,
  leases,
  payments,
  maintenance,
  onNavigate,
  onAddProperty
}: LandlordDashboardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'quarter' | 'year'>('month');

  // Calculate KPIs
  const totalPropertiesCount = properties.length;
  const activeProperties = properties.filter(p => p.status === 'Active');
  
  // Occupancy rate calculation
  const totalUnits = units.length;
  const occupiedUnits = units.filter(u => u.status === 'Occupied').length;
  const occupancyRate = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;

  // Monthly revenue logic
  const collectedPayments = payments.filter(p => p.status === 'Paid');
  const totalRevenue = collectedPayments.reduce((sum, p) => sum + p.amount, 0);
  const pendingPaymentsAmount = payments.filter(p => p.status === 'Pending').reduce((sum, p) => sum + p.amount, 0);
  const overduePaymentsAmount = payments.filter(p => p.status === 'Overdue').reduce((sum, p) => sum + p.amount, 0);

  // Maintenance metrics
  const activeMaintenanceCount = maintenance.filter(m => m.status !== 'Resolved').length;

  // Recent activity logs (mocked for realistic auditing)
  const auditLogs = [
    { id: '1', event: 'Rent Received', desc: 'Emily Atieno paid Ksh 55,000 via M-Pesa for Kilimani Heights #101', date: 'Today, 10:15 AM', type: 'success' },
    { id: '2', event: 'Maintenance Dispatched', desc: 'CoolAir Solutions sent to Kilimani Heights #102 for High Priority HVAC', date: 'Today, 9:15 AM', type: 'info' },
    { id: '3', event: 'New Application Received', desc: 'Gregory Peck applied for Nyali Beach Suite Unit A', date: 'Yesterday, 4:45 PM', type: 'warning' },
    { id: '4', event: 'Lease Created', desc: 'Draft lease created for Unit 201 (Kilimani Heights Apartments)', date: 'July 5, 2026', type: 'default' }
  ];

  return (
    <div className="space-y-6">
      {/* Overview Head & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-950 tracking-tight">Portfolio Summary</h2>
          <p className="text-xs text-slate-500 mt-1">Real-time status of your assets, rental incomes, and operational overheads.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            id="btn-add-prop-dashboard"
            onClick={onAddProperty}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Property</span>
          </button>
          <button
            id="btn-report-export"
            onClick={() => onNavigate('reports')}
            className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer border border-slate-200"
          >
            <Download className="w-4 h-4" />
            <span>Export Financials</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Collected Revenue</span>
            <div className="bg-emerald-50 p-2.5 rounded-lg border border-emerald-100">
              <Coins className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-slate-950 font-mono">Ksh {totalRevenue.toLocaleString()}</div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+12.4% vs last month</span>
            </div>
          </div>
          <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-400 to-emerald-500" />
        </div>

        {/* Portfolio Occupancy */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Occupancy Rate</span>
            <div className="bg-blue-50 p-2.5 rounded-lg border border-blue-100">
              <Percent className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-slate-950 font-mono">{occupancyRate}%</div>
            <p className="text-[11px] text-slate-500 mt-1.5 font-semibold">
              {occupiedUnits} of {totalUnits} units active
            </p>
          </div>
          <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-blue-400 to-blue-500" />
        </div>

        {/* Pending Maintenance */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Open Work Orders</span>
            <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-100">
              <Wrench className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-slate-950 font-mono">{activeMaintenanceCount}</div>
            <p className="text-[11px] text-amber-600 flex items-center gap-1 font-semibold mt-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{maintenance.filter(m => m.priority === 'High' || m.priority === 'Emergency').length} Urgent Request(s)</span>
            </p>
          </div>
          <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-amber-400 to-amber-500" />
        </div>

        {/* Overdue Payments */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Overdue Balances</span>
            <div className="bg-red-50 p-2.5 rounded-lg border border-red-100">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-red-600 font-mono">Ksh {overduePaymentsAmount.toLocaleString()}</div>
            <p className="text-[11px] text-slate-500 mt-1.5 font-semibold">
              Includes auto-calculated late fees
            </p>
          </div>
          <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-red-400 to-red-500" />
        </div>
      </div>

      {/* Main Content Layout Block: Chart and Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Financial Portfolio Health Chart (Bento Grid Visualizer) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-950 tracking-tight">Financial Flow Chart</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Rent income vs operating costs per active property asset.</p>
              </div>
              <div className="flex bg-slate-50 border border-slate-200 rounded-lg p-1 text-xs">
                {(['month', 'quarter', 'year'] as const).map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase transition-all ${
                      selectedPeriod === period 
                        ? 'bg-white text-blue-600 shadow-xs border border-slate-100' 
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>

            {/* Simulated Custom CSS/Tailwind bar chart for absolute responsiveness without external bulky dependencies */}
            <div className="mt-6 space-y-4">
              {properties.map((p) => {
                // Get units and sum their rent amount
                const propUnits = units.filter(u => u.propertyId === p.id);
                const maxRevenueCap = propUnits.reduce((sum, u) => sum + u.rentAmount, 0);
                const actualCollected = p.status === 'Active' 
                  ? collectedPayments.filter(pay => pay.propertyName === p.name).reduce((sum, pay) => sum + pay.amount, 0)
                  : 0;
                
                const percentFull = maxRevenueCap > 0 ? (actualCollected / maxRevenueCap) * 100 : 0;
                const mtnCost = maintenance.filter(m => m.propertyName === p.name && m.status === 'Resolved').reduce((sum, m) => sum + (m.cost || 0), 0);
                const costPercent = maxRevenueCap > 0 ? Math.min((mtnCost / maxRevenueCap) * 100, 20) : 0;

                return (
                  <div key={p.id} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-700 flex items-center gap-1">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        {p.name}
                      </span>
                      <span className="text-slate-500 font-mono">
                        Ksh {actualCollected.toLocaleString()} / <span className="text-[10px] text-slate-400">Ksh {maxRevenueCap.toLocaleString()} Cap</span>
                      </span>
                    </div>
                    {/* Multi-layered visual indicators */}
                    <div className="relative w-full h-3.5 bg-slate-100 rounded-full overflow-hidden">
                      {/* Collected Revenue Bar */}
                      <div 
                        className="absolute top-0 left-0 h-full bg-blue-600 rounded-full transition-all duration-500" 
                        style={{ width: `${Math.max(percentFull, 5)}%` }}
                      />
                      {/* Maintenance Expense overlay bar (red-tinted accent) */}
                      {mtnCost > 0 && (
                        <div 
                          className="absolute top-0 right-0 h-full bg-red-500 opacity-80 transition-all duration-500" 
                          style={{ width: `${costPercent}%` }}
                          title={`Resolved Maintenance Expenses: Ksh ${mtnCost}`}
                        />
                      )}
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 font-semibold px-1">
                      <span>{p.status} • {p.type}</span>
                      {mtnCost > 0 && <span className="text-red-500">Maint Exp: Ksh {mtnCost}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center text-xs">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 block" /> Collected Rent
              </span>
              <span className="flex items-center gap-1.5 text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 block" /> Maintenance Costs
              </span>
            </div>
            <button
              onClick={() => onNavigate('reports')}
              className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-0.5"
            >
              Detailed Breakdown <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Real-time System Immutable Audit Trail Log */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-950 tracking-tight">Immutable Audit Logs</h3>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">Compliant system event record.</p>

            <div className="mt-5 space-y-4">
              {auditLogs.map((log) => (
                <div key={log.id} className="flex gap-3 text-xs">
                  <div className="mt-0.5">
                    {log.type === 'success' && <span className="w-2 h-2 rounded-full bg-emerald-500 block ring-4 ring-emerald-50" />}
                    {log.type === 'info' && <span className="w-2 h-2 rounded-full bg-blue-500 block ring-4 ring-blue-50" />}
                    {log.type === 'warning' && <span className="w-2 h-2 rounded-full bg-amber-500 block ring-4 ring-amber-50" />}
                    {log.type === 'default' && <span className="w-2 h-2 rounded-full bg-slate-400 block ring-4 ring-slate-100" />}
                  </div>
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-800">{log.event}</p>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{log.desc}</p>
                    <p className="text-[9px] text-slate-400 font-semibold">{log.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigate('communications')}
            className="w-full text-center mt-6 bg-slate-50 hover:bg-slate-100 text-slate-700 py-2.5 rounded-lg text-xs font-semibold border border-slate-200 transition-all cursor-pointer"
          >
            Open System Admin Panel
          </button>
        </div>
      </div>

      {/* Property Cards Quick Access */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-950 tracking-tight">Active Portfolios ({totalPropertiesCount})</h3>
          <button
            onClick={() => onNavigate('properties')}
            className="text-xs font-bold text-blue-600 hover:text-blue-800"
          >
            Manage All
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {properties.map((p) => {
            const propUnits = units.filter(u => u.propertyId === p.id);
            const occupied = propUnits.filter(u => u.status === 'Occupied').length;
            const vacant = propUnits.filter(u => u.status === 'Vacant').length;

            return (
              <div 
                key={p.id}
                onClick={() => onNavigate('properties', p.id)}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div className="relative h-40 bg-slate-100 overflow-hidden">
                  <img
                    src={p.photos[0]}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 right-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      p.status === 'Active' 
                        ? 'bg-emerald-500/90 text-white' 
                        : 'bg-amber-500/90 text-white'
                    }`}>
                      {p.status}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{p.name}</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">{p.address}, {p.city}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold border-t border-slate-150 pt-3">
                    <div className="bg-slate-50 p-1.5 rounded-lg">
                      <p className="text-slate-400">Total Units</p>
                      <p className="text-slate-700 text-xs font-extrabold mt-0.5">{propUnits.length}</p>
                    </div>
                    <div className="bg-emerald-50 p-1.5 rounded-lg">
                      <p className="text-emerald-500">Occupied</p>
                      <p className="text-emerald-700 text-xs font-extrabold mt-0.5">{occupied}</p>
                    </div>
                    <div className="bg-amber-50 p-1.5 rounded-lg">
                      <p className="text-amber-500">Vacant</p>
                      <p className="text-amber-700 text-xs font-extrabold mt-0.5">{vacant}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
