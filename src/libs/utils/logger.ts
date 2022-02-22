export type Logger = {
  info: (message: any, ...rest: any[]) => void;
  error: (error: Error, message?: any) => void;
};

export const createLogger = (label: string) => ({
  info: (...messages: string[]) => console.info(`[${label}] info:`, ...messages),
  error: (...errors: Error[]) => console.error(
    `[${label}] error:`,
    ...(errors.map((e) => e.toString())),
  ),
});
