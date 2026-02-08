import { render } from '../framework/render';
import FilterView from '../view/filter-view';
import SortView from '../view/sort-view';
import EventsListView from '../view/event-list-view';
import PointsModel from '../model/points-model';
import PointPresenter from './point-presenter';
import { sortByDay, sortByTime, sortByPrice } from '../utils/sort.js';

const SortType = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price',
};

export default class MainPresenter {
  #tripEvents = document.querySelector('.trip-events');
  #filterEvents = document.querySelector('.trip-controls__filters');
  #eventsList = new EventsListView();
  #pointsModel = new PointsModel();
  #pointPresenters = new Map();

  #currentSortType = SortType.DAY;
  #sortComponent = null;

  init() {
    render(new FilterView(), this.#filterEvents);
    this.#sortComponent = new SortView(this.#handleSortTypeChange);
    render(this.#sortComponent, this.#tripEvents);
    render(this.#eventsList, this.#tripEvents);
    this.#renderPoints();
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearPoints();
    this.#renderPoints();
  };

  #getSortedPoints() {
    const points = [...this.#pointsModel.getPoints()];

    switch (this.#currentSortType) {
      case SortType.TIME:
        return points.sort(sortByTime);
      case SortType.PRICE:
        return points.sort(sortByPrice);
      default:
        return points.sort(sortByDay);
    }
  }

  #renderPoints() {
    const points = this.#getSortedPoints();

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

  #clearPoints() {
    this.#pointPresenters.clear();
    this.#eventsList.element.innerHTML = '';
  }
}
