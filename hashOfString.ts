/*
  From: https://github.com/mstdokumaci/string-hash-64/blob/master/index.js
  Credits: Mustafa Dokumacı
  License: MIT
*/

export function hash(str: string) {
  let i = str.length;
  let hash1 = 5381;
  let hash2 = 52711;

  while (i--) {
    const char = str.charCodeAt(i);
    hash1 = (hash1 * 33) ^ char;
    hash2 = (hash2 * 33) ^ char;
  }

  const num = (hash1 >>> 0) * 4096 + (hash2 >>> 0);
  return new Number(num).toString(36);
}
