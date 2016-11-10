/* global gapi */
import Ember from 'ember';
import config from '../config/environment';

const {
  RSVP: { Promise }, // jshint ignore:line
  Service
} = Ember;

const GOOGLE_CREDENTIALS = {
  "web": {
    "client_id": "313970499101-vc3f72ilk3fk0fec2tkl5enrmjji7ure.apps.googleusercontent.com",
    "project_id": "hardy-crossbar-148721","auth_uri":"https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://accounts.google.com/o/oauth2/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_secret":"XYWIwQxDd0kZVmdHA__ClVKR",
    "javascript_origins": ["http://localhost:4200"]
  }
};

const torii = config.torii = config.torii || { providers: {} };

torii.remoteServiceName = 'iframe';
torii.providers['google-oauth2'] = {
  redirectUri: 'http://localhost:4200/redirect-auth',
  apiKey: GOOGLE_CREDENTIALS.web.client_id
};

const APPLICATION_SCOPES = [
  "https://www.googleapis.com/auth/calendar.readonly"
].join(' ');

function performAuthorizationCheck(immediate) {
  return new Promise((resolve, reject) => {
    gapi.auth.authorize(
      {
        'client_id': GOOGLE_CREDENTIALS.web.client_id,
        'scope': APPLICATION_SCOPES,
        'immediate': immediate
      }, function(authResult) {
        if (!authResult && !authResult.error) {
          resolve(authResult);
        } else {
          reject(authResult ? (authResult.error || authResult) : authResult);
        }
      });
  });
}

function loadCalendarApi() {
  return new Promise((resolve, reject) => {
    gapi.client.load('calendar', 'v3', resolve, reject);
  });
}

export default Service.extend({
  _authPromise: null,
  authorized: false,
  apiLoaded: false,

  authorize() {
    if (this._authPromise) {
      return this._authPromise;
    }
    if (this.authorized) {
      return Promise.resolve(true);
    }

    this._authPromise = new Promise((resolve, reject) => {
      performAuthorizationCheck(true)
        .catch(performAuthorizationCheck.bind(null, false))
        .then(loadCalendarApi)
        .then(resolve, reject);
    });

    this._authPromise
      .then(
        () => { this.authorized = true; },
        () => { this.authorized = false; })
      .finally(() => {
        this._authPromise = null;
      });

    return this._authPromise;
  },

  init() {
    this._super();
    // this.authorize();
  }
});
