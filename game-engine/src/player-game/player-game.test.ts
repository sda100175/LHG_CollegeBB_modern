import { PlayerGame } from "./player-game";
import { makeGame } from "../../test_data/bootstrap-game";
import { ShotClockOption } from "../game-settings/game-settings";
import { Game } from "../game/game";

describe('PlayerGame', () => {
    let g: Game;
    let pg: PlayerGame;

    describe('using stock players without game adjustments', () => {
        beforeEach(() => {
            g = makeGame('90 DUKE', '90 MARYLAND');
            pg = g.homeTeamGame.roster[0];
            pg = new PlayerGame(pg.player, false, g.homeTeamGame);  // MUSTAF but unadjusted for game
        });    
        
        it('initializes correctly', () => {
            expect(pg.inspect()).toEqual({ _time: 1200 });
            expect(pg.foulCommitRating).toEqual(24);
            expect(pg.fg3Pct).toEqual(53);
            expect(pg.fg3OfTotalFgAtt).toEqual(4);
            expect(pg.defReb40Minx10).toEqual(68);
            expect(pg.offReb40Minx10).toEqual(32);
            expect(pg.isFouledOut).toEqual(false);
            expect(pg.isPlayingSafe).toEqual(false);
        });    

        it('properly handles contribPct', () => {
            expect(pg.contribPct).toEqual(22);
            pg.contribPct = 28;
            expect(pg.contribPct).toEqual(28);
        });    

        it('properly handles foulDrawRating', () => {
            expect(pg.foulDrawRating).toEqual(10);    
            pg.foulDrawRating = 3;
            expect(pg.foulDrawRating).toEqual(3);
        });    

        it('properly handles fatigue calculation', () => {
            expect(pg.fatigue).toEqual(22);
            pg.stats.fieldGoalsAtt = 6;
            pg.stats.totalRebounds = 2;
            pg.stats.personalFouls = 1;
            expect(pg.fatigue).toEqual(13);

            // Test no shot clock adjustment
            pg.teamGame.game.gameSettings.shotClock = ShotClockOption.NONE;
            pg.stats.reset();
            expect(pg.fatigue).toBeCloseTo(26.4, 1);
        });

        it('properly identifies a fouled out player', () => {
            pg.stats.personalFouls = 5;
            expect(pg.isFouledOut).toEqual(true);
        });

        describe('isPlayingSafe', () => {
            it('disallows setting without proper conditions', () => {
                pg.isPlayingSafe = true;
                expect(pg.isPlayingSafe).toEqual(false);
            });
    
            it('allows setting in 1st half with 3 or less fouls left', () => {
                pg.stats.personalFouls = 2;
                pg.isPlayingSafe = true;
                expect(pg.isPlayingSafe).toEqual(true);
            });
    
            it('allows setting in 2nd half with 1 foul left, and always allows setting to false', () => {
                g.setGameClock(2, 600);
                pg.stats.personalFouls = 4;
                pg.isPlayingSafe = true;
                expect(pg.isPlayingSafe).toEqual(true);
                pg.isPlayingSafe = false;
                expect(pg.isPlayingSafe).toEqual(false);
            });    
        });

        describe('when using a XXX player with 0 values', () => {
            beforeEach(() => {
                pg = g.homeTeamGame.roster[13];
                pg = new PlayerGame(pg.player, false, g.homeTeamGame);  // XXX but unadjusted for game
            });

            it('properly handles 0 adjustments for foulCommitRating and foulDrawRating', () => {
                expect(pg.foulCommitRating).toEqual(40);
                expect(pg.foulDrawRating).toEqual(6);
            });
        });
    });
});
