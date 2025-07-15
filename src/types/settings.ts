export interface Settings {
  readonly connection: {
    adapter: number;
    connectWhenSettingUp: boolean;
    saveLog: boolean;
    outputData: boolean;
    listenedIds: string[];
    administratorUserIds: string[];
    self: {
      platform: string;
      userId: string;
    };
    oneBot: {
      version: number;
      accessToken: string;
      autoEscape: boolean;
      grantPermissionToGroupOwnerAndAdmins: boolean;
      headers: { [key: string]: string };
      uri: string;
      subProtocols: string[];
      autoReconnect: boolean;
    };
    satori: {
      uri: string;
      accessToken: string;
    };
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
    maximumWaitTimeForPluginEvents: number;
    jsDefaultAssemblies: string[];
    jsFilesToExcludeFromLoading: string[];
    disableBindingManagerWhenAllServersStopped: boolean;
    gameIdValidationPattern: string;
    multiLineMatchingPatterns: string[];
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
