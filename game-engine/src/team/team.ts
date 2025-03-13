import { IsArray, IsBoolean, IsInt, IsString, ValidateNested, validateSync } from "class-validator"
import { Player } from "../player/player";
import { Type } from "class-transformer";

export class Team {
    @IsString()
    name = '';

    @IsInt()
    teamStamina = 0;

    @IsInt()
    defFGPctAdj = 0;

    @IsInt()
    def3FGAvFGAAdj = 0;

    @IsInt()
    def3FGPctAdj = 0;

    @IsInt()
    offStealRating = 0;

    @IsInt()
    offTurnoverRating = 0;

    @IsInt()
    defTurnoverAdj = 0;

    @IsInt()
    defFoulAdj = 0;

    @IsInt()
    ifUsing99 = 0;

    @IsInt()
    textColor = 0;

    @IsInt()
    backgroundColor = 0;

    @IsInt()
    twelve = 0;

    @IsInt()
    teamFGAPerG = 0;

    @IsInt()
    leagueFGAPerG = 0;

    @IsInt()
    teamGamesPlayed = 0;

    @IsInt()
    homecourtFactor = 0;

    @IsInt()
    wins = 0;

    @IsInt()
    losses = 0;

    @IsInt()
    powerRating = 0;

    @IsString()
    coach = '';

    @IsString()
    arena = '';

    @IsString()
    nickname = '';

    @IsInt()
    attendance = 0;

    @IsInt()
    year = 0;

    @IsBoolean()
    isWomen = false;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Player)
    players: Player[] = [];

    /**
     * Initialize a Team instance from a flat object.
     * @param obj Flat object with required information (usually stored from toObject routine)
     * @throws {Error} If invalid value for any field detected.
     */
    static fromObject(obj: Record<string, any>) {
        const t = new Team();

        t.name = obj.name;
        t.teamStamina = obj.teamStamina;
        t.defFGPctAdj = obj.defFGPctAdj;
        t.def3FGAvFGAAdj = obj.def3FGAvFGAAdj;
        t.def3FGPctAdj = obj.def3FGPctAdj;
        t.offStealRating = obj.offStealRating;
        t.offTurnoverRating = obj.offTurnoverRating;
        t.defTurnoverAdj = obj.defTurnoverAdj;
        t.defFoulAdj = obj.defFoulAdj;
        t.ifUsing99 = obj.ifUsing99;
        t.textColor = obj.textColor;
        t.backgroundColor = obj.backgroundColor;
        t.twelve = obj.twelve;
        t.teamFGAPerG = obj.teamFGAPerG;
        t.leagueFGAPerG = obj.leagueFGAPerG;
        t.teamGamesPlayed = obj.teamGamesPlayed;
        t.homecourtFactor = obj.homecourtFactor;
        t.wins = obj.wins;
        t.losses = obj.losses;
        t.powerRating = obj.powerRating;
        t.coach = obj.coach;
        t.arena = obj.arena;
        t.nickname = obj.nickname;
        t.attendance = obj.attendance;
        t.year = obj.year;
        t.isWomen = obj.isWomen;

        if (obj.players && typeof obj.players.length !== 'undefined') {
            t.players = obj.players.map((p: any) => Player.fromObject(p));
        }

        t.validate();
        return t;
    }
    
    /**
     * Create a JS flat object from the class.
     * @returns Flat object that can be used to initialize the class.
     */
    toObject() {
        return {
            name: this.name,
            teamStamina: this.teamStamina,
            defFGPctAdj: this.defFGPctAdj,
            def3FGAvFGAAdj: this.def3FGAvFGAAdj,
            def3FGPctAdj: this.def3FGPctAdj,
            offStealRating: this.offStealRating,
            offTurnoverRating: this.offTurnoverRating,
            defTurnoverAdj: this.defTurnoverAdj,
            defFoulAdj: this.defFoulAdj,
            ifUsing99: this.ifUsing99,
            textColor: this.textColor,
            backgroundColor: this.backgroundColor,
            twelve: this.twelve,
            teamFGAPerG: this.teamFGAPerG,
            leagueFGAPerG: this.leagueFGAPerG,
            teamGamesPlayed: this.teamGamesPlayed,
            homecourtFactor: this.homecourtFactor,
            wins: this.wins,
            losses: this.losses,
            powerRating: this.powerRating,
            coach: this.coach,
            arena: this.arena,
            nickname: this.nickname,
            attendance: this.attendance,
            year: this.year,
            isWomen: this.isWomen,
            players: this.players.map(p => p.toObject())
        };
    }
    
    validate() {
        const errors = validateSync(this);
        if (errors.length) {
            throw new Error(`Team object invalid: ${errors}`);
        }
    }
}
