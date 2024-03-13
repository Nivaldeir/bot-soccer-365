import { Emitter } from "../domain/event"
import { File } from "../domain/file"


export class ReceivingEvents {
  constructor(private readonly emitter: Emitter) {
    this.emitter.on("odd", (params) => {
       File.Write("data", JSON.stringify(params))
    })
  }
}