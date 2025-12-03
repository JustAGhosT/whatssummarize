// =============================================================================
// Azure Container Apps Module
// =============================================================================

@description('Name of the Container Apps Environment')
param environmentName string

@description('Name of the API Container App')
param apiAppName string

@description('Azure region')
param location string

@description('Resource tags')
param tags object

@description('Application Insights connection string')
param appInsightsConnectionString string = ''

@description('Key Vault name for secrets')
param keyVaultName string = ''

@description('Cosmos DB endpoint')
param cosmosDbEndpoint string = ''

@description('Redis hostname')
param redisHostname string = ''

@description('Storage account name')
param storageAccountName string = ''

@description('Azure OpenAI endpoint')
param openAIEndpoint string = ''

@description('Container image for API')
param apiImage string = 'mcr.microsoft.com/azuredocs/containerapps-helloworld:latest'

@description('CPU cores for API container')
param apiCpu string = '0.5'

@description('Memory for API container')
param apiMemory string = '1Gi'

@description('Minimum replicas')
param minReplicas int = 0

@description('Maximum replicas')
param maxReplicas int = 3

// =============================================================================
// Resources
// =============================================================================

resource environment 'Microsoft.App/managedEnvironments@2023-05-01' = {
  name: environmentName
  location: location
  tags: tags
  properties: {
    daprAIConnectionString: appInsightsConnectionString
    zoneRedundant: false
    workloadProfiles: [
      {
        name: 'Consumption'
        workloadProfileType: 'Consumption'
      }
    ]
  }
}

resource keyVault 'Microsoft.KeyVault/vaults@2023-07-01' existing = if (!empty(keyVaultName)) {
  name: keyVaultName
}

resource apiApp 'Microsoft.App/containerApps@2023-05-01' = {
  name: apiAppName
  location: location
  tags: tags
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    managedEnvironmentId: environment.id
    workloadProfileName: 'Consumption'
    configuration: {
      activeRevisionsMode: 'Single'
      ingress: {
        external: true
        targetPort: 3001
        transport: 'http'
        corsPolicy: {
          allowedOrigins: ['*']
          allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
          allowedHeaders: ['*']
        }
      }
      secrets: [
        {
          name: 'app-insights-connection-string'
          value: appInsightsConnectionString
        }
      ]
    }
    template: {
      containers: [
        {
          name: 'api'
          image: apiImage
          resources: {
            cpu: json(apiCpu)
            memory: apiMemory
          }
          env: [
            {
              name: 'NODE_ENV'
              value: 'production'
            }
            {
              name: 'PORT'
              value: '3001'
            }
            {
              name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
              secretRef: 'app-insights-connection-string'
            }
            {
              name: 'AZURE_COSMOS_ENDPOINT'
              value: cosmosDbEndpoint
            }
            {
              name: 'AZURE_REDIS_HOSTNAME'
              value: redisHostname
            }
            {
              name: 'AZURE_STORAGE_ACCOUNT_NAME'
              value: storageAccountName
            }
            {
              name: 'AZURE_OPENAI_ENDPOINT'
              value: openAIEndpoint
            }
            {
              name: 'AZURE_KEY_VAULT_NAME'
              value: keyVaultName
            }
          ]
        }
      ]
      scale: {
        minReplicas: minReplicas
        maxReplicas: maxReplicas
        rules: [
          {
            name: 'http-rule'
            http: {
              metadata: {
                concurrentRequests: '100'
              }
            }
          }
        ]
      }
    }
  }
}

// Grant Key Vault access to the Container App
resource keyVaultAccessPolicy 'Microsoft.KeyVault/vaults/accessPolicies@2023-07-01' = if (!empty(keyVaultName)) {
  name: '${keyVaultName}/add'
  properties: {
    accessPolicies: [
      {
        tenantId: subscription().tenantId
        objectId: apiApp.identity.principalId
        permissions: {
          secrets: ['get', 'list']
        }
      }
    ]
  }
}

// =============================================================================
// Outputs
// =============================================================================

output environmentId string = environment.id
output apiAppId string = apiApp.id
output apiUrl string = 'https://${apiApp.properties.configuration.ingress.fqdn}'
output apiPrincipalId string = apiApp.identity.principalId
