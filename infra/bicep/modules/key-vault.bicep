// =============================================================================
// Azure Key Vault Module
// =============================================================================

@description('Name of the Key Vault')
param name string

@description('Azure region')
param location string

@description('Resource tags')
param tags object

@description('Enable soft delete')
param enableSoftDelete bool = true

@description('Enable purge protection')
param enablePurgeProtection bool = false

@description('Soft delete retention in days')
param softDeleteRetentionInDays int = 7

// =============================================================================
// Resources
// =============================================================================

resource keyVault 'Microsoft.KeyVault/vaults@2023-07-01' = {
  name: name
  location: location
  tags: tags
  properties: {
    sku: {
      family: 'A'
      name: 'standard'
    }
    tenantId: subscription().tenantId
    enabledForDeployment: true
    enabledForDiskEncryption: false
    enabledForTemplateDeployment: true
    enableSoftDelete: enableSoftDelete
    enablePurgeProtection: enablePurgeProtection ? true : null
    softDeleteRetentionInDays: enableSoftDelete ? softDeleteRetentionInDays : null
    enableRbacAuthorization: true
    publicNetworkAccess: 'Enabled'
    networkAcls: {
      bypass: 'AzureServices'
      defaultAction: 'Allow'
    }
  }
}

// =============================================================================
// Outputs
// =============================================================================

output id string = keyVault.id
output name string = keyVault.name
output uri string = keyVault.properties.vaultUri
