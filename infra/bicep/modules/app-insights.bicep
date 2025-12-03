// =============================================================================
// Azure Application Insights Module
// =============================================================================

@description('Name of the Application Insights resource')
param name string

@description('Azure region')
param location string

@description('Resource tags')
param tags object

@description('Application type')
@allowed(['web', 'other'])
param applicationType string = 'web'

@description('Retention in days')
@minValue(30)
@maxValue(730)
param retentionInDays int = 90

@description('Daily cap in GB (0 = no cap)')
param dailyCapGb int = 0

// =============================================================================
// Resources
// =============================================================================

resource logAnalyticsWorkspace 'Microsoft.OperationalInsights/workspaces@2022-10-01' = {
  name: '${name}-workspace'
  location: location
  tags: tags
  properties: {
    sku: {
      name: 'PerGB2018'
    }
    retentionInDays: retentionInDays
    publicNetworkAccessForIngestion: 'Enabled'
    publicNetworkAccessForQuery: 'Enabled'
  }
}

resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: name
  location: location
  tags: tags
  kind: applicationType
  properties: {
    Application_Type: applicationType
    WorkspaceResourceId: logAnalyticsWorkspace.id
    RetentionInDays: retentionInDays
    IngestionMode: 'LogAnalytics'
    publicNetworkAccessForIngestion: 'Enabled'
    publicNetworkAccessForQuery: 'Enabled'
  }
}

// Set daily cap if specified
resource dailyCap 'Microsoft.Insights/components/CurrentBillingFeatures@2015-05-01' = if (dailyCapGb > 0) {
  name: '${appInsights.name}/CurrentBillingFeatures'
  properties: {
    CurrentBillingFeatures: ['Basic']
    DataVolumeCap: {
      Cap: dailyCapGb
      ResetTime: 0
      StopSendNotificationWhenHitCap: false
      StopSendNotificationWhenHitThreshold: false
      WarningThreshold: 90
    }
  }
}

// =============================================================================
// Outputs
// =============================================================================

output id string = appInsights.id
output name string = appInsights.name
output instrumentationKey string = appInsights.properties.InstrumentationKey
output connectionString string = appInsights.properties.ConnectionString
output workspaceId string = logAnalyticsWorkspace.id
