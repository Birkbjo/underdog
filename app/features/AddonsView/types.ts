export interface ScannedAddonData {
  name: string;
  shortName: string;
  title: string;
  interface: string;
  author?: string;
  notes?: string;
  version?: string;
  optionaldeps?: string;
  requireddeps?: string;
}

export interface AddonData {
  name: string;
  title: string;
  interface: string;
}

export interface AddonAttachment {
  description?: string;
  id: number;
  isDefault: boolean;
  projectId: number;
  status: number;
  thumbnailUrl: string;
  title: string;
  url: string;
}

export interface AddonAuthor {
  id: number;
  name: string;
  projectId: number;
  url: string;
  userId: number;
}

export interface AddonCategory {
  avatarId: number;
  avatarUrl: string;
  categorId: number;
  gameId: number;
  name: string;
  parentId: number;
  projectId: number;
  rootId: number;
  url: string;
}

export type GameFlavor = 'wow_retail' | 'wow_classic';

export interface AddonGameVersionFile {
  fileType: number;
  gameVersion: string;
  gameVersionFlavor: GameFlavor;
  projectFileId: number;
  projectFileName: string;
}

export interface AddonModule {
  fingerprint: number;
  foldername: string;
  type: number;
}

export interface SortableGameVersion {
  gameVersion: string;
  gameVersionName: string;
  gameVersionPadded: string;
  gameVersionReleaseDate: Date;
}

export interface AddonFile {
  displayName: string;
  downloadUrl: string;
  fileDate: Date;
  fileLength: number;
  fileName: string;
  fileStatus: number;
  gameId: number;
  gameVersion: string[];
  gameVersionDateReleased: Date;
  gameVersionFlavor: GameFlavor;
  gameVersionId: number;
  id: number;
  modules: AddonModule[];
  packageFingerprint: number;
  projectId: number;
  projectStatus: number;
  releaseType: ReleaseType;
}

export interface AddonSearchResult {
  attachments: AddonAttachment[];
  authors: AddonAuthor[];
  categories: AddonCategory;
  changelog?: string;
  dateCreated: Date;
  dateModified: Date;
  dateReleased: Date;
  defaultFileId: number;
  downloadCount: number;
  gameId: number;
  gameName: string;
  gameSlug: string;
  id: number;
  isAvailable: boolean;
  isFeatured: boolean;
  latestFiles: AddonFile[];
  name: string;
  primaryCategoryId: number;
  slug: string;
  status: number;
  summary: string;
  websiteUrl: string;
  sortableGameVersion: SortableGameVersion;
}

export interface AddonDirectory {
  name: string;
  isModule: boolean;
}

export enum ReleaseType {
  Release = 1,
  Beta,
  Alpha,
}

export interface InstalledAddon {
  scannedAddon?: ScannedAddonData;
  addonInfo?: AddonSearchResult;
  linked: boolean;
  installed: boolean;
  id: AddonSearchResult['id'];
  zipChecksum?: string;
  dirChecksum: string;
  installedDate: string;
  installedDirectiories?: AddonDirectory[];
  installedFile?: AddonFile;
  version: string;
}
