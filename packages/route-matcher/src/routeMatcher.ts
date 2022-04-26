export type SegmentType =
  | 'STATIC'
  | 'DYNAMIC_NAMED'
  | 'DYNAMIC_UNNAMED'
  | 'EXACT';

export type RouteSegment = {
  type: SegmentType;
  name: string;
  value: string | undefined;
};

type ParsedSegment = {
  type: SegmentType;
  pattern: string;
  name: string;
};

function toRegex(str: string, modifier: string | false) {
  let name = '';
  let pattern = '';

  for (let i = 0; i < str.length; i++) {
    if (str[i] === ':') {
      const res = str.slice(i + 1).match(/([a-zA-Z0-9-]+)(?:.*)/);
      name = res?.[1] as string;
      i += name.length;
      if (str[i + 1] !== '(') {
        pattern += '([^/]+)';
      }
      continue;
    }

    if (str[i] === '(') {
      const res = str.slice(i).match(/(?:\((.+)\))/);
      pattern += `(${res?.[1]})`;
      i += (res?.[1] as string).length + 1;
      continue;
    }

    if (str[i] === '*') {
      pattern += '(?:.*)';
      continue;
    }

    pattern += str[i];
  }

  if (modifier) {
    pattern = `(/${pattern}(?:(?:/)?(?:${pattern}))*)${modifier}`;
  } else {
    pattern = '/' + pattern;
  }

  return { pattern, name };
}

function getModifier(seg: string) {
  const modifier = seg.at(-1);

  if (modifier && ['*', '+', '?'].includes(modifier)) {
    if (seg.includes(':') || seg.includes('(')) {
      return modifier;
    }

    throw new Error(
      `Unexpected modifier (${modifier}), Modifiers must be placed after the parameter.`
    );
  } else {
    return false;
  }
}

function parseSegment(seg: string): ParsedSegment {
  let type: SegmentType = 'STATIC';
  let name = '';
  let pattern = `/(${seg})`;
  const modifier = getModifier(seg);
  const segment = modifier ? seg.slice(0, -1) : seg;

  if (seg.includes(':')) {
    type = 'DYNAMIC_NAMED';
    const res = toRegex(segment, modifier);
    pattern = res.pattern;
    name = res.name;
  } else if (new RegExp(/[*(]/).test(segment)) {
    type = 'DYNAMIC_UNNAMED';
    const res = toRegex(segment, modifier);
    pattern = res.pattern;
  }

  return { pattern, type, name };
}

export default function routeMatcher(
  route: string,
  path: string
): RouteSegment[] | null {
  console.log('Route: ' + route + ' ' + 'Path: ' + path);

  if (!route || !path) return null;

  if (route === path.toLowerCase()) {
    return [{ name: '', type: 'EXACT', value: path }] as RouteSegment[];
  }

  const segments = route.split('/').splice(1);
  console.log('Segments', segments);

  const parsedSegments = segments.map(parseSegment);
  console.log('Parsed Segments', parsedSegments);

  const regexp = new RegExp(
    '^' + parsedSegments.map((s) => s.pattern).join('') + '$',
    'i'
  );
  console.log('Regexp', regexp);

  const execArr = regexp.exec(path);
  console.log('Exec Array', execArr);

  if (!execArr) {
    return null;
  }

  const output = [];

  for (let i = 0; i < parsedSegments.length; i++) {
    const obj: RouteSegment = {
      type: parsedSegments[i].type as SegmentType,
      name: parsedSegments[i].name,
      value: execArr[1 + i],
    };
    output.push(obj);
  }

  console.log('Output', output);

  return output;
}
