import { render } from '../framework/render';
import FilterView from '../view/filter-view';
import SortView from '../view/sort-view';
import EventsListView from '../view/event-list-view';
import PointsModel from '../model/points-model';
import PointPresenter from './point-presenter';

export default class MainPresenter {
  #tripEvents = document.querySelector('.trip-events');
  #filterEvents = document.querySelector('.trip-controls__filters');
  #eventsList = new EventsListView();
  #pointsModel = new PointsModel();
  #pointPresenters = new Map();

  init() {
    render(new FilterView(), this.#filterEvents);
    render(new SortView(), this.#tripEvents);
    render(this.#eventsList, this.#tripEvents);

    const points = this.#pointsModel.getPoints();

    const handlePointChange = (updatedPoint) => {
      const newData = this.#pointsModel.updatePoint(updatedPoint);
      const presenter = this.#pointPresenters.get(newData.id);

      if (presenter) {
        presenter.updatePoint(newData);
      }
    };

    const handleModeChange = () => {
      this.#pointPresenters.forEach((presenter) => presenter.resetView());
    };

    points.forEach((point) => {
      const pointPresenter = new PointPresenter(
        this.#eventsList.element,
        handlePointChange,
        handleModeChange
      );

      pointPresenter.init(point);
      this.#pointPresenters.set(point.id, pointPresenter);
    });
  }
}
