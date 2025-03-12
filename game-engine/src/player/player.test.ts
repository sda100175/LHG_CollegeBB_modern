import { Player } from "./player";

describe('Player', () => {
    let obj: Record<string, any>;
    let p: Player;
    
    beforeEach(() => {
        obj = {
            "name": "O'NEAL",
            "adjFgPct":  57,
            "ftPct":  56,
            "defReb40Minx10":  103,
            "contribPct":  20,
            "assistRating":  2,
            "stealRating":  2,
            "blockRating":  5,
            "gamesPlayed":  32,
            "fgAtt":  314,
            "fg3Pct":  0,
            "fg3OfTotalFgAtt":  0,
            "offReb40Minx10":  57,
            "foulCommitRating":  54,
            "foulDrawRating":  14
        }
        p = Player.fromObject(obj);
    });

    it('correctly initializes class from object', () => {
        expect(p.name).toEqual("O'NEAL");
        expect(p.adjFgPct).toEqual(57);
        expect(p.ftPct).toEqual(56);
        expect(p.defReb40Minx10).toEqual(103);
        expect(p.contribPct).toEqual(20);
        expect(p.assistRating).toEqual(2);
        expect(p.stealRating).toEqual(2);
        expect(p.blockRating).toEqual(5);
        expect(p.gamesPlayed).toEqual(32);
        expect(p.fgAtt).toEqual(314);
        expect(p.fg3Pct).toEqual(0);
        expect(p.fg3OfTotalFgAtt).toEqual(0);
        expect(p.offReb40Minx10).toEqual(57);
        expect(p.foulCommitRating).toEqual(54);
        expect(p.foulDrawRating).toEqual(14);
    });

    it('correctly serializes to an object', () => {
        expect(p.toObject()).toEqual(obj);
    });

    it('correctly throws if initialization object is not valid', () => {
        obj.stealRating = '200';
        expect(() => Player.fromObject(obj)).toThrow();
    });
});
