# 🍽️ Lai Rai Restaurant API

Backend API cho hệ thống quản lý quán ăn tại chỗ.

## 🚀 Tính năng

### ✅ Đã hoàn thành
- **Tables Management**: CRUD bàn ăn, cập nhật trạng thái
- **Menu Management**: CRUD món ăn, phân loại food/drink
- **Orders Management**: Tạo đơn, cập nhật món, hủy đơn
- **Payment Processing**: Thanh toán tiền mặt, báo cáo doanh thu
- **Error Handling**: Xử lý lỗi toàn cục với PostgreSQL error codes
- **Validation**: Validate input tất cả endpoints
- **Logging**: Request/response logging với Pino
- **Security**: Helmet, CORS

## 📦 Tech Stack

- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js 5
- **Database**: PostgreSQL (Supabase)
- **Logging**: Pino + Pino Pretty
- **Security**: Helmet, CORS

## 🛠️ Setup

### 1. Clone & Install
```bash
git clone <repository-url>
cd lai-rai-be
npm install
```

### 2. Environment Variables
```bash
cp .env.example .env
```

Cập nhật `.env`:

**Option A: Local PostgreSQL**
```env
NODE_ENV=development
PORT=3000
LOG_LEVEL=debug
DATABASE_URL=postgresql://user:password@localhost:5432/lai-rai
```

**Option B: Supabase (Recommended)**
```env
NODE_ENV=development
PORT=3000
LOG_LEVEL=debug
DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

📖 **Migrate to Supabase**: See `docs/SUPABASE_MIGRATION.md` for detailed guide

### 3. Database Setup

**Local PostgreSQL:**
```bash
psql -U postgres -c "CREATE DATABASE lai_rai"
psql -U postgres -d lai_rai -f database/setup.sql
```

**Supabase:**
See `docs/SUPABASE_QUICK_SETUP.md` (5 minutes setup)

### 4. Test Database Connection
```bash
npm run test:db
```

### 5. Run Development
```bash
npm run dev
```

Server chạy tại: `http://localhost:3000`

### 6. Build Production
```bash
npm run build
npm start
```

## 📊 Database Schema

```sql
-- Tables
CREATE TABLE tables (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  status VARCHAR(20) CHECK (status IN ('available', 'occupied')) DEFAULT 'available'
);

-- Menu Items
CREATE TABLE menu_items (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  type VARCHAR(10) CHECK (type IN ('food', 'drink'))
);

-- Orders
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  table_id INTEGER REFERENCES tables(id),
  check_in TIMESTAMP NOT NULL DEFAULT NOW(),
  check_out TIMESTAMP,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled'))
);

-- Order Items
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  menu_item_id INTEGER REFERENCES menu_items(id),
  quantity INTEGER NOT NULL,
  price_at_order_time NUMERIC(10,2) NOT NULL,
  note TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Payments
CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  amount NUMERIC(10,2) NOT NULL,
  paid_at TIMESTAMP DEFAULT NOW(),
  payment_method VARCHAR(10) CHECK (payment_method = 'cash')
);
```

## 🔌 API Endpoints

### Health Check
- `GET /health` - Server health
- `GET /api/v1/health` - API health
- `GET /api/v1/health/db` - Database health

### Tables
- `GET /api/v1/tables` - Lấy tất cả bàn
- `GET /api/v1/tables/:id` - Lấy chi tiết bàn
- `POST /api/v1/tables` - Tạo bàn mới
- `PUT /api/v1/tables/:id` - Cập nhật bàn
- `DELETE /api/v1/tables/:id` - Xóa bàn
- `PATCH /api/v1/tables/:id/available` - Đặt bàn thành available
- `PATCH /api/v1/tables/:id/occupied` - Đặt bàn thành occupied

### Menu Items
- `GET /api/v1/menu-items` - Lấy tất cả món (query: ?type=food|drink)
- `GET /api/v1/menu-items/:id` - Lấy chi tiết món
- `POST /api/v1/menu-items` - Tạo món mới
- `PUT /api/v1/menu-items/:id` - Cập nhật món
- `DELETE /api/v1/menu-items/:id` - Xóa món

### Orders
- `GET /api/v1/orders` - Lấy tất cả đơn
- `GET /api/v1/orders/:id` - Lấy chi tiết đơn
- `GET /api/v1/orders/table/:tableId` - Lấy đơn theo bàn
- `GET /api/v1/orders/table/:tableId/active` - Lấy đơn đang active của bàn
- `POST /api/v1/orders` - Tạo đơn mới
- `PUT /api/v1/orders/:id/items` - Cập nhật món trong đơn
- `POST /api/v1/orders/:id/cancel` - Hủy đơn

### Payments
- `GET /api/v1/payments` - Lấy tất cả thanh toán
- `GET /api/v1/payments/revenue` - Báo cáo doanh thu (query: ?start_date=2025-01-01&end_date=2025-01-31)
- `GET /api/v1/payments/:id` - Lấy chi tiết thanh toán
- `GET /api/v1/payments/order/:orderId` - Lấy thanh toán theo đơn
- `POST /api/v1/payments` - Tạo thanh toán mới

## 📝 API Examples

### 1. Tạo bàn
```bash
POST /api/v1/tables
{
  "name": "Bàn 1",
  "status": "available"
}
```

### 2. Tạo món ăn
```bash
POST /api/v1/menu-items
{
  "name": "Phở bò",
  "price": 50000,
  "type": "food"
}
```

### 3. Tạo đơn hàng
```bash
POST /api/v1/orders
{
  "table_id": 1,
  "items": [
    {
      "menu_item_id": 1,
      "quantity": 2,
      "note": "Ít hành"
    },
    {
      "menu_item_id": 2,
      "quantity": 1
    }
  ]
}
```

### 4. Cập nhật món trong đơn
```bash
PUT /api/v1/orders/1/items
{
  "items": [
    {
      "menu_item_id": 1,
      "quantity": 3,
      "note": "Thêm rau"
    }
  ]
}
```

### 5. Thanh toán
```bash
POST /api/v1/payments
{
  "order_id": 1,
  "amount": 150000,
  "payment_method": "cash"
}
```

## 🏗️ Project Structure

```
src/
├── config/          # Configuration (env)
├── controllers/     # Request handlers
├── db/             # Database connection
├── loaders/        # Express app setup
├── middlewares/    # Error handling, validation, logging
├── models/         # TypeScript interfaces
├── repositories/   # Database queries
├── routes/         # API routes
├── services/       # Business logic
└── utils/          # Utilities (logger, errors)
```

## 🔄 Business Flow

1. **Chọn bàn** → `GET /api/v1/tables`
2. **Đặt món** → `POST /api/v1/orders` (bàn chuyển sang `occupied`)
3. **Đặt thêm món** → `PUT /api/v1/orders/:id/items`
4. **Tạm tính** → `GET /api/v1/orders/:id`
5. **Thanh toán** → `POST /api/v1/payments` (bàn về `available`, in bill)
6. **Hủy đơn** → `POST /api/v1/orders/:id/cancel` (bàn về `available`)

## 🎯 Best Practices Implemented

- ✅ **Layered Architecture**: Controllers → Services → Repositories
- ✅ **Error Handling**: Custom error classes, global error handler
- ✅ **Validation**: Input validation middleware
- ✅ **Logging**: Request/response/error logging
- ✅ **Database Transactions**: ACID compliance for critical operations
- ✅ **Type Safety**: Full TypeScript coverage
- ✅ **Security**: Helmet, CORS, input sanitization
- ✅ **Async/Await**: Proper error handling with asyncHandler
- ✅ **PostgreSQL Error Mapping**: Friendly error messages
- ✅ **Repository Pattern**: Centralized database operations
- ✅ **Service Layer**: Business logic separation

## 📄 License

MIT
