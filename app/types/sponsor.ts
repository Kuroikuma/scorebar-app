import { ITransaction } from "./ITransaction";
import { IOrganization } from "./organization";

export interface ISponsor {
  _id: string
  name: string;
  logo: string;
  link: string;
  ad: string;
  phone: string;
  address: string;
  owner: string;
  email: string;
  sponsorshipFee: { $numberDecimal: number };
  paymentDate: number
  organizationId: string | IOrganization;
  transactions: string[] | ITransaction[]
  deleted_at: string | null;
}


export type SponsorBanner = Omit<ISponsor, "organizationId" | "transactions" | "deleted_at" | "sponsorshipFee" | "paymentDate" | "_id">
