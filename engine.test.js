import test from 'node:test';
import assert from 'node:assert/strict';
import {fits,place,canPlay} from './engine.js';
test('rejects overlap and pieces wrapping over an edge',() => {
  const board = Array(64).fill(null);
  board[0] = 'green';
  assert.equal(fits(board,[[0,0]],0,0),false);
  assert.equal(fits(board,[[0,0],[0,1]],0,7),false);
  assert.equal(place(board,[[0,0]],0,0,'gold'),null);
});
test('clears intersecting row and column simultaneously and scores both',() => {
  const board = Array(64).fill(null);
  for (let index = 1; index < 8; index++) { board[index] = 'green'; board[index * 8] = 'green'; }
  const result = place(board,[[0,0]],0,0,'gold');
  assert.equal(result.lines,2);
  assert.equal(result.points,51);
  assert.equal(result.cleared.length,15);
  assert.equal(new Set(result.cleared).size,15);
  assert.equal(result.beforeClear[0],'gold');
  assert.ok(result.cleared.every(index => result.beforeClear[index] && !result.board[index]));
  assert.ok(result.board.every(cell => !cell));
  assert.equal(board[1],'green');
});
test('detects when a piece has no legal placement',() => {
  const board = Array(64).fill('green');
  board[63] = null;
  assert.equal(canPlay(board,[[0,0]]),true);
  assert.equal(canPlay(board,[[0,0],[0,1]]),false);
});
test('rejects a partial overlap without changing any occupied squares',() => {
  const board = Array(64).fill(null);
  board[1] = 'green';
  const before = [...board];
  assert.equal(place(board,[[0,0],[0,1]],0,0,'gold'),null);
  assert.deepEqual(board,before);
});
test('keeps placed squares occupied until their entire row or column clears',() => {
  for (const vertical of [false,true]) {
    let board = Array(64).fill(null);
    board[63] = 'purple';
    for (let position = 0; position < 7; position++) {
      const result = place(board,[[0,0]],vertical ? position : 0,vertical ? 0 : position,'green');
      assert.equal(result.lines,0);
      board = result.board;
      assert.equal(place(board,[[0,0]],0,0,'gold'),null);
    }
    const result = place(board,[[0,0]],vertical ? 7 : 0,vertical ? 0 : 7,'gold');
    assert.equal(result.lines,1);
    assert.equal(result.board[63],'purple');
    assert.equal(fits(result.board,[[0,0]],0,0),true);
  }
});
