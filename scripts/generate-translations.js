const fs = require('fs');
const path = require('path');
const axios = require('axios');
const crypto = require('crypto');

const STRAPI_URL = process.env.STRAPI_URL || 'http://127.0.0.1:1337';
const API_TOKEN = process.env.STRAPI_API_TOKEN;

// 确保输出目录存在
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// 生成翻译文件
const generateTranslations = async () => {
  try {
    console.log('🔄 开始生成翻译文件...');
    
    // 从 Strapi 获取翻译
    const response = await axios.get(`${STRAPI_URL}/api/translations`, {
      headers: API_TOKEN ? {
        'Authorization': `Bearer ${API_TOKEN}`,
      } : {},
      params: {
        'pagination[pageSize]': 1000,
        'sort[0]': 'key:asc',
      },
    });

    const translations = response.data.data;
    
    // 按语言分组
    const grouped = {
      'zh-CN': {},
      'en-US': {},
    };

    translations.forEach(item => {
      const { key, zh_CN, en_US, category } = item;
      if (zh_CN) grouped['zh-CN'][key] = zh_CN;
      if (en_US) grouped['en-US'][key] = en_US;
    });

    // 创建输出目录
    const distDir = path.join(__dirname, '../dist');
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
        version: `1.${Date.now()}`,
        timestamp: new Date().toISOString(),
        checksum,
        totalKeys: Object.keys(data).length,
        lastModified: new Date().toISOString(),
      };
      
      const versionFile = path.join(langDir, 'version.json');
      fs.writeFileSync(versionFile, JSON.stringify(version, null, 2));
      
      console.log(`✅ 生成 ${lang} 翻译文件，共 ${Object.keys(data).length} 个键`);
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
        version: `1.${Date.now()}`,
        timestamp: new Date().toISOString(),
        checksum,
        totalKeys: Object.keys(data).length,
        url: `https://your-username.github.io/allymatic-translations/translations/${lang}/translation.json`,
        versionUrl: `https://your-username.github.io/allymatic-translations/translations/${lang}/version.json`,
      };
    });

    const indexFile = path.join(distDir, 'index.json');
    fs.writeFileSync(indexFile, JSON.stringify(index, null, 2));
    
    console.log('🎉 翻译文件生成完成');
    console.log(`📊 统计信息:`);
    console.log(`   - 支持语言: ${Object.keys(grouped).length}`);
    console.log(`   - 总翻译数: ${Object.values(grouped).reduce((sum, data) => sum + Object.keys(data).length, 0)}`);
    console.log(`   - 最后更新: ${new Date().toLocaleString()}`);
    
  } catch (error) {
    console.error('❌ 生成翻译文件失败:', error.message);
    process.exit(1);
  }
};

// 主函数
const main = async () => {
  try {
    await generateTranslations();
  } catch (error) {
    console.error('❌ 执行失败:', error.message);
    process.exit(1);
  }
};

// 如果直接运行此脚本
if (require.main === module) {
  main();
}

module.exports = { generateTranslations }; 