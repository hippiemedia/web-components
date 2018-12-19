import {html, render, repeat, agent} from './index.js';

export class StaticEndpoint extends HTMLElement {
    constructor() {
        super();
        this.root = this.attachShadow({mode: 'open'});
    }

    static get observedAttributes() { return ['url', 'title', 'description']; }

    attributeChangedCallback(name, old, val) {
        this.render();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        render(html`
            <link rel="stylesheet" href="/css/endpoint.css"/>

            <pre><code>
                <slot name="state"></slot>
            </code></pre>

            <slot name="links"></slot>

            <slot name="operations"></slot>
        `, this.root);
    }
}

function try_json(json) {
    try {
        if (typeof json === 'string') {
            json = JSON.parse(json);
        }
        return JSON.stringify(json, null, 2);
    }
    catch(e) {
        return json;
    }
}

customElements.define('h-static-endpoint', StaticEndpoint);
