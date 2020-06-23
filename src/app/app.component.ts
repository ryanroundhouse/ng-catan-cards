import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { FormBuilder } from '@angular/forms';

import { cards } from './deck';
import { Player } from './player';
import { Card } from './card';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title: string = 'ng-catan-cards';
  public addPlayerForm;
  deck: Card[] = this.shuffle(cards);
  cardsLeft: number = this.deck.length;
  players: Player[] = [];

  constructor(private formBuilder: FormBuilder, private http: HttpClient, private router: Router){
    this.addPlayerForm = this.formBuilder.group({
      newPlayerName: '',
      newPlayerEmail: ''
    });
  }

  onSubmitAddPlayer(playerData){
    console.log(playerData);
    let newPlayer: Player = {
      name: playerData.newPlayerName,
      email: playerData.newPlayerEmail,
      id: this.players.length,
      cards: []
    }
    this.players.push(newPlayer);
    console.log(this.players);
    this.addPlayerForm.reset();
  }

  drawCard(playerId){
    let player = this.players.find(p => p.id === playerId);
    let card = this.deck[this.deck.length - this.cardsLeft];
    let text = player.name + " drew a " + card.name;
    player.cards.push(card);
    console.log(text);

    let emailInfo = {
      to: player.email,
      from: "badmrgraham@gmail.com",
      subject: "you drew a card",
      html: "<h1>You got a " + card.name + "</h1><p>" + card.description + "</p>"
    }

    this.http.post('/api/sendEmail', emailInfo).subscribe((data:any) => {
      console.log("success response:");
      console.log(data);
    }, error => {
      console.log(error.error.error);
    });
    this.cardsLeft--;
  }

  shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }
}
