export default class {
  amount: number
  constructor(amount: number) {
    this.amount = amount
  }
  win(value: number): void {
    this.amount += value
  }
  loss(value: number): void {
    this.amount -= value
  }
}