import { Pool } from 'pg';

let conn: any;
if (!conn) {
  conn = new Pool({
    user: "postgres",
    database: "Grupo7_DWH",
    password: "12345",
    host: "localhost",
    port: 5432,
  });
}

export { conn };
