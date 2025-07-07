# 喂饭机器人系统 API 文档

## 概述

本文档描述了喂饭机器人系统的 RESTful API 接口，用于管理喂食记录、人员、食物和地点信息，以及记录满意度评分。系统包含数据补录和监控两大核心功能。

**基础 URL**: `http://localhost:3000/api`

**数据格式**: JSON

**状态码**:
- 200 OK: 请求成功
- 201 Created: 资源创建成功
- 400 Bad Request: 请求参数错误
- 404 Not Found: 资源不存在
- 500 Internal Server Error: 服务器内部错误

---

## 人员管理

### 获取所有人员
- **URL**: `/persons`
- **方法**: `GET`
- **描述**: 获取系统中所有被喂食人员的信息
- **响应格式**:
  ```json
  [
    {
      "person_id": 1,
      "name": "张三",
      "age": 75,
      "dietary_needs": "低盐，低糖",
      "created_at": "2025-07-07 08:30:45"
    },
    {
      "person_id": 2,
      "name": "李四",
      "age": 82,
      "dietary_needs": "软食，易消化",
      "created_at": "2025-07-07 08:31:22"
    }
  ]
  ```

---

## 食物管理

### 获取所有食物
- **URL**: `/foods`
- **方法**: `GET`
- **描述**: 获取系统中所有食物的信息
- **响应格式**:
  ```json
  [
    {
      "food_id": 1,
      "name": "燕麦粥",
      "category": "主食",
      "calories": 68,
      "description": "高纤维，易消化"
    },
    {
      "food_id": 2,
      "name": "水蒸蛋",
      "category": "蛋白质",
      "calories": 54,
      "description": "软糯，易吞咽"
    }
  ]
  ```

---

## 地点管理

### 获取所有地点
- **URL**: `/locations`
- **方法**: `GET`
- **描述**: 获取系统中所有喂食地点的信息
- **响应格式**:
  ```json
  [
    {
      "location_id": 1,
      "name": "客厅餐桌",
      "description": "靠近窗户的主餐桌"
    },
    {
      "location_id": 2,
      "name": "卧室床头",
      "description": "有可调节高度的床头桌"
    }
  ]
  ```

---

## 喂食记录管理

### 创建喂食记录
- **URL**: `/feeding`
- **方法**: `POST`
- **描述**: 记录一次喂食事件
- **请求参数**:

  | 参数名         | 类型    | 必填 | 描述             | 示例值   |
  |----------------|---------|------|------------------|----------|
  | person_id      | int     | 是   | 被喂食人员ID     | 1        |
  | food_id        | int     | 是   | 食物ID           | 2        |
  | location_id    | int     | 是   | 地点ID           | 3        |
  | portion_size   | float   | 否   | 喂食量(克)       | 150.5    |
  | notes          | string  | 否   | 备注信息         | 老人食欲不错 |

- **请求示例**:
  ```json
  {
    "person_id": 1,
    "food_id": 2,
    "location_id": 3,
    "portion_size": 150.5,
    "notes": "老人食欲不错"
  }
  ```

- **成功响应 (201 Created)**:
  ```json
  {
    "record_id": 123,
    "message": "喂食记录添加成功",
    "details": {
      "person": "张三",
      "food": "水蒸蛋",
      "location": "客厅餐桌",
      "feeding_time": "2025-07-07 10:30:45"
    }
  }
  ```

### 获取所有喂食记录
- **URL**: `/feedings`
- **方法**: `GET`
- **描述**: 获取所有喂食记录详情
- **响应格式**:
  ```json
  [
    {
      "record_id": 1,
      "feeding_time": "2025-07-07 10:30:45",
      "person_name": "张三",
      "food_name": "燕麦粥",
      "food_category": "主食",
      "location_name": "客厅餐桌",
      "portion_size": 150.0,
      "notes": "温度适中，老人吃得顺利",
      "score": 4,
      "satisfaction": "吃得很好，但略嫌淡"
    },
    {
      "record_id": 2,
      "feeding_time": "2025-07-07 11:15:22",
      "person_name": "李四",
      "food_name": "鸡胸肉泥",
      "food_category": "蛋白质",
      "location_name": "阳台小桌",
      "portion_size": 100.0,
      "notes": "添加了少量橄榄油",
      "score": 5,
      "satisfaction": "非常喜欢，要求明天再来一份"
    }
  ]
  ```

### 获取需要补录的记录
- **URL**: `/feedings/incomplete`
- **方法**: `GET`
- **描述**: 获取缺少备注或评分的喂食记录
- **响应格式**:
  ```json
  [
    {
      "record_id": 7,
      "feeding_time": "2025-07-07 14:20:00",
      "person_name": "张三",
      "food_name": "水蒸蛋",
      "location_name": "客厅餐桌"
    },
    {
      "record_id": 8,
      "feeding_time": "2025-07-07 15:30:00",
      "person_name": "李四",
      "food_name": "燕麦粥",
      "location_name": "卧室床头"
    }
  ]
  ```

---

## 备注和评分管理

### 添加备注到喂食记录
- **URL**: `/record/:record_id/notes`
- **方法**: `POST`
- **描述**: 为指定喂食记录添加备注
- **URL参数**:
  
  | 参数名     | 类型 | 必填 | 描述          |
  |------------|------|------|---------------|
  | record_id  | int  | 是   | 喂食记录ID    |

- **请求参数**:

  | 参数名   | 类型   | 必填 | 描述             | 示例值                 |
  |----------|--------|------|------------------|------------------------|
  | notes    | string | 是   | 备注内容         | 老人食欲很好           |

- **请求示例**:
  ```json
  {
    "notes": "老人食欲很好"
  }
  ```

- **成功响应 (200 OK)**:
  ```json
  {
    "message": "备注添加成功"
  }
  ```

### 添加评分到喂食记录
- **URL**: `/record/:record_id/rating`
- **方法**: `POST`
- **描述**: 为指定喂食记录添加满意度评分
- **URL参数**:
  
  | 参数名     | 类型 | 必填 | 描述          |
  |------------|------|------|---------------|
  | record_id  | int  | 是   | 喂食记录ID    |

- **请求参数**:

  | 参数名   | 类型   | 必填 | 描述             | 示例值                 |
  |----------|--------|------|------------------|------------------------|
  | score    | int    | 是   | 满意度评分(1-5) | 4                      |
  | comment  | string | 否   | 评语             | 温度合适，但份量偏多   |

- **请求示例**:
  ```json
  {
    "score": 4,
    "comment": "温度合适，但份量偏多"
  }
  ```

- **成功响应 (200 OK)**:
  ```json
  {
    "message": "评分添加成功"
  }
  ```

---

## 监控统计

### 获取喂食统计数据
- **URL**: `/stats`
- **方法**: `GET`
- **描述**: 获取喂食统计数据
- **响应格式**:
  ```json
  {
    "today_count": 3,
    "avg_rating": 4.3,
    "popular_food": "燕麦粥",
    "recent_feedings": [
      {
        "record_id": 9,
        "feeding_time": "2025-07-07 18:45:00",
        "person_name": "王五",
        "food_name": "米糊",
        "location_name": "卧室床头",
        "score": 4
      },
      {
        "record_id": 8,
        "feeding_time": "2025-07-07 15:30:00",
        "person_name": "李四",
        "food_name": "燕麦粥",
        "location_name": "卧室床头",
        "score": 5
      }
    ]
  }
  ```

### 获取人员喂食统计
- **URL**: `/stats/person/:person_id`
- **方法**: `GET`
- **描述**: 获取特定人员的喂食统计
- **URL参数**:
  
  | 参数名     | 类型 | 必填 | 描述          |
  |------------|------|------|---------------|
  | person_id  | int  | 是   | 人员ID        |

- **响应格式**:
  ```json
  {
    "person_id": 1,
    "name": "张三",
    "feedings_last_7_days": 5,
    "avg_portion_size": 145.2,
    "favorite_food": "水蒸蛋",
    "feeding_history": [
      {
        "record_id": 1,
        "feeding_time": "2025-07-07 10:30:45",
        "food_name": "燕麦粥",
        "portion_size": 150.0,
        "score": 4
      },
      {
        "record_id": 7,
        "feeding_time": "2025-07-07 14:20:00",
        "food_name": "水蒸蛋",
        "portion_size": 120.0,
        "score": 5
      }
    ]
  }
  ```

---

## 前端界面访问

### 数据补录页面
- **URL**: `/record.html`
- **方法**: `GET`
- **描述**: 访问数据补录页面

### 监控页面
- **URL**: `/monitor.html`
- **方法**: `GET`
- **描述**: 访问喂食记录监控页面

---

## 错误处理

所有错误响应都使用以下格式：
```json
{
  "error": "错误描述信息"
}
```

### 常见错误示例

1. **缺少必要参数**:
   ```json
   {
     "error": "Missing required field: person_id"
   }
   ```

2. **记录不存在**:
   ```json
   {
     "error": "Feeding record not found with ID: 999"
   }
   ```

3. **数据库错误**:
   ```json
   {
     "error": "Database error: SQLITE_ERROR: no such table: nonexistent_table"
   }
   ```

---

## 使用示例

### 添加喂食记录 (cURL)
```bash
curl -X POST "http://localhost:3000/api/feeding" \
  -H "Content-Type: application/json" \
  -d '{
    "person_id": 1,
    "food_id": 2,
    "location_id": 3,
    "portion_size": 180.0,
    "notes": "下午加餐"
  }'
```

### 为记录添加备注 (cURL)
```bash
curl -X POST "http://localhost:3000/api/record/7/notes" \
  -H "Content-Type: application/json" \
  -d '{
    "notes": "老人食欲很好"
  }'
```

### 为记录添加评分 (cURL)
```bash
curl -X POST "http://localhost:3000/api/record/8/rating" \
  -H "Content-Type: application/json" \
  -d '{
    "score": 5,
    "comment": "非常满意"
  }'
```

### 获取需要补录的记录 (cURL)
```bash
curl "http://localhost:3000/api/feedings/incomplete"
```

### 获取喂食统计数据 (cURL)
```bash
curl "http://localhost:3000/api/stats"
```

---

## 版本信息

- **当前版本**: v1.0.0
- **更新日期**: 2025-07-07

此文档详细描述了喂饭机器人系统的所有API接口及其使用方法。如需进一步帮助或报告问题，请联系系统管理员。