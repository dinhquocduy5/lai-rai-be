# Business Logic & Best Practices

## Architecture

### Layered Architecture
```
Controllers → Services → Repositories → Database
```

- **Controllers**: Handle HTTP requests/responses
- **Services**: Business logic and transactions
- **Repositories**: Database operations
- **Models**: TypeScript interfaces

## Key Best Practices Implemented

### 1. Transaction Management
All critical operations use PostgreSQL transactions:
- Creating orders with items
- Processing payments
- Updating order items

### 2. Error Handling
- Custom error classes (AppError, NotFoundError, BadRequestError, etc.)
- Global error handler middleware
- PostgreSQL error code mapping
- Async error catching with asyncHandler

### 3. Validation
- Input validation for all POST/PUT requests
- Type checking and business rule validation
- Positive number checks
- Required field validation

### 4. Data Consistency
- Foreign key constraints
- Check constraints for enums
- Cascade deletes for order_items
- Restrict deletes for critical references

### 5. Security
- Helmet for HTTP headers
- CORS configuration
- Input sanitization
- No SQL injection (parameterized queries)

### 6. Logging
- Request/response logging
- Error logging with context
- Performance tracking (request duration)

### 7. Type Safety
- Full TypeScript coverage
- Strict mode enabled
- Proper typing for all functions
- Interface-based models

## Business Rules

### Orders
1. Cannot create order if table already has active order
2. Cannot update items for completed/cancelled orders
3. Order items must have positive quantity
4. Order must have at least one item

### Tables
1. Cannot delete occupied table
2. Table status automatically updated on order creation/completion
3. Table set to occupied when order created
4. Table set to available on payment completion

### Payments
1. Can only pay for pending orders
2. Payment amount must match order total
3. Order automatically completed on payment
4. One payment per order (no duplicate payments)

### Menu Items
1. Price must be positive
2. Type must be 'food' or 'drink'
3. Cannot delete if referenced by order items

## Database Transaction Examples

### Creating Order with Items
```typescript
BEGIN TRANSACTION
  1. Validate table exists
  2. Create order
  3. Insert all order items (with price snapshot)
  4. Update table status to 'occupied'
  5. Calculate total
COMMIT TRANSACTION
```

### Processing Payment
```typescript
BEGIN TRANSACTION
  1. Get order details
  2. Validate order is pending
  3. Check no existing payment
  4. Validate payment amount = order total
  5. Create payment record
  6. Update order status to 'completed'
  7. Set table status to 'available'
COMMIT TRANSACTION
```

### Updating Order Items
```typescript
BEGIN TRANSACTION
  1. Validate order exists and is pending
  2. Delete all existing order items
  3. Insert new order items
  4. Calculate new total
COMMIT TRANSACTION
```

## Performance Optimizations

### Database Indexes
- `orders.table_id` - Fast lookup by table
- `orders.status` - Filter by order status
- `order_items.order_id` - Fast joins
- `order_items.menu_item_id` - Fast joins
- `payments.order_id` - Fast lookup
- `payments.paid_at` - Revenue queries

### Query Optimizations
- Use specific column selection
- Parameterized queries (prepared statements)
- Connection pooling (max 10 connections)
- Idle connection timeout (30s)

## Scalability Considerations

### Current Setup (Good for small/medium restaurants)
- Single database connection pool
- Synchronous transaction processing
- In-memory session handling

### Future Enhancements (for scale)
- Redis for caching menu items
- Queue system for order processing
- Read replicas for reporting
- WebSocket for real-time updates
- Horizontal scaling with load balancer

## Error Recovery

### Transaction Rollback
All transactions automatically rollback on error:
```typescript
try {
  await client.query('BEGIN');
  // ... operations
  await client.query('COMMIT');
} catch (e) {
  await client.query('ROLLBACK');
  throw e;
}
```

### Connection Pool Errors
- Auto-reconnect on connection loss
- Error events logged
- Graceful degradation

## Testing Strategy (Recommended)

### Unit Tests
- Repository functions
- Service business logic
- Validation functions

### Integration Tests
- API endpoints
- Database transactions
- Error scenarios

### E2E Tests
- Complete business flows
- Multi-step operations
- Concurrent requests

## Monitoring & Observability

### Current Logging
- Request method, path, status, duration
- Error details with stack traces
- Database connection events

### Recommended Additions
- Application metrics (Prometheus)
- Distributed tracing (Jaeger/OpenTelemetry)
- Error tracking (Sentry)
- Database query performance monitoring
