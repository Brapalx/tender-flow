
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Tender, ViewType, User, UserRole } from './types';
import { MOCK_TENDERS, MOCK_USERS } from './constants';
import { Sidebar } from './components/Sidebar';
import { TenderCard } from './components/TenderCard';
import { TenderDetail } from './components/TenderDetail';
import { UserManagement } from './components/UserManagement';
import { Settings } from './components/Settings';
import { apiService } from './services/apiService';
import { 
  Search, 
  Menu,
  CloudCheck,
  RefreshCw,
  XCircle,
  Inbox as InboxIcon,
  AlertCircle
} from 'lucide-react';

const App: React.FC = () => {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS[0]);
  const [activeView, setActiveView] = useState<ViewType>('inbox');
  const [selectedTender, setSelectedTender] = useState<Tender | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'error'>('synced');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => 
    (localStorage.getItem('tenderpulse_theme') as 'light' | 'dark') || 'light'
  );

  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('tenderpulse_theme', theme);
  }, [theme]);

  const loadData = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    setSyncStatus('syncing');
    setErrorMessage(null);
    try {
      const data = await apiService.getTenders();
      setTenders(data.length > 0 ? data : MOCK_TENDERS);
      setSyncStatus('synced');
    } catch (err: any) {
      setSyncStatus('error');
      setErrorMessage(err.message || "Error al conectar con la API");
      const cached = apiService.getFromCache();
      setTenders(cached.length > 0 ? cached : MOCK_TENDERS);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const counts = useMemo(() => ({
    inbox: tenders.filter(t => t.status === 'new').length,
    interested: tenders.filter(t => t.status === 'interested').length,
    in_process: tenders.filter(t => t.status === 'in_process').length,
    trash: tenders.filter(t => t.status === 'trash').length,
  }), [tenders]);

  const filteredTenders = useMemo(() => {
    let base = tenders.filter(t => {
      if (activeView === 'inbox') return t.status === 'new';
      if (activeView === 'interested') return t.status === 'interested';
      if (activeView === 'in_process') return t.status === 'in_process';
      if (activeView === 'trash') return t.status === 'trash';
      return false;
    });

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      base = base.filter(t => 
        t.title.toLowerCase().includes(q) || t.issuer.toLowerCase().includes(q) || t.id.toLowerCase().includes(q)
      );
    }
    return base;
  }, [tenders, activeView, searchQuery]);

  const handleStatusChange = useCallback(async (id: string, status: string) => {
    if (currentUser.role === 'viewer') return;
    
    // Al tener Sort Key 'date', necesitamos encontrar la fecha del ítem para poder actualizarlo
    const tenderToUpdate = tenders.find(t => t.id === id);
    if (!tenderToUpdate) return;
    const date = tenderToUpdate.date;

    const originalTenders = [...tenders];
    setTenders(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    setSyncStatus('syncing');
    setErrorMessage(null);

    try {
      // Enviamos ID y DATE (Sort Key) al servicio
      await apiService.updateTender(id, date, { status });
      setSyncStatus('synced');
    } catch (err: any) {
      console.error("Fallo en la actualización de DynamoDB:", err);
      setSyncStatus('error');
      setErrorMessage(err.message);
      setTenders(originalTenders);
    }
  }, [tenders, currentUser]);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 overflow-hidden relative">
      <Sidebar activeView={activeView} onViewChange={setActiveView} counts={counts} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} currentUser={currentUser} />

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-3 flex-1 max-w-xl">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-slate-500 rounded-lg"><Menu size={20} /></button>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Buscar por ID, título o emisor..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-4 ml-4">
            <div className={`hidden sm:flex items-center gap-2 px-3 py-1 border rounded-full text-[10px] font-bold uppercase tracking-wider ${
                syncStatus === 'synced' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' :
                syncStatus === 'syncing' ? 'bg-indigo-50 border-indigo-100 text-indigo-700' :
                'bg-rose-50 border-rose-100 text-rose-700'
              }`}>
              {syncStatus === 'synced' ? <CloudCheck size={14} /> : syncStatus === 'syncing' ? <RefreshCw size={14} className="animate-spin" /> : <AlertCircle size={14} />}
              {syncStatus === 'synced' ? 'Sincronizado' : syncStatus === 'syncing' ? 'Enviando...' : 'Error de Clave'}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            {errorMessage && (
              <div className="mb-6 p-5 bg-rose-50 dark:bg-rose-900/10 border border-rose-200 dark:border-rose-900/30 rounded-2xl flex items-start gap-4 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
                <AlertCircle size={20} className="text-rose-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-bold text-rose-800 dark:text-rose-400 mb-1">Error de Esquema de Clave Compuesta</p>
                  <p className="text-xs text-rose-700 dark:text-rose-300 font-mono leading-relaxed">{errorMessage}</p>
                  <div className="mt-3 p-3 bg-white/50 dark:bg-black/20 rounded-lg text-[11px] text-rose-600 dark:text-rose-400 leading-normal">
                    <strong>Tip del Senior:</strong> Has confirmado que la tabla tiene una <strong>Sort Key</strong> llamada <code>date</code>. 
                    Ahora el frontend está enviando tanto el <code>id</code> como el <code>date</code>. 
                    Asegúrate de que tu Lambda recoja <code>event.queryStringParameters.date</code> y lo incluya en el objeto <code>Key</code> del comando de DynamoDB.
                  </div>
                </div>
                <button onClick={() => setErrorMessage(null)} className="p-1 hover:bg-rose-100 dark:hover:bg-rose-900/40 rounded transition-colors text-rose-400">
                  <XCircle size={18} />
                </button>
              </div>
            )}

            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight capitalize">
                  {activeView}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Mostrando {filteredTenders.length} licitaciones.
                </p>
              </div>
              <button 
                onClick={() => loadData(true)} 
                className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
                title="Sincronizar ahora"
              >
                <RefreshCw size={16} className={`${isLoading ? 'animate-spin' : ''} text-slate-600 dark:text-slate-400`} />
              </button>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-56 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse" />)}
              </div>
            ) : activeView === 'users' ? (
              <UserManagement users={users} currentUser={currentUser} onSwitchUser={setCurrentUser} onUpdateRole={(uid, r) => setUsers(prev => prev.map(u => u.id === uid ? {...u, role: r} : u))} />
            ) : activeView === 'settings' ? (
              <Settings theme={theme} onThemeToggle={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')} />
            ) : filteredTenders.length === 0 ? (
              <div className="py-24 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                   <InboxIcon size={32} className="text-slate-300 dark:text-slate-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-400 dark:text-slate-600">No hay licitaciones aquí</h3>
                <p className="text-sm text-slate-400 mt-1">Intenta con otra vista o cambia los filtros de búsqueda.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-24">
                {filteredTenders.map((tender) => (
                  <TenderCard key={tender.id} tender={tender} onAction={handleStatusChange} onClick={setSelectedTender} userRole={currentUser.role} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {selectedTender && (
        <TenderDetail 
          tender={selectedTender} 
          onClose={() => setSelectedTender(null)} 
          onAction={handleStatusChange} 
          userRole={currentUser.role} 
        />
      )}
    </div>
  );
};

export default App;
