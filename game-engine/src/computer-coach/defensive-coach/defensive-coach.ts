import { DefensiveStrategy } from "../../team-game/team-game";
import { Rand100 } from "../../util";
import { ComputerCoach } from "../computer-coach";

export class DefensiveCoach {
    private static _firstHalfStrategyWhenLosing() {
        let defStrategy = DefensiveStrategy.SOLID_MTM;
        let rnd0 = Rand100();

        // Basically just running a weighted random strategy. Simplified some from original code (same result though).
        switch (true) {
            case (rnd0 >= 1 && rnd0 <= 3): defStrategy = DefensiveStrategy.DIAMOND_ZONE_SOLID_MTM;  break;
            case (rnd0 === 4 || rnd0 === 5): defStrategy = DefensiveStrategy.ZONE_PRESS_221_PRESSURE_MTM;  break;
            case (rnd0 === 6): defStrategy = DefensiveStrategy.ZONE_PRESS_221_ZONE_32; break;
            case (rnd0 >= 7 && rnd0 <= 9): defStrategy = DefensiveStrategy.ZONE_PRESS_221_ZONE_23; break;
            case (rnd0 >= 10 && rnd0 <= 12): defStrategy = DefensiveStrategy.ZONE_PRESS_221_SOLID_MTM; break;
            case (rnd0 >= 13 && rnd0 <= 14): defStrategy = DefensiveStrategy.FCP_SOLID_MTM; break;
            case (rnd0 === 15): defStrategy = DefensiveStrategy.ZONE_32; break;
            case (rnd0 >= 16 && rnd0 <= 43): defStrategy = DefensiveStrategy.SOLID_MTM; break;
            case (rnd0 >= 44 && rnd0 <= 67): defStrategy = DefensiveStrategy.PRESSURE_MTM; break;
            case (rnd0 >= 68 && rnd0 <= 92): defStrategy = DefensiveStrategy.ZONE_23; break;
            case (rnd0 === 93 || rnd0 === 94): defStrategy = DefensiveStrategy.ZONE_32; break;
            case (rnd0 >= 95 && rnd0 <= 100): defStrategy = DefensiveStrategy.ZONE_131; break;
        }

        return defStrategy;
    }

    // LHCCB used same defensive strategies in either half when winning.
    private static _strategyWhenWinning() {
        let defStrategy = DefensiveStrategy.SOLID_MTM;
        let rnd0 = Rand100();

        // Basically just running a weighted random strategy. Simplified some from original code (same result though).
        switch (true) {
            case (rnd0 >= 1 && rnd0 <= 5): defStrategy = DefensiveStrategy.FCP_RJ_SOLID_MTM; break;
            case (rnd0 >= 6 && rnd0 <= 9): defStrategy = DefensiveStrategy.ZONE_PRESS_221_SOLID_MTM; break;
            case (rnd0 === 10): defStrategy = DefensiveStrategy.ZONE_PRESS_221_ZONE_23; break;
            case (rnd0 === 11): defStrategy = DefensiveStrategy.ZONE_PRESS_221_ZONE_32; break;
            case (rnd0 >= 12 && rnd0 <= 46): defStrategy = DefensiveStrategy.SOLID_MTM; break;
            case (rnd0 >= 47 && rnd0 <= 74): defStrategy = DefensiveStrategy.PRESSURE_MTM; break;
            case (rnd0 >= 75 && rnd0 <= 98): defStrategy = DefensiveStrategy.ZONE_23; break;
            case (rnd0 === 99 || rnd0 === 100): defStrategy = DefensiveStrategy.ZONE_32; break;
        }

        return defStrategy;
    }

    static getStrategyRecommendation(cc: ComputerCoach) {
        const scoreDiff = cc.getScoreDiff();

        if (scoreDiff >= 0) {
            return this._strategyWhenWinning();

        } else if (cc.teamGame.game.currHalf === 1 && scoreDiff < 0) {
            return this._firstHalfStrategyWhenLosing();
        }        
    }
}