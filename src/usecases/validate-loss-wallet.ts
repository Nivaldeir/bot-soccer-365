export class CalculateWalletLoss {
   lossCount = 0;
   waitRounds = 0;

  again(): boolean {
    if (this.waitRounds > 0) {
      this.waitRounds--;
      return false;
    } else if (this.lossCount >= 3) {
      this.waitRounds = 3;
      this.lossCount = 0;
      return false;
    }
    return true;
  }

  registerLoss() {
    this.lossCount++;
  }
  reset() {
    this.lossCount = 0;
    this.waitRounds = 0;
  }
}