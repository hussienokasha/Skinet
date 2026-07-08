export interface Cart {
  id: string;
  cartItems: CartItem[];
}

export interface CartItem {
  productId: number;
  productName: string;
  price: number;
  pictureUrl: string;
  type: string;
  brand: string;
  quantity: number;
}
