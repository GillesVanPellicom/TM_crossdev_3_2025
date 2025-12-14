import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ExpressionEvaluationService {
  // Defines the precedence of operators and their associativity.
  private operators: { [key: string]: { precedence: number; associativity: 'left' | 'right'; type: 'binary' | 'unary' } } = {
    '+': { precedence: 2, associativity: 'left', type: 'binary' },
    '-': { precedence: 2, associativity: 'left', type: 'binary' },
    '*': { precedence: 3, associativity: 'left', type: 'binary' },
    '/': { precedence: 3, associativity: 'left', type: 'binary' },
    'sqrt': { precedence: 4, associativity: 'right', type: 'unary' },
    'sin': { precedence: 4, associativity: 'right', type: 'unary' },
    'cos': { precedence: 4, associativity: 'right', type: 'unary' },
    'tan': { precedence: 4, associativity: 'right', type: 'unary' },
    '_UNARY_MINUS_': { precedence: 5, associativity: 'right', type: 'unary' }, // Unary minus with higher precedence
  };

  // Evaluates a mathematical expression using the Shunting-yard algorithm.
  // This method tokenizes the expression, converts it to Reverse Polish Notation (RPN),
  // and then evaluates the RPN.
  evaluate(expression: string): number {
    const tokens = this.tokenize(expression);
    const rpn = this.shuntingYard(tokens);
    return this.evaluateRpn(rpn);
  }

  // Breaks down the input string into a sequence of tokens (numbers, operators, parentheses).
  private tokenize(expression: string): string[] {
    // Regex to match numbers (integers and floats), operators, parentheses, and scientific functions.
    // It's important that multi-character tokens like 'sqrt' are matched before single characters.
    const tokenRegex = /(\d+\.?\d*|\.\d+|sqrt|sin|cos|tan|[+\-*/()])|\s+/g;
    const tokens = expression.match(tokenRegex);
    // Filter out whitespace tokens and trim remaining tokens.
    return tokens ? tokens.filter(token => !/^\s+$/.test(token)).map(token => token.trim()) : [];
  }

  // Converts an infix expression (tokens) to Reverse Polish Notation (RPN)
  // using the Shunting-yard algorithm.
  private shuntingYard(tokens: string[]): string[] {
    const outputQueue: string[] = [];
    const operatorStack: string[] = [];
    // Flag to determine if the next '-' token should be treated as unary.
    // It's true at the start of the expression or after an operator/opening parenthesis.
    let expectOperand = true;

    for (const token of tokens) {
      if (!isNaN(parseFloat(token))) {
        // If it's a number, add it to the output queue.
        outputQueue.push(token);
        expectOperand = false;
      } else if (token === '(') {
        // If it's a left parenthesis, push it to the operator stack.
        operatorStack.push(token);
        expectOperand = true; // After '(', expect an operand or unary operator.
      } else if (token === ')') {
        // If it's a right parenthesis, pop operators from the stack
        // until a left parenthesis is encountered.
        while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== '(') {
          outputQueue.push(operatorStack.pop()!);
        }
        if (operatorStack.length === 0 || operatorStack[operatorStack.length - 1] !== '(') {
          throw new Error('Mismatched parentheses');
        }
        operatorStack.pop(); // Pop the left parenthesis.
        expectOperand = false; // After ')', expect a binary operator.
      } else if (token === '-' && expectOperand) {
        // Handle unary minus: replace with internal token and push to stack.
        const op1 = '_UNARY_MINUS_';
        let op2 = operatorStack[operatorStack.length - 1];

        while (
          op2 &&
          op2 !== '(' &&
          this.operators[op2] && // Ensure op2 is a known operator
          this.operators[op2].precedence >= this.operators[op1].precedence
        ) {
          outputQueue.push(operatorStack.pop()!);
          op2 = operatorStack[operatorStack.length - 1];
        }
        operatorStack.push(op1);
        expectOperand = true; // After unary minus, still expect an operand.
      } else if (token in this.operators) {
        // If it's a binary operator or a scientific function.
        const op1 = token;
        let op2 = operatorStack[operatorStack.length - 1];

        while (
          op2 &&
          op2 !== '(' &&
          this.operators[op2] && // Ensure op2 is a known operator
          (this.operators[op2].precedence > this.operators[op1].precedence ||
            (this.operators[op2].precedence === this.operators[op1].precedence &&
              this.operators[op1].associativity === 'left'))
        ) {
          outputQueue.push(operatorStack.pop()!);
          op2 = operatorStack[operatorStack.length - 1];
        }
        operatorStack.push(op1);
        expectOperand = true; // After an operator, expect an operand or unary operator.
      } else {
        throw new Error(`Unknown token: ${token}`);
      }
    }

    // Pop any remaining operators from the stack to the output queue.
    while (operatorStack.length > 0) {
      const op = operatorStack.pop()!;
      if (op === '(' || op === ')') {
        throw new Error('Mismatched parentheses');
      }
      outputQueue.push(op);
    }

    return outputQueue;
  }

  // Evaluates an expression in Reverse Polish Notation (RPN).
  private evaluateRpn(rpnTokens: string[]): number {
    const stack: number[] = [];

    for (const token of rpnTokens) {
      if (!isNaN(parseFloat(token))) {
        // If it's a number, push it to the stack.
        stack.push(parseFloat(token));
      } else if (token in this.operators) {
        // If it's an operator or function, apply it.
        const operator = this.operators[token];
        if (operator.type === 'binary') {
          const right = stack.pop();
          const left = stack.pop();
          if (left === undefined || right === undefined) {
            throw new Error('Invalid expression: not enough operands for binary operator');
          }
          stack.push(this.applyBinaryOperator(token, left, right));
        } else if (operator.type === 'unary') {
          const operand = stack.pop();
          if (operand === undefined) {
            throw new Error('Invalid expression: not enough operands for unary operator');
          }
          stack.push(this.applyUnaryOperator(token, operand));
        }
      } else {
        throw new Error(`Unknown token in RPN: ${token}`);
      }
    }

    if (stack.length !== 1) {
      throw new Error('Invalid expression: too many operands or operators');
    }

    return stack[0];
  }

  // Applies a binary operator to two operands.
  private applyBinaryOperator(operator: string, left: number, right: number): number {
    switch (operator) {
      case '+': return left + right;
      case '-': return left - right;
      case '*': return left * right;
      case '/':
        if (right === 0) throw new Error('Division by zero');
        return left / right;
      default: throw new Error(`Unknown binary operator: ${operator}`);
    }
  }

  // Applies a unary operator (scientific function or unary minus) to an operand.
  private applyUnaryOperator(operator: string, operand: number): number {
    // Convert degrees to radians for trigonometric functions, as is common for calculators.
    const toRadians = (deg: number) => deg * Math.PI / 180;

    switch (operator) {
      case '_UNARY_MINUS_': return -operand;
      case 'sqrt':
        if (operand < 0) throw new Error('Square root of negative number');
        return Math.sqrt(operand);
      case 'sin': return Math.sin(toRadians(operand));
      case 'cos': return Math.cos(toRadians(operand));
      case 'tan': return Math.tan(toRadians(operand));
      default: throw new Error(`Unknown unary operator: ${operator}`);
    }
  }
}
