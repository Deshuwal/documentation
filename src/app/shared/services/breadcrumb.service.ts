import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

export enum BreadCrumbItemType {
	link = "LINK",
	text = "TEXT",
}

export enum UserRoleEnum {
	admin = "Super Admin",
	taxPayer = "Taxpayer",
	mdaAdmin = "MDA Admin",
	vendor = "Vendor",
	demanNotice = "Demand Notice",
	reporting = "Reporting",
}

export interface IBreadCrumbData {
	title?: string | undefined;
	role: UserRoleEnum | undefined;
	module?: IBreadCrumbItem;
	page?: IBreadCrumbItem;
}

export interface IBreadCrumbItem {
	type?: BreadCrumbItemType;
	title?: string;
	name?: string;
	state?: string;
	active?: boolean;
}

@Injectable({
	providedIn: "root",
})
export class BreadcrumbService {
	private crumbData: Record<string, IBreadCrumbData> = {
		dashboardHome: {
			role: UserRoleEnum.taxPayer,
			module: {
				type: BreadCrumbItemType.text,
				name: "Dashboard",
				state: "/taxpayer/home",
				active: false,
			},
			page: {
				type: BreadCrumbItemType.text,
				name: "Home",
				state: "/taxpayer/home",
				active: true,
			},
		},
		dashboardRegisterUser: {
			role: UserRoleEnum.admin,
			module: {
				type: BreadCrumbItemType.link,
				name: "Dashboard",
				state: "/taxpayer/home",
				active: false,
			},
			page: {
				type: BreadCrumbItemType.text,
				title: "Create User",
				name: "Register User",
				state: "/taxpayer/register-user",
				active: true,
			},
		},
		dashboardMigrateUser: {
			role: UserRoleEnum.admin,
			module: {
				type: BreadCrumbItemType.link,
				name: "Dashboard",
				state: "/taxpayer/home",
				active: false,
			},
			page: {
				type: BreadCrumbItemType.text,
				title: "Migrate User",
				name: "Migrate User",
				state: "/taxpayer/migrate-user",
				active: true,
			},
		},
		dashboardRegisterOfficerBulk: {
			role: UserRoleEnum.reporting,
			module: {
				type: BreadCrumbItemType.link,
				name: "Manage Officers",
				state: "/taxpayer/assign-role",
				active: false,
			},
			page: {
				type: BreadCrumbItemType.text,
				title: "Create Bulk Officer",
				name: "Register Bulk Officer",
				state: "/taxpayer/register-users-bulk",
				active: true,
			},
		},
		dashboardRegisterCompanyBulk: {
			role: UserRoleEnum.reporting,
			module: {
				type: BreadCrumbItemType.link,
				name: "Manage Company",
				state: "/setup/assign-role",
				active: false,
			},
			page: {
				type: BreadCrumbItemType.text,
				title: "Create Bulk Company",
				name: "Register Bulk Company",
				state: "/taxpayer/register-Company-bulk",
				active: true,
			},
		},
		dashboardRegisterCompany: {
			role: UserRoleEnum.reporting,
			module: {
				type: BreadCrumbItemType.link,
				name: "Manage Company",
				state: "/setup/companies",
				active: false,
			},
			page: {
				type: BreadCrumbItemType.text,
				title: "Register a Company",
				name: "Register a Company",
				state: "/taxpayer/register-Company-bulk",
				active: true,
			},
		},
		dashboardMigrateCompany: {
			role: UserRoleEnum.reporting,
			module: {
				type: BreadCrumbItemType.link,
				name: "Migrate Company",
				state: "/setup/migrate-company",
				active: false,
			},
			page: {
				type: BreadCrumbItemType.text,
				title: "Migrate Company",
				name: "Migrate a Company",
				state: "/setup/migrate-company",
				active: true,
			},
		},
		dashboardRegisterUserBulk: {
			role: UserRoleEnum.admin,
			module: {
				type: BreadCrumbItemType.link,
				name: "Manage Users",
				state: "/setup/assign-role",
				active: false,
			},
			page: {
				type: BreadCrumbItemType.text,
				title: "Create Bulk User",
				name: "Register Bulk User",
				state: "/taxpayer/register-users-bulk",
				active: true,
			},
		},
		fixedTaxItems: {
			role: UserRoleEnum.admin,
			module: {
				type: BreadCrumbItemType.link,
				name: "Manage Tax Items",
				state: "/setup/assign-role",
				active: false,
			},
			page: {
				type: BreadCrumbItemType.text,
				title: "Manage Tax Items",
				name: "Fixed Tax Item",
				state: "/taxpayer/register-users-bulk",
				active: true,
			},
		},
		lgcrevenues: {
			role: UserRoleEnum.admin,
			module: {
				type: BreadCrumbItemType.link,
				name: "LGC Revenue",
				state: "/assessments/lgc-revenue",
				active: false,
			},
			page: {
				type: BreadCrumbItemType.text,
				title: "LGC Revenue",
				name: "LGC Revenue",
				state: "/assessments/lgc-revenue",
				active: true,
			},
		},
		previouslgcrevenues: {
			role: UserRoleEnum.admin,
			module: {
				type: BreadCrumbItemType.link,
				name: "Previous LGC Revenue",
				state: "/assessments/lgc-revenue",
				active: false,
			},
			page: {
				type: BreadCrumbItemType.text,
				title: "Previous LGC Revenue",
				name: "Previous LGC Revenue",
				state: "/assessments/lgc-revenue",
				active: true,
			},
		},
		dashboardRegisterVendor: {
			role: UserRoleEnum.taxPayer,
			module: {
				type: BreadCrumbItemType.link,
				name: "Dashboard",
				state: "/taxpayer/home",
				active: false,
			},
			page: {
				type: BreadCrumbItemType.text,
				title: "Create Vendor",
				state: "/taxpayer/register-vendor",
				active: true,
			},
		},
		dashboardCompleteProfile: {
			role: UserRoleEnum.taxPayer,
			module: {
				type: BreadCrumbItemType.link,
				name: "Dashboard",
				state: "/taxpayer/home",
				active: false,
			},
			page: {
				type: BreadCrumbItemType.text,
				name: "Complete/Edit Profile",
				state: "/taxpayer/complete-profile",
				active: true,
			},
		},

		dashboardUpdateUser: {
			role: UserRoleEnum.taxPayer,
			module: {
				type: BreadCrumbItemType.link,
				name: "Dashboard",
				state: "/taxpayer/home",
				active: false,
			},
			page: {
				type: BreadCrumbItemType.text,
				title: "Update User Profile ",
				name: "Update User",
				state: "/taxpayer/update-user/:id",
				active: true,
			},
		},
		dashboardPreviewUser: {
			role: UserRoleEnum.taxPayer,
			module: {
				type: BreadCrumbItemType.link,
				name: "Dashboard",
				state: "/taxpayer/home",
				active: false,
			},
			page: {
				type: BreadCrumbItemType.text,
				title: "Preview User Profile ",
				name: "Preview User",
				state: "/taxpayer/preview-user/:id",
				active: true,
			},
		},
		manageCalendar: {
			role: UserRoleEnum.taxPayer,
			module: {
				type: BreadCrumbItemType.link,
				name: "Calendar",
				state: "/calendar",
				active: false,
			},
			page: {
				type: BreadCrumbItemType.text,
				title: "Calendar",
				name: "Manage Calendar",
				state: "/calendar",
				active: true,
			},
		},
		performAssessment: {
			role: UserRoleEnum.taxPayer,
			module: {
				type: BreadCrumbItemType.text,
				name: "Assessment",
				state: "/assessment/perform",
				active: false,
			},
			page: {
				type: BreadCrumbItemType.text,
				name: "Perform Assessment",
				state: "/assessment/perform",
				active: true,
			},
		},
		entertainmentTax: {
			role: UserRoleEnum.taxPayer,
			module: {
				type: BreadCrumbItemType.link,
				name: "Assessment",
				state: "/assessment/perform",
				active: false,
			},
			page: {
				type: BreadCrumbItemType.text,
				name: "Entertainment  Tax",
				state: "/assessment/entertainment-tax",
				active: true,
			},
		},
		consumptionTax: {
			role: UserRoleEnum.taxPayer,
			module: {
				type: BreadCrumbItemType.link,
				name: "Assessment",
				state: "/assessment/perform",
				active: false,
			},
			page: {
				type: BreadCrumbItemType.text,
				name: "Consumption  Tax",
				state: "/assessment/consumption-tax",
				active: true,
			},
		},
		personalIncomeTax: {
			role: UserRoleEnum.taxPayer,
			module: {
				type: BreadCrumbItemType.link,
				name: "Assessment",
				state: "/assessment/perform",
				active: false,
			},
			page: {
				type: BreadCrumbItemType.text,
				name: "Personal Income (Presumptive) Tax",
				state: "/assessment/personal-income-tax",
				active: true,
			},
		},
		revenueReturnTax: {
			role: UserRoleEnum.taxPayer,
			module: {
				type: BreadCrumbItemType.link,
				name: "Individual",
				state: "/revenue-returns/individual",
				active: false,
			},
			page: {
				type: BreadCrumbItemType.text,
				name: "Revenue Returns",
				state: "/revenue-returns/individual",
				active: true,
			},
		},

		presumptiveTax: {
			role: UserRoleEnum.taxPayer,
			module: {
				type: BreadCrumbItemType.link,
				name: "Assessment",
				state: "/assessment/perform",
				active: false,
			},
			page: {
				type: BreadCrumbItemType.text,
				name: "Presumptive Tax",
				state: "/assessment/personal-income-tax",
				active: true,
			},
		},

		demandNotices: {
			role: UserRoleEnum.demanNotice,
			module: {
				type: BreadCrumbItemType.link,
				name: "Assessment",
				state: "/assessment/perform",
				active: false,
			},
			page: {
				type: BreadCrumbItemType.text,
				title: "Demand Notices",
				name: "Demand Notices",
				state: "/assessment/demand-notices",
				active: true,
			},
		},
		bulkDemandNotices: {
			role: UserRoleEnum.demanNotice,
			module: {
				type: BreadCrumbItemType.link,
				name: "Assessment",
				state: "/assessment/perform",
				active: false,
			},
			page: {
				type: BreadCrumbItemType.text,
				title: "Bulk Demand Notices",
				name: "Demand Notices",
				state: "/assessment/demand-notices/bulk",
				active: true,
			},
		},
		performConsumptionAssessment: {
			role: UserRoleEnum.taxPayer,
			module: {
				type: BreadCrumbItemType.link,
				name: "Perform Assessment",
				state: "/assessment/perform",
				active: false,
			},
			page: {
				type: BreadCrumbItemType.text,
				name: "Consumption Tax",
				state: "/assessment/consumption-tax",
				active: true,
			},
		},
		assessmentHistory: {
			role: UserRoleEnum.taxPayer,
			module: {
				type: BreadCrumbItemType.link,
				name: "Assessment",
				state: "/assessment/perform",
				active: false,
			},
			page: {
				type: BreadCrumbItemType.text,
				title: "My Previous Assessments",
				name: "Previous Assessments",
				state: "/assessment/history",
				active: true,
			},
		},
		assessmentPaye: {
			role: UserRoleEnum.taxPayer,
			module: {
				type: BreadCrumbItemType.link,
				name: "Assessment",
				state: "/assessment/perform",
				active: false,
			},
			page: {
				type: BreadCrumbItemType.text,
				name: "Bulk PAYE",
				state: "/assessment/bulk-paye",
				active: true,
			},
		},

		assessmentDispute: {
			role: UserRoleEnum.taxPayer,
			module: {
				type: BreadCrumbItemType.link,
				name: "Assessment",
				state: "/assessment/perform",
				active: false,
			},
			page: {
				type: BreadCrumbItemType.text,
				title: "My Disputed Assessments",
				name: "Disputed Assessments",
				state: "/assessment/history/-2",
				active: true,
			},
		},
		paymentAll: {
			role: UserRoleEnum.taxPayer,
			module: {
				type: BreadCrumbItemType.text,
				name: "Payments",
				state: "/payment/all",
				active: false,
			},
			page: {
				type: BreadCrumbItemType.text,
				title: "Make and Review Payments",
				name: "Make Payment",
				state: "/payment/all",
				active: true,
			},
		},
		paymentWallet: {
			role: UserRoleEnum.taxPayer,
			module: {
				type: BreadCrumbItemType.link,
				name: "Payments",
				state: "/payment/all",
				active: false,
			},
			page: {
				type: BreadCrumbItemType.text,
				title: "E-Wallet",
				name: "Wallet",
				state: "/payment/wallet",
				active: true,
			},
		},
		paymentTransactions: {
			role: UserRoleEnum.taxPayer,
			module: {
				type: BreadCrumbItemType.link,
				name: "Payments",
				state: "/payment/all",
				active: false,
			},
			page: {
				type: BreadCrumbItemType.text,
				title: "My Transactions",
				name: "Transactions",
				state: "/payment/transactions",
				active: true,
			},
		},
		modifyAssessment: {
			role: UserRoleEnum.admin,
			module: {
				type: BreadCrumbItemType.link,
				name: "Assessment",
				state: "/assessment/perform-assessment",
				active: false,
			},
			page: {
				type: BreadCrumbItemType.text,
				title: "Modify Assessment",
				name: "Modify Assessments",
				state: "/assessment/modify-assessment",
				active: true,
			},
		},
		paymentReporting: {
			role: UserRoleEnum.taxPayer,
			module: {
				type: BreadCrumbItemType.link,
				name: "Payments",
				state: "/reporting/payments",
				active: false,
			},
			page: {
				type: BreadCrumbItemType.text,
				title: "Payment History",
				name: "History",
				state: "/reporting/payments",
				active: true,
			},
		},
		reportingPaymentsInvididual: {
			role: UserRoleEnum.taxPayer,
			module: {
				type: BreadCrumbItemType.link,
				name: "Reporting",
				state: "/reporting/individual-payments",
				active: false,
			},
			page: {
				type: BreadCrumbItemType.text,
				title: "Individual Payments",
				name: "Individaul Payments",
				state: "/payment/bulk-paye-payments",
				active: true,
			},
		},
		paymentHistory: {
			role: UserRoleEnum.taxPayer,
			module: {
				type: BreadCrumbItemType.link,
				name: "Payments",
				state: "/payment/all",
				active: false,
			},
			page: {
				type: BreadCrumbItemType.text,
				title: "Payment History",
				name: "History",
				state: "/payment/bulk-paye-payments",
				active: true,
			},
		},
		payePayment: {
			role: UserRoleEnum.taxPayer,
			module: {
				type: BreadCrumbItemType.link,
				name: "Payments",
				state: "/payment/all",
				active: false,
			},
			page: {
				type: BreadCrumbItemType.text,
				title: "PAYE Payment",
				name: "Payment",
				state: "/payment/bulk-presumptive-payments",
				active: true,
			},
		},
		presumptivePayment: {
			role: UserRoleEnum.taxPayer,
			module: {
				type: BreadCrumbItemType.link,
				name: "Payments",
				state: "/payment/all",
				active: false,
			},
			page: {
				type: BreadCrumbItemType.text,
				title: "Presumptive Payment",
				name: "Payment",
				state: "/payment/payment-Payment",
				active: true,
			},
		},
		payePaymentHistory: {
			role: UserRoleEnum.taxPayer,
			module: {
				type: BreadCrumbItemType.link,
				name: "Payments",
				state: "/payment/all",
				active: false,
			},
			page: {
				type: BreadCrumbItemType.text,
				title: "PAYE History",
				name: "History",
				state: "/payment/bulk-presumptive-payments",
				active: true,
			},
		},
		presumptivePaymentHistory: {
			role: UserRoleEnum.taxPayer,
			module: {
				type: BreadCrumbItemType.link,
				name: "Payments",
				state: "/payment/all",
				active: false,
			},
			page: {
				type: BreadCrumbItemType.text,
				title: "Presumptive History",
				name: "History",
				state: "/payment/payment-history",
				active: true,
			},
		},
		manageOfficersRoles: {
			role: UserRoleEnum.taxPayer,
			module: {
				type: BreadCrumbItemType.text,
				name: "Setup",
				state: "/setup/assign-role",
				active: false,
			},
			page: {
				type: BreadCrumbItemType.text,
				title: "Manage Officers",
				name: "Assign Roles and Permissions",
				state: "/setup/assign-role",
				active: true,
			},
		},
		manageUserRoles: {
			role: UserRoleEnum.taxPayer,
			module: {
				type: BreadCrumbItemType.text,
				name: "Setup",
				state: "/setup/assign-role",
				active: false,
			},
			page: {
				type: BreadCrumbItemType.text,
				title: "Manage Users",
				name: "Assign Roles and Permissions",
				state: "/setup/assign-role",
				active: true,
			},
		},
		manageAgents: {
			role: UserRoleEnum.taxPayer,
			module: {
				type: BreadCrumbItemType.text,
				name: "Setup",
				state: "/payment/all",
				active: false,
			},
			page: {
				type: BreadCrumbItemType.text,
				title: "Manage Agents",
				name: "Manage PIRAS Agents",
				state: "/payment/manage-agents",
				active: true,
			},
		},
		setupMdas: {
			role: UserRoleEnum.taxPayer,
			module: {
				type: BreadCrumbItemType.text,
				name: "Setup",
				state: "/setup/mdas",
				active: false,
			},
			page: {
				type: BreadCrumbItemType.text,
				name: "Manage MDAs",
				state: "/setup/mdas",
				active: true,
			},
		},
		setupMdaBulk: {
			role: UserRoleEnum.taxPayer,
			module: {
				type: BreadCrumbItemType.link,
				name: "Setup",
				state: "/setup/mdas",
				active: false,
			},
			page: {
				type: BreadCrumbItemType.text,
				name: "MDA Bulk Upload",
				state: "/setup/mdas-bulk",
				active: true,
			},
		},
		setupTaxItem: {
			role: UserRoleEnum.taxPayer,
			module: {
				type: BreadCrumbItemType.link,
				name: "Setup",
				state: "/setup/mdas",
				active: false,
			},
			page: {
				type: BreadCrumbItemType.text,
				title: "Manage Tax Item Rules",
				name: "Tax Item",
				state: "/setup/tax-items",
				active: true,
			},
		},
		setupTaxItemBulk: {
			role: UserRoleEnum.taxPayer,
			module: {
				type: BreadCrumbItemType.link,
				name: "Setup",
				state: "/setup/mdas",
				active: false,
			},
			page: {
				type: BreadCrumbItemType.text,
				title: "Manage Bulk Rules",
				name: "Bulk Rules",
				state: "/setup/rules-bulk",
				active: true,
			},
		},
		setupConfiguration: {
			role: UserRoleEnum.taxPayer,
			module: {
				type: BreadCrumbItemType.link,
				name: "Setup",
				state: "/setup/mdas",
				active: false,
			},
			page: {
				type: BreadCrumbItemType.text,
				name: "Keys Config",
				state: "/setup/configurations",
				active: true,
			},
		},
		setupTitle: {
			role: UserRoleEnum.taxPayer,
			module: {
				type: BreadCrumbItemType.link,
				name: "Setup",
				state: "/setup/mdas",
				active: false,
			},
			page: {
				type: BreadCrumbItemType.text,
				name: "Manage Title",
				state: "/setup/titles",
				active: true,
			},
		},
		setupOccupation: {
			role: UserRoleEnum.taxPayer,
			module: {
				type: BreadCrumbItemType.link,
				name: "Setup",
				state: "/setup/Occupations",
				active: false,
			},
			page: {
				type: BreadCrumbItemType.text,
				name: "Occupation Title",
				state: "/setup/Occupation",
				active: true,
			},
		},
		setupGender: {
			role: UserRoleEnum.taxPayer,
			module: {
				type: BreadCrumbItemType.link,
				name: "Setup",
				state: "/setup/mdas",
				active: false,
			},
			page: {
				type: BreadCrumbItemType.text,
				name: "Manage Gender",
				state: "/setup/gender",
				active: true,
			},
		},
		setupEmploymentStatus: {
			role: UserRoleEnum.taxPayer,
			module: {
				type: BreadCrumbItemType.link,
				name: "Setup",
				state: "/setup/mdas",
				active: false,
			},
			page: {
				type: BreadCrumbItemType.text,
				name: "Manage Employment Status",
				state: "/setup/employment-status",
				active: true,
			},
		},
		setupMaritalStatus: {
			role: UserRoleEnum.taxPayer,
			module: {
				type: BreadCrumbItemType.link,
				name: "Setup",
				state: "/setup/mdas",
				active: false,
			},
			page: {
				type: BreadCrumbItemType.text,
				name: "Manage Marital Status",
				state: "/setup/marital-status",
				active: true,
			},
		},
		setupCompany: {
			role: UserRoleEnum.taxPayer,
			module: {
				type: BreadCrumbItemType.link,
				name: "Setup",
				state: "/setup/mdas",
				active: false,
			},
			page: {
				type: BreadCrumbItemType.text,
				name: "Manage Company",
				state: "/setup/companies",
				active: true,
			},
		},
		setupCompanyPreview: {
			role: UserRoleEnum.taxPayer,
			module: {
				type: BreadCrumbItemType.link,
				name: "Setup",
				state: "/setup/mdas",
				active: false,
			},
			page: {
				type: BreadCrumbItemType.text,
				name: "Preview Company",
				state: "/setup/companies/preview-company/:id",
				active: true,
			},
		},
		auditActivity: {
			role: UserRoleEnum.taxPayer,
			module: {
				type: BreadCrumbItemType.text,
				name: "Audit",
				state: "/audit/activities",
				active: false,
			},
			page: {
				type: BreadCrumbItemType.text,
				title: "Activity Logs",
				name: "Activities",
				state: "/audit/activities",
				active: true,
			},
		},
		platformUsage: {
			role: UserRoleEnum.admin,
			module: {
				type: BreadCrumbItemType.text,
				name: "Dashboard",
				state: "/audit/platform-usage",
				active: false,
			},
			page: {
				type: BreadCrumbItemType.text,
				title: "Platform Usage",
				name: "Platform Usage",
				state: "/audit/platform-usage",
				active: true,
			},
		},
		regInsight: {
			role: UserRoleEnum.mdaAdmin,
			module: {
				type: BreadCrumbItemType.text,
				name: "Intelligence",
				state: "/intelligence/insight",
				active: false,
			},
			page: {
				type: BreadCrumbItemType.text,
				name: "Insights",
				state: "/intelligence/insight",
				active: true,
			},
		},

		intelligenceImportCac: {
			role: UserRoleEnum.mdaAdmin,
			module: {
				type: BreadCrumbItemType.link,
				name: "Intelligence",
				state: "/intelligence/insight",
				active: false,
			},
			page: {
				type: BreadCrumbItemType.text,
				name: "Import From CAC",
				state: "/intelligence/import/cac",
				active: true,
			},
		},
		intelligenceAnalysis: {
			role: UserRoleEnum.mdaAdmin,
			module: {
				type: BreadCrumbItemType.link,
				name: "Intelligence",
				state: "/intelligence/analysis",
				active: false,
			},
			page: {
				type: BreadCrumbItemType.text,
				name: "Analyze Taxpayer Profiles",
				state: "/intelligence/analysis",
				active: true,
			},
		},
		intelligenceImportPlasmida: {
			role: UserRoleEnum.mdaAdmin,
			module: {
				type: BreadCrumbItemType.link,
				name: "Intelligence",
				state: "/intelligence/insight",
				active: false,
			},
			page: {
				type: BreadCrumbItemType.text,
				name: "Import From Plasmida",
				state: "/intelligence/import/plasmida",
				active: true,
			},
		},

		intelligenceImportYellowPages: {
			role: UserRoleEnum.mdaAdmin,
			module: {
				type: BreadCrumbItemType.link,
				name: "Intelligence",
				state: "/intelligence/insight",
				active: false,
			},
			page: {
				type: BreadCrumbItemType.text,
				name: "Import From Yellow Pages",
				state: "/intelligence/import/yellow-pages",
				active: true,
			},
		},
		intelligenceImportAssociation: {
			role: UserRoleEnum.mdaAdmin,
			module: {
				type: BreadCrumbItemType.link,
				name: "Intelligence",
				state: "/intelligence/insight",
				active: false,
			},
			page: {
				type: BreadCrumbItemType.text,
				name: "Import From Association",
				state: "/intelligence/import/association",
				active: true,
			},
		},
		intelligenceImportOthers: {
			role: UserRoleEnum.mdaAdmin,
			module: {
				type: BreadCrumbItemType.link,
				name: "Intelligence",
				state: "/intelligence/insight",
				active: false,
			},
			page: {
				type: BreadCrumbItemType.text,
				name: "Import From Others",
				state: "/intelligence/import/others",
				active: true,
			},
		},
		setupAuditTarget: {
			role: UserRoleEnum.admin,
			module: {
				type: BreadCrumbItemType.link,
				name: "Audit Target",
				state: "/risk-based-audit/audit_target",
				active: false,
			},
			page: {
				type: BreadCrumbItemType.text,
				name: "Audit Target",
				state: "/risk-based-audit/audit_target",
				active: true,
			},
		},
		rba: {
			role: UserRoleEnum.mdaAdmin,
			module: {
				type: BreadCrumbItemType.link,
				name: "Risk-Based Audit",
				state: "/risk-based-audit/rba",
				active: false,
			},
			page: {
				type: BreadCrumbItemType.text,
				name: "Risk-Based Audit",
				state: "/risk-based-audit/rba",
				active: true,
			},
		},
		corporateRevenueReturn: {
			role: UserRoleEnum.taxPayer,
			module: {
				type: BreadCrumbItemType.link,
				name: "Corporate",
				state: "/revenue-returns/corporate",
				active: false,
			},
			page: {
				type: BreadCrumbItemType.text,
				name: "Revenue Returns",
				state: "/revenue-returns/corporate",
				active: true,
			},
		},

		previousIndividualRevenueReturn: {
			role: UserRoleEnum.taxPayer,
			module: {
				type: BreadCrumbItemType.link,
				name: "Individual",
				state: "/revenue-returns/previous-revenue-returns",
				active: false,
			},
			page: {
				type: BreadCrumbItemType.text,
				name: "Individual Revenue Returns",
				state: "/revenue-returns/corporate",
				active: true,
			},
		},

		previousCorporateRevenueReturn: {
			role: UserRoleEnum.taxPayer,
			module: {
				type: BreadCrumbItemType.link,
				name: "Corporate",
				state: "/revenue-returns/previous-revenue-return-corporate",
				active: false,
			},
			page: {
				type: BreadCrumbItemType.text,
				name: "Corporate Revenue Returns",
				state: "/revenue-returns/corporate",
				active: true,
			},
		},

		manageBusinessIndustries: {
			role: UserRoleEnum.admin,
			module: {
				type: BreadCrumbItemType.link,
				name: "Manage Business Industries",
				state: "/setup/business-industries",
				active: false,
			},
			page: {
				type: BreadCrumbItemType.text,
				title: "Manage Business Industries",
				name: "Business Industries",
				state: "/setup/business-industry",
				active: true,
			},
		},
	};

	crumItem = new BehaviorSubject<IBreadCrumbData>(null);
	crumbItem$ = this.crumItem.asObservable();

	setCrumbItem(crumbType: string, title: string = undefined) {
		console.log("set crumb item ", crumbType, title);
		const userRoleKey: string = localStorage["portal"];
		console.log("user role breadcrumb is ", userRoleKey);
		const role = UserRoleEnum[userRoleKey] || undefined;
		if (this.crumbData.hasOwnProperty(crumbType)) {
			const data: IBreadCrumbData = this.crumbData[crumbType];
			this.crumItem.next({ ...data, role, title });
		} else {
			this.crumItem.next(null);
		}
	}
}
