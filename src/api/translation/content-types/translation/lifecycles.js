const { exec } = require('child_process');
const path = require('path');

module.exports = {
  async afterPublish(event) {
    console.log('🔄 翻译已发布，开始自动导出...');
    console.log('📊 事件数据:', JSON.stringify(event, null, 2));
    
    try {
      // 运行导出脚本
      const scriptPath = path.join(__dirname, '../../../../../scripts/export-local-translations.js');
      console.log('📁 脚本路径:', scriptPath);
      
      // 检查文件是否存在
      const fs = require('fs');
      if (!fs.existsSync(scriptPath)) {
        console.error('❌ 脚本文件不存在:', scriptPath);
        return;
      }
      
      exec(`node ${scriptPath}`, (error, stdout, stderr) => {
        if (error) {
          console.error('❌ 自动导出失败:', error);
          return;
        }
        
        console.log('✅ 自动导出成功:', stdout);
        
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
        });
      });
    } catch (error) {
      console.error('❌ 自动导出过程中出错:', error);
    }
  },
  
  async afterUnpublish(event) {
    console.log('🔄 翻译已取消发布，开始自动导出...');
    console.log('📊 事件数据:', JSON.stringify(event, null, 2));
    
    try {
      // 运行导出脚本
      const scriptPath = path.join(__dirname, '../../../../../scripts/export-local-translations.js');
      console.log('📁 脚本路径:', scriptPath);
      
      // 检查文件是否存在
      const fs = require('fs');
      if (!fs.existsSync(scriptPath)) {
        console.error('❌ 脚本文件不存在:', scriptPath);
        return;
      }
      
      exec(`node ${scriptPath}`, (error, stdout, stderr) => {
        if (error) {
          console.error('❌ 自动导出失败:', error);
          return;
        }
        
        console.log('✅ 自动导出成功:', stdout);
        
        // 自动提交到 Git
        const gitCommands = [
          'git add scripts/generate-translations.js',
          'git commit -m "自动更新翻译数据（取消发布）"',
          'git push'
        ];
        
        exec(gitCommands.join(' && '), (gitError, gitStdout, gitStderr) => {
          if (gitError) {
            console.error('❌ Git 提交失败:', gitError);
            return;
          }
          
          console.log('✅ 自动提交到 Git 成功:', gitStdout);
          console.log('🔄 GitHub Actions 将自动部署翻译文件');
        });
      });
    } catch (error) {
      console.error('❌ 自动导出过程中出错:', error);
    }
  },
  
  // 尝试其他生命周期钩子
  async afterCreate(event) {
    console.log('🔄 翻译已创建，开始自动导出...');
    console.log('📊 事件数据:', JSON.stringify(event, null, 2));
  },
  
  async afterUpdate(event) {
    console.log('🔄 翻译已更新，开始自动导出...');
    console.log('📊 事件数据:', JSON.stringify(event, null, 2));
  }
};
