/* GXY sitewide theme system — Modern <-> Retro (2000s)
   Include on any page:
     <script src="[root]assets/theme.js" data-root="[root]"></script>
   Optional page-specific retro layout:
     data-retro-extra="news"      -> also loads assets/retro-news.css
     data-retro-extra="weather"   -> also loads assets/retro-weather.css
   Options:
     data-no-toggle="true"        -> don't inject the floating toggle
*/
(function(){
  var s = document.currentScript;
  var root = (s && s.getAttribute('data-root')) || '';
  var extra = s && s.getAttribute('data-retro-extra');
  var noToggle = s && s.getAttribute('data-no-toggle') === 'true';
  var KEY = 'gxy_theme';

  function current(){ try { return localStorage.getItem(KEY) || 'modern'; } catch(e){ return 'modern'; } }

  var links = [];
  function addCss(href, id){
    if(document.getElementById(id)) return;
    var l = document.createElement('link');
    l.rel='stylesheet'; l.id=id; l.href=href;
    document.head.appendChild(l); links.push(l);
  }
  function clearCss(){
    links.forEach(function(l){ if(l.parentNode) l.parentNode.removeChild(l); });
    links = [];
  }

  function apply(theme){
    var isRetro = theme === 'retro';
    document.documentElement.setAttribute('data-theme', theme);
    if(isRetro){
      addCss(root+'assets/retro.css','gxy-retro-css');
      if(extra) addCss(root+'assets/retro-'+extra+'.css','gxy-retro-'+extra+'-css');
    } else {
      clearCss();
    }
    var btn = document.getElementById('gxy-theme-toggle');
    if(btn) btn.innerHTML = isRetro ? '&#128421;&#65039; Modern View' : '&#127760; Retro (2000s) View';
  }

  function set(t){ try{ localStorage.setItem(KEY,t); }catch(e){} apply(t); }
  window.gxySetTheme = set;
  window.gxyToggleTheme = function(){ set(current()==='retro'?'modern':'retro'); };
  window.gxyCurrentTheme = current;

  apply(current());

  if(!noToggle){
    function addToggle(){
      if(document.getElementById('gxy-theme-toggle')) return;
      var b=document.createElement('button');
      b.id='gxy-theme-toggle'; b.type='button';
      b.setAttribute('onclick','gxyToggleTheme()');
      b.style.cssText='position:fixed;left:12px;bottom:12px;z-index:99999;font-family:system-ui,Segoe UI,sans-serif;font-size:12px;font-weight:600;padding:.5rem .8rem;border-radius:20px;border:1px solid #cbd5e1;background:#fff;color:#1e293b;box-shadow:0 2px 8px rgba(0,0,0,.15);cursor:pointer;';
      b.innerHTML = current()==='retro' ? '&#128421;&#65039; Modern View' : '&#127760; Retro (2000s) View';
      document.body.appendChild(b);
    }
    if(document.body) addToggle(); else document.addEventListener('DOMContentLoaded', addToggle);
  }
})();
