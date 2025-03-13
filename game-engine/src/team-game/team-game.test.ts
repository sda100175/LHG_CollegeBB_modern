import { TeamGame } from "./team-game";
import teamData from "../../test_data/TeamData.1990.json";
import { Team } from "../team/team";
import { PlayerGame } from "../player-game/player-game";

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
    let tg: TeamGame;
    let t: Team;
    
    beforeEach(() => {
        t = Team.fromObject(teamData['90 MARYLAND']);
        tg = new TeamGame(t);
    });

    it('initializes', () => {
        expect(tg.inspect()).toEqual({
            _adjFGAPerG: 69
        });

        const rc = countRoster(tg.roster);
        expect(rc.inactives).toBeGreaterThanOrEqual(4);
        expect(rc.actives).toBeGreaterThanOrEqual(7);
    });
});
