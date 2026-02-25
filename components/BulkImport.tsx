
import React, { useState, useRef, useCallback } from 'react';
import { Tender } from '../types';
import { Button } from './Button';
import { apiService } from '../services/apiService';
import {
  Upload,
  FileJson,
  AlertCircle,
  CheckCircle2,
  Trash2,
  X,
  ClipboardPaste,
} from 'lucide-react';

interface BulkImportProps {
  onImport: (tenders: Tender[]) => void;
}

interface ValidationError {
  index: number;
  field: string;
  message: string;
}

const REQUIRED_FIELDS: (keyof Tender)[] = ['id', 'title', 'issuer', 'description', 'date'];

function validateTenders(items: any[]): { valid: Tender[]; errors: ValidationError[] } {
  const errors: ValidationError[] = [];
  const valid: Tender[] = [];

  items.forEach((item, i) => {
    const missing = REQUIRED_FIELDS.filter(f => !item[f] && item[f] !== 0);
    if (missing.length > 0) {
      missing.forEach(field => {
        errors.push({ index: i, field, message: `Campo requerido "${field}" falta` });
      });
      return;
    }
    valid.push({
      id: String(item.id || item.seace_id || item.ID),
      title: String(item.title),
      issuer: String(item.issuer),
      description: String(item.description),
      value: String(item.value || ''),
      date: String(item.date),
      status: item.status || 'new',
    });
  });

  return { valid, errors };
}

function parseInput(raw: string): { items: any[] | null; parseError: string | null } {
  const trimmed = raw.trim();
  if (!trimmed) return { items: null, parseError: null };

  try {
    const parsed = JSON.parse(trimmed);
    const items = Array.isArray(parsed) ? parsed : [parsed];
    return { items, parseError: null };
  } catch (e: any) {
    return { items: null, parseError: `JSON inválido: ${e.message}` };
  }
}

export const BulkImport: React.FC<BulkImportProps> = ({ onImport }) => {
  const [rawInput, setRawInput] = useState('');
  const [preview, setPreview] = useState<Tender[]>([]);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [importStatus, setImportStatus] = useState<'idle' | 'importing' | 'done' | 'error'>('idle');
  const [importedCount, setImportedCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processInput = useCallback((text: string) => {
    setRawInput(text);
    setImportStatus('idle');

    const { items, parseError: pe } = parseInput(text);
    if (pe) {
      setParseError(pe);
      setPreview([]);
      setErrors([]);
      return;
    }
    if (!items) {
      setParseError(null);
      setPreview([]);
      setErrors([]);
      return;
    }

    setParseError(null);
    const { valid, errors: validationErrors } = validateTenders(items);
    setPreview(valid);
    setErrors(validationErrors);
  }, []);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      processInput(text);
    };
    reader.readAsText(file);
    e.target.value = '';
  }, [processInput]);

  const handlePaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      processInput(text);
    } catch {
      // Fallback — the user can paste into the textarea manually
    }
  }, [processInput]);

  const handleImport = useCallback(async () => {
    if (preview.length === 0) return;
    setImportStatus('importing');
    try {
      const merged = await apiService.bulkAddTenders(preview);
      setImportedCount(preview.length);
      setImportStatus('done');
      onImport(merged);
    } catch (err: any) {
      console.error('Bulk import failed:', err);
      setImportStatus('error');
    }
  }, [preview, onImport]);

  const handleClear = useCallback(() => {
    setRawInput('');
    setPreview([]);
    setErrors([]);
    setParseError(null);
    setImportStatus('idle');
    setImportedCount(0);
  }, []);

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header / instructions */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Importar Licitaciones en Bloque</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
          Pega un array JSON o sube un archivo <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[11px]">.json</code> con licitaciones.
          Cada objeto necesita al mínimo: <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[11px]">id, title, issuer, description, date</code>.
          Los campos <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[11px]">value</code> y <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[11px]">status</code> son opcionales (status se pone "new" por defecto).
        </p>

        {/* Upload / paste buttons */}
        <div className="flex flex-wrap gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            className="hidden"
            onChange={handleFileUpload}
          />
          <Button
            variant="secondary"
            size="sm"
            className="gap-2 text-xs"
            onClick={() => fileInputRef.current?.click()}
          >
            <FileJson size={14} /> Subir archivo .json
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="gap-2 text-xs"
            onClick={handlePaste}
          >
            <ClipboardPaste size={14} /> Pegar del portapapeles
          </Button>
          {rawInput && (
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-xs text-slate-400"
              onClick={handleClear}
            >
              <X size={14} /> Limpiar
            </Button>
          )}
        </div>
      </div>

      {/* Text area */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <textarea
          className="w-full h-48 p-4 bg-transparent text-xs font-mono text-slate-700 dark:text-slate-300 resize-y outline-none placeholder:text-slate-300 dark:placeholder:text-slate-600"
          placeholder={'[\n  {\n    "id": "1234-56789",\n    "title": "Nombre de la licitación",\n    "issuer": "Entidad emisora",\n    "description": "Descripción...",\n    "value": "100.000 €",\n    "date": "2025-03-01"\n  }\n]'}
          value={rawInput}
          onChange={(e) => processInput(e.target.value)}
          spellCheck={false}
        />
      </div>

      {/* Parse error */}
      {parseError && (
        <div className="p-4 bg-rose-50 dark:bg-rose-900/10 border border-rose-200 dark:border-rose-900/30 rounded-xl flex items-start gap-3 animate-in fade-in duration-200">
          <AlertCircle size={16} className="text-rose-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-rose-700 dark:text-rose-400 font-mono">{parseError}</p>
        </div>
      )}

      {/* Validation errors */}
      {errors.length > 0 && (
        <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-xl space-y-1 animate-in fade-in duration-200">
          <p className="text-xs font-bold text-amber-800 dark:text-amber-400 mb-2">
            {errors.length} problema{errors.length !== 1 ? 's' : ''} encontrado{errors.length !== 1 ? 's' : ''}:
          </p>
          {errors.slice(0, 10).map((err, i) => (
            <p key={i} className="text-[11px] text-amber-700 dark:text-amber-300 font-mono">
              Fila {err.index + 1}: {err.message}
            </p>
          ))}
          {errors.length > 10 && (
            <p className="text-[11px] text-amber-600 dark:text-amber-400">
              ...y {errors.length - 10} más
            </p>
          )}
        </div>
      )}

      {/* Preview table */}
      {preview.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm animate-in fade-in duration-200">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              Vista previa — {preview.length} licitación{preview.length !== 1 ? 'es' : ''}
            </p>
            {importStatus === 'idle' && (
              <Button
                variant="primary"
                size="sm"
                className="gap-2 text-xs"
                onClick={handleImport}
              >
                <Upload size={14} /> Importar {preview.length}
              </Button>
            )}
            {importStatus === 'importing' && (
              <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">Importando...</span>
            )}
            {importStatus === 'done' && (
              <span className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                <CheckCircle2 size={14} /> {importedCount} importada{importedCount !== 1 ? 's' : ''}
              </span>
            )}
            {importStatus === 'error' && (
              <span className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 font-bold">
                <AlertCircle size={14} /> Error al importar
              </span>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                  <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Título</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Emisor</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Valor</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {preview.slice(0, 50).map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 text-xs font-mono text-slate-500 dark:text-slate-400">{t.id}</td>
                    <td className="px-4 py-3 text-xs text-slate-900 dark:text-white font-medium max-w-[200px] truncate">{t.title}</td>
                    <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400 max-w-[160px] truncate">{t.issuer}</td>
                    <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400">{t.value || '—'}</td>
                    <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400">{t.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {preview.length > 50 && (
              <p className="text-center text-[11px] text-slate-400 py-3 border-t border-slate-100 dark:border-slate-800">
                Mostrando 50 de {preview.length} filas
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
