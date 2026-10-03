/* ================= LOADER ================= */

document.documentElement.classList.add("js");

window.addEventListener("load", () => {
  const loader = document.getElementById("loader");

  setTimeout(() => {
    loader.classList.add("hide");
  }, 600);
});


/* ================= MOBILE NAVIGATION ================= */

const navbar = document.querySelector(".navbar");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.querySelectorAll("#siteNav a");

menuToggle.addEventListener("click", () => {
  const isExpanded =
    menuToggle.getAttribute("aria-expanded") === "true";

  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute(
    "aria-label",
    isExpanded ? "Open navigation menu" : "Close navigation menu"
  );
  navbar.classList.toggle("menu-open", !isExpanded);
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
    navbar.classList.remove("menu-open");
  });
});


/* ================= SCROLL REVEALS ================= */

const revealElements = document.querySelectorAll(
  ".hero-content, .hero-image-wrap, .section-label, .about-grid, " +
  ".about-image, .section-heading, .project-card, .world-intro, " +
  ".personal-video, .music-section, .scrapbook-section, .skills-layout, " +
  ".interest, .game-wrapper, .contact-content"
);

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("reveal", "is-visible");
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.12,
    rootMargin: "0px 0px -40px 0px"
  });

  revealElements.forEach((element) => {
    element.classList.add("reveal");
    revealObserver.observe(element);
  });
} else {
  revealElements.forEach((element) => {
    element.classList.add("is-visible");
  });
}

/* Keep a branded placeholder available when a project image cannot load. */
document.querySelectorAll(".project-visual img").forEach((image) => {
  const showFallback = () => {
    image.hidden = true;
    image.parentElement.classList.add("is-fallback");
  };

  image.addEventListener("error", showFallback, { once: true });

  if (image.complete && image.naturalWidth === 0) {
    showFallback();
  }
});


/* ================= CUSTOM CURSOR ================= */

const cursor = document.getElementById("cursor");
const cursorRing = document.getElementById("cursorRing");

let mouseX = 0;
let mouseY = 0;

let ringX = 0;
let ringY = 0;

document.addEventListener("mousemove", (event) => {

  mouseX = event.clientX;
  mouseY = event.clientY;

  cursor.style.left = `${mouseX}px`;
  cursor.style.top = `${mouseY}px`;

});


function animateCursor() {

  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;

  cursorRing.style.left = `${ringX}px`;
  cursorRing.style.top = `${ringY}px`;

  requestAnimationFrame(animateCursor);
}

animateCursor();


/* ================= HERO PARALLAX ================= */

const heroImage = document.querySelector(".hero-image-frame");

window.addEventListener("scroll", () => {

  if (!heroImage) return;

  const scrollY = window.scrollY;

  if (scrollY < window.innerHeight) {

    heroImage.style.transform =
      `rotate(3deg) translateY(${scrollY * 0.04}px)`;

  }

});


/* ================= MAGNETIC BUTTONS ================= */

const magneticElements =
  document.querySelectorAll(".button, .nav-button");

magneticElements.forEach((element) => {

  element.addEventListener("mousemove", (event) => {

    const rect = element.getBoundingClientRect();

    const x =
      event.clientX -
      rect.left -
      rect.width / 2;

    const y =
      event.clientY -
      rect.top -
      rect.height / 2;

    element.style.transform =
      `translate(${x * 0.12}px, ${y * 0.12}px)`;

  });


  element.addEventListener("mouseleave", () => {

    element.style.transform = "";

  });

});


/* ================= MUSIC PLAYER ================= */

const songs = [

  {
    title: "Uss Mod Se",
    artist: "Jagjit Singh",
    src: "assets/music/music1.mp3"
  },

  {
    title: "Genie in a Bottle",
    artist: "Christina Aguilera",
    src: "assets/music/music2.mp3"
  },

  {
    title: "Gotta Long Way to Go",
    artist: "Cassie",
    src: "assets/music/music3.mp3"
  },

  {
    title: "Tumse Milke Aisa Laga",
    artist: "Asha Bhosle & Suresh Wadkar",
    src: "assets/music/music4.mp3"
  }

];


const audio =
  document.getElementById("audio");

const playButton =
  document.getElementById("playButton");

const progress =
  document.getElementById("progress");

const currentTime =
  document.getElementById("currentTime");

const duration =
  document.getElementById("duration");

const trackTitle =
  document.getElementById("trackTitle");

const trackArtist =
  document.getElementById("trackArtist");

const nowPlaying =
  document.getElementById("nowPlaying");

const songButtons =
  document.querySelectorAll(".song");


let currentSong = 0;


/* LOAD SONG */

function loadSong(index) {

  currentSong = index;

  const song = songs[index];

  audio.src = song.src;

  trackTitle.textContent = song.title;

  trackArtist.textContent = song.artist;

  nowPlaying.textContent = song.title;

  progress.value = 0;

  currentTime.textContent = "0:00";

  songButtons.forEach((button, buttonIndex) => {

    button.classList.toggle(
      "active",
      buttonIndex === index
    );

  });

}


/* PLAY / PAUSE */

playButton.addEventListener("click", () => {

  if (audio.paused) {

    audio.play()
      .then(() => {

        playButton.textContent = "Ⅱ";

      })
      .catch(() => {

        playButton.textContent = "▶";

      });

  } else {

    audio.pause();

    playButton.textContent = "▶";

  }

});


/* SONG SELECTION */

songButtons.forEach((button) => {

  button.addEventListener("click", () => {

    const index =
      Number(button.dataset.index);

    loadSong(index);

    audio.play()
      .then(() => {

        playButton.textContent = "Ⅱ";

      })
      .catch(() => {

        playButton.textContent = "▶";

      });

  });

});


/* AUDIO TIME */

audio.addEventListener("loadedmetadata", () => {

  duration.textContent =
    formatTime(audio.duration);

});


audio.addEventListener("timeupdate", () => {

  if (!audio.duration) return;

  const percent =
    (audio.currentTime / audio.duration) * 100;

  progress.value = percent;

  currentTime.textContent =
    formatTime(audio.currentTime);

});


/* PROGRESS BAR */

progress.addEventListener("input", () => {

  if (!audio.duration) return;

  audio.currentTime =
    (progress.value / 100) *
    audio.duration;

});


/* WHEN SONG ENDS */

audio.addEventListener("ended", () => {

  const nextSong =
    (currentSong + 1) % songs.length;

  loadSong(nextSong);

  audio.play()
    .then(() => {

      playButton.textContent = "Ⅱ";

    })
    .catch(() => {

      playButton.textContent = "▶";

    });

});


/* FORMAT TIME */

function formatTime(seconds) {

  if (!seconds || Number.isNaN(seconds)) {
    return "0:00";
  }

  const minutes =
    Math.floor(seconds / 60);

  const remainingSeconds =
    Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");

  return `${minutes}:${remainingSeconds}`;

}


/* INITIAL SONG */

loadSong(0);


/* ================= SCRAPBOOK MODAL ================= */

const imageModal =
  document.getElementById("imageModal");

const modalImage =
  document.getElementById("modalImage");

const modalClose =
  document.getElementById("modalClose");

const scrapbookItems =
  document.querySelectorAll(".scrap-item");


scrapbookItems.forEach((item) => {

  item.addEventListener("click", () => {

    const image =
      item.dataset.image;

    modalImage.src = image;

    imageModal.classList.add("open");

    document.body.style.overflow = "hidden";

  });

});


function closeModal() {

  imageModal.classList.remove("open");

  document.body.style.overflow = "";

}


modalClose.addEventListener(
  "click",
  closeModal
);


imageModal.addEventListener(
  "click",
  (event) => {

    if (event.target === imageModal) {
      closeModal();
    }

  }
);


document.addEventListener(
  "keydown",
  (event) => {

    if (event.key === "Escape") {
      closeModal();
    }

  }
);


/* ================= MEMORY MATCHING GAME ================= */

const gameBoard =
  document.getElementById("gameBoard");

const startGame =
  document.getElementById("startGame");

const pairsFound =
  document.getElementById("pairsFound");

const moveCount =
  document.getElementById("moveCount");

const gameTime =
  document.getElementById("gameTime");

const gameStatus =
  document.getElementById("gameStatus");

const memorySymbols = ["✦", "☾", "♡", "☼", "❋", "◇"];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let elapsedSeconds = 0;
let gameTimer = null;
let mismatchTimeout = null;
let boardLocked = false;

function updateGameTime() {
  elapsedSeconds++;

  const minutes = Math.floor(elapsedSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (elapsedSeconds % 60)
    .toString()
    .padStart(2, "0");

  gameTime.textContent = `${minutes}:${seconds}`;
}

function createMemoryCard(symbol, index) {
  const card = document.createElement("button");
  card.type = "button";
  card.className = "memory-card";
  card.dataset.symbol = symbol;
  card.setAttribute("aria-label", `Hidden card ${index + 1}`);
  card.innerHTML = `
    <span class="memory-card-back" aria-hidden="true">✳</span>
    <span class="memory-card-face" aria-hidden="true">${symbol}</span>
  `;

  card.addEventListener("click", () => {
    if (
      boardLocked ||
      card.classList.contains("is-flipped") ||
      card.classList.contains("is-matched")
    ) {
      return;
    }

    if (!gameTimer) {
      gameTimer = window.setInterval(updateGameTime, 1000);
    }

    card.classList.add("is-flipped");
    card.setAttribute("aria-label", `Card showing ${symbol}`);
    flippedCards.push(card);

    if (flippedCards.length !== 2) return;

    moves++;
    moveCount.textContent = moves;

    const [firstCard, secondCard] = flippedCards;

    if (firstCard.dataset.symbol === secondCard.dataset.symbol) {
      firstCard.classList.add("is-matched");
      secondCard.classList.add("is-matched");
      firstCard.setAttribute("aria-label", `Matched ${firstCard.dataset.symbol}`);
      secondCard.setAttribute("aria-label", `Matched ${secondCard.dataset.symbol}`);
      matchedPairs++;
      pairsFound.textContent = matchedPairs;
      flippedCards = [];

      if (matchedPairs === memorySymbols.length) {
        window.clearInterval(gameTimer);
        gameTimer = null;
        gameStatus.textContent =
          `Lovely work — all pairs found in ${moves} moves!`;
      } else {
        gameStatus.textContent = "A match! Find another pair.";
      }

      return;
    }

    boardLocked = true;
    gameStatus.textContent = "Not a match — try another pair.";

    mismatchTimeout = window.setTimeout(() => {
      flippedCards.forEach((flippedCard) => {
        flippedCard.classList.remove("is-flipped");
        flippedCard.setAttribute(
          "aria-label",
          `Hidden card ${[...gameBoard.children].indexOf(flippedCard) + 1}`
        );
      });

      flippedCards = [];
      boardLocked = false;
      mismatchTimeout = null;
      gameStatus.textContent = "Choose two cards to find a pair.";
    }, 800);
  });

  return card;
}

function startGameFunction() {
  if (gameTimer) {
    window.clearInterval(gameTimer);
  }

  if (mismatchTimeout) {
    window.clearTimeout(mismatchTimeout);
    mismatchTimeout = null;
  }

  const cards = [...memorySymbols, ...memorySymbols];

  for (let index = cards.length - 1; index > 0; index--) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [cards[index], cards[swapIndex]] = [cards[swapIndex], cards[index]];
  }

  gameBoard.replaceChildren(
    ...cards.map((symbol, index) => createMemoryCard(symbol, index))
  );

  flippedCards = [];
  matchedPairs = 0;
  moves = 0;
  elapsedSeconds = 0;
  gameTimer = null;
  boardLocked = false;

  pairsFound.textContent = "0";
  moveCount.textContent = "0";
  gameTime.textContent = "00:00";
  gameStatus.textContent = "Choose two cards to find a pair.";
}

startGame.addEventListener("click", startGameFunction);
startGameFunction();


/* ================= SMOOTH IMAGE HOVER ================= */

const images =
  document.querySelectorAll(
    ".hero-image-frame img, .about-image img"
  );

images.forEach((image) => {

  image.addEventListener("mousemove", (event) => {

    const rect =
      image.getBoundingClientRect();

    const x =
      ((event.clientX - rect.left) / rect.width - 0.5) * 4;

    const y =
      ((event.clientY - rect.top) / rect.height - 0.5) * 4;

    image.style.transform =
      `scale(1.04) translate(${x}px, ${y}px)`;

  });


  image.addEventListener("mouseleave", () => {

    image.style.transform =
      "scale(1)";

  });

});