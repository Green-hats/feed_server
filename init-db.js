const sqlite3 = require('sqlite3').verbose();

// 创建并连接数据库
const db = new sqlite3.Database('./feeding.db', (err) => {
    if (err) {
        return console.error('数据库连接错误:', err.message);
    }
    console.log('成功连接到 feeding.db 数据库');

    // 创建表
    db.serialize(() => {
        // 删除旧表（如果存在）
        db.run(`DROP TABLE IF EXISTS satisfaction_ratings`);
        db.run(`DROP TABLE IF EXISTS feeding_records`);
        db.run(`DROP TABLE IF EXISTS persons`);
        db.run(`DROP TABLE IF EXISTS foods`);
        db.run(`DROP TABLE IF EXISTS locations`);

        // 创建人员表
        db.run(`
            CREATE TABLE persons (
                person_id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                age INTEGER,
                dietary_needs TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 创建食物表
        db.run(`
            CREATE TABLE foods (
                food_id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL UNIQUE,
                category TEXT,
                calories INTEGER,
                description TEXT
            )
        `);

        // 创建地点表
        db.run(`
            CREATE TABLE locations (
                location_id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL UNIQUE,
                description TEXT
            )
        `);

        // 创建喂食记录表
        db.run(`
            CREATE TABLE feeding_records (
                record_id INTEGER PRIMARY KEY AUTOINCREMENT,
                person_id INTEGER NOT NULL,
                food_id INTEGER NOT NULL,
                location_id INTEGER NOT NULL,
                feeding_time DATETIME DEFAULT CURRENT_TIMESTAMP,
                portion_size REAL,
                notes TEXT,
                FOREIGN KEY (person_id) REFERENCES persons(person_id),
                FOREIGN KEY (food_id) REFERENCES foods(food_id),
                FOREIGN KEY (location_id) REFERENCES locations(location_id)
            )
        `);

        // 创建满意度评分表
        db.run(`
            CREATE TABLE satisfaction_ratings (
                rating_id INTEGER PRIMARY KEY AUTOINCREMENT,
                record_id INTEGER NOT NULL UNIQUE,
                score INTEGER CHECK(score BETWEEN 1 AND 5),
                comment TEXT,
                FOREIGN KEY (record_id) REFERENCES feeding_records(record_id)
            )
        `);

        // 插入示例数据
        db.run(`
            INSERT INTO persons (name, age, dietary_needs) 
            VALUES 
                ('张三', 75, '低盐, 低糖'),
                ('李四', 82, '软食, 易消化'),
                ('王五', 68, '高蛋白')
        `);

        db.run(`
            INSERT INTO foods (name, category, calories, description) 
            VALUES 
                ('燕麦粥', '主食', 68, '高纤维易消化'),
                ('水蒸蛋', '蛋白质', 54, '软糯易吞咽'),
                ('鸡胸肉泥', '蛋白质', 165, '高蛋白低脂肪'),
                ('南瓜羹', '蔬菜', 40, '富含维生素A'),
                ('苹果泥', '水果', 52, '新鲜打制，去核'),
                ('牛奶', '饮品', 61, '脱脂牛奶'),
                ('米糊', '主食', 80, '混合谷物制作')
        `);

        db.run(`
            INSERT INTO locations (name, description) 
            VALUES 
                ('客厅餐桌', '靠近窗户的主餐桌'),
                ('卧室床头', '有可调节高度的床头桌'),
                ('阳台小桌', '阳光充足的休闲区')
        `);

        db.run(`
            INSERT INTO feeding_records (person_id, food_id, location_id, portion_size, notes) 
            VALUES 
                (1, 1, 1, 150.0, '温度适中，老人吃得顺利'),
                (2, 3, 3, 100.0, '添加了少量橄榄油'),
                (1, 5, 2, 80.0, '作为午间零食'),
                (3, 6, 1, 200.0, '餐后饮品'),
                (2, 4, 3, 120.0, '老人表示味道很香'),
                (3, 7, 2, 180.0, '晚餐主食'),
                (1, 2, 1, 120.0, NULL),  -- 缺少备注
                (2, 1, 2, 140.0, '老人胃口不错'), -- 缺少评分
                (3, 3, 3, 90.0, NULL) -- 缺少备注和评分
        `);

        db.run(`
            INSERT INTO satisfaction_ratings (record_id, score, comment) 
            VALUES 
                (1, 4, '吃得很好，但略嫌淡'),
                (2, 5, '非常喜欢，要求明天再来一份'),
                (3, 3, '吃完但没表现出特别兴趣'),
                (4, 4, '喝完了200ml'),
                (5, 5, '特别喜欢南瓜的味道'),
                (6, 4, '建议增加一点咸味')
        `, () => {
            console.log('数据库初始化完成，示例数据已添加');
            db.close();
        });
    });
});