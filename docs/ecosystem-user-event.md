---
id: ecosystem-user-event
title: user-event
---

[`user-event`][gh] is a companion library for Testing Library that provides more
advanced simulation of browser interactions than the built-in
[`fireEvent`][docs] method.

```
npm install --save-dev @testing-library/user-event
```

```jsx
import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'

test('types inside textarea', () => {
  document.body.innerHTML = `<textarea />`

  userEvent.type(screen.getByRole('textbox'), 'Hello, World!')
  expect(screen.getByRole('textbox')).toHaveValue('Hello, World!')
})
```

- [user-event on GitHub][gh]

## Known limitations

- No `<input type="color" />` support.
  [#423](https://github.com/testing-library/user-event/issues/423#issuecomment-669368863)

[gh]: https://github.com/testing-library/user-event
[docs]:
  https://testing-library.com/docs/dom-testing-library/api-events#fireevent
