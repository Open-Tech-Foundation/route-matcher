---
sidebar_position: 3
---

The route segments can be repeated.

- Zero or more times by suffixing `*` modifier

- One or more times by suffixing `+` modifier

## Modifier - `*`

If you need to match multiple route segments like `/a/b/c` with including `/`, you should suffix the `*` modifier.

### Example

```js
import { routeMatcher } from "@open-tech-world/route-matcher";

routeMatcher("/:chapters*", "/");

/*
[
    {
        "type": "DYNAMIC",
        "params": [
            {
                "name": "chapters",
                "value": undefined
            }
        ]
    }
]
*/

routeMatcher("/:chapters*", "/a");

/*
[
    {
        "type": "DYNAMIC",
        "params": [
            {
                "name": "chapters",
                "value": "a"
            }
        ]
    }
]
*/

routeMatcher("/:chapters*", "/a/b");

/*
[
    {
        "type": "DYNAMIC",
        "params": [
            {
                "name": "chapters",
                "value": "a/b"
            }
        ]
    }
]
*/

routeMatcher("/:chapters*", "/a/b/c");

/*
[
    {
        "type": "DYNAMIC",
        "params": [
            {
                "name": "chapters",
                "value": "a/b/c"
            }
        ]
    }
]
*/
```

## Modifier - `+`

If you need to match multiple route segments like `/a/b/c` with atleast one segment required, you should suffix the `+` modifier.

### Example

```js
import { routeMatcher } from "@open-tech-world/route-matcher";

routeMatcher("/:chapters+", "/"); // null

routeMatcher("/:chapters+", "/a");

/*
[
    {
        "type": "DYNAMIC",
        "params": [
            {
                "name": "chapters",
                "value": "a"
            }
        ]
    }
]
*/

routeMatcher("/:chapters+", "/a/b");

/*
[
    {
        "type": "DYNAMIC",
        "params": [
            {
                "name": "chapters",
                "value": "a/b"
            }
        ]
    }
]
*/

routeMatcher("/:chapters+", "/a/b/c");

/*
[
    {
        "type": "DYNAMIC",
        "params": [
            {
                "name": "chapters",
                "value": "a/b/c"
            }
        ]
    }
]
*/
```
