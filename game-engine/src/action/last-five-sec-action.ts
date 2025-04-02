import { Game } from "../game/game";
import { Play, PlayType } from "../play/play";
import { LastFiveSecStrategy } from "../shared/strategy-helper";
import { Rand } from "../util";

export class LastFiveSecAction {
    private _game: Game;
    
    constructor(game: Game) { this._game = game }

    private _shootFromBackcourtOutcome(rnd100: number) {
        const ballCarrier = this._game.offTeam.getRandomLineupPlayer();

        if (rnd100 === 61) {
            // Miracle shot made
            const type = (this._game.gameSettings.threePtShots) ? PlayType.L5S_FG_MADE_BACKCOURT_3PT : PlayType.L5S_FG_MADE_BACKCOURT_2PT;
            return new Play(type, { 
                team: this._game.offTeam,
                player: ballCarrier,
                assistPlayer: this._game.offTeam.getAssistPlayer(ballCarrier) || undefined,
                timeElapsed: this._game.gameClock
            });

        } else {
            // Miracle shot missed
            const type = (this._game.gameSettings.threePtShots) ? PlayType.L5S_FG_MISS_BACKCOURT_3PT : PlayType.L5S_FG_MISS_BACKCOURT_2PT;
            return new Play(type, { 
                team: this._game.offTeam,
                player: ballCarrier,
                timeElapsed: this._game.gameClock
            });
        }
    }
 
    getPlayOutcome() {
        const offTeam = this._game.offTeam;
        const rnd100 = Rand(100);

        // Shooting from back court, it either goes in or doesn't
        if (offTeam.last5SecStrategy === LastFiveSecStrategy.SHOOT_FROM_BACK_COURT) {
            return this._shootFromBackcourtOutcome(rnd100);
        }

        // Other outcomes
        if (offTeam.last5SecStrategy === LastFiveSecStrategy.FULL_COURT_PASS_SHOOT_2P && rnd100 <= 50) {
            return new Play(PlayType.L5S_LONG_PASS_INTERCEPTED, { team: offTeam, timeElapsed: this._game.gameClock });

        } else if (offTeam.last5SecStrategy === LastFiveSecStrategy.FULL_COURT_PASS_SHOOT_3P && rnd100 <= 33) {
            return new Play(PlayType.L5S_LONG_PASS_INTERCEPTED, { team: offTeam, timeElapsed: this._game.gameClock });

        } else if (offTeam.last5SecStrategy <= LastFiveSecStrategy.TIME_OUT_AT_HALF_COURT && rnd100 <= 18) {
            return new Play(PlayType.L5S_TURNOVER, { team: offTeam, timeElapsed: this._game.gameClock });
        }

        // LEFT OFF HERE... there are more outcomes to code out
    }
}
