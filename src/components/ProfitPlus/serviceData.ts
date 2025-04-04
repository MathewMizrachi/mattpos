
import { ServiceCategoryData } from './types';

export const serviceCategories: ServiceCategoryData[] = [
  {
    title: "Airtime, Electricity & DStv",
    items: [
      { 
        name: "Airtime any Amount", 
        logo: "A", 
        bgColor: "#00a7e1",
        imageUrl: "/lovable-uploads/ca2b644d-6d7d-46cc-acca-a58673d169fa.png"
      },
      { name: "Easyload Airtime", logo: "🐪", bgColor: "#f7b217" },
      { name: "Easyload Voucher", logo: "🐪", bgColor: "#003870" },
      { name: "Vodacom", logo: "V", bgColor: "#e60000" },
      { name: "MTN", logo: "MTN", bgColor: "#ffcc00" },
      { 
        name: "Cell C", 
        logo: "C", 
        bgColor: "#ee7203",
        imageUrl: "/lovable-uploads/661e86c6-b435-4f2b-a8a1-9b1d1d77b0c6.png"
      },
      { name: "Telkom", logo: "T", bgColor: "#0066b3" },
      { name: "Electricity & Water", logo: "⚡", bgColor: "#00b4d8" },
      { name: "DStv", logo: "DStv", bgColor: "#003870" },
    ]
  },
  {
    title: "Loads Everything",
    items: [
      { 
        name: "Easyload Voucher", 
        logo: "🐪", 
        bgColor: "#003870",
        imageUrl: "/lovable-uploads/dff05d4a-cccf-4a9d-8668-a219c45afc80.png"
      },
      { name: "OTT", logo: "OTT", bgColor: "#a3d45c" },
      { 
        name: "1Voucher", 
        logo: "1", 
        bgColor: "#f26522",
        imageUrl: "/lovable-uploads/2152b640-6b7e-4afa-9f7e-87e4febc9e17.png"
      },
      { 
        name: "Blu Voucher", 
        logo: "Blu", 
        bgColor: "#ffffff",
        imageUrl: "/lovable-uploads/3c103a38-d2b6-49a1-88b2-05bff09ac0f4.png"
      },
    ]
  },
  {
    title: "WhatsApp & Social Bundles",
    items: [
      { 
        name: "Vodacom", 
        logo: "V", 
        bgColor: "#e60000",
        subItems: [{ name: "WhatsApp", icon: "whatsapp" }]
      },
      { 
        name: "MTN", 
        logo: "MTN", 
        bgColor: "#ffcc00",
        subItems: [{ name: "WhatsApp", icon: "whatsapp" }]
      },
      { 
        name: "Cell C", 
        logo: "C", 
        bgColor: "#ee7203",
        imageUrl: "/lovable-uploads/dc05ab2e-c5bd-46dd-b1ff-c6990f7a462b.png",
        subItems: [{ name: "WhatsApp", icon: "whatsapp" }]
      },
      { 
        name: "Telkom", 
        logo: "T", 
        bgColor: "#0066b3",
        subItems: [{ name: "WhatsApp", icon: "whatsapp" }]
      },
    ]
  },
  {
    title: "Data Deals",
    items: [
      { 
        name: "Vodacom", 
        logo: "V", 
        bgColor: "#e60000",
        subItems: [{ name: "Data", icon: "data" }]
      },
      { 
        name: "MTN", 
        logo: "MTN", 
        bgColor: "#ffcc00",
        subItems: [{ name: "Data", icon: "data" }]
      },
      { 
        name: "Cell C", 
        logo: "C", 
        bgColor: "#ee7203",
        imageUrl: "/lovable-uploads/46a08fd5-31d3-422b-8d6d-9ab8b0d16920.png",
        subItems: [{ name: "Data", icon: "data" }]
      },
      { 
        name: "Telkom", 
        logo: "T", 
        bgColor: "#0066b3",
        subItems: [{ name: "Data", icon: "data" }]
      },
    ]
  },
  {
    title: "Gaming",
    items: [
      { 
        name: "Betway", 
        logo: "betway", 
        bgColor: "#00a826",
        imageUrl: "/lovable-uploads/dff05d4a-cccf-4a9d-8668-a219c45afc80.png"
      },
      { name: "Hollywood", logo: "HOLLYWOOD", bgColor: "#6a1b9a" },
      { name: "Easy Bet", logo: "easy bet", bgColor: "#ffd500" },
      { name: "Interbets", logo: "INTER", bgColor: "#ffffff" },
      { name: "Playa", logo: "PLAYA", bgColor: "#ffffff" },
      { name: "LottoStar", logo: "lotto★star", bgColor: "#ffffff" },
      { name: "Fafabet", logo: "Fafabet", bgColor: "#ffffff" },
      { name: "Betmatch", logo: "BETMATCH", bgColor: "#ffffff" },
      { name: "SoccerLine", logo: "SOCCERLINE", bgColor: "#ffffff" },
      { name: "SupaBets", logo: "SUPABETS", bgColor: "#ffffff" },
    ]
  },
  {
    title: "Wifi & Others",
    items: [
      { name: "Ikeja", logo: "ikeja", bgColor: "#e63946" },
      { name: "Too Much Wifi", logo: "TOO MUCH WIFI", bgColor: "#000000" },
      { name: "Talk360", logo: "Talk360", bgColor: "#00b4d8" },
      { name: "Knect", logo: "knect", bgColor: "#2a9d8f" },
    ]
  },
  {
    title: "Bill Payments",
    items: [
      { name: "EasyPay", logo: "easypay", bgColor: "#ffffff" },
    ]
  },
  {
    title: "Money Transfer",
    items: [
      { name: "Mukuru", logo: "mukuru", bgColor: "#f26522" },
      { name: "MomConnect", logo: "👩", bgColor: "#2a9d8f" },
      { name: "EcoCash", logo: "EcoCash", bgColor: "#ffffff" },
    ]
  },
];
