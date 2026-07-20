import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 20,
  queueLimit: 0
});

// Teste automático de conexão
pool.getConnection()
  .then(() => console.log("✅ CONECTADO AO MYSQL COM SUCESSO!"))
  .catch((err) => console.error("❌ ERRO AO CONECTAR NO MYSQL:", err.message));

export default pool;