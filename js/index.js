
import {html, render} from '/node_modules/lit-html/lit-html.js';
import {repeat} from '/node_modules/lit-html/directives/repeat.js';
import {Endpoint} from './endpoint.js';

export function agent() {
    return window['@hippiemedia/agent'](client => (method, url, params, headers) => {
        return client(method, url, params, {Authorization: 'Bearer 3a03e510-4e61-42f9-97f2-41df472ed993', ...headers})
    });
}

export {html, render, repeat};
