/**
 * design-api.ts
 * 
 * Funciones para generar ilustraciones y avatares dinámicos.
 * Usa APIs externas (DiceBear, UI Avatars) para crear imágenes
 * con tema consistente con los colores de la aplicación.
 * Se utiliza para placeholder de imágenes de productos y avatares de usuarios.
 */

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

const CATEGORY_PHOTO_KEYWORDS: Record<string, string> = {
  'laptops-pc': 'laptop',
  celulares: 'smartphone',
  gaming: 'gamingsetup',
  audio: 'headphones',
  hogar: 'homedecor',
  moda: 'fashion',
  accesorios: 'wristwatch',
  belleza: 'cosmetics',
  movilidad: 'electricscooter',
  ciclismo: 'bicycle',
  fitness: 'gym',
  deportes: 'sportsequipment',
  electronics: 'electronics',
  clothing: 'clothing',
  home: 'homedecor',
  sports: 'sportsequipment',
  books: 'books',
  other: 'product',
};

// Coincidencias específicas por producto, revisadas en orden (la primera que
// aparezca en el título gana). Mucho más preciso que solo usar la categoría.
const TITLE_PHOTO_KEYWORDS: Array<[RegExp, string]> = [
  [/macbook air/, 'macbookair'],
  [/macbook pro/, 'macbookpro'],
  [/\bmacbook\b/, 'macbook'],
  [/dell xps/, 'dellxpslaptop'],
  [/asus rog|gaming laptop/, 'gaminglaptop'],
  [/\blaptop\b/, 'laptop'],
  [/iphone/, 'iphone'],
  [/samsung galaxy/, 'samsunggalaxy'],
  [/google pixel/, 'googlepixel'],
  [/airpods/, 'airpods'],
  [/apple watch/, 'applewatch'],
  [/smartwatch|reloj inteligente/, 'smartwatch'],
  [/bose.*headphones|bose quietcomfort/, 'boseheadphones'],
  [/sony wh|sony.*headphones/, 'sonyheadphones'],
  [/audifonos|auriculares|headphones/, 'headphones'],
  [/playstation|ps5/, 'playstation5'],
  [/xbox/, 'xboxconsole'],
  [/nintendo switch/, 'nintendoswitch'],
  [/balon.*futbol|futbol.*fifa/, 'soccerball'],
  [/bicicleta.*monta|mountain bike/, 'mountainbike'],
  [/bicicleta.*(ruta|carbono)|road bike/, 'roadbike'],
  [/\bbicicleta\b/, 'bicycle'],
  [/camiseta/, 'tshirt'],
  [/cartera/, 'leatherwallet'],
  [/casco.*ciclismo/, 'bikehelmet'],
  [/casco.*seguridad/, 'safetyhelmet'],
  [/\bcasco\b/, 'helmet'],
  [/chaqueta/, 'denimjacket'],
  [/cinta de correr|treadmill/, 'treadmill'],
  [/cinturon/, 'leatherbelt'],
  [/colchoneta.*yoga|yoga mat/, 'yogamat'],
  [/espejo/, 'mirror'],
  [/guantes.*boxeo|boxing gloves/, 'boxinggloves'],
  [/lampara.*led|led lamp/, 'ledlamp'],
  [/mancuernas|dumbbells/, 'dumbbells'],
  [/maquillaje|makeup/, 'makeup'],
  [/monopatin.*electrico|electric scooter/, 'electricscooter'],
  [/patineta|skateboard|skate\b/, 'skateboard'],
  [/perfume/, 'perfumebottle'],
  [/robot aspirador|vacuum/, 'robotvacuum'],
  [/set.*cuidado.*piel|skincare/, 'skincare'],
  [/basquet|basketball/, 'basketball'],
  [/zapatillas|sneakers|nike.*running/, 'runningshoes'],
  [/smartphone|celular|telefono/, 'smartphone'],
  [/camara|camera/, 'camera'],
];

function normalizeTitle(title: string) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

function keywordFromTitle(title?: string | null): string | null {
  if (!title) return null;
  const normalized = normalizeTitle(title);
  const match = TITLE_PHOTO_KEYWORDS.find(([pattern]) => pattern.test(normalized));
  return match ? match[1] : null;
}

function hashSeed(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Foto real de Flickr relacionada con el producto específico (por título)
 * y, si no hay coincidencia, con su categoría. Fijada con `lock` para que
 * el mismo producto siempre obtenga la misma imagen.
 */
export function getProductPhoto(seed: string, categorySlug?: string | null, title?: string | null) {
  const keyword = keywordFromTitle(title) || CATEGORY_PHOTO_KEYWORDS[categorySlug || ''] || 'product';
  const lock = hashSeed(seed);
  return `https://loremflickr.com/640/480/${keyword}?lock=${lock}`;
}
