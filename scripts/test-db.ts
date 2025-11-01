// Test database connection script
import { pool } from '@/db/pool';
import { logger } from '@/utils/logger';
import { env } from '@/config/env';

async function testConnection() {
  try {
    // Check if DATABASE_URL is set
    if (!env.DATABASE_URL) {
      logger.error('❌ DATABASE_URL is not set in .env file');
      process.exit(1);
    }
    
    logger.info('🔍 Testing database connection...');
    logger.info(`📡 Database URL: ${env.DATABASE_URL.replace(/:[^:@]+@/, ':***@')}`); // Hide password
    
    // Test basic connection
    const result = await pool.query('SELECT NOW() as current_time, version() as pg_version');
    const { current_time, pg_version } = result.rows[0];
    
    logger.info('✅ Database connection successful!');
    logger.info(`⏰ Server time: ${current_time}`);
    logger.info(`📦 PostgreSQL version: ${pg_version.split(',')[0]}`);
    
    // Test tables exist
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    const tables = tablesResult.rows.map((r: any) => r.table_name);
    logger.info(`📊 Found ${tables.length} tables: ${tables.join(', ')}`);
    
    // Check sample data
    const tableCount = await pool.query('SELECT COUNT(*) as count FROM tables');
    const menuCount = await pool.query('SELECT COUNT(*) as count FROM menu_items');
    
    logger.info(`🪑 Tables: ${tableCount.rows[0].count} rows`);
    logger.info(`🍽️  Menu items: ${menuCount.rows[0].count} rows`);
    
    logger.info('\n✨ All checks passed! Database is ready.');
    
  } catch (error: any) {
    logger.error('❌ Database connection failed!');
    logger.error(error.message);
    
    if (error.code === 'ENOTFOUND') {
      logger.error('\n💡 Tip: Check your DATABASE_URL host is correct');
    } else if (error.code === 'ECONNREFUSED') {
      logger.error('\n💡 Tip: Make sure PostgreSQL is running');
    } else if (error.code === '28P01') {
      logger.error('\n💡 Tip: Check your database password');
    } else if (error.code === '3D000') {
      logger.error('\n💡 Tip: Database does not exist, create it first');
    }
    
    process.exit(1);
  } finally {
    await pool.end();
  }
}

testConnection();
