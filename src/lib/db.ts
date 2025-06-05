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
    // Till stock products from user's comprehensive list
    { id: 148571, name: 'ABC STINI AMERICAN BLUE CUBES 25G (1X1)', price: 10, stock: Math.floor(Math.random() * 21) + 10, barcode: '6009605220961', stockCode: '148571', linkCode: '148571-001', avgCostIncl: 8.4 },
    { id: 100304, name: 'ACE SAMP 1KG (1X1)', price: 24, stock: Math.floor(Math.random() * 21) + 10, barcode: '6001256003108', stockCode: '100304', linkCode: '100304-001', avgCostIncl: 20.16 },
    { id: 101494, name: 'ALWAYS MAXI 8S THICK 3IN1 LONG (1X1)', price: 22, stock: Math.floor(Math.random() * 21) + 10, barcode: '8700216268103', stockCode: '101494', linkCode: '101494-001', avgCostIncl: 18.7 },
    { id: 148565, name: 'AMANDHLA FOWL FOOD 1KG MIXED (1X1)', price: 15, stock: Math.floor(Math.random() * 21) + 10, barcode: '6007561000214', stockCode: '148565', linkCode: '148565-001', avgCostIncl: 12.3 },
    { id: 148559, name: 'AMANDHLA YELLOW MAIZE 1KG WHOLE (1X1)', price: 10, stock: Math.floor(Math.random() * 21) + 10, barcode: '6007561000467', stockCode: '148559', linkCode: '148559-001', avgCostIncl: 8.2 },
    { id: 102309, name: 'AQUELLE WATER 1.5LT SPKL LITCHI (1X1)', price: 17, stock: Math.floor(Math.random() * 21) + 10, barcode: '6009612470298', stockCode: '102309', linkCode: '102309-001', avgCostIncl: 14.45 },
    { id: 102311, name: 'AQUELLE WATER 1.5LT SPKL NAARTJIE (1X1)', price: 17, stock: Math.floor(Math.random() * 21) + 10, barcode: '6009612470281', stockCode: '102311', linkCode: '102311-001', avgCostIncl: 13.6 },
    { id: 102330, name: 'AQUELLE WATER 500ML SPKL LITCHI (1X1)', price: 10, stock: Math.floor(Math.random() * 21) + 10, barcode: '6009612470175', stockCode: '102330', linkCode: '102330-001', avgCostIncl: 8.5 },
    { id: 148555, name: 'AUNT CAROLINE RICE 2KG (1X1)', price: 45, stock: Math.floor(Math.random() * 21) + 10, barcode: '6001231000788', stockCode: '148555', linkCode: '148555-001', avgCostIncl: 37.8 },
    { id: 148561, name: 'AUNTY CAROLINE RICE 10KG', price: 170, stock: Math.floor(Math.random() * 21) + 10, barcode: '6001231000511', stockCode: '148561', linkCode: '', avgCostIncl: 142.8 },
    { id: 102939, name: 'BAKERS CHOC-KITS 200G CHOC (1X1)', price: 38, stock: Math.floor(Math.random() * 21) + 10, barcode: '6001056119009', stockCode: '102939', linkCode: '102939-001', avgCostIncl: 31.16 },
    { id: 102953, name: 'BAKERS EET-SUM-MOR 200G (1X1)', price: 32, stock: Math.floor(Math.random() * 21) + 10, barcode: '6001056201001', stockCode: '102953', linkCode: '102953-001', avgCostIncl: 26.88 },
    { id: 102997, name: 'BAKERS MARIE 200G ORIGINAL (1X1)', price: 20, stock: Math.floor(Math.random() * 21) + 10, barcode: '6001056453004', stockCode: '102997', linkCode: '102997-001', avgCostIncl: 16.4 },
    { id: 103035, name: 'BAKERS RED LABEL 200G LEMON CREAMS (1X1)', price: 24, stock: Math.floor(Math.random() * 21) + 10, barcode: '6001056411004', stockCode: '103035', linkCode: '103035-001', avgCostIncl: 20.64 },
    { id: 103042, name: 'BAKERS ROMANY CRM 200G CLASSIC CHOC (1X1)', price: 38, stock: Math.floor(Math.random() * 21) + 10, barcode: '6001125001877', stockCode: '103042', linkCode: '103042-001', avgCostIncl: 30.4 },
    { id: 103080, name: 'BAKERS TENNIS 200G ORIGINAL (1X1)', price: 27, stock: Math.floor(Math.random() * 21) + 10, barcode: '6001056662000', stockCode: '103080', linkCode: '103080-001', avgCostIncl: 22.95 },
    { id: 103085, name: 'BAKERS TOPPER 125G CHOC MINT (1X1)', price: 12, stock: Math.floor(Math.random() * 21) + 10, barcode: '6009704170136', stockCode: '103085', linkCode: '103085-001', avgCostIncl: 9.84 },
    { id: 103086, name: 'BAKERS TOPPER 125G CHOCO (1X1)', price: 12, stock: Math.floor(Math.random() * 21) + 10, barcode: '6001056412919', stockCode: '103086', linkCode: '103086-001', avgCostIncl: 10.08 },
    { id: 103088, name: 'BAKERS TOPPER 125G CUSTARD (1X1)', price: 12, stock: Math.floor(Math.random() * 21) + 10, barcode: '6001056412940', stockCode: '103088', linkCode: '103088-001', avgCostIncl: 9.6 },
    { id: 103091, name: 'BAKERS TOPPER 125G VANILLA (1X1)', price: 12, stock: Math.floor(Math.random() * 21) + 10, barcode: '6001056412933', stockCode: '103091', linkCode: '103091-001', avgCostIncl: 10.2 },
    { id: 103832, name: 'BENNYS INSTANT SPICE 42\'S CHICKEN (1X1)', price: 3, stock: Math.floor(Math.random() * 21) + 10, barcode: '6009522305734', stockCode: '103832', linkCode: '103832-001', avgCostIncl: 2.52 },
    { id: 104722, name: 'BIOPLUS BOOSTER 10ML ORIGINAL (1X1)', price: 7, stock: Math.floor(Math.random() * 21) + 10, barcode: '6009695584912', stockCode: '104722', linkCode: '104722-001', avgCostIncl: 5.88 },
    { id: 148569, name: 'BLACK SILK RELAXER 225ML (1X1)', price: 60, stock: Math.floor(Math.random() * 21) + 10, barcode: '6001206423628', stockCode: '148569', linkCode: '148569-001', avgCostIncl: 50.4 },
    { id: 148554, name: 'BORN N BREAD IN KZN BROWN BREAD 700G (1X1)', price: 17, stock: Math.floor(Math.random() * 21) + 10, barcode: '6001205730321', stockCode: '148554', linkCode: '148554-001', avgCostIncl: 13.94 },
    { id: 148553, name: 'BORN N BREAD IN KZN WHITE BREAD 700G (1X1)', price: 18, stock: Math.floor(Math.random() * 21) + 10, barcode: '6001205730475', stockCode: '148553', linkCode: '148553-001', avgCostIncl: 15.12 },
    { id: 105988, name: 'BULL BRAND CORNED MEAT 300G (1X1)', price: 32, stock: Math.floor(Math.random() * 21) + 10, barcode: '6001330000146', stockCode: '105988', linkCode: '105988-001', avgCostIncl: 26.88 },
    { id: 106164, name: 'CADBURY BAR 20G LUNCH BAR MINI (1X1)', price: 6, stock: Math.floor(Math.random() * 21) + 10, barcode: '7622202282614', stockCode: '106164', linkCode: '106164-001', avgCostIncl: 4.92 },
    { id: 106257, name: 'CADBURY DAIRY MILK 80G TOP DECK (1X1)', price: 22, stock: Math.floor(Math.random() * 21) + 10, barcode: '6001065601090', stockCode: '106257', linkCode: '106257-001', avgCostIncl: 18.92 },
    { id: 106659, name: 'CAPPY STILL 1.5LT PET B/FAST BLEND (1X1)', price: 38, stock: Math.floor(Math.random() * 21) + 10, barcode: '5449000256041', stockCode: '106659', linkCode: '106659-001', avgCostIncl: 31.54 },
    { id: 106952, name: 'CASA-MIA BISCUITS 5S REAL TEA (1X1)', price: 1, stock: Math.floor(Math.random() * 21) + 10, barcode: '6009645790264', stockCode: '106952', linkCode: '106952-001', avgCostIncl: 0.82 },
    { id: 108079, name: 'CLERE GLYCERINE 50ML PURE BP (1X1)', price: 17, stock: Math.floor(Math.random() * 21) + 10, barcode: '60068088', stockCode: '108079', linkCode: '108079-001', avgCostIncl: 14.28 },
    { id: 108277, name: 'CLORETS C/GUM 52S ELIMINATOR S/FREE (1X1)', price: 45, stock: Math.floor(Math.random() * 21) + 10, barcode: '7622201433499', stockCode: '108277', linkCode: '108277-001', avgCostIncl: 37.8 },
    { id: 108570, name: 'CLOVER MILK 300ML L/LIFE F/CREAM UHT (1X1)', price: 12, stock: Math.floor(Math.random() * 21) + 10, barcode: '6001299024931', stockCode: '108570', linkCode: '108570-001', avgCostIncl: 10.32 },
    { id: 108572, name: 'CLOVER MILK L/LIFE 1LT FULL CREAM (1X1)', price: 20, stock: Math.floor(Math.random() * 21) + 10, barcode: '6001299015274', stockCode: '108572', linkCode: '108572-001', avgCostIncl: 16.8 },
    { id: 108784, name: 'COCA-COLA 1.5LT REGULAR (1X1)', price: 20, stock: Math.floor(Math.random() * 21) + 10, barcode: '5449000000439', stockCode: '108784', linkCode: '108784-001', avgCostIncl: 16.4 },
    { id: 108799, name: 'COCA-COLA 2LT REG (1X1)', price: 26, stock: Math.floor(Math.random() * 21) + 10, barcode: '5449000009067', stockCode: '108799', linkCode: '108799-001', avgCostIncl: 21.84 },
    { id: 108808, name: 'COCA-COLA 300ML PET (1X1)', price: 9, stock: Math.floor(Math.random() * 21) + 10, barcode: '90338052', stockCode: '108808', linkCode: '108808-001', avgCostIncl: 7.38 },
    { id: 108826, name: 'COCA-COLA 500ML CAN REG (1X1)', price: 14, stock: Math.floor(Math.random() * 21) + 10, barcode: '5449000000453', stockCode: '108826', linkCode: '108826-001', avgCostIncl: 11.76 },
    { id: 108925, name: 'COLGATE T/PASTE 100ML REGULAR (1X1)', price: 29, stock: Math.floor(Math.random() * 21) + 10, barcode: '6001067066613', stockCode: '108925', linkCode: '108925-001', avgCostIncl: 24.36 },
    { id: 108937, name: 'COLGATE T/PASTE 50ML REGULAR (1X1)', price: 17, stock: Math.floor(Math.random() * 21) + 10, barcode: '6001067066538', stockCode: '108937', linkCode: '108937-001', avgCostIncl: 14.62 },
    { id: 109089, name: 'COMPRAL TABLETS DISPLAY CARD 2S (1X1)', price: 4, stock: Math.floor(Math.random() * 21) + 10, barcode: '6009695584516', stockCode: '109089', linkCode: '109089-001', avgCostIncl: 3.28 },
    { id: 148576, name: 'COO-EE 1.25LT APPLE (1X1)', price: 12, stock: Math.floor(Math.random() * 21) + 10, barcode: '6009691351174', stockCode: '148576', linkCode: '148576-001', avgCostIncl: 10.08 },
    { id: 148574, name: 'COO-EE 1.25LT COLA (1X1)', price: 12, stock: Math.floor(Math.random() * 21) + 10, barcode: '6009691351204', stockCode: '148574', linkCode: '148574-001', avgCostIncl: 9.84 },
    { id: 148577, name: 'COO-EE 1.25LT IRON BREW (1X1)', price: 12, stock: Math.floor(Math.random() * 21) + 10, barcode: '6009691351136', stockCode: '148577', linkCode: '148577-001', avgCostIncl: 10.32 },
    { id: 148575, name: 'COO-EE 1.25LT PINEAPPLE (1X1)', price: 12, stock: Math.floor(Math.random() * 21) + 10, barcode: '6009691351228', stockCode: '148575', linkCode: '148575-001', avgCostIncl: 9.6 },
    { id: 109120, name: 'COO-EE 2LT APPLE (1X1)', price: 15, stock: Math.floor(Math.random() * 21) + 10, barcode: '6009691350054', stockCode: '109120', linkCode: '109120-001', avgCostIncl: 12.6 },
    { id: 148578, name: 'COO-EE 2LT CRANBERRY (1X1)', price: 15, stock: Math.floor(Math.random() * 21) + 10, barcode: '6009691358180', stockCode: '148578', linkCode: '148578-001', avgCostIncl: 12.3 },
    { id: 109125, name: 'COO-EE 2LT GRANADILLA (1X1)', price: 15, stock: Math.floor(Math.random() * 21) + 10, barcode: '6009691350085', stockCode: '109125', linkCode: '109125-001', avgCostIncl: 12.9 },
    { id: 109127, name: 'COO-EE 2LT IRON BREW (1X1)', price: 15, stock: Math.floor(Math.random() * 21) + 10, barcode: '6009691350115', stockCode: '109127', linkCode: '109127-001', avgCostIncl: 12.45 },
    { id: 148579, name: 'COO-EE 2LT MOCKTAIL (1X1)', price: 15, stock: Math.floor(Math.random() * 21) + 10, barcode: '6009705214372', stockCode: '148579', linkCode: '148579-001', avgCostIncl: 12.75 },
    { id: 109132, name: 'COO-EE 2LT PINEAPPLE (1X1)', price: 15, stock: Math.floor(Math.random() * 21) + 10, barcode: '6009691350092', stockCode: '109132', linkCode: '109132-001', avgCostIncl: 12.15 },
    { id: 109460, name: 'CREMORA COFFEE CREAMER 125G POUCH (1X1)', price: 17, stock: Math.floor(Math.random() * 21) + 10, barcode: '6001308204262', stockCode: '109460', linkCode: '109460-001', avgCostIncl: 14.28 },
    { id: 110925, name: 'DAWN LOTION 200ML ALOE VERA (1X1)', price: 25, stock: Math.floor(Math.random() * 21) + 10, barcode: '6001087012324', stockCode: '110925', linkCode: '110925-001', avgCostIncl: 21 },
    { id: 110937, name: 'DAWN LOTION 400ML [M] ENERGY (1X1)', price: 30, stock: Math.floor(Math.random() * 21) + 10, barcode: '6001087373791', stockCode: '110937', linkCode: '110937-001', avgCostIncl: 24.6 },
    { id: 110941, name: 'DAWN LOTION 400ML ALOE VERA (1X1)', price: 28, stock: Math.floor(Math.random() * 21) + 10, barcode: '6001087012331', stockCode: '110941', linkCode: '110941-001', avgCostIncl: 23.52 },
    { id: 111618, name: 'DETTOL ANTISEPTIC LIQUID 50ML (1X1)',
