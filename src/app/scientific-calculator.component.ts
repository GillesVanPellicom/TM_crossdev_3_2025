import { Component } from '@angular/core';

@Component({
  selector: 'app-scientific-calculator',
  template: `
    <h2>Scientific Calculator</h2>
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
        <button (click)="scientific('sqrt')">√</button>
        <button (click)="scientific('sin')">sin</button>
        <button (click)="scientific('cos')">cos</button>
        <button (click)="scientific('tan')">tan</button>
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
export class ScientificCalculatorComponent {
  // The string currently displayed on the calculator screen.
  display = '';

  // Appends a value to the display string.
  append(value: string) {
    this.display += value;
  }

  // Clears the display.
  clear() {
    this.display = '';
  }

  // Evaluates the expression in the display.
  // Uses Function constructor for safer evaluation than eval().
  // This prevents access to local scope, but still executes arbitrary code.
  // For a production app, a proper expression parser is recommended.
  calculate() {
    try {
      // Sanitize the expression to only allow numbers and basic operators.
      const sanitizedExpression = this.display.replace(/[^-()\d/*+.]/g, '');
      const result = new Function('return ' + sanitizedExpression)();
      this.display = result.toString();
    } catch (e) {
      this.display = 'Error';
    }
  }

  // Applies a scientific function to the current display value.
  scientific(func: string) {
    try {
      const value = parseFloat(this.display);
      // Apply the selected scientific function.
      switch (func) {
        case 'sqrt':
          this.display = Math.sqrt(value).toString();
          break;
        case 'sin':
          // Convert degrees to radians for Math.sin
          this.display = Math.sin(value * Math.PI / 180).toString();
          break;
        case 'cos':
          // Convert degrees to radians for Math.cos
          this.display = Math.cos(value * Math.PI / 180).toString();
          break;
        case 'tan':
          // Convert degrees to radians for Math.tan
          this.display = Math.tan(value * Math.PI / 180).toString();
          break;
      }
    } catch (e) {
      this.display = 'Error';
    }
  }
}
