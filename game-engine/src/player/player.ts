import { IsInt, IsString, validateSync } from "class-validator";

export class Player {
    @IsString()
    name = '';

    @IsInt()
    adjFgPct = 0;
    
    @IsInt()
    ftPct = 0;
    
    @IsInt()
    defReb40Minx10 = 0;
    
    @IsInt()
    contribPct = 0;
    
    @IsInt()
    assistRating = 0;
    
    @IsInt()
    stealRating = 0;
    
    @IsInt()
    blockRating = 0;
    
    @IsInt()
    gamesPlayed = 0;
    
    @IsInt()
    fgAtt = 0;
    
    @IsInt()
    fg3Pct = 0;
    
    @IsInt()
    fg3OfTotalFgAtt = 0;
    
    @IsInt()
    offReb40Minx10 = 0;
    
    @IsInt()
    foulCommitRating = 0;
    
    @IsInt()
    foulDrawRating = 0;

    /**
     * Initialize a Player instance from a flat object.
     * @param obj Flat object with required information (usually stored from toObject routine)
     * @throws {Error} If invalid value for any field detected.
     */
    static fromObject(obj: Record<string, any>) {
        const p = new Player();

        p.name = obj.name;
        p.adjFgPct = obj.adjFgPct;
        p.ftPct = obj.ftPct;
        p.defReb40Minx10 = obj.defReb40Minx10;
        p.contribPct = obj.contribPct;
        p.assistRating = obj.assistRating;
        p.stealRating = obj.stealRating;
        p.blockRating = obj.blockRating;
        p.gamesPlayed = obj.gamesPlayed;
        p.fgAtt = obj.fgAtt;
        p.fg3Pct = obj.fg3Pct;
        p.fg3OfTotalFgAtt = obj.fg3OfTotalFgAtt;
        p.offReb40Minx10 = obj.offReb40Minx10;
        p.foulCommitRating = obj.foulCommitRating;
        p.foulDrawRating = obj.foulDrawRating;

        p.validate();
        return p;
    }
    
    /**
     * Create a JS flat object from the class.
     * @returns Flat object that can be used to initialize the class.
     */
    toObject() {
        return {
            name: this.name,
            adjFgPct: this.adjFgPct,
            ftPct: this.ftPct,
            defReb40Minx10: this.defReb40Minx10,
            contribPct: this.contribPct,
            assistRating: this.assistRating,
            stealRating: this.stealRating,
            blockRating: this.blockRating,
            gamesPlayed: this.gamesPlayed,
            fgAtt: this.fgAtt,
            fg3Pct: this.fg3Pct,
            fg3OfTotalFgAtt: this.fg3OfTotalFgAtt,
            offReb40Minx10: this.offReb40Minx10,
            foulCommitRating: this.foulCommitRating,
            foulDrawRating: this.foulDrawRating
        };
    }    

    validate() {
        const errors = validateSync(this);
        if (errors.length) {
            throw new Error(`Player object invalid: ${errors}`);
        }
    }
}
