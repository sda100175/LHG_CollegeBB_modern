import { makeGame } from "../../test_data/bootstrap-game";
import { Game } from "../game/game";
import { PlayerGame } from "../player-game/player-game";
import { TeamGame } from "../team-game/team-game";
import { ComputerCoach } from "./computer-coach";

describe('ComputerCoach', () => {
    let cc: ComputerCoach;
    let g: Game;
    let htg: TeamGame;
    
    const assertLineupContains = (name: string) => {
        expect(htg.lineup.length).toEqual(5);
        expect(htg.lineup.find(pg => pg.player.name === name)).not.toBeUndefined();
    }

    const assertLineupDoesNotContain = (name: string) => {
        expect(htg.lineup.length).toEqual(5);
        expect(htg.lineup.find(pg => pg.player.name === name)).toBeUndefined();
    }

    beforeEach(() => {
        g = makeGame('90 DUKE', '90 GA TECH');
        cc = new ComputerCoach(g.homeTeamGame);
        htg = g.homeTeamGame;
    });

    it('fills out initial lineup with most likely players', () => {
        // 90 GA TECH has a very set lineup of guys that played every game with most contrib.
        ['D.SCOTT', 'OLIVER', 'K.ANDERSON', 'MACKEY', 'MCNEIL'].forEach(n => assertLineupContains(n));
    });

    it('will not slot an inactive player', () => {
        const p = <PlayerGame> htg.roster.find(pg => pg.player.name === 'D.SCOTT');
        p.isInactive = true;
        cc.setLineup();
        assertLineupDoesNotContain('D.SCOTT');
    });

    it('will not slot a fouled out player', () => {
        const p = <PlayerGame> htg.roster.find(pg => pg.player.name === 'D.SCOTT');
        p.stats.personalFouls = 5;
        cc.setLineup();
        assertLineupDoesNotContain('D.SCOTT');
    });
});
