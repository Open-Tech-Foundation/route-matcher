import { routeMatcher } from '../src';

describe('routeMatcher', () => {
  test('empty route', () => {
    expect(routeMatcher('', '')).toBe(null);
  });

  test('slash route with empty path', () => {
    expect(routeMatcher('/', '')).toBe(null);
  });

  test('slash route with slash path', () => {
    expect(routeMatcher('/', '/')).toEqual([{ type: 'EXACT', params: [] }]);
  });

  test('single static segment path', () => {
    expect(routeMatcher('/users', '/')).toBe(null);
    expect(routeMatcher('/users', '/u')).toBe(null);
    expect(routeMatcher('/users', '/user')).toBe(null);
    expect(routeMatcher('/users', '/users')).toEqual([
      { type: 'EXACT', params: [] },
    ]);
    expect(routeMatcher('/users', '/Users')).toEqual([
      { type: 'EXACT', params: [] },
    ]);
  });

  test('two static segments path', () => {
    expect(routeMatcher('/users/new', '/users/new')).toEqual([
      { type: 'EXACT', params: [] },
    ]);
  });
  test('multiple static segments path', () => {
    expect(
      routeMatcher('/docs/tutorials/intro', '/docs/tutorials/intro')
    ).toEqual([{ type: 'EXACT', params: [] }]);
  });

  test('single dynamic named segment path', () => {
    expect(routeMatcher('/:foo', '/')).toBe(null);
    expect(routeMatcher('/:foo', '/a')).toEqual([
      { type: 'DYNAMIC', params: [{ name: 'foo', value: 'a' }] },
    ]);
    expect(routeMatcher('/:foo', '/bar')).toEqual([
      { type: 'DYNAMIC', params: [{ name: 'foo', value: 'bar' }] },
    ]);
    expect(routeMatcher('/:foo', '/bar-2')).toEqual([
      { type: 'DYNAMIC', params: [{ name: 'foo', value: 'bar-2' }] },
    ]);
    expect(routeMatcher('/:foo', '/a/')).toBe(null);
    expect(routeMatcher('/:foo', '/a/b')).toBe(null);
  });

  test('two dynamic segments path', () => {
    expect(routeMatcher('/:foo/:bar', '/')).toBe(null);
    expect(routeMatcher('/:foo/:bar', '/a')).toBe(null);
    expect(routeMatcher('/:foo/:bar', '/a/')).toBe(null);
    expect(routeMatcher('/:foo/:bar', '/a/b')).toEqual([
      { type: 'DYNAMIC', params: [{ name: 'foo', value: 'a' }] },
      { type: 'DYNAMIC', params: [{ name: 'bar', value: 'b' }] },
    ]);
    expect(routeMatcher('/:foo/:bar', '/a/b/')).toBe(null);
    expect(routeMatcher('/:foo/:bar', '/a/b/c')).toBe(null);
  });

  test('multiple dynamic segments path', () => {
    expect(routeMatcher('/:foo/:bar/:baz', '/foo')).toBe(null);
    expect(routeMatcher('/:foo/:bar/:baz', '/foo/bar')).toBe(null);
    expect(routeMatcher('/:foo/:bar/:baz', '/docs/tutorials/intro')).toEqual([
      { type: 'DYNAMIC', params: [{ name: 'foo', value: 'docs' }] },
      { type: 'DYNAMIC', params: [{ name: 'bar', value: 'tutorials' }] },
      { type: 'DYNAMIC', params: [{ name: 'baz', value: 'intro' }] },
    ]);
  });

  test('one static & one dynamic segments path', () => {
    expect(routeMatcher('/users/:id', '/users/1')).toEqual([
      { type: 'STATIC', params: [] },
      { type: 'DYNAMIC', params: [{ name: 'id', value: '1' }] },
    ]);
    expect(routeMatcher('/users/:id', '/users/abc')).toEqual([
      { type: 'STATIC', params: [] },
      { type: 'DYNAMIC', params: [{ name: 'id', value: 'abc' }] },
    ]);
  });

  test('mix static & dynamic segments', () => {
    expect(
      routeMatcher('/users/:username/posts/:postId', '/users/xxx/posts/1')
    ).toEqual([
      { type: 'STATIC', params: [] },
      { type: 'DYNAMIC', params: [{ name: 'username', value: 'xxx' }] },
      { type: 'STATIC', params: [] },
      { type: 'DYNAMIC', params: [{ name: 'postId', value: '1' }] },
    ]);
  });

  test('dynamic named with custom regex segment', () => {
    expect(routeMatcher('/icon-:size(\\d+).png', '/icon-a.png')).toBe(null);
    expect(routeMatcher('/icon-:size(\\d+).png', '/icon-123.png')).toEqual([
      { type: 'DYNAMIC', params: [{ name: 'size', value: '123' }] },
    ]);
    expect(routeMatcher('/:orderId(\\d+)', '/250')).toEqual([
      { type: 'DYNAMIC', params: [{ name: 'orderId', value: '250' }] },
    ]);
    expect(routeMatcher('/:path(abc|xyz)', '/abc')).toEqual([
      { type: 'DYNAMIC', params: [{ name: 'path', value: 'abc' }] },
    ]);
    expect(routeMatcher('/:path(abc|xyz)', '/xyz')).toEqual([
      { type: 'DYNAMIC', params: [{ name: 'path', value: 'xyz' }] },
    ]);
  });

  test('dynamic unnamed with custom regex segments', () => {
    expect(routeMatcher('/(user|u)', '/user')).toEqual([
      { type: 'DYNAMIC', params: [] },
    ]);
    expect(routeMatcher('/(user|u)', '/u')).toEqual([
      { type: 'DYNAMIC', params: [] },
    ]);
    expect(routeMatcher('/(user|u)', '/users')).toBe(null);
    expect(routeMatcher('/(user|u)-(old|new)', '/user-old')).toEqual([
      { type: 'DYNAMIC', params: [] },
    ]);
  });

  test('modifier: +', () => {
    expect(routeMatcher('/:chapters+', '/')).toBe(null);
    expect(routeMatcher('/:chapters+', '/one')).toEqual([
      { type: 'DYNAMIC', params: [{ name: 'chapters', value: 'one' }] },
    ]);
    expect(routeMatcher('/:chapters+', '/one/two')).toEqual([
      { type: 'DYNAMIC', params: [{ name: 'chapters', value: 'one/two' }] },
    ]);
    expect(routeMatcher('/:chapters+', '/one/two/three')).toEqual([
      {
        type: 'DYNAMIC',
        params: [{ name: 'chapters', value: 'one/two/three' }],
      },
    ]);
  });

  test('modifier: *', () => {
    expect(routeMatcher('/:foo*', '/')).toEqual([
      {
        type: 'DYNAMIC',
        params: [{ name: 'foo', value: undefined }],
      },
    ]);
    expect(routeMatcher('/:foo*', '/1')).toEqual([
      {
        type: 'DYNAMIC',
        params: [{ name: 'foo', value: '1' }],
      },
    ]);
    expect(routeMatcher('/:foo*', '/one/two')).toEqual([
      {
        type: 'DYNAMIC',
        params: [{ name: 'foo', value: 'one/two' }],
      },
    ]);
    expect(routeMatcher('/:foo*', '/one/two/three')).toEqual([
      {
        type: 'DYNAMIC',
        params: [{ name: 'foo', value: 'one/two/three' }],
      },
    ]);
    expect(routeMatcher('/:foo*', '/one/two/three/')).toEqual(null);
  });

  test('optional paramas', () => {
    expect(routeMatcher('/:foo/:bar?', '/foo')).toBe(null);
    expect(routeMatcher('/:foo/:bar?', '/foo/')).toEqual([
      {
        type: 'DYNAMIC',
        params: [{ name: 'foo', value: 'foo' }],
      },
      {
        type: 'DYNAMIC',
        params: [{ name: 'bar', value: undefined }],
      },
    ]);
    expect(routeMatcher('/:foo/:bar?', '/foo/bar')).toEqual([
      {
        type: 'DYNAMIC',
        params: [{ name: 'foo', value: 'foo' }],
      },
      {
        type: 'DYNAMIC',
        params: [{ name: 'bar', value: 'bar' }],
      },
    ]);
    expect(routeMatcher('/:foo/:bar?', '/foo/bar/')).toBe(null);
    expect(routeMatcher('/:foo/:bar?', '/foo/bar/baz')).toBe(null);
  });

  test('dynamic named in between static segments', () => {
    expect(routeMatcher('/teams/:teamId/edit', '/teams/team1/edit')).toEqual([
      {
        type: 'STATIC',
        params: [],
      },
      {
        type: 'DYNAMIC',
        params: [{ name: 'teamId', value: 'team1' }],
      },
      {
        type: 'STATIC',
        params: [],
      },
    ]);
  });

  test('invalid modifier', () => {
    expect(() => routeMatcher('/*', '/')).toThrow();
    expect(() => routeMatcher('/*', '/a')).toThrow();
    expect(() => routeMatcher('/+', '/a')).toThrow();
    expect(() => routeMatcher('/?', '/a')).toThrow();
  });

  test('no capturing groups inside custom regexp', () => {
    expect(() => routeMatcher('/((.))', '/')).toThrow();
    expect(() => routeMatcher('/((?:.))', '/')).not.toThrow();
  });

  test('Random', () => {
    expect(routeMatcher('/icon-:size(\\d+).png', '/icon-24.png')).toEqual([
      {
        type: 'DYNAMIC',
        params: [{ name: 'size', value: '24' }],
      },
    ]);
    expect(routeMatcher('/:foo/(.*)', '/test/route')).toEqual([
      {
        type: 'DYNAMIC',
        params: [{ name: 'foo', value: 'test' }],
      },
      {
        type: 'DYNAMIC',
        params: [],
      },
    ]);
    expect(
      routeMatcher('/(apple-)?icon-:res(\\d+).png', '/apple-icon-240.png')
    ).toEqual([
      {
        type: 'DYNAMIC',
        params: [{ name: 'res', value: '240' }],
      },
    ]);
    expect(
      routeMatcher('/(apple-)?icon-:res(\\d+).png', '/icon-240.png')
    ).toEqual([
      {
        type: 'DYNAMIC',
        params: [{ name: 'res', value: '240' }],
      },
    ]);
    expect(
      routeMatcher('/:remote([\\w-.]+)/:user([\\w-]+)', '/endpoint/user-name')
    ).toEqual([
      {
        type: 'DYNAMIC',
        params: [
          {
            name: 'remote',
            value: 'endpoint',
          },
        ],
      },
      {
        type: 'DYNAMIC',
        params: [
          {
            name: 'user',
            value: 'user-name',
          },
        ],
      },
    ]);
    expect(routeMatcher('/:foo+baz', '/foobaz')).toEqual([
      {
        type: 'DYNAMIC',
        params: [
          {
            name: 'foo',
            value: 'foo',
          },
        ],
      },
    ]);
    expect(
      routeMatcher('/:postType(video|audio|text)(\\+.+)?', '/video')
    ).toEqual([
      {
        type: 'DYNAMIC',
        params: [
          {
            name: 'postType',
            value: 'video',
          },
        ],
      },
    ]);
    expect(routeMatcher('/user(s)?/:user', '/user/abc')).toEqual([
      {
        type: 'DYNAMIC',
        params: [],
      },
      {
        type: 'DYNAMIC',
        params: [
          {
            name: 'user',
            value: 'abc',
          },
        ],
      },
    ]);
    expect(routeMatcher('/user(s)?/:user', '/users/abc')).toEqual([
      {
        type: 'DYNAMIC',
        params: [],
      },
      {
        type: 'DYNAMIC',
        params: [
          {
            name: 'user',
            value: 'abc',
          },
        ],
      },
    ]);
  });
});
