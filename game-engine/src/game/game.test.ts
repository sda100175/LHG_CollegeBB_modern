import { Team } from "../team/team";
import { Game } from "./game";
import teamData from "../../test_data/TeamData.1990.json";
import { GameLocation, GameSettings, PlayerOption, ShotClockOption } from "../game-settings/game-settings";
import { TeamGameControl } from "../team-game/team-game";
import { PlayType } from "../play/play";
import * as utils from "./../util";

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
        expect(g.gameClock).toEqual(1200);
        expect(g.currHalf).toEqual(1);
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

    describe('during the game loop', () => {
        it('starts with a jump ball to visitor (when rigged)', () => {
            const setLineupSpy = jest.spyOn(g.visitorTeamGame, 'setLineup');
            const setStrategySpy = jest.spyOn(g.visitorTeamGame, 'setStrategy');
            jest.spyOn(utils, 'Rand1').mockReturnValue(0);
            const ge = g.start();
            expect(ge.type).toEqual(PlayType.JUMP_BALL);
            expect(ge.team).toEqual(g.visitorTeamGame);
            expect(ge.player).toBeNull();
            expect(g.possArrow).toEqual(g.homeTeamGame);
            expect(g.gameClock).toEqual(1199);
            expect(g.shotClock).toEqual(29);
            expect(setLineupSpy).toHaveBeenCalled();
            expect(setStrategySpy).toHaveBeenCalled();
            expect(g.playByPlay.lastPlay()?.type).toEqual(PlayType.JUMP_BALL);
        });

        it('should not double-log a JUMP_BALL event', () => {
            const ge = g.start();
            expect(ge.type).toEqual(PlayType.JUMP_BALL);
            const pbp = g.playByPlay;
            expect(g.playByPlay.plays.length).toEqual(1);
        });

        it('starts with a jump ball to home (when rigged)', () => {
            jest.spyOn(utils, 'Rand1').mockReturnValue(1);
            const ge = g.start();
            expect(ge.type).toEqual(PlayType.JUMP_BALL);
            expect(ge.team).toEqual(g.homeTeamGame);
            expect(ge.player).toBeNull();
            expect(g.possArrow).toEqual(g.visitorTeamGame);
        });

        it('identifies condition where first half has ended, ensures no double-logging in pbp', () => {
            g.setGameClock(1, 0);
            let ge = g.next();
            expect(ge.type).toEqual(PlayType.END_OF_HALF);
            ge = g.next();
            expect(g.playByPlay.plays.length).toEqual(1);
        });

        it('identifies condition where regulation or OT has ended but score is tied', () => {
            g.setGameClock(2, 0);
            const ge = g.next();
            expect(ge.type).toEqual(PlayType.END_OF_HALF);
        });

        it('identifies condition where game has ended, ensures no double-logging in pbp', () => {
            g.visitorTeamGame = <any> { 
                addTimePlayed: () => {},
                stats: { pointsScored: 1 }
            };
            g.setGameClock(2, 0);
            let ge = g.next();
            expect(ge.type).toEqual(PlayType.END_OF_GAME);
            ge = g.next();
            expect(g.playByPlay.plays.length).toEqual(1);
        });

        it('starts second half properly', () => {
            g.homeTeamGame.addFoulForHalf();
            g.setGameClock(1, 0);
            const op = g.possArrow;
            const ge = g.start();
            expect(ge.type).toEqual(PlayType.INBOUND_BALL);
            expect(g.inspect()).toEqual(expect.objectContaining({
                _currHalf: 2,
                _gameClock: 1199
            }));
            expect(g.possArrow).not.toEqual(op);
            expect(g.homeTeamGame.foulsForHalf).toEqual(0);
        });

        it('starts overtime properly', () => {
            g.homeTeamGame.addFoulForHalf();
            g.setGameClock(2, 0);
            const ge = g.start();
            expect(ge.type).toEqual(PlayType.JUMP_BALL);
            expect(g.inspect()).toEqual(expect.objectContaining({
                _currHalf: 3,
                _gameClock: 299
            }));
            expect(g.homeTeamGame.foulsForHalf).toEqual(1);
        });

        it('start returns a no-op if not used properly', () => {
            g.setGameClock(1, 550);
            const ge = g.start();
            expect(ge.type).toEqual(PlayType.NO_OP);
        });
    });
});
