import { Emitter } from "../domain/event";
import Wallet from "../domain/wallet";
import config from "../setting/index";

export class Calculate {
  wallet = new Wallet(config.wallet);
  prohibited
  prohibitedDefault
  loss = 0;
  lossCount = 0
  winCount = 0
  roundLoss = 0;
  constructor(readonly emitter: Emitter, readonly nameWallet: string) {
    this.prohibitedDefault = config.price;
    this.prohibited = config.price;
  }
  async execute() {
    this.emitter.on("odd", (input: InputOdd) => {
      if (input.winner === "Sim" && this.roundLoss == 0) {
        this.wallet.win(this.prohibited * input.odd)
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
    })
  }
  again() {
    this.loss++;
    if (this.loss === 3) {
      this.roundLoss++;
    }
  }
}
type InputOdd = {
  winner: "Sim" | "Não",
  odd: number,
  title: string
}