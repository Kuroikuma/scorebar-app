import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { ThemeToggle } from "./MatchComponents/theme-toggle"
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react"
import { DynamicBreadcrumb } from "./dynamic-breadcrumb"
import { useAuth } from "@/app/context/AuthContext";


interface SidebarProps {
  children: React.ReactNode
}

export default function Sidebar({ children }: SidebarProps) {

  const { user, loading } = useAuth()
  const router = useRouter()


  useEffect(() => {
    if (!user && !loading) {
      router.push('/login')
    }
  }, [user, loading, router])

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <DynamicBreadcrumb />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <ThemeToggle />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
