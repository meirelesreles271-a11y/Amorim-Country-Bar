
import { AppState, Product, Command, Category, CashierState, Transaction } from './types';

const STORAGE_KEY = 'amorim_country_bar_state';
const CHANNEL_NAME = 'amorim_bar_sync';

const initialAppState: AppState = {
  products: [
    { id: '1', name: 'Chopp Amanteigado', description: 'O clássico do bar com espuma cremosa.', price: 12.5, category: Category.BEER, imageUrl: 'https://picsum.photos/400/400?random=1' },
    { id: '2', name: 'Costela do Xerife', description: 'Costela assada por 12 horas.', price: 85.0, category: Category.FOOD, imageUrl: 'https://picsum.photos/400/400?random=2' },
  ],
  commands: [],
  cashier: {
    isOpen: false,
    initialBalance: 0,
    currentBalance: 0,
    transactions: []
  }
};

const broadcastChannel = new BroadcastChannel(CHANNEL_NAME);

export const getState = (): AppState => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : initialAppState;
};

export const saveState = (state: AppState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  broadcastChannel.postMessage(state);
};

export const subscribeToChanges = (callback: (state: AppState) => void) => {
  const handler = (event: MessageEvent<AppState>) => callback(event.data);
  broadcastChannel.addEventListener('message', handler);
  return () => broadcastChannel.removeEventListener('message', handler);
};

// State update helpers
export const addProduct = (product: Product) => {
  const state = getState();
  state.products.push(product);
  saveState(state);
};

export const updateProduct = (updatedProduct: Product) => {
    const state = getState();
    state.products = state.products.map(p => p.id === updatedProduct.id ? updatedProduct : p);
    saveState(state);
};

export const deleteProduct = (id: string) => {
    const state = getState();
    state.products = state.products.filter(p => p.id !== id);
    saveState(state);
};

export const openCommand = (tableNumber: string, customerName?: string) => {
  const state = getState();
  const newCommand: Command = {
    id: Math.random().toString(36).substr(2, 9),
    tableNumber,
    customerName,
    items: [],
    status: 'open',
    openedAt: Date.now(),
    total: 0
  };
  state.commands.push(newCommand);
  saveState(state);
  return newCommand;
};

export const addItemToCommand = (commandId: string, productId: string, quantity: number) => {
  const state = getState();
  const command = state.commands.find(c => c.id === commandId);
  const product = state.products.find(p => p.id === productId);
  if (command && product) {
    const existingItem = command.items.find(i => i.productId === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      command.items.push({
        productId,
        quantity,
        price: product.price,
        name: product.name
      });
    }
    command.total = command.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    saveState(state);
  }
};

export const closeCommand = (commandId: string, paymentMethod: 'cash' | 'card' | 'pix') => {
  const state = getState();
  const command = state.commands.find(c => c.id === commandId);
  if (command && command.status === 'open') {
    command.status = 'closed';
    const transaction: Transaction = {
        id: Math.random().toString(36).substr(2, 9),
        commandId: command.id,
        amount: command.total,
        timestamp: Date.now(),
        method: paymentMethod
    };
    state.cashier.transactions.push(transaction);
    state.cashier.currentBalance += transaction.amount;
    saveState(state);
  }
};

export const openCashier = (initialBalance: number) => {
    const state = getState();
    state.cashier = {
        isOpen: true,
        openedAt: Date.now(),
        initialBalance,
        currentBalance: initialBalance,
        transactions: []
    };
    saveState(state);
};

export const closeCashier = () => {
    const state = getState();
    state.cashier.isOpen = false;
    saveState(state);
};
