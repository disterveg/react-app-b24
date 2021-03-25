import axios from 'axios';
import {isString} from 'axios/lib/utils';

function encode(val) {
  return encodeURIComponent(val).
      replace(/%40/gi, '@').
      replace(/%3A/gi, ':').
      replace(/%24/g, '$').
      replace(/%2C/gi, ',').
      replace(/%20/g, '+').
      replace(/%5B/gi, '[').
      replace(/%5D/gi, ']');
}

export const formatDate = (date, format) => {
  const dateTimeFormat = new Intl.DateTimeFormat('en', {year: 'numeric', month: '2-digit', day: '2-digit'});
  const [{value: month},, {value: day},, {value: year}] = dateTimeFormat .formatToParts(date );
  switch (format) {
    case 'Y-m-d':
      return date = `${year}-${month}-${day}`;
    case 'd.m.Y':
      return date = `${day}.${month}.${year}`;
  }
  return date;
};

function isArray(val) {
  return toString.call(val) === '[object Array]';
}

function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

function isObject(val) {
  return val !== null && typeof val === 'object';
}

function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /* eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (let i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

function buildURL(url, params, paramsSerializer) {
  /* eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }
  let strParams = '';
  let serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    const parts = [];

    forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      forEach(val, function parseValue(v) {
        if (isDate(v)) {
          v = v.toISOString();
        } else if (isObject(v)) {
          for (const i in v) {
            if ({}.hasOwnProperty.call(v, i)) {
              strParams += `[${i.replace('=', '')}]=${formatDate(new Date(v[i]), 'd.m.Y')}&${key}`;
            }
          }
          strParams = strParams.substring(0, strParams.length - `&${key}`.length);
          v = strParams;
        } else {
          key = key + '=';
        }
        parts.push(key + v);
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    const hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
}

export const uniqid = (prefix, en) => {
  prefix = prefix || '';
  en = en || false;
  let result; let us;

  const seed = (s, w) => {
    s = parseInt(s, 10).toString(16);
    return w < s.length ? s.slice(s.length - w) :
      (w > s.length) ? new Array(1 + (w - s.length)).join('0') + s : s;
  };

  result = prefix + seed(parseInt(new Date().getTime() / 1000, 10), 8) +
    seed(Math.floor(Math.random() * 0x75bcd15) + 1, 5);

  if (en) result += (Math.random() * 10).toFixed(8).toString();

  return result;
};

export const call = async (method, params = {}) => {
  const WEB_HOOK = 'https://kerugitmn.bitrix24.ru/rest/1247/954la3q3x51pq9ug/';
  const httpClient = axios.create();
  httpClient.defaults.timeout = 5000;
  const response = await httpClient.post(
      `${WEB_HOOK}${method}.json?`, params
  );
  let res;
  if (response.data['next'] !== undefined) {
    const results = await batch(method, params, response.data.total);
    if (response.data['result'].tasks === undefined) {
      response.data['result'] = response.data['result'].concat(results);
    } else {
      response.data['result'] = response.data['result'].tasks.concat(results);
    }
    res = response.data;
  } else {
    res = response.data;
  }
  return res;
};

export const batch = async (method, params, total) => {
  const cmd = {};
  for (let i = 1; i < total / 50; i++) {
    params.start = i * 50;
    cmd[i] = buildURL(method, params);
    // cmd[i] = method + '?' + ('filter[>CREATED_DATE]=28.05.2020&filter[<CREATED_DATE]=28.06.2020&start=50');
  }
  const response = await call('batch',
      {
        'halt': 0,
        'cmd': cmd
      }
  );
  const res = response.result['result'];
  let results = [];
  for (const idx in res) {
    if ({}.hasOwnProperty.call(res, idx)) {
      if (res[idx].tasks === undefined) {
        results = results.concat(res[idx]);
      } else {
        results = results.concat(res[idx].tasks);
      }
    }
  }
  return results;
};
