# Runbook Template - Cognitive Mesh

**Document Type:** Runbook  
**Service/Component:** [Service Name]  
**Mesh Layer:** [Foundation/Reasoning/Metacognitive/Agency/Business]  
**Version:** 1.0  
**Last Updated:** [Date]  
**Owner:** [Team/Individual]  
**Reviewers:** [Names]  

## Service Overview

### Purpose
[Brief description of what this service does and its role in the Cognitive Mesh]

### Business Impact
**High Impact:** [What happens if this service fails]  
**Medium Impact:** [Degraded functionality scenarios]  
**Low Impact:** [Minor issues and their effects]  

### Service Level Objectives (SLOs)
| Metric | Target | Measurement |
|--------|--------|-------------|
| Availability | 99.9% | Uptime monitoring |
| Response Time | < 200ms p95 | API latency |
| Error Rate | < 0.1% | Error logs |
| Throughput | 1000 req/sec | Request metrics |

## System Architecture

### Mesh Integration
```
[ASCII diagram or link to architecture diagram showing how this service fits in the mesh]

Foundation Layer
├── Data Storage: [Database/Cache details]
├── Message Queue: [Queue system]
└── Infrastructure: [Cloud/K8s setup]

Service Layer (This Service)
├── API Gateway: [Endpoint details]
├── Core Logic: [Main functionality]
└── Mesh Interface: [How it connects to other services]

Dependent Services
├── Upstream: [Services this depends on]
└── Downstream: [Services that depend on this]
```

### Key Dependencies
| Dependency | Type | Impact if Down | Contact |
|------------|------|----------------|---------|
| [Service A] | Critical | Service fails | [Team/Person] |
| [Service B] | Important | Degraded performance | [Team/Person] |
| [Database] | Critical | Data loss risk | [DBA Team] |

## Monitoring & Alerting

### Key Metrics
| Metric | Dashboard Link | Normal Range | Alert Threshold |
|--------|----------------|--------------|-----------------|
| CPU Usage | [Link] | 10-60% | >80% |
| Memory Usage | [Link] | 40-70% | >85% |
| Response Time | [Link] | 50-150ms | >500ms |
| Error Rate | [Link] | 0-0.05% | >0.1% |

### Alert Channels
- **Critical Alerts**: PagerDuty → On-call engineer
- **Warning Alerts**: Slack #mesh-alerts
- **Info Alerts**: Email digest

### Dashboards
- **Service Overview**: [Grafana/DataDog link]
- **Mesh Topology**: [Mesh monitoring dashboard]
- **Performance**: [APM dashboard]
- **Business Metrics**: [Business dashboard]

## Common Operational Tasks

### Health Checks

#### Basic Health Check
```bash
# Check service health
curl -s https://[service-url]/health | jq

# Expected response:
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "version": "1.2.3",
  "mesh_connectivity": "connected"
}
```

#### Detailed Health Check
```bash
# Comprehensive health check
curl -s https://[service-url]/health/detailed | jq

# Check mesh connectivity
mesh-cli check connectivity [service-name]

# Verify dependencies
kubectl get pods -l app=[service-name]
```

### Service Restart

#### Rolling Restart (Preferred)
```bash
# Kubernetes rolling restart
kubectl rollout restart deployment/[service-name]

# Monitor restart progress
kubectl rollout status deployment/[service-name]

# Verify health after restart
kubectl exec -it [pod-name] -- curl localhost:8080/health
```

#### Emergency Restart
```bash
# If rolling restart fails
kubectl delete pods -l app=[service-name]

# Force restart with downtime
kubectl scale deployment [service-name] --replicas=0
kubectl scale deployment [service-name] --replicas=3
```

### Scaling Operations

#### Horizontal Scaling
```bash
# Scale up for high load
kubectl scale deployment [service-name] --replicas=5

# Auto-scaling configuration
kubectl apply -f hpa-[service-name].yaml

# Check scaling status
kubectl get hpa [service-name]
```

#### Vertical Scaling
```bash
# Update resource limits
kubectl patch deployment [service-name] -p='{"spec":{"template":{"spec":{"containers":[{"name":"[container]","resources":{"limits":{"memory":"2Gi","cpu":"1000m"}}}]}}}}'

# Apply and restart
kubectl rollout restart deployment/[service-name]
```

### Configuration Updates

#### Environment Variables
```bash
# Update config via ConfigMap
kubectl edit configmap [service-name]-config

# Apply configuration
kubectl rollout restart deployment/[service-name]

# Verify config
kubectl exec -it [pod-name] -- env | grep [VARIABLE]
```

#### Mesh Configuration
```bash
# Update mesh settings
mesh-cli config update [service-name] --layer=[layer] --capability=[capability]

# Verify mesh connectivity
mesh-cli status [service-name]
```

## Incident Response Procedures

### Severity Levels

#### P0 - Critical (Service Down)
**Response Time:** Immediate (< 5 minutes)
1. **Acknowledge alert** in PagerDuty
2. **Check service status**: Run health checks above
3. **Review recent changes**: Check deployment history
4. **Escalate immediately** if not resolved in 15 minutes
5. **Communication**: Update status page and notify stakeholders

#### P1 - High (Degraded Performance)
**Response Time:** < 30 minutes
1. **Acknowledge alert** and assign owner
2. **Investigate metrics**: Check dashboards for anomalies
3. **Check dependencies**: Verify upstream services
4. **Apply immediate fixes**: Scale if needed
5. **Monitor closely**: Ensure stability

#### P2 - Medium (Minor Issues)
**Response Time:** < 4 hours
1. **Triage issue** during business hours
2. **Investigate root cause**
3. **Plan resolution**
4. **Implement fix** in next maintenance window

### Escalation Matrix
| Level | Contact | When to Escalate |
|-------|---------|------------------|
| L1 | On-call Engineer | All alerts |
| L2 | Senior Engineer | 15 min for P0, 2 hrs for P1 |
| L3 | Engineering Manager | 1 hr for P0, 4 hrs for P1 |
| L4 | Director/VP | Customer-facing impact > 2 hrs |

## Troubleshooting Guide

### Service Won't Start

#### Check Resource Availability
```bash
# Check node resources
kubectl describe nodes

# Check pod status
kubectl describe pod [pod-name]

# Review logs
kubectl logs [pod-name] --previous
```

#### Common Issues
| Symptom | Likely Cause | Solution |
|---------|--------------|----------|
| ImagePullBackOff | Wrong image tag | Check deployment.yaml image version |
| CrashLoopBackOff | Configuration error | Review application logs and config |
| Pending | Resource constraints | Check node capacity and requests |

### High Response Times

#### Investigation Steps
```bash
# Check current performance
kubectl top pods -l app=[service-name]

# Review application metrics
curl https://[service-url]/metrics | grep response_time

# Check database performance
# [Database-specific monitoring commands]
```

#### Common Causes
- **High CPU/Memory**: Scale horizontally or vertically
- **Database slow**: Check query performance, add indexes
- **Network issues**: Check mesh connectivity
- **Dependency issues**: Verify upstream services

### Memory Leaks

#### Detection
```bash
# Monitor memory trends
kubectl top pods [pod-name]

# Get memory heap dump (if applicable)
kubectl exec -it [pod-name] -- [heap-dump-command]

# Check garbage collection (for JVM/Node.js)
kubectl logs [pod-name] | grep -i "gc\|memory"
```

#### Resolution
1. **Immediate**: Restart affected pods
2. **Short-term**: Increase memory limits
3. **Long-term**: Investigate and fix memory leaks in code

### Mesh Connectivity Issues

#### Diagnosis
```bash
# Check mesh status
mesh-cli status [service-name]

# Test connectivity to other services
mesh-cli ping [target-service]

# Review mesh configuration
mesh-cli config show [service-name]
```

#### Common Fixes
```bash
# Refresh mesh credentials
mesh-cli auth refresh [service-name]

# Reset mesh connection
mesh-cli reconnect [service-name]

# Check mesh gateway health
kubectl get pods -n mesh-system
```

## Maintenance Procedures

### Deployment Process

#### Pre-Deployment Checklist
- [ ] Code reviewed and approved
- [ ] Tests passing in CI/CD
- [ ] Database migrations tested
- [ ] Rollback plan prepared
- [ ] Stakeholders notified

#### Deployment Steps
```bash
# 1. Deploy to staging
kubectl apply -f k8s/staging/ -n staging

# 2. Run integration tests
npm run test:integration:staging

# 3. Deploy to production
kubectl apply -f k8s/production/ -n production

# 4. Monitor deployment
kubectl rollout status deployment/[service-name] -n production

# 5. Verify functionality
curl https://[production-url]/health
```

#### Post-Deployment Verification
- [ ] Health checks passing
- [ ] Key metrics within normal ranges
- [ ] No error spikes in logs
- [ ] Mesh connectivity verified
- [ ] Sample user flows tested

### Database Maintenance

#### Backup Procedures
```bash
# Create database backup
kubectl exec -it [db-pod] -- [backup-command]

# Verify backup integrity
[backup-verification-commands]

# Store backup securely
[cloud-storage-commands]
```

#### Index Maintenance
```bash
# Check index usage
[database-specific-commands]

# Rebuild indexes if needed
[reindex-commands]

# Update statistics
[update-stats-commands]
```

### Security Updates

#### Patching Process
1. **Security scanning**: Run automated security scans
2. **Vulnerability assessment**: Review critical vulnerabilities
3. **Patch testing**: Test patches in staging environment
4. **Production deployment**: Deploy during maintenance window
5. **Verification**: Confirm patches applied successfully

## Disaster Recovery

### Backup Strategy
- **Database**: Daily automated backups with 30-day retention
- **Configuration**: Git-based configuration management
- **Secrets**: Vault-based secret management
- **Application**: Container images in multiple registries

### Recovery Procedures

#### Data Loss Scenario
```bash
# 1. Stop application
kubectl scale deployment [service-name] --replicas=0

# 2. Restore from backup
[database-restore-commands]

# 3. Verify data integrity
[data-verification-commands]

# 4. Restart application
kubectl scale deployment [service-name] --replicas=3
```

#### Complete Service Loss
```bash
# 1. Deploy in alternate region/cluster
kubectl apply -f k8s/production/ --context=[alternate-cluster]

# 2. Update DNS/load balancer
[dns-update-commands]

# 3. Restore data if needed
[data-restore-commands]

# 4. Verify full functionality
[end-to-end-tests]
```

### RTO/RPO Targets
- **Recovery Time Objective (RTO)**: 4 hours
- **Recovery Point Objective (RPO)**: 1 hour
- **Mean Time to Recovery (MTTR)**: 30 minutes

## Contacts & Resources

### On-Call Information
| Role | Primary | Backup | Escalation |
|------|---------|--------|------------|
| Engineering | [Name/PagerDuty] | [Name/PagerDuty] | [Manager] |
| Operations | [Name/PagerDuty] | [Name/PagerDuty] | [SRE Lead] |
| Product | [Name/Phone] | [Name/Phone] | [Product Manager] |

### Important Links
- **Service Dashboard**: [Monitoring URL]
- **Runbook Repository**: [Git repository]
- **Architecture Docs**: [Documentation URL]
- **API Documentation**: [API docs URL]
- **Status Page**: [Public status page]
- **Incident Management**: [Incident tool URL]

### Emergency Contacts
- **Security Team**: security@company.com
- **Infrastructure Team**: infra@company.com
- **Database Team**: dba@company.com
- **Network Operations**: netops@company.com

## Change Log

| Date | Version | Change Description | Author |
|------|---------|-------------------|--------|
| [Date] | 1.0 | Initial runbook creation | [Author] |
| [Date] | 1.1 | Added mesh connectivity procedures | [Author] |
| [Date] | 1.2 | Updated troubleshooting guide | [Author] |

---

**Runbook Template Version:** 1.0  
**Last Reviewed:** [Date]  
**Next Review Due:** [Date + 6 months]