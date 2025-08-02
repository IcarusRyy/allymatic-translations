const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// 监听数据库文件变化
const dbPath = path.join(__dirname, '../.tmp/data.db');
const lastModifiedPath = path.join(__dirname, '.last-export');

console.log('🔄 开始监听数据库变化...');
console.log('📁 数据库路径:', dbPath);

// 检查文件是否存在
if (!fs.existsSync(dbPath)) {
  console.log('⚠️ 数据库文件不存在，等待创建...');
}

// 获取文件修改时间
const getFileModifiedTime = (filePath) => {
  try {
    const stats = fs.statSync(filePath);
    return stats.mtime.getTime();
  } catch (error) {
    return 0;
  }
};

// 读取上次导出时间
const getLastExportTime = () => {
  try {
    if (fs.existsSync(lastModifiedPath)) {
      return parseInt(fs.readFileSync(lastModifiedPath, 'utf8'));
    }
  } catch (error) {
    console.error('读取上次导出时间失败:', error);
  }
  return 0;
};

// 保存导出时间
const saveExportTime = () => {
  try {
    fs.writeFileSync(lastModifiedPath, Date.now().toString());
  } catch (error) {
    console.error('保存导出时间失败:', error);
  }
};

// 执行导出
const runExport = () => {
  console.log('🔄 检测到数据库变化，开始导出...');
  
  exec('node scripts/export-local-translations.js', (error, stdout, stderr) => {
    if (error) {
      console.error('❌ 导出失败:', error);
      return;
    }
    
    console.log('✅ 导出成功:', stdout);
    
    // 自动提交到 Git
    const gitCommands = [
      'git add scripts/generate-translations.js',
      'git commit -m "自动更新翻译数据"',
      'git push'
    ];
    
    exec(gitCommands.join(' && '), (gitError, gitStdout, gitStderr) => {
      if (gitError) {
        console.error('❌ Git 提交失败:', gitError);
        return;
      }
      
      console.log('✅ 自动提交到 Git 成功:', gitStdout);
      console.log('🔄 GitHub Actions 将自动部署翻译文件');
      saveExportTime();
    });
  });
};

// 检查变化
const checkForChanges = () => {
  const currentModifiedTime = getFileModifiedTime(dbPath);
  const lastExportTime = getLastExportTime();
  
  if (currentModifiedTime > lastExportTime && currentModifiedTime > 0) {
    console.log('📊 检测到数据库变化:', new Date(currentModifiedTime));
    runExport();
  }
};

// 每秒检查一次
setInterval(checkForChanges, 1000);

console.log('✅ 监听器已启动，每秒检查一次数据库变化');
console.log('💡 在 Strapi 中修改翻译后，系统会自动导出并提交到 Git'); 