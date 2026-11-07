const scene = document.getElementById("scene");
const caption = document.getElementById("caption");
const progressText = document.getElementById("progressText");
const dayCount = document.getElementById("dayCount");
const toast = document.getElementById("toast");
const steps = [1,2,3,4].map(n => document.getElementById("step"+n));

const state = {
  coffeeCount: 0, ill: false, conditioned: false, friendOpen: false,
  groupOpen: false, consultOpen: false, safeDays: 0, extinct: false, friendExperienced: false,
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
  const hairColors=["#49342d","#6a4935","#302a2a","#805b43"];
  const skins=["#e8b795","#dca27f","#f0c6a3","#c98f70"];
  const hair=hairColors[style%hairColors.length], skin=skins[style%skins.length];
  const hairShape = style%4===0
    ? `<path d="M-34 5Q-43 -37 0 -40Q42 -37 35 8L31 49Q24 66 16 56L19 8Q0 -8 -22 8L-20 55Q-31 66 -36 46Z" fill="${hair}"/>`
    : style%4===1
    ? `<path d="M-35 4Q-42 -38 0 -40Q42 -37 35 8L31 49Q24 66 16 56L19 8Q0 -8 -22 8L-20 55Q-31 66 -36 46Z" fill="${hair}"/><path d="M-25 -19Q-4 -43 18 -23Q6 -12 -14 -12Z" fill="#8a6247" opacity=".45"/>`
    : style%4===2
    ? `<path d="M-36 8Q-43 -39 0 -40Q42 -37 36 8L34 49Q23 65 17 53L19 8Q0 -7 -22 8L-20 54Q-31 65 -37 45Z" fill="${hair}"/><path d="M-24 -19Q0 -35 23 -17" fill="none" stroke="#a27b5d" stroke-width="4"/>`
    : `<path d="M-36 7Q-43 -38 0 -40Q42 -37 36 8L33 48Q24 65 17 54L19 8Q0 -8 -22 8L-20 54Q-31 65 -37 45Z" fill="${hair}"/><path d="M-35 -4Q-23 -26 -9 -22" fill="none" stroke="#a27b5d" stroke-width="3"/>`;
  const face = `<ellipse cy="5" rx="29" ry="35" fill="${skin}" stroke="#765344" stroke-width="1.4"/>
    <path d="M-19 -3Q-12 -9 -5 -3M6 -3Q13 -9 20 -3" fill="none" stroke="#51392f" stroke-width="2.2" stroke-linecap="round"/>
    <ellipse cx="-12" cy="3" rx="3.2" ry="4.3" fill="#fff"/><ellipse cx="12" cy="3" rx="3.2" ry="4.3" fill="#fff"/>
    <circle cx="-12" cy="4" r="2.1" fill="#49342c"/><circle cx="12" cy="4" r="2.1" fill="#49342c"/>
    <path d="M0 8Q-3 14 1 15" fill="none" stroke="#b77c68" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M-8 22Q0 29 9 21" fill="none" stroke="#98554a" stroke-width="2.5" stroke-linecap="round"/>
    <ellipse cx="-21" cy="15" rx="5" ry="3" fill="#d98e82" opacity=".45"/><ellipse cx="21" cy="15" rx="5" ry="3" fill="#d98e82" opacity=".45"/>`;
  return `<g transform="translate(${x} ${y}) scale(${scale})">
    <path d="M-34 53Q-45 73 -41 132H41Q45 73 34 53Q0 35 -34 53Z" fill="${color}" stroke="#594b49" stroke-width="2"/>
    <path d="M-10 47L0 62L10 47" fill="#fffaf2" stroke="#d8cbbb" stroke-width="1.2"/>
    ${hairShape}${face}
    <circle cx="-31" cy="19" r="3" fill="#d3ad69"/><circle cx="31" cy="19" r="3" fill="#d3ad69"/>
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
    svg = `<svg viewBox="0 0 520 370" role="img" aria-label="Eman sitting with her female friend">${person({x:195,y:85,scale:1.12,mood:extra.mood||"nausea",cup:false,cookie:true})}${friendPerson(340,118,.94,"#9277a8",1)}${cupOnly(366,232,.75)}<path d="M110 315h300" stroke="#d8c9aa" stroke-width="3" stroke-linecap="round"/></svg>`;
    caption.textContent = "A friend joins Eman. She feels a little uncomfortable, but not as sick.";
  }
  if (kind === "group") {
    svg = `<svg viewBox="0 0 600 370" role="img" aria-label="Eman laughing with four female friends, all holding iced mocha drinks"><text x="100" y="70" fill="#c77b92" font-size="23" font-weight="700">haha!</text><text x="440" y="92" fill="#c77b92" font-size="22" font-weight="700">LOL!</text>${friendPerson(105,135,.68,"#8d9eae",0)}${friendPerson(205,142,.68,"#b18a70",1)}${person({x:300,y:95,scale:1.0,mood:"happy",cup:true,bag:false})}${friendPerson(405,142,.68,"#8b9c7a",2)}${friendPerson(500,135,.68,"#ad87a0",3)}${cupOnly(105,245,.5)}${cupOnly(205,248,.5)}${cupOnly(405,248,.5)}${cupOnly(500,245,.5)}<text x="255" y="42" fill="#c77b92" font-size="19" font-weight="700">Day ${extra.day||1}</text></svg>`;
    caption.textContent = `Safe experience ${extra.day||1} of 3: Eman and her friends enjoy their drinks together.`;
  }
  if (kind === "consult") {
    svg = `<svg viewBox="0 0 650 370" role="img" aria-label="Eman speaking with a friendly hijab-wearing doctor">
      ${person({x:160,y:80,scale:1.02,mood:"happy",bag:false})}
      <g transform="translate(425 78)">
        <!-- shoulders and white coat -->
        <path d="M-61 91Q-75 112 -70 190H70Q75 112 61 91Q35 70 0 72Q-35 70 -61 91Z" fill="#fffefa" stroke="#8c8982" stroke-width="2.2"/>
        <path d="M-28 82L0 121L28 82L17 190H-17Z" fill="#dce8e8" stroke="#aab8b5" stroke-width="1.5"/>
        <path d="M-28 84L-8 113L-22 131L-42 92M28 84L8 113L22 131L42 92" fill="#fff" stroke="#c8c6bf" stroke-width="1.5"/>
        <!-- neck and face -->
        <rect x="-12" y="62" width="24" height="24" rx="8" fill="#dca987"/>
        <ellipse cx="0" cy="18" rx="31" ry="39" fill="#e8b895" stroke="#9b715c" stroke-width="1.5"/>
        <!-- hijab framing the face -->
        <path d="M-37 18Q-48 -40 -3 -49Q43 -48 38 17L34 83Q22 105 0 111Q-23 104 -35 82L-34 48Q-47 32 -37 18Z" fill="#758b83" stroke="#536c64" stroke-width="2.4"/>
        <path d="M-29 11Q-32 -30 0 -35Q31 -31 29 11Q25 43 0 54Q-25 43 -29 11Z" fill="#e8b895" stroke="#9b715c" stroke-width="1.2"/>
        <!-- calm, kind facial expression -->
        <path d="M-19 5Q-12 0 -5 5M6 5Q13 0 20 5" fill="none" stroke="#5a4035" stroke-width="2.4" stroke-linecap="round"/>
        <ellipse cx="-12" cy="12" rx="3.2" ry="4.2" fill="#fff"/><ellipse cx="12" cy="12" rx="3.2" ry="4.2" fill="#fff"/>
        <circle cx="-12" cy="12" r="2" fill="#49342c"/><circle cx="12" cy="12" r="2" fill="#49342c"/>
        <path d="M0 17Q-3 23 1 24" fill="none" stroke="#b77c68" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M-9 34Q0 41 9 34" fill="none" stroke="#98554a" stroke-width="2.4" stroke-linecap="round"/>
        <ellipse cx="-22" cy="25" rx="5" ry="3" fill="#d98e82" opacity=".42"/><ellipse cx="22" cy="25" rx="5" ry="3" fill="#d98e82" opacity=".42"/>
        <!-- stethoscope -->
        <path d="M-29 91Q-35 132 -11 137Q0 139 11 137Q35 132 29 91" fill="none" stroke="#718b89" stroke-width="3.5" stroke-linecap="round"/>
        <circle cx="0" cy="140" r="7" fill="#d5d9d5" stroke="#718b89" stroke-width="2.5"/>
        <!-- doctor badge -->
        <rect x="39" y="111" width="18" height="25" rx="3" fill="#e9eee9" stroke="#9aa69d"/>
        <path d="M48 117v12M42 123h12" stroke="#7d9789" stroke-width="2" stroke-linecap="round"/>
      </g>
      <path d="M240 135Q275 108 310 130" stroke="#a9a092" stroke-width="2" fill="none" stroke-dasharray="4 5"/><text x="290" y="115" fill="#8a765d" font-size="15">?</text>
    </svg>`;
    caption.textContent = "The doctor explains what Eman is experiencing.";
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
  } else if (state.friendExperienced || state.friendOpen) {
    showScene("friend"); caption.textContent="Eman feels a little uneasy, but the reaction is milder than before."; notify("A milder reaction");
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
  if(state.friendOpen) state.friendExperienced=true;
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
  Object.assign(state,{coffeeCount:0,ill:false,conditioned:false,friendOpen:false,groupOpen:false,consultOpen:false,safeDays:0,extinct:false,friendExperienced:false,reaction:"happy"});
  dayCount.textContent="Day 1"; showScene("start"); setProgress(); notify("Experiment restarted");
}
document.getElementById("coffeeBtn").addEventListener("click",coffee);
document.getElementById("illnessBtn").addEventListener("click",illness);
document.getElementById("consultBtn").addEventListener("click",consult);
document.getElementById("friendBtn").addEventListener("click",friend);
document.getElementById("groupBtn").addEventListener("click",group);
document.getElementById("resetBtn").addEventListener("click",reset);
showScene("start"); setProgress();
