export type Match = {
  regExp: string;
  fieldType: MatchFieldType;
  requireAdmin: boolean;
  exclusions: string;
  description: string;
  command: string;
  id: number;
};

export enum MatchFieldType {
  Disabled = 0,

  ServerOutput = 1,

  ServerInput = 2,

  GroupMsg = 3,

  PrivateMsg = 4,

  SelfMsg = 5,
}
