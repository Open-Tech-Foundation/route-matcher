import isModifier from './isModifier';
import parseCustomRegExp from './parseCustomRegExp';
import { ParsedSegment, SegmentType } from './types';

function parseNamedParam(str: string, params: string[]) {
  const matchArr = str.match(/([a-zA-Z0-9_]+)(?:.*)/);
  const name = matchArr?.[1] as string;
  params.push(name);
  let len = name.length;
  let pat;

  if (str[len] === '(') {
    const pattern = parseCustomRegExp(str.slice(len));
    pat = '(' + pattern + ')';
    len += pat.length;
  } else {
    pat = '([^/]+)';
  }

  return { pat, len };
}

function parseUnNamedParam(str: string) {
  let len = 0;
  let pat = '';

  pat = parseCustomRegExp(str);
  len += pat.length;

  pat = '(?:' + pat + ')';

  return { pat, len };
}

export default function parse(route: string) {
  const parsedSegments: ParsedSegment[] = [];
  let currentType: SegmentType = 'STATIC';
  let currentParams: string[] = [];
  let pattern = '';

  for (let i = 0; i < route.length; i++) {
    const c = route[i];

    if (c === '/') {
      if (pattern.length !== 0) {
        parsedSegments.push({ type: currentType, params: currentParams });
        currentParams = [];
        currentType = 'STATIC';
      }

      pattern += '\\/';

      continue;
    }

    if (c === ':') {
      currentType = 'DYNAMIC';
      const { pat, len } = parseNamedParam(route.slice(i + 1), currentParams);
      i += len;

      if (isModifier(route[i + 1])) {
        if (route[i + 1] === '?') {
          if (pattern.slice(-2) === '\\/') {
            pattern = pattern.slice(0, -2) + `(?:/${pat})?`;
          } else {
            pattern += `(?:${pat})?`;
          }
        } else {
          pattern += `(${pat}(?:(?:/)?(?:${pat}))*)${route[i + 1]}`;
        }

        i += 1;
      } else {
        pattern += pat;
      }

      continue;
    }

    if (c === '(') {
      currentType = 'DYNAMIC';
      const { pat, len } = parseUnNamedParam(route.slice(i));

      // pattern += pat;
      i += len + 1;

      if (isModifier(route[i + 1])) {
        if (route[i + 1] === '?') {
          if (pattern.slice(-2) === '\\/') {
            pattern = pattern.slice(0, -2) + `(?:/${pat})?`;
          } else {
            pattern += `(?:${pat})?`;
          }
        } else {
          pattern += `(${pat}(?:(?:/)?(?:${pat}))*)${route[i + 1]}`;
        }

        i += 1;
      } else {
        pattern += pat;
      }

      continue;
    }

    if (isModifier(c)) {
      throw new Error(
        `Unexpected modifier (${c}) at ${
          i + 1
        }: Modifiers must be placed after the parameter.`
      );
    }

    pattern += c;
  }

  parsedSegments.push({ type: currentType, params: currentParams });

  return { pattern, parsedSegments };
}
