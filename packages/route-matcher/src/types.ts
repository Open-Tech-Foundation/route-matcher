export type SegmentType = 'STATIC' | 'DYNAMIC' | 'EXACT';

export type RouteSegment = {
  type: SegmentType;
  params: Record<string, string>[];
};

export type ParsedSegment = {
  type: SegmentType;
  params: string[];
};
