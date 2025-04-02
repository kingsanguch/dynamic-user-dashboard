import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CounterService } from '../services/counter.service';

@Component({
  selector: 'app-counter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss']
})
export class CounterComponent implements OnInit {
  counter: number = 0;

  constructor(private counterService: CounterService) {}

  ngOnInit(): void {
    this.counterService.counter$.subscribe(value => {
      this.counter = value;
    });
  }

  onIncrement(): void {
    this.counterService.increment();
  }

  onDecrement(): void {
    this.counterService.decrement();
  }

  onReset(): void {
    this.counterService.reset();
  }
}
