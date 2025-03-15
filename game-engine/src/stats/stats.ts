/**
 * Statistics collection, could be for one player, one game, one team, an entire TeamSeason, etc.
 */
export class Stats {
    fieldGoalsAtt = 0;
    totalRebounds = 0;
    personalFouls = 0;

    reset() {
        this.fieldGoalsAtt = 0;
        this.totalRebounds = 0;
        this.personalFouls = 0;
    }
}
