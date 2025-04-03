
import authService from './services/AuthService';
import inventoryService from './services/InventoryService';
import customerService from './services/CustomerService';
import shiftService from './services/ShiftService';
import transactionService from './services/TransactionService';

// Main database interface that consolidates all services
const db = {
  // Auth methods
  authenticateUser: authService.authenticateUser,

  // Product methods
  getAllProducts: inventoryService.getAllProducts,
  getProduct: inventoryService.getProduct,
  addProduct: inventoryService.addProduct,
  updateProduct: inventoryService.updateProduct,
  deleteProduct: inventoryService.deleteProduct,
  getLowStockProducts: inventoryService.getLowStockProducts,

  // Customer methods
  getAllCustomers: customerService.getAllCustomers,
  getCustomer: customerService.getCustomer,
  getCustomerByPhone: customerService.getCustomerByPhone,
  addCustomer: customerService.addCustomer,
  markCustomerAsPaid: customerService.markCustomerAsPaid,

  // Shift methods
  startShift: shiftService.startShift,
  getCurrentShift: shiftService.getCurrentShift,
  getLastShift: shiftService.getLastShift,
  getLastShiftEndFloat: shiftService.getLastShiftEndFloat,
  endShift: shiftService.endShift,
  getShiftPaymentBreakdown: shiftService.getShiftPaymentBreakdown,
  getShiftRefundBreakdown: shiftService.getShiftRefundBreakdown,
  calculateExpectedCashInDrawer: shiftService.calculateExpectedCashInDrawer,

  // Transaction methods
  createTransaction: transactionService.createTransaction,
  createRefund: transactionService.createRefund,
  getShiftTransactions: transactionService.getShiftTransactions,
  getShiftRefunds: transactionService.getShiftRefunds,
};

export default db;
