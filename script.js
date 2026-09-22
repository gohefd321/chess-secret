const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#site-nav');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
menuButton.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.textContent = open ? '닫기' : '메뉴';
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.textContent = '메뉴';
}));
if ('IntersectionObserver' in window) {
  document.body.classList.add('motion-ready');
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.remove('pending');
      observer.unobserve(entry.target);
    }
  }), { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(element => {
    element.classList.add('pending');
    observer.observe(element);
  });
}
let scrollScheduled = false;
function updateScene() {
  const range = document.documentElement.scrollHeight - innerHeight;
  document.querySelector('.reading-progress').style.transform = 'scaleX(' + (range > 0 ? scrollY / range : 0) + ')';
  const scene = document.querySelector('.cinema');
  const rect = scene.getBoundingClientRect();
  if (!reducedMotion.matches && rect.top < innerHeight && rect.bottom > 0) {
    document.querySelector('.cinema-backdrop').style.transform = 'translateY(' + Math.max(-60, Math.min(60, -rect.top * .08)) + 'px) scale(1.05)';
  }
  scrollScheduled = false;
}
addEventListener('scroll', () => {
  if (!scrollScheduled) { requestAnimationFrame(updateScene); scrollScheduled = true; }
}, { passive: true });
addEventListener('resize', updateScene);
updateScene();
document.querySelectorAll('.story-card, .board-stage').forEach(element => {
  element.addEventListener('pointermove', event => {
    if (reducedMotion.matches || event.pointerType !== 'mouse') return;
    const rect = element.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    const boardScene = element.querySelector('.sculpture-board');
    if (boardScene) boardScene.style.transform = 'rotateX(' + (55 - y * 8) + 'deg) rotateZ(' + (-30 + x * 10) + 'deg)';
    else element.style.transform = 'perspective(900px) rotateX(' + (-y * 5) + 'deg) rotateY(' + (x * 5) + 'deg)';
  });
  element.addEventListener('pointerleave', () => {
    element.style.transform = '';
    const boardScene = element.querySelector('.sculpture-board');
    if (boardScene) boardScene.style.transform = '';
  });
});

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
      if (solved && position === puzzle.solution.highlight) square.classList.add('mated');
      if (lastMove === position) square.classList.add('last-move');
      const coordinate = document.createElement('small');
      coordinate.textContent = position;
      square.appendChild(coordinate);
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
  if (reducedMotion.matches) return;
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
  document.querySelector('#home').scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth' });
});

loadPuzzle(0);

const pieceGuide = [
  ['♔', 'KING', '킹 · 지켜야 할 단 한 말', '모든 방향으로 한 칸. 상대에게 공격받는 칸으로는 갈 수 없다. 체크를 받으면 반드시 해소해야 한다.', '킹의 안전이 모든 계획의 출발점.'],
  ['♕', 'QUEEN', '퀸 · 가장 넓은 시야', '가로, 세로, 대각선으로 원하는 만큼 이동한다. 다른 말을 뛰어넘을 수는 없다.', '강하지만 혼자서는 모든 일을 할 수 없어.'],
  ['♖', 'ROOK', '룩 · 열린 길의 지배자', '가로와 세로로 원하는 만큼 이동한다. 폰이 없는 열린 열에서 힘을 발휘한다.', '막힌 길이 열리면 룩의 시간이 온다.'],
  ['♗', 'BISHOP', '비숍 · 대각선의 전문가', '대각선으로 원하는 만큼 이동한다. 처음 놓인 칸과 같은 색의 칸만 다닌다.', '멀리 있는 말도 같은 대각선 위라면.'],
  ['♘', 'KNIGHT', '나이트 · 예상 밖의 도약', '한 방향으로 두 칸, 직각으로 한 칸을 움직인다. 유일하게 다른 말을 뛰어넘을 수 있다.', '두 말을 동시에 노리는 포크의 주인공.'],
  ['♙', 'PAWN', '폰 · 작지만 긴 이야기', '앞으로 한 칸, 첫 이동에는 두 칸도 가능하다. 상대 말은 앞쪽 대각선 한 칸에서 잡는다. 끝줄에 닿으면 퀸·룩·비숍·나이트로 승격한다. 앙파상은 상대 폰이 시작 위치에서 두 칸 전진해 내 폰과 같은 줄의 바로 옆 칸에 왔을 때 쓸 수 있는 특별한 잡기다. 내 폰을 앞쪽 대각선으로 한 칸 움직여 상대 폰이 지나온 빈칸에 놓고, 옆 칸의 상대 폰을 제거한다. 상대가 두 칸 전진한 바로 다음 내 차례에만 가능하며, 다른 수를 두면 기회가 사라진다. 앙파상으로 내 킹이 공격받게 된다면 둘 수 없다.', '예를 들어 백 폰이 e5에 있고 흑 폰이 d7에서 d5로 왔다면, 바로 다음 수에 백 폰을 e5에서 d6으로 옮기고 d5의 흑 폰을 잡을 수 있어. 꼭 잡아야 하는 것은 아니야.']
];
const tabs = document.querySelector('.piece-tabs');
function selectPiece(index) {
  const item = pieceGuide[index];
  ['piece-symbol', 'piece-english', 'piece-name', 'piece-description', 'piece-tip'].forEach((id, field) => {
    document.getElementById(id).textContent = item[field];
  });
  [...tabs.children].forEach((button, buttonIndex) => button.setAttribute('aria-pressed', String(index === buttonIndex)));
}
pieceGuide.forEach((item, index) => {
  const button = document.createElement('button');
  button.textContent = item[0];
  button.setAttribute('aria-label', item[2]);
  button.addEventListener('click', () => selectPiece(index));
  tabs.appendChild(button);
});
selectPiece(0);

// A legal Scholar's Mate sequence: 1.e4 e5 2.Bc4 Nc6 3.Qh5 Nf6 4.Qxf7#.
const startPosition = {};
const whiteBack = ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖'];
const blackBack = ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'];
for (let file = 0; file < 8; file += 1) {
  const letter = String.fromCharCode(97 + file);
  startPosition[letter + '1'] = [whiteBack[file], 'white'];
  startPosition[letter + '2'] = ['♙', 'white'];
  startPosition[letter + '7'] = ['♟', 'black'];
  startPosition[letter + '8'] = [blackBack[file], 'black'];
}
const reviewSteps = [
  { moves: [], notation: 'START / 대국 전', title: '모든 이야기는 여기서.', description: '백부터 한 수씩 번갈아 둔다. 지금은 폰이 길을 막고 있어 비숍과 퀸이 나오기 어렵다.', question: '중앙 폰을 움직이면 어떤 말의 길이 열릴까?' },
  { moves: [['e2','e4'],['e7','e5']], notation: '1. e4 e5', title: '중앙에 첫 발을 딛다.', description: '양쪽 모두 중앙을 차지하면서 비숍과 퀸의 길을 열었다. 좋은 오프닝은 여러 말이 함께 나올 자리를 만든다.', question: '한 말만 계속 움직이는 것과 여러 말을 전개하는 것, 무엇이 다를까?' },
  { moves: [['f1','c4'],['b8','c6']], notation: '2. Bc4 Nc6', title: '비숍의 시선은 f7로.', description: '백 비숍은 c4에서 f7 폰을 바라본다. 흑은 나이트를 전개했지만 f7은 여전히 왕 하나만 지키고 있다.', question: '누가 지키고 있는지 세어 보면 약한 칸을 찾을 수 있을까?' },
  { moves: [['d1','h5'],['g8','f6']], notation: '3. Qh5 Nf6?', title: '공격하기 전에, 위협부터.', description: '흑 나이트가 퀸을 공격했다. 하지만 백 퀸과 비숍이 함께 f7을 노린다. 퀸을 쫓는 것보다 메이트 위협을 막는 일이 급하다. 예를 들어 3…g6으로 대각선을 막는 방어를 검토할 수 있다.', question: '상대가 다음 수에 할 수 있는 가장 강한 체크는 무엇일까?' },
  { moves: [['h5','f7']], notation: '4. Qxf7#', title: '복기의 핵심은 한 수 전.', description: '퀸이 f7을 잡으며 체크메이트. 비숍이 퀸을 지켜 왕은 퀸을 잡을 수 없다. 결과를 탓하기보다, 직전 수에서 위협을 확인하지 못한 이유를 찾는다.', question: '다음 판에는 말을 두기 전에 상대의 체크를 한 번 확인해 볼까?' }
];
let reviewIndex = 0;
let reviewTimer = null;
const reviewBoard = document.querySelector('#review-board');
function renderReview() {
  const position = clonePieces(startPosition);
  let destination = '';
  for (let index = 0; index <= reviewIndex; index += 1) {
    for (const [from, to] of reviewSteps[index].moves) {
      position[to] = position[from];
      delete position[from];
      destination = to;
    }
  }
  reviewBoard.replaceChildren();
  for (let rank = 8; rank >= 1; rank -= 1) {
    for (let file = 0; file < 8; file += 1) {
      const coordinate = String.fromCharCode(97 + file) + rank;
      const piece = position[coordinate];
      const square = document.createElement('div');
      square.className = 'square ' + ((file + rank) % 2 === 0 ? 'light' : 'dark');
      if (piece) {
        square.textContent = piece[0];
        square.classList.add(piece[1] + '-piece');
      }
      if (coordinate === destination) square.classList.add('last-move');
      square.setAttribute('aria-label', coordinate + (piece ? ' ' + piece[0] : ' 빈 칸'));
      const label = document.createElement('small');
      label.textContent = coordinate;
      square.appendChild(label);
      reviewBoard.appendChild(square);
    }
  }
  const step = reviewSteps[reviewIndex];
  document.querySelector('#review-count').textContent = '0' + (reviewIndex + 1) + ' / 05';
  ['notation','title','description','question'].forEach(field => {
    document.querySelector('#review-' + field).textContent = step[field];
  });
  document.querySelector('#review-prev').disabled = reviewIndex === 0;
  document.querySelector('#review-next').disabled = reviewIndex === reviewSteps.length - 1;
}
function stopReview() {
  clearInterval(reviewTimer);
  reviewTimer = null;
  document.querySelector('#review-play').textContent = '자동 재생 ▷';
}
document.querySelector('#review-prev').addEventListener('click', () => { stopReview(); reviewIndex = Math.max(0, reviewIndex - 1); renderReview(); });
document.querySelector('#review-next').addEventListener('click', () => { stopReview(); reviewIndex = Math.min(4, reviewIndex + 1); renderReview(); });
document.querySelector('#review-play').addEventListener('click', () => {
  if (reviewTimer) { stopReview(); return; }
  if (reviewIndex === 4) { reviewIndex = 0; renderReview(); }
  document.querySelector('#review-play').textContent = '일시 정지 Ⅱ';
  reviewTimer = setInterval(() => {
    reviewIndex += 1;
    renderReview();
    if (reviewIndex === 4) stopReview();
  }, 5000);
});
document.addEventListener('visibilitychange', () => { if (document.hidden) stopReview(); });
renderReview();
const note = document.querySelector('#review-note');
const noteStatus = document.querySelector('#note-status');
try { note.value = localStorage.getItem('chess-review-note') || ''; } catch { noteStatus.textContent = '이 환경에서는 메모가 현재 화면에만 유지돼요.'; }
note.addEventListener('input', () => {
  try {
    localStorage.setItem('chess-review-note', note.value);
    noteStatus.textContent = '이 브라우저에 저장했어요.';
  } catch { noteStatus.textContent = '저장할 수 없는 환경이에요. 떠나기 전에 메모를 복사해 주세요.'; }
});
