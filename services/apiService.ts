
import { Tender } from "../types";

const AWS_API_ENDPOINT = "https://52o7edk3z7.execute-api.us-east-1.amazonaws.com/prod/tenders";

const isPlaceholder = (url: string) => 
  !url || url.includes("your-api-id") || url.includes("example.com") || url === "";

export const apiService = {
  /**
   * Normaliza el objeto Tender asegurando que el campo 'id' sea el principal.
   */
  normalizeTender(item: any): Tender {
    if (!item) return {} as Tender;
    const id = item.id || item.seace_id || item.ID;
    return {
      ...item,
      id: String(id),
      status: item.status || 'new'
    } as Tender;
  },

  async getTenders(): Promise<Tender[]> {
    if (isPlaceholder(AWS_API_ENDPOINT)) return this.getFromCache();

    try {
      const response = await fetch(AWS_API_ENDPOINT, { 
        method: 'GET',
        mode: 'cors'
      });
      
      const data = await response.json();
      const items = Array.isArray(data) ? data : (data.body ? JSON.parse(data.body) : data);

      if (Array.isArray(items)) {
        const normalized = items.map(item => this.normalizeTender(item));
        this.saveToCache(normalized);
        return normalized;
      }
      
      return this.getFromCache();
    } catch (error) {
      console.error("Error al obtener licitaciones:", error);
      return this.getFromCache();
    }
  },

  /**
   * Actualiza una licitación usando ID (Partition Key) y DATE (Sort Key).
   */
  async updateTender(id: string, date: string, updates: Partial<Tender>): Promise<Tender> {
    if (isPlaceholder(AWS_API_ENDPOINT)) return { id, ...updates } as Tender;

    const cleanUpdates = { ...updates };
    const keysToRemove = ['id', 'seace_id', 'ID', 'Id', 'date'];
    keysToRemove.forEach(k => delete (cleanUpdates as any)[k]);

    try {
      // Enviamos la Sort Key como query param: ?date=...
      const url = `${AWS_API_ENDPOINT}/${encodeURIComponent(id)}?date=${encodeURIComponent(date)}`;
      
      const response = await fetch(url, {
        method: "PATCH",
        mode: 'cors',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanUpdates),
      });
      
      const data = await response.json();
      
      // Manejar respuesta de API Gateway / Lambda Proxy
      const result = data && data.body ? JSON.parse(data.body) : data;

      if (!response.ok) {
        const errorDetail = result?.error || result?.message || response.statusText;
        throw new Error(errorDetail);
      }
      
      return this.normalizeTender(result || { id, date, ...updates });
    } catch (error: any) {
      console.error("Error en updateTender:", error);
      throw error;
    }
  },

  saveToCache(tenders: Tender[]) {
    localStorage.setItem('tenderpulse_cache', JSON.stringify(tenders));
  },

  getFromCache(): Tender[] {
    try {
      const local = localStorage.getItem('tenderpulse_cache');
      return local ? JSON.parse(local) : [];
    } catch {
      return [];
    }
  }
};
