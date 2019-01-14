import {html, render, repeat} from './index.js';

export class Endpoint extends HTMLElement {
    constructor() {
        super();
        this.root = this.attachShadow({mode: 'open'});

    }

    static get observedAttributes() { return ['method', 'url', 'title', 'description']; }

    attributeChangedCallback(name, old, val) {
        this.render();
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
                <pre><slot @slotchange=${this.pretty.bind(this)} name="response-body"></slot></pre>
            </details>

            <slot name="links"></slot>

            <slot name="operations"></slot>
        `, this.root);
    }

    pretty(event) {
        Array.from(event.target.assignedNodes()).map(node => node.textContent = try_json(node.textContent));
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

customElements.define('h-endpoint', Endpoint);
