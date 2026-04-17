import { Component, signal, computed } from '@angular/core';
import { NgClass } from '@angular/common';

type Cell = 'X' | 'O' | null;

const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

@Component({
  selector: 'app-root',
  imports: [NgClass],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  board = signal<Cell[]>(Array(9).fill(null));
  currentPlayer = signal<'X' | 'O'>('X');

  winner = computed(() => {
    const b = this.board();
    for (const [a, b2, c] of WINNING_COMBINATIONS) {
      if (b[a] && b[a] === b[b2] && b[a] === b[c]) return b[a];
    }
    return null;
  });

  isDraw = computed(() => !this.winner() && this.board().every(c => c !== null));

  winningCells = computed(() => {
    const b = this.board();
    for (const combo of WINNING_COMBINATIONS) {
      const [a, b2, c] = combo;
      if (b[a] && b[a] === b[b2] && b[a] === b[c]) return combo;
    }
    return [];
  });

  play(index: number) {
    if (this.board()[index] || this.winner()) return;

    this.board.update(b => {
      const next = [...b];
      next[index] = this.currentPlayer();
      return next;
    });

    this.currentPlayer.update(p => p === 'X' ? 'O' : 'X');
  }

  restart() {
    this.board.set(Array(9).fill(null));
    this.currentPlayer.set('X');
  }
}
