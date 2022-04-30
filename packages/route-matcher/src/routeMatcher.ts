import parse from './parse';
import { RouteSegment, SegmentType } from './types';

export default function routeMatcher(
  route: string,
  path: string
): RouteSegment[] | null {
  if (!route || !path) return null;

  if (route === path.toLowerCase()) {
    return [{ type: 'EXACT', params: [] }] as RouteSegment[];
  }

  const value = parse(route);
  const regexp = new RegExp('^' + value.pattern + '$', 'i');
  const execArr = regexp.exec(path);

  if (!execArr) {
    return null;
  }

  const output = [];
  let paramsIndex = 1;

  for (let i = 0; i < value.parsedSegments.length; i++) {
    const obj: RouteSegment = {
      type: value.parsedSegments[i].type as SegmentType,
      params: value.parsedSegments[i].params.map((p) => {
        const param = { name: p, value: execArr[paramsIndex] };
        paramsIndex++;
        return param;
      }),
    };
    output.push(obj);
  }

  return output;
}
