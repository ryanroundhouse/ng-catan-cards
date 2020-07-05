import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Guid } from 'guid-typescript';

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.scss']
})
export class SplashScreenComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  hostGame(){
    console.log('hit');
    const gameGuid: Guid = Guid.create();
    this.router.navigateByUrl('/catan', {state: {gameId: gameGuid}});
  }

}
