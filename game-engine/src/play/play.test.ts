import { makeGame } from "../../test_data/bootstrap-game";
import { Game } from "../game/game";
import { PlayerGame } from "../player-game/player-game";
import { Play, PlayType } from "./play";

describe('Play', () => {
    let g: Game;
    let pg: PlayerGame;
    let ge: Play;
    
    beforeEach(() => {
        g = makeGame('90 DUKE', '90 MARYLAND');
        pg = g.homeTeamGame.roster[0];
        ge = new Play(PlayType.NO_OP, {});
    });
    
    it('sets coaching allowed correctly', () => {
        expect(ge.coachingAllowed).toEqual(false);
        ge = new Play(PlayType.END_OF_HALF, {})
        expect(ge.coachingAllowed).toEqual(true);
    });

    it('sets subs allowed correctly', () => {
        expect(ge.subsAllowed).toEqual(false);
        ge = new Play(PlayType.END_OF_HALF, {})
        expect(ge.subsAllowed).toEqual(true);
    });

    describe('FG_MADE_2PT', () => {
        beforeEach(() => {
            ge = new Play(PlayType.FG_MADE_2PT, { 
                team: g.homeTeamGame,
                player: pg,
                assistPlayer: g.homeTeamGame.roster[1],
                timeElapsed: 10
            })
        });

        it('records stats', () => {
            expect(ge.stats.fieldGoalsAtt).toEqual(1);
            expect(ge.stats.fieldGoalsMade).toEqual(1);
            expect(ge.stats.pointsScored).toEqual(2);
            expect(ge.stats.assists).toEqual(1);
            expect(pg.stats.fieldGoalsAtt).toEqual(1);
            expect(pg.stats.fieldGoalsMade).toEqual(1);
            expect(pg.stats.pointsScored).toEqual(2);
            expect(g.homeTeamGame.roster[1].stats.assists).toEqual(1);
        });

        it('allows coaching', () => {
            expect(ge.coachingAllowed).toEqual(true);
        });

        it('disallows subs', () => {
            expect(ge.subsAllowed).toEqual(false);
        });
    });

    describe('FG_MISS_2PT', () => {
        beforeEach(() => {
            ge = new Play(PlayType.FG_MISS_2PT, { 
                team: g.homeTeamGame,
                player: pg,
                timeElapsed: 6
            })
        });

        it('records stats', () => {
            expect(ge.stats.fieldGoalsAtt).toEqual(1);
            expect(ge.stats.fieldGoalsMade).toEqual(0);
            expect(ge.stats.pointsScored).toEqual(0);
            expect(pg.stats.fieldGoalsAtt).toEqual(1);
            expect(pg.stats.fieldGoalsMade).toEqual(0);
            expect(pg.stats.pointsScored).toEqual(0);
        });

        it('disallows coaching', () => {
            expect(ge.coachingAllowed).toEqual(false);
        });

        it('disallows subs', () => {
            expect(ge.subsAllowed).toEqual(false);
        });
    });

    describe('L5S_FG_MADE_BACKCOURT_2PT', () => {
        beforeEach(() => {
            ge = new Play(PlayType.L5S_FG_MADE_BACKCOURT_2PT, { 
                team: g.homeTeamGame,
                player: pg,
                assistPlayer: g.homeTeamGame.roster[1],
                timeElapsed: 2
            })
        });

        it('records stats', () => {
            expect(ge.stats.fieldGoalsAtt).toEqual(1);
            expect(ge.stats.fieldGoalsMade).toEqual(1);
            expect(ge.stats.pointsScored).toEqual(2);
            expect(ge.stats.assists).toEqual(1);
            expect(pg.stats.fieldGoalsAtt).toEqual(1);
            expect(pg.stats.fieldGoalsMade).toEqual(1);
            expect(pg.stats.pointsScored).toEqual(2);
            expect(g.homeTeamGame.roster[1].stats.assists).toEqual(1);
        });

        it('disallows coaching', () => {
            expect(ge.coachingAllowed).toEqual(false);
        });

        it('disallows subs', () => {
            expect(ge.subsAllowed).toEqual(false);
        });
    });

    describe('L5S_FG_MADE_BACKCOURT_3PT', () => {
        beforeEach(() => {
            ge = new Play(PlayType.L5S_FG_MADE_BACKCOURT_3PT, { 
                team: g.homeTeamGame,
                player: pg,
                assistPlayer: g.homeTeamGame.roster[1],
                timeElapsed: 2
            })
        });

        it('records stats', () => {
            expect(ge.stats.fieldGoals3PtAtt).toEqual(1);
            expect(ge.stats.fieldGoals3PtMade).toEqual(1);
            expect(ge.stats.pointsScored).toEqual(3);
            expect(ge.stats.assists).toEqual(1);
            expect(pg.stats.fieldGoals3PtAtt).toEqual(1);
            expect(pg.stats.fieldGoals3PtMade).toEqual(1);
            expect(pg.stats.pointsScored).toEqual(3);
            expect(g.homeTeamGame.roster[1].stats.assists).toEqual(1);
        });

        it('disallows coaching', () => {
            expect(ge.coachingAllowed).toEqual(false);
        });

        it('disallows subs', () => {
            expect(ge.subsAllowed).toEqual(false);
        });
    });

    describe('L5S_FG_MISS_BACKCOURT_2PT', () => {
        beforeEach(() => {
            ge = new Play(PlayType.L5S_FG_MISS_BACKCOURT_2PT, { 
                team: g.homeTeamGame,
                player: pg,
                timeElapsed: 2
            })
        });

        it('records stats', () => {
            expect(ge.stats.fieldGoalsAtt).toEqual(1);
            expect(ge.stats.fieldGoalsMade).toEqual(0);
            expect(ge.stats.pointsScored).toEqual(0);
            expect(ge.stats.assists).toEqual(0);
            expect(pg.stats.fieldGoalsAtt).toEqual(1);
            expect(pg.stats.fieldGoalsMade).toEqual(0);
            expect(pg.stats.pointsScored).toEqual(0);
            expect(g.homeTeamGame.roster[1].stats.assists).toEqual(0);
        });

        it('disallows coaching', () => {
            expect(ge.coachingAllowed).toEqual(false);
        });

        it('disallows subs', () => {
            expect(ge.subsAllowed).toEqual(false);
        });
    });

    describe('L5S_FG_MISS_BACKCOURT_3PT', () => {
        beforeEach(() => {
            ge = new Play(PlayType.L5S_FG_MISS_BACKCOURT_3PT, { 
                team: g.homeTeamGame,
                player: pg,
                timeElapsed: 2
            })
        });

        it('records stats', () => {
            expect(ge.stats.fieldGoals3PtAtt).toEqual(1);
            expect(ge.stats.fieldGoals3PtMade).toEqual(0);
            expect(ge.stats.pointsScored).toEqual(0);
            expect(ge.stats.assists).toEqual(0);
            expect(pg.stats.fieldGoals3PtAtt).toEqual(1);
            expect(pg.stats.fieldGoals3PtMade).toEqual(0);
            expect(pg.stats.pointsScored).toEqual(0);
            expect(g.homeTeamGame.roster[1].stats.assists).toEqual(0);
        });

        it('disallows coaching', () => {
            expect(ge.coachingAllowed).toEqual(false);
        });

        it('disallows subs', () => {
            expect(ge.subsAllowed).toEqual(false);
        });
    });

});