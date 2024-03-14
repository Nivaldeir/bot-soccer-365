import { Browser, Page } from "playwright";
import { Emitter } from "../domain/event";

export default class GetResult {
  constructor(private readonly emitter: Emitter, private readonly browser: Browser) { }

  async execute(league: string, index: number) {
    const page = await this.browser.newPage({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/XXXX.X.XXXX.X Safari/537.36'
    });
    await page.goto("https://www.bet365.com/#/AVR/B146/R^1/");
    await this.returnPage(page, league);

    let lastTitle = '';

    while (true) {
      let awaitTimeEvent = await page.locator(".svc-MarketGroup_BookCloses > span:nth-child(2)").textContent()
      const [minutosStr, segundosStr] = awaitTimeEvent!.split(':');
      const totalSegundos = parseInt(minutosStr, 10) * 60 + parseInt(segundosStr, 10);
      await page.waitForTimeout((totalSegundos - 20) * 1000)
      const limiteSegundos = 25;
      if (totalSegundos < limiteSegundos) {
        try {
          await page.locator(".vr-ResultsNavBarButton").click();
        } catch (error) {
          console.log("linha 24")
        }
        await page.waitForTimeout(10000);
        const winner = await page.locator('div.gl-MarketGroupPod:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(6) > div:nth-child(2)').textContent();
        const odd = await page.locator("div.gl-MarketGroupPod:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(6) > div:nth-child(3)").textContent();
        const title = await page.locator("div.gl-MarketGroupPod:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)").textContent();
        const timeHome = await page.locator("div.gl-MarketGroupPod:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1)").textContent();
        const plate = await page.locator("div.gl-MarketGroupPod:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > span:nth-child(1)").textContent();
        const timeVisitor = await page.locator("div.gl-MarketGroupPod:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3) > div:nth-child(1)").textContent();
        if (title?.includes(league) && lastTitle !== title) {
          this.emitter.emit("odd", {
            winner,
            odd,
            title,
            timeHome,
            plate,
            timeVisitor
          });
          lastTitle = title;
        }
        await page.locator("div.vr-EventTimesNavBarButton:nth-child(2) > div:nth-child(1)").click();
        await page.waitForTimeout(145 * 1000)
      } else {
        console.log("Acima de 20s")
      }
    }
  }

  async returnPage(page: Page, league: string) {
    try {
      await page.getByText(league, { exact: false }).click();
    } catch (error) {
      console.error(error);
    }
  }

  async refreshPage(page: Page, league: string) {
    try {
      await page.reload();
      await page.waitForTimeout(1000);
      await this.returnPage(page, league);
    } catch (error) {
      console.error("Erro ao atualizar a página:", error);
    }
  }
}
