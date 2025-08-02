/**
 * translation controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::translation.translation', ({ strapi }) => ({
  // 重写 find 方法来返回多语言格式
  async find(ctx) {
    try {
      // 调用原始的 find 方法
      const result = await strapi.entityService.findMany('api::translation.translation', {
        populate: '*',
        sort: { key: 'asc' }
      });
      
      // 获取查询参数中的语言
      const { language } = ctx.query;
      
      // 转换数据格式
      const translations: Record<string, string> = {};
      
      result.forEach((item: any) => {
        const key = item.key || `translation_${item.id}`;
        let value = '';
        
        if (language === 'zh-CN') {
          value = item.zh_CN || '';
        } else if (language === 'en-US') {
          value = item.en_US || '';
        } else {
          // 默认返回英文
          value = item.en_US || '';
        }
        
        if (value) {
          translations[key] = value;
        }
      });
      
      // 返回转换后的格式
      return {
        data: translations,
        meta: {
          language,
          total: Object.keys(translations).length,
          source: 'strapi-cloud'
        }
      };
    } catch (error) {
      console.error('Translation controller error:', error);
      throw error;
    }
  },
  
  // 重写 findOne 方法
  async findOne(ctx) {
    const { data } = await super.findOne(ctx);
    
    const { language } = ctx.query;
    const key = data.attributes.key || `translation_${data.id}`;
    let value = '';
    
    if (language === 'zh-CN') {
      value = data.attributes.zh_CN || '';
    } else if (language === 'en-US') {
      value = data.attributes.en_US || '';
    } else {
      value = data.attributes.en_US || '';
    }
    
    return {
      data: {
        key,
        value,
        language
      }
    };
  }
}));
