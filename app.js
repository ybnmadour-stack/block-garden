import {SIZE,SHAPES,fits,canPlay,place} from './engine.js';
const colors = ['#91b887','#dfb573','#8cbfba','#c591a1','#a5a0d1'];
const boardElement = document.querySelector('#board');
const trayElement = document.querySelector('#tray');
const statusElement = document.querySelector('#status');
const dialog = document.querySelector('#gameover');
let board = Array(SIZE * SIZE).fill(null);
let pieces = [];
let selected = null;
let score = 0;
let best = 0;
let gesture = null;
let clearing = false;
let gameVersion = 0;
let clearAnimations = [];
try { best = Number(localStorage.getItem('block-garden-best')) || 0; } catch {}
function refill() {
  pieces = Array.from({length:3},() => ({shape:SHAPES[Math.floor(Math.random() * SHAPES.length)],color:colors[Math.floor(Math.random() * colors.length)]}));
  if (!pieces.some(piece => canPlay(board,piece.shape)) && board.some(value => !value)) pieces[0] = {shape:SHAPES[0],color:colors[0]};
}
function render() {
  boardElement.replaceChildren(...board.map((color,index) => {
    const cell = document.createElement('button');
    cell.className = `cell${color ? ' filled' : ''}`;
    cell.dataset.index = index;
    cell.setAttribute('aria-label',`Row ${Math.floor(index / SIZE) + 1}, column ${index % SIZE + 1}, ${color ? 'occupied' : 'empty'}`);
    if (color) cell.style.setProperty('--block',color);
    cell.addEventListener('click',() => drop(index));
    return cell;
  }));
  trayElement.replaceChildren(...pieces.map((piece,index) => {
    const button = document.createElement('button');
    button.className = `piece${selected === index ? ' selected' : ''}`;
    button.disabled = !piece || clearing;
    button.setAttribute('aria-pressed',String(selected === index));
    button.setAttribute('aria-label',piece ? `Block ${index + 1}, ${piece.shape.length} squares. Select then choose its top-left position on the board.` : 'Block already placed');
    if (piece) {
      const width = Math.max(...piece.shape.map(cell => cell[1])) + 1;
      const height = Math.max(...piece.shape.map(cell => cell[0])) + 1;
      const grid = document.createElement('span');
      grid.className = 'piece-grid';
      grid.style.gridTemplateColumns = `repeat(${width},1fr)`;
      grid.style.setProperty('--block',piece.color);
      for (let row = 0; row < height; row++) for (let column = 0; column < width; column++) {
        const cell = document.createElement('span');
        cell.className = `mini${piece.shape.some(([shapeRow,shapeColumn]) => shapeRow === row && shapeColumn === column) ? ' filled' : ''}`;
        grid.append(cell);
      }
      button.append(grid);
      button.addEventListener('click',() => select(index));
      button.addEventListener('pointerdown',event => {
        if (clearing || event.button !== 0) return;
        gesture = {index,startX:event.clientX,startY:event.clientY,moved:false};
      });
    }
    return button;
  }));
  document.querySelector('#score').textContent = score;
  document.querySelector('#best').textContent = best;
}
function select(index) {
  if (clearing || !pieces[index]) return;
  selected = index;
  statusElement.textContent = 'Tap where the block’s top-left corner should go.';
  render();
}
function clearPreview() {
  for (const cell of boardElement.children) cell.classList.remove('preview','invalid','blocked');
}
function cellAt(clientX,clientY) {
  const bounds = boardElement.getBoundingClientRect();
  const column = Math.floor((clientX - bounds.left - 10) / ((bounds.width - 20 + 5) / SIZE));
  const row = Math.floor((clientY - bounds.top - 10) / ((bounds.height - 20 + 5) / SIZE));
  return row >= 0 && row < SIZE && column >= 0 && column < SIZE ? row * SIZE + column : null;
}
document.addEventListener('pointermove',event => {
  if (!gesture) return;
  if (Math.hypot(event.clientX - gesture.startX,event.clientY - gesture.startY) > 7) gesture.moved = true;
  if (!gesture.moved) return;
  selected = gesture.index;
  clearPreview();
  const index = cellAt(event.clientX,event.clientY);
  if (index === null) return;
  const row = Math.floor(index / SIZE);
  const column = index % SIZE;
  const shape = pieces[selected].shape;
  const valid = fits(board,shape,row,column);
  statusElement.textContent = valid ? 'Release to place your block.' : 'Space taken or outside the board. Try another spot.';
  for (const [rowOffset,columnOffset] of shape) {
    const targetRow = row + rowOffset;
    const targetColumn = column + columnOffset;
    if (targetRow < SIZE && targetColumn < SIZE) {
      const targetIndex = targetRow * SIZE + targetColumn;
      boardElement.children[targetIndex].classList.add(board[targetIndex] ? 'blocked' : valid ? 'preview' : 'invalid');
    }
  }
});
document.addEventListener('pointerup',event => {
  if (!gesture) return;
  const dragged = gesture.moved;
  selected = gesture.index;
  gesture = null;
  clearPreview();
  if (dragged) {
    event.preventDefault();
    const index = cellAt(event.clientX,event.clientY);
    if (index !== null) drop(index);
    else render();
  }
});
document.addEventListener('pointercancel',() => { gesture = null; clearPreview(); });
async function drop(index) {
  if (clearing) return;
  if (selected === null || !pieces[selected]) { statusElement.textContent = 'Choose one of the blocks below first.'; return; }
  const piece = pieces[selected];
  const result = place(board,piece.shape,Math.floor(index / SIZE),index % SIZE,piece.color);
  if (!result) { statusElement.textContent = 'That block cannot fit here. Occupied squares stay taken until a full row or column clears.'; return; }
  const version = gameVersion;
  board = result.lines ? result.beforeClear : result.board;
  score += result.points;
  best = Math.max(best,score);
  try { localStorage.setItem('block-garden-best',String(best)); } catch {}
  pieces[selected] = null;
  selected = null;
  clearing = result.lines > 0;
  gesture = null;
  statusElement.textContent = result.lines ? `${result.lines > 1 ? 'Beautiful combo!' : 'Room to grow!'} +${result.points} points` : 'Lovely. Find a home for the next block.';
  render();
  if (clearing) {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    clearAnimations = result.cleared.map((cellIndex,order) => {
      const cell = boardElement.children[cellIndex];
      return cell.animate(reducedMotion ? [
        {backgroundColor:'#ffe59a'},
        {backgroundColor:'#ffe59a'}
      ] : [
        {backgroundColor:board[cellIndex],transform:'scale(1)',opacity:1,offset:0},
        {backgroundColor:'#ffe59a',transform:'scale(1.08)',opacity:1,offset:0.3},
        {backgroundColor:'#f9c65c',transform:'scale(1)',opacity:1,offset:0.55},
        {backgroundColor:'#f9c65c',transform:'scale(0.15)',opacity:0,offset:1}
      ],{duration:reducedMotion ? 180 : 520,delay:reducedMotion ? 0 : order * 14,easing:'ease-in-out',fill:'forwards'});
    });
    await Promise.all(clearAnimations.map(animation => animation.finished.catch(() => {})));
    if (version !== gameVersion) return;
    for (const animation of clearAnimations) animation.cancel();
    clearAnimations = [];
    board = result.board;
    clearing = false;
  }
  if (pieces.every(piece => !piece)) refill();
  render();
  if (!pieces.some(piece => piece && canPlay(board,piece.shape))) {
    document.querySelector('#final-score').textContent = score;
    dialog.showModal();
  }
}
function restart() {
  gameVersion++;
  for (const animation of clearAnimations) animation.cancel();
  clearAnimations = [];
  clearing = false;
  board = Array(SIZE * SIZE).fill(null);
  score = 0;
  selected = null;
  gesture = null;
  if (dialog.open) dialog.close();
  refill();
  statusElement.textContent = 'Pick a block, then tap the board — or drag it.';
  render();
}
document.querySelector('#restart').addEventListener('click',restart);
document.querySelector('#again').addEventListener('click',restart);
restart();
if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(() => {});
