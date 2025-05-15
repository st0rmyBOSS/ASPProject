require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const nodemailer = require('nodemailer');
const app = express();
const path = require('path');

const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_DATABASE', 'EMAIL_USER', 'EMAIL_PASS', 'EMAIL_TO'];
requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
        console.error(`Ошибка: Отсутствует переменная окружения ${varName}`);
        process.exit(1);
    }
});

// Настройка транспорта для nodemailer
const transporter = nodemailer.createTransport({
    host: 'smtp.yandex.ru',
    port: 465,  // SSL
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false 
    }
});

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
    database: 'artstroyprojectdb', 
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    port: 3306 
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

        // Сохранение в БД
        const connection = await pool.getConnection();
        console.log('Отправка успешна!');

        const [result] = await connection.execute(
            'INSERT INTO form (name, number, email, question) VALUES (?, ?, ?, ?)',
            [name, number, email, question]
        );
        
        connection.release();
        console.log('Данные сохранены, ID:', result.insertId);

        // Отправка письма
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_TO,
            subject: 'Новый вопрос с сайта',
            text: `
                Имя: ${name}
                Телефон: ${number}
                Email: ${email}
                Вопрос: ${question}
            `,
            html: `
                <h1>Новый вопрос с сайта</h1>
                <p><strong>Имя:</strong> ${name}</p>
                <p><strong>Телефон:</strong> ${number}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Вопрос:</strong> ${question}</p>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log('Письмо успешно отправлено');

        res.status(201).json({ 
            message: 'Запрос получен', 
            id: result.insertId 
        });

    } catch (error) {
        console.error('Ошибка:', error.message);
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