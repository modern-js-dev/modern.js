export const clearConsole = () => {
  if (process.stdout.isTTY && !process.env.DEBUG) {
    process.stdout.write('\x1B[H\x1B[2J');
  }
};
