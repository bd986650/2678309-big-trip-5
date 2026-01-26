import { points } from '../mock/points';

export default class PointsModel {
  #points = points;

  getPoints() {
    return this.#points;
  }
}
