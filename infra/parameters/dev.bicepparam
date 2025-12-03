// =============================================================================
// Development Environment Parameters
// =============================================================================
using '../bicep/main.bicep'

param environment = 'dev'
param projectName = 'whatssummarize'
param location = 'eastus'

// Enable all services for development
param enableOpenAI = true
param enableCosmosDB = true
param enableRedis = true
param enableContainerApps = true
param enableStaticWebApps = true

// OpenAI deployments with lower capacity for dev
param openAIDeployments = [
  {
    name: 'gpt-4'
    model: 'gpt-4'
    version: '0613'
    capacity: 5
  }
  {
    name: 'gpt-35-turbo'
    model: 'gpt-35-turbo'
    version: '0613'
    capacity: 10
  }
]

param adminEmail = ''

param tags = {
  project: 'whatssummarize'
  environment: 'dev'
  managedBy: 'bicep'
  costCenter: 'development'
}
