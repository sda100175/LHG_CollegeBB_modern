import { Game } from "../game/game";
import { PlayerGame } from "../player-game/player-game";
import { DefensiveStrategy } from "../shared/strategy-helper";
import { TeamGame } from "../team-game/team-game";
import { DefensiveCoach } from "./defensive-coach/defensive-coach";
import { OffensiveCoach } from "./offensive-coach/offensive-coach";

class PlayerEval {
    game: Game;
    effectiveStamina = 0;

    constructor(public playerGame: PlayerGame) {
        this.game = this.playerGame.teamGame.game;
        this._setEffectiveStamina();
    }
    
    _setEffectiveStamina() {
        if (this.game.currHalf > 2 || (this.game.currHalf === 2 && this.game.gameClock <= 120)) {
            // End of game or overtime, no stamina penalties
            this.effectiveStamina = this.playerGame.contribPct;
        } else if (this.playerGame.isFouledOut) {
            this.effectiveStamina = 0;
        } else {
            this.effectiveStamina = this.playerGame.fatigue;
        }
    }

    /**
     * Is player over-contributing up to this point in the game?
     */
    isOverContributing() {
        const contribPctLeft = this.effectiveStamina / this.playerGame.contribPct;

        // Less than half of contribution left before halftime
        if (this.game.currHalf === 1 && contribPctLeft < 0.5) {
            return true;
        }

        // Used 25% or more of contribution before 10:00 mark of first half
        if (this.game.currHalf === 1 && this.game.gameClock >= 600 && contribPctLeft < 0.75) {
            return true;
        }

        // Used 75% or more of contribution before 10:00 mark of second half
        if (this.game.currHalf === 2 && this.game.gameClock >= 600 && contribPctLeft < 0.25) {
            return true;
        }

        // Used 87% or more of contribution before 5:00 mark of second half
        if (this.game.currHalf === 2 && this.game.gameClock >= 300 && this.game.gameClock < 600 && contribPctLeft < 0.13) {
            return true
        }

        // Adjustment for last 5 minutes of the game
        if (this.game.currHalf === 2 && this.game.gameClock < 300 && contribPctLeft < (this.game.gameClock / 2400)) {
            return true;
        }

        // No contribution left, but only if > 2 minutes left in game.
        if ( ((this.game.currHalf === 2 && this.game.gameClock > 120) || this.game.currHalf < 2) && contribPctLeft <= 0) {
            return true;
        }

        return false;
    }

    /**
     * Is this player currently in foul trouble?
     */
    isInFoulTrouble() {
        const fouls = this.playerGame.stats.personalFouls;
        const foulsToDQ = this.game.gameSettings.foulsToDisqualify;

        // First half and 2 or less fouls to give
        if (this.game.currHalf === 1 && fouls >= (this.game.gameSettings.foulsToDisqualify - 2)) {
            return true;
        }

        // Second half, 1 foul to give, and over 12 minutes left in the half.
        if ( (fouls >= foulsToDQ - 1) && (this.game.currHalf === 2 && this.game.gameClock > 720) ) {
            return true;
        }

        return false;
    }

    get isInactive() { return this.playerGame.isInactive }

    get isFouledOut() { return this.playerGame.isFouledOut }
}

export class ComputerCoach {
    defCoach: DefensiveCoach;
    offCoach: OffensiveCoach;

    constructor(public teamGame: TeamGame) {
        this.defCoach = new DefensiveCoach(this);
        this.offCoach = new OffensiveCoach(this);
        this.makeCoachingDecisions();
    }

    // Make lineup out by who has most contribution left. Can avoid players in foul trouble or players "over-contributing"
    // to this point in the game as well.
    private _slotByStamina(checkFouls = true, checkContribution = true, checkFouledOut = true) {
        // Map roster, sort by effective stamina (descending order)
        const roster = this.teamGame.roster.map(pg => new PlayerEval(pg));
        roster.sort((a, b) => b.effectiveStamina - a.effectiveStamina);

        // Slot players into the lineup, skipping due to foul trouble or over contribution
        const lineup: PlayerEval[] = [];
        for (let rosterSlot = 0; lineup.length < 5 && rosterSlot < roster.length; rosterSlot++) {
            const pe = roster[rosterSlot];

            // Never slot players that are inactive.
            if (pe.isInactive) { continue }

            // Avoid players that have fouled out (optional but only when not enough eligible players)
            if (checkFouledOut && pe.isFouledOut) { continue }

            // Avoid players in foul trouble (optional)
            if (checkFouls && pe.isInFoulTrouble()) { continue }

            // Avoid players that are "over-contributing" to this point in the game (optional)
            if (checkContribution && pe.isOverContributing()) { continue }
 
            // If good, go ahead and slot this player.
            lineup.push(roster[rosterSlot]);
        }

        return lineup;
    }

    makeCoachingDecisions() {
        this.setLineup();
        this.setStrategy();
    }

    getOpposingTeamGame() {
        const g = this.teamGame.game;
        return (g.visitorTeamGame === this.teamGame) ? g.homeTeamGame : g.visitorTeamGame;
    }

    getScoreDiff() {
        const us = this.teamGame;
        const them = this.getOpposingTeamGame();
        return (us.stats.pointsScored - them.stats.pointsScored);
    }

    setLineup() {
        // Initial run - slot by stamina, accounting for foul trouble and over-contributions.
        let lineup = this._slotByStamina();

        // Didn't get enough players - try again only eliminating truly unavailable players.
        if (lineup.length < 5) { lineup = this._slotByStamina(false, false) }

        // It is possible - if too many players fouled out - to not have a full lineup here.
        // In this case you have to insert fouled out players, no other option. In actual NCAA there
        // is the "phantom rule" that allows them to keep playing with extra foul penalties.
        if (lineup.length < 5) { lineup = this._slotByStamina(false, false, false) }

        // Sort the lineup by defensive rebounding, lowest to highest.
        lineup.sort((a, b) => a.playerGame.defReb40Minx10 - b.playerGame.defReb40Minx10);

        // Set actual lineup in TeamGame
        for (let lineupSlot = 0; lineupSlot < lineup.length; lineupSlot++) { 
            this.teamGame.lineup[lineupSlot] = lineup[lineupSlot].playerGame;
        }
    }

    setStrategy() {
        this.teamGame.defStrategy = this.defCoach.getStrategyRecommendation();
        this.teamGame.offStrategy = this.offCoach.getStrategyRecommendation();        
    }

    /**
     * Used for testing or debugging only, exposes some private implementation details.
     */
    inspect() {
        return {
            slotByStamina: this._slotByStamina.bind(this)
        }
    }
}
