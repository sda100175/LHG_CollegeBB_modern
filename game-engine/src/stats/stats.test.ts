import { Stats } from "./stats";

describe('Stats', () => {
    let s: Stats;
    
    const testForZeros = (s: Stats) => {
        expect(s.pointsScored).toEqual(0);
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
            s.pointsScored = 6;
            s.fieldGoalsAtt = 10;
            s.totalRebounds = 4;
            s.personalFouls = 2;
            s.reset();
        });

        it('clears the stats', () => testForZeros(s));
    });

    describe('compile function', () => {
        let s: Stats;
        let ss: Stats[] = [];

        beforeEach(() => {
            for (let i = 0; i < 3; i++) {
                ss[i] = new Stats();
                ss[i].pointsScored = 5-i;
                ss[i].fieldGoalsAtt = 10-i;
                ss[i].totalRebounds = 3-i;
                ss[i].personalFouls = 1;
            }
            s = Stats.compile(ss);
        });

        it('compiles stats correctly', () => {
            expect(s.pointsScored).toEqual(12);
            expect(s.fieldGoalsAtt).toEqual(27);
            expect(s.totalRebounds).toEqual(6);
            expect(s.personalFouls).toEqual(3);
        });
    });
});
