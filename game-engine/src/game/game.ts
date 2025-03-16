import { GameLocation, GameSettings, PlayerOption, ShotClockOption } from "../game-settings/game-settings";
import { TeamGame, TeamGameControl } from "../team-game/team-game";
import { Team } from "../team/team";

export class Game {
    private _gameAvgStamina = 0;
    private _attendance = 0;
    private _currHalf = 1;
    private _gameClock = 1200;
    private _shotClock = 0;
    private _rebFoulChance = 8;

    visitorTeamGame: TeamGame;
    homeTeamGame: TeamGame;
    
    constructor(public gameSettings: GameSettings,
        public visitorTeam: Team,
        public homeTeam: Team
    ) {
        this._setAvgTeamStamina();
        this._calcAttendance();
        this._resetShotClock();
        this._adjustRebFoulChance(this._gameAvgStamina);

        const ctrl = this._getTeamControl();
        this.visitorTeamGame = new TeamGame(this.visitorTeam, ctrl.visitor, this);
        this.homeTeamGame = new TeamGame(this.homeTeam, ctrl.home, this);
    }

    private _adjustRebFoulChance(gameAvgStamina: number) {
        if (gameAvgStamina > 114) {
            this._rebFoulChance = (114 / gameAvgStamina) * this._rebFoulChance;
        }
    }

    private _calcAttendance() {
        if (this.gameSettings.location === GameLocation.NEUTRAL_SITE) {
            this._attendance = (Math.random() * 12000) + 2000;
        } else {
            const margin = this.homeTeam.attendance * 0.12;
            this._attendance = this.homeTeam.attendance + (Math.random() * margin * 2) - margin;
        }
    }

    // Sets CPU or HUMAN control for each team based on game settings.
    private _getTeamControl() {
        const vals = { 'visitor': TeamGameControl.CPU, 'home': TeamGameControl.CPU };        

        switch (this.gameSettings.playerMode) {
            case PlayerOption.VS_HUMAN:
                vals.visitor = vals.home = TeamGameControl.HUMAN;
                break;
            case PlayerOption.CPU_IS_HOME:
                vals.visitor = TeamGameControl.HUMAN;
                break;
            case PlayerOption.CPU_IS_VISITOR:
                vals.home = TeamGameControl.HUMAN;
                break;
        }

        return vals;
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
        this._gameAvgStamina = (this.visitorTeam.teamStamina + this.homeTeam.teamStamina) / 2;
    }

    get attendance() { return this._attendance }

    get currHalf() { return this._currHalf }

    get location() { 
        return (this.gameSettings.location === GameLocation.NEUTRAL_SITE) 
            ? 'NEUTRAL SITE' 
            : this.homeTeam.arena; 
    }

    get gameAvgStamina() { return this._gameAvgStamina }

    get gameClock() { return this._gameClock }

    get shotClock() { return this._shotClock }

    // Strictly for test/debug, DO NOT USE for game logic!
    inspect() {
        return {
            _rebFoulChance: this._rebFoulChance
        }
    }

    // Strictly for test/debug
    setGameClock(currHalf: number, gameClock: number) {
        this._currHalf = currHalf;
        this._gameClock = gameClock;
    }
}
