# ✅ Supabase Migration Checklist

Print this and check off as you go! ✓

---

## 📝 Pre-Migration

- [ ] Backup current database (if any)
- [ ] Have Supabase account ready
- [ ] Project code is committed to Git
- [ ] `.env` is in `.gitignore`

---

## 🚀 Migration Steps

### 1. Create Supabase Project
- [ ] Go to https://supabase.com
- [ ] Click "New Project"
- [ ] Name: `lai-rai-restaurant`
- [ ] **Create strong password** → Write it here: `________________`
- [ ] Region: Southeast Asia (Singapore)
- [ ] Click "Create" → Wait 2-3 minutes

### 2. Get Connection String
- [ ] Settings → Database → Connection string → URI
- [ ] Copy the connection string
- [ ] Replace `[YOUR-PASSWORD]` with real password
- [ ] Write connection string here (or save securely):
  ```
  postgresql://postgres.____________:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
  ```

### 3. Update Local Project
- [ ] Open `.env` file
- [ ] Comment old DATABASE_URL
- [ ] Paste Supabase connection string
- [ ] Save file

### 4. Update Code (Already done ✓)
- [x] File `src/db/pool.ts` supports SSL
- [x] Auto-detects Supabase vs Local

### 5. Test Connection
- [ ] Run: `npm run test:db`
- [ ] See: "✅ Database connection successful!"
- [ ] If error → Check connection string & password

### 6. Run Migration
- [ ] Supabase Dashboard → SQL Editor
- [ ] Click "New query"
- [ ] Copy content from `database/setup.sql`
- [ ] Paste and click "Run"
- [ ] See: "Database setup completed successfully!"

### 7. Verify Migration
- [ ] Supabase → Table Editor
- [ ] See 5 tables: tables, menu_items, orders, order_items, payments
- [ ] `tables` has 10 rows
- [ ] `menu_items` has 16 rows

### 8. Test API
- [ ] Run: `npm run dev`
- [ ] Test: `curl http://localhost:3000/health`
- [ ] Test: `curl http://localhost:3000/api/v1/tables`
- [ ] Test: `curl http://localhost:3000/api/v1/menu-items`
- [ ] All return JSON successfully

### 9. Test Complete Flow
- [ ] Create order (POST /api/v1/orders)
- [ ] View order (GET /api/v1/orders/:id)
- [ ] Process payment (POST /api/v1/payments)
- [ ] Check table status changed
- [ ] All work correctly

---

## 🔐 Security

- [ ] `.env` file is NOT committed to Git
- [ ] Connection string saved securely (password manager)
- [ ] Database password is strong (12+ chars)
- [ ] Supabase account has 2FA enabled (optional but recommended)

---

## 📊 Post-Migration

- [ ] Check Supabase Reports → Database usage
- [ ] Note: Free tier = 500MB database, 5GB bandwidth/month
- [ ] Download manual backup (Settings → Database → Download backup)
- [ ] Save backup to Google Drive/Dropbox
- [ ] Document connection details in team wiki/docs

---

## 🎉 Success Criteria

All must be ✓:
- [ ] Server starts without errors
- [ ] Database connection successful
- [ ] All 5 tables exist with correct data
- [ ] All API endpoints work
- [ ] Can create order → payment → table resets
- [ ] Logs show "Connected to PostgreSQL (Supabase)"

---

## 📞 Help Resources

If stuck:
- 📖 Full guide: `docs/SUPABASE_MIGRATION.md`
- ⚡ Quick guide: `docs/SUPABASE_QUICK_SETUP.md`
- 🖼️ Visual guide: `docs/SUPABASE_VISUAL_GUIDE.md`
- 🌐 Supabase docs: https://supabase.com/docs
- 💬 Discord: https://discord.supabase.com

---

## 🐛 Troubleshooting Quick Fixes

**Connection timeout?**
→ Check internet, try port 5432 instead of 6543

**Password error?**
→ Settings → Database → Reset password → Update .env

**No tables?**
→ Re-run migration in SQL Editor

**SSL error?**
→ Check `src/db/pool.ts` has SSL config

---

**Estimated Time:** 5-10 minutes ⏱️

**Difficulty:** Easy 🟢

---

Date completed: ____ / ____ / ________

Migration done by: ________________________

Notes:
_____________________________________________
_____________________________________________
_____________________________________________
