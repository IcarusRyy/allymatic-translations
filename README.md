# Allymatic Translations - Strapi CMS

这是一个独立的 Strapi CMS 项目，专门用于管理多语言翻译内容，部署在 Strapi Cloud 上。

## 项目概述

这个项目为 `allymatic-fe` 前端项目提供多语言翻译服务，通过 Strapi Cloud 托管，提供稳定的 API 接口。

## 项目结构

```
allymatic-translations/
├── src/
│   └── api/
│       └── translation/
│           ├── controllers/
│           │   └── translation.ts    # 翻译控制器
│           └── content-types/
│               └── translation/
│                   └── schema.json   # 翻译内容类型定义
├── config/                           # Strapi 配置
├── database/                         # 数据库文件
└── README.md
```

## 快速开始

### 1. 本地开发

```bash
npm run develop
```

访问 http://localhost:1337/admin 创建管理员账户

### 2. 内容类型配置

项目已预配置 `Translation` 内容类型：

- **key** (Text, Optional) - 翻译键名
- **zh_CN** (Text, Required) - 中文翻译
- **en_US** (Text, Required) - 英文翻译

### 3. 权限配置

在 Settings > Users & Permissions Plugin > Roles 中：

1. **Public 角色**：
   - Translation: `find` ✅

2. **Authenticated 角色**：
   - Translation: `find`, `findOne`, `create`, `update`, `delete` ✅

### 4. API 接口

#### 获取翻译数据

```
GET /api/translations?language=zh-CN
GET /api/translations?language=en-US
```

**响应格式**：
```json
{
  "data": {
    "key1": "测试key1",
    "welcome": "欢迎",
    "translation_4": "测试"
  },
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 1,
      "total": 3
    }
  }
}
```

## 部署到 Strapi Cloud

### 1. 推送代码到 GitHub

```bash
git add .
git commit -m "Update translation controller"
git push origin master
```

### 2. Strapi Cloud 自动部署

Strapi Cloud 会自动检测 GitHub 仓库的更新并重新部署。

## 前端集成

在 `allymatic-fe` 项目中，通过以下方式获取翻译：

```typescript
// 从 Strapi Cloud 获取翻译
const response = await fetch('https://your-app.strapiapp.com/api/translations?language=zh-CN');
const data = await response.json();
const translations = data.data; // 直接获取翻译对象
```

## 优势

- ✅ **云端托管**: Strapi Cloud 提供稳定的托管服务
- ✅ **自动部署**: 代码推送后自动重新部署
- ✅ **管理界面**: Strapi 提供友好的管理界面
- ✅ **权限控制**: 细粒度的用户权限管理
- ✅ **API 接口**: 标准的 RESTful API
- ✅ **多语言支持**: 支持中文和英文翻译

## 开发流程

1. **添加翻译**: 在 Strapi 管理界面添加翻译
2. **自动部署**: Strapi Cloud 自动重新部署
3. **前端获取**: 前端从 Strapi Cloud API 获取最新翻译

## 联系信息

如有问题，请查看 GitHub Issues 或联系开发团队。
