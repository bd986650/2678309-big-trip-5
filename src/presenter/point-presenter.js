import { render, replace } from '../framework/render';
import EventItemView from '../view/event-item-view';
import EditEventFormView from '../view/edit-event-form-view';
import { destinations } from '../mock/destinations';
import { offers } from '../mock/offers';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #container = null;
  #point = null;
  #eventView = null;
  #editView = null;
  #onDataChange = null;
  #onModeChange = null;
  #mode = Mode.DEFAULT;

  constructor(container, onDataChange, onModeChange) {
    this.#container = container;
    this.#onDataChange = onDataChange;
    this.#onModeChange = onModeChange;
  }

  init(point) {
    this.#point = point;

    this.#eventView = new EventItemView({
      point,
      destination: destinations[point.destination],
      offers: offers[point.type],
      onEditClick: this.#replaceToEdit,
      onFavoriteClick: this.#handleFavoriteClick
    });

    this.#editView = new EditEventFormView({
      point,
      destination: destinations[point.destination],
      offers: offers[point.type],
      onFormSubmit: this.#replaceToEvent,
      onCloseClick: this.#replaceToEvent
    });

    render(this.#eventView, this.#container);
  }

  updatePoint(updatedPoint) {
    this.#point = updatedPoint;

    const newEventView = new EventItemView({
      point: this.#point,
      destination: destinations[this.#point.destination],
      offers: offers[this.#point.type],
      onEditClick: this.#replaceToEdit,
      onFavoriteClick: this.#handleFavoriteClick
    });

    replace(newEventView, this.#eventView);
    this.#eventView = newEventView;
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceToEvent();
    }
  }

  #handleFavoriteClick = () => {
    const updatedPoint = { ...this.#point, isFavorite: !this.#point.isFavorite };
    this.#onDataChange(updatedPoint);
  };

  #replaceToEdit = () => {
    if (this.#mode === Mode.EDITING) {
      return;
    }

    this.#onModeChange();
    replace(this.#editView, this.#eventView);
    document.addEventListener('keydown', this.#onEscKeyDown);
    this.#mode = Mode.EDITING;
  };

  #replaceToEvent = () => {
    if (this.#mode === Mode.DEFAULT) {
      return;
    }

    replace(this.#eventView, this.#editView);
    document.removeEventListener('keydown', this.#onEscKeyDown);
    this.#mode = Mode.DEFAULT;
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceToEvent();
    }
  };
}
