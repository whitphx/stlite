import { useSearchParams } from "react-router-dom";

export const URL_SEARCH_KEY_SAMPLE_APP_ID = "sampleAppId";

export function useSampleAppId(): string | null {
  const [searchParams] = useSearchParams();
  return searchParams.get(URL_SEARCH_KEY_SAMPLE_APP_ID);
}
