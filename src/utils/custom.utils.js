export const randomIntegerGenerator = (min, max) => {
  const random = min + Math.random() * (max + 1 - min);
  return Math.floor(random);
};

export function getProperty(obj, key) {
  return obj[key];
}

export function findElement(elements, cb) {
  if(!elements) return [];
  return elements.find(cb);
}

export function findCb(itemForComparison, field) {
  return (item) => item[field] === itemForComparison[field];
}
export const debounce = (delay, fn) => {
  let inDebounce = null;
  return () => {
    clearTimeout(inDebounce);
    inDebounce = setTimeout(() => fn(), delay);
  };
};
