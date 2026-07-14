import React, { useState } from 'react';
import { Property, Unit, MaintenanceRequest, TenantApplication, Message } from '../types';
import { 
  Megaphone, UserCheck, ShieldAlert, Wrench, Truck, Send, Users, 
  CheckCircle2, XCircle, Search, Mail, Phone, Building, AlertTriangle, UserMinus
} from 'lucide-react';

interface ManagerDashboardProps {
  properties: Property[];
  units: Unit[];
  applications: TenantApplication[];
  maintenance: MaintenanceRequest[];
  onApproveApplication: (id: string) => void;
  onRejectApplication: (id: string) => void;
  onAssignTechnician: (id: string, tech: string) => void;
  onBroadcastAnnouncement: (title: string, content: string, scope: string) => void;
}

export default function ManagerDashboard({
  properties,
  units,
  applications,
  maintenance,
  onApproveApplication,
  onRejectApplication,
  onAssignTechnician,
  onBroadcastAnnouncement
}: ManagerDashboardProps) {
  // Local states for the announcement broadcaster
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementContent, setAnnouncementContent] = useState('');
  const [announcementScope, setAnnouncementScope] = useState('all');
  const [announcementSuccess, setAnnouncementSuccess] = useState(false);

  // Local state for technician inputs
  const [assigningMaintId, setAssigningMaintId] = useState<string | null>(null);
  const [techName, setTechName] = useState('');

  // Local state for tenant application screening filters
  const [appFilter, setAppFilter] = useState<'all' | 'Received' | 'Screening' | 'Approved'>('all');

  // Filtered lists
  const filteredApps = applications.filter(app => appFilter === 'all' || app.status === appFilter);
  const unassignedMaintenance = maintenance.filter(m => m.status === 'Submitted' || !m.assignedTechnician);

  const handleBroadcastSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementTitle.trim() || !announcementContent.trim()) return;

    onBroadcastAnnouncement(announcementTitle, announcementContent, announcementScope);
    setAnnouncementTitle('');
    setAnnouncementContent('');
    setAnnouncementSuccess(true);
    setTimeout(() => setAnnouncementSuccess(false), 4000);
  };

  const handleAssignSubmit = (maintId: string) => {
    if (!techName.trim()) return;
    onAssignTechnician(maintId, techName);
    setTechName('');
    setAssigningMaintId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white text-slate-800 p-6 rounded-xl border border-slate-200 shadow-xs relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-950">Operations Dashboard</h2>
            <p className="text-xs text-slate-500 mt-1">Tenant applicant screenings, contractor assignments, and active community alerts.</p>
          </div>
          <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="text-center px-4 border-r border-slate-200">
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Screening</p>
              <p className="text-base font-bold text-slate-900 font-mono">{applications.filter(a => a.status === 'Screening').length}</p>
            </div>
            <div className="text-center px-4">
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Dispatches</p>
              <p className="text-base font-bold text-emerald-600 font-mono">{maintenance.filter(m => m.status === 'Assigned').length}</p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Main Grid: Left column handles tenant applications & dispatches, Right column handles announcements & broadcasts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Column 1: Tenant Screening Workflow & Applications */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-150 pb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-950 tracking-tight flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-blue-600" />
                  Applicant Screening Hub
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Automated visual credit multipliers & criminal background certifications.</p>
              </div>
              
              <div className="flex rounded-lg bg-slate-50 border border-slate-200 p-1 text-xs">
                {(['all', 'Received', 'Screening', 'Approved'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setAppFilter(filter)}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all capitalize ${
                      appFilter === filter 
                        ? 'bg-white text-blue-600 shadow-xs' 
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {filter === 'all' ? 'All' : filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Applications List */}
            <div className="space-y-4">
              {filteredApps.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No tenant applications found matching this status.
                </div>
              ) : (
                filteredApps.map((app) => {
                  const meetsCriteria = app.creditScore >= 650 && app.monthlyIncome >= 3000;
                  return (
                    <div key={app.id} className="border border-slate-200 rounded-lg p-4 bg-slate-50/50 hover:bg-slate-50 transition-all space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-150 pb-2.5">
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{app.applicantName}</h4>
                          <p className="text-[10px] text-slate-500 mt-0.5">Applied for {app.propertyName} • Unit {app.unitNumber}</p>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 font-bold uppercase rounded-full ${
                          app.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                          app.status === 'Rejected' ? 'bg-red-50 text-red-600 border border-red-200' :
                          app.status === 'Screening' ? 'bg-blue-50 text-blue-600 border border-blue-200' :
                          'bg-amber-50 text-amber-600 border border-amber-200'
                        }`}>
                          {app.status}
                        </span>
                      </div>

                      {/* Info & Screen Results Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[10px]">
                        <div>
                          <p className="text-slate-400">Monthly Income</p>
                          <p className="text-slate-700 font-bold text-xs mt-0.5">Ksh {app.monthlyIncome.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Credit Score</p>
                          <p className={`font-bold text-xs mt-0.5 ${app.creditScore >= 650 ? 'text-emerald-600' : 'text-amber-600'}`}>
                            {app.creditScore} {app.creditScore >= 700 ? 'Excellent' : app.creditScore >= 620 ? 'Fair' : 'Poor'}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-400">Background Cert</p>
                          <p className="text-emerald-600 font-bold flex items-center gap-0.5 mt-0.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 inline" /> Checked
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-400">Applicant Contact</p>
                          <p className="text-slate-700 font-mono mt-0.5">{app.phone}</p>
                        </div>
                      </div>

                      {/* Conditional Screening Actions */}
                      {app.status !== 'Approved' && app.status !== 'Rejected' && (
                        <div className="flex items-center justify-between border-t border-slate-150 pt-2.5">
                          <div className="flex items-center gap-1.5 text-[9px] text-slate-500">
                            {meetsCriteria ? (
                              <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                                <ShieldAlert className="w-3.5 h-3.5 text-emerald-500 inline" /> Highly Recommended
                              </span>
                            ) : (
                              <span className="text-amber-600 font-bold flex items-center gap-0.5">
                                <AlertTriangle className="w-3.5 h-3.5 text-amber-500 inline" /> Income/Credit Risk Warn
                              </span>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button
                              id={`btn-approve-app-${app.id}`}
                              onClick={() => onApproveApplication(app.id)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                            >
                              <CheckCircle2 className="w-3 h-3" /> Approve
                            </button>
                            <button
                              id={`btn-reject-app-${app.id}`}
                              onClick={() => onRejectApplication(app.id)}
                              className="bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-700 px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer border border-slate-200"
                            >
                              <XCircle className="w-3 h-3" /> Decline
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Maintenance Technician Dispatching Control */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-950 tracking-tight flex items-center gap-1.5">
                <Wrench className="w-4 h-4 text-emerald-600" />
                Technician Scheduling & Dispatch
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Assign sub-contractors, allocate budgets, and audit pending tickets.</p>
            </div>

            <div className="space-y-3">
              {unassignedMaintenance.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs bg-slate-50 rounded-xl">
                  All active maintenance requests are assigned. Good work!
                </div>
              ) : (
                unassignedMaintenance.map((m) => (
                  <div key={m.id} className="border border-slate-200 rounded-lg p-4 bg-slate-50/50 hover:bg-slate-50 transition-all space-y-3">
                    <div className="flex justify-between items-start gap-2 border-b border-slate-150 pb-2">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{m.title}</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">Submitted by {m.tenantName} ({m.propertyName} #{m.unitNumber})</p>
                      </div>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase ${
                        m.priority === 'Emergency' ? 'bg-red-100 text-red-600 ring-1 ring-red-200' :
                        m.priority === 'High' ? 'bg-orange-100 text-orange-600' :
                        m.priority === 'Medium' ? 'bg-blue-100 text-blue-600' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {m.priority}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 leading-relaxed bg-white p-2 rounded-lg border border-slate-200">{m.description}</p>

                    {assigningMaintId === m.id ? (
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-slate-150/50 p-2.5 rounded-lg border border-slate-200">
                        <input
                          id={`input-tech-name-${m.id}`}
                          type="text"
                          value={techName}
                          onChange={(e) => setTechName(e.target.value)}
                          placeholder="Vendor Name (e.g. Jack Reynolds)"
                          className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:border-blue-500 flex-1"
                        />
                        <div className="flex gap-1.5">
                          <button
                            id={`btn-save-dispatch-${m.id}`}
                            onClick={() => handleAssignSubmit(m.id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                          >
                            Dispatch Vendor
                          </button>
                          <button
                            onClick={() => setAssigningMaintId(null)}
                            className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-3.5 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer border border-slate-300"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-end pt-1">
                        <button
                          id={`btn-dispatch-init-${m.id}`}
                          onClick={() => setAssigningMaintId(m.id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Truck className="w-3.5 h-3.5" /> Assign & Dispatch Technician
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Column 2: Broadcaster & Announcements and Vendors Directory */}
        <div className="space-y-6">
          
          {/* Broadcaster Announcement */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-950 tracking-tight flex items-center gap-1.5">
                <Megaphone className="w-4 h-4 text-amber-500 animate-pulse" />
                Community Broadcaster
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Send high-priority global alerts, water updates, or compliance reviews.</p>
            </div>

            <form onSubmit={handleBroadcastSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Alert Scope</label>
                <select
                  id="select-announcement-scope"
                  value={announcementScope}
                  onChange={(e) => setAnnouncementScope(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-700 focus:outline-hidden"
                >
                  <option value="all">All Active Portfolios</option>
                  <option value="prop-1">Kilimani Heights Residents</option>
                  <option value="prop-2">Lavington Oasis Residents</option>
                  <option value="prop-3">Westlands Heights Residents</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Alert Title</label>
                <input
                  id="input-announcement-title"
                  type="text"
                  value={announcementTitle}
                  onChange={(e) => setAnnouncementTitle(e.target.value)}
                  placeholder="e.g. Schedule Water Shut-Off"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Alert Message / Content</label>
                <textarea
                  id="textarea-announcement-content"
                  rows={4}
                  value={announcementContent}
                  onChange={(e) => setAnnouncementContent(e.target.value)}
                  placeholder="Describe details, dates, instructions..."
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-hidden focus:border-blue-500"
                />
              </div>

              {announcementSuccess && (
                <div className="bg-emerald-50 text-emerald-700 text-[11px] p-2.5 rounded-lg border border-emerald-100 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Announcement broadcasted successfully! SMS & emails queued.</span>
                </div>
              )}

              <button
                id="btn-broadcast-alert"
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-lg text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" /> Broadcast Announcement
              </button>
            </form>
          </div>

          {/* Handyman / Contractor Vendor Directory */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-950 tracking-tight flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-blue-600" />
              Verified Vendor Directory
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-lg border border-slate-200/50 text-[11px]">
                <div>
                  <p className="font-bold text-slate-800">Pro Plumbing LLC</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Emergency response, drain clogs</p>
                </div>
                <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-bold font-mono text-[9px] border border-blue-100">Plumbing</span>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-lg border border-slate-200/50 text-[11px]">
                <div>
                  <p className="font-bold text-slate-800">CoolAir Solutions</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">AC compressors, heating units</p>
                </div>
                <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold font-mono text-[9px] border border-emerald-100">HVAC</span>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-lg border border-slate-200/50 text-[11px]">
                <div>
                  <p className="font-bold text-slate-800">Sparky Brothers</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Wiring, smart lock setups</p>
                </div>
                <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-bold font-mono text-[9px] border border-amber-100">Electric</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
