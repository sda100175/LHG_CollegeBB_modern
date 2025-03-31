import { ComputerCoach } from "../computer-coach";
import { OffensiveCoach } from "./offensive-coach";
import * as utils from "../../util";
import { LastFiveSecStrategy, OffensiveStrategy } from "../../shared/strategy-helper";

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

    describe('when in last 5 seconds of game and losing by one score or less', () => {
        describe('and there are no 3 point shots', () => {
            beforeEach(() => {
                cc = <ComputerCoach> {
                    teamGame: { 
                        game: { 
                            currHalf: 2, 
                            gameClock: 5,
                            gameSettings: { threePtShots: false }
                        } 
                    },
                    getScoreDiff: () => -3
                }
                oc = new OffensiveCoach(cc);
            });

            it('should work the floor for a 2pt shot', () => {
                expect(oc.getLast5SecStrategyRecommendation()).toEqual(LastFiveSecStrategy.WORK_FLOOR_SHOOT_2P);
            });
        });

        describe('and there are 3 point shots', () => {
            beforeEach(() => {
                cc = <ComputerCoach> {
                    teamGame: { 
                        game: { 
                            currHalf: 2, 
                            gameClock: 5,
                            gameSettings: { threePtShots: true }
                        } 
                    },
                    getScoreDiff: () => -3
                }
                oc = new OffensiveCoach(cc);
            });

            it('should work the floor for a 3pt shot if losing by 3', () => {
                expect(oc.getLast5SecStrategyRecommendation()).toEqual(LastFiveSecStrategy.WORK_FLOOR_SHOOT_3P);
            });

            it('should work the floor for a 2pt shot if losing by 2 and random is under 50', () => {
                jest.spyOn(cc, 'getScoreDiff').mockReturnValue(-2);
                jest.spyOn(utils, 'Rand100').mockReturnValue(40);
                expect(oc.getLast5SecStrategyRecommendation()).toEqual(LastFiveSecStrategy.WORK_FLOOR_SHOOT_2P);
            });

            it('should work the floor for a 3pt shot if losing by 2 and random is over 50', () => {
                jest.spyOn(cc, 'getScoreDiff').mockReturnValue(-2);
                jest.spyOn(utils, 'Rand100').mockReturnValue(60);
                expect(oc.getLast5SecStrategyRecommendation()).toEqual(LastFiveSecStrategy.WORK_FLOOR_SHOOT_3P);
            });
        });

    });

    describe('when in last 3 seconds of game and losing by one score or less', () => {
        describe('and there are no 3 point shots', () => {
            beforeEach(() => {
                cc = <ComputerCoach> {
                    teamGame: { 
                        game: { 
                            currHalf: 2, 
                            gameClock: 2,
                            gameSettings: { threePtShots: false }
                        } 
                    },
                    getScoreDiff: () => -2
                }
                oc = new OffensiveCoach(cc);
            });

            it('should attempt a full court pass for a 2pt shot', () => {
                expect(oc.getLast5SecStrategyRecommendation()).toEqual(LastFiveSecStrategy.FULL_COURT_PASS_SHOOT_2P);
            });
        });

        describe('and there are 3 point shots', () => {
            beforeEach(() => {
                cc = <ComputerCoach> {
                    teamGame: { 
                        game: { 
                            currHalf: 2, 
                            gameClock: 2,
                            gameSettings: { threePtShots: true }
                        } 
                    },
                    getScoreDiff: () => -3
                }
                oc = new OffensiveCoach(cc);
            });

            it('should attempt a full court pass for a 3pt shot if losing by 3', () => {
                expect(oc.getLast5SecStrategyRecommendation()).toEqual(LastFiveSecStrategy.FULL_COURT_PASS_SHOOT_3P);
            });

            it('should attempt a full court pass for a 2pt shot if losing by 2 and random is under 50', () => {
                jest.spyOn(cc, 'getScoreDiff').mockReturnValue(-2);
                jest.spyOn(utils, 'Rand100').mockReturnValue(40);
                expect(oc.getLast5SecStrategyRecommendation()).toEqual(LastFiveSecStrategy.FULL_COURT_PASS_SHOOT_2P);
            });

            it('should attempt a full court pass for a 3pt shot if losing by 2 and random is over 50', () => {
                jest.spyOn(cc, 'getScoreDiff').mockReturnValue(-2);
                jest.spyOn(utils, 'Rand100').mockReturnValue(60);
                expect(oc.getLast5SecStrategyRecommendation()).toEqual(LastFiveSecStrategy.FULL_COURT_PASS_SHOOT_3P);
            });
        });
    });
});
