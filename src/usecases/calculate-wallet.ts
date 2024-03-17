import { Emitter } from "../domain/event";
import Wallet from "../domain/wallet";
import config from "../setting/index";

export class CalculateWallet {
  wallet = new Wallet(config.wallet);
  prohibited
  prohibitedDefault
  loss = 0;
  lossCount = 0
  winCount = 0
  roundLoss = 0;
  constructor(readonly nameWallet: string) {
    this.prohibitedDefault = config.price;
    this.prohibited = config.price;
  }
  execute(input: InputOdd) {
    if (this.again()) {
      this.prohibited = 0
    }
    if (this.loss === 0 && this.roundLoss === 0) {
      this.prohibited = this.prohibitedDefault
    }
    if (input.winner === "Sim" && this.roundLoss == 0) {
      this.wallet.win(this.prohibited * parseFloat(input.odd))
      this.prohibited = this.prohibitedDefault
      console.log(`[Aporte] ${this.prohibited}`)
      this.winCount++;
      this.loss = 0;
    }
    if (input.winner === "Não") {
      this.wallet.loss(this.prohibited)
      console.log(`[LOSS ${this.loss}] ${this.prohibited}`)
      this.prohibited = this.prohibited * 2
      this.loss++;
      this.lossCount++
    }
    console.log(`[${this.nameWallet}] ${this.wallet.amount.toLocaleString('pt-BR')} [Win] ${this.winCount} [Loss] ${this.lossCount}`)
    return this.prohibited
  }
  private again() {
    if (this.loss === 2 && this.lossCount != 2) {
      this.roundLoss++;
      return false
    } else if (this.roundLoss == 2) {
      this.loss = 0
      return true
    }
    return false
  }
}
type InputOdd = {
  winner: string
  odd: string,
  title: string,
  plate: string
  timeVisitor: string
}