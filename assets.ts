export const HERO_WEAVER_IMAGE = '';
export const HERITAGE_BANNER_IMAGE = '';

export const LUNGI_IMAGES = {
  prinCheck: '',
  blueDora: '',
  classicCheck: '',
  whiteDora: '',
  greenDora: '',
};

export const FALLBACK_LUNGI_LIST: string[] = [];

export const getProductImages = (product: any): string[] => {
  if (product && Array.isArray(product.images) && product.images.length > 0) {
    const validImages = product.images.filter((img: any) => img && typeof img === 'string' && img.trim() !== '');
    if (validImages.length > 0) return validImages;
  }
  
  if (product && typeof product.image === 'string' && product.image.trim() !== '') {
    return [product.image];
  }

  return [];
};

export const getProductImage = (product: any): string => {
  const images = getProductImages(product);
  return images.length > 0 ? images[0] : '';
};

export const SLIDER_IMAGE_URLS = {
  weaver: '',
  heritage: '',
};

export const CATEGORY_IMAGE_URLS = {
  premium: '',
  classic: '',
  luxury: '',
  newArrivals: '',
  limitedEdition: '',
};


