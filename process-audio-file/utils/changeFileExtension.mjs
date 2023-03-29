export function changeFileExtension(filename) {
  if (typeof filename !== 'string') {
    throw new TypeError('The argument should be a string.');
  }

  const lastIndex = filename.lastIndexOf('.');
  if (lastIndex === -1) {
    return filename + '.wav';
  }

  return filename.slice(0, lastIndex) + '.wav';
}
