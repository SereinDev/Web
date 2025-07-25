export type Servers = Record<string, Server>;

export interface Server {
  id: string;
  status: boolean;
  pid: number | null;
  info: ServerInfo;
  commandHistory: string[];
  commandHistoryIndex: number;
  configuration: Configuration;
}

export interface ServerInfo {
  fileName: string | null;
  argument: string | null;
  startTime: string | null;
  exitTime: string | null;
  outputLines: number;
  inputLines: number;
  cpuUsage: number;
  stat: {
    serverUp: boolean;
    currentPlayers: string;
    maximumPlayers: string;
  } | null;
}

export interface Configuration {
  name: string;
  fileName: string;
  argument: string;
  environment: { [key: string]: string };
  autoStopWhenCrashing: boolean;
  autoRestart: boolean;
  outputCommandUserInput: boolean;
  saveLog: boolean;
  lineTerminator: string;
  inputEncoding: EncodingType;
  outputEncoding: EncodingType;
  outputStyle: OutputStyle;
  portIPv4: number;
  stopCommands: string[];
  startWhenSettingUp: boolean;
  useUnicodeChars: boolean;
  pty: PtyOptions;
}

declare interface PtyOptions {
  isEnabled: boolean;
  terminalWidth: number | null;
  terminalHeight: number | null;
  forceWinPty: boolean;
}

export enum OutputStyle {
  Plain = 0,

  RawText = 1,
}

export enum EncodingType {
  UTF8 = 0,

  UTF16LE = 1,

  UTF16BE = 2,

  GBK = 3,
}
