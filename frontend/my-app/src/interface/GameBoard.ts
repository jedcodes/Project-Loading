import { User } from "./User";

export interface GameBoard {
    id: string;
    pinCode: string;
    currentGameIndex: number;
    sequence: string[];
    players: User[];
    isActive: boolean;
}