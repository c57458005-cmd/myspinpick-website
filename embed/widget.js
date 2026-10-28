/*!
 * MySpinPick embed loader  ·  https://myspinpick.com/embed/widget.js
 *
 * 用法（一行）：
 *   <script src="https://myspinpick.com/embed/widget.js" data-widget="wheel-spinner" async></script>
 *
 * 可选：
 *   data-height="972"   覆盖默认高度（会被限制在 120–4000 之间）
 *
 * 它在宿主页面里做两件事：
 *   1) 插入指向 https://myspinpick.com/embed/<slug>/ 的 iframe
 *   2) 在 iframe 下方插入一条署名，<a> 直接挂在宿主 DOM 上（iframe 内的链接不算宿主页的外链）
 *      iframe 带 ?js=1，嵌入页据此隐藏自己的页脚，避免出现两条署名
 *
 * 无依赖、不发起任何额外请求、不读 cookie、不写存储。
 */
(function () {
  'use strict';

  var BASE = 'https://myspinpick.com/';
  var MARK = '/embed/widget.js';
  var ACCENT = '#db2777';
  var MUTED = '#64748b';
  var FONT = '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif';
  // ?js=1 时嵌入页会隐藏自己的页脚（37.8px），这里同步扣掉，避免框内留一条空带
  var CHROME = 38;

  // h = 默认 iframe 高度（与各工具页片段里的一致）  t = iframe 无障碍标题  a = 署名锚文本（用该页工具词）
  var REG = {
    'wheel-spinner':          { h: 972, t: 'Wheel Spinner by MySpinPick',           a: 'Spin the wheel' },
    'yes-no-wheel':           { h: 972, t: 'Yes No Wheel by MySpinPick',            a: 'Yes or no wheel' },
    'wheel-of-fate':          { h: 1032, t: 'Wheel of Fate by MySpinPick',          a: 'Wheel of fate' },
    'wheel-of-colors':        { h: 972, t: 'Wheel of Colors by MySpinPick',         a: 'Wheel of colors' },
    'what-to-eat-wheel':      { h: 972, t: 'What to Eat Wheel by MySpinPick',       a: 'What to eat wheel' },
    'decision-wheel-spinner': { h: 972, t: 'Decision Wheel Spinner by MySpinPick',  a: 'Decision wheel spinner' },
    'coin-flip':              { h: 538, t: 'Coin Flip by MySpinPick',               a: 'Flip a coin' },
    'dice-roller':            { h: 384, t: 'Dice Roller by MySpinPick',             a: 'Roll dice' },
    'metronome':              { h: 408, t: 'Metronome by MySpinPick',               a: 'Online metronome' },
    'color-picker':           { h: 482, t: 'Color Picker by MySpinPick',            a: 'Color picker' },
    'name-picker':            { h: 898, t: 'Random Name Picker by MySpinPick',      a: 'Random name picker' },
    'random-number-generator': { h: 585, t: 'Random Number Generator by MySpinPick', a: 'Random number generator' },
    'secret-santa-name-picker': { h: 460, t: 'Secret Santa Name Picker by MySpinPick', a: 'Secret Santa name picker' },
    'random-letter-picker':   { h: 436, t: 'Random Letter Picker by MySpinPick',    a: 'Random letter picker' }
  };

  var has = Object.prototype.hasOwnProperty;

  function makeLink(href, text, color, weight) {
    var a = document.createElement('a');
    a.href = href;
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = text;
    a.style.color = color;
    a.style.textDecoration = 'none';
    if (weight) a.style.fontWeight = weight;
    return a;
  }

  function mount(wrap, tag) {
    var host = tag.parentNode;
    if (host && host.nodeName !== 'HEAD' && host.nodeName !== 'HTML') {
      host.insertBefore(wrap, tag.nextSibling);
      return;
    }
    if (document.body) {
      document.body.appendChild(wrap);
      return;
    }
    document.addEventListener('DOMContentLoaded', function () {
      document.body.appendChild(wrap);
    });
  }

  function init(tag) {
    if (!tag || tag.getAttribute('data-msp-ready') === '1') return;
    tag.setAttribute('data-msp-ready', '1');

    var slug = (tag.getAttribute('data-widget') || '').replace(/^\s+|\s+$/g, '');
    if (!has.call(REG, slug)) {
      if (window.console && console.warn) {
        console.warn('[MySpinPick] unknown data-widget="' + slug + '" — see https://myspinpick.com/ for the list');
      }
      return;
    }
    var meta = REG[slug];

    var h = parseInt(tag.getAttribute('data-height'), 10);
    if (!h || isNaN(h) || h < 120 || h > 4000) h = meta.h;

    // data-base 只用于本地/预发联调，正常嵌入不用写
    var base = (tag.getAttribute('data-base') || BASE);
    if (base.charAt(base.length - 1) !== '/') base += '/';

    var wrap = document.createElement('div');
    wrap.className = 'msp-widget';
    wrap.setAttribute('data-msp-slug', slug);

    var frame = document.createElement('iframe');
    frame.src = base + 'embed/' + slug + '/?js=1';
    frame.width = '100%';
    frame.height = String(Math.max(120, h - CHROME));
    frame.title = meta.t;
    frame.setAttribute('loading', 'lazy');
    frame.style.cssText = 'border:0;max-width:100%;width:100%;display:block';
    wrap.appendChild(frame);

    var credit = document.createElement('div');
    credit.className = 'msp-credit';
    credit.style.cssText = 'margin:6px 0 0;text-align:center;font:12px/1.6 ' + FONT + ';color:' + MUTED;
    credit.appendChild(makeLink(base + slug + '/', meta.a, ACCENT, '600'));
    credit.appendChild(document.createTextNode(' \u2014 free widget by '));
    credit.appendChild(makeLink(base, 'MySpinPick', MUTED));
    wrap.appendChild(credit);

    mount(wrap, tag);
  }

  function scan() {
    var tags = document.querySelectorAll('script[data-widget]');
    for (var i = 0; i < tags.length; i++) {
      var s = tags[i];
      var src = s.src || '';
      // 只处理来自本站的 loader；同页其它带 data-widget 的脚本不碰
      if (src.indexOf(MARK) === -1 && src.indexOf('widget.js') === -1) continue;
      init(s);
    }
  }

  // 当前脚本先就地处理（async 时 currentScript 仍可用），再兜底全量扫描
  try {
    var cur = document.currentScript;
    if (cur && (cur.src || '').indexOf('widget.js') >= 0) init(cur);
  } catch (e) { /* 老浏览器忽略 */ }
  scan();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scan);
  }
})();
