export const repoUrl = 'https://github.com/SereinDev/Web';
export const docsUrl = 'https://sereindev.github.io';
export const discussionUrl = 'https://github.com/orgs/SereinDev/discussions';
export const name = 'Serein Web';
export const gitInfo = {
  branch: GIT_BRANCH,
  sha: GIT_COMMITHASH,
  shortSha: GIT_COMMITHASH.slice(0, 7),
  time: new Date(GIT_LASTCOMMITDATETIME),
};

// @ts-expect-error
export const environment = import.meta.env.MODE;
