// Development configuration
export const DEVELOPMENT_CONFIG = {
  DEFAULT_PORT: "5173",
  LOCALHOST_BASE: "http://localhost",
} as const;

// Production configuration
export const PRODUCTION_CONFIG = {
  SERVICE_WORKER_URL: "http://localhost:5173/index.html",
} as const;

/**
 * Create iframe source URL based on mode and configuration
 * @param isDevelopmentMode - Whether we're in development mode
 * @param developmentPort - The development port (if in development mode)
 * @param productionUrl - The production URL to use (defaults to service worker URL)
 * @returns The appropriate iframe source URL
 */
export const createIframeSrc = (
  isDevelopmentMode: boolean,
  developmentPort?: string,
  productionUrl: string = PRODUCTION_CONFIG.SERVICE_WORKER_URL,
): string => {
  if (isDevelopmentMode && developmentPort) {
    return `${DEVELOPMENT_CONFIG.LOCALHOST_BASE}:${developmentPort}`;
  }

  return productionUrl;
};

/**
 * Get iframe styles for consistent styling
 * @returns Object with iframe styles
 */
export const getIframeStyles = () => ({
  width: "100%",
  height: "100%",
  border: "none",
  margin: 0,
  padding: 0,
});

/**
 * Get container styles for iframe wrapper
 * @returns Object with container styles
 */
export const getIframeContainerStyles = () => ({
  width: "100%",
  height: "100%",
  position: "absolute" as const,
  top: 0,
  left: 0,
});
