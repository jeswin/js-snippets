/* eslint-disable */
export function debounce<T extends Function>(cb: T, wait = 20) : any {
  let h: any = 0;
  const callable = (...args: any) => {
    clearTimeout(h);
    h = setTimeout(() => cb(...args), wait);
  };
  return (callable as any) as T;
}

