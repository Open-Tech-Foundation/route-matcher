import { routeMatcher } from '../src';

describe('routeMatcher', () => {
  test('empty route', () => {
    expect(routeMatcher('', '')).toBe(null);
  });
  test('slash route with empty path', () => {
    expect(routeMatcher('/', '')).toBe(null);
  });
  test('slash route with slash path', () => {
    expect(routeMatcher('/', '/')).toEqual([
      { name: '', type: 'EXACT', value: '/' },
    ]);
  });
  test('single static segment path', () => {
    expect(routeMatcher('/users', '/')).toBe(null);
    expect(routeMatcher('/users', '/u')).toBe(null);
    expect(routeMatcher('/users', '/user')).toBe(null);
    expect(routeMatcher('/users', '/users')).toEqual([
      { name: '', type: 'EXACT', value: '/users' },
    ]);
    expect(routeMatcher('/users', '/Users')).toEqual([
      { name: '', type: 'EXACT', value: '/Users' },
    ]);
  });
  test('two static segments path', () => {
    expect(routeMatcher('/users/new', '/users/new')).toEqual([
      { name: '', type: 'EXACT', value: '/users/new' },
    ]);
  });
  test('multiple static segments path', () => {
    expect(
      routeMatcher('/docs/tutorials/intro', '/docs/tutorials/intro')
    ).toEqual([{ name: '', type: 'EXACT', value: '/docs/tutorials/intro' }]);
  });
  test('single dynamic segment path', () => {
    expect(routeMatcher('/:foo', '/')).toBe(null);
    expect(routeMatcher('/:foo', '/a')).toEqual([
      { name: 'foo', type: 'DYNAMIC_NAMED', value: 'a' },
    ]);
    expect(routeMatcher('/:foo', '/bar')).toEqual([
      { name: 'foo', type: 'DYNAMIC_NAMED', value: 'bar' },
    ]);
    expect(routeMatcher('/:foo', '/bar-2')).toEqual([
      { name: 'foo', type: 'DYNAMIC_NAMED', value: 'bar-2' },
    ]);
    expect(routeMatcher('/:foo', '/a/')).toBe(null);
    expect(routeMatcher('/:foo', '/a/b')).toBe(null);
  });
  test('two dynamic segments path', () => {
    expect(routeMatcher('/:foo/:bar', '/')).toBe(null);
    expect(routeMatcher('/:foo/:bar', '/a')).toBe(null);
    expect(routeMatcher('/:foo/:bar', '/a/')).toBe(null);
    expect(routeMatcher('/:foo/:bar', '/a/b')).toEqual([
      { name: 'foo', type: 'DYNAMIC_NAMED', value: 'a' },
      { name: 'bar', type: 'DYNAMIC_NAMED', value: 'b' },
    ]);
    expect(routeMatcher('/:foo/:bar', '/a/b/')).toBe(null);
    expect(routeMatcher('/:foo/:bar', '/a/b/c')).toBe(null);
  });
  test('multiple dynamic segments path', () => {
    expect(routeMatcher('/:foo/:bar/:baz', '/foo')).toBe(null);
    expect(routeMatcher('/:foo/:bar/:baz', '/foo/bar')).toBe(null);
    expect(routeMatcher('/:foo/:bar/:baz', '/docs/tutorials/intro')).toEqual([
      { name: 'foo', type: 'DYNAMIC_NAMED', value: 'docs' },
      { name: 'bar', type: 'DYNAMIC_NAMED', value: 'tutorials' },
      { name: 'baz', type: 'DYNAMIC_NAMED', value: 'intro' },
    ]);
  });
  test('one static & one dynamic segments path', () => {
    expect(routeMatcher('/users/:id', '/users/1')).toEqual([
      { name: '', type: 'STATIC', value: 'users' },
      { name: 'id', type: 'DYNAMIC_NAMED', value: '1' },
    ]);
    expect(routeMatcher('/users/:id', '/users/abc')).toEqual([
      { name: '', type: 'STATIC', value: 'users' },
      { name: 'id', type: 'DYNAMIC_NAMED', value: 'abc' },
    ]);
  });
  test('mix static & dynamic segments', () => {
    expect(
      routeMatcher('/users/:username/posts/:postId', '/users/xxx/posts/1')
    ).toEqual([
      { name: '', type: 'STATIC', value: 'users' },
      { name: 'username', type: 'DYNAMIC_NAMED', value: 'xxx' },
      { name: '', type: 'STATIC', value: 'posts' },
      { name: 'postId', type: 'DYNAMIC_NAMED', value: '1' },
    ]);
  });
  test('dynamic named with custom regex segment', () => {
    expect(routeMatcher('/icon-:size(\\d+).png', '/icon-a.png')).toBe(null);
    expect(routeMatcher('/icon-:size(\\d+).png', '/icon-123.png')).toEqual([
      { name: 'size', type: 'DYNAMIC_NAMED', value: '123' },
    ]);
    expect(routeMatcher('/:orderId(\\d+)', '/250')).toEqual([
      { name: 'orderId', type: 'DYNAMIC_NAMED', value: '250' },
    ]);
    expect(routeMatcher('/:path(abc|xyz)', '/abc')).toEqual([
      { name: 'path', type: 'DYNAMIC_NAMED', value: 'abc' },
    ]);
    expect(routeMatcher('/:path(abc|xyz)', '/xyz')).toEqual([
      { name: 'path', type: 'DYNAMIC_NAMED', value: 'xyz' },
    ]);
  });
  test.only('dynamic unnamed with custom regex segments', () => {
    expect(routeMatcher('/(user|u)', '/user')).toEqual([
      { name: '', type: 'DYNAMIC_UNNAMED', value: 'user' },
    ]);
    expect(routeMatcher('/(user|u)', '/u')).toEqual([
      { name: '', type: 'DYNAMIC_UNNAMED', value: 'u' },
    ]);
    expect(routeMatcher('/(user|u)', '/users')).toBe(null);
    expect(routeMatcher('/(user|u)-(old|new)', '/user-old')).toEqual([
      { name: '', type: 'DYNAMIC_UNNAMED', value: 'user-old' },
    ]);
  });
  test('modifier: +', () => {
    expect(routeMatcher('/:chapters+', '/')).toBe(null);
    expect(routeMatcher('/:chapters+', '/one')).toEqual([
      { name: 'chapters', type: 'DYNAMIC_NAMED', value: 'one' },
    ]);
    expect(routeMatcher('/:chapters+', '/one/two')).toEqual([
      { name: 'chapters', type: 'DYNAMIC_NAMED', value: 'one/two' },
    ]);
    expect(routeMatcher('/:chapters+', '/one/two/three')).toEqual([
      { name: 'chapters', type: 'DYNAMIC_NAMED', value: 'one/two/three' },
    ]);
  });
  test('modifier: *', () => {
    expect(routeMatcher('/:foo*', '/')).toEqual([
      { name: 'foo', type: 'DYNAMIC_NAMED', value: '/' },
    ]);
    expect(routeMatcher('/:foo*', '/1')).toEqual([
      { name: 'foo', type: 'DYNAMIC_NAMED', value: '/1' },
    ]);
    expect(routeMatcher('/:foo*', '/one/two')).toEqual([
      { name: 'foo', type: 'DYNAMIC_NAMED', value: '/one/two' },
    ]);
    expect(routeMatcher('/:foo*', '/one/two/three')).toEqual([
      { name: 'foo', type: 'DYNAMIC_NAMED', value: '/one/two/three' },
    ]);
    expect(routeMatcher('/:foo*', '/one/two/three/')).toEqual([
      { name: 'foo', type: 'DYNAMIC_NAMED', value: '/one/two/three/' },
    ]);
  });
  test('optional paramas', () => {
    expect(routeMatcher('/:foo/:bar?', '/foo')).toBe(null);
    expect(routeMatcher('/:foo/:bar?', '/foo/')).toEqual([
      { name: 'foo', type: 'DYNAMIC_NAMED', value: 'foo' },
      { name: 'bar', type: 'DYNAMIC_NAMED', value: undefined },
    ]);
    expect(routeMatcher('/:foo/:bar?', '/foo/bar')).toEqual([
      { name: 'foo', type: 'DYNAMIC_NAMED', value: 'foo' },
      { name: 'bar', type: 'DYNAMIC_NAMED', value: 'bar' },
    ]);
    expect(routeMatcher('/:foo/:bar?', '/foo/bar/')).toBe(null);
    expect(routeMatcher('/:foo/:bar?', '/foo/bar/baz')).toBe(null);
  });
  test('dynamic named in between static segments', () => {
    expect(routeMatcher('/teams/:teamId/edit', '/teams/team1/edit')).toEqual([
      { name: '', type: 'STATIC', value: 'teams' },
      { name: 'teamId', type: 'DYNAMIC_NAMED', value: 'team1' },
      { name: '', type: 'STATIC', value: 'edit' },
    ]);
  });
  test('star segments', () => {
    expect(() => routeMatcher('/*', '/')).toThrow();
    expect(() => routeMatcher('/*', '/a')).toThrow();
  });
});
