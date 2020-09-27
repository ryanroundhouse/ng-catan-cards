import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Guid } from 'guid-typescript';

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.scss']
})
export class SplashScreenComponent implements OnInit {
  games = [
    {name: 'Settlers of Catan', value: 0},
    {name: 'Ticket to Ride', value: 1}
  ];
  selectedGame: string;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  hostGame(){
    console.log(this.selectedGame);
    const gameId = this.games.find(game => game.name === this.selectedGame).value;
    const gameGuid: Guid = Guid.create();
    this.router.navigateByUrl(`/game/${gameId}`, {state: {gameId: gameGuid}});
  }

}
