const shouldSlow = () => window.location.hostname !== "localhost";

export const slowImport = (cb: any): any =>
  shouldSlow() ? new Promise((resolve) => setTimeout(() => resolve(cb()), 1500)) : cb();
