export interface CpuInfo {
  name: string;
  percentProcessorTime: number;
}

export interface MemoryStatus {
  totalPhysical: number;
  availablePhysical: number;
  totalPageFile: number;
  availablePageFile: number;
  totalVirtual: number;
  availableVirtual: number;
  availableExtendedVirtual: number;
}

export interface OSInfo {
  name: string;
  version: string;
}
