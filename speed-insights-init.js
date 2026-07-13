/**
 * Vercel Speed Insights Initialization
 * This script initializes Speed Insights for the Woodoor website
 */

// Import the inject function from @vercel/speed-insights
import { injectSpeedInsights } from '@vercel/speed-insights';

// Initialize Speed Insights when the DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSpeedInsights);
} else {
  initSpeedInsights();
}

function initSpeedInsights() {
  // Inject Speed Insights with default configuration
  injectSpeedInsights({
    debug: false, // Set to true in development to see events in console
    // sampleRate: 1, // Send 100% of events (default)
  });
}
