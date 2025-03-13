import { GameLocation, GameSettings } from "../game-settings/game-settings";
import { Team } from "../team/team";

export class Game {
    private _attendance = 0;

    constructor(public gameSettings: GameSettings,
        public visitorTeam: Team,
        public homeTeam: Team
    ) {
        this._calcAttendance();
    }

    private _calcAttendance() {
        if (this.gameSettings.location === GameLocation.NEUTRAL_SITE) {
            this._attendance = (Math.random() * 12000) + 2000;
        } else {
            const margin = this.homeTeam.attendance * 0.12;
            this._attendance = this.homeTeam.attendance + (Math.random() * margin * 2) - margin;
        }
    }

    get attendance() { return this._attendance }

    get location() { 
        return (this.gameSettings.location === GameLocation.NEUTRAL_SITE) 
            ? 'NEUTRAL SITE' 
            : this.homeTeam.arena; 
    }
}
