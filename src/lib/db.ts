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
    { id: 148571, name: 'ABC STINI AMERICAN BLUE CUBES 25G (1X1)', price: 10, stock: Math.floor(Math.random() * 21) + 10, barcode: '6009605220961', stockCode: '148571', linkCode: '148571-001', avgCostIncl: 0 },
    { id: 100304, name: 'ACE SAMP 1KG (1X1)', price: 24, stock: Math.floor(Math.random() * 21) + 10, barcode: '6001256003108', stockCode: '100304', linkCode: '100304-001', avgCostIncl: 7.18 },
    { id: 101494, name: 'ALWAYS MAXI 8S THICK 3IN1 LONG (1X1)', price: 22, stock: Math.floor(Math.random() * 21) + 10, barcode: '8700216268103', stockCode: '101494', linkCode: '101494-001', avgCostIncl: 0 },
    { id: 148565, name: 'AMANDHLA FOWL FOOD 1KG MIXED (1X1)', price: 15, stock: Math.floor(Math.random() * 21) + 10, barcode: '6007561000214', stockCode: '148565', linkCode: '148565-001', avgCostIncl: 0 },
    { id: 148559, name: 'AMANDHLA YELLOW MAIZE 1KG WHOLE (1X1)', price: 10, stock: Math.floor(Math.random() * 21) + 10, barcode: '6007561000467', stockCode: '148559', linkCode: '148559-001', avgCostIncl: 0 },
    { id: 102309, name: 'AQUELLE WATER 1.5LT SPKL LITCHI (1X1)', price: 17, stock: Math.floor(Math.random() * 21) + 10, barcode: '6009612470298', stockCode: '102309', linkCode: '102309-001', avgCostIncl: 0 },
    { id: 102311, name: 'AQUELLE WATER 1.5LT SPKL NAARTJIE (1X1)', price: 17, stock: Math.floor(Math.random() * 21) + 10, barcode: '6009612470281', stockCode: '102311', linkCode: '102311-001', avgCostIncl: 0 },
    { id: 102330, name: 'AQUELLE WATER 500ML SPKL LITCHI (1X1)', price: 10, stock: Math.floor(Math.random() * 21) + 10, barcode: '6009612470175', stockCode: '102330', linkCode: '102330-001', avgCostIncl: 0 },
    { id: 148555, name: 'AUNT CAROLINE RICE 2KG (1X1)', price: 45, stock: Math.floor(Math.random() * 21) + 10, barcode: '6001231000788', stockCode: '148555', linkCode: '148555-001', avgCostIncl: 0 },
    { id: 148561, name: 'AUNTY CAROLINE RICE 10KG', price: 170, stock: Math.floor(Math.random() * 21) + 10, barcode: '6001231000511', stockCode: '148561', linkCode: '', avgCostIncl: 0 },
    { id: 102939, name: 'BAKERS CHOC-KITS 200G CHOC (1X1)', price: 38, stock: Math.floor(Math.random() * 21) + 10, barcode: '6001056119009', stockCode: '102939', linkCode: '102939-001', avgCostIncl: 0 },
    { id: 102953, name: 'BAKERS EET-SUM-MOR 200G (1X1)', price: 32, stock: Math.floor(Math.random() * 21) + 10, barcode: '6001056201001', stockCode: '102953', linkCode: '102953-001', avgCostIncl: 0 },
    { id: 102997, name: 'BAKERS MARIE 200G ORIGINAL (1X1)', price: 20, stock: Math.floor(Math.random() * 21) + 10, barcode: '6001056453004', stockCode: '102997', linkCode: '102997-001', avgCostIncl: 0 },
    { id: 103035, name: 'BAKERS RED LABEL 200G LEMON CREAMS (1X1)', price: 24, stock: Math.floor(Math.random() * 21) + 10, barcode: '6001056411004', stockCode: '103035', linkCode: '103035-001', avgCostIncl: 0 },
    { id: 103042, name: 'BAKERS ROMANY CRM 200G CLASSIC CHOC (1X1)', price: 38, stock: Math.floor(Math.random() * 21) + 10, barcode: '6001125001877', stockCode: '103042', linkCode: '103042-001', avgCostIncl: 0 },
    { id: 103080, name: 'BAKERS TENNIS 200G ORIGINAL (1X1)', price: 27, stock: Math.floor(Math.random() * 21) + 10, barcode: '6001056662000', stockCode: '103080', linkCode: '103080-001', avgCostIncl: 0 },
    { id: 103085, name: 'BAKERS TOPPER 125G CHOC MINT (1X1)', price: 12, stock: Math.floor(Math.random() * 21) + 10, barcode: '6009704170136', stockCode: '103085', linkCode: '103085-001', avgCostIncl: 0 },
    { id: 103086, name: 'BAKERS TOPPER 125G CHOCO (1X1)', price: 12, stock: Math.floor(Math.random() * 21) + 10, barcode: '6001056412919', stockCode: '103086', linkCode: '103086-001', avgCostIncl: 0 },
    { id: 103088, name: 'BAKERS TOPPER 125G CUSTARD (1X1)', price: 12, stock: Math.floor(Math.random() * 21) + 10, barcode: '6001056412940', stockCode: '103088', linkCode: '103088-001', avgCostIncl: 0 },
    { id: 103091, name: 'BAKERS TOPPER 125G VANILLA (1X1)', price: 12, stock: Math.floor(Math.random() * 21) + 10, barcode: '6001056412933', stockCode: '103091', linkCode: '103091-001', avgCostIncl: 0 },
    { id: 148542, name: 'FUTURELIFE 500G SMART FOOD ZERO CHOCOLATE (1X1)', price: 60, stock: Math.floor(Math.random() * 21) + 10, barcode: '6009710612828', stockCode: '148542', linkCode: '148542-001', avgCostIncl: 0 },
    { id: 148233, name: 'YUM YUM P/BUTTER 250G SMOOTH (1X1)', price: 33, stock: Math.floor(Math.random() * 21) + 10, barcode: '6001069034139', stockCode: '148233', linkCode: '148233-001', avgCostIncl: 0 },
    
    // Additional random products to reach 50-100 items
    { id: 200001, name: 'COCA COLA 330ML CAN (1X1)', price: 12, stock: Math.floor(Math.random() * 21) + 10, barcode: '5449000000446', stockCode: '200001', linkCode: '200001-001', avgCostIncl: 8.50 },
    { id: 200002, name: 'LAYS CHIPS 125G PLAIN (1X1)', price: 18, stock: Math.floor(Math.random() * 21) + 10, barcode: '6009710720677', stockCode: '200002', linkCode: '200002-001', avgCostIncl: 12.30 },
    { id: 200003, name: 'HALLS LOZENGES 15S CHERRY (1X1)', price: 8, stock: Math.floor(Math.random() * 21) + 10, barcode: '7622210031457', stockCode: '200003', linkCode: '200003-001', avgCostIncl: 5.20 },
    { id: 200004, name: 'SUNLIGHT DISHWASHING 500ML (1X1)', price: 25, stock: Math.floor(Math.random() * 21) + 10, barcode: '6001085017574', stockCode: '200004', linkCode: '200004-001', avgCostIncl: 18.75 },
    { id: 200005, name: 'WHITE STAR MAIZE MEAL 2.5KG (1X1)', price: 35, stock: Math.floor(Math.random() * 21) + 10, barcode: '6001205900016', stockCode: '200005', linkCode: '200005-001', avgCostIncl: 22.80 },
    { id: 200006, name: 'NESTLE MAGGI 2MIN NOODLES 73G CHICKEN (1X1)', price: 5, stock: Math.floor(Math.random() * 21) + 10, barcode: '7613035383029', stockCode: '200006', linkCode: '200006-001', avgCostIncl: 3.25 },
    { id: 200007, name: 'ENERGADE 500ML ORANGE (1X1)', price: 16, stock: Math.floor(Math.random() * 21) + 10, barcode: '6009880000473', stockCode: '200007', linkCode: '200007-001', avgCostIncl: 11.20 },
    { id: 200008, name: 'CADBURY DAIRY MILK 80G (1X1)', price: 22, stock: Math.floor(Math.random() * 21) + 10, barcode: '6001065600281', stockCode: '200008', linkCode: '200008-001', avgCostIncl: 15.40 },
    { id: 200009, name: 'ALBANY BREAD 700G BROWN (1X1)', price: 16, stock: Math.floor(Math.random() * 21) + 10, barcode: '6009175305474', stockCode: '200009', linkCode: '200009-001', avgCostIncl: 11.20 },
    { id: 200010, name: 'HANDY ANDY 750ML PINE GEL (1X1)', price: 32, stock: Math.floor(Math.random() * 21) + 10, barcode: '6001087003216', stockCode: '200010', linkCode: '200010-001', avgCostIncl: 23.40 },
    { id: 200011, name: 'ROBERTSONS SPICE 100G CURRY POWDER (1X1)', price: 28, stock: Math.floor(Math.random() * 21) + 10, barcode: '6001038201203', stockCode: '200011', linkCode: '200011-001', avgCostIncl: 19.60 },
    { id: 200012, name: 'CLOVER MILK 1L FULL CREAM FRESH (1X1)', price: 18, stock: Math.floor(Math.random() * 21) + 10, barcode: '6001299015267', stockCode: '200012', linkCode: '200012-001', avgCostIncl: 12.60 },
    { id: 200013, name: 'SUPER M TOILET PAPER 4S 2PLY (1X1)', price: 14, stock: Math.floor(Math.random() * 21) + 10, barcode: '6001070101301', stockCode: '200013', linkCode: '200013-001', avgCostIncl: 9.80 },
    { id: 200014, name: 'KOO PEACHES 410G HALVES (1X1)', price: 21, stock: Math.floor(Math.random() * 21) + 10, barcode: '6001024440036', stockCode: '200014', linkCode: '200014-001', avgCostIncl: 14.70 },
    { id: 200015, name: 'RICOFFY INSTANT COFFEE 200G (1X1)', price: 65, stock: Math.floor(Math.random() * 21) + 10, barcode: '6009188000356', stockCode: '200015', linkCode: '200015-001', avgCostIncl: 45.50 },
    { id: 200016, name: 'SUGAR BEANS 500G PACK (1X1)', price: 18, stock: Math.floor(Math.random() * 21) + 10, barcode: '6007008005444', stockCode: '200016', linkCode: '200016-001', avgCostIncl: 12.60 },
    { id: 200017, name: 'COLGATE TOOTHBRUSH MEDIUM (1X1)', price: 15, stock: Math.floor(Math.random() * 21) + 10, barcode: '6001067062616', stockCode: '200017', linkCode: '200017-001', avgCostIncl: 10.50 },
    { id: 200018, name: 'KIWI BOOT POLISH 50ML BROWN (1X1)', price: 18, stock: Math.floor(Math.random() * 21) + 10, barcode: '6001298960002', stockCode: '200018', linkCode: '200018-001', avgCostIncl: 12.60 },
    { id: 200019, name: 'PEPSODENT TOOTHPASTE 75ML (1X1)', price: 19, stock: Math.floor(Math.random() * 21) + 10, barcode: '8714789939025', stockCode: '200019', linkCode: '200019-001', avgCostIncl: 13.30 },
    { id: 200020, name: 'FANTA ORANGE 2L (1X1)', price: 23, stock: Math.floor(Math.random() * 21) + 10, barcode: '5449000003751', stockCode: '200020', linkCode: '200020-001', avgCostIncl: 16.10 },
    { id: 200021, name: 'EVERYDAY TOILET TISSUE 9S (1X1)', price: 28, stock: Math.floor(Math.random() * 21) + 10, barcode: '6001070102018', stockCode: '200021', linkCode: '200021-001', avgCostIncl: 19.60 },
    { id: 200022, name: 'JUNGLE OATS 1KG (1X1)', price: 45, stock: Math.floor(Math.random() * 21) + 10, barcode: '6009518201965', stockCode: '200022', linkCode: '200022-001', avgCostIncl: 31.50 },
    { id: 200023, name: 'TASTIC RICE 2KG (1X1)', price: 42, stock: Math.floor(Math.random() * 21) + 10, barcode: '6009175305122', stockCode: '200023', linkCode: '200023-001', avgCostIncl: 29.40 },
    { id: 200024, name: 'LIFEBUOY SOAP 175G (1X1)', price: 18, stock: Math.floor(Math.random() * 21) + 10, barcode: '6001087358590', stockCode: '200024', linkCode: '200024-001', avgCostIncl: 12.60 },
    { id: 200025, name: 'MILK POWDER 500G FULL CREAM (1X1)', price: 55, stock: Math.floor(Math.random() * 21) + 10, barcode: '6001299023040', stockCode: '200025', linkCode: '200025-001', avgCostIncl: 38.50 },
    { id: 200026, name: 'RAMA MARGARINE 500G (1X1)', price: 26, stock: Math.floor(Math.random() * 21) + 10, barcode: '6009710390238', stockCode: '200026', linkCode: '200026-001', avgCostIncl: 18.20 },
    { id: 200027, name: 'TENNIS BISCUITS 200G (1X1)', price: 25, stock: Math.floor(Math.random() * 21) + 10, barcode: '6001056662017', stockCode: '200027', linkCode: '200027-001', avgCostIncl: 17.50 },
    { id: 200028, name: 'BEACON JELLY TOTS 40G (1X1)', price: 8, stock: Math.floor(Math.random() * 21) + 10, barcode: '6009546004074', stockCode: '200028', linkCode: '200028-001', avgCostIncl: 5.60 },
    { id: 200029, name: 'SPRAY & COOK 300ML (1X1)', price: 35, stock: Math.floor(Math.random() * 21) + 10, barcode: '6009710713300', stockCode: '200029', linkCode: '200029-001', avgCostIncl: 24.50 },
    { id: 200030, name: 'ALL GOLD TOMATO SAUCE 700ML (1X1)', price: 31, stock: Math.floor(Math.random() * 21) + 10, barcode: '6001024112032', stockCode: '200030', linkCode: '200030-001', avgCostIncl: 21.70 },
    { id: 200031, name: 'SUNFLOWER OIL 750ML (1X1)', price: 28, stock: Math.floor(Math.random() * 21) + 10, barcode: '6009900475608', stockCode: '200031', linkCode: '200031-001', avgCostIncl: 19.60 },
    { id: 200032, name: 'CREAM CRACKERS 200G (1X1)', price: 16, stock: Math.floor(Math.random() * 21) + 10, barcode: '6001056710007', stockCode: '200032', linkCode: '200032-001', avgCostIncl: 11.20 },
    { id: 200033, name: 'NESTLE CONDENSED MILK 385G (1X1)', price: 34, stock: Math.floor(Math.random() * 21) + 10, barcode: '7613035408104', stockCode: '200033', linkCode: '200033-001', avgCostIncl: 23.80 },
    { id: 200034, name: 'COOKING SALT 1KG (1X1)', price: 12, stock: Math.floor(Math.random() * 21) + 10, barcode: '6001610210043', stockCode: '200034', linkCode: '200034-001', avgCostIncl: 8.40 },
    { id: 200035, name: 'BROWN ONIONS 2KG BAG (1X1)', price: 24, stock: Math.floor(Math.random() * 21) + 10, barcode: '2000000000035', stockCode: '200035', linkCode: '200035-001', avgCostIncl: 16.80 },
    { id: 200036, name: 'POTATOES 2KG BAG (1X1)', price: 22, stock: Math.floor(Math.random() * 21) + 10, barcode: '2000000000036', stockCode: '200036', linkCode: '200036-001', avgCostIncl: 15.40 },
    { id: 200037, name: 'CARROTS 1KG PACK (1X1)', price: 18, stock: Math.floor(Math.random() * 21) + 10, barcode: '2000000000037', stockCode: '200037', linkCode: '200037-001', avgCostIncl: 12.60 },
    { id: 200038, name: 'BANANAS PER KG (1X1)', price: 25, stock: Math.floor(Math.random() * 21) + 10, barcode: '2000000000038', stockCode: '200038', linkCode: '200038-001', avgCostIncl: 17.50 },
    { id: 200039, name: 'APPLES RED PER KG (1X1)', price: 35, stock: Math.floor(Math.random() * 21) + 10, barcode: '2000000000039', stockCode: '200039', linkCode: '200039-001', avgCostIncl: 24.50 },
    { id: 200040, name: 'ORANGES PER KG (1X1)', price: 30, stock: Math.floor(Math.random() * 21) + 10, barcode: '2000000000040', stockCode: '200040', linkCode: '200040-001', avgCostIncl: 21.00 },
    { id: 200041, name: 'TOMATOES PER KG (1X1)', price: 28, stock: Math.floor(Math.random() * 21) + 10, barcode: '2000000000041', stockCode: '200041', linkCode: '200041-001', avgCostIncl: 19.60 },
    { id: 200042, name: 'CHICKEN PIECES PER KG (1X1)', price: 65, stock: Math.floor(Math.random() * 21) + 10, barcode: '2000000000042', stockCode: '200042', linkCode: '200042-001', avgCostIncl: 45.50 },
    { id: 200043, name: 'BEEF MINCE PER KG (1X1)', price: 95, stock: Math.floor(Math.random() * 21) + 10, barcode: '2000000000043', stockCode: '200043', linkCode: '200043-001', avgCostIncl: 66.50 },
    { id: 200044, name: 'FISH FINGERS 400G (1X1)', price: 38, stock: Math.floor(Math.random() * 21) + 10, barcode: '6009175305580', stockCode: '200044', linkCode: '200044-001', avgCostIncl: 26.60 },
    { id: 200045, name: 'FROZEN PEAS 1KG (1X1)', price: 32, stock: Math.floor(Math.random() * 21) + 10, barcode: '6009175305597', stockCode: '200045', linkCode: '200045-001', avgCostIncl: 22.40 },
    { id: 200046, name: 'ICE CREAM VANILLA 2L (1X1)', price: 45, stock: Math.floor(Math.random() * 21) + 10, barcode: '6001299030049', stockCode: '200046', linkCode: '200046-001', avgCostIncl: 31.50 },
    { id: 200047, name: 'YOGHURT 1L STRAWBERRY (1X1)', price: 28, stock: Math.floor(Math.random() * 21) + 10, barcode: '6001299020050', stockCode: '200047', linkCode: '200047-001', avgCostIncl: 19.60 },
    { id: 200048, name: 'CHEESE SLICES 200G (1X1)', price: 42, stock: Math.floor(Math.random() * 21) + 10, barcode: '6001299040058', stockCode: '200048', linkCode: '200048-001', avgCostIncl: 29.40 },
    { id: 200049, name: 'EGGS LARGE 18S TRAY (1X1)', price: 55, stock: Math.floor(Math.random() * 21) + 10, barcode: '2000000000049', stockCode: '200049', linkCode: '200049-001', avgCostIncl: 38.50 },
    { id: 200050, name: 'CEREAL CORNFLAKES 500G (1X1)', price: 38, stock: Math.floor(Math.random() * 21) + 10, barcode: '6009518200050', stockCode: '200050', linkCode: '200050-001', avgCostIncl: 26.60 },
    { id: 200051, name: 'WASHING POWDER 2KG (1X1)', price: 65, stock: Math.floor(Math.random() * 21) + 10, barcode: '6001087367998', stockCode: '200051', linkCode: '200051-001', avgCostIncl: 45.50 },
    { id: 200052, name: 'FABRIC SOFTENER 2L (1X1)', price: 42, stock: Math.floor(Math.random() * 21) + 10, barcode: '6001067026211', stockCode: '200052', linkCode: '200052-001', avgCostIncl: 29.40 },
    { id: 200053, name: 'SHAMPOO 400ML (1X1)', price: 35, stock: Math.floor(Math.random() * 21) + 10, barcode: '6001087373807', stockCode: '200053', linkCode: '200053-001', avgCostIncl: 24.50 },
    { id: 200054, name: 'CONDITIONER 400ML (1X1)', price: 35, stock: Math.floor(Math.random() * 21) + 10, barcode: '6001087373814', stockCode: '200054', linkCode: '200054-001', avgCostIncl: 24.50 },
    { id: 200055, name: 'BODY LOTION 400ML (1X1)', price: 45, stock: Math.floor(Math.random() * 21) + 10, barcode: '4005808776276', stockCode: '200055', linkCode: '200055-001', avgCostIncl: 31.50 },
    { id: 200056, name: 'DEODORANT SPRAY 150ML (1X1)', price: 28, stock: Math.floor(Math.random() * 21) + 10, barcode: '42299837', stockCode: '200056', linkCode: '200056-001', avgCostIncl: 19.60 },
    { id: 200057, name: 'RAZOR BLADES 5S PACK (1X1)', price: 22, stock: Math.floor(Math.random() * 21) + 10, barcode: '7702018877591', stockCode: '200057', linkCode: '200057-001', avgCostIncl: 15.40 },
    { id: 200058, name: 'ANTISEPTIC CREAM 25G (1X1)', price: 18, stock: Math.floor(Math.random() * 21) + 10, barcode: '6003001026165', stockCode: '200058', linkCode: '200058-001', avgCostIncl: 12.60 },
    { id: 200059, name: 'PARACETAMOL 20S TABLETS (1X1)', price: 12, stock: Math.floor(Math.random() * 21) + 10, barcode: '6009695585230', stockCode: '200059', linkCode: '200059-001', avgCostIncl: 8.40 },
    { id: 200060, name: 'VITAMIN C 30S TABLETS (1X1)', price: 45, stock: Math.floor(Math.random() * 21) + 10, barcode: '6009900474311', stockCode: '200060', linkCode: '200060-001', avgCostIncl: 31.50 },
    { id: 200061, name: 'MULTIVITAMINS 30S (1X1)', price: 65, stock: Math.floor(Math.random() * 21) + 10, barcode: '6009900474328', stockCode: '200061', linkCode: '200061-001', avgCostIncl: 45.50 },
    { id: 200062, name: 'CANDLES WHITE 12S PACK (1X1)', price: 15, stock: Math.floor(Math.random() * 21) + 10, barcode: '6009621386078', stockCode: '200062', linkCode: '200062-001', avgCostIncl: 10.50 },
    { id: 200063, name: 'MATCHES 10 BOXES (1X1)', price: 8, stock: Math.floor(Math.random() * 21) + 10, barcode: '60069788', stockCode: '200063', linkCode: '200063-001', avgCostIncl: 5.60 },
    { id: 200064, name: 'CIGARETTE LIGHTER (1X1)', price: 12, stock: Math.floor(Math.random() * 21) + 10, barcode: '8901030802997', stockCode: '200064', linkCode: '200064-001', avgCostIncl: 8.40 },
    { id: 200065, name: 'PLASTIC BAGS 100S (1X1)', price: 18, stock: Math.floor(Math.random() * 21) + 10, barcode: '6009621386085', stockCode: '200065', linkCode: '200065-001', avgCostIncl: 12.60 },
    { id: 200066, name: 'FOIL WRAP 30M (1X1)', price: 25, stock: Math.floor(Math.random() * 21) + 10, barcode: '6009621386092', stockCode: '200066', linkCode: '200066-001', avgCostIncl: 17.50 },
    { id: 200067, name: 'CLING WRAP 300M (1X1)', price: 32, stock: Math.floor(Math.random() * 21) + 10, barcode: '6009621386108', stockCode: '200067', linkCode: '200067-001', avgCostIncl: 22.40 },
    { id: 200068, name: 'PAPER PLATES 20S (1X1)', price: 22, stock: Math.floor(Math.random() * 21) + 10, barcode: '6009621386115', stockCode: '200068', linkCode: '200068-001', avgCostIncl: 15.40 },
    { id: 200069, name: 'DISPOSABLE CUPS 50S (1X1)', price: 18, stock: Math.floor(Math.random() * 21) + 10, barcode: '6009621386122', stockCode: '200069', linkCode: '200069-001', avgCostIncl: 12.60 },
    { id: 200070, name: 'BATTERY AA 4S PACK (1X1)', price: 35, stock: Math.floor(Math.random() * 21) + 10, barcode: '6009621386139', stockCode: '200070', linkCode: '200070-001', avgCostIncl: 24.50 },
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
