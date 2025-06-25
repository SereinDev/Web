export interface ConnectionStatus {
  isActive: boolean;
  sent: number;
  received: number;
  connectedAt: string | null;
}
