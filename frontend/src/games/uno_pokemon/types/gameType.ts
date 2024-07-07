export interface UP_Players {
  username: string;
  avatar: string;
  hand: UP_Card[];
  position: { x: number; y: number };
}

export interface UP_Card {
  name: string;
  img: string;
  type: 'normal' | '+4' | '+2' | 'block' | 'sens' | 'joker';
  color: 'all' | 'blue' | 'yellow' | 'red' | 'green';
  number: null | number;
}
