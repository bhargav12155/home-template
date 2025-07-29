export const BRAND_COLORS = {
  black: '#000000',
  beige: '#9b8b7e', 
  blue: '#304652',
  softBlack: '#333333',
  softWhite: '#FAFAFA'
} as const;

export const COMMUNITIES = [
  {
    name: 'Omaha',
    slug: 'omaha',
    description: 'Urban sophistication meets Midwest charm'
  },
  {
    name: 'Lincoln', 
    slug: 'lincoln',
    description: 'Capital city living at its finest'
  },
  {
    name: 'Elkhorn',
    slug: 'elkhorn', 
    description: 'Family-friendly suburban excellence'
  },
  {
    name: 'Lake Properties',
    slug: 'lake-properties',
    description: 'Waterfront luxury and recreation'
  }
] as const;

export const CONTACT_INFO = {
  phone: '(402) 522-6131',
  email: 'info@bjorkhomes.com',
  address: {
    street: '331 Village Pointe Plaza',
    city: 'Omaha', 
    state: 'NE',
    zip: '68130'
  },
  brokerage: 'Berkshire Hathaway Home Services Ambassador'
} as const;

export const SOCIAL_LINKS = {
  facebook: 'https://facebook.com/bjorkgroup',
  twitter: 'https://twitter.com/bjorkgroup', 
  linkedin: 'https://linkedin.com/company/bjorkgroup',
  instagram: 'https://instagram.com/bjorkgroup'
} as const;

export const YOUTUBE_CONFIG = {
  channelId: 'UCBjorkGroupRealEstate',
  showcaseVideoId: 'dQw4w9WgXcQ', // Replace with actual video ID
  playlistId: 'PLBjorkGroupProperties'
} as const;

export const PROPERTY_TYPES = [
  'Single Family',
  'Condo', 
  'Townhome',
  'Villa',
  'Land',
  'Commercial'
] as const;

export const PRICE_RANGES = [
  { label: 'Under $300K', min: 0, max: 300000 },
  { label: '$300K - $500K', min: 300000, max: 500000 },
  { label: '$500K - $750K', min: 500000, max: 750000 },
  { label: '$750K - $1M', min: 750000, max: 1000000 },
  { label: '$1M - $2M', min: 1000000, max: 2000000 },
  { label: '$2M+', min: 2000000, max: null }
] as const;

export const ARCHITECTURAL_STYLES = [
  'Modern',
  'Contemporary', 
  'Farmhouse',
  'Colonial',
  'Victorian',
  'Craftsman',
  'Ranch',
  'Tudor',
  'Mediterranean',
  'Mid-Century Modern',
  'Traditional',
  'Transitional',
  'Industrial',
  'Cape Cod',
  'Georgian',
  'Prairie',
  'Neoclassical',
  'Art Deco',
  'Minimalist',
  'Luxury Custom'
] as const;

export const NAVIGATION_ITEMS = [
  { name: 'Search Homes', href: '/search' },
  { name: 'Communities', href: '/communities' },
  { name: 'Buyers', href: '/buyers' },
  { name: 'Sellers', href: '/sellers' },
  { name: 'Agents', href: '/agents' },
  { name: 'About', href: '/about' },
  { name: 'Blog', href: '/blog' }
] as const;
