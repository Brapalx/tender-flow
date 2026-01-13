
import React from 'react';
import { Moon, Sun, Monitor, Bell, Shield, Database, Globe } from 'lucide-react';

interface SettingsProps {
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ theme, onThemeToggle }) => {
  return (
    <div className="max-w-4xl space-y-8 pb-20">
      <section>
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 px-1">Apariencia</h3>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                {theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Modo Oscuro</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Reduce la fatiga visual en entornos de poca luz.</p>
              </div>
            </div>
            <button 
              onClick={onThemeToggle}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                theme === 'dark' ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          <div className="h-[1px] bg-slate-100 dark:bg-slate-800 mx-6"></div>

          <div className="p-6 flex items-center justify-between opacity-50 cursor-not-allowed">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center text-slate-400">
                <Monitor size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Seguir Sistema</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Ajusta automáticamente el tema según tu dispositivo.</p>
              </div>
            </div>
            <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-1 rounded">PRO</span>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 px-1">Notificaciones y Datos</h3>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Bell size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Alertas de AWS</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Recibe notificaciones cuando haya nuevas licitaciones.</p>
              </div>
            </div>
            <div className="w-10 h-5 bg-emerald-500/20 dark:bg-emerald-500/10 rounded-full flex items-center px-1">
              <div className="w-3 h-3 bg-emerald-500 rounded-full ml-auto"></div>
            </div>
          </div>

          <div className="h-[1px] bg-slate-100 dark:bg-slate-800 mx-6"></div>

          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-900/20 flex items-center justify-center text-sky-600 dark:text-sky-400">
                <Database size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Cache de Licitaciones</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Permitir almacenamiento local para modo offline.</p>
              </div>
            </div>
            <div className="w-10 h-5 bg-sky-500/20 dark:bg-sky-500/10 rounded-full flex items-center px-1">
              <div className="w-3 h-3 bg-sky-500 rounded-full ml-auto"></div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 px-1">Seguridad</h3>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center text-rose-600 dark:text-rose-400">
                <Shield size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Acceso Basado en Roles</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Ver y auditar tus permisos actuales en AWS.</p>
              </div>
            </div>
            <button className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">Gestionar</button>
          </div>
        </div>
      </section>
    </div>
  );
};
