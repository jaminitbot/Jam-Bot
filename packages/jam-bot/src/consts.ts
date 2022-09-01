// Cron jobs
export const TWITCH_NOTIFICATIONS_POLLING_DELAY = 5; // How often to poll twitch API for live notifications
export const MODLOG_TASKS_POLLING_DELAY = 5; // How often to check modlog tasks from the database
export const PROMETHEUS_PING_SAVE_DURATION = 5; // How often to save the client's websocket ping for use with prometheus

export const GITHUB_CHANGELOG_LINK =
  "https://raw.githubusercontent.com/jaminitbot/Jam-Bot/main/packages/jam-bot/changelog.json"; // User friendly changelog

// Twitch
const TWITCH_BASE_HOST = "twitch.tv";
export const TWITCH_BASE_URL = `https://${TWITCH_BASE_HOST}`;
export const TWITCH_BASE_API_URL = `https://api.${TWITCH_BASE_HOST}/helix`;
export const TWITCH_BASE_CDN_URL = "https://static-cdn.jtvnw.net";

export const SNIPE_DURATION = 20; // How long to let messages be sniped for

export const GLOBAL_RATELIMIT_DURATION = 0.5; // How often a command without a ratelimit can be run
