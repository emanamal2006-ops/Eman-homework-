const scene = document.getElementById("scene");
const caption = document.getElementById("caption");
const progressText = document.getElementById("progressText");
const dayCount = document.getElementById("dayCount");
const toast = document.getElementById("toast");
const steps = [1,2,3,4].map(n => document.getElementById("step"+n));

const state = {
  coffeeCount: 0, ill: false, conditioned: false, friendOpen: false,
  groupOpen: false, consultOpen: false, safeDays: 0, extinct: false,
  reaction: "happy"
};

function person({x=0, y=0, scale=1, mood="happy", cup=false, cookie=false, bag=true, hair="#65452f", skin="#e8b58f", shirt="#fffdf7", vest="#292727"}={}) {
  const face = mood === "sick" ? `
    <path d="M-20 -5 Q-12 -11 -5 -5" stroke="#4c342c" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M7 -5 Q15 -11 22 -5" stroke="#4c342c" stroke-width="3" fill="none" stroke-linecap="round"/>
    <ellipse cx="-12" cy="2" rx="5" ry="3" fill="#4c342c"/><ellipse cx="13" cy="2" rx="5" ry="3" fill="#4c342c"/>
    <ellipse cx="-20" cy="13" rx="8" ry="5" fill="#d77b72" opacity=".7"/><ellipse cx="20" cy="13" rx="8" ry="5" fill="#d77b72" opacity=".7"/>
    <path d="M-5 24 Q0 17 6 24" stroke="#8d4a45" stroke-width="3" fill="none" stroke-linecap="round"/>` :
    mood === "nausea" ? `
    <path d="M-20 -3 Q-12 4 -5 -2 M7 -2 Q15 4 22 -3" stroke="#4c342c" stroke-width="3" fill="none" stroke-linecap="round"/>
    <ellipse cx="-12" cy="4" rx="4" ry="5" fill="#4c342c"/><ellipse cx="13" cy="4" rx="4" ry="5" fill="#4c342c"/>
    <ellipse cx="-20" cy="14" rx="8" ry="5" fill="#d77b72" opacity=".6"/><ellipse cx="20" cy="14" rx="8" ry="5" fill="#d77b72" opacity=".6"/>
    <path d="M-7 25 Q0 18 7 25 Q0 32 -7 25" fill="#8c4545"/>` :
    mood === "content" ? `
    <path d="M-20 0 Q-12 -8 -5 0 M7 0 Q15 -8 22 0" stroke="#4c342c" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M-8 20 Q0 30 9 20" stroke="#9c5148" stroke-width="3" fill="none" stroke-linecap="round"/>` :
    `<ellipse cx="-12" cy="0" rx="3.5" ry="4.5" fill="#4c342c"/><ellipse cx="13" cy="0" rx="3.5" ry="4.5" fill="#4c342c"/>
    <path d="M-8 19 Q0 26 9 19" stroke="#9c5148" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  return `<g transform="translate(${x} ${y}) scale(${scale})">
    ${bag ? `<path d="M-38 96 Q-68 100 -65 151 L-49 170 L-27 152 L-23 105" fill="#a97950" stroke="#684a36" stroke-width="2"/><path d="M-56 111 Q-44 101 -31 111" fill="none" stroke="#684a36" stroke-width="3"/>` : ""}
    <path d="M-42 78 Q-48 101 -43 165 L43 165 Q48 101 42 78 Q22 62 0 65 Q-22 62 -42 78" fill="${shirt}" stroke="#57483e" stroke-width="2"/>
    <path d="M-29 72 L0 91 L29 72 L24 165 L-24 165Z" fill="${vest}" stroke="#1f2020" stroke-width="2"/>
    <path d="M-12 68 L0 92 L12 68" fill="#fff" stroke="#bdb6ae" stroke-width="1.5"/>
    <path d="M-7 92 L0 100 L7 92" fill="#c7b7a5"/>
    <rect x="-10" y="164" width="20" height="13" rx="4" fill="${skin}"/>
    <ellipse cx="0" cy="18" rx="43" ry="49" fill="${hair}"/>
    <ellipse cx="0" cy="21" rx="34" ry="41" fill="${skin}"/>
    <path d="M-35 18 Q-44 -27 -5 -31 Q34 -35 39 5 Q25 -7 15 -22 Q-2 -5 -31 -5Z" fill="${hair}"/>
    <path d="M-35 0 Q-47 28 -35 66 Q-28 82 -22 74 L-25 25" fill="${hair}"/>
    <path d="M35 0 Q47 28 35 66 Q28 82 22 74 L25 25" fill="${hair}"/>
    ${face}
    ${cup ? `<g transform="translate(57 112) rotate(-8)"><path d="M-13 -20h27l-4 47h-19z" fill="#f7f0e4" stroke="#67442f" stroke-width="2"/><path d="M-11 -7h23l-3 28h-17z" fill="#976344"/><path d="M-2 -29l-4 11M5 -29l-2 11" stroke="#67442f" stroke-width="2" stroke-linecap="round"/><path d="M14 -13q12 0 8 12q-2 5 -9 5" fill="none" stroke="#67442f" stroke-width="2"/></g>` : ""}
    ${cookie ? `<circle cx="58" cy="117" r="14" fill="#c89456" stroke="#815b39" stroke-width="2"/><circle cx="53" cy="112" r="2" fill="#65452f"/><circle cx="63" cy="120" r="2" fill="#65452f"/><circle cx="56" cy="125" r="2" fill="#65452f"/>` : ""}
  </g>`;
}

function cupOnly(x,y,s=1) {
 return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-17 -27h34l-5 56h-24z" fill="#fffaf0" stroke="#67442f" stroke-width="2.5"/><path d="M-15 -9h30l-4 33h-22z" fill="#956344"/><path d="M-5 -37l-5 13M5 -37l-3 13" stroke="#67442f" stroke-width="2.5" stroke-linecap="round"/><path d="M17 -20q16 -2 12 13q-2 8 -14 7" fill="none" stroke="#67442f" stroke-width="2.5"/></g>`;
}
function friendPerson(x,y,scale=0.8,color="#8c6e9e",style=0) {
 const hair = ["#49352e","#674331","#302b2a","#76513b"][style%4];
 const skin = ["#e8b18d","#d99b78","#f0c5a1","#c98768"][style%4];
 const fringe = [
   `<path d="M-34 5Q-42 -39 -4 -42Q34 -42 37 -5Q22 -20 9 -21Q-8 -7 -31 -11Z" fill="${hair}"/><path d="M-34 0Q-44 34 -30 58L-22 50L-25 13M34 0Q43 32 30 58L22 50L25 13" fill="${hair}"/>`,
   `<path d="M-35 2Q-37 -40 0 -41Q38 -38 35 5L24 -11Q4 -18 -3 -5Q-17 -16 -28 -8Z" fill="${hair}"/><path d="M-33 0Q-47 36 -27 65L-18 56L-24 12M33 0Q45 36 27 65L18 56L24 12" fill="${hair}"/>`,
   `<path d="M-35 0Q-42 -44 0 -42Q42 -44 35 4Q22 -10 0 -14Q-18 -10 -35 0Z" fill="${hair}"/><path d="M-32 0Q-42 28 -32 54L-23 48L-25 10M32 0Q42 28 32 54L23 48L25 10" fill="${hair}"/>`,
   `<path d="M-35 3Q-39 -40 0 -42Q38 -39 36 5Q15 -17 -4 -17Q-18 -9 -35 3Z" fill="${hair}"/><path d="M-34 0Q-46 32 -30 61L-20 53L-25 10M34 0Q46 32 30 61L20 53L25 10" fill="${hair}"/>`
 ][style%4];
 return `<g transform="translate(${x} ${y}) scale(${scale})">
   <path d="M-38 54Q-52 76 -47 145H47Q52 76 38 54Q0 35 -38 54Z" fill="${color}" stroke="#594b49" stroke-width="2"/>
   <path d="M-12 48L0 70L12 48" fill="#f8f2e9" stroke="#cfc4b8" stroke-width="1.5"/>
   <path d="M-8 38H8V57Q0 65 -8 57Z" fill="${skin}"/>
   <ellipse cy="1" rx="32" ry="39" fill="${skin}" stroke="#8d6250" stroke-width="1"/>
   ${fringe}
   <path d="M-20 -5Q-14 -10 -7 -5M7 -5Q14 -10 20 -5" fill="none" stroke="${hair}" stroke-width="2.6" stroke-linecap="round"/>
   <ellipse cx="-13" cy="3" rx="3.2" ry="4.2" fill="#392d29"/><ellipse cx="13" cy="3" rx="3.2" ry="4.2" fill="#392d29"/>
   <circle cx="-14" cy="2" r="1" fill="#fff"/><circle cx="12" cy="2" r="1" fill="#fff"/>
   <path d="M0 7Q-3 15 1 16" fill="none" stroke="#bd856c" stroke-width="1.6" stroke-linecap="round"/>
   <path d="M-8 23Q0 31 9 22" fill="none" stroke="#984f4b" stroke-width="2.8" stroke-linecap="round"/>
   <ellipse cx="-22" cy="15" rx="6" ry="3.5" fill="#d98278" opacity=".28"/><ellipse cx="22" cy="15" rx="6" ry="3.5" fill="#d98278" opacity=".28"/>
   <circle cx="-31" cy="9" r="2" fill="#d6b16d"/><circle cx="31" cy="9" r="2" fill="#d6b16d"/>
 </g>`;
}
function doctorPerson(x,y,scale=1) {
 return `<g transform="translate(${x} ${y}) scale(${scale})">
   <!-- shoulders and coat -->
   <path d="M-65 83Q-76 110 -72 190H72Q76 110 65 83Q39 65 20 65L0 91L-20 65Q-42 66 -65 83Z" fill="#fffefa" stroke="#b8b2a9" stroke-width="2.4"/>
   <path d="M-20 67L0 95L20 67L12 190H-12Z" fill="#e9e6df" stroke="#c9c2b8" stroke-width="1.5"/>
   <path d="M-20 68L0 94L-13 110L-30 78M20 68L0 94L13 110L30 78" fill="#fff" stroke="#c9c2b8" stroke-width="1.5"/>
   <!-- neck --> <path d="M-13 49H13V77Q0 91 -13 77Z" fill="#d99f7d"/>
   <!-- hijab outer silhouette -->
   <path d="M-48 12Q-54 -54 0 -62Q54 -54 48 12L57 76Q43 103 0 111Q-43 103 -57 76Z" fill="#74836b" stroke="#53634e" stroke-width="2.5"/>
   <!-- face -->
   <path d="M-29 -1Q-31 -39 0 -43Q31 -39 29 -1L25 28Q17 52 0 55Q-17 52 -25 28Z" fill="#e8b18e" stroke="#b98268" stroke-width="1.2"/>
   <path d="M-30 -6Q-35 -42 0 -49Q35 -42 30 -6L22 -19Q0 -7 -22 -19Z" fill="#74836b"/>
   <path d="M-20 4Q-14 -1 -8 4M8 4Q14 -1 20 4" fill="none" stroke="#5b4035" stroke-width="2.7" stroke-linecap="round"/>
   <ellipse cx="-13" cy="11" rx="3.2" ry="4" fill="#3b302b"/><ellipse cx="13" cy="11" rx="3.2" ry="4" fill="#3b302b"/>
   <circle cx="-14" cy="10" r="1" fill="#fff"/><circle cx="12" cy="10" r="1" fill="#fff"/>
   <path d="M0 15Q-3 23 1 24" fill="none" stroke="#bd856c" stroke-width="1.5"/>
   <path d="M-8 34Q0 42 9 33" fill="none" stroke="#984f4b" stroke-width="2.8" stroke-linecap="round"/>
   <ellipse cx="-22" cy="26" rx="6" ry="3.5" fill="#d98278" opacity=".3"/><ellipse cx="22" cy="26" rx="6" ry="3.5" fill="#d98278" opacity=".3"/>
   <!-- stethoscope -->
   <path d="M-22 92V111Q-22 131 0 131Q22 131 22 111V92" fill="none" stroke="#66777a" stroke-width="3.2" stroke-linecap="round"/>
   <path d="M0 131V145" stroke="#66777a" stroke-width="3.2"/><circle cx="0" cy="150" r="7" fill="#b9c4c2" stroke="#66777a" stroke-width="2"/>
   <!-- name badge --> <rect x="34" y="104" width="19" height="25" rx="3" fill="#e8eee4" stroke="#9aaa92"/><path d="M39 111h9M39 117h9" stroke="#80927a" stroke-width="1.5"/>
 </g>`;
}

function showScene(kind, extra={}) {
  let svg = "";
  if (kind === "start") {
    svg = `<svg viewBox="0 0 520 370" role="img" aria-label="Eman, a university student, standing on campus">${person({x:260,y:76,scale:1.42,mood:"happy"})}<path d="M205 324h110" stroke="#d8c9aa" stroke-width="3" stroke-linecap="round"/></svg>`;
    caption.textContent = "Meet Eman. She loves her iced dark mocha.";
  }
  if (kind === "happy") {
    svg = `<svg viewBox="0 0 520 370" role="img" aria-label="Eman happily enjoying her iced dark mocha">${person({x:260,y:76,scale:1.42,mood:"content",cup:true})}<path d="M350 120l9 -13 9 13M372 142l14 -3" stroke="#b98748" stroke-width="3" fill="none" stroke-linecap="round"/><text x="353" y="94" font-size="25" fill="#a77743">!</text></svg>`;
    caption.textContent = "So refreshing! Eman finishes her favorite drink.";
  }
  if (kind === "sick") {
    svg = `<svg viewBox="0 0 520 370" role="img" aria-label="Eman feeling ill">${person({x:260,y:76,scale:1.42,mood:"sick"})}<path d="M190 105l-12 -12m18 -8l-2 -17m132 38l13 -12m-18 -8l2 -17" stroke="#bd625b" stroke-width="4" stroke-linecap="round"/><text x="331" y="115" font-size="25" fill="#b94d4b">✦</text></svg>`;
    caption.textContent = "Eman suddenly feels unwell.";
  }
  if (kind === "nausea") {
    svg = `<svg viewBox="0 0 520 370" role="img" aria-label="Eman feeling nauseated and covering her mouth">${person({x:260,y:76,scale:1.42,mood:"nausea",cup:true})}<path d="M306 178Q327 157 346 178L339 193Q323 201 306 178Z" fill="#e8c8a7" stroke="#67442f" stroke-width="2"/><text x="333" y="99" font-size="29" fill="#b94d4b">‼</text><text x="180" y="105" font-size="24" fill="#b94d4b">!</text></svg>`;
    caption.textContent = "The smell and taste now bring back the feeling of being sick.";
  }
  if (kind === "friend") {
    svg = `<svg viewBox="0 0 520 370" role="img" aria-label="Eman sitting with one friend">${person({x:195,y:85,scale:1.12,mood:extra.mood||"nausea",cup:false,cookie:true})}${friendPerson(340,118,.94,"#9277a8")}${cupOnly(366,232,.75)}<path d="M110 315h300" stroke="#d8c9aa" stroke-width="3" stroke-linecap="round"/></svg>`;
    caption.textContent = "A friend joins Eman. She feels a little uncomfortable, but not as sick.";
  }
  if (kind === "group") {
    svg = `<svg viewBox="0 0 600 370" role="img" aria-label="Eman laughing with four friends, all holding iced mocha drinks"><text x="100" y="70" fill="#c77b92" font-size="23" font-weight="700">haha!</text><text x="440" y="92" fill="#c77b92" font-size="22" font-weight="700">LOL!</text>${friendPerson(105,135,.68,"#8d9eae",0)}${friendPerson(205,142,.68,"#b18a70",1)}${person({x:300,y:95,scale:1.0,mood:"happy",cup:true,bag:false})}${friendPerson(405,142,.68,"#8b9c7a",2)}${friendPerson(500,135,.68,"#ad87a0",3)}${cupOnly(105,245,.5)}${cupOnly(205,248,.5)}${cupOnly(405,248,.5)}${cupOnly(500,245,.5)}<text x="255" y="42" fill="#c77b92" font-size="19" font-weight="700">Day ${extra.day||1}</text></svg>`;
    caption.textContent = `Safe experience ${extra.day||1} of 3: Eman and her friends enjoy their drinks together.`;
  }
  if (kind === "consult") {
    svg = `<svg viewBox="0 0 650 370" role="img" aria-label="Eman speaking with a friendly hijab-wearing doctor">${person({x:165,y:80,scale:1.02,mood:"happy",bag:false})}${doctorPerson(435,88,1.03)}<path d="M245 140Q286 112 325 133" stroke="#a9a092" stroke-width="2" fill="none" stroke-dasharray="4 5"/><text x="295" y="113" fill="#8a765d" font-size="15">?</text></svg>`;
    caption.textContent = "The doctor explains how Eman's brain connected the mocha with feeling ill.";
  }
  scene.innerHTML = svg;
}
function setProgress() {
  steps.forEach((s,i)=>{s.classList.remove("active","done"); if(i < (state.extinct?4:state.conditioned?3:state.ill?2:1)) s.classList.add("done");});
  const active = state.extinct?3:state.conditioned?2:state.ill?1:0;
  steps[active].classList.add("active");
  if (state.extinct) progressText.textContent = "After repeated safe experiences, Eman's conditioned response has weakened. This is called extinction.";
  else if (state.conditioned) progressText.textContent = "The mocha has become a conditioned stimulus (CS). It can now trigger a conditioned response (CR): nausea.";
  else if (state.ill) progressText.textContent = "Illness (US) naturally caused nausea (UR). The drink can become associated with that experience.";
  else progressText.textContent = "Try the iced mocha first. Then use the illness button to continue the story.";
}
function notify(message) { toast.textContent=message; toast.classList.add("show"); setTimeout(()=>toast.classList.remove("show"),1900); }
function coffee() {
  state.coffeeCount++;
  if (!state.ill && !state.conditioned) {
    showScene("happy"); notify("A favorite drink!");
    dayCount.textContent = `Day ${state.coffeeCount}`;
  } else if (state.extinct) {
    showScene("happy"); caption.textContent="Eman enjoys her mocha again. The old reaction has faded."; notify("A comfortable experience");
  } else if (state.friendOpen) {
    showScene("friend",{mood:"nausea"}); caption.textContent="Eman feels a little uneasy, but she stays with her friend."; notify("A milder reaction");
  } else {
    showScene("nausea"); notify("Conditioned response: nausea");
    setTimeout(()=>{ if (!state.consultOpen && !state.friendOpen && !state.groupOpen) { showScene("start"); } },5000);
  }
  setProgress();
}
function illness() {
  state.ill=true; state.conditioned=true; state.extinct=false;
  state.friendOpen=false; state.groupOpen=false; state.consultOpen=false;
  showScene("sick"); caption.textContent="Eman becomes ill for a reason unrelated to the mocha. She experiences nausea.";
  notify("Illness → nausea"); setProgress();
}
function consult() {
  state.consultOpen=!state.consultOpen;
  if(state.consultOpen) {
    state.friendOpen=false; state.groupOpen=false; showScene("consult");
    caption.textContent="Doctor: “Your brain connected the mocha with the illness. The mocha became a conditioned stimulus, and nausea became a conditioned response. This is classical conditioning. Gradual, safe re-exposure may help weaken the learned reaction.”";
  } else showScene("start");
}
function friend() {
  state.friendOpen=!state.friendOpen; state.groupOpen=false; state.consultOpen=false;
  if(state.friendOpen) showScene("friend",{mood:state.conditioned&&!state.extinct?"nausea":"happy"});
  else showScene("start");
}
function group() {
  state.groupOpen=!state.groupOpen; state.friendOpen=false; state.consultOpen=false;
  if(state.groupOpen) {
    state.safeDays=Math.min(3,state.safeDays+1);
    if(state.safeDays>=3) state.extinct=true;
    showScene("group",{day:state.safeDays});
    dayCount.textContent=`Safe day ${state.safeDays}/3`;
    if(state.extinct) { caption.textContent="After repeated safe experiences, Eman's nausea response has faded (extinction)."; notify("Extinction reached!"); }
    else notify(`Safe experience ${state.safeDays} of 3`);
  } else showScene("start");
  setProgress();
}
function reset() {
  Object.assign(state,{coffeeCount:0,ill:false,conditioned:false,friendOpen:false,groupOpen:false,consultOpen:false,safeDays:0,extinct:false,reaction:"happy"});
  dayCount.textContent="Day 1"; showScene("start"); setProgress(); notify("Experiment restarted");
}
document.getElementById("coffeeBtn").addEventListener("click",coffee);
document.getElementById("illnessBtn").addEventListener("click",illness);
document.getElementById("consultBtn").addEventListener("click",consult);
document.getElementById("friendBtn").addEventListener("click",friend);
document.getElementById("groupBtn").addEventListener("click",group);
document.getElementById("resetBtn").addEventListener("click",reset);
showScene("start"); setProgress();
