export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            WhatsApp Conversation Summarizer
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Transform your chat conversations into meaningful summaries with AI-powered insights
          </p>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <div className="text-3xl mb-4">💬</div>
              <h3 className="text-lg font-semibold mb-2">Multi-Platform Support</h3>
              <p className="text-gray-600 dark:text-gray-400">Analyze conversations from WhatsApp and other messaging platforms</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <div className="text-3xl mb-4">🤖</div>
              <h3 className="text-lg font-semibold mb-2">AI-Powered Summaries</h3>
              <p className="text-gray-600 dark:text-gray-400">Get intelligent summaries of your conversations using advanced AI</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <div className="text-3xl mb-4">📊</div>
              <h3 className="text-lg font-semibold mb-2">Smart Analytics</h3>
              <p className="text-gray-600 dark:text-gray-400">Gain insights into your communication patterns and trends</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}