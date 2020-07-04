import { Player } from './player';
import { Card } from './card';

export interface CardEvent {
    player: Player;
    card: Card;
    id: number;
}
