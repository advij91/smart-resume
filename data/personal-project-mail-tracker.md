# ID: personal_project_mail_tracker_2026
# Owner: Ashutosh Vijay (Product Solutions Engineer & Vice President)
# Core Tech: Python, Google Workspace APIs (Gmail API, Google Drive API), OAuth 2.0, JSON Rules Engine, Dynamic Regex, HTML5/CSS3 (Tailwind CSS, Glassmorphic UI), Windows Task Scheduler
# Category: Workflow Automation, Personal Productivity & Intelligent Information Feeds

## Autonomous Mail Classification & Daily Digest Portal

*   **System Overview & Orchestration:** Engineered a lightweight, daily Gmail scanner and aggregator designed to consolidate personal communications, financial receipts, and critical notifications. The system runs on a daily cron/scheduler (scheduled at 07:00 AM), computes local timezone boundaries, fetches yesterday's email traffic via the Gmail API, processes the payloads (extracting text, HTML, and list headers), and publishes a responsive glassmorphic HTML digest.
*   **Sender-Scoped Rules Engine:** Built a high-performance, hierarchical categorization registry (`sender_scoped_rules.json`) that processes emails via a two-phase check:
    *   *Phase 1 (Veto Logic):* Inspects emails against active exclusion filters (subject, body, specific senders, and domains) to instantly prune administrative noises or notifications that match criteria but are non-actionable.
    *   *Phase 2 (Trigger Logic):* Applies nested matching conditions (including domain-level defaults, sender-level overrides, exact keyword matching, and dynamic regex triggers) to classify messages into specific taxonomies (e.g., Security, Finance, Updates, Promotions).
    *   *Conflict Resolution:* Resolves rule conflicts using a priority-based sorting weight (`sortWeight`), prioritizing critical security issues and urgent alerts over default sender labels.
*   **Transaction Analytics Parser:** Integrated specialized extraction scripts (such as `parse_icici_cc_transaction`) that utilize custom, regular expression heuristics to parse credit card transaction alerts. The engine extracts transaction timestamps, merchant descriptors, and charge amounts (INR), and renders them in a dedicated, interactive financial ledger grid on the daily dashboard.
*   **One-Click Unsubscribe Integration:** Programmed a crawler that scans incoming messages for standard `List-Unsubscribe` headers, extracting valid http/https URLs. These links are exposed as a clean "Unsubscribe" action button next to promotional messages and newsletters in the UI, enabling instant, single-click subscription management.
*   **Premium Glassmorphic Dashboard & Portal:** Developed an automated HTML5 report builder that compiles yesterday's processed traffic into a dashboard matching modern, premium design standards:
    *   *Glassmorphism & Styling:* Uses glass-like translucent components, vivid backdrop colors, typography (Inter), and icons (FontAwesome).
    *   *Grid & Navigation:* Divides summaries into specific sections (Hero Alerts for critical notifications, Main List for categorized updates, and Sidebar for promotional feeds). Features a sliding "Category Navigator" drawer displaying counts.
    *   *Portal Hub:* Automatically registers new daily summaries in a global index manifest (`manifest.json`) and rebuilds the central dashboard page (`index.html`) to present a calendar of previous daily summaries.
*   **Google Drive Sync & Retention Lifecycle:** Connected the reporting pipeline to the Google Drive API to upload each day's generated summary page into a designated cloud folder. Programmed a rolling retention policy that automatically queries and deletes remote files older than 30 days, optimizing cloud storage consumption.
*   **Key Learnings & Impact:**
    *   *Hierarchical Data Structures:* Designed a nested lookup hierarchy that matches domain records first before performing sender/keyword evaluation, minimizing rule parsing complexity.
    *   *Heuristic-Based Parsing:* Achieved near-perfect financial extraction metrics on transaction alerts using regex matches scoped within specific sender rules, providing structured data without heavy LLM costs.
    *   *Seamless Cloud Integration:* Leveraged OAuth 2.0 authorization with token refresh cycles to build a completely unattended service that handles email crawling, report compilation, and cloud synchronization.
