import { Emitter } from "../domain/event";
import Wallet from "./wallet";

export class Calculate {
  wallet = new Wallet(100);
  prohibited
  prohibitedDefault
  loss = 0;
  roundLoss = 0;
  constructor(readonly emitter: Emitter, prohibited: number) {
    this.prohibitedDefault = prohibited;
    this.prohibited = prohibited;
  }
  async execute() {
    this.emitter.on("odd", (input: InputOdd) => {
      if (this.loss > 2 && this.roundLoss < 2) {
        this.roundLoss++;
        return
      }
      if (input.winner === "Sim") {
        this.wallet.win(this.prohibited * input.odd)
        this.prohibited = this.prohibitedDefault
        this.loss = 0;
        console.log(`[Aporte] ${this.prohibited}`)
      }
      if (input.winner === "Não") {
        this.wallet.loss(this.prohibited)
        this.roundLoss++;
        this.prohibited = this.prohibited * 2
        this.loss++;
        console.log(`[LOSS ${this.loss}] ${this.prohibited} * 2 = ${this.prohibited * 2}`)
      }
      console.log(`[Carteira] ${this.wallet.amount}`)
      console.log(input)
    })
  }
}
type InputOdd = {
  winner: "Sim" | "Não",
  odd: number,
  title: string
}