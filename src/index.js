import uuidv1 from 'uuid/v4';
const getCookie = name => document.cookie.split('; ').reduce((r, v) => {
  const parts = v.split('=');
  return parts[0] === name ? decodeURIComponent(parts[1]) : r;
}, '');

const createCookie = (name, value, uuid, days = 7, path = '/') => {
  if (document.cookie.indexOf(`${name}=${value}`) > 0) {
    return getCookie(name);
  }
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}${uuid}; expires=${expires}; path=${path}`;
  return getCookie(name);
};

const supportedAPI = ['init', 'message']; // enlist all methods supported by API (e.g. `awe('event', 'user-login');`)

// Method that handles all API calls
const apiHandler = (api, params) => {
  if (!api) {
    throw Error('API method required');
  }

  if (supportedAPI.indexOf(api.toLowerCase()) === -1) {
    throw Error(`Method ${api} is not supported`);
  }

  switch (api) {
    case 'message':
      console.log(`Handling API call ${api}`, params); // eslint-disable-line
      break;
    default:
      console.warn(`No handler defined for ${api}`); // eslint-disable-line
  }
};

const extendObject = (a, b) => ({ ...a, ...b });

const sendData = ({ referrer = '', location = '', cookie = '', event = '' }) => { // eslint-disable-line
  const data = {
    referrer, location, cookie, event,
  };
  console.log(data); // eslint-disable-line
  return data;
};

class Awetomic {
  constructor() {
    this.referrer = document.referrer;
    this.location = document.location;
    this.cookie = createCookie('awe', 'userId', `${uuidv1()}`);

    const defaultValues = {
      referrer: this.referrer,
      location: this.location,
      cookie: this.cookie,
    };

    this.constructor.init(defaultValues);
    this.constructor.addEventListener('click', defaultValues);
  }

  static addEventListener(type, defaultValues) {
    document.addEventListener(type, (event) => {
      sendData({
        ...defaultValues,
        event,
      });
      event.preventDefault();
    });
  }

  static init(defaultValues) {
    console.log('Awetomic widget starting'); // eslint-disable-line

    // set default configurations
    let configurations = {
      someDefaultConfiguration: false,
    };

    // all methods that were called till now and stored in queue
    // needs to be called now
    let globalObject = window[window.awetomic];
    const queue = globalObject.q;

    if (queue) {
      for (let i = 0; i < queue.length; i += 1) {
        if (queue[i][0].toLowerCase() === 'init') {
          configurations = extendObject(configurations, queue[i][1]);
          console.log('Awetomic widget started', configurations);// eslint-disable-line
        } else {
          apiHandler(queue[i][0], queue[i][1]);
        }
      }
    }

    // override temporary (until the app loaded) handler
    // for widget's API calls
    globalObject = apiHandler;
    globalObject.configurations = configurations;

    // call internal methods
    sendData(defaultValues);
  }
}

window.Awetomic = new Awetomic();
