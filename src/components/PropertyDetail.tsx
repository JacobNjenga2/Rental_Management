import React, { useState } from 'react';
import { Property, Unit, Lease, Document } from '../types';
import { 
  ArrowLeft, Building, CheckCircle, Clock, Plus, X, BedDouble, 
  Bath, Users, FileText, ChevronRight, Layout, Trash
} from 'lucide-react';

interface PropertyDetailProps {
  property: Property;
  units: Unit[];
  leases: Lease[];
  documents: Document[];
  onBack: () => void;
  onAddUnit: (unit: Omit<Unit, 'id'>) => void;
  onDeleteUnit: (id: string) => void;
}

export default function PropertyDetail({
  property,
  units,
  leases,
  documents,
  onBack,
  onAddUnit,
  onDeleteUnit
}: PropertyDetailProps) {
  // Unit addition state
  const [isAddingUnit, setIsAddingUnit] = useState(false);
  const [unitNum, setUnitNum] = useState('');
  const [unitBeds, setUnitBeds] = useState('1');
  const [unitBaths, setUnitBaths] = useState('1');
  const [unitSqFt, setUnitSqFt] = useState('');
  const [unitRent, setUnitRent] = useState('');
  const [unitStatus, setUnitStatus] = useState<'Occupied' | 'Vacant' | 'Maintenance'>('Vacant');

  // Photo gallery state
  const [activePhoto, setActivePhoto] = useState(property.photos[0]);

  // Filter associated assets
  const propUnits = units.filter(u => u.propertyId === property.id);
  const propLeases = leases.filter(l => l.propertyId === property.id);

  // Filter documents relative to property
  const propDocs = documents.filter(d => 
    d.title.toLowerCase().includes(property.name.toLowerCase()) ||
    d.title.toLowerCase().includes(' Thompson') ||
    d.title.toLowerCase().includes(' Carter')
  );

  const handleUnitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!unitNum.trim() || !unitSqFt || !unitRent) return;

    onAddUnit({
      propertyId: property.id,
      number: unitNum,
      bedrooms: parseInt(unitBeds),
      bathrooms: parseFloat(unitBaths),
      sizeSqFt: parseInt(unitSqFt),
      rentAmount: parseInt(unitRent),
      status: unitStatus
    });

    setUnitNum('');
    setUnitSqFt('');
    setUnitRent('');
    setUnitStatus('Vacant');
    setIsAddingUnit(false);
  };

  return (
    <div className="space-y-6">
      {/* Navigation Header */}
      <div className="flex items-center gap-2">
        <button
          id="btn-back-to-properties"
          onClick={onBack}
          className="flex items-center gap-1 bg-white hover:bg-slate-50 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-xs border border-slate-200 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Portfolio</span>
        </button>
      </div>

      {/* Main Grid: Left side details & photos, Right side Units management */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Property details and visual photo gallery */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Core Info & Slideshow */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div className="relative h-96 bg-slate-100 rounded-xl overflow-hidden">
              <img
                src={activePhoto}
                alt={property.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-all duration-300"
              />
              <div className="absolute top-4 left-4">
                <span className="text-xs font-extrabold uppercase bg-blue-600 text-white px-3 py-1.5 rounded-lg shadow-xs">
                  {property.type}
                </span>
              </div>
            </div>

            {/* Photo selector chips */}
            {property.photos.length > 1 && (
              <div className="flex gap-2">
                {property.photos.map((ph, idx) => (
                  <button
                    key={idx}
                    id={`btn-photo-${idx}`}
                    onClick={() => setActivePhoto(ph)}
                    className={`w-20 h-14 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                      activePhoto === ph ? 'border-blue-500 scale-95' : 'border-transparent opacity-80'
                    }`}
                  >
                    <img src={ph} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div>
              <h2 className="text-xl font-extrabold text-slate-950 tracking-tight">{property.name}</h2>
              <p className="text-xs text-slate-500 mt-1">{property.address}, {property.city}, {property.state} {property.zip}</p>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-semibold bg-slate-50 p-4 rounded-lg border border-slate-200">{property.description}</p>

            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Property Amenities</h3>
              <div className="flex flex-wrap gap-1.5">
                {property.amenities.map((am) => (
                  <span key={am} className="text-xs bg-slate-50 border border-slate-200 text-slate-700 px-3 py-1 rounded-md font-bold">
                    {am}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Legal Lease Agreements & Documents list */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-950 tracking-tight flex items-center gap-1.5 border-b border-slate-150 pb-3">
              <FileText className="w-4 h-4 text-blue-600" />
              Associated Regulatory Documents ({propDocs.length})
            </h3>

            <div className="divide-y divide-slate-150">
              {propDocs.length === 0 ? (
                <div className="text-center py-4 text-slate-400 text-xs">
                  No documents linked to this property yet.
                </div>
              ) : (
                propDocs.map((doc) => (
                  <div key={doc.id} className="py-3 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-slate-800">{doc.title}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Uploaded {doc.uploadDate} • {doc.size}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      doc.signedStatus === 'Signed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {doc.signedStatus || 'N/A'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Units management list */}
        <div className="space-y-6">
          
          {/* Active Units list */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-slate-150 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-950 tracking-tight">Apartment Units ({propUnits.length})</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Check occupancy status, bed count, and pricing lists.</p>
              </div>
              <button
                id="btn-add-unit-trigger"
                onClick={() => setIsAddingUnit(!isAddingUnit)}
                className="bg-blue-600 hover:bg-blue-700 text-white p-1 rounded-lg shadow-sm transition-all cursor-pointer"
                title="Add new unit"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Add unit form */}
            {isAddingUnit && (
              <form onSubmit={handleUnitSubmit} className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-0.5">
                    <label className="text-[9px] font-bold text-slate-500 uppercase">Unit Number</label>
                    <input
                      id="input-unit-number"
                      type="text"
                      required
                      value={unitNum}
                      onChange={(e) => setUnitNum(e.target.value)}
                      placeholder="e.g. 101"
                      className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 focus:outline-hidden"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <label className="text-[9px] font-bold text-slate-500 uppercase">Sq. Footage</label>
                    <input
                      id="input-unit-sqft"
                      type="number"
                      required
                      value={unitSqFt}
                      onChange={(e) => setUnitSqFt(e.target.value)}
                      placeholder="e.g. 850"
                      className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-0.5">
                    <label className="text-[9px] font-bold text-slate-500 uppercase">Bedrooms</label>
                    <select
                      id="select-unit-beds"
                      value={unitBeds}
                      onChange={(e) => setUnitBeds(e.target.value)}
                      className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 focus:outline-hidden font-semibold"
                    >
                      <option value="1">1 Bed</option>
                      <option value="2">2 Beds</option>
                      <option value="3">3 Beds</option>
                      <option value="4">4 Beds</option>
                    </select>
                  </div>
                  <div className="space-y-0.5">
                    <label className="text-[9px] font-bold text-slate-500 uppercase">Bathrooms</label>
                    <select
                      id="select-unit-baths"
                      value={unitBaths}
                      onChange={(e) => setUnitBaths(e.target.value)}
                      className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 focus:outline-hidden font-semibold"
                    >
                      <option value="1">1 Bath</option>
                      <option value="1.5">1.5 Baths</option>
                      <option value="2">2 Baths</option>
                      <option value="2.5">2.5 Baths</option>
                      <option value="3">3 Baths</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-0.5">
                    <label className="text-[9px] font-bold text-slate-500 uppercase">Monthly Rent (Ksh)</label>
                    <input
                      id="input-unit-rent"
                      type="number"
                      required
                      value={unitRent}
                      onChange={(e) => setUnitRent(e.target.value)}
                      placeholder="e.g. 45000"
                      className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 focus:outline-hidden"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <label className="text-[9px] font-bold text-slate-500 uppercase">Initial Status</label>
                    <select
                      id="select-unit-status"
                      value={unitStatus}
                      onChange={(e) => setUnitStatus(e.target.value as 'Occupied' | 'Vacant' | 'Maintenance')}
                      className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 focus:outline-hidden font-semibold"
                    >
                      <option value="Vacant">Vacant</option>
                      <option value="Occupied">Occupied</option>
                      <option value="Maintenance">Maintenance</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-1">
                  <button
                    id="btn-save-new-unit"
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                  >
                    Save Unit
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingUnit(false)}
                    className="bg-slate-300 hover:bg-slate-400 text-slate-700 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* List Units */}
            <div className="space-y-3">
              {propUnits.map((u) => {
                // Find associated lease & active tenant
                const activeLease = propLeases.find(l => l.unitId === u.id && l.status === 'Active');
                
                return (
                  <div key={u.id} className="border border-slate-200 rounded-lg p-3 bg-slate-50/50 hover:bg-slate-50 transition-all flex justify-between items-center gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-xs text-slate-800">Unit {u.number}</span>
                        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${
                          u.status === 'Occupied' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                          u.status === 'Maintenance' ? 'bg-red-50 text-red-700 border border-red-100' :
                          'bg-blue-50 text-blue-700 border border-blue-100'
                        }`}>
                          {u.status}
                        </span>
                      </div>
                      
                      <div className="flex gap-2 text-[10px] text-slate-400">
                        <span className="flex items-center gap-0.5"><BedDouble className="w-3.5 h-3.5" /> {u.bedrooms} Bed</span>
                        <span className="flex items-center gap-0.5"><Bath className="w-3.5 h-3.5" /> {u.bathrooms} Bath</span>
                        <span>{u.sizeSqFt} sqft</span>
                      </div>

                      {activeLease && (
                        <p className="text-[9px] text-slate-500 font-semibold">Resident: <span className="font-bold">{activeLease.tenantName}</span></p>
                      )}
                    </div>

                    <div className="text-right flex items-center gap-2.5">
                      <div className="text-xs">
                        <p className="text-slate-400 font-semibold">Monthly Rent</p>
                        <p className="font-extrabold text-slate-800 font-mono">Ksh {u.rentAmount.toLocaleString()}</p>
                      </div>
                      <button
                        id={`btn-delete-unit-${u.id}`}
                        onClick={() => onDeleteUnit(u.id)}
                        className="text-slate-300 hover:text-red-500 p-1 transition-all cursor-pointer"
                        title="Remove Unit"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
