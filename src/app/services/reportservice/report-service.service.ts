import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Car {
  make: string;
  model: string;
  price: number;
}

@Injectable({
  providedIn: 'root'
})
export class ReportServiceService
{
  constructor()
  {

  }

  // Simulate an HTTP request by returning an Observable
  getCars(): Observable<Car[]>
  {
    const cars = [
      { make: 'Toyota', model: 'Celica', price: 35000 },
      { make: 'Ford', model: 'Mondeo', price: 32000 },
      { make: 'Porsche', model: 'Boxster', price: 72000 }
    ];
    return of(cars);
  }

}
