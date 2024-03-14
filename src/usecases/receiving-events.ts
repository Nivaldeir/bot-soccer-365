import { Emitter } from "../domain/event"
import { File } from "../domain/file"


export class ReceivingEvents {
  constructor(private readonly emitter: Emitter) {
    this.initialize()
  }
  async initialize() {
    this.emitter.on("odd", async (params) => {
      let data = await File.Read('./data.json')
      const league = params["title"].split("-")[0]
      const isExist = !!data[league]
      if (isExist) {
        data[league].push({
          ...params,
          date: new Date().toISOString()
        })
      } else {
        data[league] = [{
          ...params,
          date: new Date().toISOString()
        }]
      }
      File.Write("data", data)
    })
  }
}