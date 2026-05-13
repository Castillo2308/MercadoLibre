const SITE_BG = '071425';
const SITE_PRIMARY = '1db849';
const SITE_SECONDARY = '2563eb';
const SITE_ACCENT = 'ffd600';

export function getDesignIllustration(seed: string) {
  const safeSeed = encodeURIComponent(seed);
  return `https://api.dicebear.com/9.x/shapes/svg?seed=${safeSeed}&backgroundType=gradientLinear&backgroundColor=${SITE_BG},0c1d31,122238&shape1Color=${SITE_PRIMARY}&shape2Color=${SITE_SECONDARY}&shape3Color=${SITE_ACCENT}`;
}

export function getDesignAvatar(name: string) {
  const safeName = encodeURIComponent(name || 'Usuario');
  return `https://ui-avatars.com/api/?name=${safeName}&background=${SITE_BG}&color=${SITE_PRIMARY}&bold=true&format=svg&rounded=true&size=128`;
}
