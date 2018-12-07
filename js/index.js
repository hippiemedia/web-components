
import {html, render} from '/node_modules/lit-html/lit-html.js';
import {repeat} from '/node_modules/lit-html/directives/repeat.js';
import {Endpoint} from './endpoint.js';
import {Link} from './link.js';
import {Operation} from './operation.js';
import {Field} from './field.js';

export function agent() {
    return window['@hippiemedia/agent'](client => (method, url, params, headers) => {
        return client(method, url, params, {Authorization: 'secret', ...headers})
    });
}

export {html, render, repeat};
