# Information Security Policy (SOC 2)
**Company**: BrandFlow
**Effective Date**: 2026-05-15
**Version**: 1.0

## 1. Purpose
The purpose of this Information Security Policy is to define the security requirements for protecting BrandFlow's information systems and data against unauthorized access, disclosure, or destruction.

## 2. Scope
This policy applies to all employees, contractors, and third-party vendors accessing BrandFlow's systems.

## 3. Data Protection & Encryption
- **Data at Rest**: All customer data and system backups must be encrypted at rest using AES-256 or equivalent encryption standard. Database connections must enforce SSL/TLS (sslmode=require).
- **Data in Transit**: All data transmitted over public networks must be encrypted using TLS 1.2 or higher.

## 4. Access Control & Authentication
- **Multi-Factor Authentication (MFA)**: MFA/2FA is mandatory for all user accounts, administrative access, and third-party integrations.
- **Least Privilege**: Access to data is granted strictly on a need-to-know basis.

## 5. Device Management
- All employee laptops must have full-disk encryption (BitLocker/FileVault) enabled.
- Automatic screen locks must be set to 15 minutes of inactivity.

## 6. Acknowledgment
By signing this document, the employee acknowledges that they have read, understood, and agreed to comply with this policy.

---
**Signed by:**
[x] Nguyen Hai Yen (Employee) - *Electronically Signed: 2026-05-15*
[x] Admin (CISO) - *Electronically Signed: 2026-05-15*
