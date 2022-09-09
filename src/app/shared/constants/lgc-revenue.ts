import { display } from "html2canvas/dist/types/css/property-descriptors/display";
import { LGCRevenueHeadCategory, ILGRevenueHeadC } from "../types";

export const RevenueHead: ILGRevenueHeadC[] = [
	{
		key: 10,

		type: LGCRevenueHeadCategory.BICYCLE_RATE,
		description: "BICYCLE, TRUCK, CANOE, WHEELBARROW AND CART FEES",
	},
	{
		key: 12,

		type: LGCRevenueHeadCategory.CATTLE_LEVY,
		description: "CATTLE LEVY",
	},
	{
		key: 15,

		type: LGCRevenueHeadCategory.CONVENIENCE,
		description:
			"PUBLIC CONVENIENCE, SEWAGE AND REFUSE DISPOSAL FEES AND BATHING HOUSE LICENSE",
	},
	{
		key: 7,

		type: LGCRevenueHeadCategory.CUSTOMARY_RITE,
		description: "CUSTOMARY RIGHT OF OCCUPANCY ",
	},
	{
		key: 11,

		type: LGCRevenueHeadCategory.DOMESTIC_ANIMAL,
		description: "DOMESTIC ANIMAL LICENSE FEES ",
	},
	{
		key: 5,

		type: LGCRevenueHeadCategory.FOOD_RATE,
		description:
			"FOOD LICENSES PERMIT (FOR RESTAURANTS, BAKERIES AND OTHER PLACE WHERE FOOD IS SOLD",
	},
	{
		key: 8,

		type: LGCRevenueHeadCategory.MARKET,
		description: "MARKET RATES &LEVIES ",
	},
	{
		key: 6,

		type: LGCRevenueHeadCategory.MARRIAGE_RATE,
		description: "MARRIAGE, BIRTH AND DEATH REGISTRATION FEES",
	},
	{
		key: 4,

		type: LGCRevenueHeadCategory.MERRIMENT_RATE,
		description: "MERRIMENT AND ROAD CLOSURE LEVIES",
	},
	{
		key: 9,

		type: LGCRevenueHeadCategory.MOTOR_PARK,
		description: "MOTOR PARK LEVIES",
	},

	{
		key: 13,

		type: LGCRevenueHeadCategory.RELIGIOUS_PERMIT,
		description: "RELIGIOUS PLACES ESTABLISHMENT PERMIT FEES",
	},
	{
		key: 1,

		type: LGCRevenueHeadCategory.SHOP_RATE,
		description: "SHOP RATE ",
	},

	{
		key: 14,

		type: LGCRevenueHeadCategory.SIGN_BORAD,
		description: "SIGN BOARD (SIGNAGE) AND ADVERT PERMIT FEES",
	},
	{
		key: 3,

		type: LGCRevenueHeadCategory.SLAUGHTER_RATE,
		description: "SLAUGHTER SLAB FEE",
	},
	{
		key: 2,

		type: LGCRevenueHeadCategory.TENEMENT_RATE,
		description: "TENEMENT RATES/GROUND RENT PRIVATE AND COMMERCIAL PROPERTY",
	},
];
export const RevenueHeadSUB: any[] = [
	{
		key: 1,
		taxes: [
			{
				REVENUE_HEAD: "Shops - Large  (10sqm and above) ",
				type: {
					urban: "15000.00",
					semi: "10500.00",
					rural: "7500.00",
				},
			},
			{
				REVENUE_HEAD: "Shops - Medium  (6sqm - 9.99sqm) ",
				type: {
					urban: "7500.00",
					semi: "5250.00",
					rural: "3750.00",
				},
			},
			{
				REVENUE_HEAD: "Shops Small  (5.99sqm and below) ",
				type: {
					urban: "5000.00",
					semi: "3500.00",
					rural: "2500.00",
				},
			},
			{
				REVENUE_HEAD: "Kiosk Rate ",
				type: {
					urban: "5000.00",
					semi: "3500.00",
					rural: "2500.00",
				},
			},
			{
				REVENUE_HEAD: "Container/Temporary Shop ",
				type: {
					urban: "5000.00",
					semi: "3500.00",
					rural: "2500.00",
				},
			},
			{
				REVENUE_HEAD:
					"Workshop Permit for Artisans (Carpenters, Mechanic, Vulcanizers) ",
				type: {
					urban: "5000.00 ",
					semi: "3500.00 ",
					rural: "2500.00 ",
				},
			},
		],
	},
	{
		key: 2,
		taxes: [
			{
				REVENUE_HEAD: "Private - Big ",
				type: {
					urban: "10000.00",
					semi: "7000.00",
					rural: "5000.00",
				},
			},
			{
				REVENUE_HEAD: "Private -  Medium   ",
				type: {
					urban: "7500.00",
					semi: "5250.00",
					rural: "3750.00",
				},
			},
			{
				REVENUE_HEAD: "Private -  Small   ",
				type: {
					urban: "5000.00",
					semi: "3500.00",
					rural: "2500.00",
				},
			},
			{
				REVENUE_HEAD: "Commercial - Big ",
				type: {
					urban: "500000.00",
					semi: "350000.00",
					rural: "250000.00",
				},
			},
			{
				REVENUE_HEAD: "Commercial - Medium   ",
				type: {
					urban: "300000.00",
					semi: "210000.00",
					rural: "150000.00",
				},
			},
			{
				REVENUE_HEAD: "Commercial - Small   ",
				type: {
					urban: "150000.00",
					semi: "105000.00",
					rural: "75000.00",
				},
			},
		],
	},
	{
		key: 3,
		taxes: [
			{
				REVENUE_HEAD: "Abattoir License Fees ",
				type: {
					urban: "3000.00",
					semi: "2100.00 ",
					rural: "1500.00 ",
				},
			},
			{
				REVENUE_HEAD: "Cow/Camel Slaughter Per Head ",
				type: { urban: "500", semi: "350.00 ", rural: "250.00 " },
			},
			{
				REVENUE_HEAD: "Goat/Sheep Slaughter Per Head ",
				type: { urban: "200", semi: "140.00 ", rural: "100.00 " },
			},
		],
	},
	{
		key: 4,
		taxes: [
			{
				REVENUE_HEAD: "Entertainment Fees ",
				type: {
					urban: "5000.00",
					semi: "3500.00",
					rural: "2500.00",
				},
			},
			{
				REVENUE_HEAD: "Noise Control ",
				type: {
					urban: "5000.00",
					semi: "3500.00",
					rural: "2500.00",
				},
			},
		],
	},
	{
		key: 5,
		taxes: [
			{
				REVENUE_HEAD: "Large   ",
				type: {
					urban: "20000.00",
					semi: "14000.00",
					rural: "10000.00",
				},
			},
			{
				REVENUE_HEAD: "Renewal Fee ",
				type: {
					urban: "10000.00",
					semi: "7000.00",
					rural: "5000.00",
				},
			},
			{
				REVENUE_HEAD: "Medium ",
				type: {
					urban: "15000.00",
					semi: "10500.00",
					rural: "7500.00",
				},
			},
			{
				REVENUE_HEAD: "Renewal Fee ",
				type: {
					urban: "5000.00",
					semi: "3500.00",
					rural: "2500.00",
				},
			},
			{
				REVENUE_HEAD: "Small ",
				type: {
					urban: "10000.00",
					semi: "7000.00",
					rural: "5000.00",
				},
			},
			{
				REVENUE_HEAD: "Renewal Fee",
				type: {
					urban: "2000.00",
					semi: "1400.00",
					rural: "1000.00",
				},
			},
		],
	},
	{
		key: 6,
		taxes: [
			{
				REVENUE_HEAD: "Marriage Registration Fees  ",
				type: {
					urban: "5000",
					semi: "3500.00 ",
					rural: "2500.00 ",
				},
			},
			{
				REVENUE_HEAD: "Customary Marriage Fees ",
				type: {
					urban: "5000",
					semi: "3500.00 ",
					rural: "2500.00 ",
				},
			},
			{
				REVENUE_HEAD: "Marriage Certificates Fees ",
				type: {
					urban: "5000",
					semi: "3500.00 ",
					rural: "2500.00 ",
				},
			},
			{
				REVENUE_HEAD: "Birth Registration Fees  ",
				type: { urban: "1000", semi: "700.00 ", rural: "500.00 " },
			},
			{
				REVENUE_HEAD: "Death Registration Certification Fees ",
				type: { urban: "500", semi: "350.00 ", rural: "250.00 " },
			},
			{
				REVENUE_HEAD: "Indigene Letter ",
				type: { urban: "500", semi: "350.00 ", rural: "250.00 " },
			},
		],
	},
	{
		key: 7,
		taxes: [
			{
				REVENUE_HEAD: "Commercial ",
				type: {
					urban: "20000.00",
					semi: "14000.00",
					rural: "10000.00",
				},
			},
			{
				REVENUE_HEAD: "Residential ",
				type: {
					urban: "15000.00",
					semi: "10500.00",
					rural: "7500.00",
				},
			},
		],
	},

	{
		key: 8,
		taxes: [
			{
				REVENUE_HEAD: "Permanent Stalls (Per annum) ",
				type: {
					urban: "15000.00",
					semi: "10500.00",
					rural: "7500.00",
				},
			},
			{
				REVENUE_HEAD: "Block Stalls and Lock - up Shops (Per annum) ",
				type: {
					urban: "30000.00",
					semi: "21000.00",
					rural: "15000.00",
				},
			},
			{
				REVENUE_HEAD: "Seasonal Markets (Per bag/Heap by  ",
				type: { urban: "100", semi: "100", rural: "100 " },
			},
			{
				REVENUE_HEAD: "Market Hawkers (daily)  ",
				type: { urban: "50", semi: "50", rural: "50" },
			},
			{
				REVENUE_HEAD: "Market Hawkers (weekly)  ",
				type: { urban: "50", semi: "50", rural: "50" },
			},
		],
	},
	{
		key: 9,
		taxes: [
			{
				REVENUE_HEAD:
					"Entrance Fees (Gate): Trucks, Lorries, Tankers, Buses, Pick Up Vans, Center  ",
				type: { urban: "300", semi: "300", rural: " 300" },
			},
			{
				REVENUE_HEAD: "Loading Fees(per trip) ",
				type: {
					urban: "6000.00",
					semi: "6000.00 ",
					rural: "6000.00 ",
				},
			},
			{
				REVENUE_HEAD: "Tricycle ",
				type: { urban: "100", semi: "100", rural: "100 " },
			},
			{
				REVENUE_HEAD: "Motorcycle ",
				type: { urban: "50", semi: "50 ", rural: "50 " },
			},
			{
				REVENUE_HEAD: "J5 & P/UP ",
				type: { urban: "1500.00", semi: "1500", rural: "1500.00 " },
			},
		],
	},
	{
		key: 10,
		taxes: [
			{
				REVENUE_HEAD: "Bicycle License ",
				type: { urban: "300", semi: "300 ", rural: "300 " },
			},
			{
				REVENUE_HEAD: "Canoe License ",
				type: { urban: "500", semi: "500 ", rural: "500 " },
			},
			{
				REVENUE_HEAD: "Wheelbarrow/Cart Fee ",
				type: { urban: "300", semi: "300", rural: "300 " },
			},
		],
	},
	{
		key: 11,
		taxes: [
			{
				REVENUE_HEAD: "Dog License ",
				type: { urban: "500", semi: "500 ", rural: "500 " },
			},
			{
				REVENUE_HEAD: "Loading Fee ",
				type: { urban: "6000.00", semi: "6000", rural: " 6000" },
			},
		],
	},
	{
		key: 12,
		taxes: [
			{
				REVENUE_HEAD: "Cow/Cattle (Jangali) ",
				type: { urban: "100", semi: "100", rural: " 100" },
			},
			{
				REVENUE_HEAD: " (Kara) ",
				type: { urban: "500" },
			},
			{
				REVENUE_HEAD: "Goat/Sheet (Jangali) ",
				type: { urban: "50", semi: "50 ", rural: "50 " },
			},
			{
				REVENUE_HEAD: " (Kara) ",
				type: { urban: "300", semi: "300 ", rural: "300 " },
			},
			{
				REVENUE_HEAD: "Others(Jangali) ",
				type: { urban: "300", semi: "300 ", rural: "300" },
			},
			{
				REVENUE_HEAD: " (Kara) ",
				type: { urban: "50", semi: "50 ", rural: "50 " },
			},
			{
				REVENUE_HEAD: "Impounding/Dislodging of Animals Fine ",
				type: { urban: "5000.00", semi: "5000 ", rural: "5000 " },
			},
		],
	},
	{
		key: 13,
		taxes: [
			{
				REVENUE_HEAD: "Establishment of Religious Centers Fees  ",
				type: {
					urban: "10000.00",
					semi: "7000.00",
					rural: "5000.00 ",
				},
			},
		],
	},
	{
		key: 14,
		taxes: [
			{
				REVENUE_HEAD: "Mobile Sale Promotion Fees ",
				type: {
					urban: "1000.00",
					semi: "700.00 ",
					rural: "500.00 ",
				},
			},
			{
				REVENUE_HEAD: "Directional Signboard Fees ",
				type: {
					urban: "2000.00",
					semi: "1400.00 ",
					rural: "1000.00 ",
				},
			},
			{
				REVENUE_HEAD: "Electric Design Advert Per Face ",
				type: {
					urban: "5000.00",
					semi: "3500.00",
					rural: "2500.00 ",
				},
			},
			{
				REVENUE_HEAD: "Wall Print Advert Per Side Fee ",
				type: {
					urban: "4000.00",
					semi: "2800.00 ",
					rural: "2000.00 ",
				},
			},
			{
				REVENUE_HEAD: "Billboards Unipoles/Eye ",
				type: {
					urban: "150000.00",
					semi: "105000.00 ",
					rural: "75000.00 ",
				},
			},
			{
				REVENUE_HEAD: "Market Road Show Permit ",
				type: {
					urban: "10000.00",
					semi: "7000.00 ",
					rural: "5000.00 ",
				},
			},
			{
				REVENUE_HEAD: "Digital Boards ",
				type: {
					urban: "10000.00",
					semi: "7000.00 ",
					rural: "5000.00 ",
				},
			},
		],
	},
	{
		key: 15,
		taxes: [
			{
				REVENUE_HEAD: "Registration of Septic Tanks Operators (Annually) ",
				type: {
					urban: "5000.00",
					semi: "3500.00 ",
					rural: "2500.00 ",
				},
			},
			{
				REVENUE_HEAD: "Refuse Disposal (Residential) ",
				type: {
					urban: "3000.00",
					semi: "2,100.00 ",
					rural: "1500.00 ",
				},
			},
			{
				REVENUE_HEAD: "Refuse Disposal (Commercial) ",
				type: {
					urban: "5000.00",
					semi: "3500.00 ",
					rural: "2500.00 ",
				},
			},

			{
				REVENUE_HEAD: "Naming of Streets ",
				type: {
					urban: "100000.00",
					semi: "70000.00 ",
					rural: "50000.00 ",
				},
			},
			{
				REVENUE_HEAD: " Renewal after two years ",
				type: { urban: "10000", semi: "7000", rural: "5000" },
			},
			{
				REVENUE_HEAD: "Wrong Parking Charges/Towing of Vehicle Fees ",
				type: {
					urban: "5000.00",
					semi: "3500.00 ",
					rural: "2500.00 ",
				},
			},
			{
				REVENUE_HEAD:
					"Forestry Per Tree all LGC Exploitation/Trimming of Trees ",
				type: { urban: "500", semi: "500 ", rural: " 500" },
			},
			{
				REVENUE_HEAD: "Off & On Liquor License Fee ",
				type: {
					urban: "10000.00",
					semi: "7500.00",
					rural: "5000.00",
				},
			},
			{
				REVENUE_HEAD: "Radio and Television License Fee ",
				type: { urban: "1000.00", semi: "700", rural: "500" },
			},
			{
				REVENUE_HEAD: "Vehicle/Equipment Hiring Service Per Day ",
				type: { urban: "25000.00", semi: "25000 ", rural: "25000 " },
			},
		],
	},
];
