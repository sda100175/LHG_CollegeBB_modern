import { Team } from "../team/team";
import { Game } from "./game";
import teamData from "../../test_data/TeamData.1990.json";
import { GameLocation, GameSettings, PlayerOption, ShotClockOption } from "../game-settings/game-settings";
import { TeamGameControl } from "../team-game/team-game";

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
        expect(g.gameAvgStamina).toBeCloseTo(128.5, 1);
        expect(g.visitorTeamGame.control).toEqual(TeamGameControl.CPU);
        expect(g.homeTeamGame.control).toEqual(TeamGameControl.CPU);
    });

    it('handles neutral site correctly', () => {
        let gs = new GameSettings();
        gs.location = GameLocation.NEUTRAL_SITE;
        g = new Game(gs, vt, ht);
        expect(g.location).toEqual('NEUTRAL SITE');
        expect(g.attendance).toBeGreaterThan(0);
    });

    it('handles the shot clock options correctly', () => {
        let gs = new GameSettings();

        gs.shotClock = ShotClockOption.NONE;        
        g = new Game(gs, vt, ht);
        expect(g.shotClock).toEqual(0);

        gs.shotClock = ShotClockOption.SECONDS_35;
        g = new Game(gs, vt, ht);
        expect(g.shotClock).toEqual(35);

        gs.shotClock = ShotClockOption.SECONDS_45;
        g = new Game(gs, vt, ht);
        expect(g.shotClock).toEqual(45);
    });

    it('handles the player mode options correctly', () => {
        let gs = new GameSettings();
        gs.playerMode = PlayerOption.VS_HUMAN;
        g = new Game(gs, vt, ht);
        expect(g.visitorTeamGame.control).toEqual(TeamGameControl.HUMAN);
        expect(g.homeTeamGame.control).toEqual(TeamGameControl.HUMAN);

        gs.playerMode = PlayerOption.CPU_IS_HOME;
        g = new Game(gs, vt, ht);
        expect(g.visitorTeamGame.control).toEqual(TeamGameControl.HUMAN);
        expect(g.homeTeamGame.control).toEqual(TeamGameControl.CPU);

        gs.playerMode = PlayerOption.CPU_IS_VISITOR;
        g = new Game(gs, vt, ht);
        expect(g.visitorTeamGame.control).toEqual(TeamGameControl.CPU);
        expect(g.homeTeamGame.control).toEqual(TeamGameControl.HUMAN);
    });

    it('adjusts rebound foul chance as needed', () => {
        // The initial 90 Duke/Maryland game has a game stamina well over 120, should see adjustment
        expect(g.inspect()._rebFoulChance).toBeCloseTo(7.1, 1);

        // Here are two much slower paced teams, no adjustment here.
        vt = Team.fromObject(teamData['90 LAFAYETTE']);
        ht = Team.fromObject(teamData['90 KANSAS ST']);
        g = new Game(new GameSettings(), vt, ht);
        expect(g.inspect()._rebFoulChance).toEqual(8);
    });
});
