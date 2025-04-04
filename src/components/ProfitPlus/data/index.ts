
import { ServiceCategory } from '../types';
import { airtimeElectricityItems } from './categories/airtimeElectricity';
import { loadsEverythingItems } from './categories/loadsEverything';
import { whatsappSocialItems } from './categories/whatsappSocial';
import { dataDealsItems } from './categories/dataDeals';
import { gamingItems } from './categories/gaming';
import { wifiOthersItems } from './categories/wifiOthers';
import { billPaymentsItems } from './categories/billPayments';
import { moneyTransferItems } from './categories/moneyTransfer';

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'airtime-electricity',
    name: 'Airtime, Electricity & DStv',
    items: airtimeElectricityItems,
  },
  {
    id: 'loads-everything',
    name: 'Loads Everything',
    items: loadsEverythingItems,
  },
  {
    id: 'whatsapp-social',
    name: 'WhatsApp & Social Bundles',
    items: whatsappSocialItems,
  },
  {
    id: 'data-deals',
    name: 'Data Deals',
    items: dataDealsItems,
  },
  {
    id: 'gaming',
    name: 'Gaming',
    items: gamingItems,
  },
  {
    id: 'wifi-others',
    name: 'Wifi & Others',
    items: wifiOthersItems,
  },
  {
    id: 'bill-payments',
    name: 'Bill Payments',
    items: billPaymentsItems,
  },
  {
    id: 'money-transfer',
    name: 'Money Transfer',
    items: moneyTransferItems,
  },
];
