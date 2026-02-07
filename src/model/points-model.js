import { points } from '../mock/points';

export default class PointsModel {
  #points = points;

  getPoints() {
    return this.#points;
  }

  updatePoint(updatedPoint) {
    const index = this.#points.findIndex((point) => point.id === updatedPoint.id);
    this.#points[index] = { ...this.#points[index], ...updatedPoint };
    return this.#points[index];
  }
}
