import React from 'react';
import { Palette, Type, Image as ImageIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function BrandAssetsCard() {
  const { t } = useLanguage();
  return (
    <div className="bento-card col-span-1 md:col-span-1 lg:col-span-1 row-span-1 flex flex-col justify-between">
      <div>
        <h3 className="text-white text-lg font-medium tracking-tight mb-2 flex items-center">
          <Palette className="w-5 h-5 mr-2 text-purple-400" />
          {t('dashboard_home.assets_title')}
        </h3>
        <p className="text-linear-text-muted text-sm mb-4">{t('dashboard_home.assets_desc')}</p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="aspect-square rounded-xl bg-white/5 border border-white/5 flex flex-col items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
          <Palette className="w-5 h-5 mb-1 text-linear-text-muted" />
          <span className="text-[10px] text-linear-text-muted uppercase tracking-wider">{t('dashboard_home.asset_c')}</span>
        </div>
        <div className="aspect-square rounded-xl bg-white/5 border border-white/5 flex flex-col items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
          <Type className="w-5 h-5 mb-1 text-linear-text-muted" />
          <span className="text-[10px] text-linear-text-muted uppercase tracking-wider">{t('dashboard_home.asset_t')}</span>
        </div>
        <div className="aspect-square rounded-xl bg-white/5 border border-white/5 flex flex-col items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
          <ImageIcon className="w-5 h-5 mb-1 text-linear-text-muted" />
          <span className="text-[10px] text-linear-text-muted uppercase tracking-wider">{t('dashboard_home.asset_l')}</span>
        </div>
      </div>
    </div>
  );
}
