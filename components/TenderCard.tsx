
import React from 'react';
import { Tender, UserRole } from '../types';
import { Button } from './Button';
import { 
  Building2, 
  Calendar, 
  ArrowRight, 
  CheckCircle, 
  Trash2,
  FileText,
  Lock
} from 'lucide-react';

interface TenderCardProps {
  tender: Tender;
  onAction: (id: string, status: string) => void;
  onClick: (tender: Tender) => void;
  userRole: UserRole;
}

export const TenderCard: React.FC<TenderCardProps> = ({ 
  tender, 
  onAction, 
  onClick,
  userRole
}) => {
  const isViewer = userRole === 'viewer';

  return (
    <div className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:shadow-xl hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 
            className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors cursor-pointer"
            onClick={() => onClick(tender)}
          >
            {tender.title}
          </h3>
          <p className="text-slate-400 dark:text-slate-500 text-[10px] font-mono mt-1">ID: {tender.id}</p>
        </div>
        {!isViewer && (
          <div className="flex items-center gap-1.5">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20"
              onClick={(e) => { e.stopPropagation(); onAction(tender.id, 'trash'); }}
            >
              <Trash2 size={18} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-slate-400 dark:text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
              onClick={(e) => { e.stopPropagation(); onAction(tender.id, 'interested'); }}
            >
              <CheckCircle size={18} />
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-y-3 mb-6">
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
          <Building2 size={16} className="text-slate-400 dark:text-slate-600" />
          <span className="truncate">{tender.issuer}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
          <Calendar size={16} className="text-slate-400 dark:text-slate-600" />
          <span>{tender.date}</span>
        </div>
      </div>

      <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 mb-6">
        {tender.description}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
        <Button 
          variant="secondary" 
          size="sm" 
          className="gap-2 text-xs"
          onClick={(e) => { e.stopPropagation(); onClick(tender); }}
        >
          <FileText size={14} className="text-slate-400" />
          Expediente
        </Button>
        
        <button 
          className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400"
          onClick={() => onClick(tender)}
        >
          Detalles <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};
