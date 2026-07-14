import React, { useState } from 'react';
import { Property, Unit, PropertyType, PropertyStatus } from '../types';
import { 
  Search, SlidersHorizontal, Plus, X, Building, Upload, 
  Calendar, DollarSign, Check, Trash, MapPin, Maximize, AlertCircle
} from 'lucide-react';

interface PropertyListProps {
  properties: Property[];
  units: Unit[];
  onSelectProperty: (id: string) => void;
  onAddProperty: (newProp: Omit<Property, 'id'>) => void;
  onDeleteProperty: (id: string) => void;
  onBulkImport: (csvText: string) => void;
}

export default function PropertyList({
  properties,
  units,
  onSelectProperty,
  onAddProperty,
  onDeleteProperty,
  onBulkImport
}: PropertyListProps) {
  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<PropertyType | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<PropertyStatus | 'all'>('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedAmenity, setSelectedAmenity] = useState<string>('all');

  // Form state for creating a new property
  const [isAdding, setIsAdding] = useState(false);
  const [newPropName, setNewPropName] = useState('');
  const [newPropAddress, setNewPropAddress] = useState('');
  const [newPropCity, setNewPropCity] = useState('');
  const [newPropState, setNewPropState] = useState('Nairobi County');
  const [newPropZip, setNewPropZip] = useState('00100');
  const [newPropType, setNewPropType] = useState<PropertyType>('Apartment');
  const [newPropDesc, setNewPropDesc] = useState('');
  const [newPropAmenities, setNewPropAmenities] = useState<string[]>([]);
  const [newPropPhotos, setNewPropPhotos] = useState('');

  // Bulk CSV state
  const [showBulk, setShowBulk] = useState(false);
  const [csvContent, setCsvContent] = useState('');
  const [bulkSuccess, setBulkSuccess] = useState(false);

  const amenitiesList = [
    'Pool', 'Fitness Center', 'Rooftop Deck', 'Dog Park', 
    'Electric Vehicle Charging', 'Fiber Internet', 'Private Pool', 
    'Three-Car Garage', 'Fireplace', 'Canyon Views'
  ];

  // Apply filters
  const filteredProperties = properties.filter((p) => {
    // Search matching
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.city.toLowerCase().includes(searchQuery.toLowerCase());

    // Type matching
    const matchesType = selectedType === 'all' || p.type === selectedType;

    // Status matching
    const matchesStatus = selectedStatus === 'all' || p.status === selectedStatus;

    // Amenity matching
    const matchesAmenity = selectedAmenity === 'all' || p.amenities.includes(selectedAmenity);

    // Rent matching logic (based on unit rents)
    const propUnits = units.filter(u => u.propertyId === p.id);
    const rents = propUnits.map(u => u.rentAmount);
    const minPropRent = rents.length > 0 ? Math.min(...rents) : 0;
    const maxPropRent = rents.length > 0 ? Math.max(...rents) : 0;

    const minPriceNum = minPrice ? parseInt(minPrice) : 0;
    const maxPriceNum = maxPrice ? parseInt(maxPrice) : Infinity;

    const matchesPrice = 
      (minPriceNum === 0 || maxPropRent >= minPriceNum) &&
      (maxPriceNum === Infinity || minPropRent <= maxPriceNum);

    return matchesSearch && matchesType && matchesStatus && matchesAmenity && matchesPrice;
  });

  const handleAddNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPropName.trim() || !newPropAddress.trim()) return;

    // Split photo URLs
    const photoArray = newPropPhotos.trim()
      ? [newPropPhotos.trim()]
      : ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800'];

    onAddProperty({
      name: newPropName,
      address: newPropAddress,
      city: newPropCity,
      state: newPropState,
      zip: newPropZip,
      type: newPropType,
      description: newPropDesc,
      amenities: newPropAmenities,
      photos: photoArray,
      status: 'Active',
      ownerId: 'usr-1',
      managerId: 'usr-2'
    });

    // Reset Form
    setNewPropName('');
    setNewPropAddress('');
    setNewPropCity('');
    setNewPropZip('');
    setNewPropDesc('');
    setNewPropAmenities([]);
    setNewPropPhotos('');
    setIsAdding(false);
  };

  const handleBulkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvContent.trim()) return;

    onBulkImport(csvContent);
    setCsvContent('');
    setBulkSuccess(true);
    setTimeout(() => {
      setBulkSuccess(false);
      setShowBulk(false);
    }, 3000);
  };

  const toggleAmenitySelection = (amenity: string) => {
    if (newPropAmenities.includes(amenity)) {
      setNewPropAmenities(newPropAmenities.filter(a => a !== amenity));
    } else {
      setNewPropAmenities([...newPropAmenities, amenity]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Add controllers */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-950 tracking-tight">Active Portfolio Assets</h2>
          <p className="text-xs text-slate-500 mt-1">Audit, search, and manage individual residential complexes.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            id="btn-trigger-bulk"
            onClick={() => setShowBulk(!showBulk)}
            className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer border border-slate-200"
          >
            <Upload className="w-4 h-4" />
            <span>CSV Import</span>
          </button>
          <button
            id="btn-trigger-add"
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Property</span>
          </button>
        </div>
      </div>

      {/* Bulk CSV Modal / Section */}
      {showBulk && (
        <div className="bg-slate-900 text-slate-100 p-5 rounded-xl border border-slate-800 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Upload className="w-4 h-4 text-emerald-400" />
              Bulk Property Importer (.CSV)
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Upload multiple properties simultaneously using comma-separated values format.</p>
          </div>

          <form onSubmit={handleBulkSubmit} className="space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase font-mono">CSV Comma-Separated Schema Text</label>
              <textarea
                id="textarea-bulk-csv"
                rows={5}
                required
                value={csvContent}
                onChange={(e) => setCsvContent(e.target.value)}
                placeholder="name,address,city,state,zip,type,description&#10;Kilimani Plaza,12 Wood Avenue,Nairobi,Nairobi County,00100,Apartment,Polished multi-family block&#10;Silverwood Cottage,89 Pine St,Nairobi,Nairobi County,00100,House,Charming historic cottage"
                className="w-full text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg p-3 focus:outline-hidden"
              />
            </div>

            {bulkSuccess && (
              <div className="bg-emerald-950 text-emerald-300 text-[11px] p-2.5 rounded-lg border border-emerald-900 flex items-center gap-1.5 font-bold">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Bulk properties added successfully! Sync complete.</span>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer"
              >
                Execute Import
              </button>
              <button
                type="button"
                onClick={() => setShowBulk(false)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Property Form Modal / Section */}
      {isAdding && (
        <form onSubmit={handleAddNew} className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-slate-150 pb-3">
            <h3 className="text-sm font-extrabold text-slate-950 tracking-tight">Create Residential Profile</h3>
            <button type="button" onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Property Name</label>
              <input
                id="input-add-name"
                type="text"
                required
                value={newPropName}
                onChange={(e) => setNewPropName(e.target.value)}
                placeholder="e.g. Kilimani Heights"
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-hidden"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Property Type</label>
              <select
                id="select-add-type"
                value={newPropType}
                onChange={(e) => setNewPropType(e.target.value as PropertyType)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-hidden font-semibold text-slate-700"
              >
                <option>Apartment</option>
                <option>House</option>
                <option>Condo</option>
                <option>Duplex</option>
              </select>
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Street Address</label>
              <input
                id="input-add-address"
                type="text"
                required
                value={newPropAddress}
                onChange={(e) => setNewPropAddress(e.target.value)}
                placeholder="e.g. 24 Wood Avenue"
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-3 gap-2 md:col-span-2">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">City</label>
                <input
                  id="input-add-city"
                  type="text"
                  required
                  value={newPropCity}
                  onChange={(e) => setNewPropCity(e.target.value)}
                  placeholder="Nairobi"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-hidden"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">State</label>
                <input
                  id="input-add-state"
                  type="text"
                  required
                  value={newPropState}
                  onChange={(e) => setNewPropState(e.target.value)}
                  placeholder="Nairobi County"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-hidden"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">ZIP</label>
                <input
                  id="input-add-zip"
                  type="text"
                  required
                  value={newPropZip}
                  onChange={(e) => setNewPropZip(e.target.value)}
                  placeholder="00100"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Detailed Description</label>
              <textarea
                id="textarea-add-desc"
                rows={3}
                required
                value={newPropDesc}
                onChange={(e) => setNewPropDesc(e.target.value)}
                placeholder="Features, space details, historical backgrounds..."
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-hidden"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Amenities Selection</label>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {amenitiesList.map((amenity) => {
                  const isSel = newPropAmenities.includes(amenity);
                  return (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => toggleAmenitySelection(amenity)}
                      className={`px-3 py-1 text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${
                        isSel 
                          ? 'bg-blue-50 text-blue-600 border-blue-500/30' 
                          : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {amenity}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Photo Link (URL)</label>
              <input
                id="input-add-photo"
                type="text"
                value={newPropPhotos}
                onChange={(e) => setNewPropPhotos(e.target.value)}
                placeholder="Unsplash image or static housing asset URL"
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-slate-150 pt-3">
            <button
              id="btn-add-prop-submit"
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              Add Property Profile
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer border border-slate-200"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Advanced Filtering Suite */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-1.5 border-b border-slate-150 pb-2">
          <SlidersHorizontal className="w-4 h-4 text-blue-600" />
          <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Search & Filters</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {/* Text input */}
          <div className="space-y-1 lg:col-span-2">
            <label className="text-[9px] font-bold text-slate-400 uppercase">Search Location / Title</label>
            <div className="relative">
              <input
                id="filter-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Address, building, name..."
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 pl-8 focus:outline-hidden"
              />
              <Search className="absolute left-2.5 top-3 w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* Type dropdown */}
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-slate-400 uppercase">Property Type</label>
            <select
              id="filter-type-select"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as PropertyType | 'all')}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-700 focus:outline-hidden"
            >
              <option value="all">All Types</option>
              <option value="Apartment">Apartment</option>
              <option value="House">House</option>
              <option value="Condo">Condo</option>
              <option value="Duplex">Duplex</option>
            </select>
          </div>

          {/* Status dropdown */}
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-slate-400 uppercase">Status</label>
            <select
              id="filter-status-select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as PropertyStatus | 'all')}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-700 focus:outline-hidden"
            >
              <option value="all">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Draft">Draft</option>
              <option value="Archived">Archived</option>
            </select>
          </div>

          {/* Price Filters */}
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-slate-400 uppercase">Min Price (Ksh)</label>
            <input
              id="filter-min-price"
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="e.g. 30000"
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-hidden"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-bold text-slate-400 uppercase">Max Price (Ksh)</label>
            <input
              id="filter-max-price"
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="e.g. 120000"
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* Grid of property listings */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.length === 0 ? (
          <div className="col-span-full bg-slate-50 text-slate-500 text-center py-12 rounded-xl border border-dashed border-slate-200 space-y-2">
            <AlertCircle className="w-8 h-8 text-slate-300 mx-auto" />
            <h4 className="text-xs font-bold text-slate-700">No properties matching those parameters found</h4>
            <p className="text-[10px] text-slate-400">Try modifying your text search, minimum prices, or category filters.</p>
          </div>
        ) : (
          filteredProperties.map((p) => {
            const propUnits = units.filter(u => u.propertyId === p.id);
            const occupied = propUnits.filter(u => u.status === 'Occupied').length;
            const vacant = propUnits.filter(u => u.status === 'Vacant').length;
            
            // Availability calendar status: High vacant means immediate scheduling
            const isHighlyAvailable = vacant > 0;

            return (
              <div 
                key={p.id}
                id={`property-card-${p.id}`}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs hover:shadow-sm transition-all flex flex-col justify-between group"
              >
                <div className="relative h-44 bg-slate-50 overflow-hidden">
                  <img
                    src={p.photos[0]}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2">
                    <span className={`text-[9px] font-extrabold uppercase px-2 py-1 rounded-lg text-white ${
                      isHighlyAvailable ? 'bg-emerald-500/90' : 'bg-slate-700/90'
                    }`}>
                      {isHighlyAvailable ? `Calendar: ${vacant} Vacant` : 'Calendar: Full'}
                    </span>
                  </div>
                  <div className="absolute top-2 right-2">
                    <button
                      id={`btn-delete-prop-${p.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteProperty(p.id);
                      }}
                      className="bg-red-500/90 hover:bg-red-600/90 text-white p-1.5 rounded-lg transition-all cursor-pointer"
                      title="Delete property"
                    >
                      <Trash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md">
                      {p.type}
                    </span>
                    <h3 className="text-sm font-bold text-slate-950 mt-2 truncate group-hover:text-blue-600 transition-colors">{p.name}</h3>
                    <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-1 font-semibold">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {p.address}, {p.city}
                    </p>
                  </div>

                  <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2 h-8">{p.description}</p>

                  <div className="flex flex-wrap gap-1">
                    {p.amenities.slice(0, 3).map((a) => (
                      <span key={a} className="text-[9px] bg-slate-50 border border-slate-200 text-slate-500 font-semibold px-1.5 py-0.5 rounded-md">
                        {a}
                      </span>
                    ))}
                    {p.amenities.length > 3 && (
                      <span className="text-[9px] text-slate-400 px-1.5 py-0.5">+{p.amenities.length - 3} more</span>
                    )}
                  </div>

                  <div className="border-t border-slate-150 pt-4 flex items-center justify-between">
                    <div className="text-[10px]">
                      <span className="text-slate-400 font-semibold">Monthly Range</span>
                      <p className="text-slate-800 font-extrabold text-xs mt-0.5 font-mono">
                        {propUnits.length > 0 
                          ? `Ksh ${Math.min(...propUnits.map(u => u.rentAmount)).toLocaleString()} - Ksh ${Math.max(...propUnits.map(u => u.rentAmount)).toLocaleString()}`
                          : 'No unit rents listed'}
                      </p>
                    </div>

                    <button
                      id={`btn-view-details-${p.id}`}
                      onClick={() => onSelectProperty(p.id)}
                      className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-3 py-1.5 rounded-lg text-[10px] transition-all cursor-pointer flex items-center gap-1"
                    >
                      <span>Property Profile</span>
                      <Maximize className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          }))}
        </div>
      </div>
  );
}
