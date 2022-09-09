import { Injectable } from "@angular/core";
import { LocalStoreService } from "./local-store.service";
import { Router } from "@angular/router";
import { of, throwError } from "rxjs";
import { delay } from "rxjs/operators";
import { HttpService } from "./http.service";
import { parse } from "querystring";
import { PayeeCalculator } from "../models/payee_calculator";


@Injectable({
  providedIn: "root"
})
export class MockDataService {
  

  constructor(private store: LocalStoreService, private httpService:HttpService, private router: Router) {
    
  }

   
  private names:string[] = ["Shehu", "Sani", "Blythe",  "Happy", "Ahmed",  "Ezekiel",  "Danladi", "James", "Okafor", "Miracle", "Zazzy", "Adekunle", "Adebayo"];

  private company_tags:string[] = ["LTD", "Inc", "Ventures", "Plc", "Corp", "Schools"];

  private companies:string[] = ["Imagine", "Innovate ", "Keen", "light of the world communications", "Perfection", "Immaculate", "Sun", "Trusted", "Ibetoo", "Savannah", "Joy", "Jubilant", "Knowledgeable", "Learned", "Clean", "Ntachi Osa", "Ventures 234", "Lucky", "Phenomenal", "prominent", "quick", "Reassuring", "Rejoice", "Resounding", "Super God", "Superb", "Thorough", "Transforming", "Truthful", "Vital", "wealthy", "Wealth", "Wholesome"]; 

  

  address:any[] = [

    "Aro Street", "Mubarak Avenue", "Otigi Street", "HillView", "KSA", "Ose"
];

  industries:any[] = [

    "Education", "Construction", "Technology", "Engineering", "Telecommunication", "Accounting", "Manufacturing", "Agriculture", "Finance", "Petroleum Industry", "Advertising", "Transport", "Engineering", "Goods","Mining", "Communication", "Production", "Health Care", "Real Estate", "Clothing", "Food", "Bank"];
        

occupations:any[] = [
    "Able Seamen",  "Account Collector",  "Accounting Specialist",  "Adjustment Clerk",  "Administrative Assistant",  "Administrative Law Judge",  "Administrative Service Manager",  "Admiralty Lawyer",  "Adult Literacy and Remedial Education Teachers",  "Advertising Account Executive",  "Advertising Agency Coordinator",  "Aeronautical & Aerospace Engineer",  "Aerospace Engineering Technician",  "Agricultural Crop Farm Manager",  "Agricultural Engineer",  "Agricultural Equipment Operator",  "Agricultural Inspector",  "Agricultural Product Sorter",  "Agricultural Sciences Professor",  "Agricultural Technician",  "Air Crew Member",  "Air Crew Officer",  "Air Traffic Controller",  "Aircraft Assembler",  "Aircraft Body and Bonded Structure Repairer",  "Aircraft Cargo Handling Supervisor",  "Aircraft Examiner",  "Aircraft Launch and Recovery Officer",  "Aircraft Launch and Recovery Specialist",  "Aircraft Mechanic",  "Airfield Operations Specialist",  "Airline Flight Attendant",  "Airline Flight Control Administrator",  "Airline Flight Operations Administrator",  "Airline Flight Reservations Administrator",  "Airport Administrator",  "Airport Design Engineer",  "Alcohol & Drug Abuse Assistance Coordinator",  "Alumni Relations Coordinator",  "Ambulance Drivers",  "Amusement Park & Recreation Attendants",  "Anesthesiologist (MD)",  "Animal Breeder",  "Animal Control Worker",  "Animal Husbandry Worker Supervisor",  "Animal Keepers and Groomers",  "Animal Kennel Supervisor",  "Animal Scientist",  "Animal Trainer",  "Animation Cartoonist",  "Answering Service Operator",  "Anthropology and Archeology Professor",  "Anti-Terrorism Intelligence Agent",  "Appeals Referee",  "Aquaculturist (Fish Farmer)",  "Aquarium Curator",  "Architecture Professor",  "Area Ethnic and Cultural Studies Professor",  "Armored Assault Vehicle Crew Member",  "Armored Assault Vehicle Officer",  "Art Appraiser",  "Art Director",  "Art Restorer",  "Art Therapist",  "Art,  Drama,  and Music Professor",  "Artillery and Missile Crew Member",  "Artillery and Missile Officer",  "Artists Agent (Manager)",  "Athletes' Business Manager",  "Athletic Coach",  "Athletic Director",  "Athletic Trainer",  "ATM Machine Servicer",  "Atmospheric and Space Scientist",  "Audio-Visual Collections Specialist",  "Audiovisual Production Specialist",  "Automobile Mechanic",  "Automotive Body Repairer",  "Automotive Engineer",  "Automotive Glass Installer",  "Avionics Technician",  "Baggage Porters and Bellhops",  "Baker (Commercial)",  "Ballistics Expert",  "Bank and Branch Managers",  "Bank Examiner",  "Bank Teller",  "Benefits Manager",  "Bicycle Mechanic",  "Billing Specialist",  "Bindery Machine Set-Up Operators",  "Bindery Machine Tender",  "Biological Technician",  "Biology Professor",  "Biomedical Engineer",  "Biomedical Equipment Technician",  "Boat Builder",  "Book Editor",  "Border Patrol Agent",  "Brattice Builder",  "Bridge and Lock Tenders",  "Broadcast News Analyst",  "Broadcast Technician",  "Broker's Floor Representative",  "Brokerage Clerk",  "Budget Accountant",  "Budget Analyst",  "Building Inspector",  "Building Maintenance Mechanic",  "Bulldozer / Grader Operator",  "Bus and Truck Mechanics",  "Bus Boy / Bus Girl",  "Bus Driver (School)",  "Bus Driver (Transit)",  "Business Professor",  "Business Service Specialist",  "Cabinet Maker",  "Camp Director",  "Caption Writer",  "Cardiologist (MD)",  "Cardiopulmonary Technologist",  "Career Counselor",  "Cargo and Freight Agents",  "Carpenter's Assistant",  "Carpet Installer",  "Cartographer (Map Scientist)",  "Cartographic Technician",  "Cartoonist (Publications)",  "Casino Cage Worker",  "Casino Cashier",  "Casino Dealer",  "Casino Floor Person",  "Casino Manager",  "Casino Pit Boss",  "Casino Slot Machine Mechanic",  "Casino Surveillance Officer",  "Casting Director",  "Catering Administrator",  "Ceiling Tile Installer",  "Cement Mason",  "Ceramic Engineer",  "Certified Public Accountant (CPA)",  "Chaplain (Prison",    "Chemical Engineer",  "Chemical Equipment Operator",  "Chemical Plant Operator",  "Chemical Technicians",  "Chemistry Professor",  "Chief Financial Officer",  "Child Care Center Administrator",  "Child Care Worker",  "Child Life Specialist",  "Child Support Investigator",  "Child Support Services Worker",  "City Planning Aide",  "Civil Drafter",  "Civil Engineer",  "Civil Engineering Technician",  "Clergy Member (Religious Leader)",  "Clinical Dietitian",  "Clinical Psychologist",  "Clinical Sociologist",  "Coatroom and Dressing Room Attendants",  "College/University Professor",  "Commercial Designer",  "Commercial Diver",  "Commercial Fisherman",  "Communication Equipment Mechanic",  "Communications Professor",  "Community Health Nurse",  "Community Organization Worker",  "Community Welfare Worker",  "Compensation Administrator",  "Compensation Specialist",  "Compliance Officer",  "Computer Aided Design (CAD) Technician",  "Computer and Information Scientists",  "Research",  "Computer and Information Systems Managers",  "Computer Applications Engineer",  "Computer Controlled Machine Tool Operators",  "Computer Customer Support Specialist",  "Computer Hardware Technician",  "Computer Operators",  "Computer Programmer",  "Computer Science Professor",  "Computer Security Specialist",  "Computer Software Engineers",  "Computer Software Technician",  "Computer Systems Engineer",  "Congressional Aide",  "Conservation Scientist",  "Construction Driller",  "Construction Laborer",  "Construction Manager",  "Construction Trades Supervisor",  "Contract Administrator",  "Contract Specialist",  "Control Center Specialist (Military)",  "Controller (Finance)",  "Cook (Cafeteria)",  "Cook (Fast Food)",  "Cook (Private Household)",  "Cook (Restaurant)",  "Cook (Short Order)",  "Copy Writer",  "Corporation Lawyer",  "Correction Officer"
];



private banks:string[] = [

    "Access Bank", "UBA", "Diamond Bank (Access)", "WEMA", "Stanbic", "GTB", "Union Bank", "Unity Bank", "Polaris Bank"];



getRandom(max:number, min:number = 0){

        return Math.floor(Math.random() * max);
}

getPeople(amt:number){

    return new Promise((resolve:any, reject:any)=>{

        setTimeout(()=>{
        let result:any[] = [];
 
        for(let i =0; i < amt; i++){
    
            let obj:any = {};
            obj.name  = this.names[this.getRandom(this.names.length)] + " "+this.names[this.getRandom(this.names.length)];
            obj.date = (Date.now() - this.getRandom((1000 * 60 * 60 * 24 * 30 * 12 * 20), Date.now()))/1000;

            obj.id = this.getRandom(99999, 10000);
            obj.address = "No " + (this.getRandom(300, 1) +1) + " " + this.address[this.getRandom(this.address.length)];
            obj.contact = this.getPhone();
            obj.occupation = this.occupations[this.getRandom(this.occupations.length)];
            obj.income = this.getRandom(1000000, 50000);
            
            result.push(obj);
        }
    
        resolve(result);
    }, 10000);
     
    
    }   
    );
}
 

getPhone(){

    let res:string = "+234";

    for(let i:number =0; i < 11; i++){

        res+=this.getRandom(9);
    }

    return res;
}
getCompanies(amt:number){

    return new Promise((resolve:any, reject:any)=>{

        setTimeout(()=>{
        let result:any[] = [];
 
        for(let i =0; i < amt; i++){
    
            let obj:any = {};
            obj.name  = this.companies[this.getRandom(this.companies.length)] + " "+this.company_tags[this.getRandom(this.company_tags.length)];
            obj.date = (Date.now() - this.getRandom((1000 * 60 * 60 * 24 * 30 * 12 * 20), Date.now()))/1000;
            
            obj.id = this.getRandom(9999999, 1000000);
            obj.address = "No " + this.getRandom(300, 1) + " " + this.address[this.getRandom(this.address.length)];
            obj.occupation = this.industries[this.getRandom(this.industries.length)];
            obj.income = this.getRandom(100000000, 5000000);
            obj.contact = this.getPhone();
            
            result.push(obj);
        }
    
        resolve(result);
    }, 10000);
     
    
    }   
    );
}


}