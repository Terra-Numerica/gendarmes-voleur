import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdventureMenuComponent } from './components/adventure-menu/adventure-menu.component';
import { CopsAndRobberGameModeSelectionComponent } from './components/cops-and-robber-game-mode-selection/cops-and-robber-game-mode-selection.component';
import { CreditComponent } from './components/credit/credit.component';
import { GameBoardComponent } from './components/game-board/game-board.component';
import { GameMenuComponent } from './components/game-menu/game-menu.component';
import { GraphConstructorComponent } from './components/graph-constructor/graph-constructor.component';
import { RulesComponent } from './components/rules/rules.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/game-mode-selection' },
  { path: 'game-mode-selection', component: CopsAndRobberGameModeSelectionComponent },
  { path: 'board', component: GameBoardComponent },
  { path: 'menu', component: GameMenuComponent },
  { path: 'graph-constructor', component: GraphConstructorComponent },
  { path: 'adventure-menu', component: AdventureMenuComponent },
  { path: 'credit', component: CreditComponent },
  { path: 'rules', component: RulesComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}