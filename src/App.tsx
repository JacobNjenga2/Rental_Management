import { useState } from 'react';
import { 
  mockUsers, mockProperties, mockUnits, mockLeases, 
  mockPayments, mockMaintenanceRequests, mockMessages, 
  mockDocuments, mockApplications, currentUser as defaultUser 
} from './data';
import { 
  Property, Unit, Lease, Payment, MaintenanceRequest, 
  Message, Document, TenantApplication, User, UserRole 
} from './types';
import RoleSelector from './components/RoleSelector';
import LandlordDashboard from './components/LandlordDashboard';
import ManagerDashboard from './components/ManagerDashboard';
import TenantDashboard from './components/TenantDashboard';
import PropertyList from './components/PropertyList';
import PropertyDetail from './components/PropertyDetail';
import ApplicationForm from './components/ApplicationForm';
import LeaseViewer from './components/LeaseViewer';
import CommunicationHub from './components/CommunicationHub';
import FinancialReports from './components/FinancialReports';

import { 
  LayoutDashboard, Building, UserCheck, FileText, 
  MessageSquare, BarChart3, KeyRound, ShieldAlert,
  ChevronRight, Sparkles, Menu, X
} from 'lucide-react';

export default function App() {
  // Global States (acting as local memory DB for high fidelity interaction)
  const [currentUser, setCurrentUser] = useState<User>(defaultUser);
  const [properties, setProperties] = useState<Property[]>(mockProperties);
  const [units, setUnits] = useState<Unit[]>(mockUnits);
  const [leases, setLeases] = useState<Lease[]>(mockLeases);
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [maintenance, setMaintenance] = useState<MaintenanceRequest[]>(mockMaintenanceRequests);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [applications, setApplications] = useState<TenantApplication[]>(mockApplications);

  // Navigation states
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handler: Change active user role and sync states
  const handleRoleChange = (role: UserRole) => {
    // Find matching mock user to swap identity details
    const matchedUser = Object.values(mockUsers).find(u => u.role === role) || defaultUser;
    setCurrentUser({
      ...matchedUser,
      role // ensure role forces updates
    });
    // Reset secondary views
    setSelectedPropertyId(null);
    setActiveTab('dashboard');
  };

  // Handler: Select a specific property profile to inspect
  const handleSelectProperty = (id: string) => {
    setSelectedPropertyId(id);
    setActiveTab('property-detail');
  };

  // Handler: Add a new property profile
  const handleAddProperty = (newProp: Omit<Property, 'id'>) => {
    const id = `prop-${Date.now()}`;
    setProperties([...properties, { id, ...newProp }]);
  };

  // Handler: Delete a property asset
  const handleDeleteProperty = (id: string) => {
    setProperties(properties.filter(p => p.id !== id));
    setUnits(units.filter(u => u.propertyId !== id));
  };

  // Handler: Add a unit to property
  const handleAddUnit = (newUnit: Omit<Unit, 'id'>) => {
    const id = `unit-${Date.now()}`;
    setUnits([...units, { id, ...newUnit }]);
  };

  // Handler: Delete a unit from property
  const handleDeleteUnit = (id: string) => {
    setUnits(units.filter(u => u.id !== id));
  };

  // Handler: Submit a Tenant Application form
  const handleAddApplication = (newApp: Omit<TenantApplication, 'id' | 'createdAt'>) => {
    const app: TenantApplication = {
      id: `app-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...newApp
    };
    setApplications([app, ...applications]);
  };

  // Handler: Screen approval of tenant application
  const handleApproveApplication = (id: string) => {
    setApplications(applications.map(app => {
      if (app.id !== id) return app;

      // Update unit status to occupied
      setUnits(units.map(u => u.id === app.unitId ? { ...u, status: 'Occupied' } : u));

      // Generate a lease automatically
      const newLeaseId = `lease-${Date.now()}`;
      const rent = units.find(u => u.id === app.unitId)?.rentAmount || 45000;
      const newLease: Lease = {
        id: newLeaseId,
        propertyId: app.propertyId,
        unitId: app.unitId,
        tenantId: `usr-${Date.now()}`,
        tenantName: app.applicantName,
        startDate: app.requestedStartDate,
        endDate: new Date(new Date(app.requestedStartDate).setFullYear(new Date(app.requestedStartDate).getFullYear() + 1)).toISOString().split('T')[0],
        rentAmount: rent,
        depositAmount: rent,
        status: 'Active',
        signedDate: new Date().toISOString().split('T')[0],
        terms: `AUTOMATED COMPLIANT LEASE: Landlord hereby leases to Tenant, and Tenant rents, Unit ${app.unitNumber} at ${app.propertyName}. Monthly rent: Ksh ${rent.toLocaleString()}. Standard security, garbage collection, and borehole water services are included in accordance with the Landlord and Tenant Act (Cap 301) of Kenya.`
      };
      setLeases([newLease, ...leases]);

      // Add to documents vault
      const newDoc: Document = {
        id: `doc-${Date.now()}`,
        title: `Lease Agreement - Unit ${app.unitNumber} (${app.applicantName})`,
        type: 'Lease',
        url: '#',
        uploadDate: new Date().toISOString().split('T')[0],
        size: '1.8 MB',
        signedStatus: 'Signed'
      };
      setDocuments([newDoc, ...documents]);

      return { ...app, status: 'Approved' };
    }));
  };

  // Handler: Screen rejection of application
  const handleRejectApplication = (id: string) => {
    setApplications(applications.map(app => app.id === id ? { ...app, status: 'Rejected' } : app));
  };

  // Handler: Dispatch / Assign technician
  const handleAssignTechnician = (id: string, tech: string) => {
    setMaintenance(maintenance.map(m => {
      if (m.id !== id) return m;
      return {
        ...m,
        status: 'Assigned',
        assignedTechnician: tech,
        logs: [
          ...m.logs,
          { status: 'Assigned', updatedAt: new Date().toISOString(), note: `Dispatched contractor: ${tech}` }
        ]
      };
    }));
  };

  // Handler: Pay rent online
  const handlePayRent = (paymentId: string, amount: number, method: string) => {
    // Mark invoice as Paid in state
    setPayments(payments.map(p => {
      if (p.id !== paymentId) return p;
      return {
        ...p,
        status: 'Paid',
        paymentDate: new Date().toISOString().split('T')[0],
        method: method as any
      };
    }));

    // Add receipt to document sharing vault
    const newDoc: Document = {
      id: `receipt-${Date.now()}`,
      title: `Rent Payment Receipt - July 2026`,
      type: 'Invoice',
      url: '#',
      uploadDate: new Date().toISOString().split('T')[0],
      size: '120 KB',
      signedStatus: 'N/A'
    };
    setDocuments([newDoc, ...documents]);
  };

  // Handler: Submit Maintenance request from resident
  const handleAddMaintenance = (title: string, description: string, category: string, priority: string, photo?: string) => {
    const newReq: MaintenanceRequest = {
      id: `maint-${Date.now()}`,
      tenantId: currentUser.id,
      tenantName: currentUser.name,
      propertyName: 'Kilimani Heights Apartments',
      unitNumber: '101',
      title,
      description,
      priority: priority as any,
      status: 'Submitted',
      category: category as any,
      createdAt: new Date().toISOString(),
      photos: photo ? [photo] : [],
      logs: [{ status: 'Submitted', updatedAt: new Date().toISOString(), note: 'Tenant filed repair ticket via resident portal.' }]
    };
    setMaintenance([newReq, ...maintenance]);
  };

  // Handler: Send encrypted in-app text messages
  const handleSendMessage = (content: string) => {
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      receiverId: currentUser.role === 'tenant' ? 'usr-2' : 'usr-3', // loopback chat with opposite role
      content,
      timestamp: new Date().toISOString(),
      read: false
    };
    setMessages([...messages, newMsg]);

    // Simulate reactive agent manager/tenant response
    setTimeout(() => {
      const responseMsg: Message = {
        id: `msg-rep-${Date.now()}`,
        senderId: currentUser.role === 'tenant' ? 'usr-2' : 'usr-3',
        senderName: currentUser.role === 'tenant' ? 'Marcus Omondi' : 'Emily Atieno',
        senderRole: currentUser.role === 'tenant' ? 'manager' : 'tenant',
        receiverId: currentUser.id,
        content: currentUser.role === 'tenant' 
          ? "Understood. I've logged this in our compliance portal and will verify with our contractor. Thanks!" 
          : "Thanks for checking in! Yes, the scheduled slot works perfectly for me.",
        timestamp: new Date().toISOString(),
        read: false
      };
      setMessages(prev => [...prev, responseMsg]);
    }, 2500);
  };

  // Handler: Broadcast Community announcements
  const handleBroadcastAnnouncement = (title: string, content: string, scope: string) => {
    // Log as system message/notice in documents
    const newDoc: Document = {
      id: `notice-${Date.now()}`,
      title: `Notice: ${title}`,
      type: 'Notice',
      url: '#',
      uploadDate: new Date().toISOString().split('T')[0],
      size: '250 KB',
      signedStatus: 'N/A'
    };
    setDocuments([newDoc, ...documents]);

    // Push into messages log for residents
    const broadcastMsg: Message = {
      id: `msg-bcast-${Date.now()}`,
      senderId: 'usr-2',
      senderName: 'SYSTEM BROADCAST',
      senderRole: 'manager',
      receiverId: 'usr-3',
      content: `[BUILDING ALERT] ${title}: ${content}`,
      timestamp: new Date().toISOString(),
      read: false
    };
    setMessages(prev => [...prev, broadcastMsg]);
  };

  // Handler: Update lease clause terms template
  const handleUpdateTemplate = (id: string, text: string) => {
    setLeases(leases.map(l => l.id === id ? { ...l, terms: text } : l));
  };

  // Handler: Sign lease agreement digitally
  const handleSignLease = (id: string, signatureDate: string) => {
    setLeases(leases.map(l => l.id === id ? { ...l, signedDate: signatureDate } : l));
  };

  // Handler: Execute Bulk CSV properties imports
  const handleBulkImport = (csvText: string) => {
    const lines = csvText.split('\n');
    const newProps: Property[] = [];
    
    // Skip header line
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      const cols = lines[i].split(',');
      if (cols.length < 7) continue;

      newProps.push({
        id: `prop-bulk-${Date.now()}-${i}`,
        name: cols[0].trim(),
        address: cols[1].trim(),
        city: cols[2].trim(),
        state: cols[3].trim(),
        zip: cols[4].trim(),
        type: cols[5].trim() as any,
        description: cols[6].trim(),
        amenities: ['Fiber Internet', 'Pet Friendly'],
        photos: ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80&w=800'],
        status: 'Active',
        ownerId: 'usr-1',
        managerId: 'usr-2'
      });
    }

    if (newProps.length > 0) {
      setProperties(prev => [...prev, ...newProps]);
    }
  };

  // Tenant lease details
  const activeTenantLease = leases.find(l => l.tenantId === currentUser.id || l.tenantId === 'usr-3');
  const activeTenantProp = properties.find(p => p.id === activeTenantLease?.propertyId);
  const activeTenantUnit = units.find(u => u.id === activeTenantLease?.unitId);

  // Nav items configuration
  const navItems = [
    { id: 'dashboard', label: 'Overview Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'properties', label: 'Properties & Units', icon: <Building className="w-4 h-4" /> },
    { id: 'screenings', label: 'Screening & Applicants', icon: <UserCheck className="w-4 h-4" /> },
    { id: 'leases', label: 'Contracts & Leases', icon: <FileText className="w-4 h-4" /> },
    { id: 'communications', label: 'Messenger & Notifications', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'reports', label: 'Financials & Reports', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans">
      
      {/* Top sticky switcher header */}
      <RoleSelector currentUser={currentUser} onRoleChange={handleRoleChange} />

      {/* Main Core Full-Stack Page Body Layout */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto p-4 md:p-8 gap-8">
        
        {/* Responsive Desktop Side Navigation Rail */}
        <aside className="hidden md:flex flex-col gap-1.5 w-64 bg-white p-5 rounded-xl border border-slate-200 shadow-xs h-fit">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">Navigation Console</p>
          {navItems.map((item) => {
            const isActive = activeTab === item.id || (item.id === 'properties' && activeTab === 'property-detail');
            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => {
                  setSelectedPropertyId(null);
                  setActiveTab(item.id);
                }}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700 border border-blue-100/50 shadow-2xs' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </aside>

        {/* Mobile Header Menu Button */}
        <div className="md:hidden flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-800">Operational Menu</span>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-slate-600 bg-slate-50 rounded-lg border border-slate-200"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu modal dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border border-slate-200 p-4 rounded-xl shadow-sm space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setSelectedPropertyId(null);
                  setActiveTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === item.id ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'text-slate-600'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Right Content Space: Render corresponding subviews */}
        <main className="flex-1 min-w-0">
          
          {/* Dashboard route resolver */}
          {activeTab === 'dashboard' && (
            <>
              {currentUser.role === 'landlord' && (
                <LandlordDashboard
                  properties={properties}
                  units={units}
                  leases={leases}
                  payments={payments}
                  maintenance={maintenance}
                  onNavigate={(view, id) => {
                    if (id) handleSelectProperty(id);
                    else setActiveTab(view);
                  }}
                  onAddProperty={() => setActiveTab('properties')}
                />
              )}
              {currentUser.role === 'manager' && (
                <ManagerDashboard
                  properties={properties}
                  units={units}
                  applications={applications}
                  maintenance={maintenance}
                  onApproveApplication={handleApproveApplication}
                  onRejectApplication={handleRejectApplication}
                  onAssignTechnician={handleAssignTechnician}
                  onBroadcastAnnouncement={handleBroadcastAnnouncement}
                />
              )}
              {currentUser.role === 'tenant' && (
                <TenantDashboard
                  lease={activeTenantLease}
                  property={activeTenantProp}
                  unit={activeTenantUnit}
                  payments={payments.filter(p => p.tenantId === currentUser.id)}
                  maintenance={maintenance.filter(m => m.tenantId === currentUser.id)}
                  messages={messages}
                  onPayRent={handlePayRent}
                  onSubmitMaintenance={handleAddMaintenance}
                  onSendMessage={handleSendMessage}
                />
              )}
            </>
          )}

          {/* Properties route resolver */}
          {activeTab === 'properties' && (
            <PropertyList
              properties={properties}
              units={units}
              onSelectProperty={handleSelectProperty}
              onAddProperty={handleAddProperty}
              onDeleteProperty={handleDeleteProperty}
              onBulkImport={handleBulkImport}
            />
          )}

          {/* Property Detail inspect route resolver */}
          {activeTab === 'property-detail' && selectedPropertyId && (
            <PropertyDetail
              property={properties.find(p => p.id === selectedPropertyId)!}
              units={units}
              leases={leases}
              documents={documents}
              onBack={() => {
                setSelectedPropertyId(null);
                setActiveTab('properties');
              }}
              onAddUnit={handleAddUnit}
              onDeleteUnit={handleDeleteUnit}
            />
          )}

          {/* Applications screening route resolver */}
          {activeTab === 'screenings' && (
            <ApplicationForm
              properties={properties}
              units={units}
              onSubmitApplication={handleAddApplication}
            />
          )}

          {/* Digital Leases route resolver */}
          {activeTab === 'leases' && (
            <LeaseViewer
              leases={leases}
              properties={properties}
              units={units}
              documents={documents}
              currentUser={currentUser}
              onSignLease={handleSignLease}
              onUpdateTemplate={handleUpdateTemplate}
              onAddDocument={(doc) => setDocuments(prev => [doc, ...prev])}
              onDeleteDocument={(id) => setDocuments(prev => prev.filter(doc => doc.id !== id))}
            />
          )}

          {/* Encrypted chats route resolver */}
          {activeTab === 'communications' && (
            <CommunicationHub
              messages={messages}
              documents={documents}
              currentUser={currentUser}
              onSendMessage={handleSendMessage}
            />
          )}

          {/* Financial statements & analytics reports */}
          {activeTab === 'reports' && (
            <FinancialReports
              properties={properties}
              units={units}
              leases={leases}
              payments={payments}
              maintenance={maintenance}
            />
          )}

        </main>
      </div>

      {/* Footer legal notices compliance */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-6 text-center text-xs mt-12 px-4">
        <div className="max-w-7xl mx-auto space-y-2">
          <p className="font-bold text-slate-300">© 2026 BomaFlow Real Estate Management Suite. All rights reserved.</p>
          <p className="text-[10px] text-slate-500 max-w-2xl mx-auto leading-relaxed">
            BomaFlow is a secure, cloud-hosted real estate operations application localized for East Africa, compliant with the Kenyan Landlord and Tenant Act (Cap 301), Rent Restriction Act, National Housing Policy, ODPC (Office of the Data Protection Commissioner) Data Protection Act 2019, and secure M-Pesa & PCI-DSS payment protocols.
          </p>
        </div>
      </footer>
    </div>
  );
}
