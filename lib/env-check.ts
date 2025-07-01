export function checkEnvironmentSetup() {
  const requiredEnvVars = {
    GOOGLE_GENERATIVE_AI_API_KEY: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  }

  const missing = Object.entries(requiredEnvVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key)

  return {
    isConfigured: missing.length === 0,
    missingVars: missing,
  }
}

export function getSetupInstructions() {
  return {
    steps: [
      {
        title: "Get Google AI API Key",
        description: "Visit https://aistudio.google.com/app/apikey to create your free API key",
        link: "https://aistudio.google.com/app/apikey",
      },
      {
        title: "Create .env.local file",
        description: "Create a .env.local file in your project root directory",
      },
      {
        title: "Add API key",
        description: "Add GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here to the file",
      },
      {
        title: "Restart server",
        description: "Restart your development server to load the new environment variables",
      },
    ],
  }
}
