import { Game } from "../game/game";
import { DefensiveStrategy, HalfCourtDefense, PressType, StrategyHelper } from "./strategy-helper";
import teamData from "../../test_data/TeamData.1990.json";
import { Team } from "../team/team";
import { GameSettings } from "../game-settings/game-settings";
import * as utils from "../util";

describe('StrategyHelper', () => {
    describe('isLast5SecSituation', () => {
        let g: Game;
        let vt: Team, ht: Team;

        beforeEach(() => {
            vt = Team.fromObject(teamData['90 DUKE']);
            ht = Team.fromObject(teamData['90 MARYLAND']);
            g = new Game(new GameSettings(), vt, ht);    
            jest.spyOn(utils, 'Rand1').mockReturnValue(0); // ensures visitor is on offense
            g.start();
        });

        it('returns false when game is not within last 5 seconds', () => {
            expect(StrategyHelper.isLast5SecSituation(g)).toEqual(false);
        });

        describe('and within last 5 seconds of the game', () => {
            beforeEach(() => g.setGameClock(2, 4));

            it('returns false if offensive team is winning', () => {
                g.visitorTeamGame.lineup[0].stats.pointsScored = 1;
                expect(StrategyHelper.isLast5SecSituation(g)).toEqual(false);
            });

            it('returns false if three point shot is on, and losing by more than 3', () => {
                g.homeTeamGame.lineup[0].stats.pointsScored = 4;
                expect(StrategyHelper.isLast5SecSituation(g)).toEqual(false);
            });

            it('returns false if three point shot is off, and losing by more than 2', () => {
                g.gameSettings.threePtShots = false;
                g.homeTeamGame.lineup[0].stats.pointsScored = 3;
                expect(StrategyHelper.isLast5SecSituation(g)).toEqual(false);
            });

            it('returns true if three point shot is on, and losing by 3 or less', () => {
                g.homeTeamGame.lineup[0].stats.pointsScored = 3;
                expect(StrategyHelper.isLast5SecSituation(g)).toEqual(true);
            });

            it('returns true if three point shot is off, and losing by 2 or less', () => {
                g.gameSettings.threePtShots = false;
                g.homeTeamGame.lineup[0].stats.pointsScored = 2;
                expect(StrategyHelper.isLast5SecSituation(g)).toEqual(true);
            });
        });
    });

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

    describe('getHalfCourtDefense', () => {
        it('correctly identifies PRESSURE_MTM', () => {
            expect(StrategyHelper.getHalfCourtDefense(DefensiveStrategy.PRESSURE_MTM))
                .toEqual(HalfCourtDefense.PRESSURE_MTM);
            expect(StrategyHelper.getHalfCourtDefense(DefensiveStrategy.FCP_RJ_PRESSURE_MTM))
                .toEqual(HalfCourtDefense.PRESSURE_MTM);
            expect(StrategyHelper.getHalfCourtDefense(DefensiveStrategy.ZONE_PRESS_221_PRESSURE_MTM))
                .toEqual(HalfCourtDefense.PRESSURE_MTM);
            expect(StrategyHelper.getHalfCourtDefense(DefensiveStrategy.DIAMOND_ZONE_PRESSURE_MTM))
                .toEqual(HalfCourtDefense.PRESSURE_MTM);
            expect(StrategyHelper.getHalfCourtDefense(DefensiveStrategy.FCP_MTM_DENIAL))
                .toEqual(HalfCourtDefense.PRESSURE_MTM);
        });

        it('correctly identifies PASSIVE_ZONE', () => {
            expect(StrategyHelper.getHalfCourtDefense(DefensiveStrategy.ZONE_23))
                .toEqual(HalfCourtDefense.PASSIVE_ZONE);
            expect(StrategyHelper.getHalfCourtDefense(DefensiveStrategy.ZONE_PRESS_221_ZONE_23))
                .toEqual(HalfCourtDefense.PASSIVE_ZONE);
            expect(StrategyHelper.getHalfCourtDefense(DefensiveStrategy.DIAMOND_ZONE_ZONE_23))
                .toEqual(HalfCourtDefense.PASSIVE_ZONE);
            expect(StrategyHelper.getHalfCourtDefense(DefensiveStrategy.ZONE_32))
                .toEqual(HalfCourtDefense.PASSIVE_ZONE);
            expect(StrategyHelper.getHalfCourtDefense(DefensiveStrategy.ZONE_PRESS_221_ZONE_32))
                .toEqual(HalfCourtDefense.PASSIVE_ZONE);
            expect(StrategyHelper.getHalfCourtDefense(DefensiveStrategy.DIAMOND_ZONE_ZONE_32))
                .toEqual(HalfCourtDefense.PASSIVE_ZONE);
        });

        it('correctly identifies TRAPPING_ZONE', () => {
            expect(StrategyHelper.getHalfCourtDefense(DefensiveStrategy.ZONE_131))
                .toEqual(HalfCourtDefense.TRAPPING_ZONE);
            expect(StrategyHelper.getHalfCourtDefense(DefensiveStrategy.DIAMOND_ZONE_ZONE_131))
                .toEqual(HalfCourtDefense.TRAPPING_ZONE);
        });

        it('correctly identifies SOLID_MTM', () => {
            expect(StrategyHelper.getHalfCourtDefense(DefensiveStrategy.SOLID_MTM))
                .toEqual(HalfCourtDefense.SOLID_MTM);
            expect(StrategyHelper.getHalfCourtDefense(DefensiveStrategy.FCP_SOLID_MTM))
                .toEqual(HalfCourtDefense.SOLID_MTM);
            expect(StrategyHelper.getHalfCourtDefense(DefensiveStrategy.FCP_RJ_SOLID_MTM))
                .toEqual(HalfCourtDefense.SOLID_MTM);
            expect(StrategyHelper.getHalfCourtDefense(DefensiveStrategy.ZONE_PRESS_221_SOLID_MTM))
                .toEqual(HalfCourtDefense.SOLID_MTM);
            expect(StrategyHelper.getHalfCourtDefense(DefensiveStrategy.DIAMOND_ZONE_SOLID_MTM))
                .toEqual(HalfCourtDefense.SOLID_MTM);
        });
    });
});
