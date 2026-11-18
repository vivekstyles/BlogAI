import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { PostHogProvider } from '@posthog/react';

const posthogOptions = {
  api_host: import.meta.env.VITE_POSTHOG_HOST,
  defaults: '2026-08-30',
};

export function Providers({ children }) {
  return (
    <PostHogProvider
      apiKey={import.meta.env.VITE_POSTHOG_PROJECT_TOKEN}
      options={posthogOptions}
    >
      <BrowserRouter>{children}</BrowserRouter>
    </PostHogProvider>
  );
}

export default Providers;
