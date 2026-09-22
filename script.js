const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#site-nav');
const pages = [...document.querySelectorAll('[data-page]')];
const routeLinks = [...document.querySelectorAll('[data-route]')];
const pageTitles = {
  home: '나만 아는 재미 — 체스',
  charm: '체스의 매력 — 나만 아는 재미',
  moments: '좋아하는 세 순간 — 나만 아는 재미',
  puzzle: '당신의 한 수 — 나만 아는 재미',
  closing: '오늘, 한 판 어때? — 나만 아는 재미'
};

function showPage(route) {
  const currentRoute = pageTitles[route] ? route : 'home';
  const targetPage = document.querySelector(`[data-page="${currentRoute}"]`);

  pages.forEach((page) => {
    page.hidden = page !== targetPage;
    page.classList.remove('active');
  });

  targetPage.hidden = false;
  requestAnimationFrame(() => {
    targetPage.classList.add('active');
    targetPage.querySelectorAll('.reveal').forEach((element) => element.classList.add('visible'));
  });

  routeLinks.forEach((link) => {
    if (link.closest('nav')) {
      if (link.dataset.route === currentRoute) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    }
  });

  document.title = pageTitles[currentRoute];
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.textContent = '메뉴';
  window.scrollTo({ top: 0, behavior: 'auto' });
}

function routeFromHash() {
  showPage(window.location.hash.slice(1) || 'home');
}

menuButton.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.textContent = isOpen ? '닫기' : '메뉴';
});

window.addEventListener('hashchange', routeFromHash);

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

const board = document.querySelector('#chessboard');
const status = document.querySelector('#puzzle-status');
const resetButton = document.querySelector('#reset-puzzle');
const puzzleNumber = document.querySelector('#puzzle-number');
const puzzleTotal = document.querySelector('#puzzle-total');
const puzzleDifficulty = document.querySelector('#puzzle-difficulty');
const puzzleTitle = document.querySelector('#puzzle-title');
const puzzleDescription = document.querySelector('#puzzle-description');
const puzzleHint = document.querySelector('#board-hint');
const focusPiece = document.querySelector('#focus-piece');
const moveAnswer = document.querySelector('#move-answer');
const puzzlePicker = document.querySelector('#puzzle-picker');
const previousButton = document.querySelector('#previous-puzzle');
const nextButton = document.querySelector('#next-puzzle');
const celebration = document.querySelector('#celebration');

const puzzles = [
  {
    title: '왕 바로 옆의 약점',
    difficulty: '입문',
    focus: '♕',
    description: '백의 차례. 퀸을 움직여 한 수 만에 체크메이트를 만들어 보자.',
    hint: '가장 약한 칸은 왕 바로 옆에 있어.',
    ready: 'h5의 흰색 퀸을 먼저 선택해 주세요.',
    selected: '좋아요. 이제 퀸이 향할 마지막 칸을 선택하세요.',
    wrong: '왕을 바로 공격하면서 도망갈 칸도 막아야 해요.',
    success: '체크메이트! 가장 유명한 첫 번째 전술을 찾았어요. ✦',
    solution: { from: 'h5', to: 'f7', notation: 'Qxf7#', highlight: 'e8' },
    pieces: {
      a8: ['♜', 'black'], c8: ['♝', 'black'], d8: ['♛', 'black'], e8: ['♚', 'black'], f8: ['♝', 'black'], h8: ['♜', 'black'],
      a7: ['♟', 'black'], b7: ['♟', 'black'], c7: ['♟', 'black'], d7: ['♟', 'black'], f7: ['♟', 'black'], g7: ['♟', 'black'], h7: ['♟', 'black'],
      c6: ['♞', 'black'], f6: ['♞', 'black'], e5: ['♟', 'black'],
      a1: ['♖', 'white'], b1: ['♘', 'white'], c1: ['♗', 'white'], e1: ['♔', 'white'], h1: ['♖', 'white'],
      a2: ['♙', 'white'], b2: ['♙', 'white'], c2: ['♙', 'white'], d2: ['♙', 'white'], f2: ['♙', 'white'], g2: ['♙', 'white'], h2: ['♙', 'white'],
      c4: ['♗', 'white'], f3: ['♘', 'white'], h5: ['♕', 'white'], e4: ['♙', 'white']
    }
  },
  {
    title: '마지막 줄의 함정',
    difficulty: '초급',
    focus: '♖',
    description: '흑의 왕은 자기 폰에 갇혀 있다. 룩으로 단번에 승부를 끝내 보자.',
    hint: 'e열은 비어 있고, 상대 룩은 잡을 수 있어.',
    ready: 'e1의 흰색 룩을 선택해 주세요.',
    selected: '열린 e열 끝에서 기다리는 말을 노려보세요.',
    wrong: '좋은 생각이지만, 마지막 줄 전체를 장악할 수가 있어요.',
    success: '백랭크 메이트! 자기 말이 왕의 퇴로를 막았네요. ✦',
    solution: { from: 'e1', to: 'e8', notation: 'Rxe8#', highlight: 'g8' },
    pieces: {
      e8: ['♜', 'black'], g8: ['♚', 'black'], f7: ['♟', 'black'], g7: ['♟', 'black'], h7: ['♟', 'black'],
      e1: ['♖', 'white'], g1: ['♔', 'white'], f2: ['♙', 'white'], g2: ['♙', 'white'], h2: ['♙', 'white']
    }
  },
  {
    title: '두 마리를 한 번에',
    difficulty: '중급',
    focus: '♘',
    description: '나이트 한 번으로 왕을 공격하고, 동시에 흑의 퀸까지 노려보자.',
    hint: '나이트는 직선이 아니라 L자로 뛰어든다.',
    ready: 'e5의 흰색 나이트를 선택해 주세요.',
    selected: '체크가 되면서 d8의 퀸도 공격하는 칸은 어디일까요?',
    wrong: '왕과 퀸을 동시에 바라보는 착지점을 찾아보세요.',
    success: '나이트 포크! 다음 수에 퀸을 얻을 수 있어요. ✦',
    solution: { from: 'e5', to: 'f7', notation: 'Nf7+', highlight: 'h8' },
    pieces: {
      d8: ['♛', 'black'], h8: ['♚', 'black'], g7: ['♟', 'black'], h7: ['♟', 'black'],
      e5: ['♘', 'white'], g1: ['♔', 'white'], f2: ['♙', 'white'], g2: ['♙', 'white'], h2: ['♙', 'white']
    }
  },
  {
    title: '가장 작은 말의 반전',
    difficulty: '보너스',
    focus: '♙',
    description: '긴 여행을 끝낸 폰이 마지막 한 칸을 남겨 두고 있다. 새로운 모습으로 바꿔 보자.',
    hint: '폰은 반대편 끝에 닿으면 가장 강한 말이 될 수 있어.',
    ready: 'b7의 흰색 폰을 선택해 주세요.',
    selected: '딱 한 칸만 더. 체스판의 끝으로 전진하세요.',
    wrong: '폰은 이번에도 평소처럼 앞으로 한 칸 움직여요.',
    success: '프로모션! 가장 작은 폰이 퀸으로 다시 태어났어요. ✦',
    solution: { from: 'b7', to: 'b8', notation: 'b8=Q', result: ['♕', 'white'], highlight: 'b8' },
    pieces: { h8: ['♚', 'black'], b7: ['♙', 'white'], f6: ['♔', 'white'] }
  }
];

let pieces = {};
let currentPuzzle = 0;
let selected = null;
let solved = false;
let lastMove = null;
const solvedPuzzles = new Set();

function clonePieces(source) {
  return Object.fromEntries(Object.entries(source).map(([position, piece]) => [position, [...piece]]));
}

function renderPuzzlePicker() {
  puzzlePicker.innerHTML = '';
  puzzles.forEach((puzzle, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'puzzle-dot';
    if (index === currentPuzzle) button.classList.add('active');
    if (solvedPuzzles.has(index)) button.classList.add('solved');
    button.setAttribute('aria-label', `${index + 1}번 퍼즐: ${puzzle.title}`);
    button.setAttribute('aria-pressed', String(index === currentPuzzle));
    button.addEventListener('click', () => loadPuzzle(index));
    puzzlePicker.appendChild(button);
  });
}

function drawBoard() {
  const puzzle = puzzles[currentPuzzle];
  board.innerHTML = '';
  for (let rank = 8; rank >= 1; rank -= 1) {
    for (let fileIndex = 0; fileIndex < 8; fileIndex += 1) {
      const file = String.fromCharCode(97 + fileIndex);
      const position = `${file}${rank}`;
      const square = document.createElement('button');
      const piece = pieces[position];
      square.type = 'button';
      square.dataset.position = position;
      square.className = `square ${(fileIndex + rank) % 2 === 0 ? 'light' : 'dark'}`;
      square.setAttribute('aria-label', `${position}${piece ? ` ${piece[1]} piece` : ''}`);
      if (piece) {
        square.textContent = piece[0];
        square.classList.add(`${piece[1]}-piece`);
      }
      if (selected === position) square.classList.add('selected');
      if (selected === puzzle.solution.from && position === puzzle.solution.to) square.classList.add('target');
      if (solved && position === puzzle.solution.highlight) square.classList.add('mated');
      if (lastMove === position) square.classList.add('last-move');
      square.addEventListener('click', handleSquareClick);
      board.appendChild(square);
    }
  }
}

function handleSquareClick(event) {
  if (solved) return;
  const position = event.currentTarget.dataset.position;
  const puzzle = puzzles[currentPuzzle];
  const { from, to, notation, result } = puzzle.solution;

  if (!selected) {
    if (position === from) {
      selected = position;
      status.textContent = puzzle.selected;
    } else if (pieces[position]?.[1] === 'white') {
      status.textContent = `그 말도 좋지만, 이번에는 ${puzzle.focus} 표시의 말을 움직여 볼까요?`;
    } else {
      status.textContent = puzzle.ready;
    }
  } else if (selected === from && position === to) {
    const movingPiece = result ? [...result] : pieces[from];
    delete pieces[to];
    delete pieces[from];
    pieces[to] = movingPiece;
    solved = true;
    selected = null;
    lastMove = to;
    solvedPuzzles.add(currentPuzzle);
    status.textContent = puzzle.success;
    status.classList.add('success');
    moveAnswer.textContent = notation;
    board.classList.add('solved');
    launchConfetti();
    renderPuzzlePicker();
  } else {
    selected = null;
    status.textContent = puzzle.wrong;
    board.classList.remove('wrong');
    requestAnimationFrame(() => board.classList.add('wrong'));
    window.setTimeout(() => board.classList.remove('wrong'), 450);
  }
  drawBoard();
}

function loadPuzzle(index) {
  currentPuzzle = (index + puzzles.length) % puzzles.length;
  const puzzle = puzzles[currentPuzzle];
  pieces = clonePieces(puzzle.pieces);
  selected = null;
  solved = false;
  lastMove = null;
  puzzleNumber.textContent = String(currentPuzzle + 1).padStart(2, '0');
  puzzleTotal.textContent = String(puzzles.length).padStart(2, '0');
  puzzleDifficulty.textContent = puzzle.difficulty;
  puzzleTitle.textContent = puzzle.title;
  puzzleDescription.textContent = puzzle.description;
  puzzleHint.textContent = `힌트 · ${puzzle.hint}`;
  focusPiece.textContent = puzzle.focus;
  status.textContent = puzzle.ready;
  status.classList.remove('success');
  moveAnswer.textContent = '';
  board.classList.remove('solved', 'wrong');
  celebration.innerHTML = '';
  previousButton.disabled = currentPuzzle === 0;
  nextButton.textContent = currentPuzzle === puzzles.length - 1 ? '첫 퍼즐로 →' : '다음 퍼즐 →';
  renderPuzzlePicker();
  drawBoard();
}

function launchConfetti() {
  const colors = ['#ff5f6d', '#ff9e45', '#f4d84b', '#4fc98b', '#52bce9', '#7771df', '#ce66cf'];
  celebration.innerHTML = '';
  for (let index = 0; index < 34; index += 1) {
    const piece = document.createElement('i');
    piece.className = 'confetti';
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = colors[index % colors.length];
    piece.style.animationDelay = `${Math.random() * .35}s`;
    piece.style.transform = `rotate(${Math.random() * 180}deg)`;
    celebration.appendChild(piece);
  }
  window.setTimeout(() => { celebration.innerHTML = ''; }, 2200);
}

resetButton.addEventListener('click', () => loadPuzzle(currentPuzzle));
previousButton.addEventListener('click', () => loadPuzzle(currentPuzzle - 1));
nextButton.addEventListener('click', () => loadPuzzle(currentPuzzle + 1));
document.querySelector('#to-top').addEventListener('click', () => {
  if (window.location.hash === '#home') showPage('home');
  else window.location.hash = 'home';
});

loadPuzzle(0);
routeFromHash();
