/* GXY sitewide theme system — Modern <-> Retro (2000s)
   Include on any page:
     <script src="[root]assets/theme.js" data-root="[root]"></script>
   It:
    - remembers the chosen theme in localStorage ('gxy_theme')
    - loads assets/retro.css when retro is active
    - injects a small floating toggle (bottom-left) unless the page opts out with data-no-toggle
*/
(function(){
  var s = document.currentScript;
  var root = (s && s.getAttribute('data-root')) || '';
  var noToggle = s && s.getAttribute('data-no-toggle') === 'true';
  var KEY = 'gxy_theme';

  function current(){ try { return localStorage.getItem(KEY) || 'modern'; } catch(e){ return 'modern'; } }

  var linkEl = null;
  function apply(theme){
    var isRetro = theme === 'retro';
    document.documentElement.setAttribute('data-theme', theme);
    if(isRetro){
      if(!linkEl){
        linkEl = document.createElement('link');
        linkEl.rel = 'stylesheet';
        linkEl.id = 'gxy-retro-css';
        linkEl.href = root + 'assets/retro.css';
        document.head.appendChild(linkEl);
      }
    } else if(linkEl){
      linkEl.parentNode.removeChild(linkEl); linkEl = null;
    }
    var btn = document.getElementById('gxy-theme-toggle');
    if(btn) btn.innerHTML = isRetro ? '&#128421;&#65039; Modern View' : '&#127760; Retro (2000s) View';
  }

  function set(theme){ try { localStorage.setItem(KEY, theme); } catch(e){} apply(theme); }
  window.gxySetTheme = set;
  window.gxyToggleTheme = function(){ set(current()==='retro'?'modern':'retro'); };
  window.gxyCurrentTheme = current;

  // apply ASAP (before paint where possible)
  apply(current());

  if(!noToggle){
    function addToggle(){
      if(document.getElementById('gxy-theme-toggle')) return;
      var b = document.createElement('button');
      b.id = 'gxy-theme-toggle';
      b.type = 'button';
      b.setAttribute('onclick','gxyToggleTheme()');
      b.style.cssText = 'position:fixed;left:12px;bottom:12px;z-index:99999;font-family:system-ui,Segoe UI,sans-serif;font-size:12px;font-weight:600;padding:.5rem .8rem;border-radius:20px;border:1px solid #cbd5e1;background:#fff;color:#1e293b;box-shadow:0 2px 8px rgba(0,0,0,.15);cursor:pointer;';
      b.innerHTML = current()==='retro' ? '&#128421;&#65039; Modern View' : '&#127760; Retro (2000s) View';
      document.body.appendChild(b);
    }
    if(document.body) addToggle();
    else document.addEventListener('DOMContentLoaded', addToggle);
  }
})();
