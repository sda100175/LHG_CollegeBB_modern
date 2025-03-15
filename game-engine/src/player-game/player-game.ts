import { Player } from "../player/player";
import { TeamGame } from "../team-game/team-game";

/**
 * Represents a single game for a single player.
 */
export class PlayerGame {
    private _time = 1200;  // goes backward, starts at 20 min / 1,200 sec
    private _adjContribPct = -1;
    private _adjFoulDrawRating = -1;

    constructor(public player: Player, public isInactive: boolean, public teamGame: TeamGame) {}

    /**
     * Contribution rate
     */
    get contribPct() { return (this._adjContribPct >= 0) ? this._adjContribPct : this.player.contribPct }

    /**
     * Set a "per game" contribution pct for this player
     * @param {number} pct Adjusted contribution pct to use
     */
    set contribPct(pct: number) { this._adjContribPct = pct; }

    /**
     * Defensive rebounding prowess
     */
    get defReb40Minx10() { return this.player.defReb40Minx10 }

    /**
     * Player fatigue / remaining contribution points
     * TODO: there is code that adjusts initial fat up by 20% if there is no shot clock, not implemented
     *   here, should probably be done in game code:
     *     If sClockVal = 0 Then playerCX! = playerCX! * 1.2
     */
    get fatigue() { 
        let fat = this.contribPct;
        return fat;
    }

    /**
     * 3pt shot rate
     */
    get fg3OfTotalFgAtt() { return this.player.fg3OfTotalFgAtt }

    /**
     * 3pt FG pct
     */
    get fg3Pct() { return this.player.fg3Pct }

    /**
     * Gets propensity for committing fouls.
     */
    get foulCommitRating() {
        return (this.player.foulCommitRating === 0) ? 40 : this.player.foulCommitRating;
    }

    /**
     * Gets propensity for drawing fouls.
     */
    get foulDrawRating() {
        if (this._adjFoulDrawRating > 0) {
            return this._adjFoulDrawRating;
        } else if (this.player.foulDrawRating === 0) {
            return 6;
        } else {
            return this.player.foulDrawRating;
        }
    }

    /**
     * Set a game specific foul draw rating, adjusted from consuming class.
     * @param {number} rate Adjusted foul draw rating to use for this player.
     */
    set foulDrawRating(rate: number) { this._adjFoulDrawRating = rate }

    /**
     * Offensive rebounding prowess
     */
    get offReb40Minx10() { return this.player.offReb40Minx10 }

    /**
     * Inspect internal values of the class, mainly for debugging and testing.
     * @returns Object with private field values for testing.
     */
    inspect() {
        return {
            _time: this._time
        }
    }
}
