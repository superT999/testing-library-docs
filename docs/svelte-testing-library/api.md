---
id: api
title: API
sidebar_label: API
---

- [`@testing-library/dom`](#testing-library-dom)
- [`render`](#render)
- [`cleanup`](#cleanup)
- [`act`](#act-async)
- [`fireEvent`](#fireevent-async)

---

## `@testing-library/dom`

This library re-exports everything from the DOM Testing Library
(`@testing-library/dom`). See the
[documentation](../dom-testing-library/api-queries.md) to see what goodies you
can use.

📝 `fireEvent` is an `async` method when imported from
`@testing-library/svelte`. This is because it calls [`tick`][svelte-tick] which
tells Svelte to apply any new changes to the DOM.

## `render`

```jsx
import { render } from '@testing-library/svelte'

const { results } = render(
  YourComponent,
  { ComponentOptions },
  { RenderOptions }
)
```

### Component Options

These are the options you pass when instantiating your Svelte `Component`.
Please refer to the
[Client-side component API](https://svelte.dev/docs#Client-side_component_API).

### Render Options

| Option      | Description                                                                                                                            | Default         |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| `container` | The HTML element the component is mounted into.                                                                                        | `document.body` |
| `queries`   | Queries to bind to the container. See [getQueriesForElement](../dom-testing-library/api-helpers#within-and-getqueriesforelement-apis). | `null`          |

### Results

| Result       | Description                                                                                                                                                                                                  |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `container`  | The HTML element the component is mounted into.                                                                                                                                                              |
| `component`  | The newly created Svelte component. **Please do not use this, it will most likely be removed in a future release.** Using this method goes against the testing libraries guiding principles.                 |
| `debug`      | Logs the baseElement using [prettyDom](https://testing-library.com/docs/dom-testing-library/api-helpers#prettydom).                                                                                          |
| `unmount`    | Unmounts the component from the `target` by calling `component.$destroy()`.                                                                                                                                  |
| `rerender`   | Calls render again destroying the old component, and mounting the new component on the original `target` with any new options passed in.                                                                     |
| `...queries` | Returns all [query functions](https://testing-library.com/docs/dom-testing-library/api-queries) that are binded to the `container`. If you pass in `query` arguments than this will be those, otherwise all. |

## `cleanup`

> You don't need to import or use this, it's done automagically for you!

Unmounts the component from the container and destroys the container.

📝 When you import anything from the library, this automatically runs after each
test. If you'd like to disable this then set `process.env.STL_SKIP_AUTO_CLEANUP`
to true or import `dont-clean-up-after-each` from the library.

```jsx
import { render, cleanup } from '@testing-library/svelte'

afterEach(() => {
  cleanup()
}) // Default on import: runs it after each test.

render(YourComponent)

cleanup() // Or like this for more control.
```

## `act` (`async`)

An `async` helper method that takes in a `function` or `Promise` that is
immediately called/resolved, and then calls [`tick`][svelte-tick] so all pending
state changes are flushed, and the view now reflects any changes made to the
DOM.

## `fireEvent` (`async`)

Calls `@testing-library/dom` [fireEvent](../dom-testing-library/api-events). It
is an `async` method due to calling [`tick`][svelte-tick] which tells Svelte to
flush all pending state changes, basically it updates the DOM to reflect the new
changes.

**Component**

```html
<button on:click="{handleClick}">Count is {count}</button>

<script>
  let count = 0

  function handleClick() {
    count += 1
  }
</script>
```

**Test**

```js
import '@testing-library/jest-dom/extend-expect'

import { render, fireEvent } from '@testing-library/svelte'

import Comp from '..'

test('count increments when button is clicked', async () => {
  const { getByText } = render(Comp)
  const button = getByText('Count is 0')

  // Option 1.
  await fireEvent.click(button)
  expect(button).toHaveTextContent('Count is 1')

  // Option 2.
  await fireEvent(
    button,
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    })
  )
  expect(button).toHaveTextContent('Count is 2')
})
```

[svelte-tick]: https://svelte.dev/docs#tick
