export function add(a, b) {
    return a + b;
}
export function subtract(a, b) {
    return a - b;
}
export function multiply(a, b) {
    return a * b;
}
export function divide(a, b) {
    if (b === 0) return "Error: Division by zero";
    return a / b
}

export function square(a) {
    return a * a;
}

export function interest(principal, rate, time) {
    return (principal * rate * time) / 100;
}

export function compoundInterest(principal, rate, time, n) {
    return principal * (1 + rate / n) ** (n * time);
}