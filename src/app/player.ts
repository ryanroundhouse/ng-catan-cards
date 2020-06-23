import { Card } from './card';

export interface Player {
    name: string,
    email: string,
    id: number,
    cards: Card[]
}
