require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const app = express();

const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_DATABASE'];
requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
        console.error(`Ошибка: Отсутствует переменная окружения ${varName}`);
        process.exit(1);
    }
});

const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: (origin, callback) => {
        callback(null, true)
      },
    methods: ['GET', 'POST'],
    credentials: true, allowedHeaders: ['Content-Type']
}));

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const checkDatabaseConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Успешное подключение к MySQL');
        connection.release();
    } catch (error) {
        console.error('❌ Ошибка подключения к MySQL:', error.message);
        process.exit(1);
    }
};

app.get('/healthcheck', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [result] = await connection.query('SELECT 1 AS db_status');
        connection.release();
        
        res.json({
            db_status: result[0].db_status === 1 ? 'active' : 'inactive',
            server_status: 'running'
        });
    } catch (error) {
        res.status(500).json({
            db_status: 'error',
            error: error.message
        });
    }
});

app.get('/index-page-question.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index-page-question.html'));
});

app.post('/submit', async (req, res) => {
    console.log('Получен запрос:', req.body);
    
    try {
        const { name, number, email, question } = req.body;
        
        if (!name || !number || !email || !question) {
            console.log('Ошибка валидации');
            return res.status(400).json({ error: 'Все поля обязательны' });
        }

        const connection = await pool.getConnection();
        console.log('Успешное подключение к БД');

        const [result] = await connection.execute(
            'INSERT INTO form (name, number, email, question) VALUES (?, ?, ?, ?)',
            [name, number, email, question]
        );
        
        connection.release();
        console.log('Данные сохранены, ID:', result.insertId);

        res.status(201).json({ 
            message: 'Запрос получен', 
            id: result.insertId 
        });

    } catch (error) {
        console.error('Ошибка MySQL:', error.message);
        res.status(500).json({ 
            error: 'Ошибка сервера',
            details: process.env.NODE_ENV === 'development' ? error.message : 'Подробности скрыты'
        });
    }
});

const PORT = process.env.PORT || 3000;

checkDatabaseConnection().then(() => {
    app.listen(PORT, () => {
        console.log(`\n🚀 Сервер запущен на порту ${PORT}`);
    });
});


