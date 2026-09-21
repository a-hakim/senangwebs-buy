export as namespace SWB;
export = SWB;

declare class SWB {
  stores: Map<string, SWB.Store>;
  constructor();
  init(): void;
  refresh(): void;
  setCurrency(code: string): void;
  addToCart(storeId: string, product: SWB.Product): void;
  removeFromCart(storeId: string, sku: string): void;
  updateQuantity(storeId: string, sku: string, change: number): void;
  clearCart(storeId: string): void;
  showCheckout(storeId: string): void;
  closeCheckout(storeId: string): void;
  formatPrice(amount: number, storeId?: string): string;
  calculateCartTotal(cart: SWB.Product[]): number;
  formatWhatsAppMessage(
    storeId: string,
    customerInfo: Record<string, string>
  ): string;
}

declare namespace SWB {
  interface Product {
    sku: string;
    name: string;
    price: number;
    quantity: number;
  }

  interface CustomField {
    name: string;
    label?: string;
    type?: "text" | "email" | "tel" | "number" | "date" | "time" | "url" | "textarea" | "select" | string;
    placeholder?: string;
    required?: boolean;
    pattern?: string;
    min?: string | number;
    max?: string | number;
    options?: string[];
  }

  interface StoreInfo {
    name: string;
    whatsapp: string;
    cartEnabled: boolean;
    floatingCart: boolean | string;
    checkoutTitle: string;
    billingTitle: string;
    submitButtonText: string;
    enableBilling: boolean;
    customFields: CustomField[];
    currency: string;
  }

  interface CatalogProduct {
    element: HTMLElement;
    sku: string;
    name: string;
    price: number;
  }

  interface Store {
    cart: Product[];
    info: StoreInfo;
    colors: { primary: string; secondary: string };
    products: CatalogProduct[];
    filteredProducts: CatalogProduct[];
    sortState: { field: "name" | "price" | string; direction: "asc" | "desc" };
    searchQuery: string;
  }
}

declare global {
  interface Window {
    /** Auto-initialized SWB instance (drop-in `<script>` usage). */
    swb: SWB;
    /** UMD global: the SWB class. */
    SWB: typeof SWB;
  }
}
