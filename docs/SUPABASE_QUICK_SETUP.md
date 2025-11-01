# 🎯 Quick Supabase Setup Guide

## 1️⃣ Tạo Supabase Project (2 phút)

1. **Truy cập**: https://supabase.com → Sign up
2. **New Project**:
   - Name: `lai-rai-restaurant`
   - Password: Tạo password mạnh → **LƯU LẠI**
   - Region: `Southeast Asia (Singapore)`
   - Plan: Free
3. Đợi 2-3 phút setup xong

## 2️⃣ Lấy Connection String (30 giây)

1. Settings (⚙️) → Database
2. Connection string → URI tab
3. Copy URL:
   ```
   postgresql://postgres.[ref]:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
   ```
4. **QUAN TRỌNG**: Thay `[PASSWORD]` bằng password thật

## 3️⃣ Update .env (10 giây)

```bash
# Mở file .env
code .env
```

Thay đổi:
```env
# DATABASE_URL=postgresql://postgres:password@localhost:5432/lai_rai
DATABASE_URL=postgresql://postgres.[ref]:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

## 4️⃣ Test Connection (10 giây)

```bash
npm run test:db
```

Nếu thấy:
```
✅ Database connection successful!
```
→ OK! Tiếp tục bước 5

## 5️⃣ Run Migration (30 giây)

**Cách 1: Qua Supabase UI (KHUYẾN NGHỊ)**
1. Supabase Dashboard → SQL Editor
2. New query
3. Copy nội dung từ `database/setup.sql`
4. Paste và Run
5. Xem message: `Database setup completed successfully!`

**Cách 2: Qua psql**
```bash
psql "YOUR_CONNECTION_STRING_HERE" -f database/setup.sql
```

## 6️⃣ Verify (1 phút)

### Qua UI:
Supabase → Table Editor → Thấy 5 tables

### Qua API:
```bash
npm run dev

# Terminal khác:
curl http://localhost:3000/api/v1/tables
curl http://localhost:3000/api/v1/menu-items
```

## ✅ Done!

Migration hoàn tất! Database đã lên Supabase.

---

## 🚨 Troubleshooting

### Lỗi connection timeout
- Thử port 5432 thay vì 6543
- Check firewall/antivirus

### Lỗi password authentication
- Supabase → Settings → Database → Reset password
- Update lại `.env`

### Tables không có data
- Chạy lại migration script (Bước 5)

---

## 📖 Chi Tiết Đầy Đủ

Xem: `docs/SUPABASE_MIGRATION.md`

---

## 🔐 Security Checklist

- [ ] `.env` có trong `.gitignore`
- [ ] Password mạnh (12+ ký tự)
- [ ] Connection string không commit lên Git
- [ ] Backup connection string ở nơi an toàn

---

**Tổng thời gian: ~5 phút** ⏱️
