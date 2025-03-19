import { ComputerCoach } from "../computer-coach";
import { OffensiveCoach } from "./offensive-coach";
import * as utils from "../../util";
import { OffensiveStrategy } from "../../shared/strategy-helper";

describe('OffensiveCoach', () => {
    let cc: ComputerCoach;
    let oc: OffensiveCoach;

    describe('when in the first half', () => {
        beforeEach(() => {
            cc = <ComputerCoach> {
                teamGame: { game: { currHalf: 1 } },
                getScoreDiff: () => -5
            }
            oc = new OffensiveCoach(cc);
        });

        it('selects NORMAL when random between 1-75', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(3);
            expect(oc.getStrategyRecommendation()).toEqual(OffensiveStrategy.NORMAL);
        });

        it('selects AGGRESIVE when random between 76-94', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(80);
            expect(oc.getStrategyRecommendation()).toEqual(OffensiveStrategy.AGGRESIVE);
        });

        it('selects SAFE when random between 95-100', () => {
            jest.spyOn(utils, 'Rand100').mockReturnValue(100);
            expect(oc.getStrategyRecommendation()).toEqual(OffensiveStrategy.SAFE);
        });
    });    
});
