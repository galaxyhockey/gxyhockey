/* GXY Server Status — queries mcsrvstat.us (free, no key) for bikingpeople.exaroton.me.
   Usage: put <div id="gxy-server-status"></div> on a page, then include this script.
   Optionally set window.GXY_SERVER before loading to override the address. */
(function(){
  var ADDRESS = window.GXY_SERVER || "bikingpeople.exaroton.me";
  var el = document.getElementById('gxy-server-status');
  if(!el) return;

  el.innerHTML = '<div class="gss-loading">Checking server status…</div>';

  // styles (scoped-ish via gss- prefix)
  var css = ''
   + '.gss{font-family:"Segoe UI",system-ui,sans-serif;}'
   + '.gss-card{background:#0f1629;border:1px solid #1e2a44;border-radius:12px;padding:1.1rem 1.25rem;color:#e6edf6;}'
   + '.gss-top{display:flex;align-items:center;gap:.6rem;margin-bottom:.6rem;}'
   + '.gss-dot{width:11px;height:11px;border-radius:50%;flex-shrink:0;}'
   + '.gss-dot.on{background:#22c55e;box-shadow:0 0 8px #22c55e;}'
   + '.gss-dot.off{background:#ef4444;}'
   + '.gss-state{font-weight:700;font-size:1.05rem;}'
   + '.gss-addr{margin-left:auto;font-size:.78rem;color:#8aa0bd;background:#0a1120;border:1px solid #1e2a44;padding:.25rem .55rem;border-radius:6px;cursor:pointer;}'
   + '.gss-addr:hover{color:#fff;border-color:#3b82f6;}'
   + '.gss-row{font-size:.85rem;color:#9fb3cd;margin-top:.35rem;}'
   + '.gss-row b{color:#e6edf6;}'
   + '.gss-players{margin-top:.6rem;display:flex;flex-wrap:wrap;gap:.35rem;}'
   + '.gss-player{background:#13203a;border:1px solid #1e2a44;border-radius:20px;padding:.2rem .65rem;font-size:.78rem;color:#cfe0f5;}'
   + '.gss-loading{color:#8aa0bd;font-size:.88rem;}';
  var st=document.createElement('style'); st.textContent=css; document.head.appendChild(st);

  function render(d){
    var online = d && d.online;
    var html = '<div class="gss"><div class="gss-card">';
    html += '<div class="gss-top">';
    html += '<span class="gss-dot '+(online?'on':'off')+'"></span>';
    html += '<span class="gss-state">'+(online?'Server Online':'Server Offline')+'</span>';
    html += '<span class="gss-addr" title="Click to copy" onclick="navigator.clipboard&&navigator.clipboard.writeText(\''+ADDRESS+'\')">'+ADDRESS+'</span>';
    html += '</div>';
    if(online){
      var on = (d.players && d.players.online!=null)?d.players.online:0;
      var max = (d.players && d.players.max!=null)?d.players.max:'?';
      html += '<div class="gss-row"><b>'+on+'</b> / '+max+' players online</div>';
      if(d.version){ html += '<div class="gss-row">Version: <b>'+String(d.version).replace(/[<>]/g,'')+'</b></div>'; }
      var list = (d.players && d.players.list) || [];
      if(list.length){
        html += '<div class="gss-players">';
        list.forEach(function(p){
          var name = (typeof p==='string')?p:(p && p.name)||'';
          if(name) html += '<span class="gss-player">'+name.replace(/[<>]/g,'')+'</span>';
        });
        html += '</div>';
      }
    } else {
      html += '<div class="gss-row">The server is currently offline or starting up. On exaroton, servers sleep when empty — it will wake when someone joins.</div>';
    }
    html += '</div></div>';
    el.innerHTML = html;
  }

  fetch('https://api.mcsrvstat.us/3/'+encodeURIComponent(ADDRESS), {cache:'no-store'})
    .then(function(r){ return r.json(); })
    .then(render)
    .catch(function(){
      el.innerHTML = '<div class="gss"><div class="gss-card"><div class="gss-top"><span class="gss-dot off"></span><span class="gss-state">Status Unavailable</span></div><div class="gss-row">Couldn\'t reach the status service. Try again shortly.</div></div></div>';
    });
})();
