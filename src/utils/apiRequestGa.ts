import axios from 'axios';

const MAX_TIMEOUT_REQUEST = 30000;
const instance = axios.create({
  timeout: MAX_TIMEOUT_REQUEST,
});

export function getResponseError(res) {
  return res && res.response && res.response.data ? res.response.data : null;
}

export function getStatsErrorMessage(res) {
  const data = getResponseError(res);
  return (data && data.error?.message) || '';
}

class ApiRequest {
  headers = {
    'Content-Type': 'application/json',
  };
  getUrl(url) {
    return url;
  }

  getHeaders() {
    return this.headers;
  }
  setHeaders(headers) {
    this.headers = headers;
  }

  handleErrors(err) {
    if (err && err.response && err.response.status) {
      const statusCode = err.response.status;
      if (statusCode === 401) {
      } else if (statusCode === 504) {
      } else {
      }
    }
    return Promise.reject(err);
  }

  responseBody(res) {
    if (res.status === 401) {
      // unauthorized error
    } else {
      if (res.status >= 200 && res.status <= 399) {
        if (
          typeof res.data === 'undefined' ||
          typeof res.data.status === 'undefined'
        ) {
          return res.data;
        } else if (res.data.status >= 200 && res.data.status <= 399) {
          return res.data;
        } else {
          return Promise.reject({ response: { data: res.data } });
        }
      } else {
        throw new Error(res);
      }
    }
    return res.data;
  }

  jsonData(data) {
    return JSON.stringify(data);
  }

  resolveData(data) {
    return Promise.resolve(data);
  }

  get = (url: string, data = {}, config = {}) =>
    instance
      .get(this.getUrl(url), { ...config, params: data })
      .then(this.responseBody)
      .then(this.resolveData)
      .catch(this.handleErrors);

  post = (url: string, data) =>
    instance
      .post(this.getUrl(url), this.jsonData(data), {
        headers: this.getHeaders(),
      })
      .then(this.responseBody)
      .then(this.resolveData)
      .catch(this.handleErrors);

  postForm = (url: string, data) =>
    instance
      .post(this.getUrl(url), data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(this.responseBody)
      .then(this.resolveData)
      .catch(this.handleErrors);

  put = (url: string, data) =>
    instance
      .put(this.getUrl(url), this.jsonData(data), {
        headers: this.getHeaders(),
      })
      .then(this.responseBody)
      .then(this.resolveData)
      .catch(this.handleErrors);

  delete = (url: string, data) =>
    instance
      .delete(this.getUrl(url), {
        data: this.jsonData(data),
        headers: this.getHeaders(),
      })
      .then(this.responseBody)
      .then(this.resolveData)
      .catch(this.handleErrors);
}

const apiRequest = new ApiRequest();
export { apiRequest };
