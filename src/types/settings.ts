export interface Settings {
  readonly connection: {
    accessToken: string;
    autoEscape: boolean;
    autoReconnect: boolean;
    saveLog: boolean;
    outputData: true;
    grantPermissionToOwnerAndAdmins: boolean;
    groups: number[];
    administrators: number[];
    headers: { [key: string]: string };
    uri: string;
    useReverseWebSocket: boolean;
    subProtocols: string[];
  };

  readonly webApi: {
    isEnabled: boolean;
    urlPrefixes: string[];
    allowCrossOrigin: boolean;
    maxRequestsPerSecond: number;
    whiteList: string[];
    accessTokens: string[];
    certificate: {
      isEnabled: boolean;
      autoRegisterCertificate: boolean;
      autoLoadCertificate: boolean;
      path?: string;
      password?: string;
    };
  };

  readonly application: {
    autoUpdate: boolean;
    checkUpdate: boolean;
    customTitle: string;
    enableSentry: boolean;
    theme: number;
    cliCommandHeader: string;
    pluginEventMaxWaitingTime: number;
    jsGlobalAssemblies: string[];
    jsPatternToSkipLoadingSingleFile: string[];
    disableBinderWhenServerClosed: boolean;
    regexForCheckingGameId: string;
    pattenForEnableMatchingMuiltLines: string[];
  };

  readonly reactions: {
    [key: string | ReactionType]: string[];
  };
}

export type ReactionType =
  | 'ServerStart'
  | 'ServerExitedNormally'
  | 'ServerExitedUnexpectedly'
  | 'GroupIncreased'
  | 'GroupDecreased'
  | 'GroupPoke'
  | 'BindingSucceeded'
  | 'UnbindingSucceeded'
  | 'PermissionDeniedFromPrivateMsg'
  | 'PermissionDeniedFromGroupMsg'
  | 'SereinCrash';
