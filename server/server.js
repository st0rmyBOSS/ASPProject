require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const nodemailer = require('nodemailer');
const app = express();
const path = require('path');
const fs = require('fs');

// Проверка обязательных переменных окружения
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

const DATA_FILE = path.join(__dirname, 'site-data.json');

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

// Функция для сохранения данных главной страницы в MySQL
async function saveMainToDB(data) {
    const connection = await pool.getConnection();
    try {
        // Вставляем новые данные
        await connection.execute(
            'INSERT INTO main_page (company_info, services_info) VALUES (?, ?)',
            [data.companyInfo, data.servicesInfo]
        );
    } finally {
        connection.release();
    }
}

// Функция для сохранения данных страницы "О компании" в MySQL
async function saveAboutToDB(data) {
    const connection = await pool.getConnection();
    try {
        await connection.execute(
            'INSERT INTO about_page (text1, text2, text3, text4) VALUES (?, ?, ?, ?)',
            [data.text1, data.text2, data.text3, data.text4]
        );
    } finally {
        connection.release();
    }
}

// Функция для сохранения данных страницы "Проекты" в MySQL
async function saveProjectsToDB(data) {
    const connection = await pool.getConnection();
    try {
        await connection.execute(
            'INSERT INTO projects_page (text1, text2, text3, text4, text5, text6, text7, text8) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [data.text1, data.text2, data.text3, data.text4, data.text5, data.text6, data.text7, data.text8]
        );
    } finally {
        connection.release();
    }
}

// Функция для сохранения данных страницы "Услуги" в MySQL
async function saveServicesToDB(data) {
    const connection = await pool.getConnection();
    try {
        await connection.execute(
            'INSERT INTO services_page (text_left, text_right, services_list) VALUES (?, ?, ?)',
            [data.textLeft, data.textRight, data.servicesList]
        );
    } finally {
        connection.release();
    }
}

// Функции для загрузки данных из MySQL
async function loadMainFromDB() {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute('SELECT * FROM main_page ORDER BY id DESC LIMIT 1');
        return rows[0] || null;
    } finally {
        connection.release();
    }
}

async function loadAboutFromDB() {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute('SELECT * FROM about_page ORDER BY id DESC LIMIT 1');
        return rows[0] || null;
    } finally {
        connection.release();
    }
}

async function loadProjectsFromDB() {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute('SELECT * FROM projects_page ORDER BY id DESC LIMIT 1');
        return rows[0] || null;
    } finally {
        connection.release();
    }
}

async function loadServicesFromDB() {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute('SELECT * FROM services_page ORDER BY id DESC LIMIT 1');
        return rows[0] || null;
    } finally {
        connection.release();
    }
}

async function initializeDatabase() {
    try {
        const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        
        if (data.main) await saveMainToDB(data.main);
        if (data.about) await saveAboutToDB(data.about);
        if (data.projects) await saveProjectsToDB(data.projects);
        if (data.services) await saveServicesToDB(data.services);
        
        console.log('База данных инициализирована данными из JSON');
    } catch (error) {
        console.log('Не удалось инициализировать БД из JSON:', error.message);
    }
}

// Вызовите эту функцию после подключения к БД
checkDatabaseConnection().then(async () => {
    await initializeDatabase();
    
    app.listen(PORT, () => {
        console.log(`\n🚀 Сервер запущен на порту ${PORT}`);
    });
});

app.get('/api/data/main', async (req, res) => {
    try {
        const data = await loadMainFromDB();
        res.json(data || {});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/data/about', async (req, res) => {
    try {
        const data = await loadAboutFromDB();
        res.json(data || {});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/data/projects', async (req, res) => {
    try {
        const data = await loadProjectsFromDB();
        res.json(data || {});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/data/services', async (req, res) => {
    try {
        const data = await loadServicesFromDB();
        res.json(data || {});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

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

app.get('/api/data', (req, res) => {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) {
            // Если файла нет, возвращаем пустой объект
            return res.json({});
        }
        res.json(JSON.parse(data));
    });
});

// Сохранение данных 
app.post('/api/save', async (req, res) => {
    console.log('Получены данные:', req.body);
    
    if (!req.body) {
        return res.status(400).json({ error: 'Нет данных' });
    }

    try {
        // Сохраняем в JSON
        fs.writeFileSync(DATA_FILE, JSON.stringify(req.body, null, 2));
        
        // Сохраняем в MySQL в зависимости от типа данных
        if (req.body.main) {
            await saveMainToDB(req.body.main);
        } else if (req.body.about) {
            await saveAboutToDB(req.body.about);
        } else if (req.body.projects) {
            await saveProjectsToDB(req.body.projects);
        } else if (req.body.services) {
            await saveServicesToDB(req.body.services);
        }
        
        console.log('Данные успешно сохранены в JSON и MySQL!');
        res.json({ success: true });
    } catch (error) {
        console.error('Ошибка сохранения:', error);
        res.status(500).json({ error: 'Ошибка сохранения данных' });
    }
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
        console.log('Успешное подключение к БД');

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