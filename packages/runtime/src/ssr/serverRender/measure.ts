const getLatency = (hrtime: [number, number]) => {
  const [s, ns] = process.hrtime(hrtime);
  return s * 1e3 + ns / 1e6;
};

export const time = () => {
  const hrtime = process.hrtime();

  return () => {
    return getLatency(hrtime);
  };
};
