import { DefensiveStrategy } from "../../team-game/team-game";
import * as utils from "../../util";
import { ComputerCoach } from "../computer-coach";
import { DefensiveCoach } from "./defensive-coach";

describe('DefensiveCoach', () => {
    let cc: ComputerCoach;

    describe('when winning', () => {
        beforeEach(() => {
            cc = <ComputerCoach> {
                getScoreDiff: () => 5
            }
        });

        it('selects FCP_RJ_SOLID_MTM when random between 1-5', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(3);
            expect(DefensiveCoach.getStrategyRecommendation(cc)).toEqual(DefensiveStrategy.FCP_RJ_SOLID_MTM);
        });

        it('selects ZONE_PRESS_221_SOLID_MTM when random between 6-9', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(7);
            expect(DefensiveCoach.getStrategyRecommendation(cc)).toEqual(DefensiveStrategy.ZONE_PRESS_221_SOLID_MTM);
        });

        it('selects ZONE_PRESS_221_ZONE_23 when random is 10', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(10);
            expect(DefensiveCoach.getStrategyRecommendation(cc)).toEqual(DefensiveStrategy.ZONE_PRESS_221_ZONE_23);
        });

        it('selects ZONE_PRESS_221_ZONE_32 when random is 11', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(11);
            expect(DefensiveCoach.getStrategyRecommendation(cc)).toEqual(DefensiveStrategy.ZONE_PRESS_221_ZONE_32);
        });

        it('selects SOLID_MTM when random is 12-46', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(32);
            expect(DefensiveCoach.getStrategyRecommendation(cc)).toEqual(DefensiveStrategy.SOLID_MTM);
        });

        it('selects PRESSURE_MTM when random is 47-74', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(51);
            expect(DefensiveCoach.getStrategyRecommendation(cc)).toEqual(DefensiveStrategy.PRESSURE_MTM);
        });

        it('selects ZONE_23 when random is 75-98', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(89);
            expect(DefensiveCoach.getStrategyRecommendation(cc)).toEqual(DefensiveStrategy.ZONE_23);
        });

        it('selects ZONE_32 when random is 99-100', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(99);
            expect(DefensiveCoach.getStrategyRecommendation(cc)).toEqual(DefensiveStrategy.ZONE_32);
            jest.spyOn(utils, 'Rand100').mockReturnValue(100);
            expect(DefensiveCoach.getStrategyRecommendation(cc)).toEqual(DefensiveStrategy.ZONE_32);
        });
    });

    describe('when losing in the first half', () => {
        beforeEach(() => {
            cc = <ComputerCoach> {
                teamGame: { game: { currHalf: 1 } },
                getScoreDiff: () => -5
            }
        });

        it('selects DIAMOND_ZONE_SOLID_MTM when random between 1-3', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(3);
            expect(DefensiveCoach.getStrategyRecommendation(cc)).toEqual(DefensiveStrategy.DIAMOND_ZONE_SOLID_MTM);
        });

        it('selects ZONE_PRESS_221_PRESSURE_MTM when random between 4-5', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(4);
            expect(DefensiveCoach.getStrategyRecommendation(cc)).toEqual(DefensiveStrategy.ZONE_PRESS_221_PRESSURE_MTM);
        });

        it('selects ZONE_PRESS_221_ZONE_32 when random between 6', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(6);
            expect(DefensiveCoach.getStrategyRecommendation(cc)).toEqual(DefensiveStrategy.ZONE_PRESS_221_ZONE_32);
        });

        it('selects ZONE_PRESS_221_ZONE_23 when random between 7-9', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(8);
            expect(DefensiveCoach.getStrategyRecommendation(cc)).toEqual(DefensiveStrategy.ZONE_PRESS_221_ZONE_23);
        });

        it('selects ZONE_PRESS_221_SOLID_MTM when random between 10-12', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(10);
            expect(DefensiveCoach.getStrategyRecommendation(cc)).toEqual(DefensiveStrategy.ZONE_PRESS_221_SOLID_MTM);
        });

        it('selects FCP_SOLID_MTM when random between 13-14', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(13);
            expect(DefensiveCoach.getStrategyRecommendation(cc)).toEqual(DefensiveStrategy.FCP_SOLID_MTM);
        });

        it('selects ZONE_32 when random between 15', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(15);
            expect(DefensiveCoach.getStrategyRecommendation(cc)).toEqual(DefensiveStrategy.ZONE_32);
        });

        it('selects SOLID_MTM when random between 16-43', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(40);
            expect(DefensiveCoach.getStrategyRecommendation(cc)).toEqual(DefensiveStrategy.SOLID_MTM);
        });

        it('selects PRESSURE_MTM when random between 44-67', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(55);
            expect(DefensiveCoach.getStrategyRecommendation(cc)).toEqual(DefensiveStrategy.PRESSURE_MTM);
        });

        it('selects ZONE_23 when random between 68-92', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(70);
            expect(DefensiveCoach.getStrategyRecommendation(cc)).toEqual(DefensiveStrategy.ZONE_23);
        });

        it('selects ZONE_32 when random between 93-94', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(94);
            expect(DefensiveCoach.getStrategyRecommendation(cc)).toEqual(DefensiveStrategy.ZONE_32);
        });

        it('selects ZONE_131 when random between 95-100', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(97);
            expect(DefensiveCoach.getStrategyRecommendation(cc)).toEqual(DefensiveStrategy.ZONE_131);
        });
    });
});
