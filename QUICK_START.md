# 🚀 Quick Start Guide

## 📋 Prerequisites
- Node.js 18 or higher
- PostgreSQL 14 or higher
- npm or yarn

## ⚡ Fast Setup (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment
```bash
# Copy example env file
cp .env.example .env

# Edit .env with your database credentials
# For local PostgreSQL:
DATABASE_URL=postgresql://postgres:password@localhost:5432/lai_rai
```

### 3. Setup Database
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE lai_rai;

# Exit psql
\q

# Run setup script
psql -U postgres -d lai_rai -f database/setup.sql
```

### 4. Start Development Server
```bash
npm run dev
```

Server will start at: **http://localhost:3000**

## ✅ Verify Installation

### 1. Check Server Health
```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is running"
}
```

### 2. Check Database Connection
```bash
curl http://localhost:3000/api/v1/health/db
```

Expected response:
```json
{
  "success": true,
  "message": "Database connected",
  "time": "2025-11-01T02:37:37.298Z"
}
```

### 3. Test API (Get Tables)
```bash
curl http://localhost:3000/api/v1/tables
```

Expected response:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Bàn 1",
      "status": "available"
    },
    // ... more tables
  ]
}
```

## 🎯 Try Complete Flow

### 1. View Available Tables
```bash
curl http://localhost:3000/api/v1/tables
```

### 2. View Menu
```bash
# All items
curl http://localhost:3000/api/v1/menu-items

# Food only
curl http://localhost:3000/api/v1/menu-items?type=food

# Drinks only
curl http://localhost:3000/api/v1/menu-items?type=drink
```

### 3. Create Order
```bash
curl -X POST http://localhost:3000/api/v1/orders \
  -H "Content-Type: application/json" \
  -d '{
    "table_id": 1,
    "items": [
      {
        "menu_item_id": 1,
        "quantity": 2,
        "note": "Ít hành"
      },
      {
        "menu_item_id": 9,
        "quantity": 2
      }
    ]
  }'
```

### 4. View Order
```bash
# Replace {order_id} with actual order ID from step 3
curl http://localhost:3000/api/v1/orders/1
```

### 5. Update Order Items
```bash
curl -X PUT http://localhost:3000/api/v1/orders/1/items \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "menu_item_id": 1,
        "quantity": 3,
        "note": "Ít hành, thêm chanh"
      },
      {
        "menu_item_id": 9,
        "quantity": 3
      }
    ]
  }'
```

### 6. Process Payment
```bash
# Use the total amount from step 4
curl -X POST http://localhost:3000/api/v1/payments \
  -H "Content-Type: application/json" \
  -d '{
    "order_id": 1,
    "amount": 110000,
    "payment_method": "cash"
  }'
```

### 7. Verify Table is Available Again
```bash
curl http://localhost:3000/api/v1/tables/1
```

## 🔧 Development Commands

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

## 📁 Project Structure

```
lai-rai-be/
├── src/
│   ├── config/         # Environment configuration
│   ├── controllers/    # HTTP request handlers
│   ├── db/            # Database connection
│   ├── loaders/       # Express app setup
│   ├── middlewares/   # Custom middleware
│   ├── models/        # TypeScript interfaces
│   ├── repositories/  # Database queries
│   ├── routes/        # API routes
│   ├── services/      # Business logic
│   └── utils/         # Utilities (logger, errors)
├── database/          # Database setup scripts
├── docs/             # Documentation
├── .env.example      # Environment variables template
├── api-requests.http # API test requests
└── README.md         # Full documentation
```

## 📖 Next Steps

1. **Read Full Documentation**: Check `README.md` for complete API reference
2. **Test API**: Use `api-requests.http` file with REST Client extension in VS Code
3. **Deploy**: See `docs/DEPLOYMENT.md` for deployment guides
4. **Learn Best Practices**: Check `docs/BEST_PRACTICES.md`

## 🆘 Troubleshooting

### Server won't start
- Check if port 3000 is already in use
- Verify PostgreSQL is running
- Check `.env` file exists and has correct values

### Database connection error
- Verify DATABASE_URL is correct
- Check PostgreSQL is running: `pg_isready`
- Ensure database exists: `psql -l | grep lai_rai`

### API returns errors
- Check server logs in terminal
- Verify database has tables: `psql -d lai_rai -c "\dt"`
- Make sure sample data is loaded

## 💡 Tips

- Use **REST Client** extension in VS Code to test APIs from `api-requests.http`
- Use **Thunder Client** or **Postman** for more advanced testing
- Check logs in terminal for debugging
- Database sample data is included (10 tables, 16 menu items)

## 🎉 You're Ready!

Server is running and ready to handle restaurant operations!

Try the complete flow above or explore the API using the examples in `api-requests.http`.
