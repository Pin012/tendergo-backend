export interface Env {
  DB: D1Database;
  CORS_ORIGIN: string;
  PCC_BASE_URL: string;
}

export interface TenderSearchItem {
  tenderId: string;
  title: string;
  orgName: string;
  noticeDate: string;
  endDate: string;
  awardStatus: string;
  supplierName: string;
  tenderUrl: string;
}

export interface TrackingItem {
  tenderId: string;
  title: string;
  orgName: string;
  endDate: string;
  tenderUrl: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  ok: boolean;
  items?: T[];
  item?: T;
  error?: {
    code: string;
    message: string;
  };
}
