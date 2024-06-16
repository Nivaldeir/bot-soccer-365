console.clear()
import { CalculateWallet } from "./usecases/calculate-wallet";
import GetResult from "./usecases/get-result-bet";
import { firefox } from "playwright";
import { Wallet } from "./domain/wallet";
import { File } from "./infra/file";

let settings: { [key: string]: any } = {}
const league = File.Read(`${process.cwd()}/${process.env.league}.json`) as Array<any>
if (league) {
  settings = {
    wallet: parseFloat(league[league.length - 1].wallet),
    contribution: parseFloat(league[league.length - 1].contribution)
  }
} else {
  settings = {
    wallet: parseFloat(process.env.wallet!).toFixed(2),
    contribution: parseFloat(process.env.contribution!).toFixed(2),
  }
}

async function main() {
  const browser = await firefox.launch({ headless: true, tracesDir: "./browser" });
  const wallet = new Wallet(settings.wallet)
  const calculateWallet = new CalculateWallet(wallet, settings.contribution, process.env.league!)
  const getResult = new GetResult(browser, calculateWallet)
  await getResult.execute(process.env.league!);
}
main()