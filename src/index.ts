console.clear()
import { Emitter } from "./domain/event";
import { Calculate } from "./usecases/calculate";
import GetResult from "./usecases/get-result";
import { ReceivingEvents } from "./usecases/receiving-events";


const emitter: Emitter = new Emitter();
new ReceivingEvents(emitter)
new Calculate(emitter, 1.00).execute()
const puppeteer = new GetResult(emitter)

async function main() {
  await puppeteer.execute()
}
main()