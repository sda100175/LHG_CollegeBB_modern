import { TeamGame, TeamGameControl } from "./team-game";
import { PlayerGame } from "../player-game/player-game";
import { Game } from "../game/game";
import { GameSettings, PlayerOption } from "../game-settings/game-settings";
import { makeGame } from "../../test_data/bootstrap-game";

const countRoster = (r: PlayerGame[]) => {
    let actives = 0, inactives = 0;
    r.forEach(pg => {
        if (pg.isInactive) {
            inactives++;
        } else {
            actives++
        }
    })
    return { actives, inactives };
}

describe('TeamGame', () => {
    let g: Game;
    let vtg: TeamGame, htg: TeamGame;

    describe('using stock teams', () => {
        beforeEach(() => {
            const gs = new GameSettings();
            gs.playerMode = PlayerOption.CPU_IS_VISITOR;
            g = makeGame('90 DUKE', '90 MARYLAND', { gs });
            vtg = g.visitorTeamGame;
            htg = g.homeTeamGame;
        });
    
        it('initializes basic fields correctly', () => {
            expect(htg.control).toEqual(TeamGameControl.HUMAN);
            expect(htg.year).toEqual(1990);
            expect(htg.adjFGAPerG).toEqual(69);
            expect(htg.offStealRating).toEqual(0);
            expect(htg.defTurnoverAdj).toEqual(2);
            expect(htg.defFoulAdj).toEqual(2);
            expect(htg.offTurnoverRating).toEqual(5);
            expect(htg.def3FGAvFGAAdj).toEqual(2);
            expect(htg.def3FGPctAdj).toEqual(0);
            expect(htg.stats).toBeTruthy();
            
            expect(vtg.control).toEqual(TeamGameControl.CPU);
        });        

        it('initializes roster correctly', () => {
            const rc = countRoster(htg.roster);
            expect(rc.inactives).toBeGreaterThanOrEqual(4);
            expect(rc.actives).toBeGreaterThanOrEqual(7);
        });

        it('initializes foul draw ratings correctly', () => {
            // No foul draw adjustments here (stock teams use '99')
            const pg = htg.roster[0];
            expect(pg.foulDrawRating).toEqual(10);
        });

        it('adjusts contribution percentage properly', () => {
            // Use MASSENBURG, he didn't play every game but should be active.
            // This is an inexact science because the inactive players for each game are largely random.
            // The game stamina for Duke/Maryland is high at 128.5, 
            const pg = htg.roster[1];
            if (pg.isInactive === false) {
                expect(pg.contribPct).toBeGreaterThanOrEqual(28);
                expect(pg.contribPct).toBeLessThanOrEqual(37);
            }
        });    
    });

    describe('using stock teams with modifications to test adjustment logic', () => {
        beforeEach(() => {
            const hcust = {
                def3FGAvFGAAdj: 105,
                def3FGPctAdj: 102,
                defFoulAdj: 106,
                defTurnoverAdj: 108,
                offTurnoverRating: 0,
                offStealRating: 107,
            };
            g = makeGame('90 DUKE', '90 MARYLAND', { hcust });
            htg = g.homeTeamGame;
        });
    
        it('makes adjustments correctly', () => {
            expect(htg.defTurnoverAdj).toEqual(8);
            expect(htg.defFoulAdj).toEqual(6);
            expect(htg.offTurnoverRating).toEqual(4);
            expect(htg.offStealRating).toEqual(7);
            expect(htg.def3FGAvFGAAdj).toEqual(5);
            expect(htg.def3FGPctAdj).toEqual(2);
        });        
    });

    describe('when exercising the 99 logic', () => {
        beforeEach(() => {
            const hcust = { ifUsing99: 0 };
            g = makeGame('90 DUKE', '90 MARYLAND', { hcust });
            htg = g.homeTeamGame;
        });
    
        it('makes adjustments correctly', () => {
            expect(htg.offStealRating).toEqual(0);
            expect(htg.defTurnoverAdj).toEqual(0);
            expect(htg.defFoulAdj).toEqual(0);
            expect(htg.offTurnoverRating).toEqual(4);

            // Adjusted foul draw (avg stamina for this game is 128.5)
            let pg = htg.roster[0]; // MUSTAF, 10 * (120 / 128.5) <0.934> = 9.34
            expect(pg.foulDrawRating).toBeCloseTo(9.34, 2);
        });        
    });
});
