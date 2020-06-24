class CurseForgeAPI {
  constructor() {
    this.baseURL = 'https://addons-ecs.forgesvc.net/api/v2/addon/';
    this.pageSize = 20;
  }

  async search(addonName) {
    const res = await fetch(
      `${this.baseURL}search?gameId=1&pageSize=${this.pageSize}$searchFilter=${addonName}`
    );
    return res.json();
  }
}

export default new CurseForgeAPI();
