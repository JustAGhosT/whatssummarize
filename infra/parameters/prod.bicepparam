// =============================================================================
// Production Environment Parameters
// =============================================================================
using '../bicep/main.bicep'

param environment = 'prod'
param projectName = 'whatssummarize'
param location = 'eastus'

// Enable services for production
// Note: OpenAI disabled - configure Azure AI Foundry separately via Azure Portal
param enableOpenAI = false
param enableCosmosDB = true
param enableRedis = true
param enableContainerApps = true
param enableStaticWebApps = true

// OpenAI deployments (only used if enableOpenAI = true)
// Configure Azure AI Foundry manually and set AZURE_OPENAI_* env vars
param openAIDeployments = []

param adminEmail = 'admin@whatssummarize.com'

param tags = {
  project: 'whatssummarize'
  environment: 'prod'
  managedBy: 'bicep'
  costCenter: 'production'
  criticalityLevel: 'high'
}
