# web-components

## what

A set of web components to represent API endpoints.

## how

### statically

```html
<!DOCTYPE html>
<html>
    <head>
        <script async type="module" src="/js/index.js"></script>
    </head>
    <body>
        <h-static-endpoint url="/items" method="get" title="List all items">
            <div slot="state">['item 1', 'item'2]</div>
            <div slot="links">
                <h-static-link href="/items?{query}">
                    <h-field name="query" title="full text search on items" />
                </h-static-link>
            </div>
            <div slot="operations">
                <h-static-operation url="/items" method="post" title="Add a new item">
                    <h-field name="name" title="item's name" />                
                </h-static-operation>
            </div>
        </h-static-endpoint>
    </body>
</html>
```

### integration with [@hippiemedia/agent](https://github.com/hippiemedia/agent)

Writing endpoints declarations by hand is tedious, and not very maintainable.
That's why it's a good idea to generate them programatically.
This will recursively render endpoints declarations as you navigate the api,
effectively making this simple piece of html an actual hypermedia browser! \o/

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <script src="/node_modules/@hippiemedia/agent/bundle/index.js"></script>
        <script async type="module" src="/js/index.js"></script>
    </head>
    <body>
        <h-endpoint url="/api/" />
    </body>
</html>
```
