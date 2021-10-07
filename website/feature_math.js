//#Source https://bit.ly/2neWfJ2

const minN = (arr, n = 1) => [...arr].sort((a, b) => a - b).slice(0, n);

const maxN = (arr, n = 1) => [...arr].sort((a, b) => b - a).slice(0, n);

const meanN = (nums) => nums.reduce((acc, val) => acc + val, 0) / nums.length;

const medianN = arr => {
    const mid = Math.floor(arr.length / 2),
      nums = arr.sort((a, b) => a - b);
    return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
  };

const varN = (arr, usePopulation = false) => {
    const mean = meanN(arr)
    return arr
      .reduce((acc, val) => acc.concat((val - mean) ** 2), [])
      .reduce((acc, val) => acc + val, 0) /
      (arr.length - (usePopulation ? 0 : 1))
  };

const stdN = (arr, usePopulation = false) => {
    const mean = meanN(arr)
    return Math.sqrt(
      arr
        .reduce((acc, val) => acc.concat((val - mean) ** 2), [])
        .reduce((acc, val) => acc + val, 0) /
        (arr.length - (usePopulation ? 0 : 1))
    );
  };