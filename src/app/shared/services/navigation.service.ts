import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

export interface IMenuItem {
	id?: string;
	title?: string;
	description?: string;
	type: string; // Possible values: link/dropDown/extLink
	name?: string; // Used as display text for item and title for separator type
	state?: string; // Router state
	icon?: string; // Material icon name
	tooltip?: string; // Tooltip text
	disabled?: boolean; // If true, item will not be appeared in sidenav.
	sub?: IChildItem[]; // Dropdown items
	badges?: IBadge[];
	active?: boolean;
}
export interface IChildItem {
	id?: string;
	parentId?: string;
	type?: string;
	name: string; // Display text
	state?: string; // Router state
	icon?: string;
	sub?: IChildItem[];
	active?: boolean;
}

interface IBadge {
	color: string; // primary/accent/warn/hex color codes(#fff000)
	value: string; // Display text
}

interface ISidebarState {
	sidenavOpen?: boolean;
	childnavOpen?: boolean;
}

@Injectable({
	providedIn: "root",
})
export class NavigationService {
	public sidebarState: ISidebarState = {
		sidenavOpen: true,
		childnavOpen: false,
	};
	constructor() {
		let defaultPortal: string = localStorage["portal"];

		console.log("default portal is ", defaultPortal);

		if (defaultPortal) {
			this.setUserMenu(defaultPortal);
		}
	}

	taxpayerMenu: IMenuItem[] = [
		{
			name: "Dashboard",
			description: "What do you want to do?",
			type: "dropDown",
			icon: "i-Home1",
			sub: [
				{
					icon: "i-Clock-3",
					name: "Home",
					state: "/taxpayer/home",
					type: "link",
				},
				{ icon: "i-Clock-4", name: "Events", state: "/calendar", type: "link" },

				{
					icon: "i-Clock-4",
					name: "Complete/Edit Profile",
					state: "/taxpayer/complete-profile",
					type: "link",
				},
			],
		},

		{
			name: "Assessment",
			description: "Perform E-Assessment and generate a billing ref",
			type: "dropDown",
			icon: "i-Computer-Secure",
			sub: [
				{
					icon: "i-Clock-3",
					name: "Self Assessment",
					state: "/assessment/perform",
					type: "link",
				},
				{
					icon: "i-Over-Time",
					name: "My Previous Assessments",
					state: "/assessment/history",
					type: "link",
				},
				{
					icon: "i-Clock-3",
					name: "LGC Revenues",
					state: "/assessment/lgc-revenue",
					type: "link",
				},
				{
					icon: "i-Clock-3",
					name: "Previous LGC Revenues",
					state: "/assessment/previous-lgc-revenue",
					type: "link",
				},
				{
					icon: "i-Over-Time",
					name: "Bulk PAYE",
					state: "/assessment/bulk-paye",
					type: "link",
				},
				{
					icon: "i-Over-Time",
					name: "Previous Bulk PAYE",
					state: "/assessment/previous-bulk-paye",
					type: "link",
				},
				{
					icon: "i-Over-Time",
					name: "Road Taxes",
					state: "/assessment/road-tax",
					type: "link",
				},
				{
					icon: "i-Over-Time",
					name: "Bulk Presumptive Tax",
					state: "/assessment/bulk-presumptive-tax",
					type: "link",
				},
				{
					icon: "i-Over-Time",
					name: "Previous Bulk Presumptive Tax",
					state: "/assessment/previous-bulk-presumptive-tax",
					type: "link",
				},

				{
					icon: "i-Clock",
					name: "My Disputed Assessments",
					state: "/assessment/history/-2",
					type: "link",
				},
				{
					icon: "i-Clock",
					name: "PAYE Calculator",
					state: "/assessment/paye_calculator",
					type: "link",
				},
			],
		},
		// {
		// 	name: "Revenue Returns",
		// 	description: "Submit Revenue returns",
		// 	type: "dropDown",
		// 	icon: "i-Computer-Secure",
		// 	sub: [
		// 		{
		// 			icon: "i-Clock-3",
		// 			name: "Individual",
		// 			state: "/revenue-returns/individual",
		// 			type: "link",
		// 		},
		// 		{
		// 			icon: "i-Clock-3",
		// 			name: "Corporate",
		// 			state: "/revenue-returns/corporate",
		// 			type: "link",
		// 		},
		// 	],
		// },

		{
			name: "Payments",
			description: "Make and Review Payments",
			type: "dropDown",
			icon: "i-Credit-Card",
			sub: [
				{
					icon: "i-Clock-3",
					name: "Make Payment",
					state: "/payment/all",
					type: "link",
				},
				{
					icon: "i-Clock-3",
					name: "Make PAYE Payment",
					state: "/payment/bulk-paye-payments",
					type: "link",
				},
				{
					icon: "i-Clock-3",
					name: "Make LGC Revenues Payment",
					state: "/payment/lgc-revenue-payments",
					type: "link",
				},
				{
					icon: "i-Clock-3",
					name: "Previous LGC Revenues",
					state: "/payment/previous-lgc-revenue-payments",
					type: "link",
				},
				{
					icon: "i-Clock-3",
					name: "Make Presumptive Payment",
					state: "/payment/bulk-presumptive-payments",
					type: "link",
				},

				{
					icon: "i-Clock-3",
					name: "Payment History ",
					state: "/payment/payment-history",
					type: "link",
				},
				{
					icon: "i-Clock-3",
					name: "Bulk PAYE Payment History ",
					state: "/payment/bulk-paye-payments-history",
					type: "link",
				},
				{
					icon: "i-Clock-3",
					name: "Bulk PresumptivePayment History ",
					state: "/payment/bulk-presumptive-payments-history",
					type: "link",
				},
			],
		},

		{
			name: "Dispute Resolution",
			description: "Dispute Resolution",
			type: "dropDown",
			icon: "i-Business-ManWoman",
			sub: [
				{
					icon: "i-Clock",
					name: "Disputes",
					state: "/assessment/history/-2",
					type: "link",
				},
			],
		},
	];

	vendorMenu: IMenuItem[] = [
		{
			name: "My Dashboard",
			description: "What do you want to do?",
			type: "dropDown",
			icon: "i-Home1",
			sub: [
				{
					icon: "i-Clock-3",
					name: "Home",
					state: "/taxpayer/home",
					type: "link",
				},
				{ icon: "i-Clock-4", name: "Events", state: "/calendar", type: "link" },
				{
					icon: "i-Clock-4",
					name: "Complete/Edit Profile",
					state: "/taxpayer/complete-profile",
					type: "link",
				},
			],
		},

		{
			name: "Assessment",
			description: "Perform E-Assessment and generate a billing ref",
			type: "dropDown",
			icon: "i-Computer-Secure",
			sub: [
				{
					icon: "i-Clock-3",
					name: "Self Assessment",
					state: "/assessment/perform",
					type: "link",
				},
				{
					icon: "i-Over-Time",
					name: "My Previous Assessments",
					state: "/assessment/history",
					type: "link",
				},
				{
					icon: "i-Over-Time",
					name: "Bulk PAYE",
					state: "/assessment/bulk-paye",
					type: "link",
				},
				{
					icon: "i-Over-Time",
					name: "Previous Bulk PAYE",
					state: "/assessment/previous-bulk-paye",
					type: "link",
				},
				{
					icon: "i-Over-Time",
					name: "Road Taxes",
					state: "/assessment/road-tax",
					type: "link",
				},
				{
					icon: "i-Over-Time",
					name: "Bulk Presumptive Tax",
					state: "/assessment/bulk-presumptive-tax",
					type: "link",
				},
				{
					icon: "i-Over-Time",
					name: "Previous Bulk Presumptive Tax",
					state: "/assessment/previous-bulk-presumptive-tax",
					type: "link",
				},
				{
					icon: "i-Clock",
					name: "My Disputed Assessments",
					state: "/assessment/history/-2",
					type: "link",
				},
				{
					icon: "i-Clock",
					name: "PAYE Calculator",
					state: "/assessment/paye_calculator",
					type: "link",
				},
			],
		},
		{
			name: "Settings",
			description: "Get Test and Live api keys and webhooks",
			type: "dropDown",
			icon: "i-Data-Settings",
			sub: [
				{
					icon: "i-Clock-3",
					name: "Configurations",
					state: "/setup/configurations",
					type: "link",
				},
			],
		},
		{
			name: "My Users",
			description: "Assign user roles and permissions",
			type: "dropDown",
			icon: "i-Add-User",
			sub: [
				{
					icon: "i-Business-ManWoman",
					name: "My Reg. Users",
					state: "/taxpayer/register-vendor",
					type: "link",
				},
			],
		},

		{
			name: "My Payments",
			description: "Make and Review Payments",
			type: "dropDown",
			icon: "i-Credit-Card",
			sub: [
				{
					icon: "i-Clock",
					name: "My Transactions",
					state: "/payment/transactions",
					type: "link",
				},
			],
		},
	];

	superAdminMenu: IMenuItem[] = [
		{
			name: "Dashboard",
			description: "What do you want to do?",
			type: "dropDown",
			icon: "i-Home1",
			sub: [
				{
					icon: "i-Home-4",
					name: "Home",
					state: "/taxpayer/home",
					type: "link",
				},
				// { icon: "i-Calendar-3", name: "Events", state: "/calendar", type: "link" },
				{
					icon: "i-Add-User",
					name: "Register User",
					state: "/taxpayer/register-user",
					type: "link",
				},
			
				{
					icon: "i-Business-ManWoman",
					name: "Register Users Bulk",
					state: "/taxpayer/register-user-bulk",
					type: "link",
				},
				{
					icon: "i-Clock-4",
					name: "Migrate User",
					state: "/taxpayer/migrate-user",
					type: "link",
				},
				{
					icon: "i-Edit",
					name: "Complete/Edit Profile",
					state: "/taxpayer/complete-profile",
					type: "link",
				},
				{
					icon: "i-Business-ManWoman",
					name: "Create Bulk Officers",
					state: "/taxpayer/register-user-bulk",
					type: "link",
				},
				{
					icon: "i-University",
					name: "Revenue Drive Companies",
					state: "/reporting/companies",
					type: "link",
				},
				{
					icon: "i-Building",
					name: "Create Bulk Company",
					state: "/taxpayer/register-Company-bulk",
					type: "link",
				},
			],
		},

		{
			name: "Assessment",
			description: "Perform E-Assessment and generate a billing ref",
			type: "dropDown",
			icon: "i-Computer-Secure",
			sub: [
				{
					icon: "i-Checked-User",
					name: "Self Assessment",
					state: "/assessment/perform",
					type: "link",
				},
				{
					icon: "i-Clock-Back",
					name: "My Previous Assessments",
					state: "/assessment/history",
					type: "link",
				},
				{
					icon: "i-File-Clipboard-File--Text",
					name: "LGC Revenue",
					state: "/assessment/lgc-revenue",
					type: "link",
				},
				{
					icon: "i-Clock-Back",
					name: "Previous LGC Revenues",
					state: "/assessment/previous-lgc-revenue",
					type: "link",
				},
				{
					icon: "i-Money-Bag",
					name: "Bulk PAYE",
					state: "/assessment/bulk-paye",
					type: "link",
				},
				{
					icon: "i-Clock-Back",
					name: "Previous Bulk PAYE",
					state: "/assessment/previous-bulk-paye",
					type: "link",
				},
				{
					icon: "i-Edit",
					name: "Modify Assessment",
					state: "/assessment/modify-assessment",
					type: "link",
				},
				// {
				//   icon: "i-Over-Time",
				//   name: "Motor LA",
				//   state: "/assessment/road-tax",
				//   type: "link",
				// },
				// {
				// 	icon: "i-Car-2",
				// 	name: "Motor License Authority",
				// 	state: "/assessment/motor-license-authority",
				// 	type: "link",
				// },
				// {
				// 	icon: "i-Eye",
				// 	name: "View MLAs",
				// 	state: "/assessment/view-motor-license-authority",
				// 	type: "link",
				// },
				{
					icon: "i-Money-Bag",
					name: "Bulk Presumptive Tax",
					state: "/assessment/bulk-presumptive-tax",
					type: "link",
				},
				{
					icon: "i-Clock-Back",
					name: "Previous Bulk Presumptive Tax",
					state: "/assessment/previous-bulk-presumptive-tax",
					type: "link",
				},
				{
					icon: "i-Clock-Back",
					name: "Previous Revenue Returns Individual",
					state: "/revenue-returns/previous-revenue-returns",
					type: "link",
				},
				{
					icon: "i-Clock-Back",
					name: "Previous Revenue Returns Corporate",
					state: "/revenue-returns/previous-revenue-return-corporate",
					type: "link",
				},
				{
					icon: "i-Broken-Link",
					name: "My Disputed Assessments",
					state: "/assessment/history/-2",
					type: "link",
				},
				{
					icon: "i-Calculator-2",
					name: "PAYE Calculator",
					state: "/assessment/paye_calculator",
					type: "link",
				},
				// {
				//   icon: "i-Letter-Open",
				//   name: "Demand Notices",
				//   state: "/assessment/demand-notices",
				//   type: "link",
				// },
			],
		},

		// {
		// 	name: "Revenue Returns",
		// 	description: "Submit Revenue returns",
		// 	type: "dropDown",
		// 	icon: "i-Money-2",
		// 	sub: [
		// 		{
		// 			icon: "i-Checked-User",
		// 			name: "Individual",
		// 			state: "/revenue-returns/individual",
		// 			type: "link",
		// 		},
		// 		{
		// 			icon: "i-File-Clipboard-File--Text",
		// 			name: "Corporate",
		// 			state: "/revenue-returns/corporate",
		// 			type: "link",
		// 		},
		// 	],
		// },

		{
			name: "Payments",
			description: "Make and Review Payments",
			type: "dropDown",
			icon: "i-Credit-Card",
			sub: [
				{
					icon: "i-Money",
					name: "Make Payment",
					state: "/payment/all",
					type: "link",
				},
				{
					icon: "i-Money1",
					name: "Make PAYE Payment",
					state: "/payment/bulk-paye-payments",
					type: "link",
				},
				{
					icon: "i-Building",
					name: "Make LGC Revenues Payment",
					state: "/payment/lgc-revenue-payments",
					type: "link",
				},
				{
					icon: "i-Clock-Back",
					name: "Previous LGC Revenues",
					state: "/payment/previous-lgc-revenue-payments",
					type: "link",
				},
				{
					icon: "i-Money1",
					name: "Make Presumptive Payment",
					state: "/payment/bulk-presumptive-payments",
					type: "link",
				},
				{
					icon: "i-Time-Window",
					name: "Payment History ",
					state: "/payment/payment-history",
					type: "link",
				},
				{
					icon: "i-Money-2",
					name: "Bulk PAYE Payment History ",
					state: "/payment/bulk-paye-payments-history",
					type: "link",
				},
				{
					icon: "i-Money-Bag",
					name: "Bulk Presumptive Payment History ",
					state: "/payment/bulk-presumptive-payments-history",
					type: "link",
				},
				{
					icon: "i-Management",
					name: "Manage Payment Agents",
					state: "/payment/manage-agents",
					type: "link",
				},
				{
					icon: "i-Wallet",
					name: "My E-Wallet",
					state: "/payment/wallet",
					type: "link",
				},
				{
					icon: "i-Previous",
					name: "TIN History ",
					state: "/payment/tin-history",
					type: "link",
				},
			],
		},

		{
			name: "Intelligence",
			description: "Portal Intelligence Insight & Imports",
			type: "dropDown",
			icon: "i-Pulse",
			sub: [
				{
					icon: "i-Check",
					name: "Analysis",
					state: "/intelligence/analysis",
					type: "link",
				},
				{
					icon: "i-File-Clipboard-File--Text",
					name: "Insight",
					state: "/intelligence/insight",
					type: "link",
				},
				{
					icon: "i-File-Download",
					name: "Import from CAC",
					state: "/intelligence/import/cac",
					type: "link",
				},
				{
					icon: "i-File-Download",
					name: "Import from Yellow Pages",
					state: "/intelligence/import/yellow-pages",
					type: "link",
				},
				{
					icon: "i-File-Download",
					name: "Import from Association",
					state: "/intelligence/import/association",
					type: "link",
				},
				{
					icon: "i-File-Download",
					name: "Import from Plasmida",
					state: "/intelligence/import/plasmida",
					type: "link",
				},
				{
					icon: "i-Download",
					name: "Import from Others",
					state: "/intelligence/import/others",
					type: "link",
				},
			],
		},

		{
			name: "Dispute Resolution",
			description: "Dispute Resolution",
			type: "dropDown",
			icon: "i-Business-ManWoman",
			sub: [
				{
					icon: "i-Angry",
					name: "Disputes",
					state: "/assessment/history/-2",
					type: "link",
				},
			],
		},
		{
			name: "Reporting",
			description: "Platform Data Summaries",
			type: "dropDown",
			icon: "i-Statistic",
			sub: [
				{
					icon: "i-Clock-3",
					name: "Live Dashboard",
					state: "/reporting/reporting",
					type: "link",
				},
				{
					icon: "i-Clock-3",
					name: "PSIRS Breakdown",
					state: "/reporting/psirs-breakdown",
					type: "link",
				},
				{
					icon: "i-Clock-3",
					name: "Other MDAs Breakdown",
					state: "/reporting/other-mda-breakdown",
					type: "link",
				},
				{
					icon: "i-Money1",
					name: "All MDAS",
					state: "/reporting/mdas-breakdown",
					type: "link",
				}
				 
  

				 
			],
		},

		{
			name: "Setup",
			description: "System admin Settings",
			type: "dropDown",
			icon: "i-Data-Settings",
			sub: [
				{
					icon: "i-Building",
					name: "Manage MDAs",
					state: "/setup/mdas",
					type: "link",
				},
				{
					icon: "i-Upload1",
					name: "Bulk Upload MDAs",
					state: "/setup/mda-bulk",
					type: "link",
				},

				 
				{
					icon: "i-Data-Settings",
					name: "Manage Tax Items",
					state: "/setup/fixed_tax_items",
					type: "link",
				},

				{
					icon: "i-Upload1",
					name: "Bulk Upload Rules",
					state: "/setup/rules-bulk",
					type: "link",
				},

				{
					icon: "i-Money1",
					name: "Manage Payment Items ",
					state: "/setup/tax-items",
					type: "link",
				},

				{
					icon: "i-Monitor-2",
					name: "Manage Pending Assessments",
					state: "/setup/previous-assessments",
					type: "link",
				},

				{
					icon: "i-Monitor-3",
					name: "Manage Titles",
					state: "/setup/titles",
					type: "link",
				},
				{
					icon: "i-Monitor-5",
					name: "Manage Occupations",
					state: "/setup/occupations",
					type: "link",
				},
				{
					icon: "i-Monitor-5",
					name: "Manage Business Industries",
					state: "/setup/manage-business-industries",
					type: "link",
				},
			

				{
					icon: "i-Management",
					name: "Manage Employment Status",
					state: "/setup/employment-status",
					type: "link",
				},

				{
					icon: "i-Bisexual",
					name: "Manage Gender",
					state: "/setup/gender",
					type: "link",
				},

				{
					icon: "i-Business-ManWoman",
					name: "Manage Marital Status",
					state: "/setup/marital-status",
					type: "link",
				},
				{
					icon: "i-Stethoscope",
					name: "Set Audit Targets",
					state: "/setup/audit_target",
					type: "link",
				},
			],
		},
		{
			name: "Manage Users",
			description: "Assign user roles and permissions",
			type: "dropDown",
			icon: "i-Add-User",
			sub: [
				{
					icon: "i-Business-ManWoman",
					name: "Users",
					state: "/setup/assign-role",
					type: "link",
				},
				{
					icon: "i-Edit",
					name: "Change User Password",
					state: "/taxpayer/change-user-password",
					type: "link",
				},
			],
		},
		{
			name: "Manage Companies",
			description: "Manage Companies' Profile",
			type: "dropDown",
			icon: "i-File-Clipboard-File--Text",
			sub: [
				{
					icon: "i-Building",
					name: "Companies",
					state: "/setup/companies",
					type: "link",
				},
				{
					icon: "i-Add-Window",
					name: "Register Company",
					state: "/taxpayer/register-company",
					type: "link",
				},
				{
					icon: "i-Download",
					name: "Migrate Company",
					state: "/taxpayer/migrate-company",
					type: "link",
				},
			],
		},
		{
			name: "TCC",
			description: "Make and Review Payments",
			type: "dropDown",
			icon: "i-Credit-Card",
			sub: [
				{
					icon: "i-Book",
					name: "Generate TCC Form",
					state: "/tcc/generate",
					type: "link",
				},
				{
					icon: "i-Previous",
					name: "Previous TCC",
					state: "/tcc/previous-tcc",
					type: "link",
				},
			],
		},
		{
			name: "Risk-Based Audit",
			description: "Risk-Based Audit",
			type: "dropDown",
			icon: "i-Magnifi-Glass-",
			sub: [
				{
					icon: "i-Magnifi-Glass-",
					name: "Risk-Based Audit",
					state: "/risk-based-audit/rba",
					type: "link",
				},
				{
					icon: "i-Blinklist",
					name: "Audited List",
					state: "/risk-based-audit/audited-list",
					type: "link",
				},
			],
		},
		{
			name: "Audit",
			description: "Audit Portal Activities",
			type: "dropDown",
			icon: "i-Stethoscope",
			sub: [
				{
					icon: "i-File-Clipboard-File--Text",
					name: "User Activities",
					state: "/audit/activities",
					type: "link",
				},
			],
		},
	];

	mdaAdminMenu: IMenuItem[] = [
		{
			name: "Dashboard",
			description: "What do you want to do?",
			type: "dropDown",
			icon: "i-Home2",
			sub: [
				{
					icon: "i-Clock-3",
					name: "Home",
					state: "/taxpayer/home",
					type: "link",
				},
				{ icon: "i-Clock-4", name: "Events", state: "/calendar", type: "link" },
				{
					icon: "i-Clock-4",
					name: "Register User",
					state: "/taxpayer/register-user",
					type: "link",
				},
				{
					icon: "i-Business-ManWoman",
					name: "Register Users Bulk",
					state: "/taxpayer/register-user-bulk",
					type: "link",
				},
				{
					icon: "i-Clock-4",
					name: "Migrate User",
					state: "/taxpayer/migrate-user",
					type: "link",
				},
				{
					icon: "i-Clock-3",
					name: "Migrate Company",
					state: "/taxpayer/migrate-company",
					type: "link",
				},
				{
					icon: "i-Clock-4",
					name: "Complete/Edit Profile",
					state: "/taxpayer/complete-profile",
					type: "link",
				},
				{
					icon: "i-Business-ManWoman",
					name: "Create Bulk Officers",
					state: "/taxpayer/register-user-bulk",
					type: "link",
				},

				{
					icon: "i-Business-ManWoman",
					name: "Create Bulk Company",
					state: "/taxpayer/register-Company-bulk",
					type: "link",
				},
			],
		},

		{
			name: "Assessment",
			description: "Perform E-Assessment and generate a billing ref",
			type: "dropDown",
			icon: "i-Computer-Secure",
			sub: [
				{
					icon: "i-Clock-3",
					name: "Self Assessment",
					state: "/assessment/perform",
					type: "link",
				},
				{
					icon: "i-Over-Time",
					name: "My Previous Assessments",
					state: "/assessment/history",
					type: "link",
				},
				{
					icon: "i-Over-Time",
					name: "Bulk PAYE",
					state: "/assessment/bulk-paye",
					type: "link",
				},
				{
					icon: "i-Over-Time",
					name: "Previous Bulk PAYE",
					state: "/assessment/previous-bulk-paye",
					type: "link",
				},
				{
					icon: "i-Over-Time",
					name: "Modify Assessment",
					state: "/assessment/modify-assessment",
					type: "link",
				},
				{
					icon: "i-Clock-3",
					name: "LGC Revenues",
					state: "/assessment/lgc-revenue",
					type: "link",
				},
				{
					icon: "i-Clock-3",
					name: "Previous LGC Revenues",
					state: "/assessment/previous-lgc-revenue",
					type: "link",
				},
				{
					icon: "i-Over-Time",
					name: "Bulk Presumptive Tax",
					state: "/assessment/bulk-presumptive-tax",
					type: "link",
				},

				{
					icon: "i-Over-Time",
					name: "Previous Bulk Presumptive Tax",
					state: "/assessment/previous-bulk-presumptive-tax",
					type: "link",
				},
				{
					icon: "i-Over-Time",
					name: "Road Taxes",
					state: "/assessment/road-tax",
					type: "link",
				},
				{
					icon: "i-Clock",
					name: "My Disputed Assessments",
					state: "/assessment/history/-2",
					type: "link",
				},
				{
					icon: "i-Clock",
					name: "PAYE Calculator",
					state: "/assessment/paye_calculator",
					type: "link",
				},
			],
		},
		{
			name: "Setup",
			description: "System admin Settings",
			type: "dropDown",
			icon: "i-Data-Settings",
			sub: [
				{
					icon: "i-Clock-3",
					name: "Setup Fixed Tax Items",
					state: "/setup/fixed_tax_items",
					type: "link",
				},
			],
		},

		// {
		// 	name: "Revenue Returns",
		// 	description: "Submit Revenue returns",
		// 	type: "dropDown",
		// 	icon: "i-Computer-Secure",
		// 	sub: [
		// 		{
		// 			icon: "i-Clock-3",
		// 			name: "Individual",
		// 			state: "/revenue-returns/individual",
		// 			type: "link",
		// 		},
		// 		{
		// 			icon: "i-Clock-3",
		// 			name: "Corporate",
		// 			state: "/revenue-returns/corporate",
		// 			type: "link",
		// 		},
		// 	],
		// },
		{
			name: "Payments",
			description: "Make and Review Payments",
			type: "dropDown",
			icon: "i-Credit-Card",
			sub: [
				{
					icon: "i-Clock-3",
					name: "Make Payment",
					state: "/payment/all",
					type: "link",
				},
				{
					icon: "i-Clock-3",
					name: "Make PAYE Payment",
					state: "/payment/bulk-paye-payments",
					type: "link",
				},
				{
					icon: "i-Clock-3",
					name: "Make LGC Revenues Payment",
					state: "/payment/lgc-revenue-payments",
					type: "link",
				},
				{
					icon: "i-Clock-3",
					name: "Previous LGC Revenues",
					state: "/payment/previous-lgc-revenue-payments",
					type: "link",
				},
				{
					icon: "i-Clock-3",
					name: "Make Presumptive Payment",
					state: "/payment/bulk-presumptive-payments",
					type: "link",
				},
				{
					icon: "i-Clock-3",
					name: "Payment History ",
					state: "/payment/payment-history",
					type: "link",
				},
				{
					icon: "i-Clock-3",
					name: "Bulk PAYE  Payment History ",
					state: "/payment/bulk-paye-payments-history",
					type: "link",
				},
				{
					icon: "i-Clock-3",
					name: "Bulk Presumptive History ",
					state: "/payment/bulk-presumptive-payments-history",
					type: "link",
				},

				{
					icon: "i-Over-Time",
					name: "E-Wallet",
					state: "/payment/wallet",
					type: "link",
				},
				{
					icon: "i-Clock-3",
					name: "TIN History ",
					state: "/payment/tin-history",
					type: "link",
				},
			],
		},
		{
			name: "Intelligence",
			description: "Portal Intelligence Insight & Imports",
			type: "dropDown",
			icon: "i-File-Clipboard-File--Text",
			sub: [
				{
					icon: "i-File-Clipboard-File--Text",
					name: "Insight",
					state: "/intelligence/insight",
					type: "link",
				},
				{
					icon: "i-File-Clipboard-File--Text",
					name: "Import from CAC",
					state: "/intelligence/import/cac",
					type: "link",
				},
				{
					icon: "i-File-Clipboard-File--Text",
					name: "Import from Yellow Pages",
					state: "/intelligence/import/yellow-pages",
					type: "link",
				},
				{
					icon: "i-File-Clipboard-File--Text",
					name: "Import from Association",
					state: "/intelligence/import/association",
					type: "link",
				},
				{
					icon: "i-File-Clipboard-File--Text",
					name: "Import from Plasmida",
					state: "/intelligence/import/plasmida",
					type: "link",
				},
			],
		},
		{
			name: "TCC",
			description: "Make and Review Payments",
			type: "dropDown",
			icon: "i-Credit-Card",
			sub: [
				{
					icon: "i-Clock-3",
					name: "Generate TCC Form",
					state: "/tcc/generate",
					type: "link",
				},
				{
					icon: "i-Clock-3",
					name: "Previous TCC",
					state: "/tcc/previous-tcc",
					type: "link",
				},
			],
		},
		{
			name: "Dispute Resolution",
			description: "Dispute Resolution",
			type: "dropDown",
			icon: "i-Business-ManWoman",
			sub: [
				{
					icon: "i-Clock",
					name: "Disputes",
					state: "/assessment/history/-2",
					type: "link",
				},
			],
		},
		{
			name: "Manage Users",
			description: "Assign user roles and permissions",
			type: "dropDown",
			icon: "i-Add-User",
			sub: [
				{
					icon: "i-Business-ManWoman",
					name: "Users",
					state: "/setup/assign-role",
					type: "link",
				},
				{
					icon: "i-Edit",
					name: "Change User Password",
					state: "/taxpayer/change-user-password",
					type: "link",
				},
			],
		},
		{
			name: "Dispute Resolution",
			description: "Dispute Resolution",
			type: "dropDown",
			icon: "i-Business-ManWoman",
			sub: [
				{
					icon: "i-Clock",
					name: "Disputes",
					state: "/assessment/history/-2",
					type: "link",
				},
			],
		},
		{
			name: "Reporting",
			description: "Reporting ",
			type: "dropDown",
			icon: "i-Business-ManWoman",
			sub: [
				{
					icon: "i-Clock-3",
					name: "Live Dashboard",
					state: "/reporting/reporting",
					type: "link",
				},
				{
					icon: "i-Clock-3",
					name: "PSIRS Breakdown",
					state: "/reporting/psirs-breakdown",
					type: "link",
				},
				{
					icon: "i-Clock-3",
					name: "Other MDAs Breakdown",
					state: "/reporting/other-mda-breakdown",
					type: "link",
				},
				{
					icon: "i-Money1",
					name: "All MDAS",
					state: "/reporting/mdas-breakdown",
					type: "link",
				},
			],
		},
		{
			name: "Manage Companies",
			description: "Manage Companies' Profile",
			type: "dropDown",
			icon: "i-File-Clipboard-File--Text",
			sub: [
				{
					icon: "i-File-Clipboard-File--Text",
					name: "Companies",
					state: "/setup/companies",
					type: "link",
				},
				{
					icon: "i-Clock-3",
					name: "Register Company",
					state: "/taxpayer/register-company",
					type: "link",
				},
				{
					icon: "i-Clock-3",
					name: "Migrate Company",
					state: "/taxpayer/migrate-company",
					type: "link",
				},
			],
		},
		{
			name: "Risk-Based Audit",
			description: "Risk-Based Audit",
			type: "dropDown",
			icon: "i-Business-ManWoman",
			sub: [
				{
					icon: "i-Clock",
					name: "Risk-Based Audit",
					state: "/risk-based-audit/rba",
					type: "link",
				},
				{
					icon: "i-Clock",
					name: "Audited List",
					state: "/risk-based-audit/audited-list",
					type: "link",
				},
			],
		},
	];

	demandNoticeMenu: IMenuItem[] = [
		{
			name: "Dashboard",
			description: "What do you want to do?",
			type: "dropDown",
			icon: "i-Home1",
			sub: [
				{
					icon: "i-Clock-3",
					name: "Home",
					state: "/taxpayer/home",
					type: "link",
				},
				{ icon: "i-Clock-4", name: "Events", state: "/calendar", type: "link" },

				{
					icon: "i-Clock-4",
					name: "Complete/Edit Profile",
					state: "/taxpayer/complete-profile",
					type: "link",
				},
			],
		},

		{
			name: "Assessment",
			description: "Perform E-Assessment and generate a billing ref",
			type: "dropDown",
			icon: "i-Computer-Secure",
			sub: [
				{
					icon: "i-Clock-3",
					name: "Self Assessment",
					state: "/assessment/perform",
					type: "link",
				},
				{
					icon: "i-Over-Time",
					name: "My Previous Assessments",
					state: "/assessment/history",
					type: "link",
				},
				{
					icon: "i-Over-Time",
					name: "Bulk PAYE",
					state: "/assessment/bulk-paye",
					type: "link",
				},
				{
					icon: "i-Over-Time",
					name: "Previous Bulk PAYE",
					state: "/assessment/previous-bulk-paye",
					type: "link",
				},
				{
					icon: "i-Over-Time",
					name: "Road Taxes",
					state: "/assessment/road-tax",
					type: "link",
				},
				{
					icon: "i-Over-Time",
					name: "Bulk Presumptive Tax",
					state: "/assessment/bulk-presumptive-tax",
					type: "link",
				},

				{
					icon: "i-Over-Time",
					name: "Previous Bulk Presumptive Tax",
					state: "/assessment/previous-bulk-presumptive-tax",
					type: "link",
				},
				{
					icon: "i-Clock",
					name: "My Disputed Assessments",
					state: "/assessment/history/-2",
					type: "link",
				},
				{
					icon: "i-Letter-Open",
					name: "Demand Notices",
					state: "/assessment/demand-notices",
					type: "link",
				},
				{
					icon: "i-Letter-Open",
					name: "Bulk Demand Notices",
					state: "/assessment/demand-notices/bulk",
					type: "link",
				},
				{
					icon: "i-Clock",
					name: "PAYE Calculator",
					state: "/assessment/paye_calculator",
					type: "link",
				},
			],
		},

		{
			name: "Payments",
			description: "Make and Review Payments",
			type: "dropDown",
			icon: "i-Credit-Card",
			sub: [
				{
					icon: "i-Clock-3",
					name: "Make Payment",
					state: "/payment/all",
					type: "link",
				},
				{
					icon: "i-Clock-3",
					name: "Make PAYE Payment",
					state: "/payment/bulk-paye-payments",
					type: "link",
				},
				{
					icon: "i-Clock-3",
					name: "Make Presumptive Payment",
					state: "/payment/bulk-presumptive-payments",
					type: "link",
				},
				{
					icon: "i-Over-Time",
					name: "E-Wallet",
					state: "/payment/wallet",
					type: "link",
				},
				{
					icon: "i-Clock",
					name: "My Transactions",
					state: "/payment/transactions",
					type: "link",
				},
				{
					icon: "i-Clock-3",
					name: "Payment History ",
					state: "/payment/payment-history",
					type: "link",
				},
				{
					icon: "i-Clock-3",
					name: "TIN History ",
					state: "/payment/tin-history",
					type: "link",
				},
			],
		},
		{
			name: "Dispute Resolution",
			description: "Dispute Resolution",
			type: "dropDown",
			icon: "i-Business-ManWoman",
			sub: [
				{
					icon: "i-Clock",
					name: "Disputes",
					state: "/assessment/history/-2",
					type: "link",
				},
			],
		},
		{
			name: "Reporting",
			description: "Reporting",
			type: "dropDown",
			icon: "i-Business-ManWoman",
			sub: [
			 
				{
					icon: "i-Clock-3",
					name: "Live Dashboard",
					state: "/reporting/reporting",
					type: "link",
				},
				{
					icon: "i-Clock-3",
					name: "PSIRS Breakdown",
					state: "/reporting/psirs-breakdown",
					type: "link",
				},
				{
					icon: "i-Clock-3",
					name: "Other MDAs Breakdown",
					state: "/reporting/other-mda-breakdown",
					type: "link",
				},
				{
					icon: "i-Money1",
					name: "All MDAS",
					state: "/reporting/mdas-breakdown",
					type: "link",
				},
			],
		},

		{
			name: "Dispute Resolution",
			description: "Dispute Resolution",
			type: "dropDown",
			icon: "i-Business-ManWoman",
			sub: [
				{
					icon: "i-Clock",
					name: "Disputes",
					state: "/assessment/history/-2",
					type: "link",
				},
			],
		},
	];

	reportingMenu: IMenuItem[] = [
		{
			name: "Dashboard",
			description: "What do you want to do?",
			type: "dropDown",
			icon: "i-Home1",
			sub: [
				{
					icon: "i-Clock-3",
					name: "Home",
					state: "/taxpayer/home",
					type: "link",
				},
				{
					icon: "i-Clock-4",
					name: "Complete/Edit Profile",
					state: "/taxpayer/complete-profile",
					type: "link",
				},
			],
		},

		{
			name: "Assessments",
			description: "Perform E-Assessment and generate a billing ref",
			type: "dropDown",
			icon: "i-Computer-Secure",
			sub: [
				{
					icon: "i-Over-Time",
					name: "Assessments",
					state: "/assessment/history",
					type: "link",
				},
			],
		},
		{
			name: "Payments",
			description: "Make and Review Payments",
			type: "dropDown",
			icon: "i-Credit-Card",
			sub: [
				{
					icon: "i-Clock-3",
					name: "Payment History ",
					state: "/payment/payment-history",
					type: "link",
				},
			],
		},
		{
			name: "Manage Officers",
			description: "Lis of Officers",
			type: "dropDown",
			icon: "i-Add-User",
			sub: [
				{
					icon: "i-Business-ManWoman",
					name: "Users",
					state: "/setup/assign-role",
					type: "link",
				},
				{
					icon: "i-Business-ManWoman",
					name: "Create Bulk Officers",
					state: "/taxpayer/register-user-bulk",
					type: "link",
				},
			],
		},
		{
			name: "Manage Company",
			description: "Lis of Officers",
			type: "dropDown",
			icon: "i-Home1",
			sub: [
				{
					icon: "i-Business-ManWoman",
					name: "Revenue Drive Companies",
					state: "/setup/companies",
					type: "link",
				},
				{
					icon: "i-Business-ManWoman",
					name: "Create Bulk Company",
					state: "/taxpayer/register-Company-bulk",
					type: "link",
				},
			],
		},
	];

	accountsOfficerMenu: IMenuItem[] = [
		{
			name: "Dashboard",
			description: "What do you want to do?",
			type: "dropDown",
			icon: "i-Home1",
			sub: [
				{
					icon: "i-Clock-3",
					name: "Home",
					state: "/taxpayer/home",
					type: "link",
				},
				{
					icon: "i-Clock-4",
					name: "Complete/Edit Profile",
					state: "/taxpayer/complete-profile",
					type: "link",
				},
			],
		},
	];

	menuItems = new BehaviorSubject<IMenuItem[]>([]);
	// navigation component has subscribed to this Observable
	menuItems$ = this.menuItems.asObservable();

	// sets iconMenu as default;
	setUserMenu(userType: string) {
		switch (userType) {
			case "taxPayer":
				this.menuItems.next(this.taxpayerMenu);
				break;
			case "admin":
				this.menuItems.next(this.superAdminMenu);
				break;
			case "vendor":
				this.menuItems.next(this.vendorMenu);
				break;
			case "mdaAdmin":
				this.menuItems.next(this.mdaAdminMenu);
				break;
			case "demand-notice":
				this.menuItems.next(this.demandNoticeMenu);
				break;
			case "reporting":
				this.menuItems.next(this.reportingMenu);
				break;
			case "accountsOfficer":
				this.menuItems.next(this.accountsOfficerMenu);
				break;
		}
	}
}
