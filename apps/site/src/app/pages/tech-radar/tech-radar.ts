import { Component } from '@angular/core';
import { radar } from '../../data/radar';

@Component({
  selector: 'app-tech-radar',
  styleUrl: './tech-radar.scss',
  templateUrl: './tech-radar.html',
})
export class TechRadar {
  protected readonly radar = radar;
}
