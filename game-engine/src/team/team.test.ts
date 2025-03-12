import { Team } from "./team";

describe('Team', () => {
    let obj: Record<string, any>;
    let t: Team;
    
    beforeEach(() => {
        obj = {
            "name": "90 LSU",
            "teamStamina":  144,
            "defFGPctAdj": -5,
            "def3FGAvFGAAdj":  9,
            "def3FGPctAdj":  99,
            "offStealRating":  4,
            "offTurnoverRating":  4,
            "defTurnoverAdj":  99,
            "defFoulAdj":  0,
            "ifUsing99":  99,
            "textColor":  14,
            "backgroundColor":  5,
            "twelve":  999,
            "teamFGAPerG":  69,
            "leagueFGAPerG":  59,
            "teamGamesPlayed":  32,
            "homecourtFactor":  5,
            "wins":  0,
            "losses":  0,
            "powerRating":  0,
            "coach": "DALE BROWN",
            "arena": "PETE MARAVICH ASSEMBLY CENTER",
            "nickname": "TIGERS",
            "attendance":  16546,
            "players": [
               {
                  "name": "C.JACKSON",
                  "adjFgPct":  52,
                  "ftPct":  91,
                  "defReb40Minx10":  26,
                  "contribPct":  21,
                  "assistRating":  3,
                  "stealRating":  2,
                  "blockRating":  0,
                  "gamesPlayed":  32,
                  "fgAtt":  662,
                  "fg3Pct":  36,
                  "fg3OfTotalFgAtt":  37,
                  "offReb40Minx10":  4,
                  "foulCommitRating":  22,
                  "foulDrawRating":  9
               },
               {
                  "name": "S.ROBERTS",
                  "adjFgPct":  59,
                  "ftPct":  46,
                  "defReb40Minx10":  92,
                  "contribPct":  19,
                  "assistRating":  2,
                  "stealRating":  1,
                  "blockRating":  3,
                  "gamesPlayed":  32,
                  "fgAtt":  347,
                  "fg3Pct":  30,
                  "fg3OfTotalFgAtt":  0,
                  "offReb40Minx10":  48,
                  "foulCommitRating":  57,
                  "foulDrawRating":  7
               },
               {
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
               },
               {
                  "name": "WILLIAMSON",
                  "adjFgPct":  56,
                  "ftPct":  65,
                  "defReb40Minx10":  20,
                  "contribPct":  10,
                  "assistRating":  5,
                  "stealRating":  3,
                  "blockRating":  0,
                  "gamesPlayed":  31,
                  "fgAtt":  273,
                  "fg3Pct":  38,
                  "fg3OfTotalFgAtt":  35,
                  "offReb40Minx10":  10,
                  "foulCommitRating":  45,
                  "foulDrawRating":  10
               },
               {
                  "name": "SINGLETON",
                  "adjFgPct":  60,
                  "ftPct":  58,
                  "defReb40Minx10":  41,
                  "contribPct":  9,
                  "assistRating":  1,
                  "stealRating":  2,
                  "blockRating":  1,
                  "gamesPlayed":  32,
                  "fgAtt":  166,
                  "fg3Pct":  30,
                  "fg3OfTotalFgAtt":  1,
                  "offReb40Minx10":  39,
                  "foulCommitRating":  55,
                  "foulDrawRating":  21
               },
               {
                  "name": "SIMS",
                  "adjFgPct":  51,
                  "ftPct":  76,
                  "defReb40Minx10":  44,
                  "contribPct":  10,
                  "assistRating":  2,
                  "stealRating":  1,
                  "blockRating":  1,
                  "gamesPlayed":  32,
                  "fgAtt":  219,
                  "fg3Pct":  18,
                  "fg3OfTotalFgAtt":  5,
                  "offReb40Minx10":  26,
                  "foulCommitRating":  23,
                  "foulDrawRating":  0
               },
               {
                  "name": "DEVALL",
                  "adjFgPct":  49,
                  "ftPct":  66,
                  "defReb40Minx10":  47,
                  "contribPct":  7,
                  "assistRating":  5,
                  "stealRating":  2,
                  "blockRating":  0,
                  "gamesPlayed":  32,
                  "fgAtt":  128,
                  "fg3Pct":  36,
                  "fg3OfTotalFgAtt":  45,
                  "offReb40Minx10":  13,
                  "foulCommitRating":  41,
                  "foulDrawRating":  0
               },
               {
                  "name": "BOUDREAUX",
                  "adjFgPct":  47,
                  "ftPct":  67,
                  "defReb40Minx10":  52,
                  "contribPct":  4,
                  "assistRating":  1,
                  "stealRating":  2,
                  "blockRating":  1,
                  "gamesPlayed":  32,
                  "fgAtt":  70,
                  "fg3Pct":  42,
                  "fg3OfTotalFgAtt":  17,
                  "offReb40Minx10":  38,
                  "foulCommitRating":  39,
                  "foulDrawRating":  0
               },
               {
                  "name": "KRAJEWSKI",
                  "adjFgPct":  31,
                  "ftPct":  40,
                  "defReb40Minx10":  29,
                  "contribPct":  1,
                  "assistRating":  1,
                  "stealRating":  1,
                  "blockRating":  1,
                  "gamesPlayed":  26,
                  "fgAtt":  13,
                  "fg3Pct":  0,
                  "fg3OfTotalFgAtt":  0,
                  "offReb40Minx10":  21,
                  "foulCommitRating":  34,
                  "foulDrawRating":  3
               },
               {
                  "name": "TRACEY",
                  "adjFgPct":  21,
                  "ftPct":  57,
                  "defReb40Minx10":  17,
                  "contribPct":  0,
                  "assistRating":  6,
                  "stealRating":  2,
                  "blockRating":  0,
                  "gamesPlayed":  6,
                  "fgAtt":  2,
                  "fg3Pct":  0,
                  "fg3OfTotalFgAtt":  0,
                  "offReb40Minx10":  33,
                  "foulCommitRating":  17,
                  "foulDrawRating":  60
               },
               {
                  "name": "XXX",
                  "adjFgPct":  0,
                  "ftPct":  0,
                  "defReb40Minx10":  0,
                  "contribPct":  0,
                  "assistRating":  0,
                  "stealRating":  0,
                  "blockRating":  0,
                  "gamesPlayed":  0,
                  "fgAtt":  0,
                  "fg3Pct":  0,
                  "fg3OfTotalFgAtt":  0,
                  "offReb40Minx10":  0,
                  "foulCommitRating":  0,
                  "foulDrawRating":  0
               },
               {
                  "name": "XXX",
                  "adjFgPct":  0,
                  "ftPct":  0,
                  "defReb40Minx10":  0,
                  "contribPct":  0,
                  "assistRating":  0,
                  "stealRating":  0,
                  "blockRating":  0,
                  "gamesPlayed":  0,
                  "fgAtt":  0,
                  "fg3Pct":  0,
                  "fg3OfTotalFgAtt":  0,
                  "offReb40Minx10":  0,
                  "foulCommitRating":  0,
                  "foulDrawRating":  0
               },
               {
                  "name": "XXX",
                  "adjFgPct":  0,
                  "ftPct":  0,
                  "defReb40Minx10":  0,
                  "contribPct":  0,
                  "assistRating":  0,
                  "stealRating":  0,
                  "blockRating":  0,
                  "gamesPlayed":  0,
                  "fgAtt":  0,
                  "fg3Pct":  0,
                  "fg3OfTotalFgAtt":  0,
                  "offReb40Minx10":  0,
                  "foulCommitRating":  0,
                  "foulDrawRating":  0
               },
               {
                  "name": "XXX",
                  "adjFgPct":  0,
                  "ftPct":  0,
                  "defReb40Minx10":  0,
                  "contribPct":  0,
                  "assistRating":  0,
                  "stealRating":  0,
                  "blockRating":  0,
                  "gamesPlayed":  0,
                  "fgAtt":  0,
                  "fg3Pct":  0,
                  "fg3OfTotalFgAtt":  0,
                  "offReb40Minx10":  0,
                  "foulCommitRating":  0,
                  "foulDrawRating":  0
               }
            ]      
        }
        t = Team.fromObject(obj);
    });

    it('correctly initializes class from object', () => {
        expect(t.name).toEqual('90 LSU');
        expect(t.teamStamina).toEqual(144);
        expect(t.defFGPctAdj).toEqual(-5);
        expect(t.def3FGAvFGAAdj).toEqual(9);
        expect(t.def3FGPctAdj).toEqual(99);
        expect(t.offStealRating).toEqual(4);
        expect(t.offTurnoverRating).toEqual(4);
        expect(t.defTurnoverAdj).toEqual(99);
        expect(t.defFoulAdj).toEqual(0);
        expect(t.ifUsing99).toEqual(99);
        expect(t.textColor).toEqual(14);
        expect(t.backgroundColor).toEqual(5);
        expect(t.twelve).toEqual(999);
        expect(t.teamFGAPerG).toEqual(69);
        expect(t.leagueFGAPerG).toEqual(59);
        expect(t.teamGamesPlayed).toEqual(32);
        expect(t.homecourtFactor).toEqual(5);
        expect(t.wins).toEqual(0);
        expect(t.losses).toEqual(0);
        expect(t.powerRating).toEqual(0);
        expect(t.coach).toEqual('DALE BROWN');
        expect(t.arena).toEqual('PETE MARAVICH ASSEMBLY CENTER');
        expect(t.nickname).toEqual('TIGERS');
        expect(t.attendance).toEqual(16546);

        expect(t.players.length).toEqual(14);
        expect(t.players[2].name).toEqual("O'NEAL");
        expect(t.players[2].ftPct).toEqual(56);
    });

    it('correctly serializes to an object', () => {
        expect(t.toObject()).toEqual(obj);
    });

    it('correctly throws if initialization object is not valid', () => {
        obj.teamStamina = '200';
        expect(() => Team.fromObject(obj)).toThrow();
    });

    it('correctly throws if initialization object has a player that is not valid', () => {
        obj.players[0] = {};
        expect(() => Team.fromObject(obj)).toThrow();
    });
});
