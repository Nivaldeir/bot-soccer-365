console.clear()
import { Emitter } from "./domain/event";
import { Calculate } from "./usecases/calculate";
import GetResult from "./usecases/get-result";
import config from "./setting"
import { ReceivingEvents } from "./usecases/receiving-events";
import { firefox } from "playwright";

async function main() {
  const browser = await firefox.launch({
    headless: true,
  });

  const getResultPromises = config.leagues.map(async (league, index) => {
    const emitter: Emitter = new Emitter();
    new ReceivingEvents(emitter)
    new Calculate(emitter, league).execute()
    const getResult = new GetResult(emitter, browser)
    await getResult.execute(league, (index + 2));
  });
  await Promise.resolve(getResultPromises);
}
main()