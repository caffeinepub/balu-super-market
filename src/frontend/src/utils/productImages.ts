const STORAGE_KEY = "balu_product_images";

export function getProductImages(): Record<string, string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, string>;
  } catch {
    return {};
  }
}

export function setProductImage(productName: string, imageUrl: string): void {
  const images = getProductImages();
  images[productName] = imageUrl;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(images));
}

export function getProductImage(productName: string): string | undefined {
  return getProductImages()[productName];
}
