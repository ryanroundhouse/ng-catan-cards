import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import { cards as catanCards } from '../decks/catan';
import { cards as ticketToRideCards } from '../decks/ticket-to-ride';
import { Player } from '../interfaces/player';
import { Card } from '../interfaces/card';
import { HttpClient } from '@angular/common/http';
import { CardEvent } from '../interfaces/card-event';
import { Guid } from 'guid-typescript';

@Component({
  selector: 'app-game-screen',
  templateUrl: './game-screen.component.html',
  styleUrls: ['./game-screen.component.scss']
})
export class GameScreenComponent implements OnInit {
  // card properties
  faEyeSlash = faEyeSlash;
  gameType: Number;
  gameName: string;
  deck: Card[];
  cardsLeft: number;
  numberOfCardsToDraw: number;
  cardEvents: CardEvent[] = [];
  gameId: Guid;
  // add player properties
  public addPlayerForm;
  players: Player[] = [];

  constructor(private formBuilder: FormBuilder, private http: HttpClient, private router: Router, private route: ActivatedRoute){
    this.addPlayerForm = this.formBuilder.group({
      newPlayerName: ['', Validators.required],
      newPlayerEmail: ['', [Validators.required, Validators.email]]
    });
    this.gameId = this.router.getCurrentNavigation().extras.state.gameId;
    this.gameType = +this.route.snapshot.paramMap.get('gameType');
    console.log(this.gameType);
    switch (this.gameType){
      case 0:{
        console.log(`shuffling catan cards`);
        this.deck = this.shuffle(catanCards);
        this.numberOfCardsToDraw = 1;
        this.gameName = "Settlers of Catan";
        break;
      }
      case 1:{
        console.log(`shuffling ticket to ride cards`);
        this.deck = this.shuffle(ticketToRideCards);
        this.numberOfCardsToDraw = 3;
        this.gameName = "Ticket to Ride";
        break;
      }
    }
    this.cardsLeft = this.deck.length;
  }

  ngOnInit(): void {}

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
    let cards: Card[] = [];
    
    let text = `${player.name} drew `;
    let htmlBody = `<h1>You drew</h1>`;
    let attachments: any[] = [];
    for (let iteration = 1; iteration <= this.numberOfCardsToDraw; iteration++){
      const card = this.deck[this.deck.length - this.cardsLeft];
      cards.push(card);
      player.cards.push(card);
      text += `${card.name} `;
      this.cardEvents.push({player, card, id: card.id});
      htmlBody += `<p>${card.name}</p><p>${card.description}</p><img src='cid:${card.cid}'/><br/>`;
      attachments.push({
        filename: card.imageUrl.split('\\').pop().split('/').pop(),
        path: card.imageUrl,
        cid: card.cid}
      );
      this.cardsLeft--;
    }
    
    console.log(text);

    const emailInfo = {
      to: player.email,
      from: 'badmrgraham@gmail.com',
      subject: `you drew ${cards.length} card(s)`,
      html: htmlBody,
      attachments: attachments
    };
    
    this.http.post('/api/sendEmail', emailInfo).subscribe((data: any) => {
      console.log('success response:');
      console.log(data);
    }, error => {
      console.log(error.error.error);
    });

    console.log(JSON.stringify(emailInfo));
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