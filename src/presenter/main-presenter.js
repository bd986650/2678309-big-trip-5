import {RenderPosition, render} from '../render';
import FilterView from '../view/filter-view';
import SortView from '../view/sort-view';
import EventsListView from '../view/event-list-view';
import EventItemView from '../view/event-item-view';
import EditEventFormView from '../view/edit-event-form-view';
import PointsModel from '../model/points-model';
import { destinations } from '../mock/destinations';
import { offers } from '../mock/offers';

export default class MainPresenter {
  #tripEvents = document.querySelector('.trip-events');
  #filterEvents = document.querySelector('.trip-controls__filters');
  #eventsList = new EventsListView();
  #pointsModel = new PointsModel();

  init() {
    render(new FilterView(), this.#filterEvents);
    render(new SortView(), this.#tripEvents);
    render(this.#eventsList, this.#tripEvents);

    const points = this.#pointsModel.getPoints();

    render(
      new EditEventFormView({
        point: points[0],
        destination: destinations[points[0].destination],
        offers: offers[points[0].type]
      }),
      this.#eventsList.getElement(),
      RenderPosition.AFTERBEGIN
    );

    points.forEach((point) => {
      render(
        new EventItemView({
          point,
          destination: destinations[point.destination],
          offers: offers[point.type]
        }),
        this.#eventsList.getElement()
      );
    });
  }
}
