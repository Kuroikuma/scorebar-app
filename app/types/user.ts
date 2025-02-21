import { IOrganization } from "./organization";

enum UserRole {
  CEO = 'CEO',
  STAFF = 'STAFF',
  ROOT = 'ROOT',
}

export interface User {
  _id: string;
  username: string;
  email: string;
  password: string;
  avatar: string;
  advertisements: string[];
  role: UserRole;
  organizationId: IOrganization;
}