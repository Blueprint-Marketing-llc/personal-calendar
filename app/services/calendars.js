import Ember from 'ember';

const {
  inject,
  Service
} = Ember;

export default Service.extend({
  session: inject.service('session'),
  store: inject.service('store'),

  findMonth(month) {
    /*
    this.get('session').authorize()
      .then(() => {
        debugger;
        return Promise.resolve([]);
      });
      */
  },

  findDay() {
    return Promise.resolve([]);
  }
});
