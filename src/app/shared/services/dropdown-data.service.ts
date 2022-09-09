import { Injectable } from "@angular/core";
import states from "../../../assets/data/state.json";
import countries from "../../../assets/data/countries.json";
import { HttpService } from "./http.service";

@Injectable({
	providedIn: "root",
})
export class DropdownDataService {
	statuses: string[];
	employement_statuses: string[] = ["Student", "Employed", "Unemployed"];
	countries: string[] = countries.map((e) => this.capitalizeFirstLetter(e));
	states: string[] = [];
	occupations: string[];

	constructor(private httpService: HttpService) {
		this.fetchState();
	}

	fetchOccupations() {
		return this.httpService.doGet("data/list_occupations");
	}

	fetchStatus() {
		return this.httpService.doGet("data/list_statuses");
	}

	fetchState() {
		this.states = states.map((state) => state.state);
	}

	getSelectedLga(selectedState): any {
		const currentState = states.find((_cur) => _cur.state == selectedState);
		return currentState.lgas;
	}

	capitalizeFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}
}
