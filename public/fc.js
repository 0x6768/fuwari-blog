
localStorage.setItem("hue", 240);
localStorage.removeItem("immersiveTranslatePerformanceData");
const FeatureCheck = (() => {
  const result = {};

  /* ---------- JS ---------- */
  result.optionalChaining = () => {
    try { eval('({})?.a'); return true; } catch { return false; }
  };

  result.nullishCoalescing = () => {
    try { eval('null ?? 1'); return true; } catch { return false; }
  };

  result.replaceAll = () => typeof ''.replaceAll === 'function';

  result.topLevelAwait = () => {
    try { new Function('await 1'); return true; } catch { return false; }
  };

  result.asyncAwait = () => {
    try { eval('async function t(){}'); return true; } catch { return false; }
  };

  /* ---------- CSS ---------- */
  result.oklch = () => CSS.supports('color', 'oklch(70% 0.5 0)');

  result.hasSelector = () => CSS.supports('selector(:has(*))');

  result.cssLayer = () => {
    try {
      const s = document.createElement('style');
      s.textContent = '@layer a {}';
      document.head.appendChild(s);
      const ok = s.sheet.cssRules.length > 0;
      s.remove();
      return ok;
    } catch {
      return false;
    }
  };

  result.cssVars = () => CSS.supports('--x', '0');

  /* ---------- APIs ---------- */
  result.fetchAPI = () => typeof fetch === 'function';

  result.webComponents = () =>
    typeof customElements === 'object' &&
    typeof customElements.define === 'function';

  result.intl = () =>
    typeof Intl !== 'undefined' &&
    typeof Intl.NumberFormat === 'function';

  return result;
})();
function detectEnvironment() {
  const f = FeatureCheck;
  const checks = {
    js2020: f.optionalChaining() && f.nullishCoalescing(),
    cssModern: f.oklch() && f.hasSelector(),
    webPlatform: f.fetchAPI() && f.webComponents()
  };

  const allGood = checks.js2020 && checks.cssModern && checks.webPlatform;
  let guess = '未知浏览器';

  // 检查用户是否已经选择过"忽略"
  const ignoreWarning = localStorage.getItem('ignoreBrowserWarning');
  
  if (allGood) {
    guess = '✅ 现代浏览器（Chrome 110+ / Safari 16+ / Edge 110+）';
  } else if (checks.js2020 && !checks.cssModern) {
    guess = '⚠️ JS 较新，但 CSS 偏旧（可能是老版 Chrome / Firefox ESR）';
    
    // 只有在用户没有选择"忽略"时才弹出提示
    if (!ignoreWarning) {
      const userChoice = confirm("浏览器版本过低，可能会影响浏览体验\n点击'确定'则不再提示，'取消'则关闭");
      
      if (userChoice) {
        // 用户点击"确定"，记录选择，下次不再提示
        localStorage.setItem('ignoreBrowserWarning', 'true');
      }
      // 用户点击"取消"，什么都不做，下次还会提示
    }
  } else if (!checks.js2020) {
    guess = '❌ 非常旧的浏览器（不支持 ES2020，可能 < Chrome 80）';
    
    if (!ignoreWarning) {
      const userChoice = confirm("浏览器版本太低，可能无法正常运行\n点击'确定'则不再提示，'取消'则关闭");
      
      if (userChoice) {
        localStorage.setItem('ignoreBrowserWarning', 'true');
      }
    }
  }

  console.table(checks);
  console.log('推测浏览器环境：', guess);
  return { checks, guess };
}

// 初始化时调用
detectEnvironment();