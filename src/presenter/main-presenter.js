import { render } from '../framework/render';
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

    points.forEach((point) => {
      const eventView = new EventItemView({
        point,
        destination: destinations[point.destination],
        offers: offers[point.type],
        onEditClick: () => replaceEventViewToEditView()
      });

      const editView = new EditEventFormView({
        point,
        destination: destinations[point.destination],
        offers: offers[point.type],
        onFormSubmit: () => replaceEditViewToEventView(),
        onCloseClick: () => replaceEditViewToEventView()
      });

      function replaceEventViewToEditView() {
        eventView.element.replaceWith(editView.element);
        document.addEventListener('keydown', onEscKeyDown);
      }

      function replaceEditViewToEventView() {
        editView.element.replaceWith(eventView.element);
        document.removeEventListener('keydown', onEscKeyDown);
      }

      function onEscKeyDown(evt) {
        if (evt.key === 'Escape') {
          replaceEditViewToEventView();
        }
      }

      render(eventView, this.#eventsList.element);
    });
  }
}
