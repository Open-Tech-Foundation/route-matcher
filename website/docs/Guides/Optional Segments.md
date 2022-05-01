---
sidebar_position: 4
---

The route segments can be marked optional by suffixing the question mark `?` modifier.

### Example

```js
import { routeMatcher } from "@open-tech-world/route-matcher";

routeMatcher("/docs/:slug?", "/docs");

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
                "name": "slug",
                "value": undefined
            }
        ]
    }
]
*/

routeMatcher("/docs/:slug?", "/docs/some-sluggish-name");

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
                "name": "slug",
                "value": "some-sluggish-name"
            }
        ]
    }
]
*/
```
