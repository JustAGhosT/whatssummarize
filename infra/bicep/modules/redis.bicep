// =============================================================================
// Azure Redis Cache Module
// =============================================================================

@description('Name of the Redis Cache')
param name string

@description('Azure region')
param location string

@description('Resource tags')
param tags object

@description('Redis SKU')
@allowed(['Basic', 'Standard', 'Premium'])
param sku string = 'Basic'

@description('Redis family')
@allowed(['C', 'P'])
param family string = 'C'

@description('Redis capacity (0-6 for C family, 1-5 for P family)')
@minValue(0)
@maxValue(6)
param capacity int = 0

@description('Key Vault name for storing secrets')
param keyVaultName string = ''

@description('Enable non-SSL port (not recommended)')
param enableNonSslPort bool = false

@description('Minimum TLS version')
@allowed(['1.0', '1.1', '1.2'])
param minimumTlsVersion string = '1.2'

// =============================================================================
// Resources
// =============================================================================

resource redis 'Microsoft.Cache/redis@2023-08-01' = {
  name: name
  location: location
  tags: tags
  properties: {
    sku: {
      name: sku
      family: family
      capacity: capacity
    }
    enableNonSslPort: enableNonSslPort
    minimumTlsVersion: minimumTlsVersion
    publicNetworkAccess: 'Enabled'
    redisConfiguration: {
      'maxmemory-policy': 'volatile-lru'
    }
  }
}

// Store connection info in Key Vault
resource keyVault 'Microsoft.KeyVault/vaults@2023-07-01' existing = if (!empty(keyVaultName)) {
  name: keyVaultName
}

resource redisPasswordSecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = if (!empty(keyVaultName)) {
  parent: keyVault
  name: 'redis-password'
  properties: {
    value: redis.listKeys().primaryKey
  }
}

resource redisConnectionStringSecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = if (!empty(keyVaultName)) {
  parent: keyVault
  name: 'redis-connection-string'
  properties: {
    value: '${redis.properties.hostName}:${redis.properties.sslPort},password=${redis.listKeys().primaryKey},ssl=True,abortConnect=False'
  }
}

// =============================================================================
// Outputs
// =============================================================================

output id string = redis.id
output name string = redis.name
output hostname string = redis.properties.hostName
output port int = redis.properties.sslPort
