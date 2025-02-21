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
} from '@/components/ui/sidebar';
import { useRouter } from 'next/navigation';

export function NavSports() {
  const router = useRouter();

  const toGame = () => router.push(`/games`);
  const toMatch = () => router.push(`/match`);

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
          <SidebarMenuButton className="text-sidebar-foreground/70">
            <MoreHorizontal className="text-sidebar-foreground/70" />
            <span>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
