## Definitions

- **URL**: Uniform Resource Locator (URL) is a text string that specifies where a resource (such as a web page, image, or video) can be found on the Internet. URLs are called "Web address" or "link". Your browser displays URLs in its address bar. - [MDN](https://developer.mozilla.org/en-US/docs/Glossary/URL)

- **Path**: A [USVString](https://developer.mozilla.org/en-US/docs/Web/API/USVString) containing an initial '/' followed by the path of the URL, not including the query string or fragment. - [MDN](https://developer.mozilla.org/en-US/docs/Web/API/URL/pathname)

- **Query**: A [USVString](https://developer.mozilla.org/en-US/docs/Web/API/USVString) indicating the URL's parameter string; if any parameters are provided, this string includes all of them, beginning with the leading ? character. - [MDN](https://developer.mozilla.org/en-US/docs/Web/API/URL/search)

- **Hash**: A [USVString](https://developer.mozilla.org/en-US/docs/Web/API/USVString) containing a '#' followed by the fragment identifier of the URL. - [MDN](https://developer.mozilla.org/en-US/docs/Web/API/URL/hash)

- **Pattern**: A string containing `plain` or `special` characters for matching route to paths.

- **Segment**: A string containing an initial character `'/'` followed by the pattern.

- **Route**: A string containing segments of patterns to match paths.

- **Params**: The route parameters value parsed from the path.

## Route Matching

A route segment can be `Static` or `Dynamic`.

**Static**: The segment that matches the same string in the path. Eg: `"/about"`, `"/en-US/docs/Web/API/URL"`

**Dynamic**: The segment that matches any string in the path. Eg: `"/users/:userID"` will match paths like `"/users/123"`, `"/users/abc"`, etc.

The `routeMatcher` is a function used to match routes to paths.

The function accepts a `route` string and a `path` string as parameters.

The function returns an array of matched segments as a `RouteSegment` or `null` if they are not matched.

## Example

```js
import { routeMatcher } from "@open-tech-world/route-matcher";

routeMatcher("/", "/");

/*

[
    {
        "type": "EXACT",
        "params": []
    }
]

*/
```
