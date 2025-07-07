# 喂饭机器人系统

## 项目简介

本项目是一个面向养老护理场景的喂饭机器人数据管理与监控系统，包含后台管理端和客户监控端，支持喂食记录、人员、食物、地点的管理与统计分析。系统基于 Node.js（Express）和 SQLite3 实现，前后端分离，界面简洁直观。

- **后台管理端**（admin-system）：用于人员、食物、地点等基础数据的管理。
- **客户监控端**（customer-system）：用于喂食记录的补录、监控统计和满意度评分。

## 目录结构

```
feed/
├── API_document.md         # API详细文档
├── feeding.db              # SQLite3数据库文件
├── init-db.js              # 数据库初始化脚本
├── package.json            # 项目依赖
├── admin-system/           # 后台管理端
│   ├── server.js           # 管理端后端服务
│   └── public/             # 管理端前端页面
│       ├── index.html      # 管理端主页面
│       └── style.css       # 管理端样式
└── customer-system/        # 客户监控端
    ├── feeding.db          # 监控端数据库副本（可选）
    ├── server.js           # 监控端后端服务
    └── public/             # 监控端前端页面
        ├── monitor.html    # 监控统计页面
        ├── record.html     # 数据补录页面
        └── style.css       # 监控端样式
```

## 快速开始

### 1. 安装依赖

```bash
npm install express sqlite3
```

### 2. 初始化数据库

```bash
node init-db.js
```

### 3. 启动服务

分别启动后台管理端和客户监控端：

```bash
# 启动后台管理端（端口3001）
cd admin-system
node server.js

# 启动客户监控端（端口3000）
cd ../customer-system
node server.js
```

### 4. 访问前端页面

- 管理端：http://localhost:3001/
- 监控端：http://localhost:3000/monitor.html
- 补录端：http://localhost:3000/record.html

## 主要功能

- 人员、食物、地点的增删查改管理
- 喂食记录的补录、备注、评分
- 喂食数据统计与可视化监控
- RESTful API 支持，详见 `API_document.md`

## API 文档

详细接口说明请参见 [`API_document.md`](./API_document.md)。

## 技术栈

- Node.js + Express
- SQLite3
- 原生 HTML/CSS/JS

## 适用场景

- 养老院、护理院等需要喂饭记录和满意度管理的场所

## 版本信息

- 当前版本：v1.0.0
- 更新日期：2025-07-07
