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
    LAST_5_SEC_SITUATION = 7   // 5 or less seconds left and offensive team down by one score or less
}

/**
 * One single play in the game that can be reflected in the UI or stored for playback.
 */
export class Play {
    private _stats: Stats;
    
    constructor(public type: PlayType, public team: TeamGame | null, public player: PlayerGame | null,
        public timeElapsed: number, apply = true
    ) {
        this._stats = new Stats();
        this._setStats();

        if (apply && this.player) { this.player.stats.add(this._stats) }
    }

    // Based on play type, update the stats for this play.
    private _setStats() {
        switch (this.type) {
            case PlayType.FG_MADE_2PT:
                this._stats.fieldGoalsAtt = 1;
                this._stats.fieldGoalsMade = 1;
                this._stats.pointsScored = 2;
                break;
            case PlayType.FG_MISS_2PT:
                this._stats.fieldGoalsAtt = 1;
                this._stats.fieldGoalsMade = 1;
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
