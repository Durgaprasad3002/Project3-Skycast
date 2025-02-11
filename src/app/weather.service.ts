import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private apiKey: string = '4c22f4b348335237896c2446a0338c97';  
  private apiUrl: string = 'https://api.openweathermap.org/data/2.5/weather';
  private forecastUrl: string = 'https://api.openweathermap.org/data/2.5/forecast';
  private aqiUrl: string = 'https://api.openweathermap.org/data/2.5/air_pollution';
  private uvUrl: string = 'https://api.openweathermap.org/data/2.5/uvi';

  constructor(private http: HttpClient) {}

  
  private handleError(error: any): Observable<any> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      
      errorMessage = `Error: ${error.error.message}`;
    } else {
      
      if (error.status === 404) {
        errorMessage = 'City not found. Please try a different city.';
      } else if (error.status === 401) {
        errorMessage = 'Invalid API key. Please check your key.';
      } else if (error.status === 0) {
        errorMessage = 'Network error. Please check your internet connection.';
      } else {
        errorMessage = `Error: ${error.statusText} (status code: ${error.status})`;
      }
    }
    return throwError(errorMessage);
  }

 
  getWeather(city: string): Observable<any> {
    const url = `${this.apiUrl}?q=${city}&appid=${this.apiKey}&units=metric`;
    return this.http.get(url).pipe(catchError(this.handleError));  
  }

  
  getForecast(city: string): Observable<any> {
    const url = `${this.forecastUrl}?q=${city}&appid=${this.apiKey}&units=metric`;
    return this.http.get(url).pipe(catchError(this.handleError));  
  }

 
  getAirQuality(lat: number, lon: number): Observable<any> {
    const url = `${this.aqiUrl}?lat=${lat}&lon=${lon}&appid=${this.apiKey}`;
    return this.http.get(url).pipe(catchError(this.handleError));  
  }

  
  getUVIndex(lat: number, lon: number): Observable<any> {
    const url = `${this.uvUrl}?lat=${lat}&lon=${lon}&appid=${this.apiKey}`;
    return this.http.get(url).pipe(catchError(this.handleError));  
  }

  
  getHourlyForecast(lat: number, lon: number): Observable<any> {
    const url = `https://api.openweathermap.org/data/2.5/forecast/hourly?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`;
    return this.http.get(url).pipe(catchError(this.handleError));  
  }
}
