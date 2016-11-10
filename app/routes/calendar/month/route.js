import Ember from 'ember';

const {
  inject,
  Route
} = Ember;

export default Route.extend({
  calendars: inject.service('calendars'),

  model(params) {
    return this.get('calendars').findMonth(params.month);
  }
});
