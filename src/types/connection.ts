export type ConnectionStatus = {
  active: boolean;
  sent: number;
  received: number;
  connectedAt: string | null;
};

export type DataTranferredEvent = {
  type: 'sent' | 'received';
  data: string;
};
