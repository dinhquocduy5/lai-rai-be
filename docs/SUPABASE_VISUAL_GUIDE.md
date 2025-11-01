# 📸 Supabase Migration - Visual Guide

## 🎯 Step-by-Step với Screenshots

### Step 1: Tạo Supabase Account
```
https://supabase.com
├── Click "Start your project"
├── Sign up with GitHub/Email
└── Verify email
```

### Step 2: Create New Project
```
Dashboard (https://app.supabase.com)
├── Click "New Project"
├── Fill form:
│   ├── Name: lai-rai-restaurant
│   ├── Password: [Create strong password] ⚠️ SAVE THIS!
│   ├── Region: Southeast Asia (Singapore)
│   └── Plan: Free
└── Click "Create new project" → Wait 2-3 minutes
```

### Step 3: Get Connection String
```
Project Dashboard
├── Click ⚙️ "Settings" (sidebar)
├── Click "Database"
├── Scroll to "Connection string"
├── Select "URI" tab
└── Copy:
    postgresql://postgres.[ref]:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
    
⚠️ IMPORTANT: Replace [YOUR-PASSWORD] with actual password from Step 2
```

### Step 4: Update Local Project
```
Your Project
├── Open .env file
├── Comment out old DATABASE_URL
├── Add Supabase URL:
│   # DATABASE_URL=postgresql://localhost:5432/lai_rai
│   DATABASE_URL=postgresql://postgres.[ref]:[pass]@...supabase.com:6543/postgres
└── Save file
```

### Step 5: Test Connection
```bash
Terminal
├── Run: npm run test:db
└── Expected output:
    🔍 Testing database connection...
    ✅ Database connection successful!
    ⏰ Server time: 2025-11-01...
    📦 PostgreSQL version: PostgreSQL 15.x
```

### Step 6: Run Migration
```
Supabase Dashboard
├── Click "SQL Editor" (sidebar)
├── Click "New query"
├── Open database/setup.sql in your project
├── Copy ALL content
├── Paste into Supabase SQL Editor
├── Click "Run" button (or Ctrl+Enter)
└── Wait ~5-10 seconds → See "Database setup completed successfully!"
```

### Step 7: Verify Tables
```
Supabase Dashboard
├── Click "Table Editor" (sidebar)
└── You should see 5 tables:
    ├── ✅ tables (10 rows)
    ├── ✅ menu_items (16 rows)
    ├── ✅ orders (0 rows)
    ├── ✅ order_items (0 rows)
    └── ✅ payments (0 rows)
```

### Step 8: Test API
```bash
Terminal 1
└── Run: npm run dev

Terminal 2 (new window)
├── curl http://localhost:3000/health
├── curl http://localhost:3000/api/v1/tables
└── curl http://localhost:3000/api/v1/menu-items
```

---

## 🎯 Connection String Format Explained

```
postgresql://postgres.[project-ref]:[password]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
           │            │            │        │                                                  │      │
           │            │            │        │                                                  │      └─ Database name
           │            │            │        │                                                  └──────── Port (6543 = pooler, 5432 = direct)
           │            │            │        └───────────────────────────────────────────────────────── Host (region-based)
           │            │            └────────────────────────────────────────────────────────────────── Your password (from Step 2)
           │            └─────────────────────────────────────────────────────────────────────────────── Project reference ID
           └──────────────────────────────────────────────────────────────────────────────────────────── Username (always "postgres")
```

**Important Notes:**
- `[project-ref]` is unique to your project (e.g., `abcdefghij`)
- `[password]` must be URL-encoded if contains special characters
- Port `6543` = connection pooler (recommended)
- Port `5432` = direct connection (limited to 60 concurrent)

---

## 🔍 Where to Find What

### Connection String:
```
Supabase Dashboard → Settings → Database → Connection string (URI)
```

### Database Password:
```
Settings → Database → Database Settings → Reset Database Password
```

### Project ID:
```
Settings → General → Reference ID
```

### Database Version:
```
Settings → Database → Database version
```

### API URL (nếu cần):
```
Settings → API → URL
```

### API Keys (nếu cần):
```
Settings → API → Project API keys
```

---

## 📊 Supabase Dashboard Tour

```
Sidebar Menu:
├── 🏠 Home - Project overview
├── 📊 Table Editor - View/edit data visually
├── 🔍 SQL Editor - Run custom SQL queries
├── 🔐 Authentication - User management (not needed for internal app)
├── 📦 Storage - File storage (not needed now)
├── 💾 Database - Schema, functions, triggers
├── 📈 Reports - Usage & performance
└── ⚙️ Settings
    ├── General - Project info
    ├── Database - Connection strings, pooling
    ├── API - API URLs & keys
    └── Billing - Usage & limits
```

---

## ✅ Verification Checklist

After migration, verify:

- [ ] ✅ Connection test passes (`npm run test:db`)
- [ ] ✅ Server starts without errors (`npm run dev`)
- [ ] ✅ Health check works (`curl http://localhost:3000/health`)
- [ ] ✅ Database health check works (`curl .../health/db`)
- [ ] ✅ See 5 tables in Supabase Table Editor
- [ ] ✅ Tables have 10 rows
- [ ] ✅ Menu items have 16 rows
- [ ] ✅ Can create order via API
- [ ] ✅ Can view order via API
- [ ] ✅ Can process payment via API
- [ ] ✅ Table status changes correctly
- [ ] ✅ `.env` file is in `.gitignore`

---

## 🎓 Understanding Supabase Pooler

**What is it?**
- Connection pooler sits between your app and database
- Manages connections efficiently
- Allows more concurrent users

**Ports:**
- `6543` - Pooler mode (session mode) - **Use this**
- `5432` - Direct connection - Limited to 60 concurrent

**Why use pooler?**
- ✅ Better performance
- ✅ More concurrent connections
- ✅ Automatic connection management
- ✅ No connection limit issues

---

## 💡 Pro Tips

1. **Save connection string securely**
   - Use password manager (1Password, LastPass, etc.)
   - Don't commit to Git
   - Use environment variables in production

2. **Monitor usage**
   - Check Supabase Reports weekly
   - Free tier: 500MB database, 5GB bandwidth/month
   - Set up alerts if approaching limits

3. **Backup strategy**
   - Supabase does daily backups (7 days retention)
   - Download manual backup monthly
   - Store in Google Drive/Dropbox

4. **Security**
   - Use strong password (12+ characters)
   - Enable 2FA on Supabase account
   - Rotate password every 3-6 months

5. **Performance**
   - Use indexes (already in setup.sql)
   - Monitor slow queries in SQL Editor
   - Keep connection pool size reasonable (10-20)

---

## 🆘 Common Issues & Solutions

### Issue: "Error: getaddrinfo ENOTFOUND"
**Cause:** Wrong host in connection string
**Fix:** Copy connection string again from Supabase, check for typos

### Issue: "password authentication failed"
**Cause:** Wrong password
**Fix:** 
1. Supabase → Settings → Database
2. Reset database password
3. Update `.env`
4. Restart server

### Issue: "SSL connection required"
**Cause:** SSL not enabled in code
**Fix:** Already handled in `src/db/pool.ts`, check SSL config

### Issue: "too many clients"
**Cause:** Too many connections
**Fix:** 
- Use port 6543 (pooler) instead of 5432
- Reduce pool max size if needed
- Restart server to clear connections

### Issue: Tables empty after migration
**Cause:** Migration script didn't run completely
**Fix:** Re-run migration in SQL Editor

### Issue: Cannot connect from office/school network
**Cause:** Firewall blocking Supabase
**Fix:** 
- Try mobile hotspot
- Contact IT to whitelist supabase.com
- Use VPN if allowed

---

**📞 Need Help?**
- Detailed guide: `docs/SUPABASE_MIGRATION.md`
- Quick setup: `docs/SUPABASE_QUICK_SETUP.md`
- Supabase Docs: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com
