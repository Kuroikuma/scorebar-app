'use client'

import FinancialDashboard from "@/components/transaction/FinancialDashboard"
import { useAuth } from "../context/AuthContext"
import { UserRole } from "../types/user"
import StaffDashboard from "@/components/transaction/StaffDashboard"

export default function DashboardPage() {
  const { user } = useAuth()

  if (!user) {
    return <div>Loading...</div>
  }

  if (user?.role === UserRole.CEO) {
    return <FinancialDashboard userId={user._id} organizationId={user.organizationId._id} />
  } else if (user.role === UserRole.STAFF) {
    return <StaffDashboard userId={user._id} organizationId={user.organizationId._id} />
  }
}