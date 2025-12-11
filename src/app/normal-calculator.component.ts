import { Component } from '@angular/core';

@Component({
  selector: 'app-normal-calculator',
  template: `
    <h2>Normal Calculator</h2>
    <div class="calculator">
      <div class="display">{{ display }}</div>
      <div class="buttons">
        <button (click)="clear()">C</button>
        <button (click)="append('/')">/</button>
        <button (click)="append('*')">*</button>
        <button (click)="append('-')">-</button>
        <button (click)="append('7')">7</button>
        <button (click)="append('8')">8</button>
        <button (click)="append('9')">9</button>
        <button (click)="append('+')">+</button>
        <button (click)="append('4')">4</button>
        <button (click)="append('5')">5</button>
        <button (click)="append('6')">6</button>
        <button (click)="calculate()">=</button>
        <button (click)="append('1')">1</button>
        <button (click)="append('2')">2</button>
        <button (click)="append('3')">3</button>
        <button (click)="append('0')">0</button>
        <button (click)="append('.')">.</button>
      </div>
    </div>
  `,
  styles: [
    `
      .calculator {
        width: 300px;
        border: 1px solid #ccc;
        border-radius: 5px;
        padding: 10px;
      }
      .display {
        background-color: #f0f0f0;
        padding: 10px;
        text-align: right;
        font-size: 24px;
        margin-bottom: 10px;
      }
      .buttons {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 5px;
      }
      button {
        padding: 15px;
        font-size: 18px;
        border: 1px solid #ccc;
        border-radius: 5px;
        cursor: pointer;
        background-color: var(--accent-color, #e0e0e0);
      }
    `,
  ],
})
export class NormalCalculatorComponent {
  display = '';

  append(value: string) {
    this.display += value;
  }

  clear() {
    this.display = '';
  }

  calculate() {
    try {
      this.display = eval(this.display);
    } catch (e) {
      this.display = 'Error';
    }
  }
}
