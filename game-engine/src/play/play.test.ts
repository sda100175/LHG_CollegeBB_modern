import { Play, PlayType } from "./play";

describe('Play', () => {
    let ge: Play;
    
    beforeEach(() => ge = new Play(PlayType.NO_OP, null, null, 0));
    
    it('sets coaching allowed correctly', () => {
        expect(ge.coachingAllowed).toEqual(false);
        ge = new Play(PlayType.END_OF_HALF, null, null, 0)
        expect(ge.coachingAllowed).toEqual(true);
    });

    it('sets subs allowed correctly', () => {
        expect(ge.subsAllowed).toEqual(false);
        ge = new Play(PlayType.END_OF_HALF, null, null, 0)
        expect(ge.subsAllowed).toEqual(true);
    });

    describe('FG_MADE_2PT', () => {
        beforeEach(() => {
            ge = new Play(PlayType.FG_MADE_2PT, null, null, 0)
        });

        it('records stats', () => {
            expect(ge.stats.fieldGoalsAtt).toEqual(1);
            expect(ge.stats.fieldGoalsMade).toEqual(1);
            expect(ge.stats.pointsScored).toEqual(2);
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
            ge = new Play(PlayType.FG_MISS_2PT, null, null, 0)
        });

        it('records stats', () => {
            expect(ge.stats.fieldGoalsAtt).toEqual(1);
            expect(ge.stats.fieldGoalsMade).toEqual(1);
            expect(ge.stats.pointsScored).toEqual(0);
        });

        it('disallows coaching', () => {
            expect(ge.coachingAllowed).toEqual(false);
        });

        it('disallows subs', () => {
            expect(ge.subsAllowed).toEqual(false);
        });
    });
});