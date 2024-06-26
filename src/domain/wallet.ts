export class Wallet {
  amount: number
  constructor(amount: number) {
    this.amount = amount
  }
  win(value: number): void {
    this.validate(this.amount)
    this.amount += value
  }
  loss(value: number): void {
    this.validate(this.amount)
    this.amount -= value
  }
  private validate(value: number) {
    if (value < 0.75) {
      throw new Error("Valor minimo R$ 0.75")
    }
  }
}