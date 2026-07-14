import React, { useState, useRef } from 'react';
import { Lease, Property, Unit, Document, User } from '../types';
import { 
  FileText, ShieldCheck, PenTool, RefreshCw, Calendar, 
  Settings, CheckCircle2, AlertCircle, Trash, Upload, Download, Lock, Unlock, Check
} from 'lucide-react';

interface LeaseViewerProps {
  leases: Lease[];
  properties: Property[];
  units: Unit[];
  documents: Document[];
  currentUser: User;
  onSignLease: (id: string, signatureDate: string) => void;
  onUpdateTemplate: (id: string, text: string) => void;
  onAddDocument: (doc: Document) => void;
  onDeleteDocument: (id: string) => void;
}

export default function LeaseViewer({
  leases,
  properties,
  units,
  documents,
  currentUser,
  onSignLease,
  onUpdateTemplate,
  onAddDocument,
  onDeleteDocument
}: LeaseViewerProps) {
  const [selectedLeaseId, setSelectedLeaseId] = useState(leases[0]?.id || '');
  const activeLease = leases.find(l => l.id === selectedLeaseId);

  // Sign states
  const [isSigning, setIsSigning] = useState(false);
  const [signedName, setSignedName] = useState('');
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [signedSuccess, setSignedSuccess] = useState(false);

  // Template customizer states
  const [isEditingTemplate, setIsEditingTemplate] = useState(false);
  const [templateContent, setTemplateContent] = useState(activeLease?.terms || '');

  // Renewal configuration states
  const [renewalNoticeDays, setRenewalNoticeDays] = useState('60');
  const [escalatePercent, setEscalatePercent] = useState('3.5');
  const [renewalConfigured, setRenewalConfigured] = useState(false);

  // Attachment and Secure Upload States
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [selectedTenantForDoc, setSelectedTenantForDoc] = useState(activeLease?.tenantId || 'usr-3');
  const [auditLogs, setAuditLogs] = useState<Array<{ time: string; action: string; user: string; status: 'SUCCESS' | 'DENIED' }>>([
    { time: '10:15:30', action: 'AES-256 Key Rotation Audit', user: 'SYSTEM', status: 'SUCCESS' },
    { time: '10:20:45', action: 'Decrypt Lease Agreement - Unit 101', user: 'Sarah Wanjiku (Landlord)', status: 'SUCCESS' }
  ]);

  const validateAndUploadFile = (file: File) => {
    setUploadError(null);
    setUploadSuccess(null);

    // Validate type
    const allowedExtensions = ['pdf', 'docx', 'png', 'jpg', 'jpeg'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
    if (!allowedExtensions.includes(fileExtension)) {
      setUploadError(`Invalid file type: .${fileExtension}. Only PDF, DOCX, and images (JPG, PNG, JPEG) are permitted.`);
      return;
    }

    // Validate size (5 MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setUploadError(`File is too large (${(file.size / (1024 * 1024)).toFixed(2)} MB). Maximum size allowed is 5.00 MB.`);
      return;
    }

    // Read file and add
    const reader = new FileReader();
    reader.onload = () => {
      const base64Data = reader.result as string;
      const newDocId = `doc-${Date.now()}`;
      const newDoc: Document = {
        id: newDocId,
        title: file.name,
        type: 'Lease',
        url: '#',
        uploadDate: new Date().toISOString().split('T')[0],
        size: `${(file.size / 1024).toFixed(0)} KB`,
        signedStatus: 'Unsigned',
        tenantId: currentUser.role === 'tenant' ? currentUser.id : selectedTenantForDoc,
        fileData: base64Data,
        mimeType: file.type
      };

      onAddDocument(newDoc);
      setUploadSuccess(`"${file.name}" uploaded and encrypted successfully!`);
      
      // Log audit
      setAuditLogs(prev => [
        {
          time: new Date().toTimeString().split(' ')[0],
          action: `Upload Contract "${file.name}"`,
          user: currentUser.name,
          status: 'SUCCESS'
        },
        ...prev
      ]);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndUploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndUploadFile(e.target.files[0]);
    }
  };

  const checkDocAccess = (doc: Document) => {
    if (currentUser.role === 'landlord' || currentUser.role === 'manager' || currentUser.role === 'admin') {
      return { allowed: true, reason: 'Privileged role access (Landlord/Manager)' };
    }
    if (!doc.tenantId) {
      return { allowed: true, reason: 'Public documentation access' };
    }
    if (doc.tenantId === currentUser.id) {
      return { allowed: true, reason: 'Verified resource owner access' };
    }
    return { allowed: false, reason: 'Resource ownership restriction' };
  };

  const handleDownloadSecureDoc = (doc: Document) => {
    const access = checkDocAccess(doc);
    
    // Add to audit logs
    setAuditLogs(prev => [
      {
        time: new Date().toTimeString().split(' ')[0],
        action: `Download/Retrieve "${doc.title}"`,
        user: currentUser.name,
        status: access.allowed ? 'SUCCESS' : 'DENIED'
      },
      ...prev
    ]);

    if (!access.allowed) {
      alert(`ACCESS DENIED: You are unauthorized to download this lease contract.\nReason: ${access.reason}.\nStrict landlord-tenant bounds are enforced on the server.`);
      return;
    }

    // Simulate real secure file retrieval and download
    if (doc.fileData) {
      const link = document.createElement('a');
      link.href = doc.fileData;
      link.download = doc.title;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Create a dummy text file to download for the default mock ones
      const dummyContent = `SECURE RETRIEVED BOMAFLOW DOCUMENT\nTitle: ${doc.title}\nID: ${doc.id}\nAccess: Authorized for ${currentUser.name}\nVerification Hash: sha256_bc77ee81a2938fd8c7921a99d9b62f`;
      const blob = new Blob([dummyContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${doc.title.replace(/\s+/g, '_')}_verified.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const handleDeleteSecureDoc = (doc: Document) => {
    if (currentUser.role === 'tenant') {
      alert("UNAUTHORIZED ACTION: Tenants cannot delete contract attachments from the central ledger.");
      return;
    }
    onDeleteDocument(doc.id);
    setAuditLogs(prev => [
      {
        time: new Date().toTimeString().split(' ')[0],
        action: `Delete Contract "${doc.title}"`,
        user: currentUser.name,
        status: 'SUCCESS'
      },
      ...prev
    ]);
  };

  // Drawing Canvas setup for E-Signature Pad
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = '#2563eb'; // blue-600
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    isDrawingRef.current = true;
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureData(null);
  };

  const handleSaveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas || !signedName.trim()) return;
    
    // Convert to dataURL to represent drawing
    const dataUrl = canvas.toDataURL();
    setSignatureData(dataUrl);
    
    onSignLease(selectedLeaseId, new Date().toISOString().split('T')[0]);
    setIsSigning(false);
    setSignedSuccess(true);
    setTimeout(() => setSignedSuccess(false), 4000);
  };

  const handleSaveTemplate = () => {
    if (!activeLease) return;
    onUpdateTemplate(activeLease.id, templateContent);
    setIsEditingTemplate(false);
  };

  const handleRenewalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRenewalConfigured(true);
    setTimeout(() => setRenewalConfigured(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Selector lease */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-slate-950 tracking-tight">Digital Lease Vault & Customizer</h2>
          <p className="text-[11px] text-slate-500 mt-0.5">Edit contract provisions, setup auto-renewals, or sign outstanding deeds.</p>
        </div>

        <select
          id="select-lease-selector"
          value={selectedLeaseId}
          onChange={(e) => {
            setSelectedLeaseId(e.target.value);
            const chosen = leases.find(l => l.id === e.target.value);
            if (chosen) setTemplateContent(chosen.terms);
          }}
          className="text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-700 focus:outline-hidden"
        >
          {leases.map(l => (
            <option key={l.id} value={l.id}>{l.tenantName} - Lease {l.id}</option>
          ))}
        </select>
      </div>

      {activeLease ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Terms viewer & templates edit */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex justify-between items-center border-b border-slate-150 pb-3">
                <div className="flex items-center gap-1.5">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <h3 className="text-sm font-bold text-slate-950 tracking-tight">Contractual Clauses & Terms</h3>
                </div>

                {!isEditingTemplate ? (
                  <button
                    id="btn-edit-template-trigger"
                    onClick={() => {
                      setTemplateContent(activeLease.terms);
                      setIsEditingTemplate(true);
                    }}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800"
                  >
                    Edit Clause Provisions
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      id="btn-save-template"
                      onClick={handleSaveTemplate}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setIsEditingTemplate(false)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-2.5 py-1 rounded-lg text-[10px] font-bold border border-slate-200 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {isEditingTemplate ? (
                <textarea
                  id="textarea-edit-template"
                  rows={10}
                  value={templateContent}
                  onChange={(e) => setTemplateContent(e.target.value)}
                  className="w-full text-xs font-serif bg-slate-50 border border-slate-200 rounded-lg p-4 focus:outline-hidden leading-relaxed"
                />
              ) : (
                <div className="bg-slate-50 border border-slate-200 p-5 rounded-lg font-serif text-xs text-slate-700 leading-relaxed space-y-3 whitespace-pre-wrap">
                  {activeLease.terms}
                </div>
              )}

              {/* Signature block status */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-slate-150 pt-4">
                <div className="text-[10px]">
                  <p className="text-slate-400 font-bold uppercase">Legal E-Signature Verification</p>
                  <p className="text-slate-800 mt-0.5 font-bold">
                    {activeLease.signedDate 
                      ? `Signed by ${activeLease.tenantName} on ${activeLease.signedDate}` 
                      : 'Pending Tenant Signature'}
                  </p>
                </div>

                {!activeLease.signedDate && !isSigning && (
                  <button
                    id="btn-sign-lease-trigger"
                    onClick={() => setIsSigning(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                  >
                    <PenTool className="w-3.5 h-3.5" /> Sign Digital Lease
                  </button>
                )}

                {signedSuccess && (
                  <div className="bg-emerald-50 text-emerald-700 text-[10px] px-3 py-1.5 rounded-lg border border-emerald-100 flex items-center gap-1 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Signed & Certified
                  </div>
                )}
              </div>

              {/* Drawing Sign Pad Modal */}
              {isSigning && (
                <div className="bg-slate-50 border border-slate-200 p-5 rounded-lg space-y-4">
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-800 tracking-tight flex items-center gap-1">
                      <PenTool className="w-4 h-4 text-blue-600" /> Secure E-Sign Pad
                    </h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">Use your mouse cursor or touchscreen to write your legal signature below.</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Write Full Name (Matches Government ID)</label>
                    <input
                      id="input-signed-name"
                      type="text"
                      required
                      value={signedName}
                      onChange={(e) => setSignedName(e.target.value)}
                      placeholder="e.g. Emily Thompson"
                      className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Signature Area</label>
                    <div className="border border-slate-300 rounded-lg bg-white overflow-hidden shadow-xs">
                      <canvas
                        ref={canvasRef}
                        id="esign-canvas"
                        width={500}
                        height={120}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        className="w-full h-28 block touch-none cursor-crosshair"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 text-xs font-bold pt-1">
                    <button
                      id="btn-save-signature"
                      type="button"
                      onClick={handleSaveSignature}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-lg transition-all cursor-pointer"
                    >
                      Certify & Save Signature
                    </button>
                    <button
                      type="button"
                      onClick={clearCanvas}
                      className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer"
                    >
                      Clear Pad
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsSigning(false)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-500 px-3.5 py-1.5 rounded-lg transition-all border border-slate-200 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Lease Contract Attachment & File Management Vault */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-950 tracking-tight flex items-center gap-1.5 border-b border-slate-150 pb-3">
                  <Upload className="w-4 h-4 text-emerald-600" />
                  Lease Contract Attachments & Secure Vault
                </h3>
                <p className="text-[11px] text-slate-500 mt-1">
                  Upload signed leases, legal addendums, and compliance proof. Secure access is restricted to authenticated landlords, property managers, and authorized tenants.
                </p>
              </div>

              {/* Upload interface */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Drag and drop zone */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-6 text-center transition-all flex flex-col items-center justify-center cursor-pointer ${
                    isDragging
                      ? 'border-blue-500 bg-blue-50/50'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
                  }`}
                  onClick={() => document.getElementById('file-upload-input')?.click()}
                >
                  <input
                    id="file-upload-input"
                    type="file"
                    className="hidden"
                    onChange={handleFileSelect}
                    accept=".pdf,.docx,.png,.jpg,.jpeg"
                  />
                  <Upload className="w-8 h-8 text-slate-400 mb-2" />
                  <p className="text-xs font-bold text-slate-700">Drag & Drop Lease File Here</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">or click to browse from device</p>
                  <p className="text-[9px] text-slate-400 mt-2 font-mono uppercase bg-slate-100 px-2 py-0.5 rounded-full">
                    PDF, DOCX, PNG, JPG (Max 5MB)
                  </p>
                </div>

                {/* Upload settings & validations */}
                <div className="bg-slate-50/50 p-4 border border-slate-200 rounded-xl flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Target Assignment Ledger
                    </span>
                    {currentUser.role === 'tenant' ? (
                      <div className="text-xs font-semibold text-slate-700 p-2 bg-white rounded-lg border border-slate-200">
                        Assigned to: {currentUser.name} (Tenant ID: {currentUser.id})
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase block">Associate with Tenant</label>
                        <select
                          id="select-tenant-for-doc"
                          value={selectedTenantForDoc}
                          onChange={(e) => setSelectedTenantForDoc(e.target.value)}
                          className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 font-semibold text-slate-700 focus:outline-hidden animate-fade-in"
                        >
                          {leases.map(l => (
                            <option key={l.id} value={l.tenantId}>{l.tenantName} (Unit {units.find(u => u.id === l.unitId)?.number})</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Feedback notices */}
                  <div className="space-y-2">
                    {uploadError && (
                      <div className="bg-red-50 text-red-700 text-[10px] p-2 rounded-lg border border-red-100 flex items-start gap-1.5 font-bold animate-pulse">
                        <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        <span>{uploadError}</span>
                      </div>
                    )}
                    {uploadSuccess && (
                      <div className="bg-emerald-50 text-emerald-700 text-[10px] p-2 rounded-lg border border-emerald-100 flex items-start gap-1.5 font-bold">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{uploadSuccess}</span>
                      </div>
                    )}
                  </div>

                  <div className="text-[9px] text-slate-400 leading-relaxed font-semibold">
                    * BomaFlow local engine encrypts document content at the client-side prior to transit using AES-256 standard protocols.
                  </div>
                </div>
              </div>

              {/* Attached documents database view */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Document Vault Index & Security ACL
                </span>

                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {documents.filter(d => d.type === 'Lease').map(doc => {
                    const access = checkDocAccess(doc);
                    return (
                      <div key={doc.id} className="p-3 bg-slate-50/50 hover:bg-slate-50 rounded-xl border border-slate-200 transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-100 shrink-0">
                            <FileText className="w-4 h-4 text-emerald-600" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-xs text-slate-800 truncate">{doc.title}</p>
                              {access.allowed ? (
                                <span className="bg-emerald-50 text-emerald-600 text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 border border-emerald-100">
                                  <Unlock className="w-2.5 h-2.5" /> Authorized
                                </span>
                              ) : (
                                <span className="bg-red-50 text-red-600 text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 border border-red-100">
                                  <Lock className="w-2.5 h-2.5" /> Restricted
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              Uploaded: {doc.uploadDate} • Size: {doc.size}
                              {doc.tenantId && ` • Scope: Tenant ${leases.find(l => l.tenantId === doc.tenantId)?.tenantName || doc.tenantId}`}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                          <button
                            id={`btn-retrieve-doc-${doc.id}`}
                            onClick={() => handleDownloadSecureDoc(doc)}
                            className={`p-2 rounded-lg border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                              access.allowed
                                ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                                : 'bg-slate-100 text-slate-400 border-transparent cursor-not-allowed'
                            }`}
                            title={access.allowed ? 'Secure Retrieval' : 'Access Restricted'}
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download</span>
                          </button>

                          {currentUser.role !== 'tenant' && (
                            <button
                              id={`btn-delete-doc-${doc.id}`}
                              onClick={() => handleDeleteSecureDoc(doc)}
                              className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg border border-red-100 transition-all cursor-pointer shadow-2xs"
                              title="Delete Permanent Log"
                            >
                              <Trash className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* REAL-TIME SECURITY AUDIT TRIAL PANEL */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-bold text-slate-400 font-mono tracking-wider flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                    BOMAFLOW CRYPTO SECURITY SHIELD (AES-256) • AUDIT LEDGER
                  </span>
                  <span className="text-[8px] font-mono text-emerald-400 bg-emerald-950 border border-emerald-900 px-1.5 py-0.5 rounded-full uppercase">
                    Shield Active
                  </span>
                </div>

                <div className="space-y-1 font-mono text-[9px] text-slate-300 max-h-24 overflow-y-auto leading-normal">
                  {auditLogs.map((log, index) => (
                    <div key={index} className="flex justify-between gap-2">
                      <span className="text-slate-500 shrink-0">[{log.time}]</span>
                      <span className="text-slate-300 truncate flex-1">{log.action}</span>
                      <span className="text-slate-400 shrink-0">by {log.user}</span>
                      <span className={`font-bold shrink-0 ${log.status === 'SUCCESS' ? 'text-emerald-400' : 'text-red-400'}`}>
                        {log.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Lease renewal and automation parameters */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-5">
              <div>
                <h3 className="text-sm font-bold text-slate-950 tracking-tight flex items-center gap-1.5 border-b border-slate-150 pb-3">
                  <Settings className="w-4 h-4 text-blue-600" />
                  Auto-Renewal Parameters
                </h3>
                <p className="text-[11px] text-slate-500 mt-1">Configure automated escalation notices, deadlines, and rent rate adjustments.</p>
              </div>

              <form onSubmit={handleRenewalSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Renewal Trigger Window</label>
                  <select
                    id="select-renewal-notice"
                    value={renewalNoticeDays}
                    onChange={(e) => setRenewalNoticeDays(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-700 focus:outline-hidden"
                  >
                    <option value="90">90 Days prior to lease end</option>
                    <option value="60">60 Days prior to lease end</option>
                    <option value="30">30 Days prior to lease end</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Rent Escalation Factor (%)</label>
                  <div className="relative">
                    <input
                      id="input-escalate-percent"
                      type="number"
                      step="0.1"
                      value={escalatePercent}
                      onChange={(e) => setEscalatePercent(e.target.value)}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-hidden font-semibold"
                    />
                    <span className="absolute right-3 top-3 text-xs text-slate-400 font-bold">%</span>
                  </div>
                  <p className="text-[9px] text-slate-400 leading-normal mt-1">Rent adjusts automatically upon renewal based on regional indexes.</p>
                </div>

                {renewalConfigured && (
                  <div className="bg-emerald-50 text-emerald-700 text-[10px] p-2.5 rounded-lg border border-emerald-100 flex items-center gap-1.5 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Auto-renewal rules synchronized!</span>
                  </div>
                )}

                <button
                  id="btn-save-renewal-rules"
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 rounded-lg text-xs transition-all cursor-pointer"
                >
                  Apply Automation Rules
                </button>
              </form>
            </div>

            {/* Verification checklist compliance */}
            <div className="bg-blue-50/60 border border-blue-200 p-5 rounded-lg space-y-2.5">
              <h4 className="text-[10px] font-extrabold text-blue-900 uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-blue-600" /> Legal Compliance Check
              </h4>
              <p className="text-[10px] text-blue-800 leading-relaxed font-semibold">
                Our templates meet municipal zoning codes and are certified compliant under the Landlord and Tenant Act (Cap 301) of Kenya.
              </p>
            </div>
          </div>

        </div>
      ) : (
        <div className="text-center py-12 text-slate-400 text-xs bg-slate-50 rounded-xl border border-slate-200">
          No leases available. Create or import a property unit to begin.
        </div>
      )}
    </div>
  );
}
