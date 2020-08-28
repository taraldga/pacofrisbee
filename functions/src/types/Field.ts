export default interface Field {
  id?: string;
  name: string;
  holes: Hole []
}


export interface Hole {
  id?: string;
  number: number;
  par: number;
  isPlayed?: boolean;
}