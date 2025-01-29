export interface User {
  _id: string;
  username: string;
  email: string;
  password: string;
  avatar: string;
  companyLogo: string;
  advertisements: string[];
  sponsors: ISponsor[];
}

export interface ISponsor {
  name: string
  logo: string
  link: string
  ad: string
  phone: string
  address: string
  owner: string
  email: string
}