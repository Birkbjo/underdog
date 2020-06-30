import { AddonSearchResult } from './types';
import fs from 'fs';

class CurseForgeAPI {
  baseURL: string;

  pageSize: number;

  constructor() {
    this.baseURL = 'https://addons-ecs.forgesvc.net/api/v2/addon/';
    this.pageSize = 20;
  }

  async search(addonName: string): Promise<AddonSearchResult[]> {
    const res = await fetch(
      `${this.baseURL}search?gameId=1&pageSize=${this.pageSize}&searchFilter=${addonName}`,
      {
        cache: 'force-cache',
      }
    );

    const searchResult = await res.json();
    return searchResult as AddonSearchResult[];
  }

  async getChangeLog(addonId: number, fileId: string): Promise<string> {
    const res = await fetch(
      `${this.baseURL}${addonId}/file/${fileId}/changelog`
    );
    const changeLogText = await res.text();
    return changeLogText;
  }
}

export default new CurseForgeAPI();
