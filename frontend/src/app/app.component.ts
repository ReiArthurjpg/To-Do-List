import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({selector:'app-root', standalone:true, imports:[RouterOutlet, MatToolbarModule], template:`<mat-toolbar color="primary">ToDo List</mat-toolbar><main class="container"><router-outlet /></main>`})
export class AppComponent {}
