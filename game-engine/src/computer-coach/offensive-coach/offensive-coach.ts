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
            case (rnd0 >= 76 && rnd0 <= 94): offStrategy = OffensiveStrategy.AGGRESIVE; break;
            case (rnd0 >= 95 && rnd0 <= 100): offStrategy = OffensiveStrategy.SAFE; break;
        }

        return offStrategy;
    }

    getStrategyRecommendation() {
        const scoreDiff = this.cc.getScoreDiff();
        const g = this.cc.teamGame.game;

        if (g.currHalf === 1) {
            return this._firstHalfStrategy();
        }
    }
}