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

    private static _secondHalfLosingByLessThan10Over5MinLeft() {
        let defStrategy = DefensiveStrategy.SOLID_MTM;
        let rnd0 = Rand100();

        switch (true) {
            case (rnd0 >= 1 && rnd0 <= 52): defStrategy = DefensiveStrategy.SOLID_MTM; break;
            case (rnd0 >= 53 && rnd0 <= 75): defStrategy = DefensiveStrategy.PRESSURE_MTM; break;
            case (rnd0 >= 76 && rnd0 <= 84): defStrategy = DefensiveStrategy.ZONE_23; break;
            case (rnd0 === 85): defStrategy = DefensiveStrategy.ZONE_32; break;
            case (rnd0 >= 86 && rnd0 <= 93): defStrategy = DefensiveStrategy.FCP_RJ_SOLID_MTM; break;
            case (rnd0 >= 94 && rnd0 <= 97): defStrategy = DefensiveStrategy.ZONE_131; break;
            case (rnd0 >= 98 && rnd0 <= 100): defStrategy = DefensiveStrategy.DIAMOND_ZONE_ZONE_23; break;
        }

        return defStrategy;
    }

    private static _secondHalfLosingBy10To20Over5MinLeft() {
        let defStrategy = DefensiveStrategy.SOLID_MTM;
        let rnd0 = Rand100();

        switch (true) {
            case (rnd0 >= 1 && rnd0 <= 57): defStrategy = DefensiveStrategy.SOLID_MTM; break;
            case (rnd0 >= 58 && rnd0 <= 86): defStrategy = DefensiveStrategy.FCP_SOLID_MTM; break;
            case (rnd0 >= 87 && rnd0 <= 94): defStrategy = DefensiveStrategy.PRESSURE_MTM; break;
            case (rnd0 >= 95 && rnd0 <= 99): defStrategy = DefensiveStrategy.DIAMOND_ZONE_SOLID_MTM; break;
            case (rnd0 === 100): defStrategy = DefensiveStrategy.DIAMOND_ZONE_PRESSURE_MTM; break;
        }

        return defStrategy;
    }

    private static _secondHalfLosingBy20PlusOver5MinLeft() {
        let defStrategy = DefensiveStrategy.SOLID_MTM;
        let rnd0 = Rand100();

        switch (true) {
            case (rnd0 >= 1 && rnd0 <= 42): defStrategy = DefensiveStrategy.SOLID_MTM; break;
            case (rnd0 >= 43 && rnd0 <= 80): defStrategy = DefensiveStrategy.PRESSURE_MTM; break;
            case (rnd0 >= 81 && rnd0 <= 92): defStrategy = DefensiveStrategy.FCP_RJ_PRESSURE_MTM; break;
            case (rnd0 >= 93 && rnd0 <= 97): defStrategy = DefensiveStrategy.DIAMOND_ZONE_SOLID_MTM; break;
            case (rnd0 >= 98 && rnd0 <= 100): defStrategy = DefensiveStrategy.DIAMOND_ZONE_PRESSURE_MTM; break;
        }

        return defStrategy;
    }

    private static _secondHalfLosingOver5Min(scoreDiff: number) {
        scoreDiff = Math.abs(scoreDiff);

        if (scoreDiff < 10) {
            return this._secondHalfLosingByLessThan10Over5MinLeft();

        } else if (scoreDiff >= 10 && scoreDiff <= 20) {
            return this._secondHalfLosingBy10To20Over5MinLeft();

        } else {
            return this._secondHalfLosingBy20PlusOver5MinLeft();
        }
    }

    private static _secondHalfLosingByLessThan102To5MinLeft() {
        let defStrategy = DefensiveStrategy.SOLID_MTM;
        let rnd0 = Rand100();

        switch (true) {
            case (rnd0 >= 1 && rnd0 <= 52): defStrategy = DefensiveStrategy.SOLID_MTM; break;
            case (rnd0 >= 53 && rnd0 <= 71): defStrategy = DefensiveStrategy.ZONE_23; break;
            case (rnd0 === 72): defStrategy = DefensiveStrategy.ZONE_32; break;
            case (rnd0 >= 73 && rnd0 <= 78): defStrategy = DefensiveStrategy.PRESSURE_MTM; break;
            case (rnd0 >= 79 && rnd0 <= 100): defStrategy = DefensiveStrategy.DIAMOND_ZONE_SOLID_MTM; break;
        }

        return defStrategy;
    }

    private static _secondHalfLosingBy10To202To5MinLeft() {
        let defStrategy = DefensiveStrategy.SOLID_MTM;
        let rnd0 = Rand100();

        switch (true) {
            case (rnd0 >= 1 && rnd0 <= 52): defStrategy = DefensiveStrategy.SOLID_MTM; break;
            case (rnd0 >= 53 && rnd0 <= 80): defStrategy = DefensiveStrategy.PRESSURE_MTM; break;
            case (rnd0 >= 81 && rnd0 <= 90): defStrategy = DefensiveStrategy.FCP_RJ_SOLID_MTM; break;
            case (rnd0 >= 91 && rnd0 <= 100): defStrategy = DefensiveStrategy.DIAMOND_ZONE_ZONE_23; break;
        }

        return defStrategy;
    }

    private static _secondHalfLosingBy20Plus2To5MinLeft() {
        let defStrategy = DefensiveStrategy.SOLID_MTM;
        let rnd0 = Rand100();

        switch (true) {
            case (rnd0 >= 1 && rnd0 <= 52): defStrategy = DefensiveStrategy.SOLID_MTM; break;
            case (rnd0 >= 53 && rnd0 <= 74): defStrategy = DefensiveStrategy.PRESSURE_MTM; break;
            case (rnd0 >= 75 && rnd0 <= 84): defStrategy = DefensiveStrategy.FCP_RJ_SOLID_MTM; break;
            case (rnd0 >= 85 && rnd0 <= 94): defStrategy = DefensiveStrategy.DIAMOND_ZONE_SOLID_MTM; break;
            case (rnd0 >= 95 && rnd0 <= 100): defStrategy = DefensiveStrategy.DIAMOND_ZONE_ZONE_131; break;
        }

        return defStrategy;
    }

    private static _secondHalfLosing2To5Min(scoreDiff: number) {
        scoreDiff = Math.abs(scoreDiff);

        if (scoreDiff < 10) {
            return this._secondHalfLosingByLessThan102To5MinLeft();

        } else if (scoreDiff >= 10 && scoreDiff <= 20) {
            return this._secondHalfLosingBy10To202To5MinLeft();

        } else {
            return this._secondHalfLosingBy20Plus2To5MinLeft();
        }
    }

    static getStrategyRecommendation(cc: ComputerCoach) {
        const scoreDiff = cc.getScoreDiff();
        const g = cc.teamGame.game;

        if (scoreDiff >= 0) {
            return this._strategyWhenWinning();

        } else if (g.currHalf === 1 && scoreDiff < 0) {
            return this._firstHalfStrategyWhenLosing();
        
        } else if (g.currHalf === 2) {
            if (g.gameClock >= 600) {
                return this._secondHalfLosingOver5Min(scoreDiff);

            } else if (g.gameClock >= 120 && g.gameClock < 600) {
                return this._secondHalfLosing2To5Min(scoreDiff);
            }
        }        
    }
}