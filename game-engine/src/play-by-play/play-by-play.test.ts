import { Game } from "../game/game";
import { Team } from "../team/team";
import teamData from "../../test_data/TeamData.1990.json";
import { GameSettings } from "../game-settings/game-settings";
import { PlayByPlay } from "./play-by-play";
import { Play, PlayType } from "../play/play";

describe('PlayByPlay', () => {
    let g: Game;
    let vt: Team, ht: Team;
    let pbp: PlayByPlay;

    beforeEach(() => {
        vt = Team.fromObject(teamData['90 DUKE']);
        ht = Team.fromObject(teamData['90 MARYLAND']);
        g = new Game(new GameSettings(), vt, ht);
        pbp = new PlayByPlay(g);
    });

    describe('lastPlay', () => {
        it('returns null if no plays yet', () => {
            expect(pbp.lastPlay()).toBeNull();
        });

        it('returns last play if plays added', () => {
            pbp.addPlay(new Play(PlayType.JUMP_BALL, g.visitorTeamGame, null, 1));
            pbp.addPlay(new Play(PlayType.END_OF_HALF, null, null, 0));
            const p = pbp.lastPlay();
            expect(p?.type).toEqual(PlayType.END_OF_HALF);
        });
    });
});