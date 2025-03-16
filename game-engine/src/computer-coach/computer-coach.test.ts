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
        expect(htg.lineup.length).toEqual(5);
        expect(htg.lineup.find(pg => pg.player.name === name)).not.toBeUndefined();
    }

    const assertLineupDoesNotContain = (name: string) => {
        expect(htg.lineup.length).toEqual(5);
        expect(htg.lineup.find(pg => pg.player.name === name)).toBeUndefined();
    }

    const setAndAssertMissing = (name: string) => {
        cc.setLineup();
        assertLineupDoesNotContain(name);
    }

    beforeEach(() => {
        g = makeGame('90 DUKE', '90 GA TECH');
        cc = new ComputerCoach(g.homeTeamGame);
        htg = g.homeTeamGame;
        p = <PlayerGame> htg.roster.find(pg => pg.player.name === 'D.SCOTT');
    });

    it('fills out initial lineup with most likely players', () => {
        // 90 GA TECH has a very set lineup of guys that played every game with most contrib.
        ['D.SCOTT', 'OLIVER', 'K.ANDERSON', 'MACKEY', 'MCNEIL'].forEach(n => assertLineupContains(n));
    });

    it('will not slot an inactive player', () => {
        p.isInactive = true;
        setAndAssertMissing('D.SCOTT');
    });

    it('will not slot a fouled out player', () => {
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
        p.stats.personalFouls = 1;
        p.stats.fieldGoalsAtt = 15;
        p.stats.totalRebounds = 5;
        setAndAssertMissing('D.SCOTT');
    });

    it('will not slot a player that has used > 25% of contribution before 10:00 mark of 1st half', () => {
        g.setGameClock(1, 650);
        p.stats.personalFouls = 1;
        p.stats.fieldGoalsAtt = 7;
        p.stats.totalRebounds = 3;
        setAndAssertMissing('D.SCOTT');
    });

    it('will not slot a player that has used > 75% of contribution before 10:00 mark of 2nd half', () => {
        g.setGameClock(2, 650);
        p.stats.personalFouls = 1;
        p.stats.fieldGoalsAtt = 20;
        p.stats.totalRebounds = 10;
        setAndAssertMissing('D.SCOTT');
    });
});
