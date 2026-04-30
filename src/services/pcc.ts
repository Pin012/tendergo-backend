import { Env, TenderSearchItem } from '../types';
import { fetchWithRetry } from '../utils/http';
import { ParserService } from './parser';

export class PCCService {
  constructor(private env: Env) {}

  async search(query: string): Promise<TenderSearchItem[]> {
    const trimmedQuery = query.trim().substring(0, 50);
    const url = `${this.env.PCC_BASE_URL}/prkms/tender/common/noticeAll/search?searchType=basic&keyword=${encodeURIComponent(trimmedQuery)}`;
    
    const html = await fetchWithRetry(url);
    const items = ParserService.parseSearchList(html, this.env.PCC_BASE_URL);
    return items;
  }

  async getDetail(tenderId: string): Promise<TenderSearchItem | null> {
    // First, find the item to get notice date and other info from search or direct query
    // In a real scenario, we might have a specific ID endpoint, but PCC often uses multi-step
    // Here we search by ID to get the initial metadata and URL
    const results = await this.search(tenderId);
    if (results.length === 0) return null;
    
    const item = results[0]; // Assume first exact match or closest
    
    if (item.awardStatus === '已決標' && item.tenderUrl) {
      try {
        const detailHtml = await fetchWithRetry(item.tenderUrl);
        item.supplierName = ParserService.parseDetailSupplier(detailHtml);
      } catch (err) {
        console.error('Failed to fetch detail for supplier name:', err);
        item.supplierName = ''; // Default as per requirement
      }
    }
    
    return item;
  }
}
