import { Team } from "../team/team";
import { Game } from "./game";
import teamData from "../../test_data/TeamData.1990.json";
import { GameLocation, GameSettings, ShotClockOption } from "../game-settings/game-settings";

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
        expect(g.shotClock).toEqual(30);
    });

    it('handles some various game options correctly', () => {
        let gs = new GameSettings();
        gs.location = GameLocation.NEUTRAL_SITE;
        gs.shotClock = ShotClockOption.NONE;
        g = new Game(gs, vt, ht);
        expect(g.location).toEqual('NEUTRAL SITE');
        expect(g.attendance).toBeGreaterThan(0);

        g.gameSettings.shotClock = ShotClockOption.NONE;        
        expect(g.shotClock).toEqual(0);

        gs.shotClock = ShotClockOption.SECONDS_35;
        g = new Game(gs, vt, ht);
        expect(g.shotClock).toEqual(35);

        gs.shotClock = ShotClockOption.SECONDS_45;
        g = new Game(gs, vt, ht);
        expect(g.shotClock).toEqual(45);
    });
});
