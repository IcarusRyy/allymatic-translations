const fs = require('fs');
const path = require('path');
const axios = require('axios');

// 从本地 Strapi 导出翻译数据
const exportTranslations = async () => {
  try {
    console.log('🔄 从本地 Strapi 导出翻译数据...');
    
    // 从本地 Strapi 获取翻译
    const response = await axios.get('http://127.0.0.1:1337/api/translations', {
      params: {
        'pagination[pageSize]': 1000,
        'sort[0]': 'key:asc',
      },
    });

    const translations = response.data.data;
    
    if (translations.length === 0) {
      console.log('⚠️ 本地 Strapi 中没有找到翻译数据');
      console.log('请先在 Strapi 管理界面添加翻译数据');
      return;
    }

    console.log(`✅ 找到 ${translations.length} 条翻译数据`);

    // 生成 generate-translations.js 的内容
    let scriptContent = `const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// 从 Git 中的翻译数据生成文件
const generateTranslations = async () => {
  try {
    console.log('🔄 开始生成翻译文件...');
    
    // 这里使用你本地配置的翻译数据
    const translations = [
`;

    // 添加翻译数据
    translations.forEach(item => {
      const { key, zh_CN, en_US } = item;
      scriptContent += `  {
    key: "${key}",
    zh_CN: "${zh_CN || ''}",
    en_US: "${en_US || ''}"
  },
`;
    });

    scriptContent += `];
    
    // 按语言分组
    const grouped = {
      'zh-CN': {},
      'en-US': {},
    };

    translations.forEach(item => {
      const { key, zh_CN, en_US } = item;
      if (zh_CN) grouped['zh-CN'][key] = zh_CN;
      if (en_US) grouped['en-US'][key] = en_US;
    });

    // 创建输出目录
    const distDir = path.join(__dirname, '../dist');
    const ensureDir = (dir) => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    };
    
    ensureDir(distDir);
    ensureDir(path.join(distDir, 'translations'));

    // 生成翻译文件
    Object.entries(grouped).forEach(([lang, data]) => {
      const langDir = path.join(distDir, 'translations', lang);
      ensureDir(langDir);
      
      // 生成翻译文件
      const translationFile = path.join(langDir, 'translation.json');
      fs.writeFileSync(translationFile, JSON.stringify(data, null, 2));
      
      // 生成版本信息
      const checksum = crypto.createHash('sha256')
        .update(JSON.stringify(data))
        .digest('hex');
      
      const version = {
        version: \`1.\${Date.now()}\`,
        timestamp: new Date().toISOString(),
        checksum,
        totalKeys: Object.keys(data).length,
        lastModified: new Date().toISOString(),
      };
      
      const versionFile = path.join(langDir, 'version.json');
      fs.writeFileSync(versionFile, JSON.stringify(version, null, 2));
      
      console.log(\`✅ 生成 \${lang} 翻译文件，共 \${Object.keys(data).length} 个键\`);
    });

    // 生成索引文件
    const index = {
      languages: {},
      lastUpdated: new Date().toISOString(),
      totalVersions: Object.keys(grouped).length,
    };

    Object.entries(grouped).forEach(([lang, data]) => {
      const checksum = crypto.createHash('sha256')
        .update(JSON.stringify(data))
        .digest('hex');
      
      index.languages[lang] = {
        version: \`1.\${Date.now()}\`,
        timestamp: new Date().toISOString(),
        checksum,
        totalKeys: Object.keys(data).length,
        url: \`https://icarusryy.github.io/allymatic-translations/translations/\${lang}/translation.json\`,
        versionUrl: \`https://icarusryy.github.io/allymatic-translations/translations/\${lang}/version.json\`,
      };
    });

    const indexFile = path.join(distDir, 'index.json');
    fs.writeFileSync(indexFile, JSON.stringify(index, null, 2));
    
    console.log('✅ 生成翻译文件完成');
  } catch (error) {
    console.error('❌ 生成翻译文件失败:', error);
    process.exit(1);
  }
};

generateTranslations();`;

    // 写入文件
    const scriptPath = path.join(__dirname, 'generate-translations.js');
    fs.writeFileSync(scriptPath, scriptContent);
    
    console.log('✅ 翻译数据已导出到 generate-translations.js');
    console.log('📝 下一步：提交到 Git 并推送');
    console.log('   git add scripts/generate-translations.js');
    console.log('   git commit -m "更新翻译数据"');
    console.log('   git push');
    
  } catch (error) {
    console.error('❌ 导出翻译数据失败:', error.message);
    console.log('💡 请确保本地 Strapi 正在运行：npm run develop');
  }
};

exportTranslations(); 