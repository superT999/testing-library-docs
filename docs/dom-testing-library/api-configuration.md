---
id: api-configuration
title: Configuration
---

## Configuration

The library can be configured via the `configure` function, which accepts:

- a plain JS object; this will be merged into the existing configuration. e.g.
  `configure({testIdAttribute: 'not-data-testid'})`
- a function; the function will be given the existing configuration, and should
  return a plain JS object which will be merged as above, e.g.
  `configure(existingConfig => ({something: [...existingConfig.something, 'extra value for the something array']}))`

Configuration options:

`computedStyleSupportsPseudoElements`: Set to `true` if
`window.getComputedStyle` supports pseudo-elements i.e. a second argument. If
you're using testing-library in a browser you almost always want to set this to
`true`. Only very old browser don't support this property (such as IE 8 and
earlier). However, `jsdom` does not support the second argument currently. This
includes versions of `jsdom` prior to `16.4.0` and any version that logs a
`not implemented` warning when calling `getComputedStyle` with a second argument
e.g. `window.getComputedStyle(document.createElement('div'), '::after')`.
Defaults to `false`

`defaultHidden`: The default value for the `hidden` option used by
[`getByRole`](api-queries#byrole). Defaults to `false`.

`showOriginalStackTrace`: By default, `waitFor` will ensure that the stack trace
for errors thrown by Testing Library is cleaned up and shortened so it's easier
for you to identify the part of your code that resulted in the error (async
stack traces are hard to debug). If you want to disable this, then
set`showOriginalStackTrace` to `false`. You can also disable this for a specific
call in the options you pass to `waitFor`.

`throwSuggestions`: (experimental) When enabled, if
[better queries](https://testing-library.com/docs/guide-which-query) are
available the test will fail and provide a suggested query to use instead.
Default to `false`.

To disable a suggestion for a single query just add `{suggest:false}` as an
option.

```js
screen.getByTestId('foo', { suggest: false }) // will not throw a suggestion
```

`testIdAttribute`: The attribute used by [`getByTestId`](api-queries#bytestid)
and related queries. Defaults to `data-testid`.

`getElementError`: A function that returns the error used when
[`getBy*`](api-queries#getby) or [`getAllBy*`](api-queries#getallby) fail. Takes
the error message and container object as arguments.

`asyncUtilTimeout`: The global timeout value in milliseconds used by `waitFor`
utilities. Defaults to 1000ms.

<!--DOCUSAURUS_CODE_TABS-->

<!--Native-->

```js
// setup-tests.js
import { configure } from '@testing-library/dom'
import serialize from 'my-custom-dom-serializer'

configure({
  testIdAttribute: 'data-my-test-id',
  getElementError: (message, container) => {
    const customMessage = [message, serialize(container.firstChild)].join(
      '\n\n'
    )
    return new Error(customMessage)
  },
})
```

<!--React-->

```js
// setup-tests.js
import { configure } from '@testing-library/react'

configure({ testIdAttribute: 'data-my-test-id' })
```

<!--Cypress-->

```js
// setup-tests.js
import { configure } from '@testing-library/cypress'

configure({ testIdAttribute: 'data-my-test-id' })
```

<!--END_DOCUSAURUS_CODE_TABS-->
