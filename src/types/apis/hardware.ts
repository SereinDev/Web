export type CpuInfo = {
  name: string;
  percentProcessorTime: number;
};

export type MemoryStatus = {
  totalPhysical: number;
  availablePhysical: number;
  totalPageFile: number;
  availablePageFile: number;
  totalVirtual: number;
  availableVirtual: number;
  availableExtendedVirtual: number;
};

export type OSInfo = {
  name: string;
  version: string;
};
