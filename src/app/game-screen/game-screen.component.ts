import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import { cards } from '../decks/catan';
import { Player } from '../interfaces/player';
import { Card } from '../interfaces/card';
import { HttpClient } from '@angular/common/http';
import { CardEvent } from '../interfaces/card-event';

@Component({
  selector: 'app-game-screen',
  templateUrl: './game-screen.component.html',
  styleUrls: ['./game-screen.component.scss']
})
export class GameScreenComponent implements OnInit {
// card properties
faEyeSlash = faEyeSlash;
deck: Card[] = this.shuffle(cards);
cardsLeft: number = this.deck.length;
cardEvents: CardEvent[] = [];
// add player properties
public addPlayerForm;
players: Player[] = [];

constructor(private formBuilder: FormBuilder, private http: HttpClient, private router: Router){
  this.addPlayerForm = this.formBuilder.group({
    newPlayerName: ['', Validators.required],
    newPlayerEmail: ['', [Validators.required, Validators.email]]
  });
}

ngOnInit(): void {
  
}

get newPlayerName(){
  return this.addPlayerForm.get('newPlayerName');
}
get newPlayerEmail(){
  return this.addPlayerForm.get('newPlayerEmail');
}

onSubmitAddPlayer(playerData){
  console.log(playerData);
  const newPlayer: Player = {
    name: playerData.newPlayerName,
    email: playerData.newPlayerEmail,
    id: this.players.length,
    cards: []
  };
  this.players.push(newPlayer);
  console.log(this.players);
  this.addPlayerForm.reset();
}

toggleVisibility(cardId){
  const x = (document.getElementById(cardId) as HTMLInputElement);
  if (x.style.visibility === 'collapse'){
    x.style.visibility = 'visible';
  }
  else{
    x.style.visibility = 'collapse';
  }
}

drawCard(playerId){
  const player = this.players.find(p => p.id === playerId);
  const card = this.deck[this.deck.length - this.cardsLeft];
  const text = player.name + ' drew a ' + card.name;
  player.cards.push(card);
  this.cardEvents.push({player, card, id: card.id});
  console.log(text);

  const emailInfo = {
    to: player.email,
    from: 'badmrgraham@gmail.com',
    subject: 'you drew a card',
    html: `<h1>You got a ${card.name}</h1><p>${card.description}</p><img src='cid:${card.cid}'/>`,
    attachments: [{
      filename: card.imageUrl.split('\\').pop().split('/').pop(),
      path: card.imageUrl,
      cid: card.cid
    }]
  };

  this.http.post('/api/sendEmail', emailInfo).subscribe((data: any) => {
    console.log('success response:');
    console.log(data);
  }, error => {
    console.log(error.error.error);
  });
  this.cardsLeft--;
}

shuffle(array) {
  let currentIndex = array.length;
  let temporaryValue;
  let randomIndex;

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
