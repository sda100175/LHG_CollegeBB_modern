import { OffensiveStrategy } from "../../shared/strategy-helper";
import { Rand100 } from "../../util";
import { ComputerCoach } from "../computer-coach";

export class OffensiveCoach {
    constructor(public cc: ComputerCoach) {}
    
    private _firstHalfStrategy() {
        let offStrategy = OffensiveStrategy.NORMAL;
        let rnd0 = Rand100();

        switch (true) {
            case (rnd0 >= 1 && rnd0 <= 75): offStrategy = OffensiveStrategy.NORMAL; break;
            case (rnd0 >= 76 && rnd0 <= 94): offStrategy = OffensiveStrategy.AGGRESSIVE; break;
            case (rnd0 >= 95 && rnd0 <= 100): offStrategy = OffensiveStrategy.SAFE; break;
        }

        return offStrategy;
    }

    private _secondHalfOrLaterAndWinningOrTied() {
        let rnd0 = Rand100();

        if (rnd0 <= 85) {
            return OffensiveStrategy.NORMAL;
        } else {
            return OffensiveStrategy.SAFE;
        }
    }

    private _secondHalfOrLaterLosingUnder3Min() {
        let rnd0 = Rand100();

        if (rnd0 <= 30) {
            return OffensiveStrategy.QUICK;
        } else {
            /* Strange strategy to use but it matches what was in LHCCB code */
            return OffensiveStrategy.DELAY;
        }
    }

    private _secondHalfOrLaterLosingOver3Min() {
        let rnd0 = Rand100();

        if (rnd0 <= 70) {
            return OffensiveStrategy.NORMAL;
        } else {
            return OffensiveStrategy.AGGRESSIVE;
        }
    }

    getStrategyRecommendation() {
        const scoreDiff = this.cc.getScoreDiff();
        const g = this.cc.teamGame.game;

        if (g.currHalf === 1) {
            return this._firstHalfStrategy();

        } else if (g.gameClock <= 60 && scoreDiff <= -3 && g.gameSettings.threePtShots) {
            // Losing by 3 or more in last minute.
            return OffensiveStrategy.SHOOT_ONLY_3S;

        } else if (scoreDiff >= 0) {
            return this._secondHalfOrLaterAndWinningOrTied();

        } else if (g.gameClock <= 180) {
            return this._secondHalfOrLaterLosingUnder3Min();

        } else {
            return this._secondHalfOrLaterLosingOver3Min();
        }
    }
}
