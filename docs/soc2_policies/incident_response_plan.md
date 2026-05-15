# Incident Response Plan (SOC 2)
**Company**: BrandFlow
**Effective Date**: 2026-05-15
**Version**: 1.0

## 1. Objective
To establish a standardized process for identifying, managing, and mitigating security incidents, minimizing impact, and fulfilling compliance reporting obligations.

## 2. Roles & Responsibilities
- **Incident Response Team (IRT)**: Responsible for investigating, containing, and resolving security incidents.
- **CISO / Security Lead**: Coordinates communication with stakeholders and external auditors (e.g., Vanta/Drata).

## 3. Incident Phases
1. **Preparation**: Maintaining logs, automated monitoring (e.g., via `access_audit.py`), and ensuring endpoint security.
2. **Identification**: Detecting anomalies via Vanta/Drata alerts or internal audits.
3. **Containment**: Isolating affected databases or locking compromised accounts.
4. **Eradication**: Removing the threat or fixing the vulnerability.
5. **Recovery**: Restoring services and verifying data integrity.
6. **Lessons Learned**: Conducting a post-mortem review and updating policies.

## 4. Reporting
All employees must report suspected security incidents to `security@brandflow.ai` within 24 hours of discovery.

## 5. Acknowledgment
By signing this document, the employee acknowledges that they have read, understood, and agreed to comply with this policy.

---
**Signed by:**
[x] Nguyen Hai Yen (Employee) - *Electronically Signed: 2026-05-15*
[x] Admin (CISO) - *Electronically Signed: 2026-05-15*
