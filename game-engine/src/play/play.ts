import { PlayerGame } from "../player-game/player-game";
import { Stats } from "../stats/stats";
import { TeamGame } from "../team-game/team-game";

export enum PlayType {
    NO_OP = 0,
    JUMP_BALL = 1,
    INBOUND_BALL = 2,
    END_OF_HALF = 3,
    END_OF_GAME = 4,
    FG_MADE_2PT = 5,
    FG_MISS_2PT = 6,
    LAST_5_SEC_SITUATION = 7,        // 5 or less seconds left and offensive team down by one score or less
    L5S_LONG_PASS_INTERCEPTED = 8,   // last play was a long inbounds intercepted, time expired
    L5S_FG_MADE_BACKCOURT_2PT = 9,   // last play was a long 2pt from the back court, time expired
    L5S_FG_MADE_BACKCOURT_3PT = 10,  // last play was a long 3pt from the back court, time expired
    L5S_FG_MISS_BACKCOURT_2PT = 11,  // last play was a long 2pt miss from the back court, time expired
    L5S_FG_MISS_BACKCOURT_3PT = 12,  // last play was a long 3pt miss from the back court, time expired
    L5S_TURNOVER = 13                // last play resulted in a turnover, time expired
}

/**
 * Data associated with a given play. Many play types don't require all of it.
 */
export interface IPlayData {
    team?: TeamGame;
    player?: PlayerGame;
    assistPlayer?: PlayerGame;  // generally assisting player on made shot
    timeElapsed?: number;
}

/**
 * One single play in the game that can be reflected in the UI or stored for playback.
 */
export class Play {
    private _stats: Stats;
    
    constructor(public type: PlayType, public data: IPlayData, apply = true) {
        this._stats = new Stats();
        this._setStats();

        if (apply) { this._applyStatsToPlayers() }
    }

    private _applyStatsToPlayers() {
        if (this.data.player) { this.data.player.stats.add(this._stats) }

        if (this.data.assistPlayer) { 
            this._stats.assists = 1;
            this.data.assistPlayer.stats.assists += 1;
        }
    }

    // Based on play type, update the stats for this play.
    private _setStats() {
        switch (this.type) {
            case PlayType.FG_MADE_2PT:
            case PlayType.L5S_FG_MADE_BACKCOURT_2PT:
                this._stats.fieldGoalsAtt = 1;
                this._stats.fieldGoalsMade = 1;
                this._stats.pointsScored = 2;
                break;
            case PlayType.FG_MISS_2PT:
            case PlayType.L5S_FG_MISS_BACKCOURT_2PT:
                this._stats.fieldGoalsAtt = 1;
                break;
            case PlayType.L5S_FG_MADE_BACKCOURT_3PT:
                this._stats.fieldGoals3PtAtt = 1;
                this._stats.fieldGoals3PtMade = 1;
                this._stats.pointsScored = 3;
                break;
            case PlayType.L5S_FG_MISS_BACKCOURT_3PT:
                this._stats.fieldGoals3PtAtt = 1;
                break;
            default:
                break;  // This type has no associated stats to record.
        }
    }

    /**
     * Allow running coaching option after this play?
     */
    get coachingAllowed()  {
        switch (this.type) {
            case PlayType.FG_MADE_2PT:
            case PlayType.END_OF_HALF:
            case PlayType.LAST_5_SEC_SITUATION:
                return true;
            default:
                return false;
        }
    }

    /**
     * Get associated statistics for this play.
     */
    get stats() { return this._stats }

    /**
     * Allow substitutions after this play?
     */
    get subsAllowed() {
        switch (this.type) {
            case PlayType.END_OF_HALF:
                return true;
            default:
                return false;
        }
    }
}
