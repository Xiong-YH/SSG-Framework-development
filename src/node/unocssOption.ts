import { VitePluginConfig } from 'unocss/vite';
import { presetAttributify, presetIcons, presetWind } from 'unocss';

export const unocssOption: VitePluginConfig = {
  presets: [presetAttributify(), presetIcons(), presetWind({})]
};
