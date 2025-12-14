import { Component } from '@angular/core';
import { ExpressionEvaluationService } from './expression-evaluation.service'; // Import the service

@Component({
  selector: 'app-normal-calculator',
  template: `
    <h2>Normal Mode</h2>
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
        <button class="accent-button" (click)="calculate()">=</button>
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
      h2 {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-size: 24px;
        color: #333;
        margin-bottom: 20px;
      }
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
        min-height: 30px; /* Set a minimum height */
        line-height: 30px; /* Vertically center the text */
        overflow: hidden;
        white-space: nowrap;
        font-family: 'Courier New', Courier, monospace;
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
        background-color: #e0e0e0;
      }
      .accent-button {
        background-color: var(--accent-color, #007bff);
        color: white;
      }
    `,
  ],
})
export class NormalCalculatorComponent {
  // The string currently displayed on the calculator screen.
  display = '';

  // Inject the ExpressionEvaluationService
  constructor(private expressionEvaluationService: ExpressionEvaluationService) {}

  // Appends a value to the display string.
  append(value: string) {
    this.display += value;
  }

  // Clears the display.
  clear() {
    this.display = '';
  }

  // Evaluates the expression in the display using the safe expression parser.
  calculate() {
    try {
      const result = this.expressionEvaluationService.evaluate(this.display);
      this.display = result.toString();
    } catch (e) {
      this.display = 'Error';
    }
  }
}
