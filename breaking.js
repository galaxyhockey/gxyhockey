/* GXY Breaking News banner — site-wide.
   Include on any page with:  <script src="[path-to-root]assets/breaking.js" data-root="[path-to-root]"></script>
   data-root is the relative path from THIS page back to the site root
   (e.g. "" for root, "../" for /main/, "../../../" for /businesses/gxy-newspaper/articles/).
*/
(function(){
  var scriptTag = document.currentScript;
  var root = (scriptTag && scriptTag.getAttribute('data-root')) || '';

  // Inject styles
  var css = ''
    + '#gxy-breaking{position:sticky;top:0;z-index:9999;display:none;background:#b30000;'
    + 'color:#fff;font-family:"Segoe UI",system-ui,sans-serif;border-bottom:2px solid #7a0000;'
    + 'box-shadow:0 2px 12px rgba(179,0,0,.4);animation:gxyPulse 1.6s ease-in-out infinite;}'
    + '#gxy-breaking a{display:flex;align-items:center;gap:.85rem;padding:.6rem 1.25rem;'
    + 'text-decoration:none;color:#fff;max-width:1200px;margin:0 auto;}'
    + '#gxy-breaking .gxy-tag{background:#fff;color:#b30000;font-weight:800;font-size:.72rem;'
    + 'letter-spacing:.08em;text-transform:uppercase;padding:.25rem .6rem;border-radius:4px;'
    + 'white-space:nowrap;animation:gxyBlink 1s step-start infinite;}'
    + '#gxy-breaking .gxy-dot{width:9px;height:9px;border-radius:50%;background:#fff;flex-shrink:0;'
    + 'animation:gxyBlink 1s step-start infinite;}'
    + '#gxy-breaking .gxy-head{font-weight:700;font-size:.92rem;}'
    + '#gxy-breaking .gxy-sum{font-size:.82rem;opacity:.85;font-weight:400;}'
    + '#gxy-breaking .gxy-arrow{margin-left:auto;font-size:.8rem;font-weight:700;white-space:nowrap;opacity:.9;}'
    + '#gxy-breaking .gxy-close{background:rgba(255,255,255,.2);border:none;color:#fff;cursor:pointer;'
    + 'font-size:1rem;line-height:1;padding:.25rem .5rem;border-radius:4px;margin-left:.5rem;}'
    + '#gxy-breaking .gxy-close:hover{background:rgba(255,255,255,.35);}'
    + '@keyframes gxyPulse{0%,100%{background:#b30000;}50%{background:#e00000;}}'
    + '@keyframes gxyBlink{50%{opacity:.35;}}'
    + '@media(max-width:600px){#gxy-breaking .gxy-sum{display:none;}#gxy-breaking .gxy-arrow{display:none;}}';
  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // Build banner shell at very top of body
  var bar = document.createElement('div');
  bar.id = 'gxy-breaking';
  document.body.insertBefore(bar, document.body.firstChild);

  function esc(s){return String(s||'').replace(/[&<>"]/g,function(c){return({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]);});}

  fetch(root + 'breaking.json', {cache:'no-store'})
    .then(function(r){ if(!r.ok) throw new Error('no file'); return r.json(); })
    .then(function(d){
      if(!d || !d.active){ return; }                 // nothing breaking -> stay hidden
      if(sessionStorage.getItem('gxy_breaking_dismissed') === (d.updated||'1')){ return; } // user closed this one

      var href = d.link ? (root + d.link) : null;
      var inner = ''
        + '<span class="gxy-dot"></span>'
        + '<span class="gxy-tag">' + esc(d.label || 'Breaking') + '</span>'
        + '<span class="gxy-head">' + esc(d.headline || '') + '</span>'
        + (d.summary ? '<span class="gxy-sum">' + esc(d.summary) + '</span>' : '')
        + (href ? '<span class="gxy-arrow">Read more &rarr;</span>' : '');

      if(href){
        var a = document.createElement('a');
        a.href = href; a.innerHTML = inner;
        bar.appendChild(a);
      } else {
        var wrap = document.createElement('div');
        wrap.style.cssText='display:flex;align-items:center;gap:.85rem;padding:.6rem 1.25rem;max-width:1200px;margin:0 auto;';
        wrap.innerHTML = inner; bar.appendChild(wrap);
      }

      // dismiss button
      var close = document.createElement('button');
      close.className='gxy-close'; close.innerHTML='&times;'; close.title='Dismiss';
      close.addEventListener('click', function(e){
        e.preventDefault(); e.stopPropagation();
        sessionStorage.setItem('gxy_breaking_dismissed', d.updated||'1');
        bar.style.display='none';
      });
      bar.appendChild(close);

      bar.style.display='block';
    })
    .catch(function(){ /* no breaking.json or offline -> banner stays hidden */ });
})();
