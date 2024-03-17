import { Browser, Page } from "playwright";

export class LoginBet {
  constructor(private readonly page: Page) {
    this.initialize()
  }
  private async initialize() {
    await this.page.locator(".hm-MainHeaderRHSLoggedOutWide_LoginContainer").click()
    //Login
    await this.page.locator(".lms-StandardLogin_Username").fill(process.env.LOGIN_BET365!)
    //Password
    await this.page.locator(".lms-StandardLogin_Password").fill(process.env.PASSWORD_BET365!)
    await this.page.locator(".lms-LoginButton_Text").click()
    await this.page.locator(".ccm-CookieConsentPopup_Accept").click()
    await this.page.waitForTimeout(4000)
  }
}