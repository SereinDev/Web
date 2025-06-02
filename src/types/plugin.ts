export type Plugins = {
  [id: string]: Plugin;
};

export interface Plugin {
  fileName: string;
  info: {
    name: string;
    id: string;
    version: string;
    type: PluginType;
    authors: { name: string; description?: string }[];
    description: string;
    tags: number[];
    dependencies: { id: string; version: string }[];
    entryFile: string;
  };
  isEnabled: boolean;
}

export enum PluginType {
  Unknown = 0,
  JavaScript = 1,
  Net = 2,
}
