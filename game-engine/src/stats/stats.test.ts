import { Stats } from "./stats";

describe('Stats', () => {
    let s: Stats;
    
    const testForZeros = (s: Stats) => {
        expect(s.fieldGoalsAtt).toEqual(0);
        expect(s.totalRebounds).toEqual(0);
        expect(s.personalFouls).toEqual(0);
    }

    beforeEach(() => {
        s = new Stats();
    });

    it('initializes', () => testForZeros(s));

    describe('reset function', () => {
        beforeEach(() => {
            s.fieldGoalsAtt = 10;
            s.totalRebounds = 4;
            s.personalFouls = 2;
            s.reset();
        });

        it('clears the stats', () => testForZeros(s));
    });
});
