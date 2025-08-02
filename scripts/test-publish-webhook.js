const axios = require('axios');

// 测试Strapi的publish事件
const testPublishWebhook = async () => {
  try {
    console.log('🧪 测试Strapi publish事件...');
    
    // 检查Strapi是否运行
    const healthCheck = await axios.get('http://127.0.0.1:1337/_health');
    console.log('✅ Strapi服务正常运行');
    
    // 获取现有的翻译数据
    const response = await axios.get('http://127.0.0.1:1337/api/translations', {
      params: {
        'pagination[pageSize]': 1000,
        'sort[0]': 'key:asc',
      },
    });

    const translations = response.data.data;
    console.log(`📊 找到 ${translations.length} 条翻译数据`);
    
    if (translations.length === 0) {
      console.log('⚠️ 没有找到翻译数据，请先在Strapi管理界面添加数据');
      return;
    }
    
    // 选择第一条数据进行测试
    const testTranslation = translations[0];
    console.log('🎯 测试翻译数据:', testTranslation);
    
    // 检查当前状态
    console.log('📊 当前发布状态:', testTranslation.publishedAt ? '已发布' : '未发布');
    
    if (testTranslation.publishedAt) {
      console.log('ℹ️ 翻译已经是发布状态，尝试取消发布再重新发布...');
      
      // 先取消发布
      try {
        await axios.put(
          `http://127.0.0.1:1337/api/translations/${testTranslation.id}/unpublish`,
          {},
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        console.log('✅ 取消发布成功');
      } catch (unpublishError) {
        console.log('⚠️ 取消发布失败，可能API不支持:', unpublishError.message);
      }
    }
    
    // 尝试发布翻译
    console.log('🔄 尝试发布翻译...');
    try {
      const publishResponse = await axios.put(
        `http://127.0.0.1:1337/api/translations/${testTranslation.id}/publish`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      console.log('✅ 翻译发布成功');
      console.log('📊 发布响应:', publishResponse.data);
    } catch (publishError) {
      console.log('❌ 发布API调用失败:', publishError.message);
      console.log('💡 这可能是因为Strapi的publish API需要管理权限');
      console.log('💡 请通过Strapi管理界面手动发布翻译来测试');
    }
    
    // 等待一段时间让生命周期钩子执行
    console.log('⏳ 等待生命周期钩子执行...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    console.log('✅ 测试完成');
    console.log('💡 请检查Strapi控制台输出，查看是否有生命周期钩子的日志');
    console.log('💡 如果API调用失败，请通过Strapi管理界面手动发布翻译');
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 请确保Strapi服务正在运行：npm run develop');
    }
    
    if (error.response) {
      console.log('📊 错误响应:', error.response.data);
    }
  }
};

testPublishWebhook(); 