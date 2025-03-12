import { CoachMode, FreeThrowsOnTenthFoul, GameLocation, GameSettings, PlayerOption, ShotClockOption } from "./game-settings";

describe('GameSettings', () => {
    let obj: Record<string, any>;
    let gs: GameSettings;
    
    beforeEach(() => {
        obj = {
            playerMode: PlayerOption.VS_HUMAN,
            location: GameLocation.NEUTRAL_SITE,
            shotClock: ShotClockOption.SECONDS_45,
            threePtShots: true,
            foulsToDisqualify: 6,
            ftOnTenthFoul: FreeThrowsOnTenthFoul.TWO,
            threeFtOn3ptFoul: true,
            oneFtOnFirst6Fouls: false,
            coachMode: CoachMode.SELECT_SHOTS
        }
        gs = GameSettings.fromObject(obj);
    });

    it('correctly initializes class from object', () => {
        expect(gs.playerMode).toEqual(PlayerOption.VS_HUMAN);
        expect(gs.location).toEqual(GameLocation.NEUTRAL_SITE);
        expect(gs.shotClock).toEqual(ShotClockOption.SECONDS_45);
        expect(gs.threePtShots).toEqual(true);
        expect(gs.foulsToDisqualify).toEqual(6);
        expect(gs.ftOnTenthFoul).toEqual(FreeThrowsOnTenthFoul.TWO);
        expect(gs.threeFtOn3ptFoul).toEqual(true);
        expect(gs.oneFtOnFirst6Fouls).toEqual(false);
        expect(gs.coachMode).toEqual(CoachMode.SELECT_SHOTS);
    });

    it('correctly serializes to an object', () => {
        expect(gs.toObject()).toEqual(obj);
    });

    it('handles correctly all set options for playerMode', () => {
        for (const opt of Object.values(PlayerOption).filter(v => typeof v === "number")) {
            gs.playerMode = opt;
            expect(gs.playerMode).toEqual(opt);
        }
        expect(() => gs.playerMode = 10).toThrow();
    });

    it('handles correctly all set options for location', () => {
        for (const opt of Object.values(GameLocation).filter(v => typeof v === "number")) {
            gs.location = opt;
            expect(gs.location).toEqual(opt);
        }
        expect(() => gs.location = 10).toThrow();
    });

    it('handles correctly all set options for shot clock', () => {
        for (const opt of Object.values(ShotClockOption).filter(v => typeof v === "number")) {
            gs.shotClock = opt;
            expect(gs.shotClock).toEqual(opt);
        }
        expect(() => gs.shotClock = 10).toThrow();
    });

    it('handles correctly all set options for three point shot', () => {
        [true, false].forEach(v => {
            gs.threePtShots = v;
            expect(gs.threePtShots).toEqual(v);
        })
        expect(() => gs.threePtShots = 10).toThrow();
    });

    it('handles correctly valid options for fouls to DQ', () => {
        gs.foulsToDisqualify = 6;
        expect(gs.foulsToDisqualify).toEqual(6);
        expect(() => gs.foulsToDisqualify = '10').toThrow();
    });

    it('handles correctly all set options for free throws on 10th foul', () => {
        for (const opt of Object.values(FreeThrowsOnTenthFoul).filter(v => typeof v === "number")) {
            gs.ftOnTenthFoul = opt;
            expect(gs.ftOnTenthFoul).toEqual(opt);
        }
        expect(() => gs.ftOnTenthFoul = 10).toThrow();
    });

    it('handles correctly all set options for three point on 3pt foul', () => {
        [true, false].forEach(v => {
            gs.threeFtOn3ptFoul = v;
            expect(gs.threeFtOn3ptFoul).toEqual(v);
        })
        expect(() => gs.threeFtOn3ptFoul = 10).toThrow();
    });

    it('handles correctly all set options for one FT on first 6 fouls', () => {
        [true, false].forEach(v => {
            gs.oneFtOnFirst6Fouls = v;
            expect(gs.oneFtOnFirst6Fouls).toEqual(v);
        })
        expect(() => gs.oneFtOnFirst6Fouls = 10).toThrow();
    });

    it('handles correctly all set options for coach mode', () => {
        for (const opt of Object.values(CoachMode).filter(v => typeof v === "number")) {
            gs.coachMode = opt;
            expect(gs.coachMode).toEqual(opt);
        }
        expect(() => gs.coachMode = 10).toThrow();
    });
});
