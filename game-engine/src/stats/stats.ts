/**
 * Statistics collection, could be for one player, one game, one team, an entire TeamSeason, etc.
 */
export class Stats {
    pointsScored = 0;
    fieldGoalsAtt = 0;
    fieldGoalsMade = 0;
    fieldGoals3PtAtt = 0;
    fieldGoals3PtMade = 0;
    totalRebounds = 0;
    assists = 0;
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
            s.fieldGoalsMade += ss.fieldGoalsMade;
            s.fieldGoals3PtAtt += ss.fieldGoals3PtAtt;
            s.fieldGoals3PtMade += ss.fieldGoals3PtMade;
            s.totalRebounds += ss.totalRebounds;
            s.assists += ss.assists;
            s.personalFouls += ss.personalFouls;
        });
        return s;
    }

    add(s: Stats) {
        this.pointsScored += s.pointsScored;
        this.fieldGoalsAtt += s.fieldGoalsAtt;
        this.fieldGoalsMade += s.fieldGoalsMade;
        this.fieldGoals3PtAtt += s.fieldGoals3PtAtt;
        this.fieldGoals3PtMade += s.fieldGoals3PtMade;
        this.totalRebounds += s.totalRebounds;
        this.assists += s.assists;
        this.personalFouls += s.personalFouls;
    }

    reset() {
        this.pointsScored = 0;
        this.fieldGoalsAtt = 0;
        this.fieldGoalsMade = 0;
        this.fieldGoals3PtAtt = 0;
        this.fieldGoals3PtMade = 0;
        this.totalRebounds = 0;
        this.assists = 0;
        this.personalFouls = 0;
    }
}
