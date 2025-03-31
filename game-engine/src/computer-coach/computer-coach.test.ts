import { makeGame } from "../../test_data/bootstrap-game";
import { Game } from "../game/game";
import { PlayerGame } from "../player-game/player-game";
import { TeamGame } from "../team-game/team-game";
import { ComputerCoach } from "./computer-coach";

describe('ComputerCoach', () => {
    let cc: ComputerCoach;
    let g: Game;
    let htg: TeamGame;
    let p: PlayerGame;

    const assertLineupContains = (name: string) => {
        expect(htg.lineup.find(pg => pg.player.name === name)).not.toBeUndefined();
    }

    beforeEach(() => {
        g = makeGame('90 DUKE', '90 GA TECH');
        cc = new ComputerCoach(g.homeTeamGame);
        cc.setLineup();
        cc.setStrategy();
        htg = g.homeTeamGame;
        p = <PlayerGame> htg.roster.find(pg => pg.player.name === 'D.SCOTT');
    });

    it('fills out initial lineup with most likely players', () => {
        // 90 GA TECH has a very set lineup of guys that played every game with most contrib.
        // Their starting lineup should be the same every game, in a predictable order too.
        expect(htg.lineup.length).toEqual(5);
        ['D.SCOTT', 'OLIVER', 'K.ANDERSON', 'MACKEY', 'MCNEIL'].forEach(n => assertLineupContains(n));
        expect(htg.lineup[0].player.name).toEqual('K.ANDERSON');
        expect(htg.lineup[4].player.name).toEqual('MACKEY');
    });

    describe('slotByStamina with all restrictions on', () => {
        let slotByStamina: (checkFouls?: boolean, checkContribution?: boolean) => any[]; 
        let setAndAssertMissing: (name: string) => void;

        beforeEach(() => {
            slotByStamina = cc.inspect().slotByStamina;  // exposes private method for testing, had to be done
            setAndAssertMissing = (name: string) => {
                const lineup = slotByStamina();
                expect(lineup.find(pe => pe.playerGame.player.name === name)).toBeUndefined();
            }        
        });

        it('will not slot an inactive player ever', () => {
            p.isInactive = true;
            setAndAssertMissing('D.SCOTT');
        });
    
        it('will not slot a fouled out player ever', () => {
            p.stats.personalFouls = 5;
            setAndAssertMissing('D.SCOTT');
        });
        
        it('will not slot a player with 2 or less fouls to give in first half', () => {
            g.setGameClock(1, 650);
            p.stats.personalFouls = 3;
            setAndAssertMissing('D.SCOTT');
        });    

        it('will not slot a player with 1 foul to give in second half before 12 minutes left', () => {
            g.setGameClock(2, 770);
            p.stats.personalFouls = 4;
            setAndAssertMissing('D.SCOTT');
        });    

        it('will not slot a player that has used > 50% of contribution in 1st half', () => {
            g.setGameClock(1, 200);
            p.stats.fieldGoalsAtt = Math.ceil(p.contribPct * 0.51);
            setAndAssertMissing('D.SCOTT');
        });    

        it('will not slot a player that has used > 25% of contribution before 10:00 mark of 1st half', () => {
            g.setGameClock(1, 650);
            p.stats.fieldGoalsAtt = Math.ceil(p.contribPct * 0.26);
            setAndAssertMissing('D.SCOTT');
        });    

        it('will not slot a player that has used > 75% of contribution before 10:00 mark of 2nd half', () => {
            g.setGameClock(2, 650);
            p.stats.fieldGoalsAtt = Math.ceil(p.contribPct * 0.76);
            setAndAssertMissing('D.SCOTT');
        });    

        it('will not slot a player that has used > 87% of contribution before 5:00 mark of 2nd half', () => {
            g.setGameClock(2, 350);
            htg.roster.map(pg => pg.contribPct = (pg.player.name === 'D.SCOTT') ? pg.contribPct : 2);
            p.stats.fieldGoalsAtt = Math.ceil(p.contribPct * 0.90);
            setAndAssertMissing('D.SCOTT');
        });    

        it('will not slot a player that has a large amount of contribution under 5:00 mark of 2nd half', () => {
            g.setGameClock(2, 240);
            htg.roster.map(pg => pg.contribPct = (pg.player.name === 'D.SCOTT') ? pg.contribPct : 1);
            p.stats.fieldGoalsAtt = Math.ceil(p.contribPct * 0.91);
            setAndAssertMissing('D.SCOTT');
        });    
    });
});
