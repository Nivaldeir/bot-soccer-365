console.clear()
import { Emitter } from "./domain/event";
import { CalculateWallet } from "./usecases/calculate-wallet";
import GetResult from "./usecases/get-result-bet";
import config from "./setting"
import { ReceivingEvents } from "./usecases/receiving-events";
import { firefox } from "playwright";

async function main() {
  const browser = await firefox.launch({ headless: false , tracesDir: "./browser"});
  const getResultPromises = config.leagues.map(async (league, index) => {
    const emitter: Emitter = new Emitter();
    new ReceivingEvents(emitter)
    const calculateWallet = new CalculateWallet(league)
    const getResult = new GetResult(browser, calculateWallet)
    await getResult.execute(league);
  });
  await Promise.resolve(getResultPromises)
}
main()