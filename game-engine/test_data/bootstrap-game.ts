import { GameSettings } from "../src/game-settings/game-settings";
import { Team } from "../src/team/team";
import { Game } from "../src/game/game";
import teamData from "./TeamData.1990.json";

export interface IMakeGameOpts {
    gs?: GameSettings;
    vcust?: Record<string, any>;
    hcust?: Record<string, any>;
}

export type TeamKey = keyof typeof teamData;

/**
 * 
 * @param visitor Id for visitor team from TeamData.1990.json
 * @param home Id for home team from TeamData.1990.json
 * @param {IMakeGameOpts} opts Customization options
 * @returns {Game} Initialized Game object
 */
export const makeGame = (visitor: TeamKey, home: TeamKey, opts: IMakeGameOpts = {}) => {
    const gs: GameSettings = (opts.gs) ? opts.gs : new GameSettings();

    const vo = Object.assign({}, teamData[visitor], opts.vcust || {});
    const ho = Object.assign({}, teamData[home], opts.hcust || {});

    return new Game(gs, Team.fromObject(vo), Team.fromObject(ho));
}
