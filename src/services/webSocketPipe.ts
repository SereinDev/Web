import { getWsTicket } from '@/services/apis';

export class WebSocketPipe {
  public constructor(
    private path: string,
    private params?: Record<string, string | undefined>,
  ) {}

  private _ws: WebSocket | null = null;
  private _state = false;

  get ws(): WebSocket | null {
    return this._ws;
  }

  onOpen?: (event: Event) => void | Promise<void>;
  onClose?: (event: Event) => void | Promise<void>;
  onMessage?: (event: MessageEvent) => void | Promise<void>;

  public async startAsync(): Promise<void> {
    if (
      this._ws?.readyState === WebSocket.CONNECTING ||
      this._ws?.readyState === WebSocket.OPEN ||
      this._state
    ) {
      return;
    }

    this._state = true;

    const urlParams = new URLSearchParams();

    if (this.params) {
      for (const key in this.params) {
        const value = this.params[key];
        if (value) {
          urlParams.set(key, value);
        }
      }
    }

    try {
      const ticket = await getWsTicket(this.path);
      urlParams.set('ticket', ticket);
    } catch {
      this._state = false;
      return;
    }

    this._ws = new WebSocket(`${this.path}?${urlParams.toString()}`);

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
      setTimeout(this.startAsync, 500);
    }
  }
}
