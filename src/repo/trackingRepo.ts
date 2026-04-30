import { Env, TrackingItem } from '../types';

export class TrackingRepo {
  constructor(private env: Env) {}

  async add(item: Omit<TrackingItem, 'createdAt'>): Promise<boolean> {
    const createdAt = new Date().toISOString();
    try {
      await this.env.DB.prepare(
        'INSERT OR IGNORE INTO tracking (tender_id, title, org_name, end_date, tender_url, created_at) VALUES (?, ?, ?, ?, ?, ?)'
      )
      .bind(item.tenderId, item.title, item.orgName, item.endDate, item.tenderUrl, createdAt)
      .run();
      return true;
    } catch (err) {
      console.error('D1 Error injecting tracking:', err);
      return false;
    }
  }

  async getAll(): Promise<TrackingItem[]> {
    const { results } = await this.env.DB.prepare(
      'SELECT tender_id as tenderId, title, org_name as orgName, end_date as endDate, tender_url as tenderUrl, created_at as createdAt FROM tracking ORDER BY created_at DESC'
    ).all<TrackingItem>();
    
    return results || [];
  }
}
