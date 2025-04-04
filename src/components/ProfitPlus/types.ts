
import { ServiceItemProps, ServiceSubItem } from './ServiceItem';

export interface ServiceCategoryData {
  title: string;
  items: ServiceItemProps[];
}

export interface IconMap {
  [key: string]: string;
}
