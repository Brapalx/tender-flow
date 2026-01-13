
import React from 'react';
import { 
  Inbox as InboxIcon, 
  Star, 
  Trash2, 
  Settings, 
  Layers,
  ChevronRight,
  X,
  Clock,
  Users
} from 'lucide-react';
import { ViewType, User } from '../types';

interface SidebarProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
  counts: {
    inbox: number;
    interested: number;
    in_process: number;
    trash: number;
  };
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeView, 
  onViewChange, 
  counts, 
  isOpen, 
  onClose,
  currentUser 
}) => {
  const menuItems = [
    { id: 'inbox', label: 'Inbox', icon: InboxIcon, count: counts.inbox, color: 'text-indigo-600' },
    { id: 'interested', label: 'Interesados', icon: Star, count: counts.interested, color: 'text-amber-500' },
    { id: 'in_process', label: 'En Proceso', icon: Clock, count: counts.in_process, color: 'text-sky-500' },
    { id: 'trash', label: 'Papelera', icon: Trash2, count: counts.trash, color: 'text-slate-400' },
    { id: 'users', label: 'Usuarios', icon: Users, count: 0, color: 'text-emerald-500' },
  ];

  return (
    <>
      {/* Overlay para móviles */}
      <div 
        className={`fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        flex flex-col h-screen
      `}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-none">
                <Layers size={24} />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight dark:text-white text-slate-900">TenderPulse</h1>
              </div>
            </div>
            <button onClick={onClose} className="lg:hidden p-2 text-slate-400 hover:text-slate-600">
              <X size={20} />
            </button>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onViewChange(item.id as ViewType);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all ${
                  activeView === item.id 
                    ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={20} className={activeView === item.id ? (item.color || 'text-indigo-600') : 'text-slate-400'} />
                  <span className="font-medium text-sm">{item.label}</span>
                </div>
                {item.count > 0 && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    activeView === item.id ? 'bg-indigo-200 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-200' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}>
                    {item.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6 space-y-4">
          <button 
            onClick={() => onViewChange('settings')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
              activeView === 'settings' 
                ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <Settings size={20} className={activeView === 'settings' ? 'text-indigo-600' : 'text-slate-400'} />
            <span className="font-medium text-sm">Ajustes</span>
          </button>

          <div className="flex items-center gap-3 px-3 py-2 border-t border-slate-100 dark:border-slate-800 pt-4">
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex-shrink-0">
              <img src={currentUser.avatar} alt={currentUser.name} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{currentUser.name}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate capitalize">{currentUser.role}</p>
            </div>
            <ChevronRight size={14} className="text-slate-300 dark:text-slate-600" />
          </div>
        </div>
      </aside>
    </>
  );
};
