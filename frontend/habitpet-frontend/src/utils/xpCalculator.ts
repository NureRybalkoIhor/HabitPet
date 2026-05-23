const countBits = (val: number): number => {
  let count = 0;
  let temp = val;
  while (temp > 0) {
    count += temp & 1;
    temp >>= 1;
  }
  return count;
};

export const calculateXp = (difficulty: number, dayMask: number, currentStreak: number = 0): number => {
  const mask = dayMask === 0 ? 127 : dayMask;
  const activeDays = countBits(mask);
  const kd = difficulty / 5.0;
  const kf = activeDays / 7.0;
  const xpBase = 100 * kd * kf;
  return Math.floor(xpBase * (1 + 0.05 * currentStreak));
};
