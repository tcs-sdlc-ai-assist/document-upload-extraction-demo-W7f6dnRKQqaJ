function normalizeLineBreaks(text: string): string {
  return text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

function removeExtraWhitespace(text: string): string {
  return text
    .split('\n')
    .map((line) => line.replace(/[ \t]+/g, ' ').trim())
    .join('\n');
}

function removeExtraBlankLines(text: string): string {
  return text.replace(/\n{3,}/g, '\n\n');
}

function clean(text: string): string {
  if (!text) return '';

  let result = text;

  result = normalizeLineBreaks(result);
  result = removeExtraWhitespace(result);
  result = removeExtraBlankLines(result);
  result = result.trim();

  return result;
}

export { clean, normalizeLineBreaks, removeExtraWhitespace, removeExtraBlankLines };