---
sidebar_position: 2
---

The `Dynamic` route segments can be used to define `parameters`.

The parameters can be `named` or `unnamed`.

## Named Parameters

It can be defined by prefixing a colon `:` character to the parameter name.

### Example

```js
import { routeMatcher } from "@open-tech-world/route-matcher";

routeMatcher("/users/:id", "/users/123");

/*
[
    {
        "type": "STATIC",
        "params": []
    },
    {
        "type": "DYNAMIC",
        "params": [
            {
                "name": "id",
                "value": "123"
            }
        ]
    }
]
*/
```

To override the default matching patterns, you can provide custom regular expressions to match.

### Example (Custom override)

```js
import { routeMatcher } from "@open-tech-world/route-matcher";

routeMatcher("/orders/:orderID(\\d+)", "/orders/12345");

/*
[
    {
        "type": "STATIC",
        "params": []
    },
    {
        "type": "DYNAMIC",
        "params": [
            {
                "name": "orderID",
                "value": "12345"
            }
        ]
    }
]
*/
```

:::note
In Javascript, you need to add an extra `backslash` to [escape](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String#escape_sequences) it in strings.
:::

## Unnamed Parameters

Dynamic segments can be unnamed by only using the regular expressions.

:::caution
Currently the unnamed parameters cannot be inclued in the `params` array of the `RouteSegment`
:::

### Example

```js
import { routeMatcher } from "@open-tech-world/route-matcher";

routeMatcher("/docs/(.*)", "/docs/intro");

/*
[
    {
        "type": "STATIC",
        "params": []
    },
    {
        "type": "DYNAMIC",
        "params": []
    }
]
*/
```

