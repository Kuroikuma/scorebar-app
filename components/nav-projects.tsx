'use client';

import { MoreHorizontal } from 'lucide-react';

import { Icon } from 'lucide-react';
import { baseball, soccerBall } from '@lucide/lab';

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { useRouter } from 'next/navigation';
import { useIsMobile } from '@/hooks/use-mobile';

export function NavSports() {
  const router = useRouter();

  const isMobile = useIsMobile();
  const { toggleSidebar } = useSidebar();

  const toGame = () => {
    router.push(`/games`)
    isMobile && toggleSidebar();
  };

  const toMatch = () => {
    router.push(`/match`)
    isMobile && toggleSidebar();
  };

  const toBanners = () => {
    router.push(`/banner`)
    isMobile && toggleSidebar();
  };

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Deportes</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton onClick={toGame}>
            <Icon iconNode={baseball} />
            <span>Beisbol</span>
          </SidebarMenuButton>
        </SidebarMenuItem>

        <SidebarMenuItem>
          <SidebarMenuButton onClick={toMatch}>
            <Icon iconNode={soccerBall} />
            <span>Futbol</span>
          </SidebarMenuButton>
        </SidebarMenuItem>

        <SidebarMenuItem>
          <SidebarMenuButton onClick={toBanners}>
            <Icon iconNode={soccerBall} />
            <span>Banner</span>
          </SidebarMenuButton>
        </SidebarMenuItem>

        <SidebarMenuItem>
          <SidebarMenuButton className="text-sidebar-foreground/70">
            <MoreHorizontal className="text-sidebar-foreground/70" />
            <span>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
