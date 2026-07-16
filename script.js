const pages = [
  { src: "kapak1.jpeg", label: "Kapak" },

  ...Array.from({ length: 15 }, (_, i) => ({
    src: `${i + 1}.jpeg`,
    label: `Sayfa ${i + 1} / 15`
  })),

  { src: "kapak2.jpeg", label: "Arka kapak" }
];

let index = 0;
let locked = false;

const book = document.getElementById("book");
const pageImage = document.getElementById("pageImage");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const openBtn = document.getElementById("openBtn");
const counter = document.getElementById("counter");

// HTML'de bar veya progressBar hangisi varsa onu bulur.
const progressBar =
  document.getElementById("progressBar") ||
  document.getElementById("bar");

// Görselleri önceden yükle.
pages.forEach((page) => {
  const preloadImage = new Image();
  preloadImage.src = page.src;
});

function updateUI() {
  const currentPage = pages[index];

  pageImage.src = currentPage.src;
  pageImage.alt = currentPage.label;
  counter.textContent = currentPage.label;

  if (progressBar) {
    progressBar.style.width =
      `${(index / (pages.length - 1)) * 100}%`;
  }

  prevBtn.disabled = index === 0;
  nextBtn.disabled = index === pages.length - 1;

  const isCover = index === 0;

  openBtn.style.display = isCover ? "inline-block" : "none";
  prevBtn.style.visibility = isCover ? "hidden" : "visible";
  nextBtn.style.visibility = isCover ? "hidden" : "visible";
}

function turnPage(newIndex, direction) {
  if (
    locked ||
    newIndex < 0 ||
    newIndex >= pages.length
  ) {
    return;
  }

  locked = true;

  book.classList.remove("flip-next", "flip-prev");

  // Animasyonu yeniden tetikler.
  void book.offsetWidth;

  book.classList.add(
    direction === "next" ? "flip-next" : "flip-prev"
  );

  setTimeout(() => {
    index = newIndex;
    updateUI();
  }, 290);

  setTimeout(() => {
    book.classList.remove("flip-next", "flip-prev");
    locked = false;
  }, 620);
}

openBtn.addEventListener("click", () => {
  turnPage(1, "next");
});

nextBtn.addEventListener("click", () => {
  turnPage(index + 1, "next");
});

prevBtn.addEventListener("click", () => {
  turnPage(index - 1, "prev");
});

// Telefonda parmakla sağa-sola kaydırma.
let touchStartX = 0;

book.addEventListener(
  "touchstart",
  (event) => {
    touchStartX = event.changedTouches[0].screenX;
  },
  { passive: true }
);

book.addEventListener(
  "touchend",
  (event) => {
    const touchEndX = event.changedTouches[0].screenX;
    const difference = touchEndX - touchStartX;

    if (Math.abs(difference) < 45) {
      return;
    }

    if (difference < 0) {
      turnPage(index + 1, "next");
    } else {
      turnPage(index - 1, "prev");
    }
  },
  { passive: true }
);

// Bilgisayar klavyesindeki yön tuşları.
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") {
    turnPage(index + 1, "next");
  }

  if (event.key === "ArrowLeft") {
    turnPage(index - 1, "prev");
  }
});

// Görsel yüklenemezse hata bilgisi.
pageImage.addEventListener("error", () => {
  console.error(
    `Görsel yüklenemedi: ${pages[index].src}`
  );
});

updateUI();