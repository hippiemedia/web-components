import {html, render, repeat} from './index.js';

export class Operation extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({mode: 'open'});

        this.operation = null;
        this.resource = null;
    }

    async connectedCallback() {
        this.render();
    }

    render() {
        render(html`
            <link rel="stylesheet" href="/css/operation.css"/>
            <form novalidate action="${this.operation.href}" method="${html_method(this.operation.method)}" @submit=${this.onSubmit.bind(this)}>
                <input type="hidden" name="_method" value="${this.operation.method}" />
                <h3>${this.operation.title}</h3>
                <span class="${this.operation.method.toLowerCase()}">${this.operation.method}</span>
                <span class="url">${this.operation.href}</span>
                <p>${this.operation.description}</p>
                ${repeat(
                    this.operation.fields,
                    (field, key) => key,
                    field => html`
                        <label>
                            ${field.description}
                            <input
                                required=${field.required}
                                type=${field.type}
                                value=${field.value || ''}
                                name=${field.name}
                                placeholder=${field.example || field.name}
                                multiple=${field.multiple}
                            />
                        </label>
                        <br/>
                    `
                )}
                <input type="submit" />
            </form>
            <br/>
            ${this.resource && html`<h-endpoint .resource=${this.resource}>`}
        `, this.shadow);
    }

    async onSubmit(event)
    {
        event.preventDefault();
        let data = new FormData(event.currentTarget);
        let params = Array.from(data.entries()).filter(([key, value]) => value).reduce((acc, [key, value]) => ({
            ...acc,
            [key]: value,
        }), {})

        this.resource = await this.operation.submit(params);
        this.render();

        this.dispatchEvent(new CustomEvent('operation-submitted', {
            detail: this.resource,
            bubbles: false,
            composed: true,
        }));
    }
}

function html_method(method) {
    if (method.toLowerCase() === 'get') {
        return 'GET';
    }
    return 'POST';
}

customElements.define('h-operation', Operation);

