import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import { cards } from './decks/catan';
import { Player } from './interfaces/player';
import { Card } from './interfaces/card';
import { HttpClient } from '@angular/common/http';
import { CardEvent } from './interfaces/card-event';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor() { }
}
