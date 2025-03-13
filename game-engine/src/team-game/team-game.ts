import { PlayerGame } from "../player-game/player-game";
import { Player } from "../player/player";
import { Team } from "../team/team";
import { Rand100 } from "../util";

export class TeamGame {
    private _adjFGAPerG = 0;
    private _adjOffSteal = 0;
    private _adjDefTurnover = 0;
    private _adjDefFoul = 0;
    private _adjOffTurnover = 0;

    roster: PlayerGame[] = [];
    
    constructor(public team: Team) {
        this._setAdjFGAPerG();
        this._initRoster();
        this._setAdjustedRatings();
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

    private _setAdjustedRatings() {
        // Offensive steal adjustments
        this._adjOffSteal = this.team.offStealRating;
        if (this._adjOffSteal > 20) this._adjOffSteal -= 100;
        
        // Defensive turnover adjustments
        this._adjDefTurnover = this.team.defTurnoverAdj;
        if (this._adjDefTurnover > 20) this._adjDefTurnover -= 100;

        // Defensive foul adjustments
        this._adjDefFoul = this.team.defFoulAdj;
        if (this._adjDefFoul > 20) this._adjDefFoul -= 100;

        // Offensive turnover adjustments
        this._adjOffTurnover = this.team.offTurnoverRating;
        if (this._adjOffTurnover === 0) this._adjOffTurnover = 4;
    }

    /**
     * Inspect internal values of the class, mainly for debugging and testing.
     * @returns Object with private field values for testing.
     */
    inspect() {
        return {
            _adjFGAPerG: this._adjFGAPerG,
            _adjOffSteal: this._adjOffSteal,
            _adjDefTurnover: this._adjDefTurnover,
            _adjDefFoul: this._adjDefFoul,
            _adjOffTurnover: this._adjOffTurnover
        }
    }
}
