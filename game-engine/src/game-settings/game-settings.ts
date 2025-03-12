export enum PlayerOption {
    VS_HUMAN = 0,
    CPU_IS_VISITOR = 1,
    CPU_IS_HOME = 2,
    CPU_VS_CPU = 3
}

export enum GameLocation {
    HOME_COURT = 1,
    NEUTRAL_SITE = 2
}

export enum ShotClockOption {
    NONE = 0,
    SECONDS_45 = 1,
    SECONDS_35 = 2,
    SECONDS_30 = 3
}

export enum FreeThrowsOnTenthFoul {
    ONE_AND_ONE = 0,
    TWO = 1
}

export enum CoachMode {
    SELECT_SHOTS = 0,
    CPU_SHOOTS = 1
}

export class GameSettings {
    private _playerMode = PlayerOption.CPU_VS_CPU;
    private _location = GameLocation.HOME_COURT;
    private _shotClock = ShotClockOption.SECONDS_30;
    private _threePtShots = true;
    private _foulsToDisqualify = 5;
    private _ftOnTenthFoul = FreeThrowsOnTenthFoul.ONE_AND_ONE;
    private _threeFtOn3ptFoul = true;
    private _oneFtOnFirst6Fouls = false;
    private _coachMode = CoachMode.CPU_SHOOTS;

    // NOTE: PBP delay and style are UI concerns, can extend this class.

    /**
     * Returns the player mode.
     * @returns {PlayerOption} Player mode
     */
    get playerMode() { return this._playerMode; }

    /**
     * Set the player mode.
     * @param mode {PlayerOption} Player mode
     * @throws {Error} If mode value is invalid 
     */
    set playerMode(mode: any) {
        switch (mode) {
            case PlayerOption.VS_HUMAN:
            case PlayerOption.CPU_IS_HOME:
            case PlayerOption.CPU_IS_VISITOR:
            case PlayerOption.CPU_VS_CPU:
                this._playerMode = mode;
                break;
            default:
                throw new Error(`Invalid value for playerMode set: ${mode}`);
        }
    }

    /**
     * Returns the game location.
     * @returns {GameLocation} Game location
     */
    get location() { return this._location; }

    /**
     * Set the game location.
     * @param loc {GameLocation} Game location
     * @throws {Error} If loc value is invalid 
     */
    set location(loc: any) {
        switch (loc) {
            case GameLocation.HOME_COURT:
            case GameLocation.NEUTRAL_SITE:
                this._location = loc;
                break;
            default:
                throw new Error(`Invalid value for location set: ${loc}`);
        }
    }

    /**
     * Returns the shot clock option.
     * @returns {ShotClockOption} Shot clock option
     */
    get shotClock() { return this._shotClock; }

    /**
     * Set the shot clock option.
     * @param sc {ShotClockOption} Shot clock option
     * @throws {Error} If sc value is invalid 
     */
    set shotClock(sc: any) {
        switch (sc) {
            case ShotClockOption.NONE:
            case ShotClockOption.SECONDS_30:
            case ShotClockOption.SECONDS_35:
            case ShotClockOption.SECONDS_45:
                this._shotClock = sc;
                break;
            default:
                throw new Error(`Invalid value for shotClock set: ${sc}`);
        }
    }

    /**
     * Returns the three point shot option.
     * @returns {boolean} Three point shot option
     */
    get threePtShots() { return this._threePtShots; }

    /**
     * Set the three point shot option.
     * @param tps {boolean} Three point shot option
     * @throws {Error} If tps value is invalid 
     */
    set threePtShots(tps: any) {
        if (typeof tps === 'boolean') {
            this._threePtShots = <boolean> tps;
        } else {
            throw new Error(`Invalid value for threePtShots set: ${tps}`);
        }
    }

    /**
     * Returns the fouls to disqualify option.
     * @returns {number} Fouls to disqualify option
     */
    get foulsToDisqualify() { return this._foulsToDisqualify; }

    /**
     * Set the fouls to disqualify option.
     * @param ftdq {number} Fouls to disqualify option
     * @throws {Error} If ftdq value is invalid 
     */
    set foulsToDisqualify(ftdq: any) {
        if (typeof ftdq === 'number') {
            this._foulsToDisqualify = <number> ftdq;
        } else {
            throw new Error(`Invalid value for foulsToDisqualify set: ${ftdq}`);
        }
    }
    
    /**
     * Returns the free throws on 10th foul option.
     * @returns {FreeThrowsOnTenthFoul} Free throws on 10th foul option
     */
    get ftOnTenthFoul() { return this._ftOnTenthFoul; }

    /**
     * Set the free throws on 10th foul option.
     * @param ft {FreeThrowsOnTenthFoul} Free throws on 10th foul option
     * @throws {Error} If ft value is invalid 
     */
    set ftOnTenthFoul(ft: any) {
        switch (ft) {
            case FreeThrowsOnTenthFoul.ONE_AND_ONE:
            case FreeThrowsOnTenthFoul.TWO:
                this._ftOnTenthFoul = ft;
                break;
            default:
                throw new Error(`Invalid value for ftOnTenthFoul set: ${ft}`);
        }
    }

    /**
     * Returns the three free throws on 3pt foul option.
     * @returns {boolean} Three free throws on 3pt foul option
     */
    get threeFtOn3ptFoul() { return this._threeFtOn3ptFoul; }

    /**
     * Set the three free throws on 3pt foul option.
     * @param ft {boolean} Three free throws on 3pt foul option
     * @throws {Error} If ft value is invalid 
     */
    set threeFtOn3ptFoul(ft: any) {
        if (typeof ft === 'boolean') {
            this._threeFtOn3ptFoul = <boolean> ft;
        } else {
            throw new Error(`Invalid value for threeFtOn3ptFoul set: ${ft}`);
        }
    }

    /**
     * Returns the one free throw on first 6 fouls option.
     * @returns {boolean} One free throw on first 6 fouls option.
     */
    get oneFtOnFirst6Fouls() { return this._oneFtOnFirst6Fouls; }

    /**
     * Set the one free throw on first 6 fouls option.
     * @param ft {boolean} One free throw on first 6 fouls option.
     * @throws {Error} If ft value is invalid 
     */
    set oneFtOnFirst6Fouls(ft: any) {
        if (typeof ft === 'boolean') {
            this._oneFtOnFirst6Fouls = <boolean> ft;
        } else {
            throw new Error(`Invalid value for oneFtOnFirst6Fouls set: ${ft}`);
        }
    }

    /**
     * Returns the coach mode option.
     * @returns {CoachMode} Coach mode option
     */
    get coachMode() { return this._coachMode; }

    /**
     * Set the coach mode option.
     * @param coach {CoachMode} Coach mode option
     * @throws {Error} If coach value is invalid 
     */
    set coachMode(coach: any) {
        switch (coach) {
            case CoachMode.SELECT_SHOTS:
            case CoachMode.CPU_SHOOTS:
                this._coachMode = coach;
                break;
            default:
                throw new Error(`Invalid value for coachMode set: ${coach}`);
        }
    }
    
    /**
     * Initialize a GameSettings instance from a flat object.
     * @param obj Flat object with required information (usually stored from toObject routine)
     * @throws {Error} If invalid value for any field detected.
     */
    static fromObject(obj: Record<string, any>) {
        const gs = new GameSettings();

        if (obj.playerMode !== undefined) { gs.playerMode = obj.playerMode }
        if (obj.location !== undefined) { gs.location = obj.location }
        if (obj.shotClock !== undefined) { gs.shotClock = obj.shotClock }
        if (obj.threePtShots !== undefined) { gs.threePtShots = obj.threePtShots }
        if (obj.foulsToDisqualify !== undefined) { gs.foulsToDisqualify = obj.foulsToDisqualify }
        if (obj.ftOnTenthFoul !== undefined) { gs.ftOnTenthFoul = obj.ftOnTenthFoul }
        if (obj.threeFtOn3ptFoul !== undefined) { gs.threeFtOn3ptFoul = obj.threeFtOn3ptFoul }
        if (obj.oneFtOnFirst6Fouls !== undefined) { gs.oneFtOnFirst6Fouls = obj.oneFtOnFirst6Fouls }
        if (obj.coachMode !== undefined) { gs.coachMode = obj.coachMode }

        return gs;
    }

    /**
     * Create a JS flat object from the class.
     * @returns Flat object that can be used to initialize the class.
     */
    toObject() {
        return {
            playerMode: this.playerMode,
            location: this.location,
            shotClock: this.shotClock,
            threePtShots: this.threePtShots,
            foulsToDisqualify: this.foulsToDisqualify,
            ftOnTenthFoul: this.ftOnTenthFoul,
            threeFtOn3ptFoul: this.threeFtOn3ptFoul,
            oneFtOnFirst6Fouls: this.oneFtOnFirst6Fouls,
            coachMode: this.coachMode
        };
    }
}
