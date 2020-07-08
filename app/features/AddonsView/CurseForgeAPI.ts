import { AddonSearchResult, AddonFile, GameFlavor } from './types';
import fs from 'fs';

class CurseForgeAPI {
  baseURL: string;

  pageSize: number;

  cache: Record<string, number>;

  cacheTTL: number;

  constructor() {
    this.baseURL = 'https://addons-ecs.forgesvc.net/api/v2/addon';
    this.pageSize = 20;
    this.cache = {};
    this.cacheTTL = 30000;
  }

  request(url: RequestInfo, fetchOpts: RequestInit = {}) {
    const currentTS = new Date().getTime();
    let mergedOpts = fetchOpts;

    if (!fetchOpts.cache) {
      const timeSinceLastReq =
        currentTS - this.cache[url.toString()] || this.cacheTTL;
      const cacheStrategy =
        timeSinceLastReq < this.cacheTTL ? 'force-cache' : 'reload';

      if (cacheStrategy === 'reload') {
        this.cache[url.toString()] = currentTS;
        // naively nuke cache if big
        if (Object.keys(this.cache).length > 500) {
          this.cache = {};
        }
      }

      mergedOpts = {
        ...fetchOpts,
        cache: cacheStrategy,
      };
    }

    return fetch(url, mergedOpts);
  }

  async search(addonName: string): Promise<AddonSearchResult[]> {
    const url = `${this.baseURL}/search?gameId=1&pageSize=${this.pageSize}&searchFilter=${addonName}`;

    const res = await this.request(url);
    const searchResult = await res.json();
    return searchResult as AddonSearchResult[];
  }

  async getChangeLog(addonId: number, fileId: string): Promise<string> {
    const res = await fetch(
      `${this.baseURL}/${addonId}/file/${fileId}/changelog`
    );
    const changeLogText = await res.text();
    return changeLogText;
  }

  async getPopularAddons(): Promise<AddonSearchResult[]> {
    const res = await fetch(`${this.baseURL}/featured`, {
      method: 'post',
    });

    const featuredAddons = await res.json();

    return featuredAddons.popular as AddonSearchResult[];
  }

  async getAddonInfo(id: string | number): Promise<AddonSearchResult> {
    const url = `${this.baseURL}/${id}`;
    const res = await this.request(url, {
      cache: 'default',
    });
    return res.json();
  }

  async getFilesInfo(
    id: string | number,
    gameFlavor: GameFlavor = 'wow_retail'
  ): Promise<AddonFile[]> {
    const url = `${this.baseURL}/${id}/files?gameVersionFlavor=${gameFlavor}`;
    const res = await this.request(url);
    return res.json();
  }

  async getFileInfo(
    addonId: string | number,
    fileId: number
  ): Promise<AddonFile> {
    const url = `${this.baseURL}/${addonId}/file/${fileId}`;
    const res = await this.request(url);
    return res.json();
  }

  async getAddonsInfo(ids: (string | number)[]): Promise<AddonSearchResult[]> {
    const url = `${this.baseURL}`;
    const res = await this.request(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(ids),
      cache: 'default',
    });

    const addonsInfo = await res.json();
    return addonsInfo;
  }
}

export default new CurseForgeAPI();
