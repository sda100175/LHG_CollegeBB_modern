import { GameLocation, GameSettings, PlayerOption, ShotClockOption } from "../game-settings/game-settings";
import { TeamGame, TeamGameControl } from "../team-game/team-game";
import { Team } from "../team/team";
import { Rand1 } from "../util";
import { Play, PlayType } from "../play/play";
import { PlayByPlay } from "../play-by-play/play-by-play";
import { StrategyHelper } from "../shared/strategy-helper";

/**
 * Game object is the main game engine class. Sets up and executes a game of college basketball. 
 * UI should execute the game as a simple set of iterators, offering human sub/strategy options
 * based on result of last play.
 */
export class Game {
    private _gameAvgStamina = 0;
    private _attendance = 0;
    private _currHalf = 1;
    private _gameClock = 1200;
    private _shotClock = 0;
    private _rebFoulChance = 8;
    private _possArrow: TeamGame;
    private _playByPlay: PlayByPlay;

    private _offTeam: TeamGame;
    private _defTeam: TeamGame;

    visitorTeamGame: TeamGame;
    homeTeamGame: TeamGame;
    
    constructor(public gameSettings: GameSettings,
        public visitorTeam: Team,
        public homeTeam: Team
    ) {
        this._playByPlay = new PlayByPlay(this);
        this._setAvgTeamStamina();
        this._calcAttendance();
        this._resetShotClock();
        this._adjustRebFoulChance(this._gameAvgStamina);

        const ctrl = this._getTeamControl();
        this.visitorTeamGame = this._defTeam = new TeamGame(this.visitorTeam, ctrl.visitor, this);
        this.homeTeamGame = this._offTeam = this._possArrow = new TeamGame(this.homeTeam, ctrl.home, this);
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

    // Record time effect on game clock, shot clock, and player stats.
    private _updateTimeElapsed(elapsed: number) {
        // Normalize to what's left on game clock if necessary.
        if (elapsed > this._gameClock) { elapsed = this._gameClock }

        this._gameClock -= elapsed;
        if (this.gameSettings.shotClock !== ShotClockOption.NONE) { this._shotClock -= elapsed }
        this.visitorTeamGame.addTimePlayed(elapsed);
        this.homeTeamGame.addTimePlayed(elapsed);
    }

    // Log the play to play-by-play, update time elapsed for players and clocks.
    private _recordPlay(play: Play) {
        // Don't record no-ops
        if (play.type === PlayType.NO_OP) { return play }

        // Some types should only be recorded once.
        const lastPlay = this._playByPlay.lastPlay();
        if (play.type === lastPlay?.type) {
            if (lastPlay?.type === PlayType.END_OF_HALF 
                || lastPlay?.type === PlayType.END_OF_GAME
                || lastPlay?.type === PlayType.JUMP_BALL) {
                return lastPlay;
            }    
        }

        // Record time elapsed for both game and players.
        this._updateTimeElapsed(play.timeElapsed);

        // Push to play-by-play log
        this._playByPlay.addPlay(play);

        return play;
    }
    
    // Ball changes possession to given team
    private _setPossession(tg: TeamGame) {
        // No change of possession, bypass
        if (tg === this._offTeam) { return }

        // Set possessing teams
        this._offTeam = (tg === this.visitorTeamGame) ? this.visitorTeamGame : this.homeTeamGame;
        this._defTeam = (tg === this.visitorTeamGame) ? this.homeTeamGame : this.visitorTeamGame;

        // Reset shot clock
        this._resetShotClock();
    }

    // If tg given, set possession arrow to that team.
    // If not given, swaps
    private _setPossArrow(tg?: TeamGame) {
        if (tg) {
            this._possArrow = tg;
        } else {
            this._possArrow = (this._possArrow === this.visitorTeamGame) ? this.homeTeamGame : this.visitorTeamGame;
        }
    }

    // Random assignment of offensive / defensive team.
    private _jumpBall() {
        const jump = Rand1();
        this._setPossession(jump === 0 ? this.visitorTeamGame : this.homeTeamGame);
        this._setPossArrow(this._defTeam);
        return this._recordPlay(new Play(PlayType.JUMP_BALL, this._offTeam, null, 1));
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

    get playByPlay() { return this._playByPlay }

    get possArrow() { return this._possArrow }

    get shotClock() { return this._shotClock }

    private _isGameStart() { return this._currHalf === 1 && this._gameClock === 1200 }

    private _atEndOfHalf() { return this._gameClock === 0 }

    private _needsOvertime() {
        return this._currHalf > 1 
            && this._gameClock === 0
            && (this.visitorTeamGame.stats.pointsScored === this.homeTeamGame.stats.pointsScored);
    }

    private _checkEndOfHalfOrGame() {
        const endOfFirstHalf = this._currHalf === 1 && this._gameClock === 0;

        if (endOfFirstHalf) {
            return this._recordPlay(new Play(PlayType.END_OF_HALF, null, null, 0));

        } else if (this.isGameOver()) {
            return this._recordPlay(new Play(PlayType.END_OF_GAME, null, null, 0));

        } else if (this._needsOvertime()) {
            return this._recordPlay(new Play(PlayType.END_OF_HALF, null, null, 0));
        }

        return null;
    }

    // Start 2nd half of play
    private _initSecondHalf() {
        this._currHalf = 2;
        this._gameClock = 1200;
        this.visitorTeamGame.resetFoulsForHalf();
        this.homeTeamGame.resetFoulsForHalf();    
        this._setPossession(this._possArrow);
        this._setPossArrow();
        return this._recordPlay(new Play(PlayType.INBOUND_BALL, this._offTeam, null, 1));
    }

    // Start overtime
    private _initOvertime() {
        this._currHalf++;
        this._gameClock = 300;
        return this._jumpBall();
    }
    
    // Runs computer coach substitutions for both teams (if applicable)
    private _setStrategyForBothTeams() {
        this.visitorTeamGame.setStrategy();
        this.homeTeamGame.setStrategy();
    }

    // Runs computer coach substitutions for both teams (if applicable)
    private _setSubsForBothTeams() {
        this.visitorTeamGame.setLineup();
        this.homeTeamGame.setLineup();
    }

    // "Last 5 sec" situation - execute the play return the result. 
    private _executeLast5SecSituation() {
        if (this._offTeam.control === TeamGameControl.CPU) {
            this._offTeam.setLast5SecStrategy();
        }

        // LEFT OFF HERE!!!
    }

    /**
     * Main game loop. Run until END_OF_HALF or END_OF_GAME.
     * @returns {Play} What happened
     */
    next() {
        // Start of game
        if (this._isGameStart()) { return this._jumpBall() }

        // End of half (1st half or 2+ half if score tied), or game (time elapsed and score not tied)
        const eof = this._checkEndOfHalfOrGame();
        if (eof) { return eof }

        const lp = this._playByPlay.lastPlay();

        // A very close-and-late game, set computer strategy and/or allow human to set theirs.
        if (StrategyHelper.isLast5SecSituation(this)) {
            if (lp?.type !== PlayType.LAST_5_SEC_SITUATION) {
                return this._recordPlay(new Play(PlayType.LAST_5_SEC_SITUATION, null, null, 0));
            } else {
                return this._executeLast5SecSituation();
            }
        }

        // If last play allowed, set substitutions and/or game strategy for CPU teams
        if (lp?.subsAllowed) { this._setSubsForBothTeams() }
        if (lp?.coachingAllowed) { this._setStrategyForBothTeams() }

        // Something goofy happened, this should never reach.
        return new Play(PlayType.NO_OP, null, null, 0);
    }

    /**
     * start needs to be called at the start of the game and the start of each half (including OT).
     * @returns {Play} First play of the half
     */
    start() {
        // If game is over, its over!
        if (this.isGameOver()) { return this.next() }

        // Set substitutions + strategy for CPU teams
        this._setSubsForBothTeams();
        this._setStrategyForBothTeams();

        // Start of 1st half
        if (this._isGameStart()) { return this.next() }

        // Start of 2nd half
        if (this._atEndOfHalf() && this._currHalf === 1) { return this._initSecondHalf() }

        // Start of OT
        if (this._atEndOfHalf() && this._currHalf > 1) { return this._initOvertime() }

        // Function was probably called out of context, use this.next() instead.
        return new Play(PlayType.NO_OP, null, null, 0);
    }

    /**
     * 
     * @returns {number} Score differential, from the offensive team's standpoint
     */
    getScoreDiff() {
        return (this._offTeam.stats.pointsScored - this._defTeam.stats.pointsScored);
    }

    /**
     * Is the game over?
     * @returns {boolean} true if game is over, false otherwise
     */
    isGameOver() { 
        return this._currHalf > 1 
            && this._gameClock === 0
            && (this.visitorTeamGame.stats.pointsScored !== this.homeTeamGame.stats.pointsScored);
    }

    // Strictly for test/debug, DO NOT USE for game logic!
    inspect() {
        return {
            _gameClock: this._gameClock,
            _currHalf: this._currHalf,
            _rebFoulChance: this._rebFoulChance
        }
    }

    // Strictly for test/debug
    setGameClock(currHalf: number, gameClock: number) {
        this._currHalf = currHalf;
        this._gameClock = gameClock;
    }
}
