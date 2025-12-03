// =============================================================================
// Azure Static Web Apps Module
// =============================================================================

@description('Name of the Static Web App')
param name string

@description('Azure region')
param location string

@description('Resource tags')
param tags object

@description('API backend URL')
param apiUrl string = ''

@description('SKU name')
@allowed(['Free', 'Standard'])
param sku string = 'Free'

@description('GitHub repository URL (for linked deployment)')
param repositoryUrl string = ''

@description('GitHub branch')
param branch string = 'main'

@description('App location (path to app source)')
param appLocation string = 'apps/web'

@description('API location (path to API source, if using Azure Functions)')
param apiLocation string = ''

@description('Output location (build output path)')
param outputLocation string = '.next'

// =============================================================================
// Resources
// =============================================================================

resource staticWebApp 'Microsoft.Web/staticSites@2022-09-01' = {
  name: name
  location: location
  tags: tags
  sku: {
    name: sku
    tier: sku
  }
  properties: {
    repositoryUrl: !empty(repositoryUrl) ? repositoryUrl : null
    branch: !empty(repositoryUrl) ? branch : null
    buildProperties: !empty(repositoryUrl) ? {
      appLocation: appLocation
      apiLocation: apiLocation
      outputLocation: outputLocation
    } : null
    stagingEnvironmentPolicy: 'Enabled'
    allowConfigFileUpdates: true
    enterpriseGradeCdnStatus: 'Disabled'
  }
}

// Configure app settings
resource staticWebAppSettings 'Microsoft.Web/staticSites/config@2022-09-01' = {
  parent: staticWebApp
  name: 'appsettings'
  properties: {
    NEXT_PUBLIC_API_URL: apiUrl
  }
}

// =============================================================================
// Outputs
// =============================================================================

output id string = staticWebApp.id
output name string = staticWebApp.name
output url string = 'https://${staticWebApp.properties.defaultHostname}'
output deploymentToken string = staticWebApp.listSecrets().properties.apiKey
