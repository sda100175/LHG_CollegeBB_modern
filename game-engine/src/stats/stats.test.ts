import { Stats } from "./stats";

describe('Stats', () => {
    let s: Stats;
    
    const testForZeros = (s: Stats) => {
        expect(s.pointsScored).toEqual(0);
        expect(s.fieldGoalsAtt).toEqual(0);
        expect(s.fieldGoalsMade).toEqual(0);
        expect(s.fieldGoals3PtAtt).toEqual(0);
        expect(s.fieldGoals3PtMade).toEqual(0);
        expect(s.totalRebounds).toEqual(0);
        expect(s.assists).toEqual(0);
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
            s.fieldGoalsMade = 5;
            s.fieldGoals3PtAtt = 5;
            s.fieldGoals3PtMade = 2;
            s.totalRebounds = 4;
            s.assists = 7;
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
                ss[i].fieldGoalsMade = 4-i;
                ss[i].fieldGoals3PtAtt = 5-i;
                ss[i].fieldGoals3PtMade = 3-i;
                ss[i].totalRebounds = 3-i;
                ss[i].assists = 8-i;
                ss[i].personalFouls = 1;
            }
            s = Stats.compile(ss);
        });

        it('compiles stats correctly', () => {
            expect(s.pointsScored).toEqual(12);
            expect(s.fieldGoalsAtt).toEqual(27);
            expect(s.fieldGoalsMade).toEqual(9);
            expect(s.fieldGoals3PtAtt).toEqual(12);
            expect(s.fieldGoals3PtMade).toEqual(6);
            expect(s.totalRebounds).toEqual(6);
            expect(s.assists).toEqual(21);
            expect(s.personalFouls).toEqual(3);
        });
    });

    describe('add function', () => {
        beforeEach(() => {
            s.pointsScored = 6;
            s.fieldGoalsAtt = 10;
            s.fieldGoalsMade = 5;
            s.fieldGoals3PtAtt = 5;
            s.fieldGoals3PtMade = 2;
            s.totalRebounds = 4;
            s.assists = 3;
            s.personalFouls = 2;
            const s2 = new Stats();
            s2.pointsScored = 4;
            s2.fieldGoalsAtt = 6;
            s2.fieldGoalsMade = 2;
            s2.fieldGoals3PtAtt = 3;
            s2.fieldGoals3PtMade = 1;
            s2.totalRebounds = 3;
            s2.assists = 8;
            s.add(s2);
        });

        it('works properly', () => {
            expect(s.pointsScored).toEqual(10);
            expect(s.fieldGoalsAtt).toEqual(16);
            expect(s.fieldGoalsMade).toEqual(7);
            expect(s.fieldGoals3PtAtt).toEqual(8);
            expect(s.fieldGoals3PtMade).toEqual(3);
            expect(s.totalRebounds).toEqual(7);
            expect(s.assists).toEqual(11);
            expect(s.personalFouls).toEqual(2);            
        });
    });
});
