(function(){
var KEY="leeki.v1";
function load(){try{return JSON.parse(localStorage.getItem(KEY))||{}}catch(e){return {}}}
function save(s){try{localStorage.setItem(KEY,JSON.stringify(s))}catch(e){}}
var S=load();
if(!S.lang)S.lang=(navigator.language||"ar").toLowerCase().indexOf("en")===0?"en":"ar";
if(!S.mood)S.mood="support";
var idx=0;
function $(i){return document.getElementById(i)}
function dayKey(d){d=d||new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}
function dayNum(k){var p=k.split("-");return Math.round(Date.UTC(+p[0],+p[1]-1,+p[2])/864e5)}
function seed(){var k=dayKey(),h=0;for(var i=0;i<k.length;i++)h=(h*31+k.charCodeAt(i))>>>0;return h}
function list(){return window.MESSAGES[S.lang][S.mood]}
function current(){var l=list();return l[(seed()+idx)%l.length]}
function enc(s){try{return btoa(unescape(encodeURIComponent(s))).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}catch(e){return ""}}
function dec(s){try{return decodeURIComponent(escape(atob(s.replace(/-/g,"+").replace(/_/g,"/"))))}catch(e){return null}}
var incoming=null;
(function(){var h=location.hash||"";if(h.indexOf("#m=")===0){var m=dec(h.slice(3));if(m&&m.trim())incoming=m.trim().slice(0,400)}})();
function msgLink(){var b="https://leekiapp.github.io/",e=enc($("msg").textContent);return e?b+"#m="+e:b}
function bumpStreak(){
 var t=dayKey();
 if(S.last===t)return;
 if(S.last&&dayNum(t)-dayNum(S.last)===1)S.streak=(S.streak||0)+1;else S.streak=1;
 S.last=t;save(S);
}
function render(){
 var T=I18N[S.lang];
 document.documentElement.lang=S.lang;document.documentElement.dir=T.dir;
 $("appName").textContent=T.app;$("langBtn").textContent=T.lang;
 $("greet").textContent=T.greet;
 try{$("date").textContent=new Date().toLocaleDateString(S.lang==="ar"?"ar-EG":"en-GB",{weekday:"long",day:"numeric",month:"long"})}catch(e){}
 $("moodQ").textContent=T.mood;
 document.querySelectorAll(".mood").forEach(function(b){
  b.setAttribute("aria-checked",b.dataset.mood===S.mood);
  b.querySelector(".t").textContent=T[b.dataset.mood];
 });
 $("todayLbl").textContent=incoming?T.incoming:T.today;$("only").textContent=T.only;
 $("anotherBtn").textContent=T.another;$("shareBtn").textContent=T.share;$("moreBtn").textContent=T.more;
 $("msg").textContent=incoming||current();
 $("streak").textContent=S.streak?T.streak(S.streak):T.streak0;
 $("installBtn").textContent=T.install;$("iosHint").textContent=T.iosHint;
 var ios=/iphone|ipad|ipod/i.test(navigator.userAgent)&&!navigator.standalone;
 $("iosHint").hidden=!ios;
}
document.querySelectorAll(".mood").forEach(function(b){b.addEventListener("click",function(){S.mood=b.dataset.mood;idx=0;incoming=null;bumpStreak();save(S);render()})});
$("anotherBtn").addEventListener("click",function(){incoming=null;idx=(idx+1)%list().length;render()});
$("langBtn").addEventListener("click",function(){S.lang=S.lang==="ar"?"en":"ar";idx=0;save(S);render()});
function toast(t){$("toast").textContent=t;setTimeout(function(){$("toast").textContent=""},3000)}
$("shareBtn").addEventListener("click",function(){
 var T=I18N[S.lang],txt=T.shareText(msgLink());
 bumpStreak();render();
 window.open("https://wa.me/?text="+encodeURIComponent(txt),"_blank");
});
$("moreBtn").addEventListener("click",function(){
 var T=I18N[S.lang],txt=T.shareText(msgLink());
 if(navigator.share){navigator.share({text:txt}).catch(function(){});return}
 if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(txt).then(function(){toast(T.copied)},function(){})}
});
var dp=null;
window.addEventListener("beforeinstallprompt",function(e){e.preventDefault();dp=e;$("installBtn").hidden=false});
$("installBtn").addEventListener("click",function(){if(dp){dp.prompt();dp=null;$("installBtn").hidden=true}});
bumpStreak();render();
if("serviceWorker" in navigator)navigator.serviceWorker.register("sw.js").catch(function(){});
})();
