export interface ConnectionStatus {
  isActive: boolean;
  sent: number;
  received: number;
  startedAt: string | null;
}
