export const SIZE = 8;
export const SHAPES = [ [[0,0]], [[0,0],[0,1]], [[0,0],[1,0]], [[0,0],[0,1],[0,2]], [[0,0],[1,0],[2,0]], [[0,0],[0,1],[1,0],[1,1]], [[0,0],[1,0],[2,0],[2,1]], [[0,1],[1,1],[2,0],[2,1]], [[0,0],[0,1],[0,2],[1,1]], [[0,1],[0,2],[1,0],[1,1]], [[0,0],[0,1],[0,2],[0,3]], [[0,0],[1,0],[2,0],[3,0]], [[0,0],[0,1],[0,2],[1,0],[1,1],[1,2],[2,0],[2,1],[2,2]] ];
export function fits(board, shape, row, column) {
  return shape.every(([rowOffset,columnOffset]) => {
    const targetRow = row + rowOffset;
    const targetColumn = column + columnOffset;
    return targetRow >= 0 && targetRow < SIZE && targetColumn >= 0 && targetColumn < SIZE && !board[targetRow * SIZE + targetColumn];
  });
}
export function canPlay(board, shape) {
  return board.some((_,index) => fits(board,shape,Math.floor(index / SIZE),index % SIZE));
}
export function place(board, shape, row, column, color) {
  if (!fits(board,shape,row,column)) return null;
  const next = [...board];
  for (const [rowOffset,columnOffset] of shape) next[(row + rowOffset) * SIZE + column + columnOffset] = color;
  const rows = Array.from({length:SIZE},(_,index) => index).filter(targetRow => next.slice(targetRow * SIZE,targetRow * SIZE + SIZE).every(Boolean));
  const columns = Array.from({length:SIZE},(_,index) => index).filter(targetColumn => Array.from({length:SIZE},(_,targetRow) => next[targetRow * SIZE + targetColumn]).every(Boolean));
  const beforeClear = [...next];
  const cleared = [];
  for (let index = 0; index < next.length; index++) if (rows.includes(Math.floor(index / SIZE)) || columns.includes(index % SIZE)) {
    cleared.push(index);
    next[index] = null;
  }
  const lines = rows.length + columns.length;
  return {board:next,beforeClear,cleared,points:shape.length + lines * 20 + Math.max(0,lines - 1) * 10,lines};
}
