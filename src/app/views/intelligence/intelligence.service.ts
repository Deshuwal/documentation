import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IntelligenceService {

  public insight = new Subject()

  constructor() { }
}
