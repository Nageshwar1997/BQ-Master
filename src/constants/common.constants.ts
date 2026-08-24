import type { StepperStep } from '@/components/ui/Stepper';

export const LOADING_RINGS_DATA = [
  {
    border: { side: 'borderBottomWidth', color: 'red' },
    rotation: { rx: 45, ry: -45, z: 0 },
  },
  {
    border: { side: 'borderRightWidth', color: 'green' },
    rotation: { rx: 55, ry: 15, z: 90 },
  },
  {
    border: { side: 'borderTopWidth', color: 'blue' },
    rotation: { rx: 40, ry: 65, z: 180 },
  },
  {
    border: { side: 'borderLeftWidth', color: 'yellow' },
    rotation: { rx: 50, ry: -25, z: 270 },
  },
] as const;

export const BEAUTY_FACTS = [
  `The term <span class=gradient-text-accent>"Clean Beauty"</span> refers to skincare and makeup products made without harmful chemicals and toxins.`,
  `In <span class=gradient-text-accent>"1915"</span>, Maurice Levy invented the first <span class=gradient-text-accent>"twist-up lipstick"</span>, revolutionizing the beauty industry.`,
  `The first-ever commercial mascara, <span class=gradient-text-accent>"Maybelline Cake Mascara"</span>, was introduced in <span class=gradient-text-accent>"1917"</span>.`,
  `<span class=gradient-text-accent>BB Cream (2011)</span> became a global sensation by combining skincare and foundation into one product.`,
  `The first <span class=gradient-text-accent>cruelty-free certification</span> was introduced in <span class=gradient-text-accent>"1996"</span> to support ethical beauty practices.`,
  `<span class=gradient-text-accent>Vegan beauty</span> is on the rise, with brands formulating products without any animal-derived ingredients.`,
  `Dermatologists recommend <span class=gradient-text-accent>SPF 30+</span> for daily sun protection to prevent premature aging and skin damage.`,
  `<span class=gradient-text-accent>Serums</span> contain concentrated active ingredients that penetrate deeper into the skin for enhanced benefits.`,
  `<span class=gradient-text-accent>Micellar Water</span> is a gentle yet effective way to cleanse the skin without rinsing, perfect for all skin types.`,
  `The world's first <span class=gradient-text-accent>organic beauty brand</span> was founded in <span class=gradient-text-accent>1978</span>, paving the way for natural cosmetics.`,
  `Some beauty brands use <span class=gradient-text-accent>AI-powered tools</span> to personalize skincare recommendations based on user preferences.`,
  `<span class=gradient-text-accent>Hyaluronic Acid</span> is a powerful hydrating ingredient that can hold up to 1,000 times its weight in water.`,
  `<span class=gradient-text-accent>Retinol</span> is a dermatologist-approved ingredient known for reducing fine lines and improving skin texture.`,
  `<span class=gradient-text-accent>Green Beauty</span> focuses on sustainable packaging and eco-friendly formulations to reduce environmental impact.`,
  `<span class=gradient-text-accent>Sheet masks</span> originated in Indian and have become a staple in self-care and skincare routines worldwide.`,
  `The global <span class=gradient-text-accent>cosmetic industry</span> is expected to reach <span class=gradient-text-accent>$500 billion</span> by <span class=gradient-text-accent>2026</span>.`,
  `The first-ever <span class=gradient-text-accent>waterproof mascara</span> was developed in <span class=gradient-text-accent>1938</span> and changed the beauty game.`,
  `The first <span class=gradient-text-accent>liquid foundation</span> was launched in the <span class=gradient-text-accent>1950s</span>, offering a more natural finish.`,
  `The term "glass skin" was popularized by <span class=gradient-text-accent>Indian beauty</span> trends, emphasizing dewy, radiant skin.`,
  `The first commercial <span class=gradient-text-accent>lip gloss</span> was introduced by Max Factor in <span class=gradient-text-accent>1930</span>.`,
  `In the early <span class=gradient-text-accent>2000s</span>, mineral makeup became a sought-after trend for its natural ingredients and skin benefits.`,
  `The <span class=gradient-text-accent>Beauty Blender,</span> launched in <span class=gradient-text-accent>2007</span>, transformed the way people applied foundation.`,
  `<span class=gradient-text-accent>Facial oils</span> have gained popularity for their nourishing and hydrating properties, even for oily skin types.`,
  `Some brands are experimenting with <span class=gradient-text-accent>AI makeup try-ons</span> to help users choose the perfect shade before purchasing.`,
  `The concept of a <span class=gradient-text-accent>beauty subscription box</span> allows customers to try new products every month.`,
  `Some experts believe that <span class=gradient-text-accent>customized skincare</span> could be the future of the beauty industry.`,
  'Others caution about potential risks of certain <span class=gradient-text-accent>skincare ingredients,</span> such as parabens and sulfates.',
  `The development of <span class=gradient-text-accent>sustainable beauty</span> aims to reduce plastic waste and promote ethical sourcing.`,
  `Despite trends, timeless beauty practices like <span class=gradient-text-accent>hydration</span> and <span class=gradient-text-accent>healthy eating</span> remain essential for glowing skin.`,
  `The first known use of the term <span class=gradient-text-accent>"cosmeceuticals"</span> was in <span class=gradient-text-accent>1984</span> to describe skincare products with medical benefits.`,
  `<span class=gradient-text-accent>Fermented skincare</span> is gaining popularity for its probiotic benefits that improve skin health.`,
  `<span class=gradient-text-accent>Beauty influencers</span> have a huge impact on the cosmetic industry, shaping trends and product demands.`,
  '<span class=gradient-text-accent>AR beauty</span> apps are helping customers try on makeup virtually before making a purchase.',
  `The concept of <span class=gradient-text-accent>smart skincare devices</span> is transforming beauty routines with AI-powered technology.`,
  'Some companies are developing <span class=gradient-text-accent>biodegradable glitter</span> to make beauty more sustainable.',
  `The future of <span class=gradient-text-accent>clean beauty</span> is focused on transparency, sustainability, and effective formulations.`,
  `The first <span class=gradient-text-accent>fragrance-free makeup line</span> was launched in <span class=gradient-text-accent>1980</span> to cater to sensitive skin.`,
  `The term <span class=gradient-text-accent>dermocosmetics</span> is used for products that bridge the gap between skincare and dermatology.`,
  `The rise of <span class=gradient-text-accent>gender-neutral beauty</span> is redefining the industry with inclusive products for all.`,
  `<span class=gradient-text-accent>Biodegradable packaging</span> is becoming more common in the beauty industry to reduce waste.`,
  `<span class=gradient-text-accent>Refillable makeup</span> is a growing trend that allows users to reuse packaging and minimize waste.`,
  `The first commercial <span class=gradient-text-accent>nail polish</span> was inspired by automobile paint and introduced in <span class=gradient-text-accent>1932</span>.`,
  `The term <span class=gradient-text-accent>"blue beauty"</span> refers to eco-conscious products designed to protect ocean ecosystems.`,
  `<span class=gradient-text-accent>Glass packaging</span> is being used more in luxury beauty to reduce plastic waste and enhance sustainability.`,
];

export const USER_KEY = 'user' as const;

export const ROUTES = {
  DASHBOARD: '/',
  AUTH: {
    BASE: 'auth',
    FORGOT_PASSWORD: 'forgot-password',
  },
  CATEGORIES: { BASE: 'categories' },
  PRODUCTS: {
    BASE: 'products',
    ADD: 'add',
    PRODUCT_ID: ':slug',
    CATEGORY_L1: ':categoryL1',
    CATEGORY_L2: ':categoryL2',
    CATEGORY_L3: ':categoryL3',
  },
  PROFILE: {
    BASE: 'profile',
    UPDATE_PASSWORD: 'update-password',
  },
  ENQUIRIES: 'enquiries',
  TERRITORY_MANAGEMENT: 'territory-management',
  ALL_SELLERS: 'all-sellers',
  AUDIT_LOG: 'audit-log',
} as const;

export const TOOLTIP_GAP = 15 as const;
export const TOOLTIP_ANIMATION_DURATION = 400 as const;

export const SIDEBAR_DATA = [
  {
    title: 'Dashboard',
    icon: 'solar:widget-linear',
    path: ROUTES.DASHBOARD,
    handler: null,
  },
  {
    title: 'Profile',
    icon: 'solar:user-circle-linear',
    path: `/${ROUTES.PROFILE.BASE}`,
    handler: null,
  },
  {
    title: 'Categories',
    icon: 'solar:hanger-2-linear',
    path: `/${ROUTES.CATEGORIES.BASE}`,
    handler: null,
  },
  {
    title: 'Products',
    icon: 'solar:box-minimalistic-linear',
    path: `/${ROUTES.PRODUCTS.BASE}`,
    handler: null,
  },
  {
    title: 'Enquiries',
    icon: 'solar:mailbox-linear',
    path: `/${ROUTES.ENQUIRIES}`,
    handler: null,
  },
  {
    title: 'Territory Management',
    icon: 'solar:global-linear',
    path: `/${ROUTES.TERRITORY_MANAGEMENT}`,
    handler: null,
  },
  {
    title: 'All Sellers',
    icon: 'solar:users-group-rounded-linear',
    path: `/${ROUTES.ALL_SELLERS}`,
    handler: null,
  },
  {
    title: 'Audit Log',
    icon: 'solar:document-text-linear',
    path: `/${ROUTES.AUDIT_LOG}`,
    handler: null,
  },
  {
    title: 'Update Password',
    icon: 'solar:lock-password-linear',
    path: `/${ROUTES.PROFILE.UPDATE_PASSWORD}`,
    handler: null,
  },
  {
    title: 'Logout',
    icon: 'solar:logout-2-linear',
    handler: 'logout',
  },
] as const;

export const EMPTY_OBJECT = {};
export const EMPTY_ARRAY = [];

export const QUERY_PARAMS_KEY_MAP = {
  category: {
    mode: 'mode', // To Set Mode (Edit or Add)
    add: 'add', // To Open Add Category Modal
    edit: 'edit', // To Open Edit Category Modal
    // The category tree is a single table now (see Categories.tsx) - one
    // search/sort pair applies across every level instead of one per level.
    search: 'search',
    sort: 'sort',
  },
  confirm: 'confirm', // To Open Confirm Modal
  sort: 'sort', // To Set Sort Order
} as const;

export const CATEGORY_MODAL_STEPS: StepperStep[] = [
  { title: 'Category info', description: 'Name and hierarchy', icon: 'solar:hanger-2-linear' },
  {
    title: 'Review',
    description: 'Confirm before save',
    icon: 'solar:checklist-minimalistic-linear',
  },
];

export const ADD_PRODUCT_STEPS: StepperStep[] = [
  {
    title: 'Basic information',
    description: 'Set product title, pricing, brand and category details',
    icon: 'solar:tag-price-linear',
  },
  {
    title: 'Media and gallery',
    description: 'Upload product images, thumbnail and video',
    icon: 'solar:gallery-linear',
  },
  {
    title: 'Description and details',
    description:
      'Add short description, full description, usage instructions, ingredients and additional details',
    icon: 'solar:document-text-linear',
  },
  {
    title: 'Product variants and stock',
    description: 'Set product type and Configure variants, pricing and stock',
    icon: 'solar:list-check-linear',
  },
  {
    title: 'TryOn configuration',
    description: 'Setup TryOn category and configure TryOn details',
    icon: 'solar:face-scan-square-linear',
  },
  {
    title: 'Review and confirm',
    description: 'Verify all details before saving product',
    icon: 'solar:check-circle-linear',
  },
];

export const CATEGORY_STEPPER_STEP_COUNT = [0, 1] as const;

export const CATEGORY_STEPPER_STEP_COUNT_MAP = Object.fromEntries(
  CATEGORY_STEPPER_STEP_COUNT.map((type) => [type, type]),
) as { [K in (typeof CATEGORY_STEPPER_STEP_COUNT)[number]]: K };

export const TOAST_TYPES = [
  'success',
  'error',
  'warning',
  'progress',
  'loading',
  'default',
  'custom',
] as const;

export const TOAST_TYPE = Object.fromEntries(TOAST_TYPES.map((type) => [type, type])) as {
  [K in (typeof TOAST_TYPES)[number]]: K;
};

export const VIDEO_PLACEHOLDER = '/images/Video-Placeholder.webp';

export const PRODUCT_VARIANT_ACTIONS = [
  { content: 'Remove', className: 'bg-electric-purple-c' },
  { content: 'Clear', className: 'bg-primary-red' },
  { content: 'Add', className: 'bg-primary-yellow' },
] as const;
