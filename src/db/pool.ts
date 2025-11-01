import { Pool, type QueryConfig, type QueryResult, type QueryResultRow } from 'pg';
import { env } from '@/config/env';
import { logger } from '@/utils/logger';

// Detect if using Supabase (connection string contains 'supabase')
const isSupabase = env.DATABASE_URL?.includes('supabase') || env.DATABASE_URL?.includes('pooler');

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 10_000,
  ssl: isSupabase
    ? {
        rejectUnauthorized: false, // Required for Supabase
      }
    : false, // Local PostgreSQL
});

const dbType = isSupabase ? 'Supabase' : 'Local';
pool.on('connect', () => logger.info(`✅ Connected to PostgreSQL (${dbType})`));
pool.on('error', (err) => logger.error({ err }, '❌ Unexpected PG pool error'));

/** Overloads */
export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  values?: any[],
): Promise<QueryResult<T>>;
export async function query<T extends QueryResultRow = QueryResultRow>(
  config: QueryConfig<any[]>,
): Promise<QueryResult<T>>;

/** Impl */
export async function query<T extends QueryResultRow = QueryResultRow>(
  textOrConfig: string | QueryConfig<any[]>,
  values?: any[],
): Promise<QueryResult<T>> {
  return typeof textOrConfig === 'string'
    ? pool.query<T>(textOrConfig, values)
    : pool.query<T>(textOrConfig);
}

export const db = { query };
