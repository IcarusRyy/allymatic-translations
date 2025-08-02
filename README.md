# Allymatic Translations - Strapi CMS

这是一个独立的 Strapi CMS 项目，专门用于管理多语言翻译内容。

## 项目结构

```
allymatic-translations/
├── .github/workflows/
│   └── deploy.yml          # GitHub Actions 部署配置
├── scripts/
│   └── generate-translations.js  # 翻译生成脚本
├── dist/                   # 生成的静态文件
│   ├── index.json
│   └── translations/
│       ├── zh-CN/
│       │   ├── translation.json
│       │   └── version.json
│       └── en-US/
│           ├── translation.json
│           └── version.json
└── README.md
```

## 快速开始

### 1. 启动 Strapi

```bash
npm run develop
```

访问 http://localhost:1337/admin 创建管理员账户

### 2. 配置内容类型

在 Strapi 管理后台创建 `Translation` 内容类型：

- **key** (Text, Required, Unique) - 翻译键名
- **zh-CN** (Text, Required) - 中文翻译
- **en-US** (Text, Required) - 英文翻译
- **category** (Text, Optional) - 分类
- **description** (Text, Optional) - 描述

### 3. 配置权限

在 Settings > Users & Permissions Plugin > Roles 中：

1. **Public 角色**：
   - Translation: `find` ✅

2. **Authenticated 角色**：
   - Translation: `find`, `findOne`, `create`, `update`, `delete` ✅

### 4. 获取 API Token

1. 进入 Settings > API Tokens
2. 创建新的 API Token
3. 复制 Token 到 GitHub Secrets

### 5. 配置 GitHub Secrets

在 GitHub 仓库设置中添加以下 secrets：

- `STRAPI_URL`: Strapi 服务地址 (如: http://localhost:1337)
- `STRAPI_API_TOKEN`: Strapi API Token

### 6. 测试翻译生成

```bash
node scripts/generate-translations.js
```

### 7. 部署到 GitHub

```bash
git add .
git commit -m "Initial Strapi translations setup"
git push origin main
```

## 自动更新机制

### GitHub Actions 配置

- **触发条件**：
  - 代码推送
  - 手动触发
  - **每分钟自动执行** ⏰

- **执行步骤**：
  1. 安装依赖
  2. 构建 Strapi
  3. 生成翻译文件
  4. 部署到 GitHub Pages

### 生成的文件

每次执行会生成以下文件：

```
dist/
├── index.json                    # 翻译索引
└── translations/
    ├── zh-CN/
    │   ├── translation.json      # 中文翻译
    │   └── version.json         # 版本信息
    └── en-US/
        ├── translation.json      # 英文翻译
        └── version.json         # 版本信息
```

## API 接口

### 获取翻译索引

```
GET https://your-username.github.io/allymatic-translations/index.json
```

### 获取翻译文件

```
GET https://your-username.github.io/allymatic-translations/translations/zh-CN/translation.json
GET https://your-username.github.io/allymatic-translations/translations/en-US/translation.json
```

### 获取版本信息

```
GET https://your-username.github.io/allymatic-translations/translations/zh-CN/version.json
GET https://your-username.github.io/allymatic-translations/translations/en-US/version.json
```

## 前端集成

在 `allymatic-fe` 项目中，可以通过以下方式获取翻译：

```typescript
const GITHUB_PAGES_URL = 'https://your-username.github.io/allymatic-translations';

// 获取翻译
const response = await fetch(`${GITHUB_PAGES_URL}/translations/zh-CN/translation.json`);
const translations = await response.json();

// 获取版本信息
const versionResponse = await fetch(`${GITHUB_PAGES_URL}/translations/zh-CN/version.json`);
const version = await versionResponse.json();
```

## 优势

- ✅ **独立项目**: 翻译管理与前端项目分离
- ✅ **自动更新**: 每分钟自动同步最新翻译
- ✅ **版本控制**: 完整的版本历史管理
- ✅ **免费托管**: GitHub Pages 免费托管
- ✅ **CDN 加速**: 全球 CDN 分发
- ✅ **管理界面**: Strapi 提供友好的管理界面
- ✅ **权限控制**: 细粒度的用户权限管理

## 开发流程

1. **添加翻译**: 在 Strapi 管理界面添加翻译
2. **自动同步**: GitHub Actions 每分钟自动同步
3. **前端获取**: 前端从 GitHub Pages 获取最新翻译
4. **版本检查**: 支持版本检查和增量更新

## 故障排除

### 常见问题

1. **GitHub Actions 失败**
   - 检查 Secrets 配置
   - 确认 Strapi 服务可访问
   - 查看 Actions 日志

2. **翻译文件未更新**
   - 检查 Strapi 权限配置
   - 确认 API Token 有效
   - 手动触发 Actions

3. **前端无法获取翻译**
   - 检查 GitHub Pages 是否启用
   - 确认 URL 配置正确
   - 查看网络请求状态

## 联系信息

如有问题，请查看 GitHub Issues 或联系开发团队。
