import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { combineLatest, Observable, of } from 'rxjs';
import { PaisSmall } from '../interfaces/paises.interfaces'
import { Pais } from '../interfaces/pais.interfaces'


@Injectable({
  providedIn: 'root'
})
export class PaisesServiceService {

  private _regiones: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];
  private _baseUrl: string = 'https://restcountries.com/v2';

  constructor(private http : HttpClient) { }

  get regiones() {
    return [...this._regiones];
  }

  getPaisesByRegion(region: string) : Observable<PaisSmall[]> {
    const url = `${ this._baseUrl }/region/${ region }?fields=alpha3Code,name`;
    
    return this.http.get<PaisSmall[]>(url);
  }

  getPaisesByCode(code: string): Observable<Pais | null> {
    if (!code) {
      return of(null);
    }
    const url = `${ this._baseUrl }/alpha/${ code }`;
    
    return this.http.get<Pais>(url);
  }

  getPaisByCodeSmall(code: string) : Observable<PaisSmall> {
    const url = `${ this._baseUrl }/alpha/${ code }?fields=alpha3Code,name`;
    
    return this.http.get<PaisSmall>(url);
  }

  getPaisesByBorders(borders : string[]) : Observable<PaisSmall[] | null>{
    if (!borders) {
      return of(null);
    }

    const peticiones: Observable<PaisSmall>[] = [];

    borders.forEach(border => {
      const peticion = this.getPaisByCodeSmall(border);

      peticiones.push(peticion);
    });

    return combineLatest(peticiones);
  }
}
