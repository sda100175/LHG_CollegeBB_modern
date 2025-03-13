import { GameLocation, GameSettings, ShotClockOption } from "../game-settings/game-settings";
import { Team } from "../team/team";

export class Game {
    private _attendance = 0;
    private _shotClock = 0;
    private _avgTeamStamina = 0;

    constructor(public gameSettings: GameSettings,
        public visitorTeam: Team,
        public homeTeam: Team
    ) {
        this._calcAttendance();
        this._setAvgTeamStamina();
        this._resetShotClock();
    }

    private _calcAttendance() {
        if (this.gameSettings.location === GameLocation.NEUTRAL_SITE) {
            this._attendance = (Math.random() * 12000) + 2000;
        } else {
            const margin = this.homeTeam.attendance * 0.12;
            this._attendance = this.homeTeam.attendance + (Math.random() * margin * 2) - margin;
        }
    }

    private _resetShotClock() {
        switch (this.gameSettings.shotClock) {
            case ShotClockOption.SECONDS_30:  this._shotClock = 30; break;
            case ShotClockOption.SECONDS_35:  this._shotClock = 35; break;
            case ShotClockOption.SECONDS_45:  this._shotClock = 45; break;
            default:                          this._shotClock = 0;  break;
        }
    }

    private _setAvgTeamStamina() {
        this._avgTeamStamina = (this.visitorTeam.teamStamina + this.homeTeam.teamStamina) / 2;
    }

    get attendance() { return this._attendance }

    get location() { 
        return (this.gameSettings.location === GameLocation.NEUTRAL_SITE) 
            ? 'NEUTRAL SITE' 
            : this.homeTeam.arena; 
    }

    get shotClock() { return this._shotClock }
}
