import { display } from 'html2canvas/dist/types/css/property-descriptors/display';
import { BusinessCategory, IBusiness, IBusinessType } from '../types';

export const BusinessCategories: IBusiness[] = [
  {
    type: BusinessCategory.MICRO,
    description: 'Micro (1-2 employees)',
  },
  {
    type: BusinessCategory.SMALL,
    description: 'Small (2-10 employees)',
  },
  {
    type: BusinessCategory.MEDIUM,
    description: 'Medium (10 employees and above)',
  },
];

export const BusinessTypes: IBusinessType[] = [
  {
    key: 1,
    description: 'Boutiques and other cloth sellers- Adult and Children wear',
    taxes: {
      [BusinessCategory.MICRO]: 2500,
      [BusinessCategory.SMALL]: 25000,
      [BusinessCategory.MEDIUM]: 50000
    }
  },
  { 
    key: 2,
    description: 'Fabricating, Welding, Bench Milling, Black Smith, Gold Smith',
    taxes: {
      [BusinessCategory.MICRO]: 2500,
      [BusinessCategory.SMALL]: 15000,
      [BusinessCategory.MEDIUM]: 30000
    }
  },
  { 
    key: 3,
    description: 'Confectioneries and Bakeries',
    taxes: {
      [BusinessCategory.MICRO]: 2500,
      [BusinessCategory.SMALL]: 30000,
      [BusinessCategory.MEDIUM]: 50000
    }
  },
  { 
    key: 4,
    description: 'Barbers and Hair Dressing Saloon',
    taxes: {
      [BusinessCategory.MICRO]: 2500,
      [BusinessCategory.SMALL]: 12000,
      [BusinessCategory.MEDIUM]: 25000
    }
  },
  {
    key: 5,
    description: 'Service Providers - Business Centres and Typing Studio, Printers, Thrift Collector, Video Clubs, Car Wash and Owners, Casino Operators, Cyber Café Operators',
    taxes: {
      [BusinessCategory.MICRO]: 2500,
      [BusinessCategory.SMALL]: 15000,
      [BusinessCategory.MEDIUM]: 50000
    }
  },
  { 
    key: 6,
    description: 'Video Clubs, Car Wash and Owners, Casino Operators, Cyber Café Operators',
    taxes: {
      [BusinessCategory.MICRO]: 5000,
      [BusinessCategory.SMALL]: 25000,
      [BusinessCategory.MEDIUM]: 50000
    }
  },
  { 
    key: 7,
    description: 'Drama Group, Laundries, Dry Cleaners, Commercial Mobile Calls',
    taxes: {
      [BusinessCategory.MICRO]: 2500,
      [BusinessCategory.SMALL]: 15000,
      [BusinessCategory.MEDIUM]: 50000
    }
  },
  {
    key: 8,
    description: 'Photographers/Photo Developers, Recreational Centre, Refuse, Rentals, Travel Agency',
    taxes: {
      [BusinessCategory.MICRO]: 2500,
      [BusinessCategory.SMALL]: 20000,
      [BusinessCategory.MEDIUM]: 50000
    }
  },
  {
    key: 9,
    description: 'Artisans - Masons, Vulcanizers, Iron Benders, Carpenters, Cobblers, Painters and Decorators, Plumbers',
    taxes: {
      [BusinessCategory.MICRO]: 2500,
      [BusinessCategory.SMALL]: 15000,
      [BusinessCategory.MEDIUM]: 50000
    }
  },
  { 
    key: 10,
    description: 'Petrol, Kerosene and Lubricant Sellers',
    taxes: {
      [BusinessCategory.MICRO]: 2500,
      [BusinessCategory.SMALL]: 30000,
      [BusinessCategory.MEDIUM]: 85000
    }
  },
  { 
    key: 11,
    description: 'Tailoring, Interior Decoration, Fashion  Designers and Garment Makers, Curtain Makers, Seamstress',
    taxes: {
      [BusinessCategory.MICRO]: 2500,
      [BusinessCategory.SMALL]: 15000,
      [BusinessCategory.MEDIUM]: 50000
    }
  },
  { 
    key: 12,
    description: 'Transport Workers- Taxi, Bus, lorry, etc.',
    taxes: {
      [BusinessCategory.MICRO]: 2500,
      [BusinessCategory.SMALL]: 12000,
      [BusinessCategory.MEDIUM]: 50000
    }
  },
  { 
    key: 13,
    description: 'General Trading/Enterprises- Retail and Wholesale, Raw Food',
    taxes: {
      [BusinessCategory.MICRO]: 2500,
      [BusinessCategory.SMALL]: 10000,
      [BusinessCategory.MEDIUM]: 50000
    }
  },
  { 
    key: 14,
    description: 'Bookshops/Stationery Stores, Building Materials, Cement, Cooking  Gas, Air-conditioners, Mattress/Foams, Doors, Electrical Parts and Fittings.',
    taxes: {
      [BusinessCategory.MICRO]: 2500,
      [BusinessCategory.SMALL]: 20000,
      [BusinessCategory.MEDIUM]: 50000
    }
  },
  { 
    key: 15,
    description: 'Furniture/Furnishing Material, Gas Refilling, General Contractor, General Merchants and Distributors. Gift Shop, Spare Parts, Patent Medicine, Photographic Materials, Plank, Plastic Rubbers, Plumbing Materials, Poultry Feeds, Raw Food, Rugs and Carpets, Sewing Machine.',
    taxes: {
      [BusinessCategory.MICRO]: 2500,
      [BusinessCategory.SMALL]: 20000,
      [BusinessCategory.MEDIUM]: 50000
    }
  },
  { 
    key: 16,
    description: 'Spare Parts, Patent Medicine, Photographic Materials, Plank, Plastic Rubbers.',
    taxes: {
      [BusinessCategory.MICRO]: 2500,
      [BusinessCategory.SMALL]: 15000,
      [BusinessCategory.MEDIUM]: 50000
    }
  },
  { 
    key: 17,
    description: 'Plumbing Materials, Poultry Feeds, Raw Food, Rugs andCarpets, Sewing Machine.',
    taxes: {
      [BusinessCategory.MICRO]: 2500,
      [BusinessCategory.SMALL]: 15000,
      [BusinessCategory.MEDIUM]: 50000
    }
  },
  { 
    key: 18,
    description: 'Timber Dealers, Tire, Wine and Beer License Operators, Yoghurt.',
    taxes: {
      [BusinessCategory.MICRO]: 2500,
      [BusinessCategory.SMALL]: 15000,
      [BusinessCategory.MEDIUM]: 50000
    }
  },
  { 
    key: 19,
    description: 'Financial Services - Bureau De Change, Pool Agents and Promoters, Money Lenders.',
    taxes: {
      [BusinessCategory.MICRO]: 10000,
      [BusinessCategory.SMALL]: 50000,
      [BusinessCategory.MEDIUM]: 100000
    }
  },
  { 
    key: 20,
    description: 'Furniture and Cabinet Makers.',
    taxes: {
      [BusinessCategory.MICRO]: 2500,
      [BusinessCategory.SMALL]: 35000,
      [BusinessCategory.MEDIUM]: 100000
    }
  },
  { 
    key: 21,
    description: 'Restaurant and Food Sellers.',
    taxes: {
      [BusinessCategory.MICRO]: 2500,
      [BusinessCategory.SMALL]: 35000,
      [BusinessCategory.MEDIUM]: 100000
    }
  },
  { 
    key: 22,
    description: 'Property-Guesthouse, Lodging, face to Face Building with not more than ten (10) rooms.',
    taxes: {
      [BusinessCategory.MICRO]: 2500,
      [BusinessCategory.SMALL]: 50000,
      [BusinessCategory.MEDIUM]: 90000
    }
  },
  {
    key: 23,
    description: 'Mechanics, Technicians, Electricians, Panel Beaters, Motorcycle, Bicycle, Keke NAPEP, Clock and Watch Repairers, and other Machine Repairers, Re-wires, Battery Chargers.',
    taxes: {
      [BusinessCategory.MICRO]: 2500,
      [BusinessCategory.SMALL]: 15000,
      [BusinessCategory.MEDIUM]: 50000
    }
  },
  { 
    key: 24,
    description: 'Artisans, Design and Sign Writers, Hand Craft Makers Graphic, Arts.',
    taxes: {
      [BusinessCategory.MICRO]: 2500,
      [BusinessCategory.SMALL]: 12000,
      [BusinessCategory.MEDIUM]: 90000
    }
  },
  {
    key: 25,
    description: 'Professional Services - Opticians, Photo lab, Auctioneers. Draughtsman, Maternity Owners, Patent Medicine Store.',
    taxes: {
      [BusinessCategory.MICRO]: 2500,
      [BusinessCategory.SMALL]: 30000,
      [BusinessCategory.MEDIUM]: 85000
    }
  },
  {
    key: 26,
    description: 'Entertainment Service, Musicians.',
    taxes: {
      [BusinessCategory.MICRO]: 10000,
      [BusinessCategory.SMALL]: 15000,
      [BusinessCategory.MEDIUM]: 50000
    }
  },
  { 
    key: 27,
    description: 'Agriculture, Forestry, Fishing, Hunting, Butchers/Meat Sellers, Horticulture/Florist, Farm Settlers, Poultry, Piggery.',
    taxes: {
      [BusinessCategory.MICRO]: 2500,
      [BusinessCategory.SMALL]: 15000,
      [BusinessCategory.MEDIUM]: 50000
    }
  },
  {
    key: 28,
    description: 'Aluminum Fabrication and Products.',
    taxes: {
      [BusinessCategory.MICRO]: 2500,
      [BusinessCategory.SMALL]: 30000,
      [BusinessCategory.MEDIUM]: 75000
    }
  },
  {
    key: 29,
    description: 'Processors, Producers and Manufacturers - Blocks, Culvert. Well Ring, Pure Water, Welders, Shoe Makers, Cold Rooms, Palm Oil Miller, Grind Mills, Saw mill Proprietors.',
    taxes: {
      [BusinessCategory.MICRO]: 2500,
      [BusinessCategory.SMALL]: 25000,
      [BusinessCategory.MEDIUM]: 100000
    }
  },
  {
    key: 30,
    description: 'Transport Owners.',
    taxes: {
      [BusinessCategory.MICRO]: 2500,
      [BusinessCategory.SMALL]: 30000,
      [BusinessCategory.MEDIUM]: 85000
    }
  },
  {
    key: 31,
    description: 'All other trades/services covered by the Law but not listed above.',
    taxes: {
      [BusinessCategory.MICRO]: 2500,
      [BusinessCategory.SMALL]: 30000,
      [BusinessCategory.MEDIUM]: 100000
    }
  }
];

