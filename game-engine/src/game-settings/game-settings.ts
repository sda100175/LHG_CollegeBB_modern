import { IsBoolean, IsEnum, IsInt, validateSync } from "class-validator";

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
    @IsEnum(PlayerOption)
    playerMode = PlayerOption.CPU_VS_CPU;
    
    @IsEnum(GameLocation)
    location = GameLocation.HOME_COURT;

    @IsEnum(ShotClockOption)
    shotClock = ShotClockOption.SECONDS_30;

    @IsBoolean()
    threePtShots = true;
    
    @IsInt()
    foulsToDisqualify = 5;

    @IsEnum(FreeThrowsOnTenthFoul)
    ftOnTenthFoul = FreeThrowsOnTenthFoul.ONE_AND_ONE;

    @IsBoolean()
    threeFtOn3ptFoul = true;

    @IsBoolean()
    oneFtOnFirst6Fouls = false;

    @IsEnum(CoachMode)
    coachMode = CoachMode.CPU_SHOOTS;

    // NOTE: PBP delay and style are UI concerns, can extend this class.

    /**
     * Initialize a GameSettings instance from a flat object.
     * @param obj Flat object with required information (usually stored from toObject routine)
     * @throws {Error} If invalid value for any field detected.
     */
    static fromObject(obj: Record<string, any>) {
        const gs = new GameSettings();

        gs.playerMode = obj.playerMode;
        gs.location = obj.location;
        gs.shotClock = obj.shotClock;
        gs.threePtShots = obj.threePtShots;
        gs.foulsToDisqualify = obj.foulsToDisqualify;
        gs.ftOnTenthFoul = obj.ftOnTenthFoul;
        gs.threeFtOn3ptFoul = obj.threeFtOn3ptFoul;
        gs.oneFtOnFirst6Fouls = obj.oneFtOnFirst6Fouls;
        gs.coachMode = obj.coachMode;

        const errors = validateSync(gs);
        if (errors.length > 0) {
            throw new Error(`GameSettings fromObject failed: ${errors}`);
        } else {
            return gs;
        }
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
