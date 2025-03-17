import { DefensiveStrategy } from "../../team-game/team-game";
import * as utils from "../../util";
import { ComputerCoach } from "../computer-coach";
import { DefensiveCoach } from "./defensive-coach";

describe('DefensiveCoach', () => {
    let cc: ComputerCoach;

    describe('when winning', () => {
        beforeEach(() => {
            cc = <ComputerCoach> {
                getScoreDiff: () => 5
            }
        });

        it('selects FCP_RJ_SOLID_MTM when random between 1-5', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(3);
            expect(DefensiveCoach.getStrategyRecommendation(cc)).toEqual(DefensiveStrategy.FCP_RJ_SOLID_MTM);
        });

        it('selects ZONE_PRESS_221_SOLID_MTM when random between 6-9', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(7);
            expect(DefensiveCoach.getStrategyRecommendation(cc)).toEqual(DefensiveStrategy.ZONE_PRESS_221_SOLID_MTM);
        });

        it('selects ZONE_PRESS_221_ZONE_23 when random is 10', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(10);
            expect(DefensiveCoach.getStrategyRecommendation(cc)).toEqual(DefensiveStrategy.ZONE_PRESS_221_ZONE_23);
        });
    });
});
