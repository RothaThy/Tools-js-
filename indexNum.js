 class actionNum {
    constructor(element, number, index, delay) {
      let num = document.querySelector(element);
      let sum = null;
      let setData = setInterval(() => {
        if (sum >= number) {
          clearInterval(setData);
        }
        sum += index;
        num.innerHTML = `${sum - index}`;
        console.log(num);
      }, delay);
    }
  }

export default actionNum;