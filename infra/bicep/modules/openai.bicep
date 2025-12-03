// =============================================================================
// Azure OpenAI Service Module
// =============================================================================

@description('Name of the Azure OpenAI resource')
param name string

@description('Azure region (Note: Limited availability)')
param location string

@description('Resource tags')
param tags object

@description('Model deployments configuration')
param deployments array = []

@description('Key Vault name for storing secrets')
param keyVaultName string = ''

@description('SKU name')
@allowed(['S0'])
param sku string = 'S0'

// =============================================================================
// Resources
// =============================================================================

resource openAI 'Microsoft.CognitiveServices/accounts@2023-10-01-preview' = {
  name: name
  location: location
  tags: tags
  kind: 'OpenAI'
  sku: {
    name: sku
  }
  properties: {
    customSubDomainName: name
    publicNetworkAccess: 'Enabled'
    networkAcls: {
      defaultAction: 'Allow'
    }
  }
}

// Deploy models
resource modelDeployments 'Microsoft.CognitiveServices/accounts/deployments@2023-10-01-preview' = [for deployment in deployments: {
  parent: openAI
  name: deployment.name
  sku: {
    name: 'Standard'
    capacity: deployment.capacity
  }
  properties: {
    model: {
      format: 'OpenAI'
      name: deployment.model
      version: deployment.version
    }
    raiPolicyName: 'Microsoft.Default'
  }
}]

// Store API key in Key Vault if provided
resource keyVault 'Microsoft.KeyVault/vaults@2023-07-01' existing = if (!empty(keyVaultName)) {
  name: keyVaultName
}

resource openAIKeySecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = if (!empty(keyVaultName)) {
  parent: keyVault
  name: 'azure-openai-api-key'
  properties: {
    value: openAI.listKeys().key1
  }
}

resource openAIEndpointSecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = if (!empty(keyVaultName)) {
  parent: keyVault
  name: 'azure-openai-endpoint'
  properties: {
    value: openAI.properties.endpoint
  }
}

// =============================================================================
// Outputs
// =============================================================================

output id string = openAI.id
output name string = openAI.name
output endpoint string = openAI.properties.endpoint
output deploymentNames array = [for (deployment, i) in deployments: deployment.name]
