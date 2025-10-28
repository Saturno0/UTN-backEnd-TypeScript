const DEFAULT_API_BASE_URL = 'https://utn-backend-final.onrender.com/api';

const ensureLeadingSlash = (path: string): string => {
  if (!path) return '';
  return path.startsWith('/') ? path : `/${path}`;
};

const normalizeBaseUrl = (baseUrl: string | undefined): string => {
  if (!baseUrl) return DEFAULT_API_BASE_URL;
  const trimmed = baseUrl.trim();
  if (!trimmed) return DEFAULT_API_BASE_URL;
  return trimmed.endsWith('/') ? trimmed.slice(0, -1) : trimmed;
};

const createService = <T extends Record<string, string>>(basePath: string, endpoints: T) => {
  const base = ensureLeadingSlash(basePath);
  const normalizedEntries = Object.entries(endpoints).map(([key, endpoint]) => [
    key,
    `${base}${ensureLeadingSlash(endpoint)}`,
  ]);

  return {
    BASE: base,
    ...Object.fromEntries(normalizedEntries),
  } as { readonly BASE: string } & { readonly [K in keyof T]: string };
};

const ENV_BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined;

export const API_CONFIG = {
  BASE_URL: normalizeBaseUrl(ENV_BASE_URL),

  USERS: createService('/users', {
    GET_ALL: '/getUsers',
    CREATE: '/createUser',
    LOGIN: '/logIn',
    UPDATE: '/update',
    GET_ROLE: '/getRol/:id',
  }),

  EMAIL: createService('/email', {
    SEND: '/send-confirmation',
  }),

  CATEGORIES: createService('/categories', {
    GET_ALL: '/getCategories',
    GET_ONE: '/getCategory/:id',
    CREATE: '/createCategory',
    CREATE_BULK: '/createCategories',
  }),

  PRODUCTS: createService('/products', {
    GET_ALL: '/getAllProducts',
    GET_ONE: '/getProduct/:id',
    CREATE: '/createProduct',
    CREATE_BULK: '/createProducts',
    UPDATE: '/updateProduct/:id',
    DELETE: '/deleteProduct/:id',
  }),

  SIZES: createService('/sizes', {
    GET_ALL: '/getAllSizes',
    GET_ONE: '/getSize/:id',
    CREATE: '/createSize',
    CREATE_BULK: '/createSizes',
  }),

  COLORS: createService('/colors', {
    GET_ALL: '/getAllColors',
    GET_ONE: '/getColor/:id',
    CREATE: '/createColor',
    CREATE_BULK: '/createColors',
  }),
} as const;

export const buildApiUrl = (endpoint: string): string => {
  const base = API_CONFIG.BASE_URL;
  const path = ensureLeadingSlash(endpoint);
  return `${base}${path}`;
};
