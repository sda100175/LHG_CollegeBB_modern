// Various type definitions and some support functions around offensive and defensive strategies.

export enum OffensiveStrategy {
    NORMAL = 0,
    AGGRESIVE = 1,
    SAFE = 2,
    QUICK = 3,
    DELAY = 4,
    MILK_SHOT_CLOCK = 5,
    STALL = 6,
    TOTAL_STALL = 7,
    HOLD_BALL = 8,
    SHOOT_ONLY_3S = 9
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

export enum PressType { 
    NONE = 0,  
    TOKEN = 1,
    RUN_AND_JUMP = 2,
    ZONE = 3,
    DIAMOND_ZONE = 4,
    DENIAL_FOUL = 5
}

export enum HalfCourtDefense {
    SOLID_MTM = 0,
    PRESSURE_MTM = 1,
    PASSIVE_ZONE = 2,
    TRAPPING_ZONE = 3
}

export class StrategyHelper {
    public static getHalfCourtDefense(strat: DefensiveStrategy) {
        switch (strat) {
            case DefensiveStrategy.PRESSURE_MTM:
            case DefensiveStrategy.FCP_RJ_PRESSURE_MTM:
            case DefensiveStrategy.ZONE_PRESS_221_PRESSURE_MTM:
            case DefensiveStrategy.DIAMOND_ZONE_PRESSURE_MTM:
            case DefensiveStrategy.FCP_MTM_DENIAL:
                return HalfCourtDefense.PRESSURE_MTM;

            case DefensiveStrategy.ZONE_23:
            case DefensiveStrategy.ZONE_PRESS_221_ZONE_23:
            case DefensiveStrategy.DIAMOND_ZONE_ZONE_23:
            case DefensiveStrategy.ZONE_32:
            case DefensiveStrategy.ZONE_PRESS_221_ZONE_32:
            case DefensiveStrategy.DIAMOND_ZONE_ZONE_32:
                    return HalfCourtDefense.PASSIVE_ZONE;
                
            case DefensiveStrategy.ZONE_131:
            case DefensiveStrategy.DIAMOND_ZONE_ZONE_131:
                return HalfCourtDefense.TRAPPING_ZONE;

            case DefensiveStrategy.SOLID_MTM:
            case DefensiveStrategy.FCP_SOLID_MTM:
            case DefensiveStrategy.FCP_RJ_SOLID_MTM:
            case DefensiveStrategy.ZONE_PRESS_221_SOLID_MTM:
            case DefensiveStrategy.DIAMOND_ZONE_SOLID_MTM:
            default:
                return HalfCourtDefense.SOLID_MTM;
        }
    }

    public static getPressType(strat: DefensiveStrategy) {
        switch (strat) {
            case DefensiveStrategy.FCP_SOLID_MTM:
                return PressType.TOKEN;
    
            case DefensiveStrategy.FCP_RJ_SOLID_MTM:
            case DefensiveStrategy.FCP_RJ_PRESSURE_MTM:
                return PressType.RUN_AND_JUMP;
    
            case DefensiveStrategy.ZONE_PRESS_221_ZONE_23:
            case DefensiveStrategy.ZONE_PRESS_221_SOLID_MTM:
            case DefensiveStrategy.ZONE_PRESS_221_PRESSURE_MTM:
            case DefensiveStrategy.ZONE_PRESS_221_ZONE_32:
                return PressType.ZONE;
    
            case DefensiveStrategy.DIAMOND_ZONE_SOLID_MTM:
            case DefensiveStrategy.DIAMOND_ZONE_PRESSURE_MTM:
            case DefensiveStrategy.DIAMOND_ZONE_ZONE_23:
            case DefensiveStrategy.DIAMOND_ZONE_ZONE_131:
            case DefensiveStrategy.DIAMOND_ZONE_ZONE_32:
                return PressType.DIAMOND_ZONE;
    
            case DefensiveStrategy.FCP_MTM_DENIAL:
                return PressType.DENIAL_FOUL;
    
            case DefensiveStrategy.SOLID_MTM:
            case DefensiveStrategy.PRESSURE_MTM:
            case DefensiveStrategy.ZONE_23:
            case DefensiveStrategy.ZONE_131:
            case DefensiveStrategy.ZONE_32:
            default:
                return PressType.NONE;
        }
    }
}
