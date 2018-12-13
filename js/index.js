
import {html, render} from '/node_modules/lit-html/lit-html.js';
import {repeat} from '/node_modules/lit-html/directives/repeat.js';
import {Endpoint} from './endpoint.js';

export function agent() {
    return window['@hippiemedia/agent'](client => (method, url, params, headers) => {
        return client(method, url, params, {Authorization: '470f535c-58a3-4058-a89a-c42da7427c68', ...headers})
    });
}

export {html, render, repeat};
