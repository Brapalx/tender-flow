
import React from 'react';
import { User, UserRole } from '../types';
import { Button } from './Button';
import { Shield, ShieldAlert, ShieldCheck, Mail, LogIn } from 'lucide-react';

interface UserManagementProps {
  users: User[];
  currentUser: User;
  onSwitchUser: (user: User) => void;
  onUpdateRole: (userId: string, role: UserRole) => void;
}

export const UserManagement: React.FC<UserManagementProps> = ({
  users,
  currentUser,
  onSwitchUser,
  onUpdateRole
}) => {
  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'admin': return <ShieldAlert size={16} className="text-rose-500" />;
      case 'editor': return <ShieldCheck size={16} className="text-indigo-500" />;
      case 'viewer': return <Shield size={16} className="text-slate-400" />;
    }
  };

  const getRoleStyles = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'editor': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'viewer': return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const canManageRoles = currentUser.role === 'admin';

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Usuario</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Permisos</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => (
                <tr key={user.id} className={`${currentUser.id === user.id ? 'bg-indigo-50/30' : 'hover:bg-slate-50/50'} transition-colors`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden flex-shrink-0">
                        <img src={user.avatar} alt={user.name} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 flex items-center gap-2">
                          {user.name}
                          {currentUser.id === user.id && (
                            <span className="text-[9px] px-1.5 py-0.5 bg-indigo-600 text-white rounded-full">TÚ</span>
                          )}
                        </p>
                        <p className="text-[10px] text-slate-500">ID: {user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Mail size={14} className="text-slate-300" />
                      {user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {canManageRoles ? (
                      <select 
                        value={user.role}
                        onChange={(e) => onUpdateRole(user.id, e.target.value as UserRole)}
                        className={`text-xs font-bold py-1 px-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${getRoleStyles(user.role)}`}
                      >
                        <option value="admin">Administrador</option>
                        <option value="editor">Editor</option>
                        <option value="viewer">Lector</option>
                      </select>
                    ) : (
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${getRoleStyles(user.role)}`}>
                        {getRoleIcon(user.role)}
                        <span className="capitalize">{user.role}</span>
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button 
                      variant={currentUser.id === user.id ? 'ghost' : 'secondary'} 
                      size="sm"
                      onClick={() => onSwitchUser(user)}
                      disabled={currentUser.id === user.id}
                      className="gap-2"
                    >
                      <LogIn size={14} />
                      {currentUser.id === user.id ? 'Activo' : 'Suplantar'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-3">
        <Shield size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-bold text-amber-900">Nota sobre Permisos</p>
          <ul className="mt-1 space-y-1 text-[11px] text-amber-700 leading-tight">
            <li>• <strong>Administrador:</strong> Acceso total, puede cambiar roles de otros usuarios.</li>
            <li>• <strong>Editor:</strong> Puede mover licitaciones y gestionar etiquetas, pero no roles.</li>
            <li>• <strong>Lector:</strong> Acceso de solo lectura. No puede cambiar estados ni etiquetas.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
