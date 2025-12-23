
export enum Category {
  BEER = 'Cervejas',
  DRINK = 'Drinks',
  FOOD = 'Comidas',
  PORTION = 'Porções',
  DESSERT = 'Sobremesas'
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  imageUrl: string;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  name: string;
}

export interface Command {
  id: string;
  tableNumber: string;
  customerName?: string;
  items: OrderItem[];
  status: 'open' | 'closed';
  openedAt: number;
  total: number;
}

export interface Transaction {
  id: string;
  commandId: string;
  amount: number;
  timestamp: number;
  method: 'cash' | 'card' | 'pix';
}

export interface CashierState {
  isOpen: boolean;
  openedAt?: number;
  initialBalance: number;
  currentBalance: number;
  transactions: Transaction[];
}

export interface AppState {
  products: Product[];
  commands: Command[];
  cashier: CashierState;
}
