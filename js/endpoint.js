import {html, render, repeat} from './index.js';

export class Endpoint extends HTMLElement {
    constructor() {
        super();
        this.root = this.attachShadow({mode: 'open'});

    }

    connectedCallback() {
        this.render();
    }

    render() {
        render(html`
            <link rel="stylesheet" href="/css/endpoint.css"/>

            <details>
                <summary>
                    view source
                </summary>
                <pre><slot name="response-body"></slot></pre>
            </details>

            <slot name="links"></slot>

            <slot name="operations"></slot>
        `, this.root);
    }
}

customElements.define('h-endpoint', Endpoint);
