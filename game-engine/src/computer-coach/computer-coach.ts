import { Game } from "../game/game";
import { PlayerGame } from "../player-game/player-game";
import { TeamGame } from "../team-game/team-game";

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

    /**
     * Player is not available if inactive or already fouled out.
     */
    isInvalidPlayer() {
        return (this.playerGame.isInactive || this.playerGame.isFouledOut);
    }
}

export class ComputerCoach {
    constructor(public teamGame: TeamGame) {
        this.setLineup();
    }

    setLineup() {
        // Map roster, sort by effective stamina (descending order)
        const roster = this.teamGame.roster.map(pg => new PlayerEval(pg));
        roster.sort((a, b) => b.effectiveStamina - a.effectiveStamina);

        // Slot players into the lineup
        const lineup: PlayerEval[] = [];
        for (let lineupSlot = 0, rosterSlot = 0; lineupSlot < 5 && rosterSlot < roster.length; rosterSlot++) {
            const pe = roster[rosterSlot];
            
            // Don't slot this player if any of these conditions are met
            if (pe.isInvalidPlayer() || pe.isInFoulTrouble() || pe.isOverContributing()) { continue }

            // Otherwise, go ahead and slot this player.
            lineup[lineupSlot] = roster[rosterSlot];
            lineupSlot++;
        }

        // Set lineup in TeamGame
        for (let lineupSlot = 0; lineupSlot < 5; lineupSlot++) { 
            this.teamGame.lineup[lineupSlot] = lineup[lineupSlot].playerGame;
        }
    }
}
