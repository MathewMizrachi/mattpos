
export interface ServiceItem {
  id: string;
  name: string;
  imageUrl: string;
  action?: () => void;
}

export interface ServiceCategory {
  id: string;
  name: string;
  items: ServiceItem[];
}

export interface ProfitPlusScreenProps {
  onClose: () => void;
}
