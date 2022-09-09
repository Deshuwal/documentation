import { BusinessCategory, LGCCategory, LGCRevenueHeadCategory } from "./enums";

export interface IBusiness {
	type: BusinessCategory;
	description: string;
}

export interface IBusinessType {
	key: number;
	description: string;
	taxes: Record<BusinessCategory, number>;
}

export interface ILGC {
	type: LGCCategory;
	description: string;
}

export interface ILGCType {
	key: number;
	description: string;
	taxes: Record<LGCCategory, number>;
}

export interface ILGRevenueHeadC {
	key: number;
	type: LGCRevenueHeadCategory;
	description: string;
}
