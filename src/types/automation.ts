export enum MatchFieldType {
  ServerOutput = 0,
  ServerInput = 1,
  GroupMsg = 2,
  PrivateMsg = 3,
  SelfMsg = 4,
  ChannelMsg = 5,
  GuildMsg = 6,
}

export enum CommandType {
  Invalid = 0,
  ExecuteShellCommand = 1,
  InputServer = 2,
  SendGroupMsg = 3,
  SendPrivateMsg = 4,
  SendChannelMsg = 5,
  SendGuildMsg = 6,
  SendReply = 7,
  SendData = 8,
  Bind = 9,
  Unbind = 10,
  ExecuteJavascriptCodes = 11,
  Debug = 12,
}

export interface CommandSelf {
  platform?: string;
  userId?: string;
}

export interface CommandArguments {
  target?: string;
  autoEscape?: boolean;
  asSegments?: boolean;
  self?: CommandSelf;
  useUnicode?: boolean;
}

export interface AutomationCommand {
  type: CommandType;
  arguments?: CommandArguments;
  body: string;
}

interface TriggerBase {
  isEnabled: boolean;
}

export interface MatchTrigger extends TriggerBase {
  type: 'match';
  fieldType: MatchFieldType;
  pattern: string;
  isRegex: boolean;
}

export interface ScheduleTrigger extends TriggerBase {
  type: 'schedule';
  cronExpression: string;
}

export interface EventTrigger extends TriggerBase {
  type: 'event';
  events: number[];
}

export interface PluginTrigger extends TriggerBase {
  type: 'plugin';
  key: string;
}

export type AutomationTrigger =
  | MatchTrigger
  | ScheduleTrigger
  | EventTrigger
  | PluginTrigger;

export interface AutomationTask {
  triggers: AutomationTrigger[];
  commands: AutomationCommand[];
  description: string;
  id?: number;
}
