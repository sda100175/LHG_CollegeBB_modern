import { Game } from "../game/game";
import { PlayerGame } from "../player-game/player-game";
import { Player } from "../player/player";
import { Stats } from "../stats/stats";
import { Team } from "../team/team";
import { Rand100 } from "../util";

export enum TeamGameControl {
    CPU = 0,
    HUMAN = 1
}

export enum DefensiveStrategy {
    SOLID_MTM = 0,
    PRESSURE_MTM = 1,
    ZONE_23 = 2,
    ZONE_131 = 3,
    FCP_SOLID_MTM = 4,
    FCP_RJ_SOLID_MTM = 5,
    FCP_RJ_PRESSURE_MTM = 6,
    ZONE_PRESS_221_ZONE_23 = 7,
    ZONE_PRESS_221_SOLID_MTM = 8,
    ZONE_PRESS_221_PRESSURE_MTM = 9,
    DIAMOND_ZONE_SOLID_MTM = 10,
    DIAMOND_ZONE_PRESSURE_MTM = 11,
    DIAMOND_ZONE_ZONE_23 = 12,
    DIAMOND_ZONE_ZONE_131 = 13,
    FCP_MTM_DENIAL = 14,
    ZONE_32 = 15,
    ZONE_PRESS_221_ZONE_32 = 16,
    DIAMOND_ZONE_ZONE_32 = 17
}

export class TeamGame {
    roster: PlayerGame[] = [];
    lineup: PlayerGame[] = [];
    defStrategy = DefensiveStrategy.SOLID_MTM;

    constructor(public team: Team, public control: TeamGameControl, public game: Game) {
        this._initRoster();
        this._adjustContribPct(game.gameAvgStamina);
        this._adjustFoulDrawRating(game.gameAvgStamina);
    }

    private _checkIfInactive(p: Player) {
        if (p.isPlaceholder()) return true;

        // If a random 1-100 number is greater than ((player games / team games) * 100)
        const rnd = Rand100();
        return (rnd > ((p.gamesPlayed / this.team.teamGamesPlayed) * 100));
    }

    // Adjust contribution percentages for each player to a per-game value
    private _adjustContribPct(gameAvgStamina: number) {
        let staminaSum = 0;

        // Adjust from overall team contribution to a "per game played" number
        this.roster.forEach(pg => {
            if (pg.isInactive === false) {
                if (this.team.teamGamesPlayed > 0 && pg.player.gamesPlayed > 0) {
                    pg.contribPct = pg.contribPct * this.team.teamGamesPlayed / pg.player.gamesPlayed;
                }
                staminaSum += pg.contribPct;    
            }
        });

        // Further adjust to account for the average pacing between the two teams. Also make sure no 
        // active players have a contribPct of 0 (instead use 1)
        this.roster.forEach(pg => {
            if (pg.isInactive === false) {
                pg.contribPct = pg.contribPct / staminaSum * gameAvgStamina;
                if (pg.contribPct < 1) { pg.contribPct = 1 }
            }
        });
    }

    // Adjusts stamina if '99' stats not used
    private _adjustFoulDrawRating(gameAvgStamina: number) {
        if (this.team.ifUsing99 !== 99 && gameAvgStamina > 120) {
            this.roster.forEach(pg => {
                pg.foulDrawRating = pg.foulDrawRating * (120 / gameAvgStamina)
            });
        }
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
                this.roster.push(new PlayerGame(p, isInactive, this));                    
            });    
        } while ( (actives < 10 && inactives < 4) || (inactives >= 5 && actives < 8));
    }

    /**
     * Adjusted pace (FGA per game adjusted for league)
     */
    get adjFGAPerG() { return 2 * this.team.teamFGAPerG - this.team.leagueFGAPerG }

    /**
     * Defensive 3pt shot taken rate
     */
    get def3FGAvFGAAdj() {
        return (this.team.def3FGAvFGAAdj > 20) ? this.team.def3FGAvFGAAdj - 100 : this.team.def3FGAvFGAAdj;
    }

    /**
     * 3pt pct against
     */
    get def3FGPctAdj() {
        return (this.team.def3FGPctAdj > 20) ? this.team.def3FGPctAdj - 100: this.team.def3FGPctAdj;
    }

    /**
     * Defensive fouling propensity
     */
    get defFoulAdj() {
        if (this.team.ifUsing99 !== 99) {
            return 0;
        } else if (this.team.defFoulAdj > 20) {
            return this.team.defFoulAdj - 100;
        } else {
            return this.team.defFoulAdj;
        }
    }

    /**
     * Defensive turnovers propensity
     */
    get defTurnoverAdj() {
        if (this.team.ifUsing99 !== 99) {
            return 0;
        } else if (this.team.defTurnoverAdj > 20) {
            return this.team.defTurnoverAdj - 100;
        } else {
            return this.team.defTurnoverAdj;
        }
    }

    /**
     * Offensive turnovers propensity
     */
    get offTurnoverRating() {
        if (this.team.ifUsing99 !== 99 || this.team.offTurnoverRating === 0) {
            return 4;
        } else {
            return this.team.offTurnoverRating;
        }
    }

    /**
     * Offensive steal propensity
     */
    get offStealRating() { 
        if (this.team.ifUsing99 !== 99) {
            return 0;
        } else if (this.team.offStealRating > 20) {
            return this.team.offStealRating - 100;
        } else {
            return this.team.offStealRating;
        }
    }

    /**
     * Get current game stats for this team.
     */
    get stats() { return Stats.compile(this.roster.map(pg => pg.stats)) }

    /**
     * Team year
     */
    get year() { return this.team.year }
}
