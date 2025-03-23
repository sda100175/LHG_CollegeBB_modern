import { ShotClockOption } from "../game-settings/game-settings";
import { Game } from "../game/game";
import { Player } from "../player/player";
import { Stats } from "../stats/stats";
import { TeamGame } from "../team-game/team-game";

/**
 * Represents a single game for a single player.
 */
export class PlayerGame {
    private _game: Game;  // convienence
    private _time = 1200;  // goes backward, starts at 20 min / 1,200 sec
    private _adjContribPct = -1;
    private _adjFoulDrawRating = -1;
    private _isPlayingSafe = false;

    stats = new Stats();
    
    constructor(public player: Player, public isInactive: boolean, public teamGame: TeamGame) {
        this._game = this.teamGame.game;
    }

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
     */
    get fatigue() { 
        let fat = this.contribPct;

        // Adjust up contribution for no shot clock era, coaches used less players back then
        if (this._game.gameSettings.shotClock === ShotClockOption.NONE) {
            fat *= 1.2;
        }

        // Subtract current FGA, rebounds, and fouls to get remaining contribution
        return fat - this.stats.fieldGoalsAtt - this.stats.totalRebounds - this.stats.personalFouls;
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

    // Get the "base" foul draw rating for this game. Can be set by the game, pulled from the 
    // player ratings, or defaults to 6.
    private _getBaseFoulDrawRating() {
        if (this._adjFoulDrawRating > 0) {
            return this._adjFoulDrawRating;
        } else if (this.player.foulDrawRating === 0) {
            return 6;
        } else {
            return this.player.foulDrawRating;
        }
    }

    // For "non-99" team ratings, if game stamina is over 120, adjust foul draw rating down some.
    private _adjustFoulDrawRatingForGameStamina(rating: number) {
        if (this.teamGame.team.ifUsing99 !== 99 && this._game.gameAvgStamina > 120) {
            rating *= (120 / this._game.gameAvgStamina);
        }

        return rating;
    }

    /**
     * Gets propensity for drawing fouls.
     */
    get foulDrawRating() {
        let rating = this._getBaseFoulDrawRating();
        rating = this._adjustFoulDrawRatingForGameStamina(rating);
                
        // LHCCB made a strange adjustment to this based on 3-pt shot propensity.
        // I'm not sure why it did this, but re-creating it here.
        if (this._game.gameSettings.threePtShots) {
            const twoPtAttPct = 100 - this.fg3OfTotalFgAtt;
            if (twoPtAttPct > 0) {
                const adjustment = 100 / twoPtAttPct;
                rating = rating * adjustment;
            }
        }

        return rating;
    }

    /**
     * Set a game specific foul draw rating, adjusted from consuming class.
     * @param {number} rate Adjusted foul draw rating to use for this player.
     */
    set foulDrawRating(rate: number) { this._adjFoulDrawRating = rate }

    /**
     * Has the player fouled out of this game?
     */
    get isFouledOut() { return (this.stats.personalFouls >= this._game.gameSettings.foulsToDisqualify) }

    /**
     * Is this player currently "playing safe"?
     */
    get isPlayingSafe() { return this._isPlayingSafe; }

    /**
     * Set player to "play safe". Only eligible if 3 fouls or less left in 1st half, or 1 foul left in 2nd half.
     */
    set isPlayingSafe(safe: boolean) {
        if (safe === false) {
            this._isPlayingSafe = false;
        } else if (this.isEligibleToPlaySafe()) {
            this._isPlayingSafe = true;
        }
    }

    /**
     * Offensive rebounding prowess
     */
    get offReb40Minx10() { return this.player.offReb40Minx10 }

    /**
     * Is this player eligible to "play safe"?
     * @returns {boolean} true if eligible to play safe
     */
    isEligibleToPlaySafe() {
        if (this._game.currHalf === 1 && (this.stats.personalFouls >= (this._game.gameSettings.foulsToDisqualify - 3))) {
            return true;
        } else if (this.stats.personalFouls >= (this._game.gameSettings.foulsToDisqualify - 1)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Inspect internal values of the class, mainly for debugging and testing.
     * @returns Object with private field values for testing.
     */
    inspect() {
        return {
            _time: this._time,
            _adjFoulDrawRating: this._adjFoulDrawRating
        }
    }
}
