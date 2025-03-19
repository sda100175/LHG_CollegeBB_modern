import { DefensiveStrategy, PressType, StrategyHelper } from "./strategy-helper";

describe('StrategyHelper', () => {
    describe('getPressType', () => {
        it('correctly identifies TOKEN press', () => {
            expect(StrategyHelper.getPressType(DefensiveStrategy.FCP_SOLID_MTM)).toEqual(PressType.TOKEN);
        });

        it('correctly identifies RUN_AND_JUMP press', () => {
            expect(StrategyHelper.getPressType(DefensiveStrategy.FCP_RJ_SOLID_MTM)).toEqual(PressType.RUN_AND_JUMP);
            expect(StrategyHelper.getPressType(DefensiveStrategy.FCP_RJ_PRESSURE_MTM)).toEqual(PressType.RUN_AND_JUMP);
        });

        it('correctly identifies ZONE press', () => {
            expect(StrategyHelper.getPressType(DefensiveStrategy.ZONE_PRESS_221_ZONE_23)).toEqual(PressType.ZONE);
            expect(StrategyHelper.getPressType(DefensiveStrategy.ZONE_PRESS_221_SOLID_MTM)).toEqual(PressType.ZONE);
            expect(StrategyHelper.getPressType(DefensiveStrategy.ZONE_PRESS_221_PRESSURE_MTM)).toEqual(PressType.ZONE);
            expect(StrategyHelper.getPressType(DefensiveStrategy.ZONE_PRESS_221_ZONE_32)).toEqual(PressType.ZONE);
        });

        it('correctly identifies DIAMOND_ZONE press', () => {
            expect(StrategyHelper.getPressType(DefensiveStrategy.DIAMOND_ZONE_SOLID_MTM)).toEqual(PressType.DIAMOND_ZONE);
            expect(StrategyHelper.getPressType(DefensiveStrategy.DIAMOND_ZONE_PRESSURE_MTM)).toEqual(PressType.DIAMOND_ZONE);
            expect(StrategyHelper.getPressType(DefensiveStrategy.DIAMOND_ZONE_ZONE_23)).toEqual(PressType.DIAMOND_ZONE);
            expect(StrategyHelper.getPressType(DefensiveStrategy.DIAMOND_ZONE_ZONE_131)).toEqual(PressType.DIAMOND_ZONE);
            expect(StrategyHelper.getPressType(DefensiveStrategy.DIAMOND_ZONE_ZONE_32)).toEqual(PressType.DIAMOND_ZONE);
        });

        it('correctly identifies DENIAL_FOUL press', () => {
            expect(StrategyHelper.getPressType(DefensiveStrategy.FCP_MTM_DENIAL)).toEqual(PressType.DENIAL_FOUL);
        });

        it('correctly identifies NONE press', () => {
            expect(StrategyHelper.getPressType(DefensiveStrategy.SOLID_MTM)).toEqual(PressType.NONE);
            expect(StrategyHelper.getPressType(DefensiveStrategy.PRESSURE_MTM)).toEqual(PressType.NONE);
            expect(StrategyHelper.getPressType(DefensiveStrategy.ZONE_23)).toEqual(PressType.NONE);
            expect(StrategyHelper.getPressType(DefensiveStrategy.ZONE_131)).toEqual(PressType.NONE);
            expect(StrategyHelper.getPressType(DefensiveStrategy.ZONE_32)).toEqual(PressType.NONE);
        });
    });
});
