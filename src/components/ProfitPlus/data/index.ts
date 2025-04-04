
import { ServiceCategoryData } from '../types';
import { airtimeElectricity } from './categories/airtimeElectricity';
import { loadsEverything } from './categories/loadsEverything';
import { whatsappSocial } from './categories/whatsappSocial';
import { dataDeals } from './categories/dataDeals';
import { gaming } from './categories/gaming';
import { wifiOthers } from './categories/wifiOthers';
import { billPayments } from './categories/billPayments';
import { moneyTransfer } from './categories/moneyTransfer';

export const serviceCategories: ServiceCategoryData[] = [
  {
    title: "Airtime, Electricity & DStv",
    items: airtimeElectricity
  },
  {
    title: "Loads Everything",
    items: loadsEverything
  },
  {
    title: "WhatsApp & Social Bundles",
    items: whatsappSocial
  },
  {
    title: "Data Deals",
    items: dataDeals
  },
  {
    title: "Gaming",
    items: gaming
  },
  {
    title: "Wifi & Others",
    items: wifiOthers
  },
  {
    title: "Bill Payments",
    items: billPayments
  },
  {
    title: "Money Transfer",
    items: moneyTransfer
  }
];
