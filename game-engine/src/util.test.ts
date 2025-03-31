import { Rand1, Rand100 } from "./util";

describe('Rand100', () => {
    it('returns random numbers between 1 and 100', () => {
        for (let i = 0; i < 100; i++) {
            const r = Rand100();
            expect(r).toBeGreaterThanOrEqual(1);
            expect(r).toBeLessThanOrEqual(100);
        }
    });
});

describe('Rand1', () => {
    it('returns random number 0 or 1', () => {
        for (let i = 0; i < 100; i++) {
            const r = Rand1();
            expect(r).toBeGreaterThanOrEqual(0);
            expect(r).toBeLessThanOrEqual(1);
        }
    });
});
