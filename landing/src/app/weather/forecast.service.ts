import { Injectable } from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, map, switchMap, pluck, mergeMap, filter, toArray, share } from 'rxjs/operators';

export interface IWeatherResponse {
  list: {
    dt_txt: string;
    main: {
      temp: number;
    }
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class ForecastService {

  private rootUrl: string = 'https://api.openweathermap.org/data/2.5/forecast'
  apiKey: string = '9b15c789774951000cbc1e8a12d05a38';

  constructor(private http: HttpClient) { }

  getForecast() {
    return this.getCurrentLocation().pipe(
      map(coords => {
        return new HttpParams()
          .set('lat', String(coords.latitude))
          .set('lon', String(coords.longitude))
          .set('units', 'metric')
          .set('appid', this.apiKey)
      })
      ,switchMap(params => this.http.get<IWeatherResponse>(this.rootUrl, {params}))
      ,pluck('list')
      ,mergeMap(val => of(...val))
      ,filter((_value, index) => index%8 == 0)
      ,map(val => {return {dateString: val.dt_txt, temp: val.main.temp};})
      ,toArray()
      ,share()
    );
  }

  getCurrentLocation() {
    return new Observable<Coordinates>((observer) => {
      window.navigator.geolocation.getCurrentPosition(
        pos => {
          observer.next(pos.coords);
          observer.complete();
        },
        err => observer.error(err)
      )
    });
  }
}
