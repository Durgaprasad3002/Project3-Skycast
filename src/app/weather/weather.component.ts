import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../weather.service';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css'],
})
export class WeatherComponent implements OnInit {
  city: string = '';
  weatherData: any = null;
  forecastData: any = null;
  airQualityData: any = null;
  uvData: any = null;
  healthTips: string = '';
  weatherTips: string = '';
  errorMessage: string = '';

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {}

  getWeather(): void {
    if (!this.city.trim()) {
      this.setErrorMessage('Please enter a city name.');
      return;
    }

    this.errorMessage = ''; 

    this.weatherService.getWeather(this.city).subscribe(
      (data) => {
        if (!data) {
          this.setErrorMessage('City not found. Please try again.');
          return;
        }
        this.weatherData = data;
        this.fetchAdditionalData();
        this.setWeatherTips(data.weather[0].main);
      },
      () => this.setErrorMessage('City not found. Please try again.')
    );
  }

  fetchAdditionalData(): void {
    if (!this.weatherData?.coord) return;

    const { lat, lon } = this.weatherData.coord;

    this.weatherService.getHourlyForecast(lat, lon).subscribe(
      (data) => {
        if (data) {
          this.forecastData = data;
        }
      },
      () => console.warn('Error fetching hourly forecast data.')
    );

    this.weatherService.getAirQuality(lat, lon).subscribe(
      (data) => {
        if (data) {
          this.airQualityData = data;
          this.setHealthTips(this.airQualityData.list[0].main.aqi);
        }
      },
      () => console.warn('Error fetching air quality data.')
    );

    this.weatherService.getUVIndex(lat, lon).subscribe(
      (data) => {
        if (data) {
          this.uvData = data;
        }
      },
      () => console.warn('Error fetching UV index data.')
    );
  }

  setHealthTips(aqi: number): void {
    const tips = [
      'Air quality is good. Enjoy your day!',
      'Air quality is moderate. Minor irritation possible.',
      'Unhealthy for sensitive groups. Limit outdoor activities.',
      'Unhealthy air. Avoid prolonged exposure.',
      'Very unhealthy air. Serious health risks.',
      'Hazardous air. Emergency conditions.'
    ];
    
    this.healthTips = tips[Math.min(aqi, 5)];
  }

  setWeatherTips(weather: string): void {
    const weatherTipsMap: { [key: string]: string } = {
      Clear: "It's a sunny day! Don't forget your sunglasses. 😎",
      Rain: "Rainy day ahead! Carry an umbrella. ☔",
      Thunderstorm: "Thunderstorm alert! Stay indoors. ⛈️",
      Snow: "It's snowing! Keep warm. ❄️",
      Clouds: "Cloudy skies! A perfect day for a walk. ☁️",
      Drizzle: "Light rain outside. Stay cozy! 🌧️"
    };

    this.weatherTips = weatherTipsMap[weather] || "Check the latest forecast before heading out!";
  }

  setErrorMessage(message: string): void {
    this.errorMessage = message;
  }
}
