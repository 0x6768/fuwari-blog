// 兼容老浏览器的现代特性检测
// 用最基础的ES5语法编写，确保IE也能运行

// 存储操作
function safeStorageSet(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (e) {
    return false;
  }
}

function safeStorageGet(key) {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    return null;
  }
}

// 特性检测 - 全部用基础语法
var FeatureCheck = {
  // 检查可选链 (用安全的eval)
  optionalChaining: function() {
    try {
      // 用Function构造函数，避免直接eval
      return new Function('var obj = {}; return obj?.a === undefined')() === true;
    } catch (e) {
      return false;
    }
  },
  
  // 检查空值合并
  nullishCoalescing: function() {
    try {
      return new Function('return null ?? "default"')() === 'default';
    } catch (e) {
      return false;
    }
  },
  
  // 检查OKLCH颜色 - 关键特性！
  oklch: function() {
    try {
      // 检测真实的OKLCH支持
      if (typeof CSS === 'undefined' || !CSS.supports) {
        return false;
      }
      return CSS.supports('color', 'oklch(70% 0.1 240)');
    } catch (e) {
      return false;
    }
  },
  
  // 检查:has()选择器
  hasSelector: function() {
    try {
      if (typeof CSS === 'undefined' || !CSS.supports) {
        return false;
      }
      return CSS.supports('selector', ':has(a)');
    } catch (e) {
      return false;
    }
  },
  
  // 检查CSS容器查询
  containerQueries: function() {
    try {
      if (typeof CSS === 'undefined' || !CSS.supports) {
        return false;
      }
      return CSS.supports('container-type', 'inline-size');
    } catch (e) {
      return false;
    }
  },
  
  // 基础检查：Fetch
  fetchAPI: function() {
    return typeof fetch === 'function';
  },
  
  // 基础检查：Promise
  promise: function() {
    return typeof Promise !== 'undefined';
  }
};

// 检测环境
function detectEnvironment() {
  var f = FeatureCheck;
  var ignoreWarning = safeStorageGet('ignoreBrowserWarning');
  
  // 核心检查
  var hasModernJS = f.optionalChaining() && f.nullishCoalescing();
  var hasModernCSS = f.oklch() ;
  var hasEssentials = f.fetchAPI() && f.promise();
  
  var result = {
    level: 'unknown',
    modernJS: hasModernJS,
    modernCSS: hasModernCSS,
    essentials: hasEssentials
  };
  
  // 判断级别
  if (!hasEssentials) {
    result.level = 'unsupported';
    result.message = '浏览器版本太低，可能无法正常运行';
  } 
  else if (hasModernJS && hasModernCSS) {
    result.level = 'modern';
    result.message = '现代浏览器（支持OKLCH等新特性）';
  }
  else if (hasModernJS && !hasModernCSS) {
    result.level = 'basic';
    result.message = 'JavaScript较新，但CSS特性较旧';
  }
  else {
    result.level = 'old';
    result.message = '浏览器版本较旧';
  }
  
  // 控制台输出
  if (window.console && typeof console.log === 'function') {
    console.log('浏览器检测:');
    console.log('- 级别:', result.level);
    console.log('- 消息:', result.message);
    console.log('- 基础功能:', hasEssentials);
    console.log('- 现代JS:', hasModernJS);
    console.log('- 现代CSS:', hasModernCSS);
  }
  
  return result;
}

// 简单弹窗提示
function showSimpleAlert(result) {
  // 检查是否已忽略
  var ignoreKey = 'ignoreBrowserWarning_' + result.level;
  var hasIgnored = safeStorageGet(ignoreKey);
  
  if (hasIgnored) {
    return;
  }
  
  // 只在需要时显示
  if (result.level === 'unsupported' || result.level === 'old') {
    var userChoice = window.confirm(
      result.message + 
      '\n\n点击"确定"则不再提示，"取消"则关闭警告。' +
      '\n\n建议升级到最新版Chrome/Edge/Firefox。'
    );
    
    if (userChoice) {
      safeStorageSet(ignoreKey, 'true');
    }
  }
  else if (result.level === 'basic') {
    var userChoice = window.confirm(
      '您的浏览器JavaScript较新，但缺少最新的CSS特性（如OKLCH颜色）。' +
      '\n\n功能可正常使用，但视觉体验可能不是最佳。' +
      '\n\n点击"确定"则不再提示，"取消"则关闭。'
    );
    
    if (userChoice) {
      safeStorageSet(ignoreKey, 'true');
    }
  }
}

// 页面加载时执行
function initBrowserCheck() {
  // 延迟执行，不阻塞页面加载
  setTimeout(function() {
    try {
      var result = detectEnvironment();
      showSimpleAlert(result);
    } catch (e) {
      // 静默失败，不影响页面功能
      if (window.console && typeof console.error === 'function') {
        console.error('浏览器检测失败:', e);
      }
    }
  }, 1000);
}

// 多种加载方式
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBrowserCheck);
} else {
  initBrowserCheck();
}

// 暴露到全局，方便调试
window.browserCheck = {
  detect: detectEnvironment,
  features: FeatureCheck
};