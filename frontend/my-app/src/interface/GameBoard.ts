import { User } from "./User";

export interface GameBoard {
    _id: string;
    pinCode: string;
    currentGameIndex: number;
    sequence: string[];
    players: User[];
    isActive: boolean;
}