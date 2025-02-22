import { IOrganization } from "./organization";

export enum UserRole {
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

export interface StaffMember {
  id: string;
  name: string;
}