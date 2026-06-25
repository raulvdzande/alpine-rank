import PostHog from "posthog-js";

let posthogInstance: typeof PostHog | null = null;

export function initPostHog() {
  if (typeof window === "undefined") return null;

  if (!posthogInstance) {
    posthogInstance = PostHog.init(
      process.env.NEXT_PUBLIC_POSTHOG_KEY || "",
      {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.posthog.com",
        loaded: (ph) => {
          if (process.env.NODE_ENV === "development") ph.debug();
        },
      }
    );
  }

  return posthogInstance;
}

export function usePostHog() {
  return initPostHog();
}
