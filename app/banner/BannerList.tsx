'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Edit,
  MoreVertical,
  Search,
  Trash2,
  Copy,
  Eye,
  Download,
  Calendar,
  User,
  Tag,
  ArrowUpDown,
  Filter,
  MonitorCog,
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { useSponsorStore } from '../store/useSponsor';
import { useBannerStore } from '../store/useBannerStore';
import { IBanner } from '../types/Banner';
import { ISponsor } from '../types/sponsor';
import { useAuth } from '../context/AuthContext';
import { IOrganization } from '../types/organization';
import { useRouter } from 'next/navigation';

export default function BannerList() {
  const { sponsors, getSponsorsByOrganizationId } = useSponsorStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof IBanner>('updatedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterSponsor, setFilterSponsor] = useState<string>('all');
  const { user } = useAuth();

  const { banners, findByOrganizationId, findSettingTemplate } = useBannerStore();

  useEffect(() => {
    const fetchBanners = async () => {
      if (!user) return;
      await findSettingTemplate((user?.organizationId as IOrganization)._id);
      await findByOrganizationId((user?.organizationId as IOrganization)._id);
      await getSponsorsByOrganizationId((user?.organizationId as IOrganization)._id);
    };
    fetchBanners();
  }, [user]);

  useEffect(() => {
    // Create a style element for the diagonal pattern
    const styleEl = document.createElement('style');
    styleEl.innerHTML = `
      @media (max-width: 640px) {
        .diagonal-pattern div {
          font-size: 12px !important;
        }
      }
      @media (min-width: 641px) and (max-width: 1024px) {
        .diagonal-pattern div {
          font-size: 14px !important;
        }
      }
      @media (min-width: 1025px) {
        .diagonal-pattern div {
          font-size: 16px !important;
        }
      }
    `;
    document.head.appendChild(styleEl);

    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);

  // Filter banners based on search term and sponsor filter
  const filteredBanners = banners.filter((banner) => {
    const matchesSearch =
      banner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      banner.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSponsor = filterSponsor === 'all' || banner.sponsorId === filterSponsor;

    return matchesSearch && matchesSponsor;
  });

  // Sort banners
  const sortedBanners = [...filteredBanners].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (aValue instanceof Date && bValue instanceof Date) {
      return sortDirection === 'asc' ? aValue.getTime() - bValue.getTime() : bValue.getTime() - aValue.getTime();
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }

    if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
      return sortDirection === 'asc' ? (aValue ? 1 : 0) - (bValue ? 1 : 0) : (bValue ? 1 : 0) - (aValue ? 1 : 0);
    }

    return 0;
  });

  // Function to toggle sort
  const toggleSort = (field: keyof IBanner) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 border-b">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-xl font-semibold text-slate-800 dark:text-white">
              Banners Publicitarios
            </CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-400">
              {filteredBanners.length} banners encontrados
            </CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Buscar banners..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <ArrowUpDown className="h-3.5 w-3.5" />
                    <span>Ordenar</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Ordenar por</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => toggleSort('name')}>
                    Nombre {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toggleSort('updatedAt')}>
                    Fecha de actualización {sortField === 'updatedAt' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toggleSort('isVisible')}>
                    Estado {sortField === 'isVisible' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Select value={filterSponsor} onValueChange={setFilterSponsor}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <div className="flex items-center gap-1">
                    <Filter className="h-3.5 w-3.5" />
                    <SelectValue placeholder="Filtrar por sponsor" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los sponsors</SelectItem>
                  {sponsors.map((sponsor) => (
                    <SelectItem key={sponsor._id} value={sponsor._id}>
                      {sponsor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="all" className="w-full">
          <div className="px-6 pt-4">
            <TabsList className="grid w-full grid-cols-4 mb-4">
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="active">Activos</TabsTrigger>
              <TabsTrigger value="inactive">Inactivos</TabsTrigger>
              <TabsTrigger value="recent">Recientes</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="p-6 pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedBanners.map((banner) => (
                <EnhancedBannerCard
                  key={banner._id}
                  banner={banner}
                  sponsorName={(banner.sponsorId as ISponsor).name}
                />
              ))}
              {sortedBanners.length === 0 && (
                <div className="col-span-full text-center py-12 text-slate-500 dark:text-slate-400">
                  No se encontraron banners que coincidan con tu búsqueda
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="active" className="p-6 pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedBanners
                .filter((banner) => banner.isVisible)
                .map((banner) => (
                  <EnhancedBannerCard
                    key={banner._id}
                    banner={banner}
                    sponsorName={(banner.sponsorId as ISponsor).name}
                  />
                ))}
              {sortedBanners.filter((banner) => banner.isVisible).length === 0 && (
                <div className="col-span-full text-center py-12 text-slate-500 dark:text-slate-400">
                  No se encontraron banners activos
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="inactive" className="p-6 pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedBanners
                .filter((banner) => !banner.isVisible)
                .map((banner) => (
                  <EnhancedBannerCard
                    key={banner._id}
                    banner={banner}
                    sponsorName={(banner.sponsorId as ISponsor).name}
                  />
                ))}
              {sortedBanners.filter((banner) => !banner.isVisible).length === 0 && (
                <div className="col-span-full text-center py-12 text-slate-500 dark:text-slate-400">
                  No se encontraron banners inactivos
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="recent" className="p-6 pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedBanners
                .sort((a, b) => parseISO(b.updatedAt).getTime() - parseISO(a.updatedAt).getTime())
                .slice(0, 6)
                .map((banner) => (
                  <EnhancedBannerCard
                    key={banner._id}
                    banner={banner}
                    sponsorName={(banner.sponsorId as ISponsor).name}
                  />
                ))}
              {sortedBanners.length === 0 && (
                <div className="col-span-full text-center py-12 text-slate-500 dark:text-slate-400">
                  No se encontraron banners recientes
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

interface EnhancedBannerCardProps {
  banner: IBanner;
  sponsorName: string;
}

function EnhancedBannerCard({ banner, sponsorName }: EnhancedBannerCardProps) {
  const router = useRouter();

  const toBanner = (id: string) => router.push(`/banner/${id}`);

  return (
    <Card className="overflow-hidden hover:shadow-md transition-all border border-slate-200 dark:border-slate-700 h-full flex flex-col">
      <div className="aspect-video relative overflow-hidden bg-slate-100 dark:bg-slate-800">
        <div className="w-full h-full relative">
          <DiagonalRepeatingTitle title={banner.name} />
        </div>
        {banner.isVisible ? (
          <Badge className="absolute top-2 right-2 bg-green-500">Activo</Badge>
        ) : (
          <Badge className="absolute top-2 right-2 bg-slate-500">Inactivo</Badge>
        )}
      </div>
      <CardContent className="p-4 flex-grow">
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{banner.name}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 line-clamp-3">{banner.description}</p>

        <div className="space-y-2 mt-auto">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <User className="h-3.5 w-3.5" />
            <span className="truncate">{sponsorName}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Calendar className="h-3.5 w-3.5" />
            <span>Actualizado: {format(banner.updatedAt, 'dd MMM yyyy', { locale: es })}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Tag className="h-3.5 w-3.5" />
            <span>ID: {banner._id}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-4 border-t border-slate-100 dark:border-slate-800 mt-auto">
        <div className="flex items-center justify-between w-full">
          <div className="flex gap-1">
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              <Eye className="h-4 w-4" />
              <span className="sr-only">Ver</span>
            </Button>
            <Button onClick={() => toBanner(banner._id)} variant="outline" size="sm" className="h-8 w-8 p-0">
             <MonitorCog className="h-4 w-4" />
              <span className="sr-only">Control</span>
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              <Copy className="h-4 w-4" />
              <span className="sr-only">Duplicar</span>
            </Button>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Eye className="h-4 w-4 mr-2" />
                Ver
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toBanner(banner._id)}>
                <MonitorCog className="h-4 w-4 mr-2" />
                Control
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="h-4 w-4 mr-2" />
                Duplicar
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600 dark:text-red-400">
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardFooter>
    </Card>
  );
}

function DiagonalRepeatingTitle({ title }: { title: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
      <div
        className="absolute inset-0 diagonal-pattern"
        style={{
          backgroundSize: 'cover',
          backgroundImage: `repeating-linear-gradient(
          -45deg,
          transparent,
          transparent 20px,
          rgba(59, 130, 246, 0.1) 20px,
          rgba(59, 130, 246, 0.1) 40px
        )`,
        }}
      >
        {/* Generate multiple diagonal text elements */}
        {Array.from({ length: 30 }).map((_, index) => (
          <div
            key={index}
            className="absolute whitespace-nowrap font-semibold text-blue-500/30 dark:text-blue-400/30 transform -rotate-45"
            style={{
              top: `${index * 30}px`,
              left: `${index * -50}px`,
              fontSize: '14px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
          >
            {title.repeat(index + 1)}
          </div>
        ))}

        {/* Add a semi-transparent overlay to ensure content above is readable */}
        <div className="absolute inset-0 bg-white/30 dark:bg-slate-900/30"></div>

        {/* Add a centered title for better visibility */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white/80 dark:bg-slate-800/80 px-4 py-2 rounded-md shadow-sm">
            <h3 className="text-blue-600 dark:text-blue-400 font-bold text-sm text-center">{title}</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
