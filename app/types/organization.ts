import { IFootballMatch } from "@/matchStore/interfaces";
import { Game } from "../store/gameStore";
import { ISponsor } from "./sponsor";
import { User } from "./user";
import { ITransaction } from "./ITransaction";

export interface IOrganization {
  _id: string;
  id: string;
  name: string;
  logo: string;
  description: string;
  totalBalance: { $numberDecimal: number };
  users: string[] | User[];
  sponsors: string[] | ISponsor[];
  games: string[] | Game[];
  matches: string[] | IFootballMatch[];
  transaction: string | ITransaction
}