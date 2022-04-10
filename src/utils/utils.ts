const waitForElement = (
  selector: string,
  delay = 50,
  tries = 250,
): Promise<Element> => {
  return new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      const element = document.querySelector(selector);
      if (element) {
        clearInterval(interval);
        resolve(element);
      } else if (tries === 0) {
        clearInterval(interval);
        reject(null);
      }
      tries--;
    }, delay);
  });
};

const utils = {
    waitForElement,
}

export default utils;