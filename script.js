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
  const hair=hairColors[style%4], skin=skins[style%4];
  const hairstyles=[
    `<path d="M-34 8Q-45 -39 0 -42Q43 -39 35 10L34 53Q24 69 16 55L18 9Q0 -8 -21 8L-19 55Q-30 68 -37 48Z" fill="${hair}"/><path d="M-25 -18Q-12 -39 7 -31Q-5 -16 -24 -7Z" fill="#a47b5e" opacity=".5"/>`,
    `<path d="M-36 7Q-44 -39 0 -41Q44 -39 36 8L31 55Q23 67 16 54L18 9Q0 -7 -22 8L-20 55Q-31 67 -37 48Z" fill="${hair}"/><path d="M-35 -15Q-12 -48 18 -29Q7 -12 -8 -9Q-22 -7 -35 2Z" fill="${hair}"/>`,
    `<path d="M-35 7Q-42 -40 0 -42Q42 -40 35 8L30 53Q23 67 15 54L18 9Q0 -9 -21 8L-19 54Q-30 67 -36 48Z" fill="${hair}"/><path d="M-25 -22Q0 -39 25 -20" fill="none" stroke="#9a7255" stroke-width="5"/>`,
    `<path d="M-36 8Q-43 -39 0 -41Q43 -39 36 8L33 55Q24 68 16 54L18 8Q0 -8 -22 8L-20 55Q-31 67 -37 48Z" fill="${hair}"/><path d="M-34 -3Q-25 -29 -5 -28Q8 -27 16 -17" fill="none" stroke="#b18a69" stroke-width="4"/>`
  ];
  const face = `<ellipse cy="5" rx="28" ry="34" fill="${skin}" stroke="#765344" stroke-width="1.35"/>
    <path d="M-20 -5Q-13 -11 -5 -6M6 -6Q14 -11 21 -4" fill="none" stroke="#51392f" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M-18 1Q-12 -3 -7 1M7 1Q13 -3 18 1" fill="none" stroke="#6a493b" stroke-width="1.5" stroke-linecap="round"/>
    <ellipse cx="-12" cy="4" rx="3.5" ry="4.5" fill="#fff"/><ellipse cx="12" cy="4" rx="3.5" ry="4.5" fill="#fff"/>
    <circle cx="-12" cy="4" r="2.2" fill="#49342c"/><circle cx="12" cy="4" r="2.2" fill="#49342c"/>
    <path d="M0 8Q-3 14 1 15" fill="none" stroke="#b77c68" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M-9 22Q0 31 10 21" fill="none" stroke="#98554a" stroke-width="2.7" stroke-linecap="round"/>
    <ellipse cx="-21" cy="15" rx="5.5" ry="3.5" fill="#d98e82" opacity=".48"/><ellipse cx="21" cy="15" rx="5.5" ry="3.5" fill="#d98e82" opacity=".48"/>`;
  return `<g transform="translate(${x} ${y}) scale(${scale})">
    <path d="M-36 54Q-48 76 -43 137H43Q48 76 36 54Q0 35 -36 54Z" fill="${color}" stroke="#594b49" stroke-width="2"/>
    <path d="M-11 48L0 64L11 48" fill="#fffaf2" stroke="#d8cbbb" stroke-width="1.3"/>
    ${hairstyles[style%4]}${face}
    <path d="M-31 19Q-36 23 -33 29M31 19Q36 23 33 29" fill="none" stroke="${hair}" stroke-width="3"/>
    <circle cx="-31" cy="19" r="3.5" fill="#d3ad69"/><circle cx="31" cy="19" r="3.5" fill="#d3ad69"/>
    <path d="M-23 60Q-18 75 -11 79M23 60Q18 75 11 79" stroke="#ffffff" stroke-opacity=".35" stroke-width="2" fill="none"/>
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
        <!-- tailored white coat and blouse -->
        <path d="M-64 91Q-82 112 -76 195H76Q82 112 64 91Q37 70 0 72Q-37 70 -64 91Z" fill="#fffefa" stroke="#aaa49a" stroke-width="2.1"/>
        <path d="M-29 82L0 119L29 82L17 195H-17Z" fill="#e7ece8" stroke="#c3ccc5" stroke-width="1.4"/>
        <path d="M-29 83L-8 113L-24 132L-44 94M29 83L8 113L24 132L44 94" fill="#fff" stroke="#d2d0c9" stroke-width="1.5"/>
        <!-- neck -->
        <rect x="-12" y="61" width="24" height="27" rx="8" fill="#dca987"/>
        <!-- hijab silhouette behind face -->
        <path d="M-42 21Q-53 -43 -4 -54Q45 -52 43 20L42 83Q30 112 0 119Q-30 111 -42 83Z" fill="#71877f" stroke="#536b63" stroke-width="2.2"/>
        <!-- face framed naturally by scarf -->
        <path d="M-29 10Q-31 -30 0 -34Q31 -30 29 10Q27 44 0 57Q-27 44 -29 10Z" fill="#e8b895" stroke="#9b715c" stroke-width="1.3"/>
        <path d="M-30 7Q-35 -23 -14 -40Q0 -48 17 -37Q30 -26 30 5Q20 -10 12 -19Q-3 -6 -26 -9Z" fill="#71877f"/>
        <path d="M-19 5Q-12 0 -5 5M6 5Q13 0 20 5" fill="none" stroke="#5a4035" stroke-width="2.4" stroke-linecap="round"/>
        <ellipse cx="-12" cy="12" rx="3.5" ry="4.3" fill="#fff"/><ellipse cx="12" cy="12" rx="3.5" ry="4.3" fill="#fff"/>
        <circle cx="-12" cy="12" r="2.1" fill="#49342c"/><circle cx="12" cy="12" r="2.1" fill="#49342c"/>
        <path d="M0 17Q-3 23 1 24" fill="none" stroke="#b77c68" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M-9 34Q0 42 10 34" fill="none" stroke="#98554a" stroke-width="2.5" stroke-linecap="round"/>
        <ellipse cx="-22" cy="25" rx="5" ry="3" fill="#d98e82" opacity=".4"/><ellipse cx="22" cy="25" rx="5" ry="3" fill="#d98e82" opacity=".4"/>
        <!-- scarf drape, stethoscope and ID -->
        <path d="M-37 48Q-42 84 -27 112L-10 129L-18 91L-27 55M37 48Q42 84 27 112L10 129L18 91L27 55" fill="#71877f" stroke="#536b63" stroke-width="1.6"/>
        <path d="M-29 94Q-35 137 -11 142Q0 145 11 142Q35 137 29 94" fill="none" stroke="#718b89" stroke-width="3.2" stroke-linecap="round"/>
        <circle cx="0" cy="145" r="7" fill="#d5d9d5" stroke="#718b89" stroke-width="2.3"/>
        <rect x="42" y="112" width="17" height="24" rx="3" fill="#e9eee9" stroke="#9aa69d"/>
        <path d="M50.5 117v13M44 123.5h13" stroke="#7d9789" stroke-width="1.8" stroke-linecap="round"/>
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
