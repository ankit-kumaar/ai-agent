# AI Agent Test Data

This file contains sample email data categorized by the expected agent that should handle them. You can use these examples to test the classification and workflow logic of the application.

---

## 📅 Booking Agent
**Goal:** Create new shipments or bookings.

### Case 1: Standard Booking Request
```json
{
  "subject": "New Shipment Booking - Electronics from Shenzhen",
  "sender": "supplier@tech-global.com",
  "recipient": "logistics@company.com",
  "body": "Hi team, I would like to book a new shipment of 500 units of mobile chargers. Origin: Shenzhen Port, Destination: Los Angeles. Expected ready date: Feb 15th. Cargo weight approx 1200kg."
}
```

### Case 2: Urgent Cargo Booking
```json
{
  "subject": "URGENT: Air Freight Booking for Pharma Supplies",
  "sender": "medical@health-first.org",
  "recipient": "booking@logistics.com",
  "body": "Hello, we need an urgent air freight booking for vaccination kits. Must leave Berlin by tomorrow morning heading to Nairobi. Total 12 pallets, temperature controlled (2-8C)."
}
```

---

## 📍 Tracking Agent
**Goal:** Inquire about shipment status, ETAs, or tracking.

### Case 1: Simple Status Check
```json
{
  "subject": "Status update for Shipment #SHP-99283",
  "sender": "buyer@retail-corp.com",
  "recipient": "support@logistics.com",
  "body": "Hi, can you tell me where my shipment #SHP-99283 is currently? It was supposed to arrive yesterday but I haven't seen any updates on the portal."
}
```

### Case 2: Missing Package Inquiry
```json
{
  "subject": "Where is my container? (CNTR123456)",
  "sender": "import@warehouse-solutions.com",
  "recipient": "tracking@logistics.com",
  "body": "Our container CNTR123456 is showing as 'At Sea' for 15 days now. Please provide the current GPS coordinates and the updated ETA for Savannah port."
}
```

---

## 📜 Documents Agent
**Goal:** Validate Shipping Instructions (SI) or Bill of Lading (BL).

### Case 1: SI Submission for Review
```json
{
  "subject": "Draft Shipping Instructions - Draft #442",
  "sender": "docs@shippers-inc.com",
  "recipient": "docs-verify@logistics.com",
  "body": "Please find the attached draft SI for the Dubai shipment. Ensure the consignee details match the LC requirements. Let us know if this is valid for BL issuance."
}
```

### Case 2: Bill of Lading Correction
```json
{
  "subject": "Correction needed: Draft BL #BL-XYZ-123",
  "sender": "finance@export-co.com",
  "recipient": "docs@logistics.com",
  "body": "We noticed a typo in the freight charges on the draft Bill of Lading #BL-XYZ-123. It should be 'Freight Prepaid' instead of 'Collect'. Please validate and update."
}
```

---

## ⚠️ Management Agent
**Goal:** Handle critical issues, high-level escalations, or major failures.

### Case 1: Major Delay Escalation
```json
{
  "subject": "FORMAL COMPLAINT: Extended Delay and Revenue Loss",
  "sender": "ceo@big-client.com",
  "recipient": "management@logistics.com",
  "body": "I am writing to express my extreme dissatisfaction with the 3-week delay of our seasonal inventory. This is causing significant revenue loss. I need a management response within 2 hours regarding compensation and an immediate fix."
}
```

### Case 2: Safety/Compliance Issue
```json
{
  "subject": "CRITICAL: Safety violation reported at Houston terminal",
  "sender": "safety-inspector@inspect-gov.org",
  "recipient": "admin@logistics.com",
  "body": "A critical safety violation has been flagged regarding the handling of hazardous materials from your latest shipment. This requires immediate management intervention to avoid terminal shutdown."
}
```

---

## 💬 Customer Agent
**Goal:** General inquiries, feedback, or non-technical questions.

### Case 1: General Inquiry
```json
{
  "subject": "Question about regional coverage",
  "sender": "new-lead@startup.io",
  "recipient": "info@logistics.com",
  "body": "Hi there, do you guys offer door-to-door delivery services in Southeast Asia? We are planning to expand and looking for a reliable partner. Thanks!"
}
```

### Case 2: Positive Feedback
```json
{
  "subject": "Great job on the last delivery!",
  "sender": "happy@client.com",
  "recipient": "feedback@logistics.com",
  "body": "Just wanted to say thanks for the smooth delivery yesterday. The driver was very professional and everything arrived in perfect condition."
}
```
