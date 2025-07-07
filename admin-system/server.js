const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3001; // 使用不同的端口

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

// 添加新人员
app.post('/api/persons', (req, res) => {
    const { name, age, dietary_needs } = req.body;
    if (!name) return res.status(400).json({ error: '姓名不能为空' });

    db.run(
        'INSERT INTO persons (name, age, dietary_needs) VALUES (?, ?, ?)',
        [name, age || null, dietary_needs || null],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({
                person_id: this.lastID,
                message: '人员添加成功'
            });
        }
    );
});

// 更新人员信息
app.put('/api/persons/:id', (req, res) => {
    const personId = req.params.id;
    const { name, age, dietary_needs } = req.body;

    if (!name) return res.status(400).json({ error: '姓名不能为空' });

    db.run(
        'UPDATE persons SET name = ?, age = ?, dietary_needs = ? WHERE person_id = ?',
        [name, age || null, dietary_needs || null, personId],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            if (this.changes === 0) return res.status(404).json({ error: '人员不存在' });
            res.json({ message: '人员信息更新成功' });
        }
    );
});

// 删除人员
app.delete('/api/persons/:id', (req, res) => {
    const personId = req.params.id;

    db.run(
        'DELETE FROM persons WHERE person_id = ?',
        [personId],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            if (this.changes === 0) return res.status(404).json({ error: '人员不存在' });
            res.json({ message: '人员删除成功' });
        }
    );
});

// 获取所有食物
app.get('/api/foods', (req, res) => {
    db.all('SELECT * FROM foods', (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// 添加新食物
app.post('/api/foods', (req, res) => {
    const { name, category, calories, description } = req.body;
    if (!name) return res.status(400).json({ error: '食物名称不能为空' });

    db.run(
        'INSERT INTO foods (name, category, calories, description) VALUES (?, ?, ?, ?)',
        [name, category || null, calories || null, description || null],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({
                food_id: this.lastID,
                message: '食物添加成功'
            });
        }
    );
});

// 更新食物信息
app.put('/api/foods/:id', (req, res) => {
    const foodId = req.params.id;
    const { name, category, calories, description } = req.body;

    if (!name) return res.status(400).json({ error: '食物名称不能为空' });

    db.run(
        'UPDATE foods SET name = ?, category = ?, calories = ?, description = ? WHERE food_id = ?',
        [name, category || null, calories || null, description || null, foodId],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            if (this.changes === 0) return res.status(404).json({ error: '食物不存在' });
            res.json({ message: '食物信息更新成功' });
        }
    );
});

// 删除食物
app.delete('/api/foods/:id', (req, res) => {
    const foodId = req.params.id;

    db.run(
        'DELETE FROM foods WHERE food_id = ?',
        [foodId],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            if (this.changes === 0) return res.status(404).json({ error: '食物不存在' });
            res.json({ message: '食物删除成功' });
        }
    );
});

// 获取所有地点
app.get('/api/locations', (req, res) => {
    db.all('SELECT * FROM locations', (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// 添加新地点
app.post('/api/locations', (req, res) => {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error: '地点名称不能为空' });

    db.run(
        'INSERT INTO locations (name, description) VALUES (?, ?)',
        [name, description || null],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({
                location_id: this.lastID,
                message: '地点添加成功'
            });
        }
    );
});

// 更新地点信息
app.put('/api/locations/:id', (req, res) => {
    const locationId = req.params.id;
    const { name, description } = req.body;

    if (!name) return res.status(400).json({ error: '地点名称不能为空' });

    db.run(
        'UPDATE locations SET name = ?, description = ? WHERE location_id = ?',
        [name, description || null, locationId],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            if (this.changes === 0) return res.status(404).json({ error: '地点不存在' });
            res.json({ message: '地点信息更新成功' });
        }
    );
});

// 删除地点
app.delete('/api/locations/:id', (req, res) => {
    const locationId = req.params.id;

    db.run(
        'DELETE FROM locations WHERE location_id = ?',
        [locationId],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            if (this.changes === 0) return res.status(404).json({ error: '地点不存在' });
            res.json({ message: '地点删除成功' });
        }
    );
});

// 获取所有喂食记录
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

// 添加喂食记录
app.post('/api/feedings', (req, res) => {
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

// 更新喂食记录
app.put('/api/feedings/:id', (req, res) => {
    const recordId = req.params.id;
    const { person_id, food_id, location_id, portion_size, notes } = req.body;

    if (!person_id || !food_id || !location_id) {
        return res.status(400).json({ error: '请选择人员、食物和地点' });
    }

    db.run(
        `UPDATE feeding_records 
         SET person_id = ?, food_id = ?, location_id = ?, portion_size = ?, notes = ?
         WHERE record_id = ?`,
        [person_id, food_id, location_id, portion_size || null, notes || null, recordId],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            if (this.changes === 0) return res.status(404).json({ error: '记录不存在' });
            res.json({ message: '喂食记录更新成功' });
        }
    );
});

// 删除喂食记录
app.delete('/api/feedings/:id', (req, res) => {
    const recordId = req.params.id;

    // 先删除关联的满意度评分
    db.run('DELETE FROM satisfaction_ratings WHERE record_id = ?', [recordId], (err) => {
        if (err) return res.status(500).json({ error: err.message });

        // 再删除喂食记录
        db.run(
            'DELETE FROM feeding_records WHERE record_id = ?',
            [recordId],
            function (err) {
                if (err) return res.status(500).json({ error: err.message });
                if (this.changes === 0) return res.status(404).json({ error: '记录不存在' });
                res.json({ message: '喂食记录删除成功' });
            }
        );
    });
});

// 添加/更新满意度评分
app.post('/api/ratings/:record_id', (req, res) => {
    const recordId = req.params.record_id;
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
            res.json({
                rating_id: this.lastID,
                message: '评分添加成功'
            });
        }
    );
});

// 删除满意度评分
app.delete('/api/ratings/:record_id', (req, res) => {
    const recordId = req.params.record_id;

    db.run(
        'DELETE FROM satisfaction_ratings WHERE record_id = ?',
        [recordId],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            if (this.changes === 0) return res.status(404).json({ error: '评分不存在' });
            res.json({ message: '评分删除成功' });
        }
    );
});

// 获取统计数据
app.get('/api/stats', (req, res) => {
    const stats = {};

    // 获取总记录数
    db.get('SELECT COUNT(*) AS count FROM feeding_records', (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        stats.total_records = row.count;

        // 获取今日记录数
        db.get(`
            SELECT COUNT(*) AS count 
            FROM feeding_records 
            WHERE DATE(feeding_time) = DATE('now')
        `, (err, row) => {
            if (err) return res.status(500).json({ error: err.message });
            stats.today_records = row.count;

            // 获取平均评分
            db.get(`
                SELECT AVG(score) AS avg_score 
                FROM satisfaction_ratings
            `, (err, row) => {
                stats.avg_rating = row.avg_score ? row.avg_score.toFixed(1) : 0;

                // 获取最受欢迎食物
                db.get(`
                    SELECT f.name, COUNT(*) AS count
                    FROM feeding_records fr
                    JOIN foods f ON fr.food_id = f.food_id
                    GROUP BY f.name
                    ORDER BY count DESC
                    LIMIT 1
                `, (err, row) => {
                    stats.popular_food = row ? row.name : '无数据';

                    // 获取最常喂食地点
                    db.get(`
                        SELECT l.name, COUNT(*) AS count
                        FROM feeding_records fr
                        JOIN locations l ON fr.location_id = l.location_id
                        GROUP BY l.name
                        ORDER BY count DESC
                        LIMIT 1
                    `, (err, row) => {
                        stats.popular_location = row ? row.name : '无数据';

                        // 获取喂食趋势数据
                        db.all(`
                            SELECT DATE(feeding_time) AS date, COUNT(*) AS count
                            FROM feeding_records
                            GROUP BY DATE(feeding_time)
                            ORDER BY date DESC
                            LIMIT 7
                        `, (err, rows) => {
                            stats.feeding_trend = rows || [];
                            res.json(stats);
                        });
                    });
                });
            });
        });
    });
});

// 启动服务器
app.listen(port, () => {
    console.log(`喂饭机器人后台管理系统已启动: http://localhost:${port}`);
    console.log(`数据库文件: ../feeding.db`);
});