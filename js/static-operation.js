import {html, render, repeat} from './index.js';

export class StaticOperation extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({mode: 'open'});
    }

    static get observedAttributes() { return ['url', 'title', 'method']; }

    attributeChangedCallback(name, old, val) {
        this.render();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        render(html`
            <link rel="stylesheet" href="/css/operation.css"/>
            <form novalidate action="${this.getAttribute('href')}" method="${html_method(this.getAttribute('method'))}" @submit=${this.onSubmit.bind(this)}>
                <input type="hidden" name="_method" value="${this.getAttribute('method')}" />
                <h3>${this.getAttribute('title')}</h3>
                <span class="${this.getAttribute('method')}">${this.getAttribute('method')}</span>
                <span class="url">${this.getAttribute('href')}</span>
                <p slot="description"></p>
                <div slot="fields"></div>
                <input type="submit" />
            </form>
            <slot name="resource"></slot>
        `, this.shadow);
    }

    onSubmit(event)
    {
        event.preventDefault();
        let data = new FormData(event.currentTarget);
        let params = Array.from(data.entries()).filter(([key, value]) => value).reduce((acc, [key, value]) => ({
            ...acc,
            [key]: value,
        }), {})

        this.dispatchEvent(new CustomEvent('operation-submitted', {
            detail: params,
            bubbles: false,
            composed: true,
        }));
    }
}

function html_method(method) {
    if (method && method.toLowerCase() === 'get') {
        return 'GET';
    }
    return 'POST';
}

customElements.define('h-static-operation', StaticOperation);

