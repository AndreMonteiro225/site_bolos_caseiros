import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false // Isso avisa ao MySQL2 que a conexão deve ser segura
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection()
  .then(() => console.log("✅ CONECTADO AO MYSQL COM SUCESSO!"))
  .catch((err) => console.error("❌ ERRO AO CONECTAR NO MYSQL:", err.message));

export default pool;