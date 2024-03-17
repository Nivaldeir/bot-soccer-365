import { Browser, Page } from "playwright";
import { LoginBet } from "./login";
import { CalculateWallet } from "./calculate-wallet";

export default class GetResultBet {
  constructor(private readonly browser: Browser, private readonly calculateWallet: CalculateWallet) { }

  async execute(league: string) {
    const page = await this.browser.newPage({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/XXXX.X.XXXX.X Safari/537.36'
    });
    await page.goto("https://www.bet365.com/#/AVR/B146/R^1/");
    new LoginBet(page)
    await this.returnPage(page, league);

    let lastTitle = '';

    while (true) {
      if(!await page.getByText("Minhas Apostas").textContent()){
        new LoginBet(page)
      }
      let awaitTimeEvent = await page.locator(".svc-MarketGroup_BookCloses > span:nth-child(2)").textContent()
      const [minutosStr, segundosStr] = awaitTimeEvent!.split(':');
      const totalSegundos = parseInt(minutosStr, 10) * 60 + parseInt(segundosStr, 10);
      const limiteSegundos = 40;
      await page.waitForTimeout((totalSegundos - limiteSegundos) * 1000)
      if (totalSegundos < limiteSegundos) {
        try {
          await page.locator(".vr-ResultsNavBarButton").click();
        } catch (error) {
          console.log("linha 24")
        }
        const winner = await page.locator('div.gl-MarketGroupPod:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(6) > div:nth-child(2)').textContent();
        const odd = await page.locator("div.gl-MarketGroupPod:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(6) > div:nth-child(3)").textContent();
        const title = await page.locator("div.gl-MarketGroupPod:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)").textContent();
        const timeHome = await page.locator("div.gl-MarketGroupPod:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1)").textContent();
        const plate = await page.locator("div.gl-MarketGroupPod:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > span:nth-child(1)").textContent();
        const timeVisitor = await page.locator("div.gl-MarketGroupPod:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3) > div:nth-child(1)").textContent();
        await page.locator("div.vr-EventTimesNavBarButton:nth-child(2) > div:nth-child(1)").click();
        if (title?.includes(league) && lastTitle !== title && odd && winner && timeHome && plate && timeVisitor) {
          const output = this.calculateWallet.execute({
            odd,
            winner,
            title,
            plate,
            timeVisitor
          })
          await this.aporte(page, output)
        }
        await page.waitForTimeout(140 * 1000)
      }
    }
  }

  async returnPage(page: Page, league: string) {
    try {
      await page.getByText(league).click();
    } catch (error) {
      // console.error(error);
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
  
  async aporte(page: Page, amount: number) {
    await page.locator("div.gl-MarketGroupPod:nth-child(5) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)").click({ delay: 500 })
    await page.waitForTimeout(1000)
    await page.locator(".bsf-StakeBox_StakeAmount").click()
    let prices = amount.toFixed(2).toString().replace(".", ",").split("")
    for (let price of prices) {
      await page.keyboard.type(price)
      await page.waitForTimeout(1000)
    }
    await page.locator(".bsf-PlaceBetButton_TopRow > div:nth-child(1)").click()
    await page.locator(".bss-ReceiptContent_Done").click({delay: 1000});
    //NA 4 X ele me desloga aqui
  }
}
