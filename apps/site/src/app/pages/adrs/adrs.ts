import { Component } from '@angular/core';
import { adrs } from '../../data/adrs';

@Component({
  selector: 'app-adrs',
  styleUrl: './adrs.scss',
  templateUrl: './adrs.html',
})
export class Adrs {
  protected readonly adrs = adrs;
}
