import Field from "./Field";
import Player from "./Player";
import { ScoreEntry } from "./ScoreEntry";

export interface GameData {
    id?: string
    date: Date
    field: Field
    players: Player[]
    scoreEntries: ScoreEntry[]
    isFinished?: boolean;
}