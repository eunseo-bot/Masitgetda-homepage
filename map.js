// 1. 맛집 정보 (엑셀로 정리한 리스트 + 룰렛과 같은 대표 메뉴)
//    id: 리뷰 페이지(Supabase restaurants 테이블)의 음식점 번호
//    photos: 첫 번째 = 메뉴 사진, 두 번째 = 가게 사진 (‹ › 버튼으로 넘겨 보기)
//    area: 상록구 = 학교 앞, 단원구 = 고잔·중앙역
const shops = [
  { id: 1, category: "한식", name: "중앙솥뚜껑삼겹살 안산중앙점", menu: "삼겹살", photos: ["images/restaurant01.jpeg"], address: "경기 안산시 단원구 고잔1길 49 113, 114호", link: "https://naver.me/FJOCXG9v" },
  { id: 2, category: "일식", name: "타이칸라멘", menu: "돈코츠 라멘", photos: ["images/menu02.jpg", "images/restaurant02.jpeg"], address: "경기 안산시 단원구 고잔2길 71 101, 102호", link: "https://naver.me/IgMwxtD1" },
  { id: 3, category: "카페", name: "또넛", menu: "통망고 베이글 산도", photos: ["images/menu03.jpg", "images/restaurant03.jpeg"], address: "경기 안산시 단원구 광덕대로 174 108, 109호", link: "https://naver.me/F6QRvzEq" },
  { id: 4, category: "일식", name: "Yumei", menu: "유라멘", photos: ["images/menu04.jpg", "images/restaurant04.jpeg"], address: "경기 안산시 상록구 학사2길 20", link: "https://naver.me/GO6rK2yb" },
  { id: 5, category: "양식", name: "앤의 식탁", menu: "스테이크 덮밥", photos: ["images/menu05.jpg", "images/restaurant05.jpeg"], address: "경기 안산시 상록구 성안길 84-1 102호", link: "https://naver.me/Ix0mzIou" },
  { id: 6, category: "중식", name: "짬뽕지존 고잔점", menu: "해물왕짬뽕", photos: ["images/restaurant06.jpeg"], address: "경기 안산시 단원구 광덕대로 138 골든에이스프라자 1층 105호~110호", link: "https://naver.me/FDcpalCB" },
  { id: 7, category: "중식", name: "보배반점 안산한양대점", menu: "크림짬뽕", photos: ["images/restaurant07.jpeg"], address: "경기 안산시 상록구 한양대학로 66 104.105.106호", link: "https://naver.me/FBMmZQPW" },
  { id: 8, category: "양식", name: "투파인드피터 한양대에리카점", menu: "스파이시 크레비 파스타", photos: ["images/menu08.jpg", "images/restaurant08.jpeg"], address: "경기 안산시 상록구 성안길 97 1층", link: "https://naver.me/xIFT72YL" },
  { id: 9, category: "카페", name: "오쏘커피", menu: "오쏘라떼", photos: ["images/menu09.jpg", "images/restaurant09.jpeg"], address: "경기 안산시 상록구 한양대학로 27 1층", link: "https://naver.me/5Jq29V7P" },
  { id: 10, category: "카페", name: "묵커피바", menu: "무화과쑥크림보틀케이크", photos: ["images/menu10.jpg", "images/restaurant10.jpeg"], address: "경기 안산시 상록구 성안1길 25 1층 101호", link: "https://naver.me/GcASsnj5" },
  { id: 11, category: "카페", name: "좋은아침", menu: "햄치즈 크라상 페스츄리", photos: ["images/menu11.jpg", "images/restaurant11.jpeg"], address: "경기 안산시 단원구 광덕동로 39 대우프라자", link: "https://naver.me/FmGSz2tN" },
  { id: 12, category: "카페", name: "디그리 고잔점", menu: "뺑 오 헤이즐넛쇼콜라", photos: ["images/menu12.jpg", "images/restaurant12.jpeg"], address: "경기 안산시 단원구 광덕대로 137 A동 103호, 104호, 105호, 109호", link: "https://naver.me/FoX3JEXr" }
];

// 2. 필터 버튼 목록
const categories = [
  { name: "전체", icon: "🍽️" },
  { name: "한식", icon: "🍚" },
  { name: "중식", icon: "🥟" },
  { name: "일식", icon: "🍜" },
  { name: "양식", icon: "🍝" },
  { name: "카페", icon: "☕" }
];

const areas = [
  { name: "전체 지역", key: "" },
  { name: "학교 앞", key: "상록구" },
  { name: "고잔·중앙역", key: "단원구" }
];

const $ = (id) => document.getElementById(id);
let selectedCategory = "전체";
let selectedArea = "";

function getArea(shop) {
  return shop.address.includes("상록구") ? "학교 앞" : "고잔·중앙역";
}

function getIcon(categoryName) {
  return categories.find((c) => c.name === categoryName).icon;
}

// 3. 필터 버튼 만들기
function makeChip(label, isActive, onClick) {
  const chip = document.createElement("button");
  chip.type = "button";
  chip.className = "chip" + (isActive ? " active" : "");
  chip.textContent = label;
  chip.setAttribute("aria-pressed", isActive);
  chip.addEventListener("click", onClick);
  return chip;
}

function renderChips() {
  const categoryBox = $("category-chips");
  categoryBox.innerHTML = "";
  categories.forEach((c) => {
    categoryBox.appendChild(
      makeChip(`${c.icon} ${c.name}`, c.name === selectedCategory, () => {
        selectedCategory = c.name;
        render();
      })
    );
  });

  const areaBox = $("area-chips");
  areaBox.innerHTML = "";
  areas.forEach((a) => {
    areaBox.appendChild(
      makeChip(a.name, a.key === selectedArea, () => {
        selectedArea = a.key;
        render();
      })
    );
  });
}

// 4. 맛집 카드 만들기
function makeCard(shop) {
  const card = document.createElement("article");
  card.className = "shop-card";
  const hasMany = shop.photos.length > 1;
  card.innerHTML = `
    <div class="photo-box">
      <img src="${shop.photos[0]}" alt="${shop.name} 사진" loading="lazy">
      ${hasMany ? `
        <button type="button" class="photo-btn prev" aria-label="이전 사진">‹</button>
        <button type="button" class="photo-btn next" aria-label="다음 사진">›</button>
        <div class="dots">${shop.photos.map((_, i) => `<span class="${i === 0 ? "on" : ""}"></span>`).join("")}</div>` : ""}
    </div>
    <div class="shop-body">
      <div class="tags">
        <span class="tag">${getIcon(shop.category)} ${shop.category}</span>
        <span class="tag area">📍 ${getArea(shop)}</span>
      </div>
      <h3>${shop.name}</h3>
      <p class="menu">대표 메뉴 · <strong>${shop.menu}</strong></p>
      <p class="address">${shop.address}</p>
      <div class="actions">
        <a class="btn main-btn" href="${shop.link}" target="_blank" rel="noopener">네이버 지도</a>
        <a class="btn" href="review.html?restaurant=${shop.id}">리뷰 쓰기</a>
      </div>
    </div>`;

  const img = card.querySelector("img");
  img.addEventListener("error", () => {
    img.hidden = true;
  });

  // 사진 넘기기
  if (hasMany) {
    let index = 0;
    const dots = card.querySelectorAll(".dots span");
    const show = (step) => {
      index = (index + step + shop.photos.length) % shop.photos.length;
      img.hidden = false;
      img.src = shop.photos[index];
      dots.forEach((dot, i) => dot.classList.toggle("on", i === index));
    };
    card.querySelector(".prev").addEventListener("click", () => show(-1));
    card.querySelector(".next").addEventListener("click", () => show(1));
  }
  return card;
}

// 5. 화면 그리기
function render() {
  renderChips();

  const list = shops.filter((shop) => {
    const categoryOk = selectedCategory === "전체" || shop.category === selectedCategory;
    const areaOk = selectedArea === "" || shop.address.includes(selectedArea);
    return categoryOk && areaOk;
  });

  const grid = $("shop-grid");
  grid.innerHTML = "";
  if (list.length === 0) {
    grid.innerHTML = `<p class="empty">조건에 맞는 맛집이 없어요 🥲</p>`;
  } else {
    list.forEach((shop) => grid.appendChild(makeCard(shop)));
  }
  $("count").textContent = `맛집 ${list.length}곳`;
}

render();
