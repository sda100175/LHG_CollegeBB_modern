import { Player } from "../player/player";

/**
 * Represents a single game for a single player.
 */
export class PlayerGame {
    // This goes backwards - it starts at 20 min (1,200 seconds)
    private _time = 1200;

    constructor(public player: Player, public isInactive: boolean) {}
}
