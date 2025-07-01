import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ExternalLink, Key, Settings } from "lucide-react"

export function SetupGuide() {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Setup Instructions
        </CardTitle>
        <CardDescription>Follow these steps to configure your Google AI API key</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Key className="h-4 w-4" />
          <AlertDescription>You need a Google Generative AI API key to use this application.</AlertDescription>
        </Alert>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">
              1
            </div>
            <div>
              <p className="font-medium">Get your API key</p>
              <p className="text-sm text-gray-600">
                Visit{" "}
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline inline-flex items-center gap-1"
                >
                  Google AI Studio
                  <ExternalLink className="h-3 w-3" />
                </a>{" "}
                to create your free API key
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">
              2
            </div>
            <div>
              <p className="font-medium">Create environment file</p>
              <p className="text-sm text-gray-600">
                Create a <code className="bg-gray-100 px-1 rounded">.env.local</code> file in your project root
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">
              3
            </div>
            <div>
              <p className="font-medium">Add your API key</p>
              <div className="text-sm text-gray-600">
                <p>
                  Add this line to your <code className="bg-gray-100 px-1 rounded">.env.local</code> file:
                </p>
                <code className="block bg-gray-100 p-2 rounded mt-1 text-xs">
                  GOOGLE_GENERATIVE_AI_API_KEY=your_actual_api_key_here
                </code>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">
              4
            </div>
            <div>
              <p className="font-medium">Restart your development server</p>
              <p className="text-sm text-gray-600">
                Run <code className="bg-gray-100 px-1 rounded">npm run dev</code> or{" "}
                <code className="bg-gray-100 px-1 rounded">yarn dev</code> to restart with the new environment variables
              </p>
            </div>
          </div>
        </div>

        <Alert>
          <AlertDescription className="text-xs">
            <strong>Security Note:</strong> Never commit your <code>.env.local</code> file to version control. It's
            already included in <code>.gitignore</code> by default in Next.js projects.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}
