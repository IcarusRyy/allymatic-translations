const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// 从 Git 中的翻译数据生成文件
const generateTranslations = async () => {
  try {
    console.log('🔄 开始生成翻译文件...');
    
    // 这里使用你本地配置的翻译数据
    const translations = [
  {
    key: "null",
    zh_CN: "测试a",
    en_US: "testa"
  },
  {
    key: "null",
    zh_CN: "啊啊啊",
    en_US: "aaa"
  },
  {
    key: "test_1",
    zh_CN: "测试1",
    en_US: "test1"
  },
];
    
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
        url: `https://icarusryy.github.io/allymatic-translations/translations/${lang}/translation.json`,
        versionUrl: `https://icarusryy.github.io/allymatic-translations/translations/${lang}/version.json`,
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

generateTranslations();