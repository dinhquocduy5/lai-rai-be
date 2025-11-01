# Deployment Guide

## Prerequisites
- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn

## Environment Setup

### Production Environment Variables
Create a `.env` file:
```env
NODE_ENV=production
PORT=3000
LOG_LEVEL=info
DATABASE_URL=postgresql://user:password@host:5432/database
```

### Database Migration
```bash
# Connect to your PostgreSQL database
psql $DATABASE_URL

# Run setup script
\i database/setup.sql
```

## Deployment Options

### Option 1: Traditional VPS (Ubuntu/Debian)

#### 1. Install Dependencies
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL (if not using external DB)
sudo apt install -y postgresql postgresql-contrib

# Install PM2 for process management
sudo npm install -g pm2
```

#### 2. Deploy Application
```bash
# Clone repository
git clone <your-repo-url>
cd lai-rai-be

# Install dependencies
npm ci --production

# Build TypeScript
npm run build

# Setup environment
cp .env.example .env
# Edit .env with production values

# Start with PM2
pm2 start dist/server.js --name lai-rai-api
pm2 save
pm2 startup
```

#### 3. Setup Nginx Reverse Proxy
```bash
sudo apt install -y nginx

# Create nginx config
sudo nano /etc/nginx/sites-available/lai-rai
```

Nginx config:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/lai-rai /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 4. SSL with Let's Encrypt
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### Option 2: Docker Deployment

#### Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/server.js"]
```

#### docker-compose.yml
```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@db:5432/lai-rai
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:14-alpine
    environment:
      - POSTGRES_DB=lai-rai
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database/setup.sql:/docker-entrypoint-initdb.d/setup.sql
    restart: unless-stopped

volumes:
  postgres_data:
```

Deploy with Docker:
```bash
docker-compose up -d
```

### Option 3: Platform as a Service (PaaS)

#### Railway.app
1. Connect GitHub repository
2. Add PostgreSQL addon
3. Set environment variables
4. Deploy automatically on push

#### Render.com
1. Create Web Service from GitHub
2. Build Command: `npm install && npm run build`
3. Start Command: `npm start`
4. Add PostgreSQL database
5. Set environment variables

#### Heroku
```bash
# Login
heroku login

# Create app
heroku create lai-rai-api

# Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Set buildpack
heroku buildpacks:set heroku/nodejs

# Deploy
git push heroku main

# Run migrations
heroku run psql $DATABASE_URL < database/setup.sql
```

## Post-Deployment

### Health Check
```bash
curl https://your-domain.com/health
curl https://your-domain.com/api/v1/health/db
```

### Monitor Logs
```bash
# PM2
pm2 logs lai-rai-api

# Docker
docker-compose logs -f api

# Heroku
heroku logs --tail
```

### Performance Monitoring
```bash
# PM2 monitoring
pm2 monit

# Or install PM2 Plus
pm2 install pm2-server-monit
```

## Backup Strategy

### Database Backup
```bash
# Automated daily backup
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# Cron job (daily at 2 AM)
0 2 * * * pg_dump $DATABASE_URL > /backups/lai-rai_$(date +\%Y\%m\%d).sql
```

### Restore
```bash
psql $DATABASE_URL < backup_20250101.sql
```

## Maintenance

### Update Application
```bash
# Pull latest code
git pull origin main

# Install dependencies
npm ci --production

# Build
npm run build

# Restart
pm2 restart lai-rai-api
```

### Database Migrations
For schema changes, create migration files:
```bash
# Example migration
psql $DATABASE_URL < database/migrations/001_add_column.sql
```

## Troubleshooting

### Application won't start
- Check environment variables
- Verify database connection
- Check logs: `pm2 logs lai-rai-api`

### High memory usage
- Check for connection leaks
- Monitor with `pm2 monit`
- Restart: `pm2 restart lai-rai-api`

### Database connection errors
- Verify DATABASE_URL is correct
- Check PostgreSQL is running
- Check connection limits

## Security Checklist

- [ ] Environment variables not committed
- [ ] Database password is strong
- [ ] SSL/HTTPS enabled
- [ ] Firewall configured (only 80, 443 open)
- [ ] Database not publicly accessible
- [ ] Regular security updates
- [ ] Backup strategy in place
- [ ] Error stack traces disabled in production
