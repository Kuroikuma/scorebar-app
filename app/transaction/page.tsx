'use client'

import FinancialDashboard from "@/components/transaction/FinancialDashboard"
import { useAuth } from "../context/AuthContext"
import { User, UserRole } from "../types/user"
import StaffDashboard from "@/components/transaction/StaffDashboard"
import { useSponsorStore } from "../store/useSponsor"
import { useEffect } from "react"
import { IOrganization } from "../types/organization"

export default function DashboardPage() {
  const { user } = useAuth()

  if (!user) {
    return <div>Loading...</div>
  }

  let organization = (user as User).organizationId as IOrganization

  if (user?.role === UserRole.CEO) {
    return <FinancialDashboard userId={user._id} organizationId={organization._id} />
  } else if (user.role === UserRole.STAFF) {
    return <StaffDashboard userId={user._id} organizationId={organization._id} />
  }
}