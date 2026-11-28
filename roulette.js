// 1. 가게 정보: [분류, 이름, 대표 메뉴, 사진, 주소, 네이버 지도 링크]
const shops = [
  ["한식", "중앙솥뚜껑삼겹살 안산중앙점", "삼겹살", "restaurant01.jpeg", "경기 안산시 단원구 고잔1길 49 113, 114호", "https://naver.me/FJOCXG9v"],
  ["일식", "타이칸라멘", "돈코츠 라멘", "restaurant02.jpeg", "경기 안산시 단원구 고잔2길 71 101, 102호", "https://naver.me/IgMwxtD1"],
  ["카페", "또넛", "통망고 베이글 산도", "restaurant03.jpeg", "경기 안산시 단원구 광덕대로 174 108, 109호", "https://naver.me/F6QRvzEq"],
  ["일식", "Yumei", "유라멘", "restaurant04.jpeg", "경기 안산시 상록구 학사2길 20", "https://naver.me/GO6rK2yb"],
  ["양식", "앤의 식탁", "스테이크 덮밥", "restaurant05.jpeg", "경기 안산시 상록구 성안길 84-1 102호", "https://naver.me/Ix0mzIou"],
  ["중식", "짬뽕지존 고잔점", "해물왕짬뽕", "restaurant06.jpeg", "경기 안산시 단원구 광덕대로 138 골든에이스프라자 1층 105호~110호", "https://naver.me/FDcpalCB"],
  ["중식", "보배반점 안산한양대점", "크림짬뽕", "restaurant07.jpeg", "경기 안산시 상록구 한양대학로 66 104.105.106호", "https://naver.me/FBMmZQPW"],
  ["양식", "투파인드피터 한양대에리카점", "스파이시 크레비 파스타", "restaurant08.jpeg", "경기 안산시 상록구 성안길 97 1층", "https://naver.me/xIFT72YL"],
  ["카페", "오쏘커피", "오쏘라떼", "restaurant09.jpeg", "경기 안산시 상록구 한양대학로 27 1층", "https://naver.me/5Jq29V7P"],
  ["카페", "묵커피바", "무화과쑥크림보틀케이크", "restaurant10.jpeg", "경기 안산시 상록구 성안1길 25 1층 101호", "https://naver.me/GcASsnj5"],
  ["카페", "좋은아침", "햄치즈 크라상 페스츄리", "restaurant11.jpeg", "경기 안산시 단원구 광덕동로 39 대우프라자", "https://naver.me/FmGSz2tN"],
  ["카페", "디그리 고잔점", "뺑 오 헤이즐넛쇼콜라", "restaurant12.jpeg", "경기 안산시 단원구 광덕대로 137 A동 103호, 104호, 105호, 109호", "https://naver.me/FoX3JEXr"]
];

// 2. 음식 종류 (원판 색과 결과 멘트)
const categories = [
  { name: "한식", icon: "🍚", color: "#ffc9a3", message: "오늘은 든든하게 한식!" },
  { name: "중식", icon: "🥟", color: "#ffe28a", message: "중식이 당기는 날이네!" },
  { name: "일식", icon: "🍣", color: "#ffd1d1", message: "오늘은 깔끔하게 일식 어때?" },
  { name: "양식", icon: "🍝", color: "#d8edb5", message: "오늘은 분위기 있게 양식?" }
];

// 카페 원판에 들어갈 짧은 이름과 색
const cafeSlices = {
  "또넛": { label: "또넛", icon: "🍩", color: "#ffc9a3" },
  "오쏘커피": { label: "오쏘", icon: "☕", color: "#ffe28a" },
  "묵커피바": { label: "묵커피바", icon: "🍰", color: "#ffd1d1" },
  "좋은아침": { label: "좋은아침", icon: "🥐", color: "#d8edb5" },
  "디그리 고잔점": { label: "디그리", icon: "🥖", color: "#f3dcc0" }
};

const $ = (id) => document.getElementById(id);
const excluded = new Set();
let mode = "meal";
let rotation = 0;
let spinning = false;

// 3. 시간별 멘트
function getGreeting(mode, hour) {
  if (hour >= 5 && hour < 11) {
    return mode === "meal" ? "아메추? 든든하게 시작하자 🌅" : "모닝커피 한 잔 어때?";
  }
  if (hour >= 11 && hour < 16) {
    return mode === "meal" ? "점메추? 오늘 점심은 뭐 먹지 🍚" : "나른할 땐 카페지 ☕";
  }
  if (hour >= 16 && hour < 21) {
    return mode === "meal" ? "저메추? 오늘도 수고했어 🌆" : "달달한 거 당기지 않아? 🍰";
  }
  return mode === "meal" ? "야메추? 출출한 밤이네 🌙" : "늦은 밤, 잠깐 쉬어 갈까?";
}

function say(text) {
  $("speech").textContent = text;
}

// 햄스터 표정: idle(평소), think(고민), happy(신남)
function setMood(mood) {
  $("mascot").setAttribute("data-mood", mood);
}

// 햄스터가 보이도록 화면 옮기기
function showMascot() {
  $("speech").scrollIntoView({ behavior: "smooth", block: "start" });
}

function sayGreeting(type) {
  say(getGreeting(type, new Date().getHours()));
}

function randomItem(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function activeCategories() {
  return categories.filter((c) => !excluded.has(c.name));
}

// 4. 지금 원판에 들어갈 칸 (밥: 음식 종류, 카페: 가게)
function getSlices() {
  if (mode === "meal") return activeCategories();
  return shops
    .filter((s) => s[0] === "카페")
    .map((s) => ({ ...cafeSlices[s[1]], shop: s }));
}

// 5. 원판 그리기
function drawWheel() {
  const list = getSlices();
  const size = 360 / list.length;
  const wheel = $("wheel");

  wheel.style.transition = "none";
  wheel.style.transform = "rotate(0deg)";
  rotation = 0;

  const colors = list.map((c, i) => `${c.color} ${i * size}deg ${(i + 1) * size}deg`);
  wheel.style.background = `conic-gradient(${colors.join(", ")})`;
  wheel.innerHTML = "";

  list.forEach((c, i) => {
    const angle = ((i + 0.5) * size * Math.PI) / 180;
    const label = document.createElement("span");
    label.className = "label";
    label.innerHTML = `${c.icon}<br>${c.label || c.name}`;
    label.style.left = `${50 + 33 * Math.sin(angle)}%`;
    label.style.top = `${50 - 33 * Math.cos(angle)}%`;
    wheel.appendChild(label);
  });

  wheel.offsetHeight; // 바뀐 위치를 바로 적용
  wheel.style.transition = "";
}

// 6. 안 끌리는 종류 빼기
function makeFilters() {
  categories.forEach((c) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "btn filter";
    button.textContent = `${c.icon} ${c.name}`;
    button.addEventListener("click", () => {
      if (excluded.has(c.name)) {
        excluded.delete(c.name);
      } else if (activeCategories().length > 2) {
        excluded.add(c.name);
      } else {
        say("2개까지만 뺄 수 있어! 🥺");        return;
      }
      button.classList.toggle("off", excluded.has(c.name));
      sayGreeting("meal");
      $("spin").textContent = "돌려!";
      drawWheel();
    });
    $("filters").appendChild(button);
  });
}

// 7. 스테이지 선택
function startStage(type) {
  mode = type;
  setMood("idle");
  sayGreeting(type);
  $("start").hidden = true;
  $("game").hidden = false;
  $("filter-box").hidden = type !== "meal";
  $("stage-title").textContent = type === "meal" ? "🍚 밥 스테이지" : "☕ 카페 스테이지";
  $("spin").textContent = "돌려!";
  drawWheel();
}

function goHome() {
  setMood("idle");
  $("game").hidden = true;
  $("start").hidden = false;
  sayGreeting("meal");
}

// 8. 가게 카드 만들기 (사진은 images 폴더)
function makeCard(shop) {
  const [, name, menu, photo, address, link] = shop;
  const card = document.createElement("article");
  card.className = "shop";
  card.innerHTML = `
    <img src="images/${photo}" alt="${name} ${menu}">
    <div class="shop-info">
      <h3>${name}</h3>
      <p>대표 메뉴: ${menu}</p>
      <p class="address">${address}</p>
      <a class="map-link" href="${link}" target="_blank" rel="noopener">네이버 지도 보기</a>
    </div>`;
  card.querySelector("img").addEventListener("error", (e) => {
    e.target.hidden = true;
  });
  return card;
}

// 9. 색종이 뿌리기
function throwConfetti() {
  const box = $("confetti");
  const colors = ["#ff9f43", "#ffd43b", "#ff8787", "#94d82d"];
  box.innerHTML = "";
  for (let i = 0; i < 30; i++) {
    const piece = document.createElement("span");
    piece.style.left = `${Math.random() * 95}%`;
    piece.style.background = randomItem(colors);
    piece.style.animationDelay = `${Math.random() * 0.4}s`;
    box.appendChild(piece);
  }
}

// 10. 결과 팝업 열기
function showResult(selected) {
  const isCafe = mode === "cafe";
  const group = shops.filter((s) => s[0] === (isCafe ? "카페" : selected.name));
  const pick = isCafe ? selected.shop : randomItem(group);
  const others = group.filter((s) => s !== pick);

  $("result-title").textContent = isCafe
    ? "☕ 오늘은 여기 어때?"
    : `${selected.icon} ${selected.message}`;

  $("pick").innerHTML = "";
  $("pick").appendChild(makeCard(pick));

  $("others").innerHTML = "";
  others.forEach((s) => $("others").appendChild(makeCard(s)));
  $("more").open = false;
  $("more").hidden = others.length === 0;
  $("more-title").textContent = isCafe ? "다른 카페도 보기" : "다른 곳도 보기";

  $("go-cafe").hidden = isCafe;
  $("popup").showModal();
  $("popup").scrollTop = 0;
  throwConfetti();
}

// 돌아가는 동안 버튼 잠그기
function setSpinning(value) {
  spinning = value;
  document.body.classList.toggle("spinning", value);
  document.querySelectorAll("#game button").forEach((b) => (b.disabled = value));
}

// 11. 원판 돌리기
function spin() {
  if (spinning) return;
  setSpinning(true);
  setMood("think");
  say("음… 어디가 좋을까? 두구두구 🥁");
  showMascot();

  const list = getSlices();
  const size = 360 / list.length;
  const index = Math.floor(Math.random() * list.length);

  // 뽑힌 칸이 위쪽 화살표에 오도록 각도 계산
  const offset = (Math.random() - 0.5) * size * 0.6;
  const target = (360 - (index + 0.5) * size + offset + 360) % 360;
  rotation += 360 * 5 + ((target - (rotation % 360) + 360) % 360);
  $("wheel").style.transform = `rotate(${rotation}deg)`;
  // 글자는 반대로 돌려서 똑바로 보이게 하기
  document.querySelectorAll(".label").forEach((label) => {
    label.style.transform = `translate(-50%, -50%) rotate(${-rotation}deg)`;
  });

  // 원판이 멈추면 햄스터가 폴짝! 그다음 결과 팝업
  setTimeout(() => {
    setMood("happy");
    say("찾았다! 오늘은 여기야 🎉");
    showMascot();

    setTimeout(() => {
      setSpinning(false);
      $("spin").textContent = "다시 돌리기";
      showResult(list[index]);
    }, 1700);
  }, 3100);
}

$("meal-btn").addEventListener("click", () => startStage("meal"));
$("cafe-btn").addEventListener("click", () => startStage("cafe"));
$("home-btn").addEventListener("click", goHome);
$("spin").addEventListener("click", spin);
$("close-btn").addEventListener("click", () => $("popup").close());
// ✕ 버튼이든 Esc 키든 팝업이 닫히면 햄스터를 평소 상태로 (다시 돌리는 중이면 그대로)
$("popup").addEventListener("close", () => {
  if (spinning) return;
  setMood("idle");
  sayGreeting(mode);
});
$("again-btn").addEventListener("click", () => {
  $("popup").close();
  spin();
});
$("go-cafe").addEventListener("click", () => {
  $("popup").close();
  startStage("cafe");
  window.scrollTo({ top: 0, behavior: "smooth" });
});

makeFilters();
sayGreeting("meal");