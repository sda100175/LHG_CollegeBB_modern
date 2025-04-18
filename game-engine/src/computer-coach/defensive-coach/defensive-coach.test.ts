import { DefensiveStrategy } from "../../shared/strategy-helper";
import * as utils from "../../util";
import { ComputerCoach } from "../computer-coach";
import { DefensiveCoach } from "./defensive-coach";

describe('DefensiveCoach', () => {
    let cc: ComputerCoach;
    let dc: DefensiveCoach;

    describe('when winning', () => {
        beforeEach(() => {
            cc = <ComputerCoach> {
                teamGame: { game: { currHalf: 2, gameClock: 250 } },
                getScoreDiff: () => 5
            }
            dc = new DefensiveCoach(cc);
        });

        it('selects FCP_RJ_SOLID_MTM when random between 1-5', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(3);
            expect(dc.getStrategyRecommendation()).toEqual(DefensiveStrategy.FCP_RJ_SOLID_MTM);
        });

        it('selects ZONE_PRESS_221_SOLID_MTM when random between 6-9', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(7);
            expect(dc.getStrategyRecommendation()).toEqual(DefensiveStrategy.ZONE_PRESS_221_SOLID_MTM);
        });

        it('selects ZONE_PRESS_221_ZONE_23 when random is 10', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(10);
            expect(dc.getStrategyRecommendation()).toEqual(DefensiveStrategy.ZONE_PRESS_221_ZONE_23);
        });

        it('selects ZONE_PRESS_221_ZONE_32 when random is 11', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(11);
            expect(dc.getStrategyRecommendation()).toEqual(DefensiveStrategy.ZONE_PRESS_221_ZONE_32);
        });

        it('selects SOLID_MTM when random is 12-46', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(32);
            expect(dc.getStrategyRecommendation()).toEqual(DefensiveStrategy.SOLID_MTM);
        });

        it('selects PRESSURE_MTM when random is 47-74', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(51);
            expect(dc.getStrategyRecommendation()).toEqual(DefensiveStrategy.PRESSURE_MTM);
        });

        it('selects ZONE_23 when random is 75-98', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(89);
            expect(dc.getStrategyRecommendation()).toEqual(DefensiveStrategy.ZONE_23);
        });

        it('selects ZONE_32 when random is 99-100', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(99);
            expect(dc.getStrategyRecommendation()).toEqual(DefensiveStrategy.ZONE_32);
            jest.spyOn(utils, 'Rand100').mockReturnValue(100);
            expect(dc.getStrategyRecommendation()).toEqual(DefensiveStrategy.ZONE_32);
        });
    });

    describe('when losing in the first half', () => {
        beforeEach(() => {
            cc = <ComputerCoach> {
                teamGame: { game: { currHalf: 1 } },
                getScoreDiff: () => -5
            }
            dc = new DefensiveCoach(cc);
        });

        it('selects DIAMOND_ZONE_SOLID_MTM when random between 1-3', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(3);
            expect(dc.getStrategyRecommendation()).toEqual(DefensiveStrategy.DIAMOND_ZONE_SOLID_MTM);
        });

        it('selects ZONE_PRESS_221_PRESSURE_MTM when random between 4-5', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(4);
            expect(dc.getStrategyRecommendation()).toEqual(DefensiveStrategy.ZONE_PRESS_221_PRESSURE_MTM);
        });

        it('selects ZONE_PRESS_221_ZONE_32 when random between 6', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(6);
            expect(dc.getStrategyRecommendation()).toEqual(DefensiveStrategy.ZONE_PRESS_221_ZONE_32);
        });

        it('selects ZONE_PRESS_221_ZONE_23 when random between 7-9', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(8);
            expect(dc.getStrategyRecommendation()).toEqual(DefensiveStrategy.ZONE_PRESS_221_ZONE_23);
        });

        it('selects ZONE_PRESS_221_SOLID_MTM when random between 10-12', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(10);
            expect(dc.getStrategyRecommendation()).toEqual(DefensiveStrategy.ZONE_PRESS_221_SOLID_MTM);
        });

        it('selects FCP_SOLID_MTM when random between 13-14', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(13);
            expect(dc.getStrategyRecommendation()).toEqual(DefensiveStrategy.FCP_SOLID_MTM);
        });

        it('selects ZONE_32 when random between 15', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(15);
            expect(dc.getStrategyRecommendation()).toEqual(DefensiveStrategy.ZONE_32);
        });

        it('selects SOLID_MTM when random between 16-43', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(40);
            expect(dc.getStrategyRecommendation()).toEqual(DefensiveStrategy.SOLID_MTM);
        });

        it('selects PRESSURE_MTM when random between 44-67', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(55);
            expect(dc.getStrategyRecommendation()).toEqual(DefensiveStrategy.PRESSURE_MTM);
        });

        it('selects ZONE_23 when random between 68-92', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(70);
            expect(dc.getStrategyRecommendation()).toEqual(DefensiveStrategy.ZONE_23);
        });

        it('selects ZONE_32 when random between 93-94', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(94);
            expect(dc.getStrategyRecommendation()).toEqual(DefensiveStrategy.ZONE_32);
        });

        it('selects ZONE_131 when random between 95-100', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(97);
            expect(dc.getStrategyRecommendation()).toEqual(DefensiveStrategy.ZONE_131);
        });
    });

    describe('when losing in the second half, with over 5 minutes left, within 10 points', () => {
        beforeEach(() => {
            cc = <ComputerCoach> {
                teamGame: { game: { currHalf: 2, gameClock: 800 } },
                getScoreDiff: () => -7
            }
            dc = new DefensiveCoach(cc);
        });

        it('selects SOLID_MTM when random between 1-52', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(33);
            expect(dc.getStrategyRecommendation()).toEqual(DefensiveStrategy.SOLID_MTM);
        });

        it('selects PRESSURE_MTM when random between 53-75', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(60);
            expect(dc.getStrategyRecommendation()).toEqual(DefensiveStrategy.PRESSURE_MTM);
        });

        it('selects ZONE_23 when random between 76-84', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(81);
            expect(dc.getStrategyRecommendation()).toEqual(DefensiveStrategy.ZONE_23);
        });

        it('selects ZONE_32 when random between 85', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(85);
            expect(dc.getStrategyRecommendation()).toEqual(DefensiveStrategy.ZONE_32);
        });

        it('selects FCP_RJ_SOLID_MTM when random between 86-93', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(93);
            expect(dc.getStrategyRecommendation()).toEqual(DefensiveStrategy.FCP_RJ_SOLID_MTM);
        });

        it('selects ZONE_131 when random between 94-97', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(95);
            expect(dc.getStrategyRecommendation()).toEqual(DefensiveStrategy.ZONE_131);
        });

        it('selects DIAMOND_ZONE_ZONE_23 when random between 98-100', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(98);
            expect(dc.getStrategyRecommendation()).toEqual(DefensiveStrategy.DIAMOND_ZONE_ZONE_23);
        });
    });

    describe('when losing in the second half, with over 5 minutes left, between 10-20 points', () => {
        beforeEach(() => {
            cc = <ComputerCoach> {
                teamGame: { game: { currHalf: 2, gameClock: 800 } },
                getScoreDiff: () => -12
            }
            dc = new DefensiveCoach(cc);
        });

        it('selects SOLID_MTM when random between 1-57', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(33);
            expect(dc.getStrategyRecommendation()).toEqual(DefensiveStrategy.SOLID_MTM);
        });

        it('selects FCP_SOLID_MTM when random between 58-86', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(60);
            expect(dc.getStrategyRecommendation()).toEqual(DefensiveStrategy.FCP_SOLID_MTM);
        });

        it('selects PRESSURE_MTM when random between 87-94', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(88);
            expect(dc.getStrategyRecommendation()).toEqual(DefensiveStrategy.PRESSURE_MTM);
        });

        it('selects DIAMOND_ZONE_SOLID_MTM when random between 95-99', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(95);
            expect(dc.getStrategyRecommendation()).toEqual(DefensiveStrategy.DIAMOND_ZONE_SOLID_MTM);
        });

        it('selects DIAMOND_ZONE_PRESSURE_MTM when random is 100', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(100);
            expect(dc.getStrategyRecommendation()).toEqual(DefensiveStrategy.DIAMOND_ZONE_PRESSURE_MTM);
        });
    });

    describe('when losing in the second half, with over 5 minutes left, by over 20 points', () => {
        beforeEach(() => {
            cc = <ComputerCoach> {
                teamGame: { game: { currHalf: 2, gameClock: 800 } },
                getScoreDiff: () => -22
            }
            dc = new DefensiveCoach(cc);
        });

        it('selects SOLID_MTM when random between 1-42', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(33);
            expect(dc.getStrategyRecommendation()).toEqual(DefensiveStrategy.SOLID_MTM);
        });

        it('selects PRESSURE_MTM when random between 43-80', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(60);
            expect(dc.getStrategyRecommendation()).toEqual(DefensiveStrategy.PRESSURE_MTM);
        });

        it('selects FCP_RJ_PRESSURE_MTM when random between 81-92', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(83);
            expect(dc.getStrategyRecommendation()).toEqual(DefensiveStrategy.FCP_RJ_PRESSURE_MTM);
        });

        it('selects DIAMOND_ZONE_SOLID_MTM when random between 93-97', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(95);
            expect(dc.getStrategyRecommendation()).toEqual(DefensiveStrategy.DIAMOND_ZONE_SOLID_MTM);
        });

        it('selects DIAMOND_ZONE_PRESSURE_MTM when random between 98-100', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(100);
            expect(dc.getStrategyRecommendation()).toEqual(DefensiveStrategy.DIAMOND_ZONE_PRESSURE_MTM);
        });
    });

    describe('when losing in the second half, with 2-5 minutes left left, within 10 points', () => {
        beforeEach(() => {
            cc = <ComputerCoach> {
                teamGame: { game: { currHalf: 2, gameClock: 250 } },
                getScoreDiff: () => -6
            }
            dc = new DefensiveCoach(cc);
        });

        it('selects SOLID_MTM when random between 1-52', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(33);
            expect(dc.getStrategyRecommendation()).toEqual(DefensiveStrategy.SOLID_MTM);
        });

        it('selects ZONE_23 when random between 53-71', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(60);
            expect(dc.getStrategyRecommendation()).toEqual(DefensiveStrategy.ZONE_23);
        });

        it('selects ZONE_32 when random is 72', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(72);
            expect(dc.getStrategyRecommendation()).toEqual(DefensiveStrategy.ZONE_32);
        });

        it('selects PRESSURE_MTM when random between 73-78', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(75);
            expect(dc.getStrategyRecommendation()).toEqual(DefensiveStrategy.PRESSURE_MTM);
        });

        it('selects DIAMOND_ZONE_SOLID_MTM when random between 79-100', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(90);
            expect(dc.getStrategyRecommendation()).toEqual(DefensiveStrategy.DIAMOND_ZONE_SOLID_MTM);
        });
    });

    describe('when losing in the second half, with 2-5 minutes left left, between 10-20 points', () => {
        beforeEach(() => {
            cc = <ComputerCoach> {
                teamGame: { game: { currHalf: 2, gameClock: 250 } },
                getScoreDiff: () => -15
            }
            dc = new DefensiveCoach(cc);
        });

        it('selects SOLID_MTM when random between 1-52', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(33);
            expect(dc.getStrategyRecommendation()).toEqual(DefensiveStrategy.SOLID_MTM);
        });

        it('selects PRESSURE_MTM when random between 53-80', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(60);
            expect(dc.getStrategyRecommendation()).toEqual(DefensiveStrategy.PRESSURE_MTM);
        });

        it('selects FCP_RJ_SOLID_MTM when random is between 81-90', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(83);
            expect(dc.getStrategyRecommendation()).toEqual(DefensiveStrategy.FCP_RJ_SOLID_MTM);
        });

        it('selects DIAMOND_ZONE_ZONE_23 when random between 91-100', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(93);
            expect(dc.getStrategyRecommendation()).toEqual(DefensiveStrategy.DIAMOND_ZONE_ZONE_23);
        });
    });

    describe('when losing in the second half, with 2-5 minutes left left, over 20 points', () => {
        beforeEach(() => {
            cc = <ComputerCoach> {
                teamGame: { game: { currHalf: 2, gameClock: 250 } },
                getScoreDiff: () => -25
            }
            dc = new DefensiveCoach(cc);
        });

        it('selects SOLID_MTM when random between 1-52', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(33);
            expect(dc.getStrategyRecommendation()).toEqual(DefensiveStrategy.SOLID_MTM);
        });

        it('selects PRESSURE_MTM when random between 53-74', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(60);
            expect(dc.getStrategyRecommendation()).toEqual(DefensiveStrategy.PRESSURE_MTM);
        });

        it('selects FCP_RJ_SOLID_MTM when random is between 75-84', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(83);
            expect(dc.getStrategyRecommendation()).toEqual(DefensiveStrategy.FCP_RJ_SOLID_MTM);
        });

        it('selects DIAMOND_ZONE_SOLID_MTM when random is between 85-94', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(90);
            expect(dc.getStrategyRecommendation()).toEqual(DefensiveStrategy.DIAMOND_ZONE_SOLID_MTM);
        });

        it('selects DIAMOND_ZONE_ZONE_131 when random between 95-100', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(95);
            expect(dc.getStrategyRecommendation()).toEqual(DefensiveStrategy.DIAMOND_ZONE_ZONE_131);
        });
    });

    describe('when losing in the second half, with under 2 minutes left left, less than 5 points', () => {
        beforeEach(() => {
            cc = <ComputerCoach> {
                teamGame: { game: { currHalf: 2, gameClock: 80 } },
                getScoreDiff: () => -3
            }
            dc = new DefensiveCoach(cc);
        });

        it('selects FCP_RJ_SOLID_MTM when random between 1-15', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(10);
            expect(dc.getStrategyRecommendation()).toEqual(DefensiveStrategy.FCP_RJ_SOLID_MTM);
        });

        it('selects FCP_RJ_PRESSURE_MTM when random between 16-41', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(38);
            expect(dc.getStrategyRecommendation()).toEqual(DefensiveStrategy.FCP_RJ_PRESSURE_MTM);
        });

        it('selects DIAMOND_ZONE_PRESSURE_MTM when random is between 42-63', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(59);
            expect(dc.getStrategyRecommendation()).toEqual(DefensiveStrategy.DIAMOND_ZONE_PRESSURE_MTM);
        });

        it('selects DIAMOND_ZONE_ZONE_131 when random is between 64-84', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(75);
            expect(dc.getStrategyRecommendation()).toEqual(DefensiveStrategy.DIAMOND_ZONE_ZONE_131);
        });

        it('selects PRESSURE_MTM when random between 85-100', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(95);
            expect(dc.getStrategyRecommendation()).toEqual(DefensiveStrategy.PRESSURE_MTM);
        });
    });

    describe('when losing in the second half, with under 2 minutes left left, by 5-10 points', () => {
        beforeEach(() => {
            cc = <ComputerCoach> {
                teamGame: { game: { currHalf: 2, gameClock: 80 } },
                getScoreDiff: () => -8
            }
            dc = new DefensiveCoach(cc);
        });

        it('selects FCP_MTM_DENIAL always', () => {
            expect(dc.getStrategyRecommendation()).toEqual(DefensiveStrategy.FCP_MTM_DENIAL);
        });
    });

    describe('when losing in the second half, with under 2 minutes left left, by more than 10 points', () => {
        beforeEach(() => {
            cc = <ComputerCoach> {
                teamGame: { game: { currHalf: 2, gameClock: 80 } },
                getScoreDiff: () => -13
            }
            dc = new DefensiveCoach(cc);
        });

        it('selects DIAMOND_ZONE_PRESSURE_MTM when random between 1-47', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(10);
            expect(dc.getStrategyRecommendation()).toEqual(DefensiveStrategy.DIAMOND_ZONE_PRESSURE_MTM);
        });

        it('selects DIAMOND_ZONE_ZONE_131 when random between 48-93', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(70);
            expect(dc.getStrategyRecommendation()).toEqual(DefensiveStrategy.DIAMOND_ZONE_ZONE_131);
        });

        it('selects PRESSURE_MTM when random is between 94-100', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(95);
            expect(dc.getStrategyRecommendation()).toEqual(DefensiveStrategy.PRESSURE_MTM);
        });
    });

    describe('when losing in overtime', () => {
        beforeEach(() => {
            cc = <ComputerCoach> {
                teamGame: { game: { currHalf: 3, gameClock: 400 } },
                getScoreDiff: () => -4
            }
            dc = new DefensiveCoach(cc);
        });

        it('selects SOLID_MTM when random between 1-32', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(10);
            expect(dc.getStrategyRecommendation()).toEqual(DefensiveStrategy.SOLID_MTM);
        });

        it('selects PRESSURE_MTM when random between 33-36', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(34);
            expect(dc.getStrategyRecommendation()).toEqual(DefensiveStrategy.PRESSURE_MTM);
        });

        it('selects FCP_SOLID_MTM when random between 37-50', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(44);
            expect(dc.getStrategyRecommendation()).toEqual(DefensiveStrategy.FCP_SOLID_MTM);
        });

        it('selects ZONE_23 when random between 51-96', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(77);
            expect(dc.getStrategyRecommendation()).toEqual(DefensiveStrategy.ZONE_23);
        });

        it('selects ZONE_32 when random is between 97-100', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(99);
            expect(dc.getStrategyRecommendation()).toEqual(DefensiveStrategy.ZONE_32);
        });
    });
});
