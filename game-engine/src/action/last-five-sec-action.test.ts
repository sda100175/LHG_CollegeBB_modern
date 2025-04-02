import { makeGame } from "../../test_data/bootstrap-game";
import { Game } from "../game/game";
import { LastFiveSecAction } from "./last-five-sec-action";
import * as utils from "../util";
import { LastFiveSecStrategy } from "../shared/strategy-helper";
import { PlayType } from "../play/play";

describe('LastFiveSecAction', () => {
    let g: Game;
    let lfsa: LastFiveSecAction;

    beforeEach(() => {
        g = makeGame('90 DUKE', '90 MARYLAND');
        g.start();
        g.setGameClock(2, 3);
        lfsa = new LastFiveSecAction(g);
    });

    it('runs FULL_COURT_PASS_SHOOT_2P / L5S_LONG_PASS_INTERCEPTED scenario', () => {
        g.offTeam.last5SecStrategy = LastFiveSecStrategy.FULL_COURT_PASS_SHOOT_2P;
        jest.spyOn(utils, 'Rand').mockReturnValue(48);
        expect(lfsa.getPlayOutcome()?.type).toEqual(PlayType.L5S_LONG_PASS_INTERCEPTED);
    });

    it('runs FULL_COURT_PASS_SHOOT_3P / L5S_LONG_PASS_INTERCEPTED scenario', () => {
        g.offTeam.last5SecStrategy = LastFiveSecStrategy.FULL_COURT_PASS_SHOOT_3P;
        jest.spyOn(utils, 'Rand').mockReturnValue(12);
        expect(lfsa.getPlayOutcome()?.type).toEqual(PlayType.L5S_LONG_PASS_INTERCEPTED);
    });

    it('runs SHOOT_FROM_BACK_COURT / L5S_FG_MISS_BACKCOURT_3PT scenario', () => {
        g.offTeam.last5SecStrategy = LastFiveSecStrategy.SHOOT_FROM_BACK_COURT;
        jest.spyOn(utils, 'Rand').mockReturnValue(12);
        expect(lfsa.getPlayOutcome()?.type).toEqual(PlayType.L5S_FG_MISS_BACKCOURT_3PT);
    });

    it('runs SHOOT_FROM_BACK_COURT / L5S_FG_MISS_BACKCOURT_2PT scenario', () => {
        g.gameSettings.threePtShots = false;
        g.offTeam.last5SecStrategy = LastFiveSecStrategy.SHOOT_FROM_BACK_COURT;
        jest.spyOn(utils, 'Rand').mockReturnValue(12);
        expect(lfsa.getPlayOutcome()?.type).toEqual(PlayType.L5S_FG_MISS_BACKCOURT_2PT);
    });

    it('runs SHOOT_FROM_BACK_COURT / L5S_FG_MADE_BACKCOURT_3PT scenario', () => {
        g.offTeam.last5SecStrategy = LastFiveSecStrategy.SHOOT_FROM_BACK_COURT;
        jest.spyOn(utils, 'Rand').mockReturnValue(61);
        expect(lfsa.getPlayOutcome()?.type).toEqual(PlayType.L5S_FG_MADE_BACKCOURT_3PT);
    });

    it('runs SHOOT_FROM_BACK_COURT / L5S_FG_MADE_BACKCOURT_2PT scenario', () => {
        g.gameSettings.threePtShots = false;
        g.offTeam.last5SecStrategy = LastFiveSecStrategy.SHOOT_FROM_BACK_COURT;
        jest.spyOn(utils, 'Rand').mockReturnValue(61);
        expect(lfsa.getPlayOutcome()?.type).toEqual(PlayType.L5S_FG_MADE_BACKCOURT_2PT);
    });

    it('runs L5S_TURNOVER scenario', () => {
        g.offTeam.last5SecStrategy = LastFiveSecStrategy.TIME_OUT_AT_HALF_COURT;
        jest.spyOn(utils, 'Rand').mockReturnValue(6);
        expect(lfsa.getPlayOutcome()?.type).toEqual(PlayType.L5S_TURNOVER);
    });

});
