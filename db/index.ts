import { neon } from '@neondatabase/serverless';

let _db: ReturnType<typeof neon> | null = null;

export function getDb() {
  if (!_db) {
    _db = neon(process.env.DATABASE_URL!);
  }
  return _db;
}
