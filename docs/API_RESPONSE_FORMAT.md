# API Response Format

All API responses follow this standard format:

## Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

## Error Response
```json
{
  "success": false,
  "message": "Error message description"
}
```

In development mode, errors also include a `stack` field.

## HTTP Status Codes

- `200` - OK (Success)
- `201` - Created (Resource created successfully)
- `400` - Bad Request (Invalid input)
- `404` - Not Found (Resource not found)
- `409` - Conflict (Resource conflict, e.g., duplicate)
- `422` - Unprocessable Entity (Validation error)
- `500` - Internal Server Error

## Common Error Scenarios

### Validation Errors (422)
```json
{
  "success": false,
  "message": "name is required, price must be positive"
}
```

### Not Found (404)
```json
{
  "success": false,
  "message": "Table not found"
}
```

### Conflict (409)
```json
{
  "success": false,
  "message": "Table already has an active order"
}
```

### Business Logic Error (400)
```json
{
  "success": false,
  "message": "Cannot update items for completed or cancelled order"
}
```

## PostgreSQL Errors

The API automatically maps PostgreSQL errors to user-friendly messages:

- **23505** (Unique violation) → "Resource already exists" (409)
- **23503** (Foreign key violation) → "Referenced resource does not exist" (400)
- **23502** (Not null violation) → "Required field is missing" (400)
- **22P02** (Invalid text representation) → "Invalid data format" (400)
