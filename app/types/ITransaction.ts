import { IOrganization } from "./organization"
import { ISponsor } from "./sponsor"
import { User } from "./user"

export enum TransactionCategory {
  SALARY = "Salario",
  PURCHASE = "Compras",
  INVESTMENT = "Inversión",
  UTILITIES = "Servicios",
  RENT = "Alquiler",
  TAXES = "Impuestos",
  INSURANCE = "Seguros",
  MAINTENANCE = "Mantenimiento",
  MARKETING = "Marketing",
  TRAVEL = "Viaje",
  OFFICE_SUPPLIES = "Material de oficina",
  OTHER_INCOME = "Otros ingresos",
  OTHER_EXPENSE = "Otros gastos",
  SPONSOR_PAYMENT = "Pago de patrocinadores"
}

export enum TransactionType {
  DEPOSIT = "Depósito",
  WITHDRAWAL = "Retiro",
}

export interface ITransaction {
  _id: string
  amount: number
  type: TransactionType
  description: string
  createdAt: Date
  category: TransactionCategory
  user: string | User
  organization: string | IOrganization;
  date: Date
  sponsor: string | ISponsor | null
}