export class WebSocketPipe {
  public constructor(private urlGetter: () => string) {}

  private _ws: WebSocket | null = null;
  private _state = false;

  get ws(): WebSocket | null {
    return this._ws;
  }

  onOpen?: (event: Event) => void | Promise<void>;
  onClose?: (event: Event) => void | Promise<void>;
  onMessage?: (event: MessageEvent) => void | Promise<void>;

  public start(): void {
    if (this._ws?.readyState === WebSocket.OPEN || this._state) {
      return;
    }

    this._state = true;
    this._ws = new WebSocket(this.urlGetter());

    this._ws.addEventListener('open', (ev) => this.onOpen?.(ev));
    this._ws.addEventListener('close', (ev) => this.onClose?.(ev));
    this._ws.addEventListener('close', this.tryReconnect);
    this._ws.addEventListener('message', (ev) => this.onMessage?.(ev));
  }

  public stop(): void {
    if (this._ws && this._ws.readyState !== WebSocket.CLOSED) {
      this._ws?.close();
    }

    this._state = false;
  }

  private tryReconnect(): void {
    if (this._state) {
      this._state = false;
      setTimeout(this.start, 500);
    }
  }
}
