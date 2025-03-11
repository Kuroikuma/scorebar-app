import { useBannerManagerStore } from '@/app/store/useBannerManagerStore';
import { useBannerStore } from '@/app/store/useBannerStore';
import { Button } from '@/components/ui/button';
import { MonitorPlay, PlayCircle, Search } from 'lucide-react';
import { useState } from 'react';

const BannerList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const { banners } = useBannerStore();
  const { setSelectedBannerInManager, isLoading } = useBannerManagerStore();

  const filteredBannerManager = searchTerm
    ? banners.filter((bannerManager) => bannerManager.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : banners;

  const onEnter = async (id: string) => {
    await setSelectedBannerInManager(id);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500"
          placeholder="Buscar banners..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="max-h-[60vh] overflow-y-auto pr-1">
        {filteredBannerManager.length > 0 ? (
          <ul className="space-y-2">
            {filteredBannerManager.map((bannerManager, index) => (
              <li
                key={bannerManager._id}
                onMouseEnter={() => setHoveredId(bannerManager._id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`relative overflow-hidden rounded-lg border border-gray-200 transition-all duration-200 dark:border-gray-700 animate-fadeSlideUp ${
                  hoveredId === bannerManager._id ? 'bg-blue-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Background animation on hover */}
                {hoveredId === bannerManager._id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-100/50 to-purple-100/50 dark:from-blue-900/20 dark:to-purple-900/20 animate-slideIn" />
                )}

                <div className="relative flex items-center justify-between p-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                      <MonitorPlay className="h-5 w-5" />
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">{bannerManager.name}</span>
                  </div>

                  <div className="transition-transform duration-200 hover:scale-105 active:scale-95">
                    <Button
                      size="sm"
                      onClick={() => onEnter(bannerManager._id)}
                      className="relative overflow-hidden rounded-full bg-blue-600 px-4 py-2 text-white shadow-md transition-all duration-200 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                      disabled={isLoading}
                    >
                      <span className="relative z-10 flex items-center gap-1">
                        Seleccionar
                        <PlayCircle className="ml-1 h-4 w-4" />
                      </span>
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center animate-fadeIn">
            <div className="mb-4 rounded-full bg-gray-100 p-4 dark:bg-gray-800">
              <Search className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {searchTerm ? 'No se han encontrado resultados' : 'No hay banners disponibles'}
            </p>
            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
              {searchTerm ? 'Pruebe con otro término de búsqueda' : 'Añadir un banner para empezar'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BannerList;
