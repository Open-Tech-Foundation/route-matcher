---
sidebar_position: 3
---

[![An image from the static](/img/mdn-url-all.png)](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/What_is_a_URL)


- The router will only match the URL `paths`, not `query strings` or `search parameters` & `hash` or `anchor`.

- The paths will always be matched case-insensitively. 
  
  Eg: `/about` is same as `/About`.

- The trailing slash `/` will not be matched by default.
  
  Eg: The route `/docs` will match path `/docs` but not `/docs/`.

- A route segment can have `named` or `unnamed` or `both` the parameters.

- The parameters name must be defined by prefixing the colon `:` character to the name.
  
  Eg: `/users/:userID`, here the `userID` is the parameter name.

- The parameters name must match this regular expression `[A-Za-z0-9_]`.

- The named parameters match their value using this regular expression `([^/]+)`.

- The named parameters default matching can be overridden by the `custom` regular expressions, the custom regex must be defined by suffixing `(regexp)` to the name.

  Eg: `/orders/:orderId(\d+)`, here the param `orderID` matches only the digits.

- The unnamed parameters must be defined by `custom` regular expressions.

  Eg: `/photos/(.*)` can match paths like `/photos/my-family.jpg`, `/photos/selfie.png`.

- The regexp `caputring groups` are not allowed inside the `custom` regexp.

  Eg: This will throw an error `/photos/(.*.(jpg|png))`. But this will not throw an error `/photos/(.*).(jpg|png)`.

- The modifiers `*`, `+`, and `?` must be placed after the parameter.

  Eg: `/:chapters*`, `/(.*)+`, `/docs/:slug?`