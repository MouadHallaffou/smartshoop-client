export interface Client {
  id?: number;
  username: string;
  email: string;
  password?: string;
  name: string;
  customerTier?: "BASIC" | "SILVER" | "GOLD" | "PLATINUM";
  totalOrders?: number;
  totalAmount?: number;
  firstOrderDate?: string;
  lastOrderDate?: string;
  isActive?: boolean;
  isDeleted?: boolean;
}

export interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  isActive?: boolean;
  isDeleted?: boolean;
}

export interface OrderItem {
  productId: number;
  quantity: number;
  product?: Product;
}

export interface CodePromo {
  id?: number;
  code: string;
  discountPercentage: number;
  isActive: boolean;
  expirationDate: string;
  createdAt?: string;
  updatedAt?: string;
  isDeleted?: boolean;
}

export interface Order {
  id?: number;
  clientId: number;
  client?: Client;
  promoCode?: string;
  codePromo?: CodePromo;
  orderItems: OrderItem[];
  paiements?: Payment[];
  totalHT?: number;
  totalTTC?: number;
  montantReste?: number;
  remise?: number;
  montantTVA?: number;
  totalAmount?: number;
  status?: "PENDING" | "CONFIRMED" | "CANCELLED";
  orderStatus?: "PENDING" | "CONFIRMED" | "CANCELLED";
  orderDate?: string;
  createdAt?: string;
  updatedAt?: string;
  isDeleted?: boolean;
}

export interface Payment {
  id?: number;
  orderId: number;
  order?: Order;
  numeroPaiement?: string;
  montant: number;
  typePayment: "ESPECE" | "CHEQUE" | "VIREMENT";
  typePaiement?: "ESPECE" | "CHEQUE" | "VIREMENT";
  reference?: string;
  banque?: string;
  motif?: string;
  dateEcheance?: string;
  datePaiement?: string;
  dateEncaissement?: string;
  status?: "PENDING" | "COMPLETED" | "FAILED";
  numero?: string;
}

export interface PaginationParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
