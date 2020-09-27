import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SplashScreenComponent } from './splash-screen/splash-screen.component';
import { GameScreenComponent } from './game-screen/game-screen.component';


const routes: Routes = [
  {
    path: 'game/:gameType',
    component: GameScreenComponent
  },
  {
    path: '**',
    component: SplashScreenComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
