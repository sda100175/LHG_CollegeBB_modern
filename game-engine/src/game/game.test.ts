import { Team } from "../team/team";
import { Game } from "./game";
import teamData from "../../test_data/TeamData.1990.json";
import { GameLocation, GameSettings } from "../game-settings/game-settings";

describe('Game', () => {
    let g: Game;
    let vt: Team, ht: Team;
    
    beforeEach(() => {
        vt = Team.fromObject(teamData['90 DUKE']);
        ht = Team.fromObject(teamData['90 MARYLAND']);
        g = new Game(new GameSettings(), vt, ht);
    });

    it('initializes the game, sets attendance, etc.', () => {
        expect(g.attendance).toBeGreaterThan(0);
        expect(g.location).toEqual('WILLIAM COLE JR. STUDENT ACTIVITIES BLDG');
    });

    describe('when the game is at a neutral site', () => {
        beforeEach(() => { g.gameSettings.location = GameLocation.NEUTRAL_SITE });

        it('identifies the location as neutral', () => {
            expect(g.location).toEqual('NEUTRAL SITE');
        });
    });
});
