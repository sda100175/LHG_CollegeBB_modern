import { PlayerGame } from "./player-game";
import { makeGame } from "../../test_data/bootstrap-game";
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
