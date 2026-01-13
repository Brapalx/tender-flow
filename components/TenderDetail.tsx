
import React from 'react';
import { Tender, UserRole } from '../types';
import { Button } from './Button';
import { 
  X, 
  Building2, 
  FileText,
  Clock,
  Lock
} from 'lucide-react';

interface TenderDetailProps {
  tender: Tender;
  onClose: () => void;
  onAction: (id: string, status: string) => void;
  userRole: UserRole;
}

export const TenderDetail: React.FC<TenderDetailProps> = ({ 
  tender, 
  onClose, 
  onAction,
  userRole
}) => {
  const isViewer = userRole === 'viewer';

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-end bg-slate-900/40 backdrop-blur-sm transition-all overflow-hidden">
      <div 
        className="w-full lg:max-w-2xl h-full bg-white shadow-2xl flex flex-col transform transition-transform animate-in slide-in-from-right duration-300"
      >
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
          <div className="flex flex-col min-w-0 pr-8">
            <h2 className="text-lg md:text-xl font-bold text-slate-900 truncate">{tender.title}</h2>
            {isViewer && (
              <span className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                <Lock size={10} /> Solo lectura
              </span>
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X size={20} />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 md:space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Fecha Limite</p>
              <p className="text-base md:text-lg font-bold text-slate-900">{tender.date}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between sm:block">
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Estado</p>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase">
                {tender.status === 'new' ? 'Inbox' : 
                 tender.status === 'interested' ? 'Interesado' : 
                 tender.status === 'in_process' ? 'En Proceso' : 'Papelera'}
              </span>
            </div>
          </div>

          <div className="space-y-6">
            <section>
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <FileText size={18} className="text-slate-400" /> Descripción
              </h3>
              <p className="text-slate-600 text-xs md:text-sm leading-relaxed whitespace-pre-wrap">
                {tender.description}
              </p>
            </section>

            <section>
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Building2 size={18} className="text-slate-400" /> Información del Emisor
              </h3>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 font-bold flex-shrink-0">
                  {tender.issuer.substring(0, 2)}
                </div>
                <div className="min-w-0">
                  <p className="text-xs md:text-sm font-bold text-slate-900 truncate">{tender.issuer}</p>
                  <p className="text-[10px] md:text-xs text-slate-500">Entidad Gubernamental</p>
                </div>
              </div>
            </section>
          </div>
        </div>

        <div className="p-4 md:p-6 border-t border-slate-100 bg-slate-50 flex flex-wrap items-center gap-3 md:gap-4 sticky bottom-0 z-10">
          {!isViewer && (
            <>
              <Button 
                variant="danger" 
                className="flex-1 min-w-[100px] text-xs md:text-sm"
                onClick={() => {
                  onAction(tender.id, 'trash');
                  onClose();
                }}
              >
                Papelera
              </Button>

              {tender.status === 'interested' && (
                <Button 
                  variant="primary" 
                  className="flex-1 min-w-[120px] text-xs md:text-sm gap-2 bg-sky-600 hover:bg-sky-700"
                  onClick={() => {
                    onAction(tender.id, 'in_process');
                    onClose();
                  }}
                >
                  <Clock size={16} /> En Proceso
                </Button>
              )}

              <Button 
                variant="success" 
                className="flex-1 min-w-[100px] text-xs md:text-sm"
                onClick={() => {
                  if (tender.status !== 'interested' && tender.status !== 'in_process') {
                    onAction(tender.id, 'interested');
                  }
                  onClose();
                }}
              >
                {tender.status === 'interested' || tender.status === 'in_process' ? 'Cerrar' : 'Interesar'}
              </Button>
            </>
          )}

          {isViewer && (
            <div className="flex-1 text-center py-2 px-4 bg-amber-50 border border-amber-100 rounded-lg text-amber-700 text-xs font-medium flex items-center justify-center gap-2">
              <Lock size={14} /> Tienes permisos de solo lectura. No puedes modificar el estado.
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
};
