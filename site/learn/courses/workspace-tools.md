---
id: workspace-tools
title: Microsoft 365, Outlook & Google Workspace
icon: ☁️
track: Office & Tools
color: #0078D4
runner: none
tagline: Run a professional back office: email, calendars, files, sharing and automation.
description: Professional productivity tools for operations and virtual-assistant work: Outlook (rules, folders, categories, templates, calendars, shared mailboxes), Teams, OneDrive/SharePoint sharing and versioning, Microsoft Forms, Power Automate basics; Gmail (filters, labels, templates, delegation), Google Calendar, Drive (sharing, permissions), Docs/Sheets/Slides collaboration, Apps Script basics; email etiquette for global clients, security and etiquette.
---

# LEVEL: Beginner

## Microsoft 365 vs Google Workspace overview

Almost every client you will support runs their office on one of two platforms. **Microsoft 365** (formerly Office 365) bundles Outlook, Word, Excel, PowerPoint, Teams, OneDrive and SharePoint. **Google Workspace** (formerly G Suite) bundles Gmail, Docs, Sheets, Slides, Meet, Drive and Calendar. A virtual assistant or back-office specialist is expected to be fluent in both, because a US title-insurance client may be on Microsoft while a Fiverr marketing client lives in Google.

### The two stacks side by side

| Job | Microsoft 365 | Google Workspace |
|---|---|---|
| Email | Outlook (Exchange Online mailbox) | Gmail |
| Calendar | Outlook Calendar | Google Calendar |
| Documents | Word, Excel, PowerPoint (desktop + web) | Docs, Sheets, Slides (web first) |
| Personal files | OneDrive (1 TB per user on business plans) | Google Drive (30 GB pooled on Starter, 2 TB per user pooled on Standard) |
| Team files | SharePoint sites, Teams channels | Shared drives |
| Chat and meetings | Teams | Google Chat, Google Meet |
| Forms | Microsoft Forms | Google Forms |
| Automation | Power Automate | Apps Script, AppSheet |
| Admin | Microsoft 365 admin center (admin.microsoft.com) | Google Admin console (admin.google.com) |
| Identity | Microsoft Entra ID (formerly Azure AD) | Google Cloud Identity |

Both are subscriptions billed per user per month. Microsoft's business tiers are **Business Basic** (web apps and email), **Business Standard** (adds desktop Office apps), **Business Premium** (adds security and device management) and **Apps for business** (desktop apps without email). Google's tiers are **Business Starter**, **Business Standard**, **Business Plus** and **Enterprise**; the tier decides storage, meeting size, recording and Vault retention.

### How they differ in feel

Microsoft is desktop-first: Outlook and Excel are full Windows applications with web versions that cover most but not all features. Google is browser-first: Docs and Sheets have no desktop application, and everything autosaves to Drive. The practical consequences for back-office work:

- A **.docx** or **.xlsx** sent by a Microsoft client opens in Google with conversion, and complex features (tracked changes in tables, Excel macros, pivot cache, DOCX field codes) may not survive. Keep files in their native platform.
- Microsoft file sharing is link-based on top of a folder permission model inherited from SharePoint; Google sharing is per file with roles (Viewer, Commenter, Editor).
- Microsoft's mail lives in folders; Gmail uses labels, which a message can have several of.

```text
Client A (title-insurance, Texas)        Client B (marketing agency, Fiverr)
  Outlook desktop + Teams                   Gmail + Google Meet
  Files on SharePoint "Production" site     Files in a shared drive "Clients"
  Reports in Excel with Power Query         Reports in Sheets with IMPORTRANGE
  You get: a licensed M365 account          You get: a Google account in their domain
```

Expect to receive an account in the client's domain rather than using your own address. That account is theirs: it is licensed, audited and removed when the engagement ends, so keep your own files and templates in your own tenant.

### Signing in

Microsoft: `office.com` (now `microsoft365.com`) with your `you@client.com` account; the app launcher (the nine dots) lists every app the licence includes. Google: `workspace.google.com` or simply `gmail.com` with the client-domain account; the same nine-dot launcher exists. Both platforms enforce **multi-factor authentication** on new accounts, so have the Microsoft Authenticator or Google Authenticator app ready before the first sign-in.

### Where things are saved

New users lose files because they do not know where the platform put them. Defaults:

- Outlook attachments you open are in a temporary folder; save them to OneDrive deliberately.
- Word and Excel with AutoSave on save to OneDrive or SharePoint continuously; AutoSave is off for local files.
- Gmail attachments go to Drive only when you click **Add to Drive**.
- Docs, Sheets and Slides exist only in Drive and save every keystroke; **File → Version history** replaces Save.

> **Tip:** Keep a one-page "client platform sheet" for each client: platform, your account, where files live, who the admin is, and the support contact. Half the delays in back-office work are people asking where a file is.

### Try It Yourself

```text
Client platform sheet (fill one per client)

Client        : Stewart-style title agency, Houston
Platform      : Microsoft 365 Business Standard
Your account  : ali.raza@agency.com (MFA via Microsoft Authenticator)
Mail          : Outlook desktop (classic) + Outlook web
Files         : SharePoint site "Production" → Documents → Reports
Meetings      : Teams (lobby on for external guests)
Admin contact : IT lead, it@agency.com
Time zone     : America/Chicago (UTC-6, UTC-5 in DST); you: Asia/Karachi (UTC+5)
```

### Quiz

1. Which Microsoft 365 plan includes desktop Office apps and email?
- [ ] Business Basic
- [x] Business Standard
- [ ] Apps for business
> Basic is web and email only; Apps for business has desktop apps without a mailbox.

2. How does Gmail organise mail differently from Outlook?
- [ ] Gmail has no folders or labels
- [x] Gmail uses labels, and a message can carry several
- [ ] Outlook uses labels
> Outlook stores each message in one folder; Gmail's labels are tags.

3. Where do Docs, Sheets and Slides files live?
- [x] Only in Google Drive, autosaved
- [ ] On your hard drive
- [ ] In Gmail
> There is no desktop application or local save; version history replaces Save.

4. Why should you keep your templates in your own tenant rather than the client's?
- [ ] Clients cannot store templates
- [x] The client account is removed when the engagement ends
- [ ] Templates do not work in client tenants
> Anything left in the client account is lost or becomes theirs on offboarding.

### Exercises

1. **Map a client** — A new Upwork client says "we use Google for email but our accountant sends Excel files". List which platform each activity happens on and one risk.
<details><summary>Solution</summary>

Email, calendar and meetings in Google Workspace; spreadsheets arrive as `.xlsx`. Risk: opening the accountant's `.xlsx` in Sheets converts it and can break formulas, macros and formatting; keep those files as Excel (open with Excel desktop or Office web) and only convert to Sheets if the accountant agrees.

</details>

2. **Storage check** — A client on Google Business Starter has 5 users and is "out of space". What is the pool and what do you recommend?
<details><summary>Solution</summary>

Starter pools 30 GB per user, so 150 GB total across mail and Drive. Check the biggest consumers (Drive storage view sorted by size, Gmail `larger:10M` search) and either clean up or upgrade to Business Standard (2 TB per user pooled), which is usually cheaper than the hours spent deleting.

</details>

### Interview Questions

**Q: A client asks whether they should move from Google Workspace to Microsoft 365. How do you advise them?**
I ask what they actually do all day rather than which brand they prefer. Heavy Excel users, teams that live in Outlook and Teams, and organisations needing device management tend to fit Microsoft 365 Business Standard or Premium. Browser-first teams that collaborate in real time on documents and value simple sharing tend to fit Google. Migration itself is a project: mail and calendar move well with Google's or Microsoft's migration tools, but Docs with comments and Sheets with IMPORTRANGE do not translate cleanly. My honest default is "stay where you are unless a concrete pain point demands the move".

**Q: What is the difference between OneDrive and SharePoint?**
Both store files in the same underlying service, but OneDrive is a personal library tied to one user's account while SharePoint is a site owned by the organisation, with libraries shared by a team. Files a person creates for themselves live in OneDrive; anything the team needs after that person leaves belongs in SharePoint, which is also what a Teams channel's Files tab is. When I onboard with a client I move working files from OneDrive to the team site early, because offboarding a user whose OneDrive holds the only copy of a report is a recurring emergency.

**Q: Why do you insist on a client-domain account instead of using your own Gmail?**
Security and ownership. A client-domain account is subject to the client's MFA, audit logs, retention and offboarding, so their data never lives in my personal account, which matters for anything touching US customer data such as title files. It also means shared mailboxes, Teams channels and shared drives just work, whereas external accounts hit guest restrictions constantly. And for me it is cleaner: when the engagement ends the account is disabled and there is nothing of theirs on my side.

## Professional email writing (structure, tone, subject lines, international clients)

Email is the product a virtual assistant is judged on most. A client who never sees your spreadsheet will still read your message about it, and a badly structured email costs a reply, a call, or the contract. This chapter gives a structure that works for US, UK and Middle Eastern clients alike and shows how to adapt tone without losing clarity.

### The structure

Every work email has the same five parts, in the same order:

1. **Subject line** that says what the email is about and what is needed.
2. **Greeting** matched to the relationship.
3. **Opening line** stating why you are writing, in one sentence.
4. **Body** with the detail, formatted so it can be scanned: short paragraphs, bullets for lists, bold for the one thing they must not miss.
5. **Close** with the action, the deadline and a sign-off.

```text
Subject: Weekly production report – w/e 12 Sep – approval needed by Tue

Hi Jennifer,

The weekly status report for the week ending 12 September is attached.

Summary:
• 1,248 files completed (+6% vs last week)
• 3 rate-matrix corrections applied (details on the Exceptions tab)
• 1 open item: Harris County rates for 2027 are still pending from underwriting

Could you approve the report by Tuesday 16 September, 5 pm CT, so it goes
to the regional team on Wednesday as usual?

Thanks,
Ali

Ali Raza | Production Support | +92 300 000 0000 | Asia/Karachi (UTC+5)
```

Notice the subject line has the topic, the period and the action with a deadline; the opening states the purpose; the body is three bullets, and the close asks one clear question with a date and a time zone.

### Subject lines

A subject line is a filing label and a request in ten words. Patterns that work:

| Pattern | Example |
|---|---|
| Topic – period – action | Rate matrix – Q4 – review by Fri |
| [ACTION] Topic | [APPROVAL NEEDED] Handbook v12 cover |
| Client/Project: topic | Fiverr #FO4A2: revised EPUB delivered |
| FYI: topic | FYI: Outlook rules migrated to shared mailbox |
| Re: keep the thread | Re: Weekly production report – w/e 12 Sep |

Never send "Hi", "Question" or an empty subject. Do not change a subject mid-thread unless the topic really changed; searching for the thread later depends on it.

### Tone by audience

- **US clients**: direct, friendly, first names from the first email, short sentences, "Thanks" rather than "Kind regards". Bad news up front with a fix attached.
- **UK and Australian clients**: slightly more hedged ("Would you be able to...", "I wonder if..."), "Kind regards" is normal, humour is fine once established.
- **Gulf and South Asian corporate clients**: titles and surnames until invited otherwise ("Dear Mr Al-Rashid"), a courteous opening line, formal sign-off.
- **Fiverr and Upwork buyers**: warm and fast; the first message sets expectations on scope, delivery date and revisions in writing.

Across all of them: no slang, no sarcasm, no exclamation marks in a complaint, and never write in anger. If you are annoyed, save the draft and reread it after ten minutes.

### Writing for non-native and busy readers

Most of your readers skim on a phone. Rules that respect that:

- One idea per paragraph, three sentences maximum.
- Numbers as digits (`3 corrections`, not `three`).
- Absolute dates with the day name and time zone: `Tuesday 16 September, 5 pm CT`, never "tomorrow" or "EOD".
- Put the request in its own paragraph; do not bury it after the detail.
- Name attachments in the text and make sure they are attached (Outlook and Gmail both warn if you write "attached" and forget, but only in English).

### Replies and threads

- Reply within one business day even if the answer is "received, will revert by Thursday".
- **Reply All** only when everyone needs the answer; move people to Bcc with a note ("moving Sam to Bcc") when a thread narrows.
- Quote the specific question you are answering when the thread is long.
- Do not forward internal threads to clients; write a fresh summary.

### Bad news and mistakes

Say what happened, what the impact is, what you have done, and what you need, in that order, with no excuses in the first paragraph. A short honest email sent early is always cheaper than a long one sent late.

```text
Subject: Correction to Friday's rate matrix – no client impact

Hi Mark,

I found an error in the rate matrix I sent on Friday: the Fort Bend
County column used 2025 rates. The corrected file is attached and I
have re-run the validation; the other 253 counties are unchanged.

No quotes were issued from the wrong version. I have added a check to
the validation macro so a stale column fails before export.

Sorry for the extra step.

Ali
```

> **Warning:** Never put anything in an email you would not want read aloud in a meeting or a court. Email is discoverable, forwardable and permanent. Criticism of a colleague, a customer's personal data, or a password belong in a call, a ticket or a password manager, not in a message.

### Try It Yourself

```text
Rewrite this client email using the five-part structure:

"hi, the report is done but there were some issues with the rates and i
wasn't sure about the harris county thing so i left it, let me know
what you want me to do, also can you send the new template? thanks"

Model answer:
Subject: Weekly report ready – 1 question on Harris County rates

Hi Jennifer,
The weekly report is complete and attached.
One item needs your decision: Harris County 2027 rates have not been
issued, so the column shows 2026 values, flagged in yellow.
Could you confirm by Monday 15 September whether to (a) keep 2026 values
or (b) hold the report until underwriting sends 2027?
Separately, could you send the new report template when convenient?
Thanks, Ali
```

### Quiz

1. Which subject line is best?
- [ ] Question
- [ ] Report
- [x] Weekly production report – w/e 12 Sep – approval needed by Tue
> It names the topic, the period and the action with a deadline.

2. How should a deadline be written for an international client?
- [ ] EOD tomorrow
- [x] Tuesday 16 September, 5 pm CT
- [ ] ASAP
> Day name, date and time zone remove all ambiguity across zones.

3. What comes first in an email about a mistake?
- [ ] An apology and explanation
- [x] What happened and its impact
- [ ] The request
> Facts first, then the fix, then what you need; excuses do not lead.

4. When should you use Reply All?
- [ ] Always, so everyone is informed
- [x] Only when everyone on the thread needs the answer
- [ ] Never
> Unneeded replies cost every reader time; narrow the thread deliberately.

### Exercises

1. **Three tones** — Write the opening two lines of a delivery email for the same EPUB job to a US Fiverr buyer, a UK publisher and a Gulf corporate client.
<details><summary>Solution</summary>

US: "Hi Sarah, your EPUB is ready and attached. It passed EPUBCheck with zero errors and I have tested it on Kindle Previewer and Apple Books." UK: "Hello Sarah, I'm pleased to say the EPUB is ready and attached; it passes EPUBCheck cleanly and I've tested it on the main readers." Gulf: "Dear Ms Al-Sayed, I hope this finds you well. Please find attached the completed EPUB, validated with EPUBCheck and tested on the major reading applications."

</details>

2. **Bad-news email** — A dashboard you delivered used last month's data. Write the four-part message.
<details><summary>Solution</summary>

What happened: "The dashboard sent on 10 September was connected to the August extract instead of September." Impact: "All KPI tiles are one month behind; no decisions were taken on it as far as I know." Done: "The refreshed version is attached and the data source path is now parameterised." Need: "Please discard the earlier file; could you confirm nobody forwarded it?"

</details>

### Interview Questions

**Q: How do you adapt your email style to clients in different countries?**
I keep the structure identical, since a clear subject, a one-line purpose, scannable body and an explicit request work everywhere, and I vary tone and formality. US clients get first names, short sentences and "Thanks"; UK clients get slightly softer requests and "Kind regards"; Gulf corporate clients get titles and a courteous opening until they signal otherwise. For all of them I write dates with day names and time zones and avoid idioms, because my reader may be a non-native speaker on a phone. A concrete example: the same weekly status report goes to a Texas client with a bullet summary and a deadline in CT, and to a Dubai client with a formal opening paragraph and the same bullets.

**Q: A client is angry in an email. How do you respond?**
Not immediately, and never in kind. I read it twice, separate the facts from the emotion, and answer the facts: acknowledge the problem in one sentence, state what I have already checked or fixed, give a precise next step with a time, and offer a call if it is complex. I do not defend or explain at length in writing; that reads as excuses. On a title-report job where a client wrote in capitals about a wrong county column, a five-line reply with the corrected file and a new validation check ended the issue in one round.

**Q: What makes a subject line good, and why does it matter for a back office?**
A good subject line identifies the topic, the period or reference, and the action needed, so the reader can prioritise without opening it and can find it by search months later. It matters in a back office because email is the filing system: rules, searches and shared-mailbox triage all key off the subject. I also keep subjects stable within a thread and prefix true actions, such as `[APPROVAL NEEDED]`, so Outlook rules can route them. A vague subject costs the client a click today and me ten minutes of searching next quarter.

## Outlook essentials (folders, search, signatures, categories)

Outlook is the mail, calendar, contacts and tasks client for Microsoft 365. In 2026 there are two Windows versions: **classic Outlook** (the long-standing desktop program) and **new Outlook** (a redesigned app that shares its code with Outlook on the web). Most menu paths below are for classic Outlook with the new Outlook equivalent noted, because clients run both and interviewers ask about both.

### The layout

The left **folder pane** lists your mailbox: Inbox, Drafts, Sent Items, Deleted Items, Junk Email, Archive, plus any folders you create. The centre is the message list, the right is the reading pane. The bottom-left icons (or the left rail in new Outlook) switch between Mail, Calendar, People and Tasks (To Do).

### Folders

Folders hold messages; each message lives in exactly one folder. Right-click the mailbox name → **New Folder**. Drag messages in, or use **Move** on the ribbon. A working structure for a production-support role:

```text
Inbox
├─ 01 Action            ← needs a reply or work from me
├─ 02 Waiting           ← I replied, awaiting client
├─ 03 Reports sent      ← weekly and monthly deliverables
├─ Clients
│   ├─ Agency Houston
│   └─ Publisher UK
└─ Reference            ← rate bulletins, templates, IT notices
```

Numbers prefix the folders so they sort in workflow order. Keep the Inbox itself close to empty by moving each processed message; the Inbox is a queue, not storage. **Archive** (the Backspace key in classic Outlook, or the Archive button) moves a message to the Archive folder in one keystroke without deleting it.

### Search

The search box at the top of the window searches the current folder by default; change the scope to **Current Mailbox** or **All Mailboxes** from the dropdown. Operators narrow it:

| Operator | Finds |
|---|---|
| `from:jennifer` | Messages from Jennifer |
| `to:me` | Messages addressed to you (not Cc) |
| `subject:"rate matrix"` | Exact phrase in subject |
| `hasattachment:yes` | With attachments |
| `received:last week` or `received:>=9/1/2026` | By date |
| `category:Client` | With a category |
| `messagesize:>5MB` | Large messages |
| `from:jennifer AND hasattachment:yes` | Combined |

Search Folders (right-click **Search Folders → New Search Folder**) save a query as a virtual folder, such as "Unread mail" or "Mail flagged for follow-up", and are the best way to keep an "all attachments from client X" view without moving anything.

### Signatures

Classic: **File → Options → Mail → Signatures**. New Outlook and web: **Settings (gear) → Accounts → Signatures**. Create one per role: a full signature for new messages and a short one for replies. Include name, role, company, phone with country code, and your time zone; omit inspirational quotes and large images (they arrive as attachments on many phones).

```text
Ali Raza
Production Support Specialist | Agency Houston
+92 300 000 0000 | ali.raza@agency.com
Working hours 9:00–18:00 PKT (UTC+5) · 23:00–08:00 CT
```

The working-hours line prevents a US client from expecting a reply at 3 pm CT when it is midnight in Lahore.

### Categories

Categories are colour tags that apply to mail, calendar items, contacts and tasks. **Home → Categorize → All Categories** to rename them from "Red Category" to something useful. Because a message can carry several categories while living in one folder, categories are how Outlook does what Gmail does with labels. Suggested set:

- Client name per colour (Agency Houston = blue, Publisher UK = green).
- Status: **Action**, **Waiting**, **Done**.
- Type: **Invoice**, **Report**, **Contract**.

Categories travel with the message inside the same mailbox and show in the message list, in search (`category:`) and in the calendar. They do not travel to external recipients.

### Flags and Focused Inbox

**Flag** a message (Insert key in classic, or the flag icon) to add it to To Do with a due date. **Focused Inbox** (View → Show Focused Inbox) splits the Inbox into Focused and Other based on Outlook's guess of importance; turn it off for a shared or client mailbox, because rules and humans are more predictable than the guess.

### Useful shortcuts

`Ctrl+N` new message, `Ctrl+R` reply, `Ctrl+Shift+R` reply all, `Ctrl+F` forward (not find), `Ctrl+E` search, `Ctrl+Shift+V` move to folder, `Ctrl+1/2/3` mail/calendar/people, `Alt+S` send.

> **Tip:** Turn on **File → Options → Mail → "Warn me when I send a message that may be missing an attachment"** and set a **send delay** rule of one minute (Rules → "defer delivery by a number of minutes"). The delay gives you the sixty seconds in which most wrong-recipient mistakes are noticed.

### Try It Yourself

```text
Outlook setup checklist for a new client mailbox

□ Folders: 01 Action, 02 Waiting, 03 Reports sent, Clients/<name>, Reference
□ Search Folder "Client attachments": from:@agency.com hasattachment:yes
□ Categories renamed: Agency Houston (blue), Action, Waiting, Invoice, Report
□ Signature (new) and Signature (reply) with time zone line
□ Focused Inbox off; reading pane right; conversation view on
□ Options → Mail: warn on missing attachment; deferred delivery rule 1 min
□ Ctrl+Shift+V tested; Backspace = Archive tested
```

### Quiz

1. How many folders can one Outlook message be in at once?
- [x] One
- [ ] Any number
- [ ] Two: Inbox and Archive
> Folders are locations; use categories for multiple tags.

2. Which search finds messages from Jennifer with attachments?
- [ ] `jennifer attachments`
- [x] `from:jennifer hasattachment:yes`
- [ ] `sender=jennifer;file=yes`
> Operators combine with a space (implicit AND) or an explicit AND.

3. Where are signatures set in classic Outlook?
- [x] File → Options → Mail → Signatures
- [ ] Home → Categorize
- [ ] View → Layout
> New Outlook and the web put them under Settings → Accounts → Signatures.

4. What is a Search Folder?
- [ ] A folder that stores search history
- [x] A saved search that shows matching messages without moving them
- [ ] A folder for attachments
> Messages stay where they are; the Search Folder is a live view.

### Exercises

1. **Categories versus folders** — A message from the Houston client is an invoice that needs action. Show how you would file and tag it, and what search finds it later.
<details><summary>Solution</summary>

Move it to `Clients/Agency Houston` (Ctrl+Shift+V), apply categories `Agency Houston`, `Invoice` and `Action`. When done, remove `Action` and add `Done`. Later: `category:Invoice from:@agency.com received:this year` in Current Mailbox scope.

</details>

2. **Deferred send** — Describe the rule that delays every outgoing message by 1 minute.
<details><summary>Solution</summary>

Home → Rules → Manage Rules & Alerts → New Rule → "Apply rule on messages I send" → no conditions (confirm "apply to every message") → action "defer delivery by a number of minutes" → 1 → Finish. Messages wait in the Outbox for one minute; Outlook must stay open for them to go.

</details>

### Interview Questions

**Q: How do you keep a busy client mailbox under control in Outlook?**
Inbox as a queue, not storage: every message is moved to an Action, Waiting or client folder after it is read, and archived with one keystroke when done. Categories carry the tags a folder cannot (client, type, status), and a couple of Search Folders give me live views such as "all attachments from the Houston agency" without moving anything. Rules handle the predictable traffic, which is the next chapter. The measurable result on a shared production mailbox was an Inbox that stayed under 20 messages at the end of every day instead of 1,500.

**Q: What is the difference between classic Outlook and new Outlook, and does it matter?**
Classic Outlook is the traditional Win32 desktop program with the full feature set: COM add-ins, `.pst` files, Quick Steps, Quick Parts, offline mode with cached Exchange. New Outlook is built on the web client, so it looks like Outlook on the web, supports only web add-ins and did not initially support `.pst` files or some rules and template features. It matters when a client's workflow depends on a classic feature: an EndNote-style COM add-in, a `.pst` archive, or Quick Parts. I check which version the client runs before promising a setup, because "Insert → Quick Parts" simply is not there in new Outlook.

**Q: Explain categories versus folders and when you would use each.**
A folder is a location and each message is in one; a category is a coloured tag and a message can have several. Folders are for structure that maps to your workflow, such as Action, Waiting and per-client archives. Categories are for attributes that cut across that structure: type (Invoice, Report), client, or status that changes over time. I use both: the folder answers "where is it in my process", the category answers "what is it and for whom", and `category:` search combines them.

## Gmail essentials (labels, stars, search operators)

Gmail is the mail client of Google Workspace and, through personal accounts, the most used email service in the world. It looks simpler than Outlook but is built on a different model: **labels instead of folders**, **conversations instead of messages**, and **search instead of filing**. Learning that model is what makes Gmail fast.

### Labels

A label is a tag. A conversation can carry many labels and appears under each; removing a label does not delete the message. The left sidebar lists system labels (Inbox, Starred, Snoozed, Sent, Drafts, Spam, Trash) and your own. Create one with **Settings (gear) → See all settings → Labels → Create new label**, or from the **Label** icon above the message list. Labels can be nested (`Clients/Agency Houston`) and coloured.

```text
Labels for a VA account
Clients/Agency Houston
Clients/Publisher UK
Status/Action
Status/Waiting
Type/Invoice
Type/Report
Reference
```

**Archive** removes the Inbox label; the message stays under All Mail and its other labels. Gmail's "Inbox zero" is therefore archiving, not deleting.

### Stars and importance

Stars are quick per-message markers. **Settings → General → Stars** lets you enable multiple star types (yellow star, red bang, green check, purple question and so on); click the star repeatedly to cycle through them. `is:starred`, `has:yellow-star` and `has:red-bang` find them. Importance markers (the yellow arrow) are Gmail's guess of what matters; like Outlook's Focused Inbox, they are best turned off for work mailboxes (**Settings → Inbox → Importance markers → No markers**).

### Search operators

The search bar is Gmail's filing cabinet. Operators:

| Operator | Finds |
|---|---|
| `from:jennifer@agency.com` | From an address or name |
| `to:me` | Addressed directly to you |
| `subject:"rate matrix"` | Phrase in the subject |
| `has:attachment` | With attachment |
| `filename:pdf` or `filename:report.xlsx` | Attachment type or name |
| `label:clients-agency-houston` | Under a label (spaces become hyphens) |
| `is:unread`, `is:starred`, `is:important` | State |
| `after:2026/09/01 before:2026/09/15` | Date range |
| `older_than:1y`, `newer_than:7d` | Relative dates |
| `larger:10M` | Size, for clean-up |
| `in:anywhere` | Include Spam and Trash |
| `-from:noreply` | Exclude |
| `OR`, `( )`, `" "` | Boolean, grouping, phrase |

Click the options triangle at the right of the search bar for a form that builds the same query and, crucially, offers **Create filter** from it.

```text
from:@agency.com has:attachment filename:xlsx newer_than:30d
from:(jennifer OR mark) subject:(report OR matrix) -label:status-waiting
larger:15M older_than:2y
```

### Conversation view

Gmail groups replies into one conversation. It saves scrolling but hides which message an attachment came from; **Settings → General → Conversation view off** switches to one row per message, which some clients prefer for auditing. Keep it on for your own account and check what the client expects on theirs.

### Compose habits

- `c` opens compose; `Ctrl+Enter` sends; `Shift+?` shows all shortcuts (enable them under Settings → General → Keyboard shortcuts).
- **Undo Send** (Settings → General) can be set to 30 seconds; it is a delay, not a recall, and it is the Gmail equivalent of the Outlook deferred-delivery rule.
- **Schedule send** (the arrow next to Send) delivers at a chosen time: write at 11 pm PKT, land at 9 am CT.
- **Confidential mode** sets an expiry and blocks forwarding, but the recipient can still screenshot; treat it as etiquette, not security.
- Attachments over 25 MB become Drive links automatically.

### Signature and vacation

**Settings → General → Signature** supports several signatures with a default for new mail and for replies. The **Vacation responder** in the same tab is Gmail's out-of-office, with a date range and an option to reply only to contacts or only to people in the organisation.

### Snooze and tasks

**Snooze** hides a conversation until a chosen time and returns it to the top of the Inbox, which is the simplest "Waiting" mechanism there is. The right-side panel opens **Tasks**; dragging an email onto it creates a task with a link back to the thread. Between labels, stars, snooze and tasks, Gmail covers what Outlook does with folders, categories, flags and To Do.

> **Tip:** Archive, do not delete. Storage is pooled and cheap, search is instant, and a client asking "what did we agree in March" is answered in seconds from All Mail. Deleting to tidy an Inbox is the most common way assistants lose evidence.

### Try It Yourself

```text
Gmail setup for a client account

1. Settings → General: keyboard shortcuts on; Undo Send 30 s; Stars: 4 stars
2. Settings → Inbox: Default; Importance markers off
3. Settings → Labels: create Clients/*, Status/Action, Status/Waiting, Type/*
4. Settings → General → Signature: full + reply versions, time zone line
5. Saved searches (bookmark the URL):
   https://mail.google.com/mail/u/0/#search/from%3A%40agency.com+has%3Aattachment
6. Test: search "larger:10M older_than:1y" to see what eats storage
```

### Quiz

1. What does Archive do in Gmail?
- [ ] Deletes the message after 30 days
- [x] Removes the Inbox label; the message stays in All Mail and under other labels
- [ ] Moves the message to Spam
> Labels are tags; Inbox is just one of them.

2. Which search finds spreadsheets from the agency in the last month?
- [ ] `agency xlsx month`
- [x] `from:@agency.com filename:xlsx newer_than:30d`
- [ ] `attachment:xlsx date:30`
> `filename:` matches attachment names or extensions; `newer_than:` takes d, m or y.

3. Is Undo Send a recall?
- [ ] Yes, it retrieves sent mail from the recipient
- [x] No, it delays sending for up to 30 seconds
- [ ] Only for Workspace accounts
> Once the delay passes the message is delivered and cannot be pulled back.

4. How do you find a message that landed in Spam?
- [x] Add `in:anywhere` to the search
- [ ] Spam is unsearchable
- [ ] Use `is:spam` only from the Spam folder
> Default search excludes Spam and Trash; `in:anywhere` includes them.

### Exercises

1. **Label plan** — Map the Outlook folder structure from the previous chapter to Gmail labels and explain one difference in behaviour.
<details><summary>Solution</summary>

`01 Action` → `Status/Action`, `02 Waiting` → `Status/Waiting` (or snooze), `03 Reports sent` → `Type/Report` plus `in:sent`, `Clients/...` → `Clients/...`, `Reference` → `Reference`. Difference: a Gmail conversation can be under `Clients/Agency Houston` and `Type/Invoice` at once, and archiving keeps both; in Outlook the message is in one folder and the second dimension needs categories.

</details>

2. **Storage clean-up** — Write three searches that find what to delete or move to Drive in an account that is full.
<details><summary>Solution</summary>

`larger:20M older_than:1y` (big old attachments), `has:attachment from:noreply older_than:2y` (automated reports), `in:spam OR in:trash` (empty both). For messages worth keeping, open the attachment and use Add to Drive before deleting the mail.

</details>

### Interview Questions

**Q: Explain the Gmail label model to someone who has only used Outlook.**
In Outlook a message is in one folder; in Gmail a message can carry many labels and shows under each of them, with Inbox itself being a label. Archiving removes the Inbox label without deleting anything, so nothing is ever lost, just unlabelled, and All Mail holds everything. That means you file less and search more: I set up labels for client and type, use snooze for waiting items, and rely on operators like `from:`, `filename:` and `newer_than:` to find anything in seconds. The mental shift is from "put it somewhere" to "tag it and find it".

**Q: How do you make a Gmail work account safe against sending mistakes?**
Undo Send at 30 seconds, which is a delay, plus the built-in warnings for missing attachments and for external recipients that Workspace admins can enable. I disable smart compose suggestions on client accounts so an autocompleted wrong name does not slip in, and I check the To line against the thread before Ctrl+Enter. For scheduled reports I use Schedule send so I can review in the morning before it goes out at 9 am in the client's zone. None of these are recalls, so care at the To line is still the real control.

**Q: A client says Gmail search "does not work" for them. What do you check?**
Usually they are searching a phrase with the wrong scope or expecting Outlook's behaviour. I check whether the message is in Spam or Trash (`in:anywhere`), whether they typed a name that Gmail matches only against the display name (`from:` with the address is safer), and whether conversation view is hiding the message inside a thread. Then I show the advanced search form so they can see the operators being built, and I bookmark two or three saved searches for their common needs. Ninety percent of "search does not work" is a missing `in:anywhere` or a filter that auto-archived the message.

## Calendars & scheduling across time zones (UTC+5 with US clients)

A virtual assistant in Lahore serves clients in Houston, New York, London and Dubai from one calendar. Pakistan Standard Time is **UTC+5 all year** with no daylight saving; the United States shifts twice a year, so the gap between you and a Texas client is 10 hours in winter and 11 in summer... in the other direction. Getting this wrong once costs a meeting; getting it wrong in a scheduled report costs a client. This chapter fixes the arithmetic and the tooling.

### The offsets you need

| Zone | Winter (standard) | Summer (DST, mid-Mar to early Nov) | 9:00 there is (PKT) |
|---|---|---|---|
| US Eastern (New York) | UTC-5 (EST) | UTC-4 (EDT) | 19:00 winter, 18:00 summer |
| US Central (Houston, Chicago) | UTC-6 (CST) | UTC-5 (CDT) | 20:00 winter, 19:00 summer |
| US Mountain (Denver) | UTC-7 (MST) | UTC-6 (MDT) | 21:00 winter, 20:00 summer |
| US Pacific (Los Angeles) | UTC-8 (PST) | UTC-7 (PDT) | 22:00 winter, 21:00 summer |
| UK (London) | UTC+0 (GMT) | UTC+1 (BST) | 14:00 winter, 13:00 summer |
| Gulf (Dubai) | UTC+4 all year | — | 10:00 |
| Pakistan (Lahore) | UTC+5 all year | — | 09:00 |

US DST starts on the second Sunday of March and ends on the first Sunday of November; the UK changes on the last Sundays of March and October. In the two or three weeks when one has changed and the other has not, every recurring meeting moves by an hour for one side. Put both dates in your own calendar every year.

### Rule: always name the zone

Write times with an IANA zone or a standard abbreviation and, ideally, both parties' local times: `Tue 16 Sep, 9:00 CT / 19:00 PKT`. Avoid "EST" in summer (it is EDT), and avoid "IST", which means India, Israel or Ireland depending on the reader. In calendars, set the event's time zone explicitly rather than converting in your head.

### Outlook calendar

- **File → Options → Calendar → Time zones**: label your zone and add a second and third (classic Outlook shows up to three side by side in Day and Week views; new Outlook and web support multiple as well under Settings → Calendar → View).
- **Work hours** in the same options tab tell colleagues when you are available; set them to your real hours in PKT, which show correctly in their zone in the Scheduling Assistant.
- When creating a meeting, click **Time Zones** on the ribbon to set the start and end zones explicitly, e.g. 9:00 Central; Outlook converts for every attendee.
- **Scheduling Assistant** shows attendees' free/busy across zones; **Scheduling poll** (formerly FindTime) lets external clients vote on times.
- Recurring meetings are anchored to the zone in which they were created. A weekly call created in Central time stays at 9:00 CT through DST and therefore moves in PKT; create it in the client's zone if the client must not move.

### Google Calendar

- **Settings → General → Time zone**: primary zone, tick **Display secondary time zone** and label both. The **World clock** (Settings → World clock) adds a sidebar with several cities.
- In an event, click the time zone link next to the time to set start and end zones.
- **Working hours & location** under Settings → General let the client see when you are reachable.
- **Appointment schedules** (Business plans) publish a booking page that converts automatically for the visitor.
- Calendar invitations between Google and Microsoft work by email (iCalendar `.ics`); accepting on either side updates both. Teams and Meet links both survive the crossing.

### Converting in a spreadsheet

For a report that lists deadlines in the client's zone, do the arithmetic in the sheet rather than by hand:

```text
Excel (a datetime in A2 in PKT, converting to US Central with DST logic):
  Second Sunday of March: =DATE(YEAR(A2),3,14)-WEEKDAY(DATE(YEAR(A2),3,14))+1
  First Sunday of November: =DATE(YEAR(A2),11,7)-WEEKDAY(DATE(YEAR(A2),11,7))+1
  Offset hours (PKT→CT): =IF(AND(A2>=B2+2/24, A2<C2+2/24), -10, -11)
  Central time: =A2 + D2/24

Google Sheets (same idea) or simply:
  =A2 - TIME(10,0,0)  in winter, =A2 - TIME(11,0,0) in DST
```

The Excel version derives the DST switch dates from the year so the sheet stays right next year; the +2/24 converts the 2 am local switch. Python's `zoneinfo` (`datetime.now(ZoneInfo("America/Chicago"))`) is the exact route for anything scripted.

### Scheduling etiquette

- Offer two or three slots inside the overlap window: for Houston that is roughly 18:00–22:00 PKT (8:00–12:00 CT).
- State the duration and the platform (Teams or Meet) in the invitation title: `Weekly production sync – 30 min – Teams`.
- Send agendas as the invitation body, not as a separate email.
- For a client in a zone with DST, add a note to the recurring invite: "Anchored to Central time; PKT shifts on 8 Mar and 1 Nov".
- Confirm any meeting booked more than a week ahead the day before, with both local times.

> **Warning:** A scheduled email or Power Automate flow runs in the zone of the account or the flow, not the reader's. A "9 am report" scheduled from a PKT account arrives at 22:00 or 23:00 the previous evening in Houston unless the schedule is set in the client's zone. Check the zone setting on every scheduled job.

### Try It Yourself

```text
Convert and confirm a meeting request

Client (Houston) : "Can we do Thursday at 10?"        Date: Thu 18 Sep 2026 (CDT, UTC-5)
Arithmetic       : 10:00 CDT = 15:00 UTC = 20:00 PKT
Your reply       : "Confirmed: Thursday 18 September, 10:00 CDT / 20:00 PKT,
                    30 minutes, Teams link in the invite."
Invite           : Outlook → New Meeting → Time Zones → start zone Central (US & Canada)
                   Title: Rate matrix review – 30 min – Teams
Recurring?       : Anchor to Central; note PKT shift on 1 Nov 2026 (becomes 21:00 PKT)
```

### Quiz

1. What is 9:00 am Central Daylight Time in Pakistan Standard Time?
- [ ] 18:00 PKT
- [x] 19:00 PKT
- [ ] 20:00 PKT
> CDT is UTC-5, so 9:00 CDT is 14:00 UTC and 19:00 in UTC+5.

2. Why avoid writing "EST" in July?
- [ ] EST is not a real abbreviation
- [x] The US East is on EDT (UTC-4) in summer, so EST is wrong by an hour
- [ ] Clients prefer UTC
> Write ET, or the precise EDT/EST, or better both local times.

3. A weekly call created in Central time: what happens to its PKT time when US DST ends?
- [ ] Nothing
- [x] It moves one hour later in PKT
- [ ] It moves one hour earlier in PKT
> The event stays at 9:00 CT; Central shifts from UTC-5 to UTC-6, so PKT goes from 19:00 to 20:00.

4. Where do you add a second time zone in classic Outlook?
- [x] File → Options → Calendar → Time zones
- [ ] View → Layout
- [ ] Home → Categorize
> Up to three zones show side by side in Day and Week views.

### Exercises

1. **Overlap window** — A client is in Los Angeles (PDT). List the PKT hours that fall inside their 9:00–17:00 working day and pick two slots that are reasonable for both.
<details><summary>Solution</summary>

PDT is UTC-7, so 9:00–17:00 PDT is 21:00–05:00 PKT. Reasonable overlap is early in their day and late in yours: 21:00 or 22:00 PKT (9:00 or 10:00 PDT). Anything later is night in Lahore, so offer those two and state that you can do 21:00–23:00 PKT on request.

</details>

2. **DST dates** — Write the Excel formulas returning the US DST start and end dates for the year in cell A1.
<details><summary>Solution</summary>

Start (second Sunday of March): `=DATE(A1,3,14)-WEEKDAY(DATE(A1,3,14))+1`. End (first Sunday of November): `=DATE(A1,11,7)-WEEKDAY(DATE(A1,11,7))+1`. Both find the latest possible date of the target Sunday and step back to the Sunday on or before it.

</details>

### Interview Questions

**Q: How do you avoid time-zone mistakes when scheduling for US clients from Pakistan?**
Three habits. Every time I write includes both local times and the zone abbreviation, for example "10:00 CDT / 20:00 PKT". Every calendar event is created with an explicit start zone in the client's zone rather than converted in my head, so DST is handled by the calendar. And I keep the US and UK DST change dates in my own calendar with a reminder to re-confirm recurring meetings that week. Since adopting that I have not missed a client call, and the one near miss was a scheduled Power Automate report that ran in PKT rather than CT, which is why I now check the zone on every scheduled job.

**Q: A recurring weekly meeting suddenly shows at the wrong hour for the client. What happened?**
Almost always DST: one side changed clocks and the other did not, or the recurrence was created in the wrong zone. If the meeting was created anchored to Pakistan time, it stays fixed in PKT and moves in the client's zone when they change clocks, which they see as "wrong". The fix is to recreate or edit the series with the start zone set to the client's zone so it stays fixed for them and moves for me, and to tell attendees in the invite body. I also check whether the invitation crossed between Google and Microsoft, since an `.ics` with a floating time and no zone can be misread.

**Q: How do you present availability to a new client without a back-and-forth?**
I state my working hours in their zone in my signature and in the first email, and I send a booking link (Outlook's Scheduling poll or Google Calendar's appointment schedule) that shows only the overlap window and converts to the visitor's zone automatically. For a Houston client that window is 8:00–12:00 CT. If the client prefers email, I offer three specific slots with both local times and a duration. Making the first scheduling exchange effortless is part of the impression that I am organised, which is the actual product.

# LEVEL: Intermediate

## Outlook rules, Quick Steps & templates (Quick Parts)

Once a mailbox is organised, the next step is to stop doing the organising by hand. Outlook has three automation layers: **rules** react to messages as they arrive or are sent, **Quick Steps** run several actions on a selected message with one click, and **templates** (Quick Parts, My Templates and `.oft` files) stop you retyping the same text. Together they turn a 200-message day into a 40-minute task.

### Rules

**Home → Rules → Manage Rules & Alerts → New Rule** (classic) or **Settings → Mail → Rules** (new Outlook and web). A rule has conditions, actions and exceptions:

```text
Rule: Route weekly reports from the Houston agency
  Apply this rule after the message arrives
  Condition : from people or public group = @agency.com
              AND with "production report" in the subject
  Action    : move it to the "03 Reports sent" folder
              AND assign it to the "Report" category
              AND flag message for follow up Today
  Exception : except if it is marked as High importance
```

Rules run in order from the top of the list; **stop processing more rules** as a final action prevents a later rule from moving the message again. **Client-side** rules (those that play a sound, move to a `.pst`, or use a Quick Step) run only when Outlook is open; **server-side** rules (move, categorise, forward, delete) run on Exchange even when your laptop is off, which is what you want for a shared or client mailbox.

Useful rules for back-office work:

| Purpose | Condition | Action |
|---|---|---|
| Newsletter quarantine | from `noreply@` or `newsletter` in subject | move to Reference/Newsletters, mark read |
| Invoice routing | attachment name contains `invoice` | category Invoice, move Clients/<name> |
| Escalation | from client AND `[URGENT]` in subject | display Desktop Alert, forward to manager |
| Send delay | rule on sent messages | defer delivery 1 minute |
| Auto-reply from a shared mailbox | rule on the shared mailbox with "have server reply using a specific message" | acknowledge receipt |

Rules cannot do arithmetic or look up a spreadsheet; that is where Power Automate begins (Advanced level).

### Quick Steps

The **Quick Steps** gallery on the Home tab (classic Outlook only; new Outlook has a simpler "Quick steps" in Settings → Mail) applies a sequence of actions to whatever is selected. **Create New** and choose actions:

```text
Quick Step: "Client → Done"
  1. Move to folder: Clients/Agency Houston
  2. Clear categories: Action
  3. Categorize message: Done
  4. Mark as read
  Shortcut: Ctrl+Shift+1

Quick Step: "Forward to Accounts"
  1. Forward to: accounts@agency.com
  2. Text: "Please process – Ali"
  3. Move to folder: 02 Waiting
  Shortcut: Ctrl+Shift+2
```

Where a rule reacts automatically, a Quick Step waits for a human decision, which is right for anything involving forwarding to a person.

### Templates: three mechanisms

1. **Quick Parts** (classic): select text in a new message, **Insert → Quick Parts → Save Selection to Quick Part Gallery**. Name it, and later type the name and press F3, or pick it from the gallery. Quick Parts are stored in `NormalEmail.dotm` in your Templates folder, so back that file up and copy it to a new PC.
2. **My Templates** add-in (classic, new Outlook and web): **Message tab → View Templates** (or the Apps button). Templates sync with the mailbox, so they follow you to any device, but they are plain text plus simple formatting only.
3. **Outlook template files (.oft)**: compose the message with subject, recipients and attachments, then **File → Save As → Outlook Template**. Open via **New Items → More Items → Choose Form → User Templates in File System**. This is the only mechanism that stores a subject and attachments.

```text
Quick Part "Report cover note"

Hi {Name},

The {Period} production report is attached.

Summary:
• Files completed: {N}
• Corrections applied: {N}
• Open items: {text}

Could you approve by {Day Date, time CT} so it goes to the regional team on {Day}?

Thanks,
Ali
```

Braces are a visual reminder to fill in the fields; nothing in Quick Parts substitutes them automatically. For true merge fields you would use Mail Merge from Word or a Power Automate flow.

### Signatures as templates

A signature can hold a whole boilerplate block, such as a delivery note or a legal footer, and can be swapped per message from **Message → Signature**. Some assistants keep three "signatures" that are really templates; it works, but My Templates is cleaner.

### Testing rules safely

New rules offer **Run this rule now on messages already in "Inbox"**; run it on a test folder first. Export your rules (**Manage Rules & Alerts → Options → Export Rules**) to an `.rwz` file before big changes and when handing a mailbox to someone else.

> **Warning:** Never create a rule that forwards client mail to an external address without written approval. Many tenants block external auto-forwarding by policy, and where they do not, it is the classic sign of a compromised mailbox; an admin who sees it will disable your account first and ask questions later.

### Try It Yourself

```text
Build the "report cycle" automation

Rule 1 (server-side): from @agency.com + subject "production report"
    → move 03 Reports sent, category Report, flag Today, stop processing
Rule 2 (server-side): subject contains "[URGENT]" → category Action, Desktop Alert
Rule 3 (client-side, on send): defer delivery 1 minute
Quick Step "Client → Done": move Clients/Agency Houston, category Done, mark read, Ctrl+Shift+1
Quick Part "Report cover note": Insert → Quick Parts → Save Selection…
.oft "Weekly report": subject + To pre-filled, saved to Templates folder
Export: Manage Rules & Alerts → Options → Export Rules → rules-2026-09.rwz
```

### Quiz

1. Which rule type runs while Outlook is closed?
- [ ] Client-side
- [x] Server-side
- [ ] Neither; rules require Outlook open
> Move, categorise, forward and delete run on Exchange; alerts and .pst moves need the client.

2. What is the difference between a rule and a Quick Step?
- [x] A rule runs automatically on arrival; a Quick Step runs on a selected message when clicked
- [ ] Quick Steps are server-side
- [ ] Rules can only move messages
> Quick Steps are manual macros; rules are automatic.

3. Which template mechanism stores a subject and attachments?
- [ ] Quick Parts
- [ ] My Templates
- [x] An .oft Outlook Template file
> Quick Parts and My Templates hold body text only.

4. Where are Quick Parts stored?
- [ ] In the mailbox
- [x] In NormalEmail.dotm in the user's Templates folder
- [ ] In the Registry
> Back the file up; it does not sync between PCs.

### Exercises

1. **Invoice pipeline** — Design rules and a Quick Step so that supplier invoices are categorised on arrival and can be forwarded to accounts with one keystroke.
<details><summary>Solution</summary>

Rule (server-side): attachment name contains "invoice" OR subject contains "invoice" → category Invoice, move Clients/<client>, stop processing. Quick Step "To Accounts" (Ctrl+Shift+3): forward to accounts@..., text "For payment – Ali", category Waiting, move 02 Waiting. The rule tags automatically; the human decides to forward.

</details>

2. **Rule order bug** — Rule A moves all agency mail to Clients/Agency; Rule B is meant to move agency reports to 03 Reports sent, but reports end up in Clients/Agency. Fix it.
<details><summary>Solution</summary>

Move Rule B above Rule A in Manage Rules & Alerts (Move Up) and add "stop processing more rules" to Rule B. Rules run top to bottom; the more specific rule must run first and stop.

</details>

### Interview Questions

**Q: How would you automate a shared production mailbox that receives 300 messages a day?**
First classify the traffic for a week: automated reports, client requests, vendor invoices, noise. Then server-side rules for everything predictable: reports to a Reports folder with a category and a flag, invoices tagged and routed, newsletters out of the Inbox, urgent-tagged mail raising an alert. A small set of Quick Steps for the human decisions, such as "assign to me", "forward to accounts", "done". Templates for the ten replies that cover 80 percent of requests. I export the rules and document them in a one-page SOP so the next person can maintain them. On a similar mailbox this cut triage from two hours to about thirty minutes a day.

**Q: What are the limits of Outlook rules, and what do you use beyond them?**
Rules match simple conditions on headers, subject, body text and attachments and perform fixed actions; they cannot parse an attachment, look up a customer in a spreadsheet, wait for approval or branch on data. Client-side rules also stop when Outlook is closed. Beyond that I use Power Automate: a flow triggered by a new email can save attachments to SharePoint, add a row to an Excel table, start an approval and post to Teams. Rules are for routing; flows are for processes.

**Q: How do you keep templates consistent across a team?**
For body text I use the My Templates add-in because it syncs with the mailbox and works in new Outlook and on the web, and I keep a master copy of every template in a SharePoint document so edits are reviewed in one place. For messages with a fixed subject and attachment I distribute `.oft` files from a shared folder. Quick Parts I avoid for teams because they live in each person's NormalEmail.dotm and drift. Each template carries a version date in its name so I can tell who is using an old one.

## Gmail filters, templates & multiple inboxes

Gmail's automation mirrors Outlook's, with different names: **filters** are rules, **templates** are canned responses, and **multiple inboxes** let you see several saved searches as panels on one screen. Because Gmail is search-driven, every automation starts from a search you can already run.

### Filters

Build the search first, then click the options triangle in the search bar and **Create filter**. Filter actions:

- Skip the Inbox (Archive it)
- Mark as read
- Star it
- Apply the label
- Forward it to (a verified address)
- Delete it
- Never send it to Spam
- Always or never mark it as important
- Categorize as (Primary, Social, Promotions...)
- Also apply filter to matching conversations (runs it on existing mail)

```text
Filter 1: from:(@agency.com) subject:("production report")
   → Apply label Type/Report, Star it, Never send to Spam

Filter 2: from:(noreply OR newsletter OR notifications)
   → Skip the Inbox, Apply label Reference/Newsletters, Mark as read

Filter 3: subject:([URGENT])
   → Star it (red bang), Always mark as important, Forward to manager@…
```

Filters live under **Settings → See all settings → Filters and Blocked Addresses**, where you can also **Export** them as an XML file and **Import** into another account, which is how you replicate a setup across client accounts. Filters run in the order they were created and all matching filters apply, unlike Outlook where "stop processing" exists; if two filters give conflicting labels, both labels stick.

Filters are server-side by nature: they run on Google's servers whether or not you have Gmail open, and they apply to mail fetched by the mobile app too.

### Templates

Enable **Settings → Advanced → Templates**. In a compose window, write the message, then **More (three dots) → Templates → Save draft as template → Save as new template**. To use one, **More → Templates → pick the name**; it inserts the body and, if the template had one, replaces the subject. Templates can include your signature, so create them with the signature removed or you will get two.

Templates can also be triggered by a filter: the "Send template" action replies automatically with a template to matching mail, which is the Gmail way to acknowledge receipts on a support address. Use it carefully with a condition that excludes mailing lists.

```text
Template: "Fiverr delivery – EPUB"

Hi {Name},

Your EPUB is attached and validated:
• EPUBCheck: 0 errors, 0 warnings
• Tested on Kindle Previewer, Apple Books and Calibre
• Cover: 1600 × 2560 px, embedded

Please review on your devices. Two revision rounds are included; just list
the changes in one message and I'll turn them around within 24 hours.

Thanks,
Ali
```

### Multiple inboxes

**Settings → Inbox → Inbox type → Multiple inboxes** turns the Inbox into panels, each a saved search, shown to the right of or below the main Inbox:

```text
Section 1: label:status-action           title "Action"
Section 2: label:status-waiting          title "Waiting"
Section 3: is:starred -label:status-done title "Starred"
Section 4: from:@agency.com newer_than:7d title "Agency, last 7 days"
Section 5: label:type-invoice is:unread  title "New invoices"
```

Set **Maximum page size** per section and position. It is the closest Gmail comes to an Outlook dashboard, and it makes a "Waiting" workflow visible without opening a label.

### Snooze, nudges and auto-advance

- **Nudges** (Settings → General) resurface sent mail without a reply after a few days; useful for chasing clients, noisy on high-volume accounts.
- **Auto-advance** (Settings → Advanced) opens the next conversation after archiving instead of returning to the list, which speeds triage.
- **Send and Archive** button (Settings → General) replies and archives in one click.

### Delegation preview

Gmail can grant another user access to read, send and delete on your behalf (**Settings → Accounts and Import → Grant access to your account**), which is the mechanism for an assistant working in the client's own mailbox. The Advanced level covers it with Outlook's equivalents; for now note that filters and templates belong to the mailbox owner, so a delegate uses the owner's filters, not their own.

### Comparing the two systems

| Need | Outlook | Gmail |
|---|---|---|
| Automatic routing | Rules (server or client) | Filters (always server) |
| Stop after first match | "stop processing more rules" | Not available; all filters apply |
| One-click macro | Quick Steps | No equivalent; keyboard shortcuts + labels |
| Body templates | Quick Parts, My Templates | Templates (canned responses) |
| Subject + attachment templates | .oft files | Not supported; use Drive links in body |
| Dashboard of saved searches | Search Folders | Multiple inboxes |
| Export automation | .rwz | Filters XML export |

> **Tip:** Name labels with a prefix and create filters that apply them by label name, not colour, then export the filters XML and keep it with the client's platform sheet. Rebuilding a client account after a reset takes ten minutes instead of an afternoon.

### Try It Yourself

```text
Gmail automation for a Fiverr/Upwork VA account

Filters (Settings → Filters and Blocked Addresses):
  from:(fiverr.com) subject:("New message")  → label Platforms/Fiverr, star
  from:(upwork.com) subject:(proposal OR invite) → label Platforms/Upwork, star
  from:(noreply OR newsletter)                → skip Inbox, label Reference, mark read
Templates (Settings → Advanced → Templates: enable):
  "Delivery – EPUB", "Delivery – DOCX form", "Scope confirmation", "Revision received"
Multiple inboxes (Settings → Inbox):
  label:status-action | label:status-waiting | label:platforms-fiverr is:unread
Export: Filters → select all → Export → gmail-filters-2026-09.xml
```

### Quiz

1. How do you start creating a Gmail filter?
- [ ] Settings → Labels → New filter
- [x] Build a search, open the search options, and click Create filter
- [ ] Right-click a message → Rules
> Filters are saved searches with actions; the search comes first.

2. What happens when two filters match the same message?
- [ ] Only the first runs
- [x] Both apply their actions
- [ ] Gmail asks which to use
> There is no stop-processing option; design filters so overlaps do not conflict.

3. Which setting enables templates?
- [ ] Settings → General → Templates
- [x] Settings → Advanced → Templates
- [ ] They are always on
> Templates (formerly canned responses) must be enabled under Advanced.

4. What does Multiple inboxes show?
- [ ] Several Gmail accounts
- [x] Several saved searches as panels beside the Inbox
- [ ] The Inbox split by date
> Each section is a search query with a title and a page size.

### Exercises

1. **Filter conflict** — Filter A labels all agency mail `Clients/Agency`; Filter B labels agency reports `Type/Report` and skips the Inbox. A report arrives. What labels does it get and where is it?
<details><summary>Solution</summary>

Both filters apply: labels `Clients/Agency` and `Type/Report`, and because Filter B skips the Inbox, it is archived (no Inbox label). That is usually fine in Gmail because labels stack; if you want reports in the Inbox, remove "Skip the Inbox" from Filter B.

</details>

2. **Auto-acknowledge** — Set up an automatic reply to any message sent to `support@client.com` that is not from a mailing list.
<details><summary>Solution</summary>

Create a template "Support acknowledgement". Filter: `to:support@client.com -list:* -from:(noreply OR mailer-daemon)` → action "Send template: Support acknowledgement". Test with a colleague's address before enabling, and remember Gmail does not auto-reply to the same sender more than once in a short period.

</details>

### Interview Questions

**Q: You are handed a new Gmail account for a client with 4,000 unread messages. What do you do in the first hour?**
Search, not read. `larger:10M older_than:1y` and `from:noreply` show what to archive in bulk; `from:@` searches for the top five senders show the real correspondents. I create the label structure and five or six filters, each with "Also apply to matching conversations" so the backlog is labelled retroactively, then archive everything not labelled Action. Multiple inboxes for Action and Waiting give the client a dashboard. By the end of the hour the Inbox holds only genuinely open items and the filters keep it that way.

**Q: Compare Gmail filters with Outlook rules from an operations viewpoint.**
Filters always run server-side and apply retroactively with one tick, which is simpler than Outlook's client/server split and its "run rule now" dialog. Outlook rules have ordered execution with "stop processing", exceptions, and richer actions such as Desktop Alerts, deferred delivery and forwarding as attachment; Gmail filters have no ordering and no exceptions beyond negative search terms. For a shared support mailbox I find Outlook's precision easier to reason about; for a personal or VA account, Gmail's search-first filters are faster to build and export as XML.

**Q: How do you keep canned responses professional rather than robotic?**
The template carries the structure and the facts that never change: what is attached, what was validated, what the revision terms are. The first line and the last line are always written fresh for the person, using their name and something specific from their message. I also review templates quarterly, because a template that still mentions a tool version from last year signals neglect. On Fiverr, buyers can tell the difference between a template pasted whole and one that opens with the actual thing they asked about.

## OneDrive/SharePoint: sharing, permissions, version history

Files in Microsoft 365 live in **SharePoint** document libraries, whether you reach them through a SharePoint site, a Teams channel's Files tab or your own **OneDrive** (which is a personal SharePoint site). Understanding one permission model and one versioning model therefore covers all three. This chapter covers sharing links, permission levels, version history, sync and recovery.

### Personal versus team storage

| | OneDrive | SharePoint site / Teams channel |
|---|---|---|
| Owner | One user | The site or Microsoft 365 group |
| Default access | Only you | Site members (owners, members, visitors) |
| Fate when a user leaves | Deleted after retention (default 30 days, admin can extend); manager can be given access | Unaffected |
| Best for | Drafts, personal working files | Anything the team needs |

### Sharing links

Select a file → **Share**. The link settings dialog asks who the link should work for:

1. **Anyone with the link**: no sign-in required; can be blocked by the admin; supports expiry date and password; use only for public material.
2. **People in \<organisation\>**: anyone signed in to the tenant.
3. **People with existing access**: a link that grants nothing new, for pointing at a file someone already has.
4. **Specific people**: named internal or external addresses; external users get a one-time code or sign in as guests.

Then the permission: **Can edit**, **Can view**, and for Word documents **Can review** (suggestions only, no direct edits). **Block download** on view links stops offline copies of sensitive files. A link is an object: **Manage access** on the file lists every link and every person, and links can be removed individually.

```text
Share "Rate matrix 2026-Q4.xlsx"
  Link type      : Specific people → jennifer@agency.com, mark@agency.com
  Permission     : Can view, Block download ☑
  Expires        : 30 Sep 2026
  Message        : "Q4 rates for review; comments in the Notes tab please"
```

### Permission inheritance

Permissions flow down from the site to libraries, folders and files. Sharing a single file **breaks inheritance** for that file, creating unique permissions, which is fine in small numbers and unmanageable in thousands. The rule: share folders or libraries to groups, share files to individuals only for exceptions, and prefer adding a person to the site's Members group over creating file links.

Site roles: **Owners** (full control, manage permissions), **Members** (edit), **Visitors** (read). A Teams team maps to a Microsoft 365 group whose members are site Members; a private channel gets its own site.

### Version history

Every save creates a version. Right-click a file → **Version history** (in Word or Excel: **File → Info → Version History**). You can open, restore or delete any version. Defaults: SharePoint keeps 500 major versions per file (admins can set automatic trimming); OneDrive similar. Versions count against storage, so a 40 MB PowerPoint saved 100 times can occupy 4 GB unless trimmed.

```text
Version history – Handbook_v12.docx
  12.0  16 Sep 2026 14:02  Ali Raza      3.1 MB   ← current
  11.0  16 Sep 2026 11:47  Jennifer Lee  3.1 MB
  10.0  15 Sep 2026 18:15  Ali Raza      3.0 MB
  ...
  Restore 11.0 → becomes 13.0 (restoring never deletes history)
```

**Check out** (library setting or the file's menu) locks a file so only you can edit until you check in with a comment; use it for files that must not be co-authored, such as a `.dotx` template suite or a macro-enabled workbook.

### Co-authoring and AutoSave

Word, Excel and PowerPoint files on OneDrive or SharePoint support simultaneous editing; you see collaborators' cursors and **AutoSave** is on. Files that cannot co-author: `.xlsm` with certain macros, files with legacy features, files opened from a synced folder that is offline. If AutoSave is off unexpectedly, the file is either local, checked out, or has a feature blocking it.

### Sync

The OneDrive client syncs your OneDrive and any SharePoint library you choose (**Sync** or the newer **Add shortcut to OneDrive**). Files On-Demand shows placeholders and downloads on open. Do not sync more than a few hundred thousand files, avoid special characters (`" * : < > ? / \ |`) and paths over 400 characters, and never put a database-like file (Access, EndNote `.enl`, Outlook `.pst`) in a synced folder.

### Recovery

- **Recycle bin**: deleted files stay 93 days (first and second stage) in SharePoint and OneDrive.
- **Restore your OneDrive** (Settings → Restore) rolls the whole OneDrive back to any point in the last 30 days, which is the fix for ransomware or a bulk mistake.
- Admins can recover a departed user's OneDrive within the retention period.

> **Warning:** "Anyone with the link" and "Can edit" together on a folder is the most common data leak in small businesses: the link ends up in a forwarded email and the folder is now public and editable. Default to Specific people, set an expiry, and review **Manage access** on sensitive folders monthly.

### Try It Yourself

```text
Set up a client deliverables library (SharePoint)

1. Site "Production" → Documents → New folder "Deliverables/2026"
2. Site permissions: Members = agency staff group; Visitors = none external
3. Library settings → Versioning: major versions, keep 100; Require check-out: No
4. Share folder "Deliverables/2026/Handbook" → Specific people → publisher@… → Can view,
   Block download, expiry 60 days
5. Word → File → Info → Version History to confirm versions are recorded
6. OneDrive client → "Add shortcut to OneDrive" for Deliverables (not Sync)
7. Monthly: folder → Manage access → remove expired or unneeded links
```

### Quiz

1. Which link type requires no sign-in?
- [x] Anyone with the link
- [ ] People in your organisation
- [ ] Specific people
> Anyone links can be disabled by admins and should carry an expiry and a password.

2. What does "People with existing access" do?
- [ ] Grants edit access to everyone
- [x] Creates a link that grants nothing new; only those who already have access can open it
- [ ] Shares with the whole site
> Use it to point colleagues at a file without changing permissions.

3. What happens when you restore an old version?
- [ ] The newer versions are deleted
- [x] The old version becomes a new current version; history is kept
- [ ] The file is locked
> Version history is append-only; restoring is itself a new version.

4. Which file should never be in a synced OneDrive folder?
- [ ] A Word document
- [x] An Outlook .pst or EndNote .enl database
- [ ] A PDF
> Database-style files are written continuously and become corrupted by sync.

### Exercises

1. **Audit a folder** — A "Client contracts" folder has 14 sharing links. Describe how you list them and which you remove first.
<details><summary>Solution</summary>

Folder → Manage access shows Links and Direct access. Remove first any "Anyone" links (no sign-in), then "People in organisation" edit links on a confidential folder, then expired or unknown external addresses. Replace them with the site's Members group for staff and Specific people, view-only with expiry, for externals.

</details>

2. **Storage bloat** — A 45 MB PowerPoint has 300 versions. How much storage is that at worst, and what do you change?
<details><summary>Solution</summary>

Up to about 13.5 GB if every version were a full copy (SharePoint stores differences for Office files, so real usage is lower but still large). Library settings → Versioning → keep 50 major versions (or enable automatic version trimming), and delete old versions from the file's Version history after confirming nobody needs them.

</details>

### Interview Questions

**Q: How do you decide between OneDrive and SharePoint for a client's files?**
By who needs the file after I am gone. Personal drafts and scratch work go in OneDrive; anything the client or team depends on goes in a SharePoint library, usually the Files tab of the relevant Teams channel, because it belongs to the organisation and survives offboarding. I have seen a departed contractor's OneDrive hold the only copy of a rate matrix, recovered only because the admin caught it inside the retention window, and that is the story I tell clients when they push back on moving files to the site.

**Q: Explain sharing links and why "Specific people" is your default.**
A sharing link is an object with an audience (anyone, organisation, existing access, specific people) and a permission (view, edit, review), optionally with expiry, password and download blocking. Anyone links leak because they need no sign-in and travel in forwarded email; organisation links are fine internally but too broad for confidential folders. Specific people links name the recipients, log their access, and can be revoked per person in Manage access. For externals I add view-only, block download and a 30- or 60-day expiry so access ends by default rather than by memory.

**Q: A client edited the wrong file for two days and wants Monday's version back without losing anything. What do you do?**
Open Version history, identify Monday's version by timestamp and author, and open it read-only to confirm. Then either restore it, which makes it the current version while keeping the two days of edits as older versions, or, if both sets of changes are needed, download Monday's version and use Word's Compare (Review → Compare) to merge. Nothing in this is destructive; I explain that to the client first so they stop worrying and stop making more edits.

## Google Drive: sharing, permissions, shared drives

Google Drive is the file layer under Docs, Sheets, Slides and Gmail attachments. Its permission model is per file and per folder with three simple roles, plus **shared drives** for team ownership. This chapter covers the roles, link settings, shared drives, version history and the desktop client, and the traps that catch people coming from Microsoft.

### My Drive versus shared drives

| | My Drive | Shared drive |
|---|---|---|
| Owner | One user | The organisation |
| When the user leaves | Files must be transferred or they are deleted with the account | Nothing changes |
| Roles | Viewer, Commenter, Editor (plus Owner) | Viewer, Commenter, Contributor, Content manager, Manager |
| Available on | All accounts | Business Standard and above |

The rule matches SharePoint's: personal work in My Drive, anything the team depends on in a shared drive. A file in a shared drive is owned by the drive, so "who owns this file" and "the owner left" stop being problems.

### Sharing a file or folder

Select → **Share**. Two parts of the dialog:

1. **Add people and groups**: type addresses, choose **Viewer**, **Commenter** or **Editor**, optionally untick *Notify people*, add a message. For external addresses Google warns; the admin decides whether external sharing is allowed at all.
2. **General access**: **Restricted** (only added people) or **Anyone with the link**, with a role for the link. Workspace tenants also offer **\<Organisation name\>** as an audience, meaning anyone signed in to the domain.

Editors can by default re-share and change permissions; the gear icon in the Share dialog turns off **Editors can change permissions and share** and **Viewers and commenters can see the option to download, print, and copy**. Access **expiry** (an end date per person) is available on Business Standard and above for viewers and commenters.

```text
Share "Handbook_v12.docx" (in shared drive "Clients/Publisher UK")
  publisher@ukpress.co.uk  → Commenter, expires 30 Sep 2026
  General access           → Restricted
  Settings                 → Editors cannot change permissions
                           → Viewers cannot download/print/copy
```

### Folder permissions and inheritance

Permissions on a folder apply to everything inside; moving a file into a shared folder grants that folder's people access, and moving it out removes it. Unlike SharePoint, there is no "break inheritance" concept: a file inside a shared folder can have additional people but cannot exclude the folder's people. Structure sensitive material in its own folder rather than trying to hide one file inside a public folder.

### Shared drive roles

- **Manager**: manage members, settings, delete permanently.
- **Content manager**: add, edit, move, delete files (default for members).
- **Contributor**: add and edit, cannot move or delete.
- **Commenter** and **Viewer**: as for files.

Shared drive settings let managers block external members, block sharing outside the drive, and block download for viewers. A shared drive is also the unit for **Google Vault** retention rules and for the desktop client's streaming.

### Version history

Docs, Sheets and Slides record every change: **File → Version history → See version history** lists versions by time and author, lets you name a version (**Name current version**) and restore. Restoring creates a new version. Uploaded non-Google files (`.docx`, `.pdf`, `.xlsx`) keep versions when you **Manage versions** on the file, with each upload of a new version replacing the file but keeping the old for 30 days unless **Keep forever** is ticked (up to 100 versions).

```text
Version history – Weekly report (Sheets)
  16 Sep, 14:02  Ali Raza        "v12 – sent to regional"    ← named version
  16 Sep, 11:47  Jennifer Lee
  15 Sep, 18:15  Ali Raza        "v11"
  Show changes ☑ highlights cells edited in the selected version
```

### Docs, Sheets, Slides collaboration

Comments (`Ctrl+Alt+M`) with `@mentions` assign tasks and email the person; **Suggesting** mode in Docs is the equivalent of Word's Track Changes; **Approvals** (Business Standard+) lock a Doc for sign-off. Sheets' **Protected ranges** and Docs' section-level permissions are the nearest thing to per-section access. Every Google file also has an **Activity dashboard** showing who viewed it, which clients find useful for "did they read the contract".

### Drive for desktop

**Google Drive for desktop** mounts Drive as a drive letter (streaming, files download on open) or mirrors selected folders locally. It is the way to open Drive files in Excel or Word directly; Docs and Sheets appear as shortcut files that open in the browser. The same database-file warning applies: do not put `.pst`, `.enl` or Access files in a mirrored folder.

### Storage and ownership hygiene

Storage on Workspace is pooled per organisation. **Storage** in the left sidebar sorts files by size; large videos and old backups dominate. When a user leaves, the admin's offboarding wizard transfers My Drive ownership to a manager, but Docs shared from that account and links in emails break unless the transfer happened before deletion.

> **Tip:** When a client sends you a Drive link that says "Request access", do not click it repeatedly; the owner gets an email each time. Ask the client to add your client-domain address as Commenter or Editor on the folder, not the file, so later files in the same folder are visible without another round of requests.

### Try It Yourself

```text
Set up a shared drive for a Fiverr-style agency client

1. Drive → Shared drives → New → "Clients"
2. Manage members: agency staff = Content manager; you = Content manager; owner = Manager
3. Settings: block external members ☑; viewers cannot download ☑
4. Folders: Clients/Publisher UK/01 Briefs, 02 Working, 03 Delivered, 04 Invoices
5. Share "03 Delivered" → publisher@ukpress.co.uk → Viewer, expiry 60 days
6. Docs: File → Version history → Name current version "Delivered v1"
7. Activity dashboard → confirm the client viewed the file before chasing
```

### Quiz

1. Who owns a file in a shared drive?
- [ ] The person who uploaded it
- [x] The organisation, via the shared drive
- [ ] The Manager of the drive
> That is why shared-drive files survive when people leave.

2. Which role can add and edit but not move or delete files?
- [ ] Content manager
- [x] Contributor
- [ ] Commenter
> Contributor is the safe role for external collaborators who must upload deliverables.

3. How do you prevent editors from re-sharing a file?
- [ ] Set General access to Restricted
- [x] Turn off "Editors can change permissions and share" in the Share dialog settings
- [ ] Make them Commenters
> Restricted controls link access; the gear setting controls re-sharing by editors.

4. What does naming a version do in Docs?
- [ ] Locks the document
- [x] Labels a point in version history so it is easy to find and restore
- [ ] Creates a copy
> Named versions appear in the version list; unnamed ones are grouped by time.

### Exercises

1. **Migrate My Drive to a shared drive** — A departing manager's My Drive holds the client folder. List the steps and one thing that breaks.
<details><summary>Solution</summary>

Before the account is deleted: create the shared drive, then move the folder (a Manager of the shared drive with Editor access to the folder can move it; otherwise the admin transfers ownership first). Links in old emails to the files keep working because file IDs do not change on a move, but any file the manager shared from My Drive to external people loses those external permissions if the shared drive blocks external members.

</details>

2. **Compare with SharePoint** — Name two behaviours that differ between Drive folder sharing and SharePoint folder sharing.
<details><summary>Solution</summary>

Drive cannot exclude a file from its folder's audience (no broken inheritance), while SharePoint can give a file unique permissions. Drive links are per file or folder with a general-access setting, while SharePoint creates multiple link objects per file, each with its own audience and expiry, listed under Manage access.

</details>

### Interview Questions

**Q: A client keeps client files in the CEO's My Drive. What do you recommend and why?**
Move them to a shared drive. My Drive files are owned by one account: if the CEO's account is suspended, deleted or compromised, every link breaks and access is lost; and every share is a personal decision by one person. A shared drive is owned by the organisation, has role-based membership, blocks external members if needed and is the unit for Vault retention. The move preserves file IDs so existing links keep working, and I do it with the CEO present so ownership transfer needs no admin escalation.

**Q: How do you share a deliverable with an external client safely on Google Drive?**
Put the deliverable in a "Delivered" folder in the shared drive, add the client's address as Viewer or Commenter with an expiry date, keep General access on Restricted, and turn off download for viewers if the content is sensitive. I never use "Anyone with the link" for client work because the link cannot be traced or revoked per person. I check the Activity dashboard to confirm they opened it before following up, which avoids the "did you get it" email.

**Q: What are the limits of Google Drive permissions compared with SharePoint?**
Drive has three file roles and no way to give a file narrower access than its folder, so sensitive files need their own folder. There is no library-level versioning policy, no check-out, and expiry is for viewers and commenters only. SharePoint offers unique permissions per item, check-out, review-only links, download blocking on links, and DLP integration through Purview. For most small clients Drive's simplicity wins; for regulated document control, SharePoint's model is the reason to be on Microsoft.

## Teams & Google Meet: meetings, chat, files

Meetings and chat are where a remote back office becomes visible to the client. **Microsoft Teams** combines chat, channels, meetings and files (backed by SharePoint); **Google Meet** is meetings only, with **Google Chat** for messaging and Drive for files. Both integrate with their calendars, and both can be joined by external guests from the other platform. This chapter covers scheduling, meeting controls, chat conventions and where the files really live.

### Scheduling a meeting

- **Teams**: Outlook → New Teams Meeting (or Calendar → New meeting in Teams). The invitation contains a join link, a dial-in number if licensed, and **Meeting options** (who can bypass the lobby, who can present, whether to record automatically, whether chat is allowed).
- **Meet**: Google Calendar → event → **Add Google Meet video conferencing**; or meet.google.com → New meeting. Guest settings live under the event's Meet options: **Quick access** (whether people outside the organisation must knock), host management, recording.

Both generate a link that works in a browser without installing anything, which matters for clients on locked-down PCs.

### Controls a host should know

| Action | Teams | Meet |
|---|---|---|
| Admit from lobby / knocking | Lobby list in People pane; Meeting options → Who can bypass | Admit prompt; Meet settings → Quick access off |
| Mute all / disable mic | People → Mute all; Meeting options → Prevent attendees from unmuting | Host controls → Turn off microphones |
| Share screen | Share → screen, window, PowerPoint Live, Excel Live | Present now → tab, window, entire screen |
| Record | More → Record and transcribe; saved to OneDrive (chat meetings) or SharePoint (channel meetings) | Activities → Recording; saved to the organiser's Drive "Meet Recordings" (Business Standard+) |
| Breakout rooms | Breakout rooms icon | Activities → Breakout rooms |
| Live captions and transcript | More → Language and speech | More → Captions; transcripts on Standard+ |
| Q&A and polls | Q&A app, Forms polls | Q&A, Polls (Standard+) |

Share a **window** or a **tab**, not the whole screen, when client data or Outlook notifications might appear. In Teams, **PowerPoint Live** lets attendees navigate slides independently; **Excel Live** lets them edit a workbook inside the meeting.

### Chat conventions

Teams has **chats** (one-to-one or group, ephemeral) and **channels** (inside a team, persistent, threaded, with tabs). Google Chat has **direct messages** and **spaces**. A working convention for a client engagement:

```text
Teams team "Production Support"
  General         ← announcements only
  Reports         ← weekly reports posted with @mention to approver
  Rate matrices   ← working threads per quarter
  Files tab       ← the SharePoint library; do not attach files in chat
Chat with Jennifer ← quick questions; decisions copied to the channel
```

Rules that keep chat professional: reply in the thread, `@mention` only the people who must act, use **Mark as urgent** rarely, set a status message with hours in the client's zone, and paste decisions from chat into the channel or an email so they are searchable. Files dropped into a chat go to the sender's OneDrive with a share link; files posted in a channel go to the channel's SharePoint folder. That difference decides whether the team still has the file after you leave.

### Files inside Teams

The **Files** tab of a channel is a folder in the team's SharePoint library. Open in the desktop app, co-author, see version history, all as in the previous chapter. **Add cloud storage** connects a Google Drive or Dropbox folder as a tab for clients who insist on their own storage. Pinned tabs for the weekly report workbook or the SOP save people asking "where is it".

### Meet and Chat files

Google Chat attachments go to the sender's Drive (a "Chat" folder) unless the space has a shared drive attached; Meet recordings and transcripts go to the organiser's Drive and are shared with invitees on the calendar event. Move anything that matters into the shared drive.

### External guests

- A Teams guest from Gmail joins in the browser; for channels they need a **guest account** in the tenant (admin-controlled).
- A Meet guest from Outlook joins via the link and knocks; a Google account is required only if Quick access is off and the host enforces sign-in.
- Both platforms let the host block screen sharing and chat for guests.

### Meeting hygiene for a VA

Join two minutes early, camera on for the first minute at least, mute when not speaking, a neutral background or a blurred one, and a written summary within the hour: decisions, actions with owners and dates, next meeting. Recordings are not summaries; clients rarely rewatch them.

> **Interview note:** Interviewers for VA and operations roles like to ask "the client's Teams link does not work for their customer on Gmail; what do you do?" The answer is the browser join path, checking the lobby settings and Quick access equivalents, and sending a dial-in number if the client has audio conferencing.

### Try It Yourself

```text
Meeting SOP: weekly production sync (30 min, Teams)

Before : invite from Outlook, Time Zones → Central; agenda in body; Meeting
         options → Lobby: people in my org bypass, everyone else waits;
         Record automatically ☐
Start  : admit guests; share the report as a window (Excel Live if editing)
During : notes in the channel post "Sync 16 Sep – notes" as you go
After  : summary within 1 hour:
           Decisions: Harris County 2027 rates held until underwriting confirms
           Actions  : Ali – rerun validation (Wed 17 Sep); Jennifer – chase underwriting
           Next     : Thu 25 Sep, 10:00 CT / 20:00 PKT
         Recording (if any) link from OneDrive → moved to Reports channel Files
```

### Quiz

1. Where does a recording of a Teams channel meeting go?
- [ ] The organiser's Downloads folder
- [x] The channel's SharePoint folder
- [ ] Outlook
> Chat (non-channel) meetings record to the recorder's OneDrive instead.

2. What is the difference between a Teams chat file and a channel file?
- [x] A chat file lives in the sender's OneDrive; a channel file lives in the team's SharePoint
- [ ] Chat files cannot be shared
- [ ] Channel files are read-only
> Post deliverables in channels so the team keeps them after people leave.

3. Which sharing choice avoids exposing Outlook notifications during a demo?
- [ ] Share entire screen
- [x] Share a single window or tab
- [ ] Turn off the camera
> Notifications appear over the whole screen but not inside a shared window.

4. On Google Meet, what setting controls whether external people must knock?
- [ ] Breakout rooms
- [x] Quick access
- [ ] Host management
> With Quick access off, anyone outside the organisation waits to be admitted.

### Exercises

1. **Cross-platform meeting** — Your client is on Google, their customer is on Microsoft. Set up a Meet call the customer can join without a Google account.
<details><summary>Solution</summary>

Create the event in Google Calendar with Meet, add the customer's email as a guest, keep Quick access on (or be ready to admit the knock), and send the calendar invite so it lands as an `.ics` in Outlook with the join link. The customer joins in Chrome or Edge without signing in; if the host has enforced sign-in, they would need a Google account, so check that setting first.

</details>

2. **Chat to record** — A decision was made in a Teams chat. Describe how you make it findable in six months.
<details><summary>Solution</summary>

Post a message in the relevant channel, "Decision 16 Sep: ...", @mention the decision-maker to confirm, and add the same line to the meeting summary email. Channel posts are searchable and persist with the team; a personal chat is hard to search and disappears when a participant leaves.

</details>

### Interview Questions

**Q: How do you run a client meeting so that it produces action rather than just a recording?**
An agenda in the invite, a notes post started in the channel as the meeting begins, and a summary sent within the hour with decisions, actions with owner and date, and the next meeting time in both zones. I share a window rather than my screen, keep the client's data off camera, and use PowerPoint Live or Excel Live when we need to look at the same numbers. Recording is optional and I file the link in the channel Files, but clients act on the summary, not the recording, and a summary with three named actions is what makes the next meeting short.

**Q: Where do files shared in Teams actually live, and why does it matter?**
Files posted in a channel are stored in that channel's folder in the team's SharePoint library, owned by the Microsoft 365 group; files sent in a chat are stored in the sender's OneDrive and shared by link. It matters because a chat file disappears with the sender's account and its permissions are personal, whereas channel files belong to the team, have version history and are what the Files tab shows. My rule with clients is that deliverables go in the channel or the library, and chat is only for the link.

**Q: A client's external customer cannot join a Teams meeting. Walk me through your troubleshooting.**
First the join path: the browser link works in Edge or Chrome without the app, so I ask them to try that. Then the lobby: if Meeting options require organisation members to admit, someone must be watching the lobby, and I check "Who can bypass the lobby" for future meetings. Then authentication: some tenants require sign-in for external users, which the admin controls. Finally a fallback: the dial-in number if audio conferencing is licensed, or a Meet link from the client's Google account if that is what the customer uses. I document the working path in the client's platform sheet.

## Managing client communication at scale (Fiverr/Upwork + email)

A freelancer with 400+ reviews and several retained clients receives messages from Fiverr, Upwork, email and Teams all day, in different time zones, with different expectations about speed. Without a system, response times slip, scope creeps and platform rankings fall. This chapter builds the system: one queue, response standards, templates with a human first line, scope control and a weekly review.

### One queue

Platform messages arrive as notifications by email. Route them into the same triage system as email:

```text
Gmail filters
  from:(fiverr.com) subject:("New message" OR "New order" OR "Revision")
      → label Platforms/Fiverr, star, Never send to Spam
  from:(upwork.com) subject:(message OR proposal OR "contract")
      → label Platforms/Upwork, star

Outlook rules
  from @fiverr.com → category Fiverr, move Platforms/Fiverr, Desktop Alert
```

Reply on the platform itself (Fiverr and Upwork penalise off-platform contact and it voids their protection), but the notification email is your queue entry, and archiving it when the reply is sent is your "done".

### Response standards

| Channel | First response | Full answer |
|---|---|---|
| Fiverr new order or revision | Within 1 hour in working hours; auto-reply outside | Within 24 hours |
| Upwork invite or message | Within 4 hours | Within 24 hours |
| Retained client email | Same business day | As agreed in the SOP |
| Teams @mention | Within 1 hour in overlap window | Same day |

Fiverr shows your average response time on the profile and it feeds the ranking; a "received, will reply fully by Thursday 10 am CT" counts as a response and keeps the metric honest. Set **Fiverr → Settings → Availability** and Upwork **Availability badge** when off, and write the hours in your profile in the client's likely zone.

### Templates with a human first line

Both platforms have built-in canned responses: Fiverr **Quick Responses** (inbox → the lightning icon) and Upwork **Saved replies**. Build a small library that mirrors your Gmail templates:

- **Scope confirmation**: what is included, what is not, delivery date, revision rounds.
- **Requirements request**: the files and details you need before starting.
- **Delivery note**: what was done, what was validated, how to review, revision terms.
- **Revision received**: acknowledgement and turnaround.
- **Out of scope**: polite, with a priced option.
- **Feedback request**: sent after delivery is accepted, never before.

```text
Scope confirmation (Fiverr, DOCX fillable form)

Hi {Name}, thanks for the order.
To confirm the scope: a fillable PDF form from your Word file with
{N} fields (text, checkbox, dropdown), tab order set, field names per
your list, tested in Acrobat Reader and Chrome.
Not included: redesign of the layout or a submit button that emails
data (I can quote both).
Delivery: {Day Date}. Two revision rounds included.
Could you send the final Word file and the field list so I can start?
```

The first line always references the buyer's actual request; a template that opens with the buyer's own words is read as personal.

### Scope control in writing

Every job has a written scope on the platform before work starts: the order requirements on Fiverr, the contract terms on Upwork, the SOW email for direct clients. When a request goes beyond it, reply with the out-of-scope template and a **custom offer** or a milestone, never with silent extra work. Track requests in the order page or a simple Sheet: date, request, in scope (Y/N), status. That sheet is what settles disputes and is what Fiverr support asks for.

### Status updates

Clients tolerate delay when they are told early. For jobs longer than two days, send a short status at a fixed time in the client's zone: done, next, blockers, revised date if any. The same "what happened, impact, done, need" shape from the email chapter applies. Retained clients get a weekly summary email; platform clients get an update on the order page.

### Handling difficult conversations

- Angry messages: answer facts within the hour, offer a call if the platform allows (Fiverr has Zoom calls in the inbox for some sellers), never argue about ratings.
- Refund or cancellation requests: check the platform policy, propose a fix first, then agree the cleanest exit; a mutual cancellation on Fiverr no longer affects the order-completion rate in the way it once did, but check the current terms.
- Requests for off-platform payment: decline with one sentence about platform rules; it is the most common account-loss trap.

### Weekly review

Every Friday: response time metrics from each platform, open orders and their dates, revision counts, and the templates that needed editing. Fifteen minutes; it is where scope creep and slow replies are caught before they become a review.

> **Tip:** Write the client's local time next to every promised date in platform messages. "Delivery Thursday 18 Sep by 10 am CT" removes the most common cause of "late" complaints from US buyers dealing with a seller in UTC+5.

### Try It Yourself

```text
Order tracker (Google Sheet or Excel table)

Order   Platform  Client   Type            Due (client TZ)      Status    Revisions  Scope notes
FO4A2   Fiverr    S. Lee   PDF form 168f   Thu 18 Sep 10:00 CT  Working   0/2        submit button = custom offer sent
UP-773  Upwork    UKPress  EPUB3           Mon 22 Sep 09:00 BST Waiting   1/2        awaiting cover PNG
DIR-12  Email     Agency   Weekly report   Tue 16 Sep 17:00 CT  Delivered —          approved 16 Sep

Weekly review (Fri): Fiverr response time 0.8 h | Upwork 2.1 h | open 3 | late 0
```

### Quiz

1. Why reply on the platform rather than by email?
- [ ] Email is slower
- [x] Platform rules require it and off-platform contact voids buyer and seller protection
- [ ] Platforms do not send notification emails
> The notification email is your queue entry; the reply belongs on the platform.

2. What counts as a first response for Fiverr's response-time metric?
- [x] Any reply, including an acknowledgement with a date for the full answer
- [ ] Only a delivered file
- [ ] Only a reply within 5 minutes
> An honest "received, full reply by Thursday" protects the metric and the relationship.

3. How should an out-of-scope request be handled?
- [ ] Do it to keep the client happy
- [x] Reply that it is out of scope and send a custom offer or milestone
- [ ] Ignore it
> Written scope plus a priced option keeps the order clean and the revenue fair.

4. What is the purpose of the weekly review?
- [ ] To send invoices
- [x] To catch slow responses, scope creep and stale templates before they become bad reviews
- [ ] To close all orders
> Fifteen minutes on metrics and open items is the control loop of a freelance back office.

### Exercises

1. **Template set** — Write the "Revision received" template for an EPUB order, including a turnaround in the buyer's zone.
<details><summary>Solution</summary>

"Hi {Name}, thanks for the notes on the chapter headings and the cover. I have logged {N} changes and will deliver the revised EPUB by {Day Date}, {time} {zone}. This uses revision round {x} of {y}. If anything else comes up before then, add it to this thread so I can include it in the same round."

</details>

2. **Scope dispute** — A buyer says a submit-to-email button was "obviously included" in a fillable-form order. Describe your reply and the evidence you use.
<details><summary>Solution</summary>

Quote the order requirements and your scope-confirmation message where the button was listed as not included with a price; offer the custom offer again with a same-day delivery; keep the tone factual and short. The order page message history is the evidence Fiverr support reads, which is why scope is confirmed there and not in a call.

</details>

### Interview Questions

**Q: How do you handle communication for multiple clients across Fiverr, Upwork and email without dropping anything?**
One queue: platform notifications are filtered into labelled, starred mail so every message has a place, and a tracker lists every open order with the due date in the client's zone and the revision count. Response standards are written down: acknowledgement within an hour in working hours, full answer within a day. Templates cover the recurring messages with a personal first line. A Friday review checks response times and open items. In practice that kept a Fiverr response time under an hour across 400+ orders while retained clients still got same-day replies.

**Q: How do you stop scope creep on freelance work?**
By putting the scope in writing on the platform before starting, in a template that states what is included, what is not, the delivery date and the revision rounds. When a request exceeds it, I reply within the hour that it is outside the agreed scope and send a priced custom offer, usually with a quick turnaround so the buyer sees it as help, not refusal. I log the request in the order tracker. Most buyers accept; the few disputes are settled by the order-page history, which is why nothing is agreed verbally.

**Q: What would you change in a freelancer's communication if their rating started dropping?**
Look at the data first: response time on each platform, the last ten reviews' text, revision counts, and late deliveries. Usually one of three things: replies slower than 24 hours because notifications were not routed, promised dates without time zones being read as "late" by US buyers, or deliveries without a delivery note so buyers do not know what to check. Each has a mechanical fix: filters and a tracker, dates with zones, and a delivery template with validation results. Then a status update at a fixed time for any job over two days.

