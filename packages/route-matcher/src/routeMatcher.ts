export type SegmentType = 'STATIC' | 'DYNAMIC' | 'EXACT';

export type RouteSegment = {
  type: SegmentType;
  params: Record<string, string>[];
};

type ParsedSegment = {
  type: SegmentType;
  pattern: string;
  params: string[];
};

function matchCustomRegexp(str: string) {
  let pattern = '';
  let open = 1;
  const s = str.slice(1);

  for (let i = 0; i < s.length; i++) {
    if (s[i] === '(') {
      if (s[i + 1] !== '?') {
        throw new Error(
          'Capturing groups are not allowed inside the custom regular expressions.'
        );
      }
      open++;
    }

    if (s[i] === ')') {
      open--;
    }

    if (open === 0) {
      break;
    }

    if (s[i] === '\\') {
      pattern += '\\';
      continue;
    }

    pattern += s[i];
  }

  if (!pattern) {
    throw new Error(
      'Missing pattern: custom regular expressions must not be empty.'
    );
  }

  return pattern;
}

function isModifier(c: string) {
  return ['*', '+', '?'].includes(c);
}

function toRegex(str: string) {
  const params: string[] = [];

  let pattern = '/';

  for (let i = 0; i < str.length; i++) {
    // Parse named params w/ or w/o custom regexp
    if (str[i] === ':') {
      const res = str.slice(i + 1).match(/([a-zA-Z0-9_]+)(?:.*)/);
      const name = res?.[1] as string;
      params.push(name);
      i += name.length;
      let currentPattern;

      if (str[i + 1] === '(') {
        const pat = matchCustomRegexp(str.slice(i + 1));
        currentPattern = '(' + pat + ')';
        i += pat.length + 2;
      } else {
        currentPattern = '([^/]+)';
      }

      if (isModifier(str[i + 1])) {
        if (str[i + 1] === '?') {
          currentPattern = `(?:${currentPattern})?`;
        } else {
          currentPattern = `(${currentPattern}(?:(?:/)?(?:${currentPattern}))*)${
            str[i + 1]
          }`;
        }

        i += 1;
      }

      pattern += currentPattern;

      continue;
    }

    // Parse unnamed params with custom regexp
    if (str[i] === '(') {
      let currentPattern;

      const pat = matchCustomRegexp(str.slice(i));
      currentPattern = '(?:' + pat + ')';
      i += pat.length + 1;

      if (isModifier(str[i + 1])) {
        if (str[i + 1] === '?') {
          currentPattern = `(?:${currentPattern})?`;
        } else {
          currentPattern = `(${currentPattern}(?:(?:/)?(?:${currentPattern}))*)${
            str[i + 1]
          }`;
        }

        i += 1;
      }

      pattern += currentPattern;

      continue;
    }

    if (isModifier(str[i])) {
      throw new Error(
        `Unexpected modifier (${str[i]}): Modifiers must be placed after the parameter.`
      );
    }

    pattern += str[i];
  }

  return { pattern, params };
}

function parseSegment(seg: string): ParsedSegment {
  const out: ParsedSegment = {
    params: [],
    pattern: `/(?:${seg})`,
    type: 'STATIC',
  };

  if (new RegExp(/[:(*+?]/).test(seg)) {
    out.type = 'DYNAMIC';
    const res = toRegex(seg);
    out.pattern = res.pattern;
    out.params = res.params;
  }

  return out;
}

export default function routeMatcher(
  route: string,
  path: string
): RouteSegment[] | null {
  if (!route || !path) return null;

  if (route === path.toLowerCase()) {
    return [{ type: 'EXACT', params: [] }] as RouteSegment[];
  }

  const segments = route.split('/').splice(1);
  const parsedSegments = segments.map(parseSegment);
  const regexp = new RegExp(
    '^' + parsedSegments.map((s) => s.pattern).join('') + '$',
    'i'
  );
  const execArr = regexp.exec(path);

  if (!execArr) {
    return null;
  }

  const output = [];
  let paramsIndex = 1;

  for (let i = 0; i < parsedSegments.length; i++) {
    const obj: RouteSegment = {
      type: parsedSegments[i].type as SegmentType,
      params: parsedSegments[i].params.map((p) => {
        const param = { name: p, value: execArr[paramsIndex] };
        paramsIndex++;
        return param;
      }),
    };
    output.push(obj);
  }

  return output;
}
