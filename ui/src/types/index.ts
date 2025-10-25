// AthliFi Type Definitions

export interface AboutProfile {
  name: string;
  lastname: string;
  website: string;
  about: string;
}

export interface SocialLink {
  sitename: string;
  siteurl: string;
  description: string;
  iconurl: string;
}

export interface NFTItem {
  nft_url: string;
  title: string;
  description: string;
}

export interface ProfileData {
  profile: AboutProfile | null;
  links: SocialLink[];
  nfts: NFTItem[];
}

export interface CreateProfileFormData {
  username: string;
  name: string;
  lastname: string;
  website: string;
  about: string;
}

export interface AddLinkFormData {
  username: string;
  sitename: string;
  siteurl: string;
  description: string;
  iconurl: string;
}

export interface AddNFTFormData {
  username: string;
  nft_url: string;
  title: string;
  description: string;
}

