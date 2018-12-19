import {html, render, repeat} from './index.js';

export class StaticOperation extends HTMLElement {
    constructor() {
        super();
        this.root = this.attachShadow({mode: 'open'});
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
                <slot name="description"></slot>
                <slot name="fields"></slot>
                <slot name="links"></slot>
                <input type="submit" />
            </form>
            <slot name="resource"></slot>
        `, this.root);
    }

    onSubmit(event)
    {
        event.preventDefault();
        let slot = this.root.querySelector('slot[name=fields]');
        let params = Array.from(slot.assignedNodes()[0].querySelectorAll('input')).filter(input => input.value).reduce((acc, input) => ({
            ...acc,
            [input.name]: input.value,
        }), {});

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

