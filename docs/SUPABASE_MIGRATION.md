# 🚀 Migrate Database to Supabase

## 📋 Tổng quan
Hướng dẫn chi tiết để migrate database PostgreSQL từ local lên Supabase Free Tier.

---

## 🎯 Bước 1: Setup Supabase Project

### 1.1. Tạo Supabase Account
1. Truy cập: https://supabase.com
2. Click **"Start your project"**
3. Sign up với GitHub/Email
4. Verify email (nếu cần)

### 1.2. Tạo Project Mới
1. Vào Dashboard: https://app.supabase.com
2. Click **"New Project"**
3. Điền thông tin:
   - **Name**: `lai-rai-restaurant` (hoặc tên bạn thích)
   - **Database Password**: Tạo password mạnh (LƯU LẠI password này!)
   - **Region**: Chọn `Southeast Asia (Singapore)` (gần VN nhất)
   - **Pricing Plan**: Free (đủ dùng cho internal app)
4. Click **"Create new project"**
5. Đợi ~2-3 phút để Supabase setup database

### 1.3. Lấy Database Connection String
1. Trong project dashboard, click **"Settings"** (⚙️ icon bên trái)
2. Click **"Database"** trong menu Settings
3. Scroll xuống phần **"Connection string"**
4. Chọn tab **"URI"**
5. Copy connection string có dạng:
   ```
   postgresql://postgres.[project-ref]:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
   ```
6. **QUAN TRỌNG**: Thay `[YOUR-PASSWORD]` bằng password bạn đã tạo ở bước 1.2

⚠️ **CẢNH BÁO VỀ KÝ TỰ ĐẶC BIỆT:**
Nếu password có ký tự đặc biệt (`? + & = / @ #`), bạn PHẢI URL encode:
- `?` → `%3F`
- `+` → `%2B`
- `&` → `%26`
- `=` → `%3D`
- `/` → `%2F`
- `@` → `%40`
- `#` → `%23`
- Space → `%20`

**Ví dụ:**
- Password: `Pass?word+123`
- Encoded: `Pass%3Fword%2B123`
- URL: `postgresql://postgres:Pass%3Fword%2B123@...`

💡 **Hoặc đơn giản hơn:** Reset password trong Supabase với password không có ký tự đặc biệt (chỉ dùng chữ, số, dấu gạch ngang, gạch dưới).

---

## 🔧 Bước 2: Update Local Environment

### 2.1. Backup Connection String Cũ
```bash
# Mở file .env
notepad .env

# Hoặc dùng VS Code
code .env
```

Comment dòng DATABASE_URL cũ và thêm Supabase URL:
```env
# Local PostgreSQL (backup)
# DATABASE_URL=postgresql://postgres:password@localhost:5432/lai_rai

# Supabase PostgreSQL
DATABASE_URL=postgresql://postgres.[project-ref]:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

### 2.2. Update SSL Configuration
Mở file `src/db/pool.ts` và update:

```typescript
import { Pool, type QueryConfig, type QueryResult, type QueryResultRow } from 'pg';
import { env } from '@/config/env';
import { logger } from '@/utils/logger';

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
  ssl: {
    rejectUnauthorized: false, // Supabase requires SSL
  },
});

pool.on('connect', () => logger.info('✅ Connected to PostgreSQL (Supabase)'));
pool.on('error', (err) => logger.error({ err }, '❌ Unexpected PG pool error'));

// ... rest of the code
```

**LƯU Ý**: Thay đổi duy nhất là:
- `ssl: false` → `ssl: { rejectUnauthorized: false }`
- Message: `(local)` → `(Supabase)`

---

## 📊 Bước 3: Run Database Migration

### 3.1. Test Connection Trước
```bash
# Start server để test connection
npm run dev
```

Nếu thấy log:
```
✅ Connected to PostgreSQL (Supabase)
```
→ Connection thành công! Tiếp tục bước tiếp theo.

Nếu có lỗi → Kiểm tra lại DATABASE_URL và password.

### 3.2. Chạy Migration Script

#### Cách 1: Qua Supabase SQL Editor (KHUYẾN NGHỊ)

1. Vào Supabase Dashboard
2. Click **"SQL Editor"** ở sidebar bên trái
3. Click **"New query"**
4. Mở file `database/setup.sql` trong VS Code
5. Copy TOÀN BỘ nội dung
6. Paste vào Supabase SQL Editor
7. Click **"Run"** (hoặc Ctrl+Enter)
8. Đợi ~5-10 giây
9. Kiểm tra output, phải thấy:
   ```
   Database setup completed successfully!
   ```

#### Cách 2: Qua psql Command Line

```bash
# Install psql nếu chưa có (Windows)
# Download từ: https://www.postgresql.org/download/windows/

# Run migration
psql "postgresql://postgres.[project-ref]:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres" -f database/setup.sql
```

---

## ✅ Bước 4: Verify Migration

### 4.1. Kiểm Tra Tables

**Qua Supabase UI:**
1. Vào **"Table Editor"** trong sidebar
2. Bạn sẽ thấy 5 tables:
   - `tables` (10 rows)
   - `menu_items` (16 rows)
   - `orders` (0 rows)
   - `order_items` (0 rows)
   - `payments` (0 rows)

**Qua API:**
```bash
# Test API
curl http://localhost:3000/api/v1/health/db
curl http://localhost:3000/api/v1/tables
curl http://localhost:3000/api/v1/menu-items
```

### 4.2. Test Complete Flow

1. **Get tables:**
   ```bash
   curl http://localhost:3000/api/v1/tables
   ```

2. **Create order:**
   ```bash
   curl -X POST http://localhost:3000/api/v1/orders \
     -H "Content-Type: application/json" \
     -d "{\"table_id\":1,\"items\":[{\"menu_item_id\":1,\"quantity\":2}]}"
   ```

3. **View order:**
   ```bash
   curl http://localhost:3000/api/v1/orders/1
   ```

4. **Process payment:**
   ```bash
   curl -X POST http://localhost:3000/api/v1/payments \
     -H "Content-Type: application/json" \
     -d "{\"order_id\":1,\"amount\":100000,\"payment_method\":\"cash\"}"
   ```

Nếu tất cả đều work → **MIGRATION THÀNH CÔNG!** 🎉

---

## 🔐 Bước 5: Security & Best Practices

### 5.1. Bảo Mật Connection String

**QUAN TRỌNG**: File `.env` chứa password, KHÔNG commit lên Git!

Kiểm tra `.gitignore`:
```bash
# Mở .gitignore
notepad .gitignore
```

Đảm bảo có dòng:
```
.env
.env.local
.env.*.local
```

### 5.2. Setup Environment Variables cho Production

Nếu deploy lên server, set biến môi trường thay vì dùng file `.env`:

**Railway.app:**
- Settings → Variables → Add `DATABASE_URL`

**Render.com:**
- Environment → Add Environment Variable

**Heroku:**
```bash
heroku config:set DATABASE_URL="postgresql://..."
```

---

## 📈 Bước 6: Supabase Dashboard Features

### 6.1. View Data
- **Table Editor**: Xem/edit data trực tiếp
- **SQL Editor**: Chạy custom queries
- **Database**: Xem schema, indexes, relationships

### 6.2. Monitor Performance
- **Reports**: Xem usage, query performance
- **Logs**: Xem database logs

### 6.3. Backup
Supabase Free tier có **automatic daily backups** (giữ 7 ngày gần nhất)

**Manual backup:**
1. Settings → Database → Database Settings
2. Click **"Download a backup"**

---

## 🚨 Troubleshooting

### Lỗi: "connection timeout"
**Nguyên nhân**: Network/firewall block
**Giải pháp**: 
- Thử connection string với port 5432 thay vì 6543
- Check firewall/antivirus

### Lỗi: "password authentication failed"
**Nguyên nhân**: Password sai
**Giải pháp**:
1. Vào Supabase → Settings → Database
2. Click **"Reset database password"**
3. Update lại trong `.env`

### Lỗi: "SSL required"
**Nguyên nhân**: Chưa enable SSL trong pool config
**Giải pháp**: Đã update ở Bước 2.2, check lại file `src/db/pool.ts`

### Tables không có data
**Nguyên nhân**: Migration script chưa chạy
**Giải pháp**: Chạy lại Bước 3.2

### Lỗi: "too many connections"
**Nguyên nhân**: Connection pool không được close
**Giải pháp**: Restart server, pool sẽ auto cleanup

---

## 📊 Supabase Free Tier Limits

✅ **Đủ dùng cho internal app:**
- Database: 500 MB (rất nhiều cho app quán ăn)
- Bandwidth: 5 GB/month
- Rows: Unlimited
- API requests: 500,000/month
- Concurrent connections: 60
- Daily backups: 7 days retention

---

## 🎯 Next Steps

Sau khi migrate thành công:

1. **Test kỹ toàn bộ flows**: Tạo order, update, payment, cancel
2. **Monitor usage**: Vào Supabase Reports xem usage
3. **Setup backup strategy**: Download manual backup định kỳ
4. **Deploy frontend**: Kết nối React app với API
5. **Production ready**: Deploy API lên Railway/Render

---

## 📞 Support

**Supabase Issues:**
- Docs: https://supabase.com/docs
- Discord: https://discord.supabase.com

**Database Issues:**
- Check Supabase Dashboard → Database → Logs
- Check API logs: Terminal đang chạy `npm run dev`

---

## ✅ Migration Checklist

- [ ] Tạo Supabase project
- [ ] Copy connection string
- [ ] Update `.env` file
- [ ] Update `src/db/pool.ts` (enable SSL)
- [ ] Test connection (`npm run dev`)
- [ ] Run migration script
- [ ] Verify tables exist (Table Editor)
- [ ] Verify sample data loaded
- [ ] Test API endpoints
- [ ] Test complete order flow
- [ ] Confirm `.env` in `.gitignore`
- [ ] Save connection string securely

---

**🎉 Chúc bạn migrate thành công!**

Nếu gặp vấn đề, check lại từng bước hoặc xem Troubleshooting section.
