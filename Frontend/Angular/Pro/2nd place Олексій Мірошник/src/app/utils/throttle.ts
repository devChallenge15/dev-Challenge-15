export const throttle = (func: (...args: any[]) => any, limit: number): () => void => {
  let lastFunc: number;
  let lastRan: number;
  return (...args: any[]): void => {
    if (!lastRan) {
      func(args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() =>  {
        if ((Date.now() - lastRan) >= limit) {
          func(args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
};
