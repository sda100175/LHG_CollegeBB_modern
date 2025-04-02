import { ComputerCoach } from "../computer-coach/computer-coach";
import { Game } from "../game/game";
import { PlayerGame } from "../player-game/player-game";
import { Player } from "../player/player";
import { DefensiveStrategy, LastFiveSecStrategy, OffensiveStrategy } from "../shared/strategy-helper";
import { Stats } from "../stats/stats";
import { Team } from "../team/team";
import { Rand, Rand100 } from "../util";

export enum TeamGameControl {
    CPU = 0,
    HUMAN = 1
}

export enum LineupErrorCode {
    INCOMPLETE = 0,
    INVALID_PLAYER = 1,
    DUPLICATE_PLAYER = 2
}

export class LineupError extends Error {
    constructor(public code: LineupErrorCode) {
        super();
    }
}

export class TeamGame {
    private _foulsForHalf = 0;
    private _timeouts = 5;
    private _coach: ComputerCoach | null = null;
    
    roster: PlayerGame[] = [];
    lineup: PlayerGame[] = [];
    defStrategy = DefensiveStrategy.SOLID_MTM;
    offStrategy = OffensiveStrategy.NORMAL;
    last5SecStrategy = LastFiveSecStrategy.NONE;
    
    constructor(public team: Team, public control: TeamGameControl, public game: Game) {
        this._initRoster();
        this._adjustContribPct(game.gameAvgStamina);
        this._coach = (control === TeamGameControl.CPU) ? new ComputerCoach(this) : null;
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
     * Add a team foul for the half.
     */
    addFoulForHalf() { this._foulsForHalf++ }

    /**
     * Check lineup for validity. Used to validate human coach moves.
     * @throws {LineupError} Error explaining a problem with the lineup.
     */
    checkLineup() {
        if (this.lineup.length !== 5) {
            throw new LineupError(LineupErrorCode.INCOMPLETE);
        }

        const uniques = [...new Set(this.lineup)];
        if (uniques.length !== 5) {
            throw new LineupError(LineupErrorCode.DUPLICATE_PLAYER);
        }

        const valids = this.lineup.filter(pg => pg.isInactive === false && pg.isFouledOut === false);
        if (valids.length !== 5) {
            throw new LineupError(LineupErrorCode.INVALID_PLAYER);
        }
    }

    /**
     * Reset the fouls for half to zero.
     */
    resetFoulsForHalf() { this._foulsForHalf = 0 }

    /**
     * Adjusted pace (FGA per game adjusted for league)
     */
    get adjFGAPerG() { return 2 * this.team.teamFGAPerG - this.team.leagueFGAPerG }

    /**
     * Adjusted FG pct allowed. Adds +1 for every player "playing safe" in the lineup.
     */
    get defFGPctAdj() {
        const playingSafeAdj = this.lineup.filter(pg => pg.isPlayingSafe).length;
        return this.team.defFGPctAdj + playingSafeAdj;
    }

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
     * Sum of foulCommitRating for players currently in the lineup.
     */
    get foulCommitRatingSum() {
        return this.lineup.map(pg => pg.foulCommitRating).reduce((acc, v) => acc + v);
    }

    /**
     * Number of fouls committed for current half.
     */
    get foulsForHalf() { return this._foulsForHalf }

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
     * Get timeouts left.
     */
    get timeouts() { return this._timeouts }

    /**
     * Team year
     */
    get year() { return this.team.year }

    /**
     * Add time to time played by current lineup.
     * @param elapsed Time played by current lineup
     */
    addTimePlayed(elapsed: number) { this.lineup.forEach(pg => pg.addTimePlayed(elapsed)) }

    /**
     * @param shooter Player that shot the ball
     * @returns {PlayerGame | null} Player to credit with assist, or null if no assist.
     */
    getAssistPlayer(shooter: PlayerGame) {
        const assistPlayer = this.getRandomLineupPlayer();

        // Picked same player as shooter, no assist.
        if (assistPlayer === shooter) { return null }

        // Calculate likelihood of assist based on assist rating
        let assistChance = 0;
        if (assistPlayer.assistRating === 0) {
            assistChance = Rand(4);
        } else if (assistPlayer.assistRating === 1 || assistPlayer.assistRating === 2) {
            assistChance = Rand(3);
        } else if (assistPlayer.assistRating === 3 || assistPlayer.assistRating === 4) {
            assistChance = Rand(2);
        } else {
            assistChance = Rand(assistPlayer.assistRating * 0.8);
        }

        if (assistChance < assistPlayer.assistRating 
            || (assistPlayer.assistRating > 4 && assistChance < (assistPlayer.assistRating - 3))
        ) {
            // Credit the assist
            return assistPlayer;
        } else {
            return null;
        }
    }
    
    /**
     * @returns {PlayerGame} Random player currently in the lineup.
     */
    getRandomLineupPlayer() { return this.lineup[Rand(4)] }

    /**
     * Sets strategy if computer-controlled.
     */
    setStrategy() { 
        if (this._coach) {
            this._coach.setStrategy();
        }
    }
    
    /**
     * Sets lineup (subs) if computer-controlled.
     */
    setLineup() { 
        if (this._coach) {
            this._coach.setLineup();
        }
    }

    /**
     * Sets last 5 second and close strategy.
     */
    setLast5SecStrategy() {
        if (this._coach) {
            this._coach.setLast5SecSituationStrategy();
        }
    }

    /**
     * Use a timeout
     * @returns {boolean} True if a timeout was taken, false if team was out of timeouts.
     */
    takeTimeout() {
        if (this._timeouts === 0) {
            return false;
        } else {
            this._timeouts--;
            return true;
        }
    }
}
