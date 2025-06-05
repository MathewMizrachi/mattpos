// Simple in-memory database for demonstration purposes
// In a real application, this would use IndexedDB or SQLite

interface User {
  id: number;
  name: string;
  pin: string;
  role: 'manager' | 'staff';
}

interface Product {
  id: number;
  name: string;
  price: number;
  stock?: number;
  barcode?: string;
  stockCode?: string;
  linkCode?: string;
  avgCostIncl?: number;
}

interface Shift {
  id: number;
  userId: number;
  startTime: Date;
  endTime?: Date;
  startFloat: number;
  endFloat?: number;
  salesTotal?: number;
  transactionCount?: number;
}

interface Transaction {
  id: number;
  shiftId: number;
  timestamp: Date;
  total: number;
  items: TransactionItem[];
  cashReceived: number;
  change: number;
  paymentMethod: 'cash' | 'card' | 'shop2shop' | 'account' | 'split';
  customerId?: number;
  splitPayments?: SplitPaymentDetail[];
  isRefund?: boolean;
}

interface SplitPaymentDetail {
  method: 'cash' | 'card' | 'shop2shop' | 'account';
  amount: number;
}

interface TransactionItem {
  productId: number;
  quantity: number;
  unitPrice: number;
}

interface Refund {
  id: number;
  shiftId: number;
  timestamp: Date;
  productId: number;
  quantity: number;
  amount: number;
  method: 'cash' | 'shop2shop';
}

interface Customer {
  id: number;
  name: string;
  phone: string;
  idNumber?: string;
  createdAt: Date;
  updatedAt: Date;
  paymentTermDays?: number;
  isPaid?: boolean;
}

class Database {
  private users: User[] = [
    { id: 1, name: 'Owner', pin: '55', role: 'manager' },
    { id: 2, name: 'Staff 1', pin: '55', role: 'staff' },
  ];

  private products: Product[] = [
    { id: 148571, name: 'ABC STINI AMERICAN BLUE CUBES 25G (1X1)', price: 10, stock: 1, barcode: '6009605220961', stockCode: '148571', linkCode: '148571-001', avgCostIncl: 0 },
    { id: 100304, name: 'ACE SAMP 1KG (1X1)', price: 24, stock: 1, barcode: '6001256003108', stockCode: '100304', linkCode: '100304-001', avgCostIncl: 7.18 },
    { id: 101494, name: 'ALWAYS MAXI 8S THICK 3IN1 LONG (1X1)', price: 22, stock: 1, barcode: '8700216268103', stockCode: '101494', linkCode: '101494-001', avgCostIncl: 0 },
    { id: 148565, name: 'AMANDHLA FOWL FOOD 1KG MIXED (1X1)', price: 15, stock: 1, barcode: '6007561000214', stockCode: '148565', linkCode: '148565-001', avgCostIncl: 0 },
    { id: 148559, name: 'AMANDHLA YELLOW MAIZE 1KG WHOLE (1X1)', price: 10, stock: 1, barcode: '6007561000467', stockCode: '148559', linkCode: '148559-001', avgCostIncl: 0 },
    { id: 102309, name: 'AQUELLE WATER 1.5LT SPKL LITCHI (1X1)', price: 17, stock: 1, barcode: '6009612470298', stockCode: '102309', linkCode: '102309-001', avgCostIncl: 0 },
    { id: 102311, name: 'AQUELLE WATER 1.5LT SPKL NAARTJIE (1X1)', price: 17, stock: 1, barcode: '6009612470281', stockCode: '102311', linkCode: '102311-001', avgCostIncl: 0 },
    { id: 102330, name: 'AQUELLE WATER 500ML SPKL LITCHI (1X1)', price: 10, stock: 1, barcode: '6009612470175', stockCode: '102330', linkCode: '102330-001', avgCostIncl: 0 },
    { id: 148555, name: 'AUNT CAROLINE RICE 2KG (1X1)', price: 45, stock: 1, barcode: '6001231000788', stockCode: '148555', linkCode: '148555-001', avgCostIncl: 0 },
    { id: 148561, name: 'AUNTY CAROLINE RICE 10KG', price: 170, stock: 1, barcode: '6001231000511', stockCode: '148561', linkCode: '', avgCostIncl: 0 },
    { id: 102939, name: 'BAKERS CHOC-KITS 200G CHOC (1X1)', price: 38, stock: 1, barcode: '6001056119009', stockCode: '102939', linkCode: '102939-001', avgCostIncl: 0 },
    { id: 102953, name: 'BAKERS EET-SUM-MOR 200G (1X1)', price: 32, stock: 1, barcode: '6001056201001', stockCode: '102953', linkCode: '102953-001', avgCostIncl: 0 },
    { id: 102997, name: 'BAKERS MARIE 200G ORIGINAL (1X1)', price: 20, stock: 1, barcode: '6001056453004', stockCode: '102997', linkCode: '102997-001', avgCostIncl: 0 },
    { id: 103035, name: 'BAKERS RED LABEL 200G LEMON CREAMS (1X1)', price: 24, stock: 1, barcode: '6001056411004', stockCode: '103035', linkCode: '103035-001', avgCostIncl: 0 },
    { id: 103042, name: 'BAKERS ROMANY CRM 200G CLASSIC CHOC (1X1)', price: 38, stock: 1, barcode: '6001125001877', stockCode: '103042', linkCode: '103042-001', avgCostIncl: 0 },
    { id: 103080, name: 'BAKERS TENNIS 200G ORIGINAL (1X1)', price: 27, stock: 1, barcode: '6001056662000', stockCode: '103080', linkCode: '103080-001', avgCostIncl: 0 },
    { id: 103085, name: 'BAKERS TOPPER 125G CHOC MINT (1X1)', price: 12, stock: 1, barcode: '6009704170136', stockCode: '103085', linkCode: '103085-001', avgCostIncl: 0 },
    { id: 103086, name: 'BAKERS TOPPER 125G CHOCO (1X1)', price: 12, stock: 1, barcode: '6001056412919', stockCode: '103086', linkCode: '103086-001', avgCostIncl: 0 },
    { id: 103088, name: 'BAKERS TOPPER 125G CUSTARD (1X1)', price: 12, stock: 1, barcode: '6001056412940', stockCode: '103088', linkCode: '103088-001', avgCostIncl: 0 },
    { id: 103091, name: 'BAKERS TOPPER 125G VANILLA (1X1)', price: 12, stock: 1, barcode: '6001056412933', stockCode: '103091', linkCode: '103091-001', avgCostIncl: 0 },
    { id: 148542, name: 'FUTURELIFE 500G SMART FOOD ZERO CHOCOLATE (1X1)', price: 60, stock: 1, barcode: '6009710612828', stockCode: '148542', linkCode: '148542-001', avgCostIncl: 0 },
    { id: 148233, name: 'YUM YUM P/BUTTER 250G SMOOTH (1X1)', price: 33, stock: 1, barcode: '6001069034139', stockCode: '148233', linkCode: '148233-001', avgCostIncl: 0 },
  ];

  private customers: Customer[] = [];
  private shifts: Shift[] = [];
  private transactions: Transaction[] = [];
  private refunds: Refund[] = [];
  private currentId = {
    shift: 1,
    transaction: 1,
    product: 200000,
    customer: 1,
    refund: 1,
  };

  // User methods
  authenticateUser(pin: string): User | null {
    return this.users.find(user => user.pin === pin) || null;
  }

  // Product methods
  getAllProducts(): Product[] {
    return [...this.products];
  }

  getProduct(id: number): Product | undefined {
    return this.products.find(product => product.id === id);
  }

  addProduct(product: Omit<Product, 'id'>): Product {
    const newProduct = {
      ...product,
      id: this.currentId.product++,
    };
    this.products.push(newProduct);
    return newProduct;
  }

  updateProduct(id: number, updates: Partial<Omit<Product, 'id'>>): Product | null {
    const index = this.products.findIndex(product => product.id === id);
    if (index === -1) return null;
    
    this.products[index] = { ...this.products[index], ...updates };
    return this.products[index];
  }

  deleteProduct(id: number): boolean {
    const initialLength = this.products.length;
    this.products = this.products.filter(product => product.id !== id);
    return initialLength !== this.products.length;
  }

  // Customer methods
  getAllCustomers(): Customer[] {
    return [...this.customers];
  }

  getCustomer(id: number): Customer | undefined {
    return this.customers.find(customer => customer.id === id);
  }

  getCustomerByPhone(phone: string): Customer | undefined {
    return this.customers.find(customer => customer.phone === phone);
  }

  addCustomer(name: string, phone: string, idNumber?: string, paymentTermDays?: number): Customer {
    // Check if customer already exists
    const existingCustomer = this.getCustomerByPhone(phone);
    if (existingCustomer) {
      // Update the customer info if it changed
      existingCustomer.name = name;
      if (idNumber) existingCustomer.idNumber = idNumber;
      if (paymentTermDays) existingCustomer.paymentTermDays = paymentTermDays;
      existingCustomer.updatedAt = new Date();
      return existingCustomer;
    }

    // Create new customer
    const newCustomer: Customer = {
      id: this.currentId.customer++,
      name,
      phone,
      idNumber,
      paymentTermDays,
      createdAt: new Date(),
      updatedAt: new Date(),
      isPaid: false
    };
    
    this.customers.push(newCustomer);
    return newCustomer;
  }

  markCustomerAsPaid(customerId: number): boolean {
    const customerIndex = this.customers.findIndex(c => c.id === customerId);
    if (customerIndex === -1) return false;
    
    this.customers[customerIndex] = {
      ...this.customers[customerIndex],
      isPaid: true,
      updatedAt: new Date()
    };
    
    return true;
  }

  // Shift methods
  startShift(userId: number, startFloat: number): Shift {
    const newShift = {
      id: this.currentId.shift++,
      userId,
      startTime: new Date(),
      startFloat,
      salesTotal: 0,
      transactionCount: 0,
    };
    this.shifts.push(newShift);
    return newShift;
  }

  getCurrentShift(): Shift | null {
    return this.shifts.find(shift => !shift.endTime) || null;
  }

  getLastShift(): Shift | null {
    if (this.shifts.length <= 1) return null;
    
    const completedShifts = this.shifts.filter(shift => shift.endTime);
    if (completedShifts.length === 0) return null;
    
    return completedShifts.sort((a, b) => 
      new Date(b.endTime!).getTime() - new Date(a.endTime!).getTime()
    )[0];
  }

  getLastShiftEndFloat(): number | null {
    const lastShift = this.getLastShift();
    return lastShift?.endFloat !== undefined ? lastShift.endFloat : null;
  }

  endShift(shiftId: number, endFloat: number): Shift | null {
    const index = this.shifts.findIndex(shift => shift.id === shiftId);
    if (index === -1) return null;
    
    // Calculate shift totals
    const shiftTransactions = this.transactions.filter(t => t.shiftId === shiftId);
    const sales = shiftTransactions.filter(t => !t.isRefund).reduce((sum, t) => sum + t.total, 0);
    const refundsTotal = shiftTransactions.filter(t => t.isRefund).reduce((sum, t) => sum + t.total, 0);
    const salesTotal = sales - refundsTotal;
    const transactionCount = shiftTransactions.length;
    
    this.shifts[index] = { 
      ...this.shifts[index], 
      endTime: new Date(),
      endFloat,
      salesTotal,
      transactionCount,
    };
    
    return this.shifts[index];
  }

  // Transaction methods
  createTransaction(shiftId: number, items: TransactionItem[], cashReceived: number, paymentMethod: 'cash' | 'card' | 'shop2shop' | 'account' | 'split' = 'cash', customerId?: number, splitPayments?: SplitPaymentDetail[], isRefund: boolean = false): Transaction {
    const total = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const change = paymentMethod === 'cash' ? cashReceived - total : 0;
    
    const newTransaction = {
      id: this.currentId.transaction++,
      shiftId,
      timestamp: new Date(),
      total,
      items,
      cashReceived,
      change,
      paymentMethod,
      customerId,
      splitPayments,
      isRefund
    };
    
    this.transactions.push(newTransaction);
    
    // Update shift totals
    const shiftIndex = this.shifts.findIndex(shift => shift.id === shiftId);
    if (shiftIndex !== -1) {
      const currentTotal = this.shifts[shiftIndex].salesTotal || 0;
      const currentCount = this.shifts[shiftIndex].transactionCount || 0;
      
      this.shifts[shiftIndex] = {
        ...this.shifts[shiftIndex],
        salesTotal: isRefund ? currentTotal - total : currentTotal + total,
        transactionCount: currentCount + 1,
      };
    }
    
    // Update product stock
    items.forEach(item => {
      const productIndex = this.products.findIndex(p => p.id === item.productId);
      if (productIndex !== -1 && this.products[productIndex].stock !== undefined) {
        this.products[productIndex] = {
          ...this.products[productIndex],
          stock: (this.products[productIndex].stock || 0) + (isRefund ? item.quantity : -item.quantity),
        };
      }
    });
    
    return newTransaction;
  }

  createRefund(shiftId: number, productId: number, quantity: number, amount: number, method: 'cash' | 'shop2shop'): Refund {
    const newRefund = {
      id: this.currentId.refund++,
      shiftId,
      timestamp: new Date(),
      productId,
      quantity,
      amount,
      method
    };
    
    this.refunds.push(newRefund);
    
    // Create a transaction for this refund
    const product = this.getProduct(productId);
    if (product) {
      this.createTransaction(
        shiftId,
        [{ productId, quantity, unitPrice: product.price }],
        amount,
        method,
        undefined,
        undefined,
        true
      );
    }
    
    return newRefund;
  }

  getShiftTransactions(shiftId: number): Transaction[] {
    return this.transactions.filter(t => t.shiftId === shiftId);
  }

  getShiftRefunds(shiftId: number): Refund[] {
    return this.refunds.filter(r => r.shiftId === shiftId);
  }

  getShiftPaymentBreakdown(shiftId: number) {
    const transactions = this.getShiftTransactions(shiftId);
    
    const breakdown = {
      cash: 0,
      card: 0,
      shop2shop: 0,
      account: 0
    };
    
    transactions.forEach(t => {
      if (t.isRefund) {
        // For refunds, subtract from the appropriate payment method
        if (t.paymentMethod === 'cash') breakdown.cash -= t.total;
        if (t.paymentMethod === 'card') breakdown.card -= t.total;
        if (t.paymentMethod === 'shop2shop') breakdown.shop2shop -= t.total;
        if (t.paymentMethod === 'account') breakdown.account -= t.total;
      } else if (t.paymentMethod === 'split' && t.splitPayments) {
        // For split payments, add to each method
        t.splitPayments.forEach(sp => {
          if (sp.method === 'cash') breakdown.cash += sp.amount;
          if (sp.method === 'card') breakdown.card += sp.amount;
          if (sp.method === 'shop2shop') breakdown.shop2shop += sp.amount;
          if (sp.method === 'account') breakdown.account += sp.amount;
        });
      } else {
        // For regular payments
        if (t.paymentMethod === 'cash') breakdown.cash += t.total;
        if (t.paymentMethod === 'card') breakdown.card += t.total;
        if (t.paymentMethod === 'shop2shop') breakdown.shop2shop += t.total;
        if (t.paymentMethod === 'account') breakdown.account += t.total;
      }
    });
    
    return breakdown;
  }

  getShiftRefundBreakdown(shiftId: number) {
    const refunds = this.getShiftRefunds(shiftId);
    
    const items = refunds.map(refund => {
      const product = this.getProduct(refund.productId);
      return {
        productId: refund.productId,
        productName: product ? product.name : `Product #${refund.productId}`,
        quantity: refund.quantity,
        amount: refund.amount
      };
    });
    
    const total = items.reduce((sum, item) => sum + item.amount, 0);
    
    return { total, items };
  }

  getLowStockProducts(threshold: number = 5): Product[] {
    return this.products.filter(p => 
      p.stock !== undefined && 
      p.stock <= threshold && 
      p.stock > 0
    );
  }

  calculateExpectedCashInDrawer(shiftId: number): number {
    const shift = this.shifts.find(s => s.id === shiftId);
    if (!shift) return 0;
    
    const paymentBreakdown = this.getShiftPaymentBreakdown(shiftId);
    
    // Cash in drawer should be: starting float + cash payments - cash refunds - change given
    const cashTransactions = this.transactions.filter(
      t => t.shiftId === shiftId && (t.paymentMethod === 'cash' || (t.paymentMethod === 'split' && t.splitPayments?.some(sp => sp.method === 'cash')))
    );
    
    const changeGiven = cashTransactions
      .filter(t => !t.isRefund)
      .reduce((sum, t) => sum + t.change, 0);
    
    return shift.startFloat + paymentBreakdown.cash - changeGiven;
  }
}

// Create a singleton instance
const db = new Database();
export default db;
