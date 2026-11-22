// Banner cookie + caricamento Meta Pixel SOLO dopo consenso (GDPR)
(function(){
var PIXEL_ID = ""; // Inserisci qui l'ID del tuo Meta Pixel (solo numeri)
var KEY = "fln_consent", q = [];
function get(){ try{ return localStorage.getItem(KEY); }catch(e){ return null; } }
function set(v){ try{ localStorage.setItem(KEY, v); }catch(e){} }
function loadPixel(){
  if(!PIXEL_ID || window.fbq) return;
  !function(f,b,e,v,n,t,s){n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};f._fbq=n;n.push=n;n.loaded=!0;n.version="2.0";n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,"script","https://connect.facebook.net/en_US/fbevents.js");
  fbq("init", PIXEL_ID); fbq("track", "PageView");
  q.forEach(function(a){ fbq("track", a[0], a[1]); }); q = [];
}
window.flnTrack = function(n, d){ if(get()==="yes" && window.fbq) fbq("track", n, d||{}); else q.push([n, d||{}]); };
var css = document.createElement("style");
css.textContent = ".ck{position:fixed;left:10px;right:10px;bottom:calc(10px + env(safe-area-inset-bottom,0px));z-index:99;max-width:520px;margin:0 auto;background:#fff;color:#0E1B3D;border:1px solid #DCE5FA;border-radius:16px;padding:16px;box-shadow:0 12px 40px rgba(6,26,85,.28);font:500 14px/1.5 system-ui,-apple-system,'Segoe UI',Roboto,sans-serif}.ck b{display:block;font-size:16px;color:#061A55;margin-bottom:4px}.ck a{color:#0A3CFF}.ck div{display:flex;gap:10px;margin-top:12px}.ck button{flex:1;min-height:46px;border-radius:12px;border:2px solid #0A3CFF;background:#fff;color:#0A3CFF;font:800 15px system-ui,sans-serif;cursor:pointer}.ck button.y{background:#0A3CFF;color:#fff}.ck button:focus-visible{outline:3px solid #00B86B;outline-offset:2px}";
document.head.appendChild(css);
function banner(){
  if(document.querySelector(".ck")) return;
  var d = document.createElement("div"); d.className = "ck"; d.setAttribute("role","dialog"); d.setAttribute("aria-label","Preferenze cookie");
  d.innerHTML = '<b>La tua privacy</b>Usiamo cookie tecnici necessari al funzionamento del sito e, solo con il tuo consenso, cookie di marketing (Meta) per misurare le nostre campagne. Maggiori informazioni nella <a href="privacy.html#cookie">Privacy e Cookie Policy</a>.<div><button type="button" data-v="no">Rifiuta</button><button type="button" class="y" data-v="yes">Accetta</button></div>';
  d.addEventListener("click", function(e){ var v = e.target.getAttribute("data-v"); if(!v) return; set(v); d.remove(); if(v==="yes") loadPixel(); });
  document.body.appendChild(d);
}
function init(){
  if(get()==="yes") loadPixel(); else if(!get()) banner();
  document.addEventListener("click", function(e){ var t = e.target.closest("[data-cookie]"); if(t){ e.preventDefault(); banner(); } });
}
if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
