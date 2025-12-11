# RPR-VERIFY Copy Guidelines

---
**Version:** 1.0  
**Status:** COMPLETE  
**Last Updated:** Saturday, December 6, 2025, 3:42 PM +08  
**Author:** AI Operations Assistant  
**Approver:** Puvan Sivanasan (Founder)  
**Next Review:** December 13, 2025  
**Classification:** INTERNAL — Operations (Confidential)  
**Source:** Extracted from `RPR-FX-Command-Brand-Playbook-V2.md` and `RPR-VERIFY-OPERATIONS-MASTER.md`
---

## 1. Brand Voice Profile

### Tone Attributes

**Clear & Direct**
- **Definition:** Straightforward communication without jargon or ambiguity
- **Example:** "Your ABN has been verified" (not "We have successfully completed the verification process for your Australian Business Number")

**Confident**
- **Definition:** Assured and authoritative, without being arrogant
- **Example:** "Verified in seconds" (not "We think this might work quickly")

**Helpful**
- **Definition:** Proactive guidance that anticipates user needs
- **Example:** "ABN not found. Check for typos or verify the business is registered." (not "Error: Invalid ABN")

**Professional**
- **Definition:** Appropriate for B2B and financial services contexts, maintaining credibility
- **Example:** "Compliance verification complete" (not "All good, you're set!")

### Personality

RPR-VERIFY speaks as a **trusted technical partner**—knowledgeable, reliable, and efficient. The voice is professional yet approachable, technical yet accessible. We communicate with the authority of a compliance expert while remaining helpful and clear.

**How VERIFY speaks:**
- Uses active voice ("We verify" not "Verification is performed")
- Prefers short, scannable sentences
- Provides context for errors and next steps
- Avoids marketing fluff and unnecessary adjectives
- Uses technical terms correctly and explains when needed

**How VERIFY does NOT speak:**
- Overly casual or conversational
- Vague or ambiguous
- Overly technical without explanation
- Marketing-heavy or sales-oriented
- Apologetic or uncertain

---

## 2. Key Messaging Pillars

### Pillar 1: Reliability & Accuracy
**Core Message:** "Trusted verification you can count on"

RPR-VERIFY is the most reliable business verification service in Australia. Every verification is accurate, audited, and compliant with regulatory standards.

**Supporting Messages:**
- Real-time validation with official data sources
- 99.9% accuracy guarantee
- Full audit trail for compliance
- AUSTRAC and ASIC compliant

### Pillar 2: Speed & Efficiency
**Core Message:** "Verify in seconds, not days"

Business verification should be instant, not a bottleneck. RPR-VERIFY delivers sub-second response times, enabling rapid onboarding and seamless workflows.

**Supporting Messages:**
- Sub-500ms API response times
- Real-time status updates
- Automated workflows reduce manual work
- Instant verification results

### Pillar 3: Security & Compliance
**Core Message:** "Enterprise-grade security, built-in compliance"

Security and compliance aren't optional—they're foundational. RPR-VERIFY provides bank-level security with full regulatory compliance out of the box.

**Supporting Messages:**
- End-to-end encryption (TLS 1.3)
- JWT authentication
- Complete audit logging
- AUSTRAC KYC compliance built-in
- SOC 2 Type II certified (target)

---

## 3. Copy Standards

### Dos

✅ **Do use active voice**
- ✅ "We verify your ABN in real-time"
- ❌ "ABN verification is performed"

✅ **Do be specific and actionable**
- ✅ "ABN 12345678901 verified successfully. Company: ABC Pty Ltd"
- ❌ "Verification complete"

✅ **Do provide context for errors**
- ✅ "ABN not found. This may mean: (1) The ABN is incorrect, (2) The business is not yet registered, (3) The business has been deregistered. Please verify the ABN and try again."
- ❌ "Error: Invalid ABN"

✅ **Do use consistent terminology**
- ✅ Always use "verify" (not "validate" or "check")
- ✅ Always use "ABN" (not "Australian Business Number" in UI)
- ✅ Always use "case" (not "request" or "query")

✅ **Do write for scannability**
- Use bullet points for lists
- Use short paragraphs (2-3 sentences max)
- Use headings and subheadings
- Use bold for key information

✅ **Do match the user's technical level**
- For API documentation: Technical, precise
- For dashboard UI: Clear, professional
- For error messages: Helpful, actionable

### Don'ts

❌ **Don't use jargon without explanation**
- ❌ "The ABN entity status indicates a non-active registration"
- ✅ "The ABN is registered but not currently active"

❌ **Don't be vague or ambiguous**
- ❌ "Something went wrong"
- ✅ "Unable to connect to ABN Lookup service. Please try again in 30 seconds."

❌ **Don't use marketing language**
- ❌ "Revolutionary verification technology"
- ✅ "Real-time ABN verification"

❌ **Don't apologize excessively**
- ❌ "We're sorry, but we couldn't verify your ABN"
- ✅ "ABN verification failed. Please check the number and try again."

❌ **Don't use passive voice unnecessarily**
- ❌ "Your verification has been completed"
- ✅ "Verification complete"

❌ **Don't use forbidden terms** (see Section 6)

---

## 4. Approved Terminology Registry

| Term | Approved | Use Case | Notes |
|------|----------|----------|-------|
| Verify / Verification | ✅ | Core feature name | Always use "verify" not "validate" |
| ABN | ✅ | Australian Business Number | Use acronym in UI, spell out in first mention in docs |
| ACN | ✅ | Australian Company Number | Use acronym in UI |
| Case | ✅ | Verification request/record | Use "case" consistently |
| Status | ✅ | Verification state | "Pending", "Verified", "Failed" |
| Dashboard | ✅ | Main UI interface | Standard term |
| API Key | ✅ | Authentication credential | Standard term |
| Webhook | ✅ | Real-time notification | Standard term |
| KYC | ✅ | Know Your Customer | Use acronym, explain in first mention |
| AUSTRAC | ✅ | Regulatory body | Use acronym |
| ASIC | ✅ | Regulatory body | Use acronym |
| Real-time | ✅ | Instant verification | Hyphenated |
| Sub-second | ✅ | Performance metric | Hyphenated |
| Compliance | ✅ | Regulatory adherence | Standard term |
| Audit Log | ✅ | Activity record | Two words |
| Rate Limit | ✅ | API throttling | Two words |

---

## 5. Copy Templates

### Hero Headline

**Template:**
```
[Action Verb] [Benefit] in [Timeframe]
```

**Variations:**
- "Verify Australian businesses in seconds"
- "Real-time ABN verification for your platform"
- "Compliance-ready verification, instantly"

**Avoid:**
- "The best verification platform" (marketing fluff)
- "Revolutionary business verification" (hyperbole)

---

### Feature Description

**Template:**
```
[Feature Name]: [What it does] + [Key benefit]
```

**Variations:**
- "ABN Validation: Real-time verification against official databases. Get instant results with 99.9% accuracy."
- "KYC Compliance: Built-in AUSTRAC-compliant identity verification. Meet regulatory requirements automatically."
- "Audit Logging: Complete activity trail for every verification. Maintain compliance records effortlessly."

**Structure:**
1. Feature name (bold)
2. What it does (one sentence)
3. Key benefit (one sentence)

---

### Call-to-Action

**Template:**
```
[Action Verb] + [Specific Outcome]
```

**Variations:**
- "Start Verifying" (primary CTA)
- "View Documentation" (secondary)
- "Get API Key" (signup flow)
- "Check Status" (dashboard)
- "Retry Verification" (error recovery)

**Guidelines:**
- Use action verbs (Start, View, Get, Check, Retry)
- Be specific about the outcome
- Keep it short (2-3 words preferred)
- Match the user's context

**Avoid:**
- "Learn More" (too vague)
- "Click Here" (not descriptive)
- "Submit" (not specific)

---

### Error Messages

**Template:**
```
[What happened] + [Why it happened] + [What to do next]
```

**Example:**
```
ABN verification failed.

The ABN "12345678901" was not found in the official database. This may mean:
- The ABN is incorrect or contains typos
- The business is not yet registered
- The business has been deregistered

Please verify the ABN and try again. If the issue persists, contact support.
```

**Structure:**
1. Clear error title (what happened)
2. Explanation (why)
3. Possible causes (bulleted)
4. Action steps (what to do)

---

### Success Messages

**Template:**
```
[What was verified] + [Key details] + [Next steps (if any)]
```

**Example:**
```
ABN Verified Successfully

ABN: 12345678901
Company: ABC Pty Ltd
Status: Active
Verified: Just now

View full details or download verification report.
```

**Structure:**
1. Success confirmation
2. Key verified information
3. Timestamp
4. Optional next actions

---

### Loading States

**Template:**
```
[Action in progress] + [Expected duration]
```

**Variations:**
- "Verifying ABN..." (with spinner)
- "Checking company status..." (with progress bar)
- "Processing verification..." (with estimated time if > 3 seconds)

**Guidelines:**
- Use present continuous tense ("Verifying" not "Verify")
- Show progress indicator
- Provide estimated time if > 3 seconds
- Update status as process continues

---

## 6. Forbidden Terms

### Avoid These Terms

❌ **"Validate"** → Use "verify" instead
- Rationale: "Verify" is the approved term for consistency

❌ **"Check"** → Use "verify" for verification actions
- Rationale: "Check" is too casual; "verify" is more precise

❌ **"Request"** → Use "case" for verification records
- Rationale: "Case" is the approved terminology

❌ **"Query"** → Use "verification" or "case"
- Rationale: "Query" is database terminology, not user-facing

❌ **"Revolutionary" / "Game-changing"** → Avoid marketing hyperbole
- Rationale: Professional, factual language only

❌ **"Best" / "Fastest" / "Most Reliable"** → Use specific metrics instead
- Rationale: Claims require proof; use data ("99.9% accuracy" not "most accurate")

❌ **"Sorry" / "Apologies"** → Provide solutions, not apologies
- Rationale: Focus on fixing the issue, not apologizing

❌ **"Please wait"** → Use specific action ("Verifying..." with progress)
- Rationale: More informative and actionable

❌ **"Oops" / "Uh oh"** → Professional error messages only
- Rationale: Too casual for B2B/financial services context

❌ **"Awesome" / "Great"** → Use professional alternatives
- Rationale: Too casual; use "Success" or "Complete"

---

## 7. Messaging by Context

### API Documentation
- **Tone:** Technical, precise, comprehensive
- **Voice:** Third person ("The API returns...")
- **Style:** Code examples, parameter tables, response schemas
- **Example:** "The `/verify/abn` endpoint accepts an ABN string and returns a verification result object."

### Dashboard UI
- **Tone:** Clear, professional, helpful
- **Voice:** Second person ("Your verification...")
- **Style:** Short labels, clear actions, contextual help
- **Example:** "Your ABN verification is complete. View details or download report."

### Error Messages
- **Tone:** Helpful, specific, actionable
- **Voice:** Second person ("Your request...")
- **Style:** Clear explanation, possible causes, next steps
- **Example:** "Your verification failed. The ABN format is invalid. Please enter a valid 11-digit ABN."

### Marketing Materials
- **Tone:** Professional, benefit-focused, credible
- **Voice:** Third person ("RPR-VERIFY enables...")
- **Style:** Feature-benefit structure, data-driven claims
- **Example:** "RPR-VERIFY enables real-time business verification with 99.9% accuracy and full AUSTRAC compliance."

---

## 8. Brand Voice Examples

### Good Examples

**Hero Copy:**
> "Verify Australian businesses in seconds. Real-time ABN validation with full compliance built-in."

**Feature Description:**
> "KYC Compliance: Automatically meet AUSTRAC requirements with built-in identity verification and risk screening."

**Error Message:**
> "ABN not found. Verify the number is correct and the business is registered. If the issue persists, contact support."

**Success Message:**
> "Verification complete. ABC Pty Ltd (ABN: 12345678901) is verified and active."

### Bad Examples

**Hero Copy:**
> "The revolutionary, game-changing business verification platform that will transform your workflow!" ❌

**Feature Description:**
> "Our amazing KYC thing does compliance stuff really well!" ❌

**Error Message:**
> "Oops! Something went wrong. Sorry about that!" ❌

**Success Message:**
> "Awesome! You're all set!" ❌

---

## Reference Documents

- **Brand Playbook:** `../RPR-FX-Command-Brand-Playbook-V2.md`
- **Creative Brief:** `../RPR-VERIFY-CREATIVE-BRIEF.md` (if available)
- **Master Operations:** `../RPR-VERIFY-OPERATIONS-MASTER.md`
- **Strategy Brief:** `RPR-VERIFY-STRATEGY-BRIEF.md` (this folder)

---

**Note:** This document is a derivative of the Brand Playbook and Operations Master. For complete brand guidelines, refer to `RPR-FX-Command-Brand-Playbook-V2.md` in the parent directory.

