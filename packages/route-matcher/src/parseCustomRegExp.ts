export default function parseCustomRegExp(str: string) {
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
