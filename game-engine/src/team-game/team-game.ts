import { PlayerGame } from "../player-game/player-game";
import { Player } from "../player/player";
import { Team } from "../team/team";
import { Rand100 } from "../util";

export class TeamGame {
    private _adjFGAPerG = 0;

    roster: PlayerGame[] = [];
    
    constructor(public team: Team) {
        this._setAdjFGAPerG();
        this._initRoster();
    }

    private _checkIfInactive(p: Player) {
        if (p.isPlaceholder()) return true;

        // If a random 1-100 number is greater than ((player games / team games) * 100)
        const rnd = Rand100();
        return (rnd > ((p.gamesPlayed / this.team.teamGamesPlayed) * 100));
    }

    // Ensures adequate roster construction, enough actives, inactivate placeholders, etc.
    private _initRoster() {
        let actives: number, inactives: number;
        do {
            actives = inactives = 0;
            this.roster = [];
            this.team.players.forEach(p => {
                const isInactive = this._checkIfInactive(p);
                if (isInactive) {
                    inactives++;
                } else {
                    actives++;
                }
                this.roster.push(new PlayerGame(p, isInactive));                    
            });    
        } while ( (actives < 10 && inactives < 4) || (inactives >= 5 && actives < 8));
    }

    private _setAdjFGAPerG() {
        this._adjFGAPerG = 2 * this.team.teamFGAPerG - this.team.leagueFGAPerG;
    }

    /**
     * Inspect internal values of the class, mainly for debugging and testing.
     * @returns Object with private field values for testing.
     */
    inspect() {
        return {
            _adjFGAPerG: this._adjFGAPerG
        }
    }
}
