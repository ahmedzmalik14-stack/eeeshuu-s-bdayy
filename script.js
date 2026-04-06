const typedLines = ["Hey eeesh... don't say NOOOO yet.", "Just click once."];
const chatScript = [
  { side: "received", text: "nokar??" },
  { side: "sent", text: "bhool gaya tha, washing em rn" },
  { side: "received", text: "i want an apple watch please" },
  { side: "sent", text: "next time" },
  { side: "sent", text: "what do u think i've got u for your birthday?" },
  { side: "received", text: "apple watch" },
  { side: "sent", text: "why are you so fixated" },
  { side: "received", text: "hehe i love it" },
  { side: "sent", text: "you order matcha every time and regret it every time" },
  { side: "received", text: "remind me not to order matcha again" },
  { side: "sent", text: "you get angry, disappear, sleep, and i'm still saying PLEASE" },
  { side: "received", text: "as you should" },
  { side: "sent", text: "professional shoplifter behavior, honestly" },
  { side: "received", text: "false allegations. rude." },
  { side: "sent", text: "let's go to this concert, we'll tell maa mw is hosting a rooftop concert 💀" },
  { side: "received", text: "BAHAHAHAHAH.... no!" },
  { side: "sent", text: "you say NOOOO like it's a personality trait" },
  { side: "received", text: "NOO!!" },
  { side: "sent", text: "but also... you show up" },
  { side: "sent", text: "when it actually matters" },
  { side: "received", text: "..." },
  { side: "sent", text: "happy birthday eeeshu 💗🫂" }
];

const letters = [
  { title: "Open when you're sad", body: "This is your reminder that one bad hour doesn't get to narrate your whole day. Drink water, breathe, and bully the sadness a little." },
  { title: "Open when you feel alone", body: "You're not as by-yourself as your brain sometimes makes it feel. Even when you're quiet, you still exist in people's care. Ahmed is always here yk that :3" },
  { title: "Open when you're overthinking", body: "Your brain loves making ten fake emergencies at once. Pause. Half of it is fear, the other half is lack of sleep." },
  { title: "Open when you can't sleep", body: "Put the phone down for five minutes. Yes, actually. If that fails, imagine me (Ahmed) yapping again and forcing u to lsn." },
  { title: "Open when you doubt yourself", body: "You've handled harder things than this, even when you were tired and dramatic and acting like the world was ending." },
  { title: "Open when you need motivation", body: "You don't need a perfect mood to start. You just need one tiny move. Start ugly, fix later, complain in between." },
  { title: "Open when you miss me", body: "Then text me, idiot. No dramatic silence, no mysterious vanishing, just come annoy me properly." },
  { title: "Open when you're happy", body: "Stay there a bit. Don't rush past good moments like they're suspicious. You are allowed to enjoy them without overanalyzing." }
];

const wheelData = {
  youOwe: ["Hug", "Your perfume", "Nothing (lucky you)", "Lunch", "Sheesha treat", "Watch", "Quit vaping", "1 week no NOOOO allowed", "You listen to me for once"],
  iOwe: ["Next birthday gift (anything)", "Another birthday gift", "Anything from new Huda Beauty strowbri collection", "Reel recreation (my choice)", "Aladdin genie wish", "Food anywhere"]
};

const wheelPalette = [
  "#48111f",
  "#6b1028",
  "#7f1d35",
  "#10233e",
  "#18314f",
  "#233d60",
  "#3b273c",
  "#5a3245",
  "#2a1c2c",
  "#3d1730",
  "#1a2b45"
];

const chaosWords = ["NOOOO", "PLEASE", "petty", "tetris again?", "dramatic", "shoplifter?"];
const puzzleImage = "assets/puzzle-photo.jpeg";
const puzzleImageUrl = puzzleImage;

const typedText = document.getElementById("typed-text");
const typedSubtext = document.getElementById("typed-subtext");
const startBtn = document.getElementById("start-btn");
const heartLayer = document.getElementById("heart-layer");
const cursorSparkles = document.getElementById("cursor-sparkles");
const puzzleBoard = document.getElementById("puzzle-board");
const puzzleStatus = document.getElementById("puzzle-status");
const puzzleReveal = document.getElementById("puzzle-reveal");
const puzzlePreview = document.getElementById("puzzle-preview");
const chatMessages = document.getElementById("chat-messages");
const lettersGrid = document.getElementById("letters-grid");
const letterModal = document.getElementById("letter-modal");
const letterTitle = document.getElementById("letter-title");
const letterBody = document.getElementById("letter-body");
const letterTag = document.getElementById("letter-tag");
const closeLetter = document.getElementById("close-letter");
const wheelResult = document.getElementById("wheel-result");
const chaosLayer = document.getElementById("chaos-layer");
const modeButtons = document.querySelectorAll(".mode-btn");

let puzzleOrder = [];
let selectedPuzzleIndex = null;
let puzzleSolved = false;
let chatStarted = false;
let wheelAngles = { youOwe: 0, iOwe: 0 };
let chaosInterval = null;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function typeLanding() {
  typedText.textContent = "";
  typedSubtext.textContent = "";
  for (let i = 0; i < typedLines[0].length; i += 1) { typedText.textContent += typedLines[0][i]; await wait(45); }
  await wait(320);
  for (let i = 0; i < typedLines[1].length; i += 1) { typedSubtext.textContent += typedLines[1][i]; await wait(40); }
}

function createHeart(x, y, symbol = "\u2665") {
  const heart = document.createElement("span");
  heart.className = "heart";
  heart.textContent = symbol;
  heart.style.left = `${x}px`;
  heart.style.top = `${y}px`;
  heart.style.setProperty("--drift-x", `${(Math.random() - 0.5) * 50}px`);
  heartLayer.appendChild(heart);
  setTimeout(() => heart.remove(), 6000);
}

function burstConfetti(x, y, amount = 24) {
  const colors = ["#ff7098", "#ffd166", "#7cc6ff", "#f4f1de", "#b8f2e6"];
  for (let i = 0; i < amount; i += 1) {
    const bit = document.createElement("span");
    bit.className = "confetti";
    bit.style.background = colors[i % colors.length];
    bit.style.left = `${x}px`;
    bit.style.top = `${y}px`;
    bit.style.setProperty("--confetti-x", `${(Math.random() - 0.5) * 220}px`);
    bit.style.setProperty("--confetti-rot", `${Math.random() * 540 - 270}deg`);
    heartLayer.appendChild(bit);
    setTimeout(() => bit.remove(), 1800);
  }
}

function setupPuzzle() {
  puzzlePreview.src = puzzleImageUrl;
  puzzleOrder = Array.from({ length: 9 }, (_, index) => index);
  do { puzzleOrder.sort(() => Math.random() - 0.5); } while (puzzleOrder.every((value, index) => value === index));
  renderPuzzle();
}

function renderPuzzle() {
  puzzleBoard.innerHTML = "";
  puzzleOrder.forEach((tileIndex, boardIndex) => {
    const tile = document.createElement("button");
    tile.className = "puzzle-tile";
    tile.setAttribute("aria-label", `Puzzle tile ${boardIndex + 1}`);
    const x = tileIndex % 3;
    const y = Math.floor(tileIndex / 3);
    const tileImage = document.createElement("img");
    tileImage.className = "puzzle-tile-image";
    tileImage.src = puzzleImageUrl;
    tileImage.alt = "";
    tileImage.draggable = false;
    tileImage.style.transform = `translate(-${x * 33.3333}%, -${y * 33.3333}%)`;
    if (selectedPuzzleIndex === boardIndex) tile.classList.add("selected");
    tile.addEventListener("click", () => handlePuzzleClick(boardIndex));
    tile.appendChild(tileImage);
    puzzleBoard.appendChild(tile);
  });
}

function handlePuzzleClick(index) {
  if (puzzleSolved) return;
  if (selectedPuzzleIndex === null) {
    selectedPuzzleIndex = index;
    puzzleStatus.textContent = "Tile selected. Pick another one to swap.";
    renderPuzzle();
    return;
  }
  if (selectedPuzzleIndex === index) {
    selectedPuzzleIndex = null;
    puzzleStatus.textContent = "Selection cleared. Continue the emotional labor.";
    renderPuzzle();
    return;
  }
  [puzzleOrder[selectedPuzzleIndex], puzzleOrder[index]] = [puzzleOrder[index], puzzleOrder[selectedPuzzleIndex]];
  selectedPuzzleIndex = null;
  renderPuzzle();
  if (puzzleOrder.every((value, idx) => value === idx)) {
    puzzleSolved = true;
    puzzleStatus.textContent = "Okay wow. Fixed.";
    puzzleReveal.classList.remove("hidden");
    const rect = puzzleBoard.getBoundingClientRect();
    burstConfetti(rect.left + rect.width / 2, rect.top + 60, 36);
  }
}

async function runChat() {
  if (chatStarted) return;
  chatStarted = true;
  for (const entry of chatScript) {
    const bubble = document.createElement("div");
    bubble.className = `message ${entry.side}`;
    bubble.textContent = entry.text;
    chatMessages.appendChild(bubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    await wait(document.body.dataset.mode === "party" ? 500 : 950);
  }
}

function setupLetters() {
  const template = document.getElementById("letter-template");
  letters.forEach((letter) => {
    const fragment = template.content.cloneNode(true);
    const button = fragment.querySelector(".letter-envelope");
    fragment.querySelector(".envelope-title").textContent = letter.title;
    button.addEventListener("click", () => {
      letterTag.textContent = "open when";
      letterTitle.textContent = letter.title;
      letterBody.textContent = letter.body;
      letterModal.classList.remove("hidden");
      burstConfetti(window.innerWidth / 2, window.innerHeight / 2, 16);
    });
    lettersGrid.appendChild(fragment);
  });
}

function closeLetterModal() { letterModal.classList.add("hidden"); }

function buildWheel(elementId, items) {
  const wheel = document.getElementById(elementId);
  const step = 360 / items.length;
  const palette = items.map((_, index) => wheelPalette[index % wheelPalette.length]);
  wheel.style.background = `conic-gradient(${items.map((_, index) => `${palette[index]} ${index * step}deg ${(index + 1) * step}deg`).join(", ")})`;
  items.forEach((item, index) => {
    const label = document.createElement("span");
    label.className = "wheel-label";
    const angle = step * index + step / 2;
    label.textContent = item;
    label.style.transform = `translate(-50%, -50%) rotate(${angle}deg) translateY(-116px) rotate(90deg)`;
    wheel.appendChild(label);
  });
}

function spinWheel(key) {
  const items = wheelData[key];
  const wheel = document.getElementById(key === "youOwe" ? "wheel-you-owe" : "wheel-i-owe");
  const selectedIndex = Math.floor(Math.random() * items.length);
  const slice = 360 / items.length;
  wheelAngles[key] += (5 * 360) + (360 - (selectedIndex * slice) - (slice / 2));
  wheel.style.transform = `rotate(${wheelAngles[key]}deg)`;
  setTimeout(() => {
    wheelResult.classList.remove("hidden");
    wheelResult.innerHTML = `<strong>${key === "youOwe" ? "Official ruling:" : "Fair enough:"}</strong> ${items[selectedIndex]}`;
    if (document.body.dataset.mode !== "soft") burstConfetti(window.innerWidth / 2, window.innerHeight / 2.6, 24);
  }, 4700);
}

function setMode(mode) {
  document.body.dataset.mode = mode;
  modeButtons.forEach((btn) => btn.classList.toggle("active", btn.dataset.modeTarget === mode));
  if (mode === "party") {
    burstConfetti(window.innerWidth / 2, 120, 28);
    clearInterval(chaosInterval);
    chaosLayer.innerHTML = "";
  } else if (mode === "chaos") {
    launchChaos();
  } else {
    clearInterval(chaosInterval);
    chaosLayer.innerHTML = "";
  }
}

function launchChaos() {
  chaosLayer.innerHTML = "";
  clearInterval(chaosInterval);
  const spawnWord = () => {
    if (document.body.dataset.mode !== "chaos") return;
    const word = document.createElement("span");
    word.className = "chaos-word";
    word.textContent = chaosWords[Math.floor(Math.random() * chaosWords.length)];
    word.style.left = `${Math.random() * window.innerWidth}px`;
    word.style.top = `${Math.random() * window.innerHeight}px`;
    chaosLayer.appendChild(word);
    setTimeout(() => word.remove(), 6000);
  };
  for (let i = 0; i < 8; i += 1) spawnWord();
  chaosInterval = setInterval(spawnWord, 700);
}

function setupRevealObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      if (entry.target.id === "chat") runChat();
      if (entry.target.classList.contains("timeline-card")) entry.target.classList.add("visible");
    });
  }, { threshold: 0.22 });
  document.querySelectorAll(".reveal-on-scroll, .timeline-card").forEach((el) => observer.observe(el));
}

function startCursorSparkles() {
  window.addEventListener("pointermove", (event) => {
    const dot = document.createElement("span");
    dot.className = "sparkle";
    dot.style.left = `${event.clientX}px`;
    dot.style.top = `${event.clientY}px`;
    cursorSparkles.appendChild(dot);
    setTimeout(() => dot.remove(), 650);
  });
}

function seedAmbientHearts() {
  setInterval(() => {
    createHeart(Math.random() * window.innerWidth, window.innerHeight - 20, Math.random() > 0.5 ? "\u2665" : "\u2726");
  }, 1200);
}

function setupEvents() {
  startBtn.addEventListener("click", () => {
    document.getElementById("puzzle").scrollIntoView({ behavior: "smooth" });
    burstConfetti(window.innerWidth / 2, window.innerHeight / 2.6, 18);
  });
  document.addEventListener("click", (event) => createHeart(event.clientX, event.clientY));
  closeLetter.addEventListener("click", closeLetterModal);
  letterModal.addEventListener("click", (event) => { if (event.target === letterModal) closeLetterModal(); });
  document.querySelectorAll(".spin-btn").forEach((button) => button.addEventListener("click", () => spinWheel(button.dataset.wheel)));
  modeButtons.forEach((button) => button.addEventListener("click", () => setMode(button.dataset.modeTarget)));
}

function init() {
  typeLanding();
  setupPuzzle();
  setupLetters();
  buildWheel("wheel-you-owe", wheelData.youOwe);
  buildWheel("wheel-i-owe", wheelData.iOwe);
  setupRevealObserver();
  startCursorSparkles();
  seedAmbientHearts();
  setupEvents();
}

init();
