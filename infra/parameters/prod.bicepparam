// =============================================================================
// Production Environment Parameters
// =============================================================================
using '../bicep/main.bicep'

param environment = 'prod'
param projectName = 'whatssummarize'
param location = 'eastus'

// Enable all services for production
param enableOpenAI = true
param enableCosmosDB = true
param enableRedis = true
param enableContainerApps = true
param enableStaticWebApps = true

// OpenAI deployments with higher capacity for production
param openAIDeployments = [
  {
    name: 'gpt-4'
    model: 'gpt-4'
    version: '0613'
    capacity: 20
  }
  {
    name: 'gpt-35-turbo'
    model: 'gpt-35-turbo'
    version: '0613'
    capacity: 60
  }
]

param adminEmail = 'admin@whatssummarize.com'

param tags = {
  project: 'whatssummarize'
  environment: 'prod'
  managedBy: 'bicep'
  costCenter: 'production'
  criticalityLevel: 'high'
}
