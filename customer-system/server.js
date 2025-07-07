const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

// 连接数据库
const db = new sqlite3.Database('../feeding.db', (err) => {
    if (err) return console.error('数据库连接错误:', err.message);
    console.log('成功连接到 feeding.db 数据库');
});

// 获取所有人员
app.get('/api/persons', (req, res) => {
    db.all('SELECT * FROM persons', (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// 获取所有食物
app.get('/api/foods', (req, res) => {
    db.all('SELECT * FROM foods', (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// 获取所有地点
app.get('/api/locations', (req, res) => {
    db.all('SELECT * FROM locations', (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// 获取所有喂食记录（包括评分）
app.get('/api/feedings', (req, res) => {
    const query = `
        SELECT 
            fr.record_id,
            fr.feeding_time,
            p.name AS person_name,
            f.name AS food_name,
            l.name AS location_name,
            fr.portion_size,
            fr.notes,
            sr.score,
            sr.comment AS satisfaction
        FROM feeding_records fr
        JOIN persons p ON fr.person_id = p.person_id
        JOIN foods f ON fr.food_id = f.food_id
        JOIN locations l ON fr.location_id = l.location_id
        LEFT JOIN satisfaction_ratings sr ON fr.record_id = sr.record_id
        ORDER BY fr.feeding_time DESC
    `;

    db.all(query, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// 获取需要补录的记录（缺少备注或评分）
app.get('/api/feedings/incomplete', (req, res) => {
    const query = `
        SELECT 
            fr.record_id,
            fr.feeding_time,
            p.name AS person_name,
            f.name AS food_name,
            l.name AS location_name
        FROM feeding_records fr
        JOIN persons p ON fr.person_id = p.person_id
        JOIN foods f ON fr.food_id = f.food_id
        JOIN locations l ON fr.location_id = l.location_id
        WHERE fr.notes IS NULL OR fr.notes = '' 
            OR NOT EXISTS (SELECT 1 FROM satisfaction_ratings WHERE record_id = fr.record_id)
        ORDER BY fr.feeding_time DESC
    `;

    db.all(query, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// 添加备注
app.post('/api/record/:id/notes', (req, res) => {
    const recordId = req.params.id;
    const { notes } = req.body;

    if (!notes) {
        return res.status(400).json({ error: '备注内容不能为空' });
    }

    db.run(
        'UPDATE feeding_records SET notes = ? WHERE record_id = ?',
        [notes, recordId],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: '备注添加成功' });
        }
    );
});

// 添加评分
app.post('/api/record/:id/rating', (req, res) => {
    const recordId = req.params.id;
    const { score, comment } = req.body;

    if (!score || score < 1 || score > 5) {
        return res.status(400).json({ error: '请提供1-5的评分' });
    }

    db.run(
        `INSERT OR REPLACE INTO satisfaction_ratings (record_id, score, comment) 
         VALUES (?, ?, ?)`,
        [recordId, score, comment || ''],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: '评分添加成功' });
        }
    );
});

// 添加新喂食记录
app.post('/api/feeding', (req, res) => {
    const { person_id, food_id, location_id, portion_size, notes } = req.body;

    if (!person_id || !food_id || !location_id) {
        return res.status(400).json({ error: '请选择人员、食物和地点' });
    }

    db.run(
        `INSERT INTO feeding_records (person_id, food_id, location_id, portion_size, notes) 
         VALUES (?, ?, ?, ?, ?)`,
        [person_id, food_id, location_id, portion_size || null, notes || null],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({
                record_id: this.lastID,
                message: '喂食记录添加成功'
            });
        }
    );
});

// 启动服务器
app.listen(port, () => {
    console.log(`喂饭机器人服务已启动: http://localhost:${port}`);
});