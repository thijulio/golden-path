import { Component } from '@angular/core';
import { universal, lightTier, lightDefaults, productTier } from '../../data/stack';

@Component({
  selector: 'app-stack',
  styleUrl: './stack.scss',
  templateUrl: './stack.html',
})
export class Stack {
  protected readonly universal = universal;
  protected readonly lightTier = lightTier;
  protected readonly lightDefaults = lightDefaults;
  protected readonly productTier = productTier;
}
