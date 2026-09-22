const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#site-nav');

menuButton.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.textContent = isOpen ? '닫기' : '메뉴';
});

nav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.textContent = '메뉴';
  });
});

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

const pieces = {
  a8: ['♜', 'black'], c8: ['♝', 'black'], d8: ['♛', 'black'], e8: ['♚', 'black'], f8: ['♝', 'black'], h8: ['♜', 'black'],
  a7: ['♟', 'black'], b7: ['♟', 'black'], c7: ['♟', 'black'], d7: ['♟', 'black'], f7: ['♟', 'black'], g7: ['♟', 'black'], h7: ['♟', 'black'],
  c6: ['♞', 'black'], f6: ['♞', 'black'], e5: ['♟', 'black'],
  a1: ['♖', 'white'], b1: ['♘', 'white'], c1: ['♗', 'white'], e1: ['♔', 'white'], h1: ['♖', 'white'],
  a2: ['♙', 'white'], b2: ['♙', 'white'], c2: ['♙', 'white'], d2: ['♙', 'white'], f2: ['♙', 'white'], g2: ['♙', 'white'], h2: ['♙', 'white'],
  c4: ['♗', 'white'], f3: ['♘', 'white'], h5: ['♕', 'white'], e4: ['♙', 'white']
};

let selected = null;
let solved = false;

function drawBoard() {
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
      if (selected === 'h5' && position === 'f7') square.classList.add('target');
      if (solved && position === 'e8') square.classList.add('mated');
      square.addEventListener('click', handleSquareClick);
      board.appendChild(square);
    }
  }
}

function handleSquareClick(event) {
  if (solved) return;
  const position = event.currentTarget.dataset.position;
  if (!selected) {
    if (position === 'h5') {
      selected = position;
      status.textContent = '좋아요. 이제 퀸이 향할 마지막 칸을 선택하세요.';
    } else if (pieces[position]?.[1] === 'white') {
      status.textContent = '그 말도 좋지만, 이번에는 퀸을 움직여 볼까요?';
    } else {
      status.textContent = '먼저 h5의 흰색 퀸을 선택해 주세요.';
    }
  } else if (selected === 'h5' && position === 'f7') {
    pieces.f7 = ['♕', 'white'];
    delete pieces.h5;
    solved = true;
    selected = null;
    status.textContent = '체크메이트! Qxf7# — 바로 이 순간이 체스의 재미예요. ✦';
    status.classList.add('success');
  } else {
    selected = null;
    status.textContent = '아깝네요. 왕을 바로 공격하면서 도망갈 칸도 막아야 해요.';
  }
  drawBoard();
}

function resetPuzzle() {
  delete pieces.f7;
  pieces.f7 = ['♟', 'black'];
  pieces.h5 = ['♕', 'white'];
  selected = null;
  solved = false;
  status.textContent = '흰색 퀸을 먼저 선택해 주세요.';
  status.classList.remove('success');
  drawBoard();
}

resetButton.addEventListener('click', resetPuzzle);
document.querySelector('#to-top').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

drawBoard();
