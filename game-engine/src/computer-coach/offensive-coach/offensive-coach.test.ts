import { ComputerCoach } from "../computer-coach";
import { OffensiveCoach } from "./offensive-coach";
import * as utils from "../../util";
import { OffensiveStrategy } from "../../shared/strategy-helper";

describe('OffensiveCoach', () => {
    let cc: ComputerCoach;
    let oc: OffensiveCoach;

    describe('when in the first half', () => {
        beforeEach(() => {
            cc = <ComputerCoach> {
                teamGame: { game: { currHalf: 1 } },
                getScoreDiff: () => -5
            }
            oc = new OffensiveCoach(cc);
        });

        it('selects NORMAL when random between 1-75', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(3);
            expect(oc.getStrategyRecommendation()).toEqual(OffensiveStrategy.NORMAL);
        });

        it('selects AGGRESIVE when random between 76-94', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(80);
            expect(oc.getStrategyRecommendation()).toEqual(OffensiveStrategy.AGGRESSIVE);
        });

        it('selects SAFE when random between 95-100', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(100);
            expect(oc.getStrategyRecommendation()).toEqual(OffensiveStrategy.SAFE);
        });
    });    

    describe('when losing by 3 or more in the last minute and three points shots allowed', () => {
        beforeEach(() => {
            cc = <ComputerCoach> {
                teamGame: { 
                    game: { 
                        currHalf: 2, 
                        gameClock: 50,
                        gameSettings: { threePtShots: true }
                    } 
                },
                getScoreDiff: () => -5
            }
            oc = new OffensiveCoach(cc);
        });

        it('selects SHOOT_ONLY_3S ', () => {
            expect(oc.getStrategyRecommendation()).toEqual(OffensiveStrategy.SHOOT_ONLY_3S);
        });
    });    

    describe('when winning or tied in 2nd half or overtime', () => {
        beforeEach(() => {
            cc = <ComputerCoach> {
                teamGame: { 
                    game: { 
                        currHalf: 2, 
                        gameClock: 450,
                        gameSettings: { threePtShots: true }
                    } 
                },
                getScoreDiff: () => 1
            }
            oc = new OffensiveCoach(cc);
        });

        it('selects NORMAL when random is 85 or less', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(66);
            expect(oc.getStrategyRecommendation()).toEqual(OffensiveStrategy.NORMAL);
        });

        it('selects SAFE when random is over 85', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(90);
            expect(oc.getStrategyRecommendation()).toEqual(OffensiveStrategy.SAFE);
        });
    });    

    describe('when losing in 2nd half or overtime with under 3 minutes left, and not in 3s only mode', () => {
        beforeEach(() => {
            cc = <ComputerCoach> {
                teamGame: { 
                    game: { 
                        currHalf: 2, 
                        gameClock: 125,
                        gameSettings: { threePtShots: true }
                    } 
                },
                getScoreDiff: () => -5
            }
            oc = new OffensiveCoach(cc);
        });

        it('selects QUICK when random is 30 or less', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(25);
            expect(oc.getStrategyRecommendation()).toEqual(OffensiveStrategy.QUICK);
        });

        it('selects DELAY when random is over 30', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(90);
            expect(oc.getStrategyRecommendation()).toEqual(OffensiveStrategy.DELAY);
        });
    });    

    describe('when losing in 2nd half or overtime with over 3 minutes left', () => {
        beforeEach(() => {
            cc = <ComputerCoach> {
                teamGame: { 
                    game: { 
                        currHalf: 2, 
                        gameClock: 350,
                        gameSettings: { threePtShots: true }
                    } 
                },
                getScoreDiff: () => -5
            }
            oc = new OffensiveCoach(cc);
        });

        it('selects QUICK when random is 70 or less', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(65);
            expect(oc.getStrategyRecommendation()).toEqual(OffensiveStrategy.NORMAL);
        });

        it('selects AGGRESSIVE when random is over 70', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(74);
            expect(oc.getStrategyRecommendation()).toEqual(OffensiveStrategy.AGGRESSIVE);
        });
    });    
});
