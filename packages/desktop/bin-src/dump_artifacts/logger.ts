import * as winston from "winston";

export const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.splat(),
        winston.format.cli()
      ),
    }),
  ],
});

export function deprecationWarning(message: string) {
  process.emitWarning(message, {
    type: "DeprecationWarning",
  });
}
