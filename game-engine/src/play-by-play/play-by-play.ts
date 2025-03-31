import { Game } from "../game/game";
import { Play } from "../play/play";

export class PlayByPlay {
    private _game: Game;  // conveinence

    plays: Play[] = [];

    constructor(g: Game) { this._game = g }

    /**
     * @param {Play} p Play to add to play-by-play 
     */
    addPlay(p: Play) { this.plays.push(p) }

    /**
     * @returns {Play | null} Last play, or null if no plays yet.
     */
    lastPlay() { return this.plays.length ? this.plays[this.plays.length - 1] : null }
}
