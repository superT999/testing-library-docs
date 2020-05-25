---
id: api-queries
title: Queries
---

## Variants

> `getBy` queries are shown by default in the [query documentation](#queries)
> below.

### getBy

`getBy*` queries return the first matching node for a query, and throw an error
if no elements match or if more than one match is found (use `getAllBy`
instead).

### getAllBy

`getAllBy*` queries return an array of all matching nodes for a query, and throw
an error if no elements match.

### queryBy

`queryBy*` queries return the first matching node for a query, and return `null`
if no elements match. This is useful for asserting an element that is not
present. This throws if more than one match is found (use `queryAllBy` instead).

### queryAllBy

`queryAllBy*` queries return an array of all matching nodes for a query, and
return an empty array (`[]`) if no elements match.

### findBy

`findBy*` queries return a promise which resolves when an element is found which
matches the given query. The promise is rejected if no element is found or if
more than one element is found after a default timeout of `1000`ms. If you need
to find more than one element, then use `findAllBy`.

> Note, this is a simple combination of `getBy*` queries and
> [`waitFor`](/docs/api-async#waitfor). The `findBy*` queries
> accept the `waitFor` options as the last argument. (i.e.
> `screen.findByText('text', queryOptions, waitForOptions)`)

### findAllBy

`findAllBy*` queries return a promise which resolves to an array of elements
when any elements are found which match the given query. The promise is rejected
if no elements are found after a default timeout of `1000`ms.

## Options

The argument to a query can be a _string_, _regular expression_, or _function_.
There are also options to adjust how node text is parsed.

See [TextMatch](#textmatch) for documentation on what can be passed to a query.

## `screen`

All of the queries exported by DOM Testing Library accept a `container` as the
first argument. Because querying the entire `document.body` is very common, DOM
Testing Library also exports a `screen` object which has every query that is
pre-bound to `document.body` (using the
[`within`](/docs/dom-testing-library/api-helpers#within-and-getqueriesforelement-apis)
functionality).

Here's how you use it:

```javascript
import { screen } from '@testing-library/dom'
// NOTE: many framework-implementations of Testing Library
// re-export everything from `@testing-library/dom` so you
// may be able to import screen from your framework-implementation:
// import {render, screen} from '@testing-library/react'

const exampleHTML = `
  <label for="example">Example</label>
  <input id="example" />
`
document.body.innerHTML = exampleHTML
const exampleInput = screen.getByLabelText(/example/i)
```

### `screen.debug`

For convenience screen also exposes a `debug` method in addition to the queries.
This method is essentially a shortcut for `console.log(prettyDOM())`. It
supports debugging the document, a single element, or an array of elements.

```javascript
import {screen} from '@testing-library/dom'

document.body.innerHTML = `
  <button>test</button>
  <span>multi-test</span>
  <div>multi-test</div>
`

// debug document
screen.debug()
// debug single element
screen.debug(screen.getByText('test'))
// debug multiple elements
screen.debug(screen.getAllByText('multi-test'))
```

## Queries

> NOTE: These queries are the base queries and require you pass a `container` as
> the first argument. Most framework-implementations of Testing Library provide
> a pre-bound version of these queries when you render your components with them
> which means you do not have to provide a container. In addition, if you just
> want to query `document.body` then you can use the [`screen`](#screen) export
> as demonstrated above (using `screen` is recommended).

### `ByLabelText`

> getByLabelText, queryByLabelText, getAllByLabelText, queryAllByLabelText,
> findByLabelText, findAllByLabelText

```typescript
getByLabelText(
  container: HTMLElement, // if you're using `screen`, then skip this argument
  text: TextMatch,
  options?: {
    selector?: string = '*',
    exact?: boolean = true,
    normalizer?: NormalizerFn,
  }): HTMLElement
```

This will search for the label that matches the given [`TextMatch`](#textmatch),
then find the element associated with that label.

The example below will find the input node for the following DOM structures:

```js
// for/htmlFor relationship between label and form element id
<label for="username-input">Username</label>
<input id="username-input" />

// The aria-labelledby attribute with form elements
<label id="username-label">Username</label>
<input aria-labelledby="username-label" />

// The aria-labelledby attribute with non-form elements
<section aria-labelledby="section-one-header">
  <h3 id="section-one-header">Section One</h3>
  <p>some content</p>
</section>

// Wrapper labels
<label>Username <input /></label>

// aria-label attributes
// Take care because this is not a label that users can see on the page,
// so the purpose of your input must be obvious to visual users.
<input aria-label="username" />
```

<!--DOCUSAURUS_CODE_TABS-->

<!--Native-->

```javascript
import { screen } from '@testing-library/dom'

const inputNode = screen.getByLabelText('Username')
```

<!--React-->

```js
import { render, screen } from '@testing-library/react'

render(<Login />)

const inputNode = screen.getByLabelText('username')
```

<!--Cypress-->

```js
cy.findByLabelText('username').should('exist')
```

<!--END_DOCUSAURUS_CODE_TABS-->

It will NOT find the input node for label text broken up by elements. You can
use `getByRole('textbox', { name: 'Username' })` instead which is robust against
switching to `aria-label` or `aria-labelledby`.

If it is important that you query an actual `<label>` element you can provide a
`selector` in the options:

```html
<label> <span>Username</span> <input /> </label>
```

```js
const inputNode = screen.getByLabelText('Username', {selector: 'input'})
```

### `ByPlaceholderText`

> getByPlaceholderText, queryByPlaceholderText, getAllByPlaceholderText,
> queryAllByPlaceholderText, findByPlaceholderText, findAllByPlaceholderText

```typescript
getByPlaceholderText(
  container: HTMLElement, // if you're using `screen`, then skip this argument
  text: TextMatch,
  options?: {
    exact?: boolean = true,
    normalizer?: NormalizerFn,
  }): HTMLElement
```

This will search for all elements with a placeholder attribute and find one that
matches the given [`TextMatch`](#textmatch).

```html
<input placeholder="Username" />
```

<!--DOCUSAURUS_CODE_TABS-->

<!--Native-->

```js
import { screen } from '@testing-library/dom'

const inputNode = screen.getByPlaceholderText('Username')
```

<!--React-->

```js
import { render, screen } from '@testing-library/react'

render(<MyComponent />)
const inputNode = screen.getByPlaceholderText('Username')
```

<!--Cypress-->

```js
cy.findByPlaceholderText('Username').should('exist')
```

<!--END_DOCUSAURUS_CODE_TABS-->

> **Note**
>
> A placeholder is not a good substitute for a label so you should generally use
> `getByLabelText` instead.

### `ByText`

> getByText, queryByText, getAllByText, queryAllByText, findByText,
> findAllByText

```typescript
getByText(
  container: HTMLElement, // if you're using `screen`, then skip this argument
  text: TextMatch,
  options?: {
    selector?: string = '*',
    exact?: boolean = true,
    ignore?: string|boolean = 'script, style',
    normalizer?: NormalizerFn,
  }): HTMLElement
```

This will search for all elements that have a text node with `textContent`
matching the given [`TextMatch`](#textmatch).

```html
<a href="/about">About ℹ️</a>
```

<!--DOCUSAURUS_CODE_TABS-->

<!--Native-->

```js
import { screen } from '@testing-library/dom'

const aboutAnchorNode = screen.getByText(/about/i)
```

<!--React-->

```js
import { render, screen } from '@testing-library/react'

render(<MyComponent />)
const aboutAnchorNode = screen.getByText(/about/i)
```

<!--Cypress-->

```js
cy.findByText(/about/i).should('exist')
```

<!--END_DOCUSAURUS_CODE_TABS-->

It also works with `input`s whose `type` attribute is either `submit` or
`button`:

```js
<input type="submit" value="Send data" />
```

> **Note**
>
> See [`getByLabelText`](#bylabeltext) for more details on how and when to use
> the `selector` option

The `ignore` option accepts a query selector. If the
[`node.matches`](https://developer.mozilla.org/en-US/docs/Web/API/Element/matches)
returns true for that selector, the node will be ignored. This defaults to
`'script'` because generally you don't want to select script tags, but if your
content is in an inline script file, then the script tag could be returned.

If you'd rather disable this behavior, set `ignore` to `false`.

### `ByAltText`

> getByAltText, queryByAltText, getAllByAltText, queryAllByAltText,
> findByAltText, findAllByAltText

```typescript
getByAltText(
  container: HTMLElement, // if you're using `screen`, then skip this argument
  text: TextMatch,
  options?: {
    exact?: boolean = true,
    normalizer?: NormalizerFn,
  }): HTMLElement
```

This will return the element (normally an `<img>`) that has the given `alt`
text. Note that it only supports elements which accept an `alt` attribute:
[`<img>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img),
[`<input>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input),
and [`<area>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/area)
(intentionally excluding
[`<applet>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/applet)
as it's deprecated).

```html
<img alt="Incredibles 2 Poster" src="/incredibles-2.png" />
```

<!--DOCUSAURUS_CODE_TABS-->

<!--Native-->

```js
import { screen } from '@testing-library/dom'

const incrediblesPosterImg = screen.getByAltText(/incredibles.*? poster/i)
```

<!--React-->

```js
import { render, screen } from '@testing-library/react'

render(<MyComponent />)
const incrediblesPosterImg = screen.getByAltText(/incredibles.*? poster/i)
```

<!--Cypress-->

```js
cy.findByAltText(/incredibles.*? poster/i).should('exist')
```

<!--END_DOCUSAURUS_CODE_TABS-->

### `ByTitle`

> getByTitle, queryByTitle, getAllByTitle, queryAllByTitle, findByTitle,
> findAllByTitle

```typescript
getByTitle(
  container: HTMLElement, // if you're using `screen`, then skip this argument
  title: TextMatch,
  options?: {
    exact?: boolean = true,
    normalizer?: NormalizerFn,
  }): HTMLElement
```

Returns the element that has the matching `title` attribute.

Will also find a `title` element within an SVG.

```html
<span title="Delete" id="2"></span>
<svg>
  <title>Close</title>
  <g><path /></g>
</svg>
```

<!--DOCUSAURUS_CODE_TABS-->

<!--Native-->

```js
import { screen } from '@testing-library/dom'

const deleteElement = screen.getByTitle('Delete')
const closeElement = screen.getByTitle('Close')
```

<!--React-->

```js
import { render, screen } from '@testing-library/react'

render(<MyComponent />)
const deleteElement = screen.getByTitle('Delete')
const closeElement = screen.getByTitle('Close')
```

<!--Cypress-->

```js
cy.findByTitle('Delete').should('exist')
cy.findByTitle('Close').should('exist')
```

<!--END_DOCUSAURUS_CODE_TABS-->

### `ByDisplayValue`

> getByDisplayValue, queryByDisplayValue, getAllByDisplayValue,
> queryAllByDisplayValue, findByDisplayValue, findAllByDisplayValue

```typescript
getByDisplayValue(
  container: HTMLElement, // if you're using `screen`, then skip this argument
  value: TextMatch,
  options?: {
    exact?: boolean = true,
    normalizer?: NormalizerFn,
  }): HTMLElement
```

Returns the `input`, `textarea`, or `select` element that has the matching
display value.

#### `input`

```html
<input type="text" id="lastName" />
```

```js
document.getElementById('lastName').value = 'Norris'
```

<!--DOCUSAURUS_CODE_TABS-->

<!--Native-->

```js
import { screen } from '@testing-library/dom'

const lastNameInput = screen.getByDisplayValue('Norris')
```

<!--React-->

```js
import { render, screen } from '@testing-library/react'

render(<MyComponent />)
const lastNameInput = screen.getByDisplayValue('Norris')
```

<!--Cypress-->

```js
cy.findByDisplayValue('Norris').should('exist')
```

<!--END_DOCUSAURUS_CODE_TABS-->

#### `textarea`

```html
<textarea id="messageTextArea" />
```

```js
document.getElementById('messageTextArea').value = 'Hello World'
```

<!--DOCUSAURUS_CODE_TABS-->

<!--Native-->

```js
import { screen } from '@testing-library/dom'

const messageTextArea = screen.getByDisplayValue('Hello World')
```

<!--React-->

```js
import { render, screen } from '@testing-library/react'

render(<MyComponent />)
const messageTextArea = screen.getByDisplayValue('Hello World')
```

<!--Cypress-->

```js
cy.findByDisplayValue('Hello World').should('exist')
```

<!--END_DOCUSAURUS_CODE_TABS-->

#### `select`

In case of `select`, this will search for a `<select>` whose selected `<option>`
matches the given [`TextMatch`](#textmatch).

```html
<select>
  <option value="">State</option>
  <option value="AL">Alabama</option>
  <option selected value="AK">Alaska</option>
  <option value="AZ">Arizona</option>
</select>
```

<!--DOCUSAURUS_CODE_TABS-->

<!--Native-->

```js
import { screen } from '@testing-library/dom'

const selectElement = screen.getByDisplayValue('Alaska')
```

<!--React-->

```js
import { render, screen } from '@testing-library/react'

render(<MyComponent />)
const selectElement = screen.getByDisplayValue('Alaska')
```

<!--Cypress-->

```js
cy.findByDisplayValue('Alaska').should('exist')
```

<!--END_DOCUSAURUS_CODE_TABS-->

### `ByRole`

> getByRole, queryByRole, getAllByRole, queryAllByRole, findByRole,
> findAllByRole

```typescript
getByRole(
  container: HTMLElement, // if you're using `screen`, then skip this argument
  role: TextMatch,
  options?: {
    exact?: boolean = true,
    hidden?: boolean = true,
    name?: TextMatch,
    normalizer?: NormalizerFn,
    selected?: boolean,
  }): HTMLElement
```

Queries for elements with the given role (and it also accepts a
[`TextMatch`](#textmatch)). Default roles are taken into consideration e.g.
`<button />` has the `button` role without explicitly setting the `role`
attribute. The
[W3C HTML recommendation](https://www.w3.org/TR/html5/index.html#contents) lists
all HTML elements with their default ARIA roles. Additionally, as DOM Testing
Library uses `aria-query` under the hood to find those elements by their default
ARIA roles, you can find in their docs
[which HTML Elements with inherent roles are mapped to each role](https://github.com/A11yance/aria-query#elements-to-roles).

You can query the returned element(s) by their
[accessible name](https://www.w3.org/TR/accname-1.1/). The accessible name is
for simple cases equal to e.g. the label of a form element, or the text content
of a button, or the value of the `aria-label` attribute. It can be used to query
a specific element if multiple elements with the same role are present on the
rendered content. For an in-depth guide check out
["What is an accessible name?" from ThePacielloGroup](https://developer.paciellogroup.com/blog/2017/04/what-is-an-accessible-name/).
If you only query for a single element with `getByText('The name')` it's
oftentimes better to use `getByRole(expectedRole, { name: 'The name' })`. The
accessible name query does not replace other queries such as `*ByAlt` or
`*ByTitle`. While the accessible name can be equal to these attributes, it does
not replace the functionality of these attributes. For example
`<img aria-label="fancy image" src="fancy.jpg" />` will be returned for both
`getByAltText('fancy image')` and `getByRole('image', { name: 'fancy image' })`.
However, the image will not display its description if `fancy.jpg` could not be
loaded. Whether you want assert this functionality in your test or not is up to
you.

If you set `hidden` to `true` elements that are normally excluded from the
accessibility tree are considered for the query as well. The default behavior
follows https://www.w3.org/TR/wai-aria-1.2/#tree_exclusion with the exception of
`role="none"` and `role="presentation"` which are considered in the query in any
case. For example in

```html
<body>
  <main aria-hidden="true">
    <button>Open dialog</button>
  </main>
  <div role="dialog">
    <button>Close dialog</button>
  </div>
</body>
```

`getByRole('button')` would only return the `Close dialog`-button. To make
assertions about the `Open dialog`-button you would need to use
`getAllByRole('button', { hidden: true })`.

The default value for `hidden` can [be configured](api-configuration#configuration).

Certain roles can have a selected state. You can filter the 
returned elements by their selected state
by setting `selected: true` or `selected: false`.

For example in

```html
<body>
  <div role="tablist">
    <button role="tab" aria-selected="true">Native</button>
    <button role="tab" aria-selected="false">React</button>
    <button role="tab" aria-selected="false">Cypress</button>
  </div>
</body>
```

you can get the "Native"-tab by calling `getByRole('tab', { selected: true })`.
To learn more about the selected state and which elements can 
have this state see [ARIA `aria-selected`](https://www.w3.org/TR/wai-aria-1.2/#aria-selected).

```html
<div role="dialog">...</div>
```

<!--DOCUSAURUS_CODE_TABS-->

<!--Native-->

```js
import { screen } from '@testing-library/dom'

const dialogContainer = screen.getByRole('dialog')
```

<!--React-->

```js
import { render, screen } from '@testing-library/react'

render(<MyComponent />)
const dialogContainer = screen.getByRole('dialog')
```

<!--Cypress-->

```js
cy.findByRole('dialog').should('exist')
```

<!--END_DOCUSAURUS_CODE_TABS-->

### `ByTestId`

> getByTestId, queryByTestId, getAllByTestId, queryAllByTestId, findByTestId,
> findAllByTestId

```typescript
getByTestId(
  container: HTMLElement, // if you're using `screen`, then skip this argument
  text: TextMatch,
  options?: {
    exact?: boolean = true,
    normalizer?: NormalizerFn,
  }): HTMLElement
```

A shortcut to `` container.querySelector(`[data-testid="${yourId}"]`) `` (and it
also accepts a [`TextMatch`](#textmatch)).

```html
<div data-testid="custom-element" />
```

<!--DOCUSAURUS_CODE_TABS-->

<!--Native-->

```js
import { screen } from '@testing-library/dom'

const element = screen.getByTestId('custom-element')
```

<!--React-->

```js
import { render, screen } from '@testing-library/react'

render(<MyComponent />)
const element = screen.getByTestId('custom-element')
```

<!--Cypress-->

```js
cy.findByTestId('custom-element').should('exist')
```

<!--END_DOCUSAURUS_CODE_TABS-->

> In the spirit of [the guiding principles](guiding-principles.md), it is
> recommended to use this only after the other queries don't work for your use
> case. Using data-testid attributes do not resemble how your software is used
> and should be avoided if possible. That said, they are _way_ better than
> querying based on DOM structure or styling css class names. Learn more about
> `data-testid`s from the blog post
> ["Making your UI tests resilient to change"](https://kentcdodds.com/blog/making-your-ui-tests-resilient-to-change)

#### Overriding `data-testid`

The `...ByTestId` functions in `DOM Testing Library` use the attribute
`data-testid` by default, following the precedent set by
[React Native Web](https://github.com/testing-library/react-testing-library/issues/1)
which uses a `testID` prop to emit a `data-testid` attribute on the element, and
we recommend you adopt that attribute where possible. But if you already have an
existing codebase that uses a different attribute for this purpose, you can
override this value via
`configure({testIdAttribute: 'data-my-test-attribute'})`.

## `TextMatch`

Several APIs accept a `TextMatch` which can be a `string`, `regex` or a
`function` which returns `true` for a match and `false` for a mismatch.

### Precision

Some APIs accept an object as the final argument that can contain options that
affect the precision of string matching:

- `exact`: Defaults to `true`; matches full strings, case-sensitive. When false,
  matches substrings and is not case-sensitive.
  - `exact` has no effect on `regex` or `function` arguments.
  - In most cases using a regex instead of a string gives you more control over
    fuzzy matching and should be preferred over `{ exact: false }`.
- `normalizer`: An optional function which overrides normalization behavior. See
  [`Normalization`](#normalization).

### Normalization

Before running any matching logic against text in the DOM, `DOM Testing Library`
automatically normalizes that text. By default, normalization consists of
trimming whitespace from the start and end of text, and collapsing multiple
adjacent whitespace characters into a single space.

If you want to prevent that normalization, or provide alternative normalization
(e.g. to remove Unicode control characters), you can provide a `normalizer`
function in the options object. This function will be given a string and is
expected to return a normalized version of that string.

Note: Specifying a value for `normalizer` _replaces_ the built-in normalization,
but you can call `getDefaultNormalizer` to obtain a built-in normalizer, either
to adjust that normalization or to call it from your own normalizer.

`getDefaultNormalizer` takes an options object which allows the selection of
behaviour:

- `trim`: Defaults to `true`. Trims leading and trailing whitespace
- `collapseWhitespace`: Defaults to `true`. Collapses inner whitespace
  (newlines, tabs, repeated spaces) into a single space.

#### Normalization Examples

To perform a match against text without trimming:

```javascript
screen.getByText('text', {
  normalizer: getDefaultNormalizer({ trim: false }),
})
```

To override normalization to remove some Unicode characters whilst keeping some
(but not all) of the built-in normalization behavior:

```javascript
screen.getByText('text', {
  normalizer: str =>
    getDefaultNormalizer({ trim: false })(str).replace(/[\u200E-\u200F]*/g, ''),
})
```

### TextMatch Examples

Given the following HTML:

```html
<div>Hello World</div>
```

**_Will_ find the div:**

```javascript
// Matching a string:
screen.getByText('Hello World') // full string match
screen.getByText('llo Worl', { exact: false }) // substring match
screen.getByText('hello world', { exact: false }) // ignore case

// Matching a regex:
screen.getByText(/World/) // substring match
screen.getByText(/world/i) // substring match, ignore case
screen.getByText(/^hello world$/i) // full string match, ignore case
screen.getByText(/Hello W?oRlD/i) // advanced regex

// Matching with a custom function:
screen.getByText((content, element) => content.startsWith('Hello'))
```

**_Will not_ find the div:**

```javascript
// full string does not match
screen.getByText('Goodbye World')

// case-sensitive regex with different case
screen.getByText(/hello world/)

// function looking for a span when it's actually a div:
screen.getByText((content, element) => {
  return element.tagName.toLowerCase() === 'span' && content.startsWith('Hello')
})
```
