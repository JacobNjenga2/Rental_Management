import { Property, Unit, Lease, Payment, MaintenanceRequest, Message, Document, TenantApplication, User } from './types';

// Mock Users representing the 3 roles plus an admin
export const currentUser: User = {
  id: 'usr-1',
  name: 'Sarah Wanjiku',
  email: 'sarah.w@bomaflow.co.ke',
  phone: '+254 722 000 123',
  role: 'landlord', // default view role, togglable in the UI
  avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
  isMfaEnabled: true,
};

export const mockUsers: Record<string, User> = {
  'usr-1': {
    id: 'usr-1',
    name: 'Sarah Wanjiku',
    email: 'sarah.w@bomaflow.co.ke',
    phone: '+254 722 000 123',
    role: 'landlord',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    isMfaEnabled: true,
  },
  'usr-2': {
    id: 'usr-2',
    name: 'Marcus Omondi',
    email: 'marcus.o@apexpm.co.ke',
    phone: '+254 733 999 456',
    role: 'manager',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    isMfaEnabled: true,
  },
  'usr-3': {
    id: 'usr-3',
    name: 'Emily Atieno',
    email: 'emily.atieno@gmail.com',
    phone: '+254 711 555 789',
    role: 'tenant',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150',
    isMfaEnabled: false,
  },
  'usr-4': {
    id: 'usr-4',
    name: 'David Kamau',
    email: 'david.kamau@outlook.co.ke',
    phone: '+254 701 444 321',
    role: 'tenant',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
  }
};

export const mockProperties: Property[] = [
  {
    id: 'prop-1',
    name: 'Kilimani Heights Apartments',
    address: '52 Kilimani Road, Near Yaya Centre',
    city: 'Nairobi',
    state: 'Nairobi County',
    zip: '00100',
    type: 'Apartment',
    description: 'A modern, eco-friendly luxury apartment community located in the heart of Kilimani. Featuring state-of-the-art kitchens, smart home automation, high-speed fiber internet, and energy-efficient power backups.',
    amenities: ['Pool', 'Fitness Center', 'Rooftop Deck', 'Borehole Water', 'Backup Generator', 'Fiber Internet'],
    photos: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800'
    ],
    status: 'Active',
    ownerId: 'usr-1',
    managerId: 'usr-2',
  },
  {
    id: 'prop-2',
    name: 'Runda Ridge Villa',
    address: '12 Runda Drive, Runda Estate',
    city: 'Nairobi',
    state: 'Nairobi County',
    zip: '00100',
    type: 'House',
    description: 'A gorgeous, spacious 4-bedroom single-family home in the prestigious Runda Estate. Features stunning forest views, a multi-tier deck, private pool, and gourmet professional-grade kitchen with high security.',
    amenities: ['Private Pool', 'Three-Car Garage', 'Fireplace', 'Forest Views', 'Solar Heating', 'Smart Security'],
    photos: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=800'
    ],
    status: 'Active',
    ownerId: 'usr-1',
    managerId: 'usr-2',
  },
  {
    id: 'prop-3',
    name: 'Westlands Crest Condos',
    address: '303 Wood Avenue, Westlands',
    city: 'Nairobi',
    state: 'Nairobi County',
    zip: '00100',
    type: 'Condo',
    description: 'Breathtaking 18th-floor high-rise condominium in Downtown Westlands. Modern design with floor-to-ceiling windows, private balcony, solar water heating, and 24/7 concierge security.',
    amenities: ['Concierge', 'Valet Parking', 'Rooftop Pool', 'Sky Lounge', 'Gym', 'Private Storage Room'],
    photos: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=800'
    ],
    status: 'Active',
    ownerId: 'usr-1',
    managerId: 'usr-2',
  },
  {
    id: 'prop-4',
    name: 'Lavington Duplex West',
    address: '110 James Gichuru Road, Lavington',
    city: 'Nairobi',
    state: 'Nairobi County',
    zip: '00100',
    type: 'Duplex',
    description: 'Charming, newly renovated 2-bedroom duplex in Lavington. Private fenced backyard, original restored hardwood floors, and a covered front porch in a secure and highly walkable neighborhood.',
    amenities: ['Fenced Yard', 'Restored Hardwoods', 'Washer/Dryer Included', 'Covered Porch', 'Pet Friendly'],
    photos: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800'
    ],
    status: 'Draft',
    ownerId: 'usr-1',
    managerId: 'usr-2',
  }
];

export const mockUnits: Unit[] = [
  { id: 'unit-101', propertyId: 'prop-1', number: '101', bedrooms: 1, bathrooms: 1, sizeSqFt: 750, rentAmount: 45000, status: 'Occupied' },
  { id: 'unit-102', propertyId: 'prop-1', number: '102', bedrooms: 2, bathrooms: 2, sizeSqFt: 1100, rentAmount: 65000, status: 'Occupied' },
  { id: 'unit-201', propertyId: 'prop-1', number: '201', bedrooms: 1, bathrooms: 1, sizeSqFt: 780, rentAmount: 50000, status: 'Vacant' },
  { id: 'unit-202', propertyId: 'prop-1', number: '202', bedrooms: 2, bathrooms: 2, sizeSqFt: 1150, rentAmount: 68000, status: 'Occupied' },
  { id: 'unit-301', propertyId: 'prop-1', number: '301', bedrooms: 3, bathrooms: 2, sizeSqFt: 1400, rentAmount: 85000, status: 'Maintenance' },
  
  { id: 'unit-sunset', propertyId: 'prop-2', number: 'Main', bedrooms: 4, bathrooms: 3.5, sizeSqFt: 3400, rentAmount: 180000, status: 'Occupied' },
  { id: 'unit-urban', propertyId: 'prop-3', number: '1802', bedrooms: 1, bathrooms: 1.5, sizeSqFt: 920, rentAmount: 95000, status: 'Occupied' },
  { id: 'unit-maple', propertyId: 'prop-4', number: 'A', bedrooms: 2, bathrooms: 1, sizeSqFt: 950, rentAmount: 55000, status: 'Vacant' },
];

export const mockLeases: Lease[] = [
  {
    id: 'lease-101',
    propertyId: 'prop-1',
    unitId: 'unit-101',
    tenantId: 'usr-3',
    tenantName: 'Emily Atieno',
    startDate: '2025-08-01',
    endDate: '2026-07-31',
    rentAmount: 45000,
    depositAmount: 45000,
    status: 'Active',
    signedDate: '2025-07-15',
    terms: 'LEASE AGREEMENT: The Tenant shall pay the landlord Ksh 45,000 per month, due on the 1st of each month. Late fees of Ksh 1,500 apply if rent is received after the 5th. No smoking on the premises. Standard security, garbage and borehole water services are included. Small dogs allowed with landlord\'s written consent.'
  },
  {
    id: 'lease-102',
    propertyId: 'prop-1',
    unitId: 'unit-102',
    tenantId: 'usr-4',
    tenantName: 'David Kamau',
    startDate: '2025-10-01',
    endDate: '2026-09-30',
    rentAmount: 65000,
    depositAmount: 65000,
    status: 'Active',
    signedDate: '2025-09-12',
    terms: 'LEASE AGREEMENT: The Tenant shall pay the landlord Ksh 65,000 per month, due on the 1st of each month. Parking stall #2 is allocated to Unit 102. Trash and security services are included in rent. Tenant is responsible for electricity (tokens) and water billing.'
  },
  {
    id: 'lease-sunset',
    propertyId: 'prop-2',
    unitId: 'unit-sunset',
    tenantId: 'usr-5',
    tenantName: 'Robert & Clara Mwenda',
    startDate: '2024-01-15',
    endDate: '2026-01-14',
    rentAmount: 180000,
    depositAmount: 180000,
    status: 'Active',
    signedDate: '2024-01-02',
    terms: 'RE-SIGN SPECIAL TERMS: Rent shall escalate at 5% upon anniversary. Pool cleaning and landscaping included. Tenant must maintain smart security systems in active state.'
  }
];

export const mockPayments: Payment[] = [
  // Past successful payments
  {
    id: 'pay-001',
    tenantId: 'usr-3',
    tenantName: 'Emily Atieno',
    propertyName: 'Kilimani Heights Apartments',
    unitNumber: '101',
    amount: 45000,
    dueDate: '2026-07-01',
    paymentDate: '2026-07-01',
    method: 'M-Pesa',
    status: 'Paid',
    type: 'Rent',
  },
  {
    id: 'pay-002',
    tenantId: 'usr-4',
    tenantName: 'David Kamau',
    propertyName: 'Kilimani Heights Apartments',
    unitNumber: '102',
    amount: 65000,
    dueDate: '2026-07-01',
    paymentDate: '2026-07-02',
    method: 'Credit Card',
    status: 'Paid',
    type: 'Rent',
  },
  {
    id: 'pay-003',
    tenantId: 'usr-3',
    tenantName: 'Emily Atieno',
    propertyName: 'Kilimani Heights Apartments',
    unitNumber: '101',
    amount: 45000,
    dueDate: '2026-06-01',
    paymentDate: '2026-06-01',
    method: 'M-Pesa',
    status: 'Paid',
    type: 'Rent',
  },
  // Upcoming / Overdue / Pending
  {
    id: 'pay-004',
    tenantId: 'usr-3',
    tenantName: 'Emily Atieno',
    propertyName: 'Kilimani Heights Apartments',
    unitNumber: '101',
    amount: 45000,
    dueDate: '2026-08-01',
    status: 'Pending',
    type: 'Rent',
  },
  {
    id: 'pay-overdue-1',
    tenantId: 'usr-6',
    tenantName: 'James Kamotho',
    propertyName: 'Westlands Crest Condos',
    unitNumber: '1802',
    amount: 95000,
    dueDate: '2026-07-01',
    status: 'Overdue',
    type: 'Rent',
    lateFeeCharged: 3000,
  }
];

export const mockMaintenanceRequests: MaintenanceRequest[] = [
  {
    id: 'maint-001',
    tenantId: 'usr-3',
    tenantName: 'Emily Atieno',
    propertyName: 'Kilimani Heights Apartments',
    unitNumber: '101',
    title: 'Dripping kitchen sink faucet',
    description: 'The kitchen sink faucet has been dripping rapidly since last night. It is wasting water and making a constant tapping noise.',
    priority: 'Low',
    status: 'Assigned',
    category: 'Plumbing',
    assignedTechnician: 'Jackson Mwangi (Fundi Bora Services)',
    createdAt: '2026-07-06T09:15:00Z',
    photos: ['https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400'],
    cost: 3500,
    logs: [
      { status: 'Submitted', updatedAt: '2026-07-06T09:15:00Z', note: 'Tenant submitted the maintenance request.' },
      { status: 'Assigned', updatedAt: '2026-07-07T14:30:00Z', note: 'Assigned to Jackson Mwangi. Scheduled for visit on Friday.' }
    ]
  },
  {
    id: 'maint-002',
    tenantId: 'usr-4',
    tenantName: 'David Kamau',
    propertyName: 'Kilimani Heights Apartments',
    unitNumber: '102',
    title: 'Backup generator hookup issue',
    description: 'The automated switch for the backup generator failed during yesterday\'s power token outage. Please have an electrician check the automatic transfer switch (ATS).',
    priority: 'High',
    status: 'In Progress',
    category: 'Electrical',
    assignedTechnician: 'Nyati HVAC & Electricals',
    createdAt: '2026-07-08T08:00:00Z',
    photos: [],
    logs: [
      { status: 'Submitted', updatedAt: '2026-07-08T08:00:00Z', note: 'Maintenance request received.' },
      { status: 'Assigned', updatedAt: '2026-07-08T09:15:00Z', note: 'Dispatched emergency electrical engineer.' },
      { status: 'In Progress', updatedAt: '2026-07-08T11:00:00Z', note: 'Technician is on-site investigating ATS control board.' }
    ]
  },
  {
    id: 'maint-003',
    tenantId: 'usr-5',
    tenantName: 'Robert Mwenda',
    propertyName: 'Runda Ridge Villa',
    unitNumber: 'Main',
    title: 'Squeaky garage gate automatic sensor',
    description: 'The automatic main gate sensor squeaks loudly and struggles to trigger. Needs a specialist to inspect and lubricate the rolling gears.',
    priority: 'Medium',
    status: 'Resolved',
    category: 'General',
    assignedTechnician: 'Simba Gate Systems',
    createdAt: '2026-06-25T11:20:00Z',
    photos: [],
    cost: 8000,
    logs: [
      { status: 'Submitted', updatedAt: '2026-06-25T11:20:00Z', note: 'Maintenance request created.' },
      { status: 'Assigned', updatedAt: '2026-06-26T10:00:00Z', note: 'Assigned automated gate specialist.' },
      { status: 'In Progress', updatedAt: '2026-06-28T14:00:00Z', note: 'Repaired tracks and lubricated rolling system.' },
      { status: 'Resolved', updatedAt: '2026-06-28T15:30:00Z', note: 'Gears lubricated and sensor recalibrated. Complete.' }
    ]
  }
];

export const mockMessages: Message[] = [
  {
    id: 'msg-1',
    senderId: 'usr-3',
    senderName: 'Emily Atieno',
    senderRole: 'tenant',
    receiverId: 'usr-2',
    content: 'Hi Marcus, just wanted to let you know that I submitted a maintenance request for the dripping faucet in my kitchen. Thanks!',
    timestamp: '2026-07-06T09:20:00Z',
    read: true,
  },
  {
    id: 'msg-2',
    senderId: 'usr-2',
    senderName: 'Marcus Omondi',
    senderRole: 'manager',
    receiverId: 'usr-3',
    content: 'Thanks Emily. I’ve reviewed and dispatched Jackson Mwangi from Fundi Bora Services to look at it. He should be reaching out to schedule a precise time shortly.',
    timestamp: '2026-07-07T14:35:00Z',
    read: true,
  },
  {
    id: 'msg-3',
    senderId: 'usr-3',
    senderName: 'Emily Atieno',
    senderRole: 'tenant',
    receiverId: 'usr-2',
    content: 'Great, thanks for the quick response! Friday morning works best if Jackson asks.',
    timestamp: '2026-07-07T14:50:00Z',
    read: false,
  }
];

export const mockDocuments: Document[] = [
  { id: 'doc-1', title: 'Lease Agreement - Unit 101 (Atieno)', type: 'Lease', url: '#', uploadDate: '2025-07-15', size: '2.4 MB', signedStatus: 'Signed', tenantId: 'usr-3' },
  { id: 'doc-2', title: 'Lease Agreement - Unit 102 (Kamau)', type: 'Lease', url: '#', uploadDate: '2025-09-12', size: '2.4 MB', signedStatus: 'Signed', tenantId: 'usr-4' },
  { id: 'doc-3', title: 'Q2 2026 Portfolio Financial Statement', type: 'Report', url: '#', uploadDate: '2026-07-01', size: '1.2 MB', signedStatus: 'N/A' },
  { id: 'doc-4', title: 'Runda Ridge Villa - Move-in Inspection Checklist', type: 'Report', url: '#', uploadDate: '2024-01-14', size: '850 KB', signedStatus: 'Signed', tenantId: 'usr-4' },
];

export const mockApplications: TenantApplication[] = [
  {
    id: 'app-001',
    applicantName: 'Angela Mwangi',
    email: 'angela.m@outlook.co.ke',
    phone: '+254 712 345 678',
    propertyId: 'prop-1',
    propertyName: 'Kilimani Heights Apartments',
    unitId: 'unit-201',
    unitNumber: '201',
    requestedStartDate: '2026-08-01',
    monthlyIncome: 180000,
    creditScore: 715,
    backgroundCheckStatus: 'Passed',
    creditCheckStatus: 'Passed',
    status: 'Screening',
    createdAt: '2026-07-05T10:00:00Z',
  },
  {
    id: 'app-002',
    applicantName: 'Gregory Kiprop',
    email: 'greg.kiprop@gmail.com',
    phone: '+254 756 789 012',
    propertyId: 'prop-4',
    propertyName: 'Lavington Duplex West',
    unitId: 'unit-maple',
    unitNumber: 'A',
    requestedStartDate: '2026-08-15',
    monthlyIncome: 120000,
    creditScore: 590,
    backgroundCheckStatus: 'Passed',
    creditCheckStatus: 'Pending',
    status: 'Received',
    createdAt: '2026-07-07T16:45:00Z',
  }
];
