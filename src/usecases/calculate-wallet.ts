import { File } from "../infra/file";
import { CalculateWalletLoss } from "./validate-loss-wallet";

type IWallet = {
  amount: number
  win: (number: number) => void
  loss: (number: number) => void
}

export class CalculateWallet extends CalculateWalletLoss {
  constructor(readonly wallet: IWallet, private contribution: number = 0.75, readonly league: string) {
    super()
  }
  async execute(input: InputOdd) {
    if (this.again()) {
      if (input.winner === "Sim") {
        this.contribution * parseFloat(input.odd)
        this.wallet.win(this.contribution)
        this.contribution = parseFloat(process.env.contribution!)
        this.reset()
      }
      if (input.winner === "Não") {
        this.wallet.loss(this.contribution)
        this.contribution = this.contribution * 2
        this.registerLoss()
      }
      await this.saved(input)
      console.clear()
      console.log(`----------------------------------------------------------------------`)
      console.log(`[${this.league}] Aporte: ${this.contribution.toFixed(2)} Loss: ${this.lossCount}`)
      console.log(`[${this.league}] Saldo: ${this.wallet.amount.toFixed(2)}`)
      console.log(`----------------------------------------------------------------------`)
      return this.wallet.amount
    }
  }
  async saved(data: InputOdd) {
    let _path = process.cwd()
    const readLeague = await File.Read(`${_path}/${this.league}.json`)
    console.log(`${_path}/${this.league}.json`)
    if (readLeague) {
      readLeague.push({ ...data, wallet: this.wallet.amount, contribution: this.contribution })
      File.Write(this.league, readLeague)
      return
    } else {
      File.Write(this.league, [])
    }
  }
}
type InputOdd = {
  winner: string
  odd: string,
  title: string,
  plate: string
  timeVisitor: string
}