import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // Import FormsModule

import { AppComponent } from './app.component';
import { WeatherComponent } from './weather/weather.component';

@NgModule({
  declarations: [AppComponent, WeatherComponent],
  imports: [BrowserModule, HttpClientModule, FormsModule], // Add FormsModule here
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
