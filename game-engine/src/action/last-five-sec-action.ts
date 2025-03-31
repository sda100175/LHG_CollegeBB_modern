import { Game } from "../game/game";
import { Play, PlayType } from "../play/play";
import { LastFiveSecStrategy } from "../shared/strategy-helper";
import { Rand } from "../util";

export class LastFiveSecAction {
    private _game: Game;
    
    constructor(game: Game) { this._game = game }

    private _getBallCarrier() { return this._game.offTeam.lineup[Rand(4)] }

    /*
        // "Shoot from back court"
        If I1% = 2 Then

            rndFtLine = Int(Rnd(1) * 45) + 45

            pbpString$ = players$(P, lineupIdx(P, ballCarrier)) + " HAS THE BALL"
            Call PBP(P)

            pbpString$ = "PUTS IT UP FROM" + Str$(rndFtLine) + " FEET"
            Call PBP(P)
            Call DELAY

            If RN0 = 61 Then

                pbpString$ = "GOOD!!"
                Call PBP(P)

                'Reward at least 2 points (depends on if 3-pt shot is supported)
                score(P, currHalf) = score(P, currHalf) + 2
                score(P, 0) = score(P, 0) + 2

                Call CreditAssists

                plyrOff_GAME!(P, lineupIdx(P, ballCarrier), 8) = plyrOff_GAME!(P, lineupIdx(P, ballCarrier), 8) + 1
                plyrOff_GAME!(P, lineupIdx(P, ballCarrier), 7) = plyrOff_GAME!(P, lineupIdx(P, ballCarrier), 7) + 1

                If threePtOpt = 1 Then

                    'Add the "3rd" point
                    score(P, currHalf) = score(P, currHalf) + 1
                    score(P, 0) = score(P, 0) + 1

                    'Increase 3FGM + 3FGA
                    threeFG(P, lineupIdx(P, ballCarrier), 1) = threeFG(P, lineupIdx(P, ballCarrier), 1) + 1
                    threeFG(P, lineupIdx(P, ballCarrier), 0) = threeFG(P, lineupIdx(P, ballCarrier), 0) + 1

                End If

                Call UPDATESCREEN

            Else

                pbpString$ = "SHOT MISSES...GAME OVER"
                Call PBP(P)

                If autoPlay <> 1 Or playerMode <> 2 And backboard& Then
                    _SndPlay backboard&
                End If

                plyrOff_GAME!(P, lineupIdx(P, ballCarrier), 7) = plyrOff_GAME!(P, lineupIdx(P, ballCarrier), 7) + 1

                If threePtOpt = 1 Then
                    threeFG(P, lineupIdx(P, ballCarrier), 1) = threeFG(P, lineupIdx(P, ballCarrier), 1) + 1
                End If

            End If

            GoTo TIMEEXP

        End If
    */
    private _shootFromBackcourtOutcome() {
        const ballCarrier = this._getBallCarrier();
        // LEFT OFF HERE!!
    }
 
    getPlayOutcome() {
        const offTeam = this._game.offTeam;
        const rnd100 = Rand(100);

        if (offTeam.last5SecStrategy === LastFiveSecStrategy.FULL_COURT_PASS_SHOOT_2P && rnd100 <= 50) {
            return new Play(PlayType.L5S_LONG_PASS_INTERCEPTED, { team: offTeam, timeElapsed: this._game.gameClock });

        } else if (offTeam.last5SecStrategy === LastFiveSecStrategy.FULL_COURT_PASS_SHOOT_3P && rnd100 <= 33) {
            return new Play(PlayType.L5S_LONG_PASS_INTERCEPTED, { team: offTeam, timeElapsed: this._game.gameClock });

        } else if (offTeam.last5SecStrategy = LastFiveSecStrategy.SHOOT_FROM_BACK_COURT) {
            return this._shootFromBackcourtOutcome();
        }
    }
}