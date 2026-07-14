import React, { useState } from 'react';
import { Message, Document, User } from '../types';
import { 
  MessageSquare, Send, Mail, Bell, FileText, CheckCheck, 
  Check, Download, Search, Share2, Users, CheckSquare
} from 'lucide-react';

interface CommunicationHubProps {
  messages: Message[];
  documents: Document[];
  currentUser: User;
  onSendMessage: (content: string) => void;
}

export default function CommunicationHub({
  messages,
  documents,
  currentUser,
  onSendMessage
}: CommunicationHubProps) {
  // Local Chat state
  const [chatInput, setChatInput] = useState('');

  // Notification Preferences states
  const [emailNotify, setEmailNotify] = useState(true);
  const [smsNotify, setSmsNotify] = useState(true);
  const [maintAlerts, setMaintAlerts] = useState(true);
  const [savePreferencesSuccess, setSavePreferencesSuccess] = useState(false);
  
  // Simulated download success feedback
  const [downloadedDocIds, setDownloadedDocIds] = useState<string[]>([]);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    onSendMessage(chatInput.trim());
    setChatInput('');
  };

  const handleDownloadDoc = (docId: string) => {
    setDownloadedDocIds(prev => [...prev, docId]);
    setTimeout(() => {
      // Clear after a few seconds
      setDownloadedDocIds(prev => prev.filter(id => id !== docId));
    }, 3000);
  };

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    setSavePreferencesSuccess(true);
    setTimeout(() => setSavePreferencesSuccess(false), 3000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Direct Messaging Chat Log Container */}
      <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between h-[520px]">
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-slate-150 pb-3">
            <div className="flex items-center gap-1.5">
              <MessageSquare className="w-5 h-5 text-blue-600 animate-bounce" />
              <div>
                <h3 className="text-sm font-bold text-slate-950 tracking-tight">Direct Operations Messenger</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Secure, end-to-end encrypted messaging with management authorities.</p>
              </div>
            </div>
            <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full uppercase">Active session</span>
          </div>

          {/* Messages Feed View */}
          <div className="space-y-3 h-[360px] overflow-y-auto pr-1">
            {messages.map((m) => {
              const isSelf = m.senderId === currentUser.id;
              return (
                <div 
                  key={m.id}
                  className={`flex flex-col max-w-[80%] ${
                    isSelf ? 'ml-auto items-end' : 'mr-auto items-start'
                  }`}
                >
                  <span className="text-[9px] text-slate-400 font-bold mb-0.5 px-1">{m.senderName} ({m.senderRole})</span>
                  <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                    isSelf 
                      ? 'bg-blue-600 text-white rounded-br-none shadow-xs' 
                      : 'bg-slate-100 text-slate-700 rounded-bl-none border border-slate-200/50'
                  }`}>
                    {m.content}
                  </div>
                  <div className="flex items-center gap-1 mt-0.5 px-1">
                    <span className="text-[8px] text-slate-400 font-mono">{new Date(m.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    {isSelf && (
                      m.read 
                        ? <CheckCheck className="w-3 h-3 text-blue-500" /> 
                        : <Check className="w-3 h-3 text-slate-300" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Send message text form */}
        <form onSubmit={handleSendChat} className="flex gap-2 border-t border-slate-150 pt-3">
          <input
            id="chat-input"
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Type your message securely..."
            className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-hidden focus:border-blue-500"
          />
          <button
            id="btn-send-message"
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-lg shadow-xs transition-all cursor-pointer flex items-center justify-center shrink-0"
            title="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Right Column: Alert settings preference checkbox matrices & Document Sharing */}
      <div className="space-y-6">
        
        {/* Document sharing lists */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-950 tracking-tight flex items-center gap-1.5 border-b border-slate-150 pb-3">
            <FileText className="w-4 h-4 text-emerald-600" />
            File Vault Repository
          </h3>

          <div className="space-y-3">
            {documents.map((doc) => {
              const isDownloaded = downloadedDocIds.includes(doc.id);
              return (
                <div key={doc.id} className="p-3 border border-slate-200 rounded-lg bg-slate-50/50 hover:bg-slate-50 transition-all flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-bold text-xs text-slate-800 truncate">{doc.title}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{doc.type} • {doc.size}</p>
                  </div>
                  
                  <button
                    id={`btn-download-doc-${doc.id}`}
                    onClick={() => handleDownloadDoc(doc.id)}
                    className={`p-2 rounded-lg border transition-all cursor-pointer shadow-xs ${
                      isDownloaded 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
                        : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                    title={isDownloaded ? "Downloaded!" : "Download File"}
                  >
                    {isDownloaded ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Configurable notify preferences */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-950 tracking-tight flex items-center gap-1.5 border-b border-slate-150 pb-3">
            <Bell className="w-4 h-4 text-blue-600" />
            Contact preferences
          </h3>

          <form onSubmit={handleSavePreferences} className="space-y-4">
            <div className="space-y-3">
              {/* Option 1: email */}
              <div className="flex items-start gap-3">
                <input
                  id="checkbox-pref-email"
                  type="checkbox"
                  checked={emailNotify}
                  onChange={(e) => setEmailNotify(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <div>
                  <label htmlFor="checkbox-pref-email" className="text-xs font-bold text-slate-800 cursor-pointer">Email Notifications</label>
                  <p className="text-[10px] text-slate-400 mt-0.5">Send monthly invoices, rent receipt logs, and lease proposals directly.</p>
                </div>
              </div>

              {/* Option 2: SMS */}
              <div className="flex items-start gap-3">
                <input
                  id="checkbox-pref-sms"
                  type="checkbox"
                  checked={smsNotify}
                  onChange={(e) => setSmsNotify(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <div>
                  <label htmlFor="checkbox-pref-sms" className="text-xs font-bold text-slate-800 cursor-pointer">SMS Alerts & Broadcasts</label>
                  <p className="text-[10px] text-slate-400 mt-0.5">Push water shut-offs, pest control windows, or urgent notices straight to your phone.</p>
                </div>
              </div>

              {/* Option 3: repair dispatches */}
              <div className="flex items-start gap-3">
                <input
                  id="checkbox-pref-maint"
                  type="checkbox"
                  checked={maintAlerts}
                  onChange={(e) => setMaintAlerts(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <div>
                  <label htmlFor="checkbox-pref-maint" className="text-xs font-bold text-slate-800 cursor-pointer">Maintenance Dispatch Alerts</label>
                  <p className="text-[10px] text-slate-400 mt-0.5">Receive immediate progress notes when handymen or technicians are assigned.</p>
                </div>
              </div>
            </div>

            {savePreferencesSuccess && (
              <div className="bg-emerald-50 text-emerald-700 text-[10px] p-2 rounded-lg border border-emerald-100 flex items-center gap-1 font-bold">
                <Check className="w-4 h-4 text-emerald-500" /> Preference matrices updated.
              </div>
            )}

            <button
              id="btn-save-preferences"
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 rounded-lg text-xs transition-all cursor-pointer"
            >
              Update Preferences
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
