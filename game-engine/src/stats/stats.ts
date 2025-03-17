/**
 * Statistics collection, could be for one player, one game, one team, an entire TeamSeason, etc.
 */
export class Stats {
    pointsScored = 0;
    fieldGoalsAtt = 0;
    totalRebounds = 0;
    personalFouls = 0;

    /**
     * Compiles set of individual statistics into a collection.
     * @param subStats Stats to compile into totals.
     * @returns {Stats} Compiled set of stats.
     */
    static compile(subStats: Stats[]) {
        const s = new Stats();
        subStats.forEach(ss => {
            s.pointsScored += ss.pointsScored;
            s.fieldGoalsAtt += ss.fieldGoalsAtt;
            s.totalRebounds += ss.totalRebounds;
            s.personalFouls += ss.personalFouls;
        });
        return s;
    }

    reset() {
        this.pointsScored = 0;
        this.fieldGoalsAtt = 0;
        this.totalRebounds = 0;
        this.personalFouls = 0;
    }
}
