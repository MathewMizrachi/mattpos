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

interface PurchaseOrder {
  id: number;
  orderDate: Date;
  supplier: string;
  items: PurchaseOrderItem[];
  totalCost: number;
  status: 'pending' | 'ordered' | 'received' | 'cancelled';
  notes?: string;
}

interface PurchaseOrderItem {
  productId: number;
  productName: string;
  quantity: number;
  costPrice: number;
}

class Database {
  private users: User[] = [
    { id: 1, name: 'Owner', pin: '55', role: 'manager' },
    { id: 2, name: 'Staff 1', pin: '55', role: 'staff' },
  ];

  private products: Product[] = [
    // Till stock products from user's comprehensive list - updated with varied stock levels for demo
    { id: 148571, name: 'ABC STINI AMERICAN BLUE CUBES 25G (1X1)', price: 10, stock: 2, barcode: '6009605220961', stockCode: '148571', linkCode: '148571-001', avgCostIncl: 8.4 },
    { id: 100304, name: 'ACE SAMP 1KG (1X1)', price: 24, stock: 18, barcode: '6001256003108', stockCode: '100304', linkCode: '100304-001', avgCostIncl: 20.16 },
    { id: 101494, name: 'ALWAYS MAXI 8S THICK 3IN1 LONG (1X1)', price: 22, stock: 1, barcode: '8700216268103', stockCode: '101494', linkCode: '101494-001', avgCostIncl: 18.7 },
    { id: 148565, name: 'AMANDHLA FOWL FOOD 1KG MIXED (1X1)', price: 15, stock: 24, barcode: '6007561000214', stockCode: '148565', linkCode: '148565-001', avgCostIncl: 12.3 },
    { id: 148559, name: 'AMANDHLA YELLOW MAIZE 1KG WHOLE (1X1)', price: 10, stock: 3, barcode: '6007561000467', stockCode: '148559', linkCode: '148559-001', avgCostIncl: 8.2 },
    { id: 102309, name: 'AQUELLE WATER 1.5LT SPKL LITCHI (1X1)', price: 17, stock: 25, barcode: '6009612470298', stockCode: '102309', linkCode: '102309-001', avgCostIncl: 14.45 },
    { id: 102311, name: 'AQUELLE WATER 1.5LT SPKL NAARTJIE (1X1)', price: 17, stock: 4, barcode: '6009612470281', stockCode: '102311', linkCode: '102311-001', avgCostIncl: 13.6 },
    { id: 102330, name: 'AQUELLE WATER 500ML SPKL LITCHI (1X1)', price: 10, stock: 2, barcode: '6009612470175', stockCode: '102330', linkCode: '102330-001', avgCostIncl: 8.5 },
    { id: 148555, name: 'AUNT CAROLINE RICE 2KG (1X1)', price: 45, stock: 22, barcode: '6001231000788', stockCode: '148555', linkCode: '148555-001', avgCostIncl: 37.8 },
    { id: 148561, name: 'AUNTY CAROLINE RICE 10KG', price: 170, stock: 1, barcode: '6001231000511', stockCode: '148561', linkCode: '', avgCostIncl: 142.8 },
    { id: 102939, name: 'BAKERS CHOC-KITS 200G CHOC (1X1)', price: 38, stock: 19, barcode: '6001056119009', stockCode: '102939', linkCode: '102939-001', avgCostIncl: 31.16 },
    { id: 102953, name: 'BAKERS EET-SUM-MOR 200G (1X1)', price: 32, stock: 3, barcode: '6001056201001', stockCode: '102953', linkCode: '102953-001', avgCostIncl: 26.88 },
    { id: 102997, name: 'BAKERS MARIE 200G ORIGINAL (1X1)', price: 20, stock: 16, barcode: '6001056453004', stockCode: '102997', linkCode: '102997-001', avgCostIncl: 16.4 },
    { id: 103035, name: 'BAKERS RED LABEL 200G LEMON CREAMS (1X1)', price: 24, stock: 2, barcode: '6001056411004', stockCode: '103035', linkCode: '103035-001', avgCostIncl: 20.64 },
    { id: 103042, name: 'BAKERS ROMANY CRM 200G CLASSIC CHOC (1X1)', price: 38, stock: 1, barcode: '6001125001877', stockCode: '103042', linkCode: '103042-001', avgCostIncl: 30.4 },
    { id: 103080, name: 'BAKERS TENNIS 200G ORIGINAL (1X1)', price: 27, stock: 15, barcode: '6001056662000', stockCode: '103080', linkCode: '103080-001', avgCostIncl: 22.95 },
    { id: 103085, name: 'BAKERS TOPPER 125G CHOC MINT (1X1)', price: 12, stock: 4, barcode: '6009704170136', stockCode: '103085', linkCode: '103085-001', avgCostIncl: 9.84 },
    { id: 103086, name: 'BAKERS TOPPER 125G CHOCO (1X1)', price: 12, stock: 1, barcode: '6001056412919', stockCode: '103086', linkCode: '103086-001', avgCostIncl: 10.08 },
    { id: 103088, name: 'BAKERS TOPPER 125G CUSTARD (1X1)', price: 12, stock: 18, barcode: '6001056412940', stockCode: '103088', linkCode: '103088-001', avgCostIncl: 9.6 },
    { id: 103091, name: 'BAKERS TOPPER 125G VANILLA (1X1)', price: 12, stock: 2, barcode: '6001056412933', stockCode: '103091', linkCode: '103091-001', avgCostIncl: 10.2 },
    { id: 103832, name: 'BENNYS INSTANT SPICE 42\'S CHICKEN (1X1)', price: 3, stock: 20, barcode: '6009522305734', stockCode: '103832', linkCode: '103832-001', avgCostIncl: 2.52 },
    { id: 104722, name: 'BIOPLUS BOOSTER 10ML ORIGINAL (1X1)', price: 7, stock: 3, barcode: '6009695584912', stockCode: '104722', linkCode: '104722-001', avgCostIncl: 5.88 },
    { id: 148569, name: 'BLACK SILK RELAXER 225ML (1X1)', price: 60, stock: 1, barcode: '6001206423628', stockCode: '148569', linkCode: '148569-001', avgCostIncl: 50.4 },
    { id: 148554, name: 'BORN N BREAD IN KZN BROWN BREAD 700G (1X1)', price: 17, stock: 25, barcode: '6001205730321', stockCode: '148554', linkCode: '148554-001', avgCostIncl: 13.94 },
    { id: 148553, name: 'BORN N BREAD IN KZN WHITE BREAD 700G (1X1)', price: 18, stock: 4, barcode: '6001205730475', stockCode: '148553', linkCode: '148553-001', avgCostIncl: 15.12 },
    { id: 105988, name: 'BULL BRAND CORNED MEAT 300G (1X1)', price: 32, stock: 2, barcode: '6001330000146', stockCode: '105988', linkCode: '105988-001', avgCostIncl: 26.88 },
    { id: 106164, name: 'CADBURY BAR 20G LUNCH BAR MINI (1X1)', price: 6, stock: 17, barcode: '7622202282614', stockCode: '106164', linkCode: '106164-001', avgCostIncl: 4.92 },
    { id: 106257, name: 'CADBURY DAIRY MILK 80G TOP DECK (1X1)', price: 22, stock: 1, barcode: '6001065601090', stockCode: '106257', linkCode: '106257-001', avgCostIncl: 18.92 },
    { id: 106659, name: 'CAPPY STILL 1.5LT PET B/FAST BLEND (1X1)', price: 38, stock: 21, barcode: '5449000256041', stockCode: '106659', linkCode: '106659-001', avgCostIncl: 31.54 },
    { id: 106952, name: 'CASA-MIA BISCUITS 5S REAL TEA (1X1)', price: 1, stock: 3, barcode: '6009645790264', stockCode: '106952', linkCode: '106952-001', avgCostIncl: 0.82 },
    { id: 108079, name: 'CLERE GLYCERINE 50ML PURE BP (1X1)', price: 17, stock: 2, barcode: '60068088', stockCode: '108079', linkCode: '108079-001', avgCostIncl: 14.28 },
    { id: 108277, name: 'CLORETS C/GUM 52S ELIMINATOR S/FREE (1X1)', price: 45, stock: 19, barcode: '7622201433499', stockCode: '108277', linkCode: '108277-001', avgCostIncl: 37.8 },
    { id: 108570, name: 'CLOVER MILK 300ML L/LIFE F/CREAM UHT (1X1)', price: 12, stock: 4, barcode: '6001299024931', stockCode: '108570', linkCode: '108570-001', avgCostIncl: 10.32 },
    { id: 108572, name: 'CLOVER MILK L/LIFE 1LT FULL CREAM (1X1)', price: 20, stock: 1, barcode: '6001299015274', stockCode: '108572', linkCode: '108572-001', avgCostIncl: 16.8 },
    { id: 108784, name: 'COCA-COLA 1.5LT REGULAR (1X1)', price: 20, stock: 23, barcode: '5449000000439', stockCode: '108784', linkCode: '108784-001', avgCostIncl: 16.4 },
    { id: 108799, name: 'COCA-COLA 2LT REG (1X1)', price: 26, stock: 2, barcode: '5449000009067', stockCode: '108799', linkCode: '108799-001', avgCostIncl: 21.84 },
    { id: 108808, name: 'COCA-COLA 300ML PET (1X1)', price: 9, stock: 15, barcode: '90338052', stockCode: '108808', linkCode: '108808-001', avgCostIncl: 7.38 },
    { id: 108826, name: 'COCA-COLA 500ML CAN REG (1X1)', price: 14, stock: 3, barcode: '5449000000453', stockCode: '108826', linkCode: '108826-001', avgCostIncl: 11.76 },
    { id: 108925, name: 'COLGATE T/PASTE 100ML REGULAR (1X1)', price: 29, stock: 1, barcode: '6001067066613', stockCode: '108925', linkCode: '108925-001', avgCostIncl: 24.36 },
    { id: 108937, name: 'COLGATE T/PASTE 50ML REGULAR (1X1)', price: 17, stock: 24, barcode: '6001067066538', stockCode: '108937', linkCode: '108937-001', avgCostIncl: 14.62 },
    { id: 109089, name: 'COMPRAL TABLETS DISPLAY CARD 2S (1X1)', price: 4, stock: 2, barcode: '6009695584516', stockCode: '109089', linkCode: '109089-001', avgCostIncl: 3.28 },
    { id: 148576, name: 'COO-EE 1.25LT APPLE (1X1)', price: 12, stock: 3, barcode: '6009691351174', stockCode: '148576', linkCode: '148576-001', avgCostIncl: 10.08 },
    { id: 148574, name: 'COO-EE 1.25LT COLA (1X1)', price: 12, stock: 1, barcode: '6009691351204', stockCode: '148574', linkCode: '148574-001', avgCostIncl: 9.84 },
    { id: 148577, name: 'COO-EE 1.25LT IRON BREW (1X1)', price: 12, stock: 18, barcode: '6009691351136', stockCode: '148577', linkCode: '148577-001', avgCostIncl: 10.32 },
    { id: 148575, name: 'COO-EE 1.25LT PINEAPPLE (1X1)', price: 12, stock: 4, barcode: '6009691351228', stockCode: '148575', linkCode: '148575-001', avgCostIncl: 9.6 },
    { id: 109120, name: 'COO-EE 2LT APPLE (1X1)', price: 15, stock: 2, barcode: '6009691350054', stockCode: '109120', linkCode: '109120-001', avgCostIncl: 12.6 },
    { id: 148578, name: 'COO-EE 2LT CRANBERRY (1X1)', price: 15, stock: 1, barcode: '6009691358180', stockCode: '148578', linkCode: '148578-001', avgCostIncl: 12.3 },
    { id: 109125, name: 'COO-EE 2LT GRANADILLA (1X1)', price: 15, stock: 22, barcode: '6009691350085', stockCode: '109125', linkCode: '109125-001', avgCostIncl: 12.9 },
    { id: 109127, name: 'COO-EE 2LT IRON BREW (1X1)', price: 15, stock: 3, barcode: '6009691350115', stockCode: '109127', linkCode: '109127-001', avgCostIncl: 12.45 },
    { id: 148579, name: 'COO-EE 2LT MOCKTAIL (1X1)', price: 15, stock: 1, barcode: '6009705214372', stockCode: '148579', linkCode: '148579-001', avgCostIncl: 12.75 },
    { id: 109132, name: 'COO-EE 2LT PINEAPPLE (1X1)', price: 15, stock: 20, barcode: '6009691350092', stockCode: '109132', linkCode: '109132-001', avgCostIncl: 12.15 },
    { id: 109460, name: 'CREMORA COFFEE CREAMER 125G POUCH (1X1)', price: 17, stock: 4, barcode: '6001308204262', stockCode: '109460', linkCode: '109460-001', avgCostIncl: 14.28 },
    { id: 110925, name: 'DAWN LOTION 200ML ALOE VERA (1X1)', price: 25, stock: 2, barcode: '6001087012324', stockCode: '110925', linkCode: '110925-001', avgCostIncl: 21 },
    { id: 110937, name: 'DAWN LOTION 400ML [M] ENERGY (1X1)', price: 30, stock: 17, barcode: '6001087373791', stockCode: '110937', linkCode: '110937-001', avgCostIncl: 24.6 },
    { id: 110941, name: 'DAWN LOTION 400ML ALOE VERA (1X1)', price: 28, stock: 3, barcode: '6001087012331', stockCode: '110941', linkCode: '110941-001', avgCostIncl: 23.52 },
    { id: 111618, name: 'DETTOL ANTISEPTIC LIQUID 50ML (1X1)', price: 18, stock: 1, barcode: '60050267', stockCode: '111618', linkCode: '111618-001', avgCostIncl: 15.12 },
    { id: 111832, name: 'DISPRIN TABS 2S RED EXTRA (1X1)', price: 4, stock: 21, barcode: '6001106120771', stockCode: '111832', linkCode: '111832-001', avgCostIncl: 3.36 },
    { id: 148233, name: 'YUM YUM P/BUTTER 250G SMOOTH (1X1)', price: 33, stock: 2, barcode: '6001069034139', stockCode: '148233', linkCode: '148233-001', avgCostIncl: 27.72 },
  ];

  private customers: Customer[] = [];
  private shifts: Shift[] = [];
  private transactions: Transaction[] = [];
  private refunds: Refund[] = [];
  private purchaseOrders: PurchaseOrder[] = [
    // Sample purchase orders for demonstration
    {
      id: 1,
      orderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      supplier: 'ABC Food Supplies',
      items: [
        { productId: 108784, productName: 'COCA-COLA 1.5LT REGULAR (1X1)', quantity: 24, costPrice: 16.4 },
        { productId: 108799, productName: 'COCA-COLA 2LT REG (1X1)', quantity: 12, costPrice: 21.84 }
      ],
      totalCost: 655.68,
      status: 'received',
      notes: 'Delivered on time'
    },
    {
      id: 2,
      orderDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      supplier: 'Fresh Market Distributors',
      items: [
        { productId: 148555, productName: 'AUNT CAROLINE RICE 2KG (1X1)', quantity: 10, costPrice: 37.8 },
        { productId: 148561, productName: 'AUNTY CAROLINE RICE 10KG', quantity: 6, costPrice: 142.8 }
      ],
      totalCost: 1235.8,
      status: 'ordered'
    },
    {
      id: 3,
      orderDate: new Date(),
      supplier: 'Global Food Partners',
      items: [
        { productId: 102939, productName: 'BAKERS CHOC-KITS 200G CHOC (1X1)', quantity: 15, costPrice: 31.16 }
      ],
      totalCost: 467.4,
      status: 'pending'
    }
  ];

  private currentId = {
    shift: 1,
    transaction: 1,
    product: 200000,
    customer: 1,
    refund: 1,
    purchaseOrder: 4,
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

  // Purchase Order methods
  createPurchaseOrder(supplier: string, items: PurchaseOrderItem[]): PurchaseOrder {
    const totalCost = items.reduce((sum, item) => sum + (item.quantity * item.costPrice), 0);
    
    const newOrder: PurchaseOrder = {
      id: this.currentId.purchaseOrder++,
      orderDate: new Date(),
      supplier,
      items,
      totalCost,
      status: 'pending'
    };
    
    this.purchaseOrders.push(newOrder);
    return newOrder;
  }

  getAllPurchaseOrders(): PurchaseOrder[] {
    return [...this.purchaseOrders].sort((a, b) => 
      new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
    );
  }

  updatePurchaseOrderStatus(orderId: number, status: PurchaseOrder['status'], notes?: string): PurchaseOrder | null {
    const index = this.purchaseOrders.findIndex(order => order.id === orderId);
    if (index === -1) return null;
    
    this.purchaseOrders[index] = {
      ...this.purchaseOrders[index],
      status,
      notes
    };
    
    return this.purchaseOrders[index];
  }
}

// Create a singleton instance
const db = new Database();
export default db;
