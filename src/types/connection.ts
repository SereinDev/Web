export interface ConnectionStatus {
  active: boolean;
  sent: number;
  received: number;
  connectedAt: string | null;
}

export interface DataTranferredEvent {
  type: 'sent' | 'received';
  data: string;
}
