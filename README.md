# TenderGo Backend

這是一個基於 Cloudflare Workers + TypeScript + D1 的政府標案查詢與追蹤後端。

## 1. 專案初始化

```bash
# 安裝依賴
npm install

# 生成類型定義 (worker-configuration.d.ts)
npm run cf-typegen
```

## 2. 本機開發

```bash
# 啟動開發伺服器 (預設 port 3000)
npm run dev
```

## 3. D1 建立與 Migration

```bash
# 建立 D1 資料庫 (請記錄產出的 database_id 並填入 wrangler.toml)
npx wrangler d1 create tendergo-db

# 執行本地端 Migration (本地開發用)
npx wrangler d1 migrations apply tendergo-db --local

# 執行遠端 Migration (部署前)
npx wrangler d1 migrations apply tendergo-db --remote
```

## 4. 本機測試範例 (cURL)

### 查詢標案
```bash
curl "http://localhost:3000/api/tenders/search?q=電腦"
```

### 獲取標案詳情
```bash
curl "http://localhost:3000/api/tenders/1130430-A1"
```

### 新增追蹤
```bash
curl -X POST http://localhost:3000/api/tracking \
  -H "Content-Type: application/json" \
  -d '{
    "tenderId": "1130430-A1",
    "title": "測試標案",
    "orgName": "台北市政府",
    "endDate": "2024/05/20",
    "tenderUrl": "https://web.pcc.gov.tw/..."
  }'
```

### 獲取追蹤列表
```bash
curl "http://localhost:3000/api/tracking"
```

## 5. 部署到 Cloudflare Workers

1.  確保 `wrangler.toml` 中的 `database_id` 已正確填寫。
2.  執行部署指令：
    ```bash
    npm run deploy
    ```

## 6. 綁定自定義網域

1.  登入 Cloudflare Dashboard。
2.  進入 Workers & Pages -> tendergo-backend -> Triggers。
3.  在 **Custom Domains** 欄位點擊 "Add Custom Domain"。
4.  輸入 `api.tendergo.tw`。

## 7. 常見錯誤排查

*   **CORS**: 確保前端請求來自 `https://tendergo-taiwan.pages.dev`。若需測試非瀏覽器請求，請檢查 Header `Origin`。
*   **D1 binding**: 若出現 `DB is undefined`，代表 `wrangler.toml` 的 binding 名稱與代碼中 `Env.DB` 不一致。
*   **PCC Timeout**: `web.pcc.gov.tw` 有時回應較慢，已實作 15s Timeout 與 2 次自動重試（Retry）。
