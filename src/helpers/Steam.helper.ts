import SteamUser, { AppInfoContentGame } from "steam-user";

export interface PublicBranchInfo {
  appName: string;
  appId: string;
  appIcon: string | null;
  buildId: string;
  timeUpdated: string;
  dateUpdated: string;
}

export class SteamAppInfo {
  private client = new SteamUser();

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.logOn({ anonymous: true });

      this.client.once('loggedOn', () => {
        resolve();
      });

      this.client.once('error', reject);
    });
  }

  async disconnect() {
    this.client.logOff();
  }

  async getPublicBranchUpdate(appId: number): Promise<PublicBranchInfo> {
    return new Promise((resolve, reject) => {
      this.client.getProductInfo([appId], [], false, (err, apps) => {
        if (err) return reject(err);

        const app = apps[appId];
        if (!app) return reject(new Error('App info não encontrado'));

        const appInfo = app.appinfo as AppInfoContentGame;

        if (!appInfo.depots) return reject(new Error('Depots não encontrado'));
        if (!appInfo.depots.branches) return reject(new Error('Branches não encontrado'));

        resolve({
          appName: appInfo.common.name,
          appId: appInfo.appid,
          appIcon: appInfo.common.icon || null,
          buildId: appInfo.depots.branches.public.buildid,
          timeUpdated: appInfo.depots.branches.public.timeupdated,
          dateUpdated: new Date(Number(appInfo.depots.branches.public.timeupdated) * 1000).toLocaleString("pt-br")
        });
      });
    });
  }
}