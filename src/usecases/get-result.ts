import { Page, firefox } from "playwright"
import { Emitter } from "../domain/event"
export default class GetResult {
  constructor(private readonly emitter: Emitter) { }
  async execute() {
    const browser = await firefox.launch({
      headless: true,
    })
    const page = await browser.newPage({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/XXXX.X.XXXX.X Safari/537.36'
    })
    await page.goto("https://www.bet365.com/#/HQ/")
    await page.waitForLoadState("networkidle")
    await page.getByText("Esportes Virtuais").click()
    await page.waitForTimeout(2000)
    await page.locator(".vs-VirtualSplashPod").first().click()
    await page.waitForTimeout(2000)
    this.returnPage(page)
    let lastTitle: string | null
    while (true) {
      // try {
        await page.waitForTimeout(30000)
        await page.locator(".vr-ResultsNavBarButton").first().click()
        await page.waitForTimeout(2000)
        const winner = await page.locator("div.gl-MarketGroupPod:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(6) > div:nth-child(2)").textContent()
        const odd = await page.locator("div.gl-MarketGroupPod:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(6) > div:nth-child(3)").textContent()
        const title = await page.locator("div.gl-MarketGroupPod:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)").textContent()
        if (title?.includes("Premier League -") && lastTitle! !== title) {
          this.emitter.emit("odd", {
            winner,
            odd,
            title
          })
          lastTitle = title
        } else {
          await this.returnPage(page)
        }
        await page.waitForTimeout(3000)
        await page.locator("div.vr-EventTimesNavBarButton:nth-child(2)").first().click()
        await page.waitForTimeout(3000)
      // } catch (error) {
      //   await this.returnPage(page)
      // }
    }
  }
  async returnPage(page: Page) {
    try {
      await page.getByText("Premier League").click()
    } catch (error) {
    }
  }
  async refreshPage(page: Page) {
    await page.reload()
    await page.waitForTimeout(1000)
    await this.returnPage(page)
  }
}

type Input = {}