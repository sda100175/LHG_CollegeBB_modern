import { LineupError, LineupErrorCode, TeamGame, TeamGameControl } from "./team-game";
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
            expect(htg.defFGPctAdj).toEqual(-3);
            
            expect(vtg.control).toEqual(TeamGameControl.CPU);
        });        

        it('initializes roster correctly', () => {
            const rc = countRoster(htg.roster);
            expect(rc.inactives).toBeGreaterThanOrEqual(4);
            expect(rc.actives).toBeGreaterThanOrEqual(7);
        });

        it('tracks fouls for half properly', () => {
            expect(htg.foulsForHalf).toEqual(0);
            htg.addFoulForHalf();
            expect(htg.foulsForHalf).toEqual(1);
            htg.resetFoulsForHalf();
            expect(htg.foulsForHalf).toEqual(0);
        });

        it('initializes foul draw ratings correctly', () => {
            // No foul draw adjustments here (stock teams use '99')
            g.gameSettings.threePtShots = false;  // avoid the 3pt adjustment for foulDrawRating here
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
        
        it('handles timeouts properly', () => {
            expect(htg.timeouts).toEqual(5);
            expect(htg.takeTimeout()).toEqual(true);
            expect(htg.timeouts).toEqual(4);
            for (let i = 0; i < 4; i++) { htg.takeTimeout() }
            expect(htg.takeTimeout()).toEqual(false);
        });

        describe('with a set lineup', () => {
            beforeEach(() => {
                htg.lineup.push(htg.roster[0]);
                htg.lineup.push(htg.roster[1]);
                htg.lineup.push(htg.roster[2]);
                htg.lineup.push(htg.roster[3]);
                htg.lineup.push(htg.roster[4]);
            });

            it('adjusts defFGPctAdj for players playing safe', () => {
                htg.lineup[0].stats.personalFouls = 2;
                htg.lineup[1].stats.personalFouls = 2;
                htg.lineup[0].isPlayingSafe = true;
                htg.lineup[1].isPlayingSafe = true;
                expect(htg.defFGPctAdj).toEqual(-1);
            });    

            it('returns random players from the lineup', () => {
                for (let i = 0; i < 10; i++) {
                    expect(htg.getRandomLineupPlayer()).not.toBeFalsy();
                }
            });

            it('returns assist players or null if no assist', () => {
                for (let i = 0; i < 10; i++) {
                    const shooter = htg.getRandomLineupPlayer();
                    const assist = htg.getAssistPlayer(shooter);
                    if (assist !== null) {  // null is valid
                        expect(assist).not.toEqual(shooter);
                    }
                }
            });

            it('calculates foulCommitRatingSum properly', () => {
                expect(htg.foulCommitRatingSum).toEqual(189);
            });

            it('adds time played correctly', () => {
                htg.addTimePlayed(5);
                expect(htg.lineup[0].timePlayed).toEqual(5);
                expect(htg.lineup[4].timePlayed).toEqual(5);
                htg.lineup[4] = htg.roster[5];
                htg.addTimePlayed(10);
                expect(htg.lineup[0].timePlayed).toEqual(15);
                expect(htg.lineup[4].timePlayed).toEqual(10);
            });

            describe('checkLineup', () => {
                it('reports no errors if lineup is valid', () => {
                    console.log('<DBG> lineup should be valud but here it is: ', 
                        htg.lineup.map(pg => `${pg.player.name} inactive=${pg.isInactive}`));
                    expect(() => htg.checkLineup()).not.toThrow();
                });
    
                it('throws an INCOMPLETE error if lineup is not full', () => {
                    htg.lineup.pop();
                    try {
                        htg.checkLineup();
                    } catch (ce: any) {
                        expect(ce).toBeInstanceOf(LineupError);
                        expect(ce.code).toEqual(LineupErrorCode.INCOMPLETE);
                    }
                });
    
                it('throws a DUPLICATE_PLAYER error if lineup contains same player more than once', () => {
                    htg.lineup[4] = htg.lineup[0];
                    try {
                        htg.checkLineup();
                    } catch (ce: any) {
                        expect(ce).toBeInstanceOf(LineupError);
                        expect(ce.code).toEqual(LineupErrorCode.DUPLICATE_PLAYER);
                    }
                });
    
                it('throws a INVALID_PLAYER error if lineup contains a player that was inactive', () => {
                    htg.lineup[4].isInactive = true;
                    try {
                        htg.checkLineup();
                    } catch (ce: any) {
                        expect(ce).toBeInstanceOf(LineupError);
                        expect(ce.code).toEqual(LineupErrorCode.INVALID_PLAYER);
                    }
                });
    
                it('throws a INVALID_PLAYER error if lineup contains a player that has fouled out', () => {
                    htg.lineup[4].stats.personalFouls = 5;
                    try {
                        htg.checkLineup();
                    } catch (ce: any) {
                        expect(ce).toBeInstanceOf(LineupError);
                        expect(ce.code).toEqual(LineupErrorCode.INVALID_PLAYER);
                    }
                });    
            });
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
        });        
    });
});
