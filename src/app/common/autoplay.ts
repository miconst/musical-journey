// tslint:disable: variable-name

export class Autoplay {
  private _timerID?: number;

  get ended(): boolean {
    return this._timerID === undefined;
  }

  constructor(public timeout?: number) { }

  stop(): void {
    if (this._timerID) {
      clearTimeout(this._timerID);
      this._timerID = undefined;
    }
  }

  play(callback: () => (boolean | void)): void {
    this.stop();
    this._timerID = setTimeout(() => {
      this._timerID = undefined;
      if (callback()) {
        this.play(callback);
      }
    }, this.timeout);
  }
}
