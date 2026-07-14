import React from 'react';
import { User, UserRole } from '../types';
import { Shield, Home, UserCheck, Settings } from 'lucide-react';

interface RoleSelectorProps {
  currentUser: User;
  onRoleChange: (role: UserRole) => void;
}

export default function RoleSelector({ currentUser, onRoleChange }: RoleSelectorProps) {
  const roles: { role: UserRole; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      role: 'landlord',
      label: 'Landlord / Owner',
      icon: <Shield className="w-4 h-4 text-blue-600" />,
      desc: 'Portfolio KPIs, financial returns, document vault, and management oversight.'
    },
    {
      role: 'manager',
      label: 'Property Manager',
      icon: <Settings className="w-4 h-4 text-emerald-600" />,
      desc: 'Day-to-day operations, tenant screening, maintenance dispatches, announcements.'
    },
    {
      role: 'tenant',
      label: 'Resident Tenant',
      icon: <Home className="w-4 h-4 text-amber-600" />,
      desc: 'Rent payment logs, M-Pesa STK push config, maintenance logging, manager chat.'
    }
  ];

  return (
    <div className="bg-white border-b border-slate-200 text-slate-800 p-4 sticky top-0 z-50 shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Brand / Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white font-extrabold text-lg shadow-sm">
            B
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-slate-900 flex items-center gap-2">
              BomaFlow <span className="text-[10px] bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded-full font-mono font-bold">v2.0</span>
            </h1>
            <p className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">Multi-Role Rental Operations</p>
          </div>
        </div>

        {/* Selector Chips */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
          <span className="text-[10px] text-slate-400 px-2 font-bold uppercase tracking-wider">Viewing as:</span>
          {roles.map((r) => {
            const isActive = currentUser.role === r.role;
            return (
              <button
                key={r.role}
                id={`role-btn-${r.role}`}
                onClick={() => onRoleChange(r.role)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
                }`}
                title={r.desc}
              >
                {r.icon}
                <span>{r.label}</span>
              </button>
            );
          })}
        </div>

        {/* User Identity Info */}
        <div className="flex items-center gap-3 border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-4">
          <img
            src={currentUser.avatarUrl}
            alt={currentUser.name}
            className="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-xs"
            referrerPolicy="no-referrer"
          />
          <div className="hidden sm:block">
            <div className="text-xs font-bold text-slate-800">{currentUser.name}</div>
            <div className="text-[10px] text-slate-400 font-semibold">{currentUser.email}</div>
          </div>
          <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-200" title="Multi-Factor Auth Active">
            <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
          </div>
        </div>
      </div>
    </div>
  );
}

