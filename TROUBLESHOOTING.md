# 故障排除指南

## 问题1：点击publish后没有触发commit

### 原因分析
1. **Git权限问题**：Strapi可能没有足够的权限执行Git操作
2. **路径问题**：脚本路径可能不正确
3. **网络问题**：无法访问本地Strapi API

### 解决方案

#### 1. 检查Git配置
```bash
# 确保在Git仓库中
git status

# 配置Git用户信息（如果未配置）
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

#### 2. 测试生命周期钩子
```bash
# 运行测试脚本
node scripts/test-publish-webhook.js
```

#### 3. 手动测试导出
```bash
# 手动运行导出脚本
node scripts/export-local-translations.js
```

#### 4. 检查Strapi日志
启动Strapi时查看控制台输出，寻找生命周期钩子的日志：
```bash
npm run develop
```

## 问题2：Strapi监听publish API

### 已配置的生命周期钩子
- `afterPublish` - 发布后触发
- `afterUnpublish` - 取消发布后触发
- `afterCreate` - 创建后触发
- `afterUpdate` - 更新后触发

### 验证方法
1. 在Strapi管理界面发布翻译
2. 查看控制台输出，应该看到类似日志：
   ```
   🔄 翻译已发布，开始自动导出...
   📊 事件数据: {...}
   ```

## 问题3：GitHub Actions部署失败

### 错误信息
```
remote: Permission to IcarusRyy/allymatic-translations.git denied to github-actions[bot].
fatal: unable to access 'https://github.com/IcarusRyy/allymatic-translations.git/': The requested URL returned error: 403
```

### 解决方案

#### 1. 检查仓库权限
确保GitHub Actions有足够的权限：
- 进入仓库设置 → Actions → General
- 确保"Workflow permissions"设置为"Read and write permissions"

#### 2. 检查分支保护规则
- 进入仓库设置 → Branches
- 确保main分支没有阻止GitHub Actions推送的规则

#### 3. 使用Personal Access Token（推荐）
1. 创建Personal Access Token：
   - 进入GitHub设置 → Developer settings → Personal access tokens
   - 创建新token，选择`repo`权限
2. 在仓库设置中添加secret：
   - 进入仓库设置 → Secrets and variables → Actions
   - 添加名为`PAT`的secret，值为刚才创建的token
3. 修改workflow文件使用PAT：
   ```yaml
   - uses: actions/checkout@v4
     with:
       token: ${{ secrets.PAT }}
   ```

#### 4. 修改workflow权限
已修改`.github/workflows/deploy.yml`文件，将`contents`权限从`read`改为`write`。

## 调试步骤

### 1. 启动本地服务
```bash
npm run develop
```

### 2. 测试publish事件
```bash
node scripts/test-publish-webhook.js
```

### 3. 手动导出翻译
```bash
node scripts/export-local-translations.js
```

### 4. 手动提交到Git
```bash
git add scripts/generate-translations.js
git commit -m "更新翻译数据"
git push origin main
```

### 5. 检查GitHub Actions
- 进入GitHub仓库 → Actions
- 查看最新的workflow运行状态

## 常见问题

### Q: 为什么publish后没有自动提交？
A: 可能的原因：
1. 不在Git仓库中
2. Git未正确配置
3. 没有文件变更
4. 网络连接问题

### Q: 如何手动触发GitHub Actions？
A: 
1. 进入GitHub仓库 → Actions
2. 选择"Deploy Translation Management System"
3. 点击"Run workflow"

### Q: 如何查看Strapi的生命周期钩子日志？
A: 
1. 启动Strapi：`npm run develop`
2. 在管理界面发布翻译
3. 查看控制台输出

## 联系支持
如果问题仍然存在，请：
1. 检查所有日志输出
2. 确认Git配置正确
3. 验证GitHub仓库权限设置 