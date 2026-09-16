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


# LEVEL: Advanced

## Shared mailboxes, delegation & out-of-office

A back office rarely runs on one person's inbox. Support requests go to `support@`, production files go to `orders@`, and an executive's mail is answered by an assistant. Microsoft 365 and Google Workspace both solve this with **shared mailboxes** (a mailbox with no user of its own that several people open) and **delegation** (one person acting inside another person's mailbox). Knowing which to use, how to set it up, and how "sent as" differs from "sent on behalf of" is core virtual-assistant work.

### Shared mailbox vs delegated mailbox

| | Shared mailbox | Delegation |
|---|---|---|
| Owner | Nobody; created by an admin | A real user (the manager) |
| Licence | Free in Microsoft 365 up to 50 GB; a Google **collaborative inbox** on a Group is free | Uses the manager's licence |
| Typical use | `support@`, `orders@`, `billing@` | Assistant handling a manager's inbox and calendar |
| Where set up | Microsoft 365 admin center or Google Admin / Groups | Outlook Delegate Access or Gmail Settings → Accounts |
| Sending | Send As or Send on Behalf | Send on Behalf by default; Send As is an admin permission |

### Microsoft 365: creating and opening a shared mailbox

An admin creates it at **Microsoft 365 admin center → Teams & groups → Shared mailboxes → Add a shared mailbox**, then adds members. Members see it appear automatically in Outlook (desktop and web) after up to an hour, or add it manually in Outlook on the web with **right-click Folders → Add shared folder or mailbox**.

The permissions behind the scenes are PowerShell cmdlets, and interviewers like candidates who know that the admin center is just a front end for them:

```text
# Exchange Online PowerShell (Connect-ExchangeOnline first)
Add-MailboxPermission -Identity orders@firm.com -User ali@firm.com -AccessRights FullAccess -AutoMapping $true
Add-RecipientPermission -Identity orders@firm.com -Trustee ali@firm.com -AccessRights SendAs
Set-Mailbox orders@firm.com -MessageCopyForSentAsEnabled $true -MessageCopyForSendOnBehalfEnabled $true
```

`FullAccess` lets you read and organise; `SendAs` lets mail leave as `orders@firm.com` with no trace of your name. `MessageCopyForSentAsEnabled` is the setting people forget: without it, messages you send as the shared mailbox land only in your own Sent Items, so colleagues cannot see what has been answered.

### Outlook delegation

A manager grants delegation in Outlook desktop at **File → Account Settings → Delegate Access → Add**, choosing a permission level per folder (Reviewer, Author, Editor) and ticking "Delegate receives copies of meeting-related messages sent to me". The delegate then opens the mailbox with **File → Open & Export → Other User's Folder**. Mail the delegate sends shows the header "Ali Raza on behalf of Jane Doe". Calendar delegation is where the value is: the delegate accepts, declines and proposes times, and the manager's calendar stays accurate.

### Gmail delegation and collaborative inboxes

Gmail delegation is granted by the mailbox owner at **Settings → Accounts and Import → Grant access to your account** (up to 10 delegates by default, 25 in Workspace). The delegate switches with the profile picture menu; messages sent show "sent by ali@firm.com" beside the owner's name. A delegate cannot change the password or chat as the owner.

For a `support@` address, Google's answer is a **Google Group with Collaborative Inbox** turned on (**Groups → group → Settings → Enable additional Google Groups features → Collaborative Inbox**). Members assign conversations to each other, mark them resolved, and reply from the group address once "Who can post" and "Send as" are configured.

### Out-of-office done properly

Automatic replies have three jobs: set an expectation, name an alternative, and avoid leaking information.

```text
Subject: Out of office until Mon 22 Sep

Thank you for your email. I am away until Monday 22 September and will
not be reading mail regularly. For document production requests, please
write to orders@firm.com, which is monitored daily. For urgent matters,
call +92 300 000 0000 (WhatsApp works). I will reply to everything else
on my return.

Ali Raza
```

Outlook sets this at **File → Automatic Replies** with separate inside/outside-organisation texts and a date range; Outlook on the web has **Settings → Mail → Automatic replies**, which can also decline new meetings and block the calendar. Gmail's is **Settings → General → Vacation responder**, with the option "Only send a response to people in my Contacts" that stops auto-replies going to newsletters and spam.

Rules that matter:

- Never include the reason for absence, travel details or who else is away.
- Send the external reply once per sender (both systems do this by default) so mailing lists do not loop.
- For a shared mailbox, the auto-reply is the mailbox's, set by an admin or by opening the mailbox in Outlook on the web (`outlook.office.com/mail/orders@firm.com`).

### Handover checklist for cover

When you cover someone's mailbox, before they leave: confirm delegation works, list the folders and categories they use, know which clients get same-day replies, and agree what should be forwarded rather than answered. Write the handover in a shared note, because the second-most common cover failure after "could not open the mailbox" is "answered a mail the manager had already answered from their phone".

> **Warning:** Send As permission on a shared mailbox means a message can leave the company with no name attached. Give it only to people who answer clients from that address, and keep Send on Behalf for everyone else so the trail shows who wrote what.

### Try It Yourself

```text
Shared mailbox rollout plan: orders@firm.com

1. Admin center → Shared mailboxes → Add: name "Orders", email orders@firm.com
2. Members: ali@, sara@ (FullAccess, auto-mapped)
3. Send As: ali@ only; Send on Behalf: sara@
4. Set-Mailbox orders@ -MessageCopyForSentAsEnabled $true
5. Folders: 01 New, 02 In progress, 03 Waiting client, 04 Done, 05 Templates
6. Categories: Red = due today, Yellow = due this week, Green = delivered
7. Rules: from @fiverr.com -> 01 New + Red; subject "Invoice" -> forward billing@
8. Auto-reply (external, once per sender): "Received - a human replies within 4 business hours (Mon-Fri 9-6 PKT)"
9. Weekly: count items in 03 Waiting client older than 5 days
```

### Quiz

1. Which permission lets a message leave a shared mailbox with no trace of the sender's own name?
- [ ] FullAccess
- [x] Send As
- [ ] Send on Behalf
> Send on Behalf shows "X on behalf of Y"; Send As shows only the mailbox address.

2. Why enable `MessageCopyForSentAsEnabled` on a shared mailbox?
- [x] So sent messages are copied to the shared Sent Items, visible to all members
- [ ] To allow larger attachments
- [ ] To enable automatic replies
> Without it, replies sit only in the sender's personal Sent Items and colleagues cannot see them.

3. What is Google's free equivalent of a shared support mailbox?
- [ ] A second licensed user
- [x] A Google Group with Collaborative Inbox enabled
- [ ] Gmail delegation to five users
> Collaborative Inbox adds assignment and resolution to a group address.

4. Which line should never appear in an out-of-office message?
- [ ] An alternative contact
- [ ] The return date
- [x] Travel details or the reason for absence
> Auto-replies reach strangers and mailing lists; keep private details out.

### Exercises

1. **Delegation design** — A title-insurance manager wants an assistant to manage her calendar and answer routine client mail, but never send contracts under her name. Choose the permissions.
<details><summary>Solution</summary>

Outlook Delegate Access with Calendar = Editor (and "receives copies of meeting-related messages"), Inbox = Editor, Send on Behalf only (no Send As). Every reply then reads "Assistant on behalf of Manager", so a contract could never appear to come from her directly. Contracts themselves are sent by the manager from her own session.

</details>

2. **Shared mailbox audit** — Write the PowerShell to list who has FullAccess and SendAs on `orders@firm.com`.
<details><summary>Solution</summary>

```text
Get-MailboxPermission -Identity orders@firm.com | Where-Object { $_.User -notlike "NT AUTHORITY\*" } | Select-Object User, AccessRights
Get-RecipientPermission -Identity orders@firm.com | Select-Object Trustee, AccessRights
```

</details>

3. **Vacation responder** — Write a Gmail vacation message for a freelancer closing for Eid for four days, with Fiverr orders still being accepted.
<details><summary>Solution</summary>

"Thank you for your message. I am away for Eid until Thursday 12 June and replying to email on my return. Fiverr orders placed during this time are accepted with delivery dates starting Friday 13 June; please use the order page for anything urgent, as it is checked once a day. Ali Raza." Enable "Only send to people in my Contacts" off, since clients are often first-time senders, but keep the date range set so it switches off automatically.

</details>

### Interview Questions

**Q: What is the difference between a shared mailbox and delegation, and when would you use each?**
A shared mailbox is a licence-free mailbox owned by nobody, opened by several members, used for role addresses like orders@ or support@. Delegation gives one person access inside a real user's mailbox and calendar, used for assistant-to-manager relationships. I use a shared mailbox whenever the address outlives the people, because members can change without losing history, and delegation when the point is acting for a specific person, especially for calendar management. The trap is using a personal mailbox with forwarding as a "shared" address; it breaks the day the person leaves.

**Q: Explain Send As versus Send on Behalf.**
Send As makes the message appear to come purely from the other address, with no indication of who actually wrote it; it is an admin-granted recipient permission. Send on Behalf shows "Ali Raza on behalf of orders@" in the From line and is what Outlook delegation grants by default. For a customer-facing role mailbox I grant Send As to the people whose job is answering from that address, and I turn on the setting that copies sent messages into the shared Sent Items so the team can see what has gone out. For assistants I keep Send on Behalf so the audit trail is visible in every message.

**Q: How would you set up a support@ address for a small business on Google Workspace without buying a licence?**
Create a Google Group named support@, enable Collaborative Inbox, add the staff as members, set "Who can post" to anyone on the web so external customers can email it, and configure "Send as" so members reply from the group address. Members then assign conversations, mark them resolved and see who is handling what. If the business grows, the same address can be migrated to a licensed user later. The one thing to check is the group's spam moderation setting, which otherwise holds genuine customer mail for approval.

## Microsoft Forms & Google Forms → Sheets workflows

A form is the cheapest way to replace "email me the details" with structured data. Client intake for a document job, agent QA scoring in a BPO team, leave requests, and revision requests all fit a form whose answers land in a spreadsheet. This chapter builds the intake form both ways: Microsoft Forms feeding an Excel workbook on OneDrive/SharePoint, and Google Forms feeding a Google Sheet, then adds the formulas that turn responses into a tracker.

### Designing the form first

Before opening either tool, write the fields as a table. Every field should have a type, a required flag and a reason. Fields without a downstream use get deleted.

| Field | Type | Required | Used for |
|---|---|---|---|
| Client name | Short text | Yes | Tracker, invoice |
| Email | Short text with email validation | Yes | Delivery |
| Job type | Choice: Fillable PDF / DOCX template / EPUB / Handbook | Yes | Routing, pricing |
| Page or field count | Number | Yes | Quote |
| Deadline | Date | Yes | Scheduling |
| Source files | File upload | Yes | Production |
| Notes | Long text | No | Scope |

### Microsoft Forms

Create at **forms.office.com → New Form**. Question types: Choice, Text, Rating, Date, Ranking, Likert, File upload, Net Promoter Score. Useful settings under the **…** menu of a question: **Restrictions** (Text → number, between, greater than), **Subtitle**, and **Add branching**, which shows follow-up questions only for some answers (a "Fillable PDF" answer can branch to "Approximate number of fields").

File upload questions require the form to be created inside the organisation; files land in the creator's OneDrive at `Apps/Microsoft Forms/<form name>/Question/`, and a link is stored in the response.

To get responses in Excel: **Responses tab → Open in Excel**. There are two behaviours, and the difference matters:

- A form created from **OneDrive or SharePoint → New → Forms for Excel** (or a group form) is bound to a workbook; every response is appended live to a table.
- A personal form created at forms.office.com downloads a **snapshot** workbook; since 2024 Microsoft has been moving personal forms to live sync too, but check for the "Open in Excel" versus "Download a copy" wording before promising a client real-time data.

The live workbook has a table named like `Form1`, with columns ID, Start time, Completion time, Email, Name, then one column per question. Never rename or reorder those columns; add your own columns to the right or, better, in a second sheet that references the table.

### Google Forms

Create at **forms.google.com**. Question types include Short answer, Paragraph, Multiple choice, Checkboxes, Dropdown, File upload, Linear scale, Multiple-choice grid, Date, Time. **Response validation** (the ⋮ menu on a question) offers Number, Text, Length and Regular expression; a regex such as `^[A-Z]{2}-\d{4}$` enforces an order-number format. **Go to section based on answer** does branching.

Link to a Sheet with **Responses → Link to Sheets** (the green Sheets icon). Google creates a sheet named `Form Responses 1` with a Timestamp column and one column per question, appended in real time. File uploads go to a Drive folder and the cell contains a link; the form must be restricted to signed-in users for uploads.

### Turning responses into a tracker

Both tools give a raw table. The working tracker sits beside it and derives what you need, without ever editing the response rows.

```excel
' Excel, second sheet, referencing the form table (structured references)
=COUNTIFS(Form1[Job type], "Fillable PDF", Form1[Completion time], ">="&TODAY()-7)
=IF(Form1[@[Deadline]]-TODAY()<=2, "Due soon", "OK")
=XLOOKUP([@Client], Clients[Name], Clients[Rate], "new client")
```

```excel
' Google Sheets, sheet "Tracker" cell A1: one formula that builds the whole view
=QUERY('Form Responses 1'!A:H,
  "select B, D, F, E where E is not null order by E asc label B 'Client', D 'Job', F 'Count', E 'Deadline'", 1)
```

`QUERY` uses a SQL-like language over the responses; it re-evaluates when a new response arrives, so the tracker is always current. In Excel the equivalent is a PivotTable on the table with **Refresh on open**, or Power Query with **Data → Get Data → From Table/Range**.

### Notifications and closing the loop

- Microsoft Forms: the form itself only emails the owner ("Get email notification of each response" in settings). Anything richer, such as a Teams message or a row in a different workbook, is a Power Automate flow with the trigger **When a new response is submitted**; the next chapter builds it.
- Google Forms: **Responses → ⋮ → Get email notifications for new responses** for the owner. For anything else, the Sheet's **Tools → Notification settings** emails on change, or Apps Script's `onFormSubmit` trigger runs code; the Apps Script chapter builds it.

### Response hygiene

Common failures seen in real intake sheets: the same client typed three ways ("ABC Ltd", "abc ltd", "ABC Limited"), dates entered as text, and required fields skipped because the form was edited after launch. Fixes: dropdowns instead of free text wherever the set is known, date questions rather than text, and a `Status` column maintained only by the team, never by the form. In Google Sheets, `Data → Data validation` on the tracker's Status column with a list `New, Quoted, In progress, Delivered` prevents typos; in Excel the same is **Data → Data Validation → List**.

> **Tip:** Put the form's edit link, the responses sheet and the tracker in one folder with a README note. When a client asks "where do my requests go?", you send one link, and when the form needs a new question the note says which formulas depend on column order.

### Try It Yourself

```excel
' Google Sheets tracker: count of open jobs by type from a linked Form Responses sheet
=QUERY('Form Responses 1'!A:H,
  "select D, count(B) where E >= date '"&TEXT(TODAY(),"yyyy-mm-dd")&"' group by D label count(B) 'Open jobs'", 1)

' Excel equivalent on a Forms-for-Excel table named Form1
=SUMPRODUCT((Form1[Job type]="EPUB")*(Form1[Deadline]>=TODAY()))
```

### Quiz

1. Which Microsoft Forms creation path guarantees a live-updating Excel workbook?
- [ ] forms.office.com → New Form (personal)
- [x] OneDrive/SharePoint → New → Forms for Excel
- [ ] Exporting the responses as CSV
> A form bound to a workbook appends each response to a table; a personal form may only download a snapshot.

2. Where do Google Forms file uploads end up?
- [ ] Inside the Sheet cell as an attachment
- [x] In a Drive folder, with a link in the response row
- [ ] In the form owner's Gmail
> Uploads require signed-in respondents and are stored in Drive.

3. What does `QUERY` do in Google Sheets?
- [ ] Sends a web request
- [x] Runs a SQL-like select over a range and returns the result table
- [ ] Validates form input
> It re-evaluates as responses arrive, making it ideal for live trackers.

4. Why should the response sheet never be edited by hand?
- [x] New responses assume the original column order, and edits break the link between form and data
- [ ] It is read-only
- [ ] Formulas cannot reference it
> Derive the tracker in another sheet; keep the raw response table untouched.

### Exercises

1. **Regex validation** — Add validation to a Google Form question so only Fiverr order numbers like `FO4A2B7C9` (two letters, then seven alphanumerics) are accepted.
<details><summary>Solution</summary>

Question ⋮ → Response validation → Regular expression → Matches → `^[A-Z]{2}[A-Z0-9]{7}$`, with the error text "Enter the 9-character order ID from the Fiverr order page".

</details>

2. **Due-soon view** — In Excel, write a formula that flags any form response whose Deadline is within two days and whose Status column (added in the tracker) is not "Delivered".
<details><summary>Solution</summary>

```excel
=IF(AND([@Deadline]-TODAY()<=2, [@Status]<>"Delivered"), "DUE SOON", "")
```

Add conditional formatting with the same condition on the row so the tracker highlights it.

</details>

### Interview Questions

**Q: How would you replace email-based client intake with a form, and what would you watch for?**
I would list the fields with types and a downstream use for each, build the form with dropdowns for every known set and validation on numbers, dates and IDs, and bind it to a live workbook or Sheet. A tracker sheet derives views with `QUERY` or structured references, and the raw response table is never edited. The risks are editing the form after launch, which shifts columns, and free-text fields that create duplicate client names; both are avoided by design discipline. For a document-production business this cut intake back-and-forth from three emails to one submission with the files attached.

**Q: What is the difference between a snapshot export and a linked sheet, and why does it matter?**
A snapshot is a copy at the moment of download; new responses do not appear and any formulas built on it silently go stale. A linked sheet or Forms-for-Excel workbook receives every response as it arrives. It matters because dashboards, notifications and SLA tracking all assume the data is current. When I inherit a process, the first thing I check is whether "the responses spreadsheet" is linked or a copy someone downloaded months ago.

**Q: Describe a form-based QA process for a BPO data-processing team.**
A Google Form or Microsoft Form per QA check: agent (dropdown), batch ID (regex-validated), sample size, error count by category (numbers), and a notes field. Responses land in a sheet where a `QUERY` produces error rate per agent per week and a pivot shows error categories, feeding the coaching conversation. The form is quicker for the checker than a spreadsheet row, validation removes typing errors, and the timestamp gives an audit trail. In practice this replaced a shared workbook that was regularly broken by someone sorting a single column.

## Power Automate basics (email → Excel, approvals)

Power Automate is Microsoft 365's workflow engine. A **flow** starts with a **trigger** (a new email, a form response, a schedule, a button) and runs **actions** (add a row to Excel, post to Teams, send an approval, create a file). Cloud flows run in Microsoft's cloud with the connectors your licence allows; Microsoft 365 licences include the standard connectors (Outlook, Excel Online, SharePoint, Teams, Forms, Approvals). This chapter builds two flows every back office needs: logging inbound emails to Excel, and a document approval.

### Vocabulary

| Term | Meaning |
|---|---|
| Trigger | The event that starts a run: "When a new email arrives (V3)", "When a new response is submitted", "Recurrence" |
| Action | A step: "Add a row into a table", "Send an email (V2)", "Start and wait for an approval" |
| Connector | A service wrapper (Office 365 Outlook, Excel Online (Business), SharePoint) |
| Dynamic content | Values from earlier steps, chosen from the panel or written as expressions |
| Expression | A function in the workflow language: `utcNow()`, `formatDateTime(...)`, `coalesce(...)` |
| Run history | Every execution with inputs and outputs per step; where you debug |

### Flow 1: email → Excel log

Goal: every email to `orders@firm.com` with an attachment becomes a row in `Orders.xlsx` on SharePoint, and the attachment is saved to a folder.

1. **Create → Automated cloud flow**, trigger **When a new email arrives in a shared mailbox (V2)** (Office 365 Outlook). Set Mailbox Address `orders@firm.com`, Folder `Inbox`, Only with Attachments `Yes`, Include Attachments `Yes`.
2. Action **Apply to each** over `Attachments`, inside it **Create file** (SharePoint): Site, Folder `/Shared Documents/Orders/Inbox`, File Name `Attachments Name`, File Content `Attachments Content`.
3. Action **Add a row into a table** (Excel Online (Business)): Location, Library, File `Orders.xlsx`, Table `OrdersTable`, then map columns.

The Excel action needs a real **table** (select the range, **Insert → Table**, name it on the Table Design tab). A plain range is not selectable. Column mapping uses dynamic content and expressions:

```text
Received   : formatDateTime(triggerOutputs()?['body/receivedDateTime'], 'yyyy-MM-dd HH:mm')
From       : triggerOutputs()?['body/from']
Subject    : triggerOutputs()?['body/subject']
Files      : length(triggerOutputs()?['body/attachments'])
Status     : New
Body (text): triggerOutputs()?['body/bodyPreview']
```

Choose **Settings → Concurrency control** on the trigger and set it to 1 if rows must be in order; Excel's add-row action can otherwise interleave under load. Test with **Test → Manually**, send yourself a mail with a PDF, and read the run history.

### Flow 2: document approval

Goal: when a file is added to `/Policy Manuals/Drafts`, the manager approves or rejects in Teams or email; approved files move to `/Published` and the author is told either way.

1. Trigger **When a file is created (properties only)** (SharePoint), library `Policy Manuals`, folder `/Drafts`.
2. **Start and wait for an approval** (Approvals): Approval type `Approve/Reject – First to respond`, Title `Approve: <File name>`, Assigned to the manager, Item link `Link to item`, Details: author and modified time.
3. **Condition**: `Outcome` is equal to `Approve`.
   - If yes: **Move file** (SharePoint) to `/Published`; **Send an email (V2)** to `Created By Email` with the response comments.
   - If no: **Send an email (V2)** with `Responses Comments` and the link; optionally **Update file properties** to set a Status column to "Rejected".

Approvals appear in the Teams Approvals app and in an email with Approve/Reject buttons; the flow waits (up to 30 days on the default timeout) at step 2. The approval record persists in the Approvals app as an audit trail, which is why this is preferable to an email asking "OK to publish?".

### Expressions you will actually use

```text
formatDateTime(utcNow(), 'yyyy-MM-dd')                       today's date for a file name
addDays(utcNow(), 3)                                          a due date
convertTimeZone(utcNow(), 'UTC', 'Pakistan Standard Time')   local timestamps in logs
coalesce(triggerOutputs()?['body/subject'], '(no subject)')  default when empty
replace(items('Apply_to_each')?['Name'], ' ', '_')            safe file names
if(greater(length(body('Get_items')?['value']), 0), 'yes', 'no')
```

Expressions are typed in the **Expression** tab of the dynamic content panel; they are the workflow-definition language shared with Azure Logic Apps, so their documentation applies.

### Error handling and cost

- Each action has **Settings → Configure run after**, which lets a later step run when a previous one fails; use it to send yourself an alert email on failure.
- A **Scope** block groups steps; a second Scope set to run after "has failed" is the standard try/catch pattern.
- Flow runs are limited per licence (Microsoft 365 plans have daily action limits per user; Power Automate premium raises them). A flow that polls every minute burns the limit; email and SharePoint triggers are push-based and cheap, `Recurrence` is where costs hide.
- Connections are owned by the creator. When that person leaves, the flow stops; put business flows under a service account or a **solution** with a co-owner.

> **Interview note:** Interviewers ask "what happens when the Excel file is open?" Excel Online (Business) actions work on the file in SharePoint through the Graph API, so a co-authoring session does not block them, but a file checked out or opened exclusively in a desktop app that locks it will fail the action with a 423 Locked error. The fix is Configure run after with a retry policy, and never keeping the log workbook open on a desktop.

### Try It Yourself

```text
Flow: Orders mailbox to Excel (summary you can rebuild in the designer)

Trigger : Office 365 Outlook - When a new email arrives in a shared mailbox (V2)
          mailbox=orders@firm.com  folder=Inbox  onlyWithAttachments=true  includeAttachments=true
Step 1  : Apply to each  ->  Attachments
            SharePoint - Create file
              site=https://firm.sharepoint.com/sites/Ops  folder=/Shared Documents/Orders/Inbox
              name=@{formatDateTime(utcNow(),'yyyyMMdd')}_@{items('Apply_to_each')?['name']}
              content=@{items('Apply_to_each')?['contentBytes']}
Step 2  : Excel Online (Business) - Add a row into a table
            file=/Shared Documents/Orders/Orders.xlsx  table=OrdersTable
            Received=@{formatDateTime(triggerOutputs()?['body/receivedDateTime'],'yyyy-MM-dd HH:mm')}
            From=@{triggerOutputs()?['body/from']}  Subject=@{triggerOutputs()?['body/subject']}
            Files=@{length(triggerOutputs()?['body/attachments'])}  Status=New
Step 3  : Scope "On failure" (run after Step 2: has failed, has timed out)
            Office 365 Outlook - Send an email (V2) to ali@firm.com, subject "Orders flow failed"
```

### Quiz

1. Why must the target range in Excel be a table for "Add a row into a table"?
- [ ] Tables are faster
- [x] The connector addresses tables by name and cannot write to plain ranges
- [ ] Ranges are read-only online
> Insert → Table and name it on the Table Design tab before building the flow.

2. What does "Start and wait for an approval" do while waiting?
- [x] Pauses the flow run until a response arrives or the timeout is reached
- [ ] Sends reminders every hour
- [ ] Moves the file to a pending folder
> The run stays open, then continues to the Condition with the Outcome.

3. Which trigger type is most expensive against action limits?
- [ ] When a new email arrives
- [x] Recurrence polling every minute
- [ ] When a file is created
> Push-based triggers fire on events; a frequent Recurrence burns daily action quotas.

4. How do you implement try/catch in a flow?
- [ ] Wrap actions in a Condition
- [x] Two Scope blocks, the second configured to run after the first "has failed"
- [ ] Enable retries
> "Configure run after" on the second scope is the standard pattern.

### Exercises

1. **Deadline reminder** — Design a flow that emails the assignee two days before a due date stored in a SharePoint list.
<details><summary>Solution</summary>

Trigger Recurrence daily at 08:00 PKT; action Get items (SharePoint) with OData filter `DueDate eq '@{formatDateTime(addDays(utcNow(),2),'yyyy-MM-dd')}' and Status ne 'Done'`; Apply to each → Send an email (V2) to `Assignee Email` with the item title and link. One run a day keeps the action count small.

</details>

2. **Form to Teams** — Sketch the flow that posts each Microsoft Forms intake response to a Teams channel.
<details><summary>Solution</summary>

Trigger Microsoft Forms "When a new response is submitted" (form ID); action "Get response details" with the Response Id from the trigger (the trigger alone does not contain answers); action Teams "Post message in a chat or channel" with the answers as dynamic content. Optionally "Add a row into a table" to the intake workbook as well.

</details>

### Interview Questions

**Q: Walk me through a flow that logs incoming order emails to Excel and what could break it.**
Trigger on new email in the shared mailbox with attachments, save each attachment to a SharePoint folder with a dated name, add a row to a named table in the log workbook with received time, sender, subject and attachment count, and a failure scope that emails me. What breaks: the workbook opened exclusively on a desktop returns a lock error, someone renaming the table or a column breaks the mapping, the connection owner leaving stops the flow, and concurrency reorders rows unless the trigger's concurrency is set to 1. I mitigate by keeping the log online-only, documenting the table schema, owning the flow with a service account, and testing after any Excel change.

**Q: Why use the Approvals connector instead of an email asking for approval?**
Approvals gives a structured outcome the flow can branch on, a timestamped record in the Approvals app that survives mailbox clean-ups, response from Teams or email with one click, and reassignment or multiple-approver patterns like "everyone must approve". An email reply requires someone to read it and act, and there is no reliable way for a flow to parse "looks fine" versus "no". For a policy manual publishing process, the record of who approved which version is exactly what an auditor asks for.

**Q: How do you keep flows reliable when people change roles?**
Business flows are built inside a solution in an environment, owned by a service account with MFA and a shared secret store, and every flow has at least one co-owner. Connections use the service account. Names describe the business purpose, and a description records the trigger, target files and who to contact. When a table or list schema changes, the flow is retested from run history before the change is announced. The alternative, a flow living under one person's login, is the most common reason automation quietly dies six months after they leave.

## Google Apps Script basics (Sheets automation)

Google Apps Script is JavaScript that runs on Google's servers with built-in objects for Sheets, Docs, Drive, Gmail, Calendar and Forms. It is the Google Workspace equivalent of VBA plus Power Automate, and it is free with any Google account. If you can write a `for` loop, you can automate a tracker, send status emails from a Sheet, or generate a Doc from a template. This chapter covers the editor, the Sheets service, triggers and the first three scripts every operations person ends up writing.

### The editor and the first script

Open any Sheet and choose **Extensions → Apps Script**. The editor shows `Code.gs` with an empty `myFunction`. Scripts are **bound** to the Sheet they were opened from (they can access it with `SpreadsheetApp.getActiveSpreadsheet()`) or **standalone** (created at script.google.com, addressed by ID).

```javascript
function logOpenJobs() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Tracker');
  const rows = sheet.getDataRange().getValues();      // 2-D array, row 0 = headers
  const header = rows[0];
  const status = header.indexOf('Status');
  const open = rows.slice(1).filter(r => r[status] !== 'Delivered');
  Logger.log('Open jobs: ' + open.length);
}
```

Click **Run**; the first time, Google asks you to authorise the scopes the script needs (here, Spreadsheets). Output appears in the **Execution log**. Runtime is V8, so modern JavaScript (`const`, arrow functions, template literals, `Array.prototype.map`) works.

### Reading and writing ranges efficiently

The single most important performance rule: every `getValue()` or `setValue()` is a round trip to Google's servers. Read the whole range once with `getValues()`, work on the array, write once with `setValues()`.

```javascript
function markDueSoon() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Tracker');
  const range = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn());
  const values = range.getValues();
  const h = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const due = h.indexOf('Deadline'), status = h.indexOf('Status'), flag = h.indexOf('Flag');
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const out = values.map(r => {
    const days = (new Date(r[due]) - today) / 86400000;
    return [r[status] !== 'Delivered' && days <= 2 ? 'DUE SOON' : ''];
  });
  sheet.getRange(2, flag + 1, out.length, 1).setValues(out);   // one write
}
```

A loop calling `setValue` on 500 rows takes about a minute; the array version takes under a second. Interviewers who know Apps Script ask about exactly this.

### Sending email from a Sheet

`MailApp.sendEmail` sends from the script owner's account (daily quota: 100 recipients for free accounts, 1,500 for Workspace). `GmailApp` adds drafts, labels and threads but needs a broader scope.

```javascript
function sendStatusEmails() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Tracker');
  const [h, ...rows] = sheet.getDataRange().getValues();
  const col = name => h.indexOf(name);
  rows.forEach((r, i) => {
    if (r[col('Status')] === 'Delivered' && !r[col('Notified')]) {
      MailApp.sendEmail({
        to: r[col('Email')],
        subject: `Delivered: ${r[col('Job')]} (${r[col('Order')]})`,
        htmlBody: `Hi ${r[col('Client')]},<br><br>Your ${r[col('Job')]} has been delivered. ` +
                  `Please review and reply on the order page with any changes within 3 days.<br><br>Ali Raza`
      });
      sheet.getRange(i + 2, col('Notified') + 1).setValue(new Date());
    }
  });
}
```

The `Notified` column is the idempotency guard: run the function twice and nobody gets a second email.

### Triggers

- **Simple triggers** are functions with reserved names: `onOpen(e)` (add a menu), `onEdit(e)` (react to a cell change). They run as the current user, cannot send email and cannot access other files that need authorisation.
- **Installable triggers** (**Triggers** sidebar → **Add Trigger**) run as the script owner on a schedule (time-driven, e.g. every day 08:00), on form submit (`onFormSubmit`), on open, on edit or on change, with full permissions.

```javascript
function onOpen() {
  SpreadsheetApp.getUi().createMenu('Ops')
    .addItem('Flag due soon', 'markDueSoon')
    .addItem('Send delivery emails', 'sendStatusEmails')
    .addToUi();
}

function onFormSubmitHandler(e) {          // installable trigger: From spreadsheet → On form submit
  const values = e.namedValues;             // {'Client name': ['ABC Ltd'], 'Job type': ['EPUB'], ...}
  MailApp.sendEmail('ali@firm.com', `New intake: ${values['Job type'][0]}`,
    JSON.stringify(values, null, 2));
}
```

Time-driven triggers are how "every Friday 17:00 send the weekly report" is done: a function that builds the summary with `getValues()`, formats it as an HTML table and sends it.

### Docs from a template

Generating a Doc, such as a delivery note or a rate confirmation letter, is a Drive copy plus text replacement:

```javascript
function makeDeliveryNote(client, job, order) {
  const template = DriveApp.getFileById('1AbC...templateId');
  const copy = template.makeCopy(`Delivery note - ${order}`, DriveApp.getFolderById('1XyZ...folderId'));
  const doc = DocumentApp.openById(copy.getId());
  const body = doc.getBody();
  body.replaceText('{{Client}}', client);
  body.replaceText('{{Job}}', job);
  body.replaceText('{{Date}}', Utilities.formatDate(new Date(), 'Asia/Karachi', 'd MMMM yyyy'));
  doc.saveAndClose();
  return copy.getUrl();
}
```

`replaceText` takes a regular expression, so escape special characters in placeholders. For PDF output, `copy.getAs('application/pdf')` returns a blob you can save with `folder.createFile(blob)` or attach to an email.

### Limits and good habits

| Limit (Workspace accounts) | Value |
|---|---|
| Script runtime per execution | 6 minutes (30 for Workspace add-on triggers) |
| Email recipients per day | 1,500 |
| Triggers per user per script | 20 |
| URL Fetch calls per day | 100,000 |

Good habits: keep IDs and settings in a `Config` sheet or `PropertiesService.getScriptProperties()`, never in code; wrap external calls in `try/catch` and log with `console.error`; use `LockService.getScriptLock()` around writes that a trigger and a user might run at once; and put the project under version control with **clasp** (`npm install -g @google/clasp`, `clasp clone <scriptId>`) when it grows past one file.

> **Tip:** `Logger.log` output disappears after the run; `console.log` goes to Google Cloud Logging where it stays and can be searched. For triggers that run unattended, use `console.log` and check **Executions** in the editor sidebar when something goes wrong.

### Try It Yourself

```javascript
// Bound script: weekly summary of the Tracker sheet emailed every Friday (add a time-driven trigger).
function weeklySummary() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Tracker');
  const [h, ...rows] = sheet.getDataRange().getValues();
  const c = n => h.indexOf(n);
  const counts = {};
  rows.forEach(r => { const s = r[c('Status')] || 'Unknown'; counts[s] = (counts[s] || 0) + 1; });
  const late = rows.filter(r => r[c('Status')] !== 'Delivered' && new Date(r[c('Deadline')]) < new Date());
  const html = `<h3>Weekly production summary</h3>
    <table border="1" cellpadding="4">${Object.entries(counts).map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join('')}</table>
    <p><b>Late:</b> ${late.length}</p>
    <ul>${late.map(r => `<li>${r[c('Order')]} - ${r[c('Client')]} (due ${Utilities.formatDate(new Date(r[c('Deadline')]), 'Asia/Karachi', 'd MMM')})</li>`).join('')}</ul>`;
  MailApp.sendEmail({ to: 'ali@firm.com', subject: 'Weekly summary ' + Utilities.formatDate(new Date(), 'Asia/Karachi', 'yyyy-MM-dd'), htmlBody: html });
}
```

### Quiz

1. Why is `getValues()` on the whole range preferred over `getValue()` in a loop?
- [ ] It returns strings
- [x] Each call is a server round trip; one bulk read is far faster than hundreds of single reads
- [ ] `getValue()` is deprecated
> Read once, compute in memory, write once with `setValues()`.

2. Which trigger type can send email on a schedule?
- [ ] Simple `onEdit`
- [x] Installable time-driven trigger
- [ ] `onOpen`
> Simple triggers run with limited permissions and cannot send mail or run on a timer.

3. What prevents `sendStatusEmails` from emailing a client twice?
- [ ] The daily quota
- [x] Writing a timestamp to the Notified column and skipping rows that have one
- [ ] MailApp deduplicates recipients
> An idempotency marker in the data is the standard pattern for re-runnable scripts.

4. Where should file IDs and settings live?
- [ ] Hard-coded constants at the top of the script
- [x] A Config sheet or Script Properties
- [ ] In the function parameters
> Settings outside the code can be changed without editing or redeploying.

### Exercises

1. **Validation on edit** — Write an `onEdit` that clears a cell in the Status column and shows a warning if a value outside the allowed list is typed.
<details><summary>Solution</summary>

```javascript
function onEdit(e) {
  const allowed = ['New', 'Quoted', 'In progress', 'Delivered'];
  const sheet = e.range.getSheet();
  if (sheet.getName() !== 'Tracker' || e.range.getRow() < 2) return;
  const header = sheet.getRange(1, e.range.getColumn()).getValue();
  if (header === 'Status' && e.value && !allowed.includes(e.value)) {
    e.range.setValue(e.oldValue || '');
    SpreadsheetApp.getActiveSpreadsheet().toast(`Status must be one of: ${allowed.join(', ')}`, 'Invalid value');
  }
}
```

</details>

2. **PDF delivery note** — Extend `makeDeliveryNote` to save a PDF copy into the same folder and return the PDF URL.
<details><summary>Solution</summary>

```javascript
const folder = DriveApp.getFolderById('1XyZ...folderId');
const pdf = folder.createFile(copy.getAs('application/pdf')).setName(`Delivery note - ${order}.pdf`);
return pdf.getUrl();
```

Place these lines after `doc.saveAndClose()`, which must run first so the PDF reflects the replacements.

</details>

### Interview Questions

**Q: What can Apps Script do that formulas cannot, and when would you still prefer a formula?**
Apps Script can send email, create files, call external APIs, run on a schedule, react to edits and modify many sheets in one transaction. Formulas recalculate automatically, need no authorisation, are visible to anyone auditing the sheet and never hit a runtime quota. I keep calculations in formulas or `QUERY` and reserve scripts for side effects: notifications, document generation, imports and enforcement of rules a data-validation dropdown cannot express. A weekly summary email is a script; the numbers in it are formulas the script reads.

**Q: How do you make an Apps Script safe to run unattended?**
Idempotent design so a re-run causes no duplicate emails or files, using a marker column or a processed-IDs property; bulk reads and writes to stay under the six-minute limit; `LockService` around writes; `try/catch` with `console.error` so failures are visible in Executions and Cloud Logging; configuration in Script Properties; and an alert email on exception. I also run the trigger as a service account-like shared user rather than my personal login so a role change does not stop the automation.

**Q: Explain the difference between simple and installable triggers.**
Simple triggers are `onOpen`, `onEdit`, `onSelectionChange` and similar reserved functions that run automatically when a user acts, but with restricted permissions: no email, no access to other services requiring authorisation, and a 30-second limit. Installable triggers are registered in the Triggers panel and run as the user who installed them with full authorised scopes; they include time-driven, form-submit and change events. For anything that needs email, external files or a schedule, it must be installable. A classic bug is writing `onEdit` code that calls `MailApp` and wondering why nothing sends.

## Document management, naming conventions & retention

A production team's files are its product. A 767-page handbook has dozens of source files, a template suite has twenty `.dotx` files, a title-search project generates a folder per order. Without conventions, "which is the latest?" costs hours a week and the wrong version reaches a client. This chapter sets the rules: folder structure, file naming, versioning, metadata, retention and the tools in SharePoint and Drive that enforce them.

### Folder structure: shallow and predictable

Structure follows how files are looked for, not how they were created. Two patterns cover most operations work:

```text
Client work (by client, then engagement)
  Clients/
    ACME-Title/
      2026-09 Rate matrix update/
        01 Source/       client-supplied inputs, never edited
        02 Working/      drafts, scripts, intermediate files
        03 Delivered/    what the client received, by date
        04 Admin/        quote, invoice, correspondence exports

Internal operations (by function, then period)
  Operations/
    Reports/2026/09/
    SOPs/
    Templates/
```

Rules: no more than four levels deep (SharePoint's 400-character URL limit and Windows' 260-character path limit bite at depth six), numbered prefixes to force order, and `01 Source` treated as read-only so the original input is always recoverable.

### File naming convention

A name should sort correctly, say what the file is, and be safe on every system.

```text
<YYYY-MM-DD>_<client-or-project>_<document>_<vNN>[_status].<ext>

2026-09-16_ACME_RateMatrix-WY_v03.xlsx
2026-09-16_ACME_RateMatrix-WY_v03_FINAL.xlsx
2026-09-12_Stewart_WeeklyStatus_W37.docx
PolicyManual_Template_v02.dotx
```

| Rule | Why |
|---|---|
| ISO date first (`2026-09-16`) | Sorts chronologically in every file browser |
| No spaces; hyphens inside parts, underscores between parts | Safe in URLs, scripts and command lines |
| Two-digit version `v03` | `v10` sorts after `v9` only with padding |
| Status suffix only for `FINAL` or `SIGNED` | "final_v2_really_final" is what conventions prevent |
| No characters from `\ / : * ? " < > |` and no trailing dots | Rejected by Windows and SharePoint sync |
| Under 100 characters | Leaves room for the path |

Templates and SOPs are undated because the version lives in the name and in version history; deliverables are dated because the client thinks in dates.

### Version control: let the platform do it

Both SharePoint/OneDrive and Google Drive keep version history automatically, which is why `_v03` in a name is for **deliverables** you send out, not for every save. Inside the working folder, one file with version history beats twelve copies.

- SharePoint: **Library settings → Versioning settings** sets major versions (default 500 kept) and optional minor drafts with check-out. **Version history** on any file restores or downloads a previous version.
- Google Drive: **File → Version history → See version history** in Docs/Sheets/Slides; for uploaded files (DOCX, PDF), **right-click → Manage versions** keeps 100 versions for 30 days unless "Keep forever" is ticked.

When a client wants "v2 and v3 for comparison", export them from history with a proper name rather than keeping parallel files.

### Metadata beats folders

SharePoint document libraries support **columns** (Client, Document type, Status, Review date) and **views** that filter and group by them. One library with metadata answers "all FINAL rate matrices for Wyoming" in one view; folders cannot. Set required columns in **Library settings → Create column**, then **Content types** if different document kinds need different fields. Drive's equivalent is weaker: **Labels** (Workspace Business Standard and above) plus **Advanced search** by owner, type and date.

### Retention and disposal

Retention answers two questions: how long must we keep this, and when must we delete it. Client contracts, tax rules and data-protection law each set minimums and maximums.

| Document class | Keep for | Then |
|---|---|---|
| Client deliverables and source files | Contract term + 2 years (or as the SOW states) | Delete or return |
| Invoices and payment records | 7 years (common tax requirement; check local rules) | Delete |
| SOPs and templates | Current version + previous 2 | Archive |
| Personal data (ID scans, forms with PII) | Only while the job runs | Delete immediately after delivery |

SharePoint enforces this with **Microsoft Purview → Data lifecycle management → Retention policies** (keep, delete, or keep-then-delete across sites) and **retention labels** applied per document, which override the policy. Google Workspace has **Vault** retention rules (Business Plus and above). Below those tiers, a quarterly calendar reminder plus an `Archive/<year>` folder is the honest minimum, and it must be written in the SOP.

### Sync and offline safety

OneDrive and Drive for desktop sync folders locally. Two settings matter: **Files On-Demand** (OneDrive) or **Stream files** (Drive) keeps large libraries from filling the disk; and never editing the same file from two synced machines at once, which creates `-Ali's laptop` conflict copies. For production, edit online or on one machine, and keep `01 Source` unsynced.

> **Warning:** A folder emailed as a ZIP is a copy that will drift. Send links to the delivered folder with expiry and, for external clients, download-blocked view links for drafts. The file the client has should be the file you have.

### Try It Yourself

```text
Naming convention checklist (paste into the team SOP)

Pattern    : <YYYY-MM-DD>_<Client>_<Document>_<vNN>[_FINAL].<ext>
Dates      : ISO 8601, delivery date for deliverables; none for templates/SOPs
Separators : "_" between parts, "-" inside a part, no spaces
Version    : v01, v02 ... only on files sent to a client; working files use version history
Forbidden  : \ / : * ? " < > |  leading/trailing spaces, trailing "." , "final final"
Max length : 100 chars (path under 250)
Folders    : 01 Source (read-only) / 02 Working / 03 Delivered / 04 Admin
Retention  : deliverables contract+2y, invoices 7y, PII delete on delivery, SOPs current+2
Review     : quarterly, first Monday of Jan/Apr/Jul/Oct, owner: Ali
```

### Quiz

1. Why put an ISO date at the start of a deliverable file name?
- [x] So files sort chronologically in every tool
- [ ] Because SharePoint requires it
- [ ] To shorten the name
> `2026-09-16` sorts correctly; `16 Sep 2026` and `9/16/26` do not.

2. When should you append `_v03` to a file name?
- [ ] On every save
- [x] On copies sent to a client, while working files rely on version history
- [ ] Only for PDFs
> The platform keeps every working version; explicit versions matter for what left the building.

3. Which SharePoint feature answers "all FINAL Wyoming rate matrices" in one click?
- [ ] Nested folders
- [x] Library columns with a filtered view
- [ ] Recycle bin
> Metadata lets one document appear in many views without copies.

4. What happens to a file with personal ID scans after delivery under a good retention rule?
- [ ] Archived for 7 years
- [x] Deleted immediately after the job is confirmed complete
- [ ] Emailed to the client
> PII is kept only for as long as it is needed for the work.

### Exercises

1. **Rename audit** — Give a bash one-liner that lists files in a delivered folder that do not match the naming pattern.
<details><summary>Solution</summary>

```bash
ls "03 Delivered" | grep -Ev '^[0-9]{4}-[0-9]{2}-[0-9]{2}_[A-Za-z0-9-]+_[A-Za-z0-9-]+_v[0-9]{2}(_FINAL)?\.[a-z0-9]+$'
```

</details>

2. **Library design** — Design the columns for a SharePoint library holding title-insurance rate matrices for several states.
<details><summary>Solution</summary>

Columns: State (choice, required), Effective date (date, required), Underwriter (choice), Status (choice: Draft, Review, FINAL, Superseded), Version sent (text), Source file link (hyperlink). Views: "Current by state" grouped by State filtered Status = FINAL; "Under review" filtered Status = Review sorted by Effective date. Require check-out for edits and enable major versions.

</details>

### Interview Questions

**Q: What naming and folder convention would you set for a document production team?**
Date-first ISO names with client, document, padded version and a FINAL suffix only for sent files; underscores between parts and no spaces; folders no more than four deep, with numbered stages Source, Working, Delivered, Admin; Source read-only. Working versions rely on SharePoint or Drive version history rather than copies. I write it as a one-page checklist in the SOP with examples of right and wrong names, and I audit new folders in the first month because conventions only survive if they are checked early.

**Q: How do you handle retention when the business has no Purview or Vault licence?**
A written schedule per document class in the SOP, an Archive folder per year, and a quarterly calendar task to move or delete. Personal data is deleted on delivery regardless of licence. I keep a small log of what was deleted and when, because the point of retention is being able to say what you hold. When the licence allows, I move the same schedule into retention labels so the platform enforces it and the log becomes automatic.

**Q: A client says the PDF you delivered is not the version they approved. How does your file management help you answer?**
The delivered folder holds dated, versioned files and SharePoint's version history shows who changed what and when; the approval sits in an Approvals record or the client's email against a specific file name and version. I compare the delivered file's hash or version to the approved one and can show either that they match or exactly which later change was made and by whom. That is why deliverables carry explicit versions and why the delivered folder is never edited after sending.

# LEVEL: Expert

## Security (MFA, phishing, sensitivity labels, DLP basics)

A virtual assistant or back-office operator holds the keys: client mailboxes, shared drives with contracts, title documents with social security numbers, and payment details. Security is not the IT department's job alone; it is the operator's daily practice. This chapter covers the four controls that stop most real incidents: multi-factor authentication, phishing recognition, sensitivity labels and data loss prevention, with the exact settings in Microsoft 365 and Google Workspace.

### Multi-factor authentication

MFA means a password alone is not enough. The attacker who buys your password from a breach dump still fails at the second factor.

| Method | Strength | Notes |
|---|---|---|
| SMS code | Weakest | SIM-swap attacks; acceptable only as a fallback |
| Authenticator app (Microsoft Authenticator, Google Authenticator) | Good | Number matching in Microsoft Authenticator defeats "MFA fatigue" spam |
| Passkeys / FIDO2 security key | Strongest | Phishing-resistant: the key only answers the real domain |

Microsoft 365: **Entra admin center → Protection → Authentication methods** chooses what is allowed; **Security defaults** (free tier) force MFA for everyone, and **Conditional Access** (Entra ID P1, included in Business Premium) makes rules like "require MFA outside Pakistan" or "block legacy authentication". Users enrol at `aka.ms/mfasetup`.

Google Workspace: **Admin console → Security → Authentication → 2-Step Verification → Enforcement**, with "Allow users to trust device" and the option to permit only security keys for admins. Users enrol at `myaccount.google.com/security`.

For a freelancer with no admin: turn MFA on everywhere, with an authenticator app, and save the recovery codes in a password manager, not a text file.

### Phishing: what it looks like today

Modern phishing is not misspelled Nigerian-prince mail. It is a Fiverr-branded "your order was cancelled, review it here" link, a shared-file notification from "SharePoint" pointing to `sharepoint-online-docs.com`, or a reply in a real thread from a compromised client mailbox asking to change bank details. The tells:

- The link's real domain (hover, or long-press on a phone) differs from the brand. `login.microsoftonline.com` and `accounts.google.com` are the only real sign-in hosts for those services.
- Urgency and a consequence: "within 24 hours or your account is suspended".
- A request that bypasses normal process: new bank account, gift cards, "keep this confidential".
- A login page reached from an email rather than from a bookmark.

Report rather than delete: Outlook's **Report → Report phishing** button (feeds Defender) and Gmail's **⋮ → Report phishing** train the filters for everyone. Admins tune **Defender for Office 365 → Anti-phishing policies** (impersonation protection for named executives and domains) and Google's **Admin → Gmail → Safety** settings (attachment sandboxing, spoofing protection).

The one rule that beats any filter: **any change to payment details is confirmed by a phone call to a number you already had**, never to one in the email.

### Sensitivity labels (Microsoft Purview)

A sensitivity label is a tag on a document or email that can encrypt it, watermark it and restrict who can open it, and it travels with the file. Configured at **Microsoft Purview → Information protection → Labels**; published to users through label policies; applied in Office at **Home → Sensitivity** or by auto-labelling rules that detect content such as credit card numbers.

```text
Label scheme for a document production business
  Public         no protection; marketing, templates for sale
  Internal       header "Internal"; default label for new files
  Confidential   encrypt, external access only to named domains, "Do not forward" in Outlook
  Client-PII     encrypt, no external, watermark "PII - delete on delivery", auto-applied
                 when SSN / passport patterns are detected
```

Google's equivalent is **Drive labels** with **Data classification** in the Admin console (Business Standard and up) and **Gmail confidential mode** (expiry, no forward/copy/download, optional SMS passcode) for individual messages. Confidential mode is a convenience, not encryption; treat it as such.

### Data loss prevention basics

DLP inspects content leaving the organisation and blocks or warns. In Microsoft 365, **Purview → Data loss prevention → Policies** with built-in **sensitive information types** (US Social Security Number, credit card, IBAN, passport numbers by country) applied to Exchange, SharePoint, OneDrive, Teams and endpoints. A policy can show a **policy tip** in Outlook ("This email contains 3 SSNs"), block the send, or require a business justification.

Google: **Admin console → Security → Data protection → Manage rules**, with predefined detectors (`US_SOCIAL_SECURITY_NUMBER`, `CREDIT_CARD_NUMBER`) and actions on Drive sharing, Gmail and Chat: warn, block external share, or audit only.

Start in **audit/test mode** for two weeks, review what would have been blocked, then enforce. A DLP rule that blocks a title-insurance team from emailing commitment documents that legitimately contain SSNs will be disabled within a day; the right design allows the encrypted, labelled path and blocks the unlabelled one.

### Daily hygiene for operators

- A password manager with unique passwords; the vault itself behind MFA and a passkey.
- Separate browser profiles per client tenant so a session cookie for one never sits beside another.
- External sharing links with expiry and, for PII, "specific people" only.
- Sign out of delegated mailboxes on shared machines; review **Settings → Security → Your devices** (Google) and **My Sign-Ins** (`mysignins.microsoft.com`) monthly for sessions you do not recognise.
- Delete PII files on delivery and empty the recycle bin; retention is also security.

> **Warning:** MFA fatigue attacks send push prompts until someone taps Approve. If you receive a prompt you did not start, deny it, change your password, and report it. Number matching in Microsoft Authenticator and passkeys remove the attack entirely, which is why they should be the default.

### Try It Yourself

```text
Security baseline checklist for a 5-person virtual back office (Microsoft 365 Business Premium)

Identity
  [ ] Security defaults OFF, Conditional Access ON: MFA for all, block legacy auth,
      require compliant or hybrid-joined device for admins
  [ ] Authenticator with number matching; passkeys for the two admins
  [ ] Break-glass admin account, password in the safe, excluded from CA, alerts on sign-in
Email
  [ ] Defender anti-phishing: impersonation protection for CEO + 3 client domains
  [ ] Safe Links + Safe Attachments ON; Report Phishing button deployed
  [ ] SPF, DKIM, DMARC (p=quarantine) on firm.com (check with `dig txt _dmarc.firm.com`)
Data
  [ ] Labels: Public / Internal (default) / Confidential / Client-PII (auto: SSN, passport)
  [ ] DLP policy: SSN + credit card, external email + SharePoint sharing,
      test mode 2 weeks -> policy tips -> block with justification
  [ ] External sharing: specific people only for Client-PII sites; anonymous links expire 7 days
Review
  [ ] Monthly: sign-in risk report, sharing report, DLP incidents, inactive accounts
```

### Quiz

1. Which MFA method is resistant to phishing sites that proxy the real login page?
- [ ] SMS codes
- [ ] Authenticator app codes
- [x] Passkeys / FIDO2 security keys
> A passkey only signs for the genuine domain, so a look-alike site gets nothing useful.

2. A client emails new bank details for the next invoice. What do you do?
- [ ] Update the details; the email is in the real thread
- [x] Call the client on a number you already had to confirm before changing anything
- [ ] Reply asking them to confirm by email
> Compromised mailboxes reply inside real threads; out-of-band confirmation is the control.

3. What does a sensitivity label do that a folder permission does not?
- [x] Travels with the file, encrypting and restricting it wherever it is copied
- [ ] Renames the file
- [ ] Deletes the file after 30 days
> Permissions stop at the folder edge; labels protect the document itself.

4. Why start a DLP policy in test mode?
- [ ] It is free in test mode
- [x] To see what would be blocked and fix false positives before disrupting legitimate work
- [ ] Test mode encrypts more strongly
> A policy that blocks real work gets disabled; tune first, then enforce.

### Exercises

1. **Phish triage** — You receive "Your SharePoint file 'Rate Matrix' has been shared" from `no-reply@sharepointonline-files.com`. List the checks and the action.
<details><summary>Solution</summary>

Real SharePoint sharing mail comes from `no-reply@sharepointonline.com` or the sharer's address; the domain here is a look-alike. Hover the button: it will not point to `firm.sharepoint.com`. You did not expect the share. Action: do not click, use Outlook's Report → Report phishing, and if it names a real colleague, ask them in Teams whether they shared anything. If you clicked and signed in, change the password, revoke sessions at My Sign-Ins, and tell the admin immediately.

</details>

2. **Label design** — A freelancer handles title commitments containing SSNs for a US client on Microsoft 365 Business Premium. Design the label and DLP rule.
<details><summary>Solution</summary>

Label "Client-PII": encryption, permissions for the client's domain and the freelancer only, no forward or print, watermark "Contains PII"; auto-labelling rule when the US SSN sensitive information type appears with medium confidence. DLP policy on Exchange and OneDrive: if SSN count is at least 1 and recipient is outside the client domain, block with override and justification, notify the user with a policy tip; on the client domain, allow only when the Client-PII label is applied (so mail is encrypted). Audit for two weeks first.

</details>

### Interview Questions

**Q: What security controls would you put in place first for a small business moving to Microsoft 365?**
MFA for every account with an authenticator app and number matching, Conditional Access to block legacy authentication and require MFA everywhere, SPF, DKIM and DMARC on the domain, Defender anti-phishing with impersonation protection for the leadership and top client domains, a default "Internal" sensitivity label with a "Confidential" option, and external sharing set to expiring links with specific people for sensitive sites. Then a DLP policy in test mode for the data types the business actually handles, and a monthly review of sign-in risk and sharing reports. Everything else comes after those, because they stop the incidents that actually happen: credential phishing and accidental oversharing.

**Q: How do you handle client data such as SSNs and ID scans as a freelancer?**
Receive them only through a platform or an encrypted link, never plain email; store them in a labelled, encrypted folder that syncs to nothing; process on one machine with disk encryption; deliver via an expiring link to named people; and delete the source and working files on confirmation, emptying the recycle bin. I say so in the scope confirmation, which clients like to hear. For US title work I also refuse to put SSNs in file names or email subjects, which is where they leak most often.

**Q: Describe the difference between sensitivity labels, DLP and retention labels.**
Sensitivity labels classify and protect a document: encryption, access restrictions, watermarks, travelling with the file. DLP inspects content in motion or at rest for sensitive information types and enforces rules like block, warn or justify when it leaves the boundary. Retention labels govern lifecycle: how long to keep and when to delete, with records management for legal holds. They combine: a Client-PII sensitivity label encrypts the file, a DLP policy blocks it from leaving unencrypted, and a retention label deletes it 30 days after the job closes.

## Admin basics (users, licences, groups)

Even if you are not the administrator, understanding what the admin does makes you faster at requesting the right thing, and small businesses often make the operations person the de facto admin. This chapter covers the lifecycle every admin manages: creating users, assigning licences, building groups, handling leavers, and the reports that show whether the tenant is healthy, in both Microsoft 365 and Google Workspace.

### The admin surfaces

| Task | Microsoft 365 | Google Workspace |
|---|---|---|
| Users, licences, groups | admin.microsoft.com | admin.google.com |
| Identity, MFA, Conditional Access | entra.microsoft.com | Admin → Security |
| Email flow, mailbox rules | admin.exchange.microsoft.com | Admin → Apps → Google Workspace → Gmail |
| SharePoint sites, sharing | SharePoint admin center | Admin → Apps → Drive and Docs |
| Compliance, labels, DLP | purview.microsoft.com | Admin → Security → Data protection |
| Scripted administration | Microsoft Graph PowerShell, Exchange Online PowerShell | GAM (open-source CLI), Admin SDK |

### Creating a user

Microsoft 365: **Users → Active users → Add a user**: name, display name, username and domain, password settings (auto-generate, require change at first sign-in), licence, optional roles, and profile info (job title, department, manager, which feed Teams and the org chart). Google: **Directory → Users → Add new user**: name, primary email, organisational unit, and password.

The naming standard for usernames should be decided once: `first.last@firm.com` is the common choice, and a policy for duplicates (`first.last2`) exists before the second Ali joins.

```text
Microsoft Graph PowerShell (Connect-MgGraph -Scopes "User.ReadWrite.All","Organization.Read.All")
$pw = @{ Password = "TempP@ss-2026-09"; ForceChangePasswordNextSignIn = $true }
New-MgUser -DisplayName "Sara Khan" -UserPrincipalName sara.khan@firm.com -MailNickname sara.khan `
  -AccountEnabled -PasswordProfile $pw -UsageLocation PK -Department Operations -JobTitle "Production Assistant"
$sku = Get-MgSubscribedSku | Where-Object SkuPartNumber -eq "O365_BUSINESS_PREMIUM"
Set-MgUserLicense -UserId sara.khan@firm.com -AddLicenses @{SkuId=$sku.SkuId} -RemoveLicenses @()
```

`UsageLocation` is required before a licence can be assigned. Google's equivalent with GAM: `gam create user sara.khan firstname Sara lastname Khan password random changepassword on ou /Operations`.

### Licences

Licences are what the user can do: a Business Basic user has web Office and mail; Business Standard adds desktop apps; Business Premium adds Defender, Intune and Purview features. Shared mailboxes, resource mailboxes (meeting rooms) and guests need no licence. **Billing → Licenses** shows assigned versus available, and unassigned licences are wasted money, which is why the leaver process removes them.

Group-based licensing (Entra ID P1) assigns licences to every member of a group automatically; put new starters in "All Staff – Business Premium" and the licence follows.

Google licences are per user and edition (Business Starter, Standard, Plus, Enterprise); **Billing → Subscriptions** shows counts. Archived User licences are cheaper and keep a leaver's data searchable in Vault.

### Groups

Groups are where people get confused, because Microsoft has four kinds:

| Kind | Purpose | Gets |
|---|---|---|
| Microsoft 365 group | Collaboration | Shared mailbox, calendar, SharePoint site, Planner, optionally a Team |
| Distribution list | Email to many | An address only |
| Mail-enabled security group | Permissions plus email | Used to grant SharePoint access and receive mail |
| Security group | Permissions | Used in Conditional Access, licensing, SharePoint |

Rule of thumb: a **Team** for a working group (it creates the Microsoft 365 group), a **security group** for permissions, and a **distribution list** only for announcement addresses. Dynamic groups (Entra ID P1) fill membership from attributes: `(user.department -eq "Operations")`.

Google has one kind, the **Google Group**, which is an email address, a collaborative inbox if enabled, and a permission principal for Drive and Calendar all at once, configured by its access settings. Organisational units, not groups, carry policy in Google (which apps, which security settings).

### Leavers: the process that protects the business

Offboarding is the admin task most often done badly. Order matters:

1. Block sign-in (Microsoft: **user → Block sign-in**; Google: **Suspend user**) and revoke sessions (`Revoke-MgUserSignInSession`).
2. Convert the mailbox to shared or set forwarding to the manager for 90 days; set an auto-reply.
3. Transfer OneDrive/Drive ownership (Microsoft: OneDrive access delegated to the manager for 30 days by default, adjustable in the SharePoint admin center; Google: **Transfer ownership** in the user's deletion wizard).
4. Remove from groups, remove Send As permissions on shared mailboxes, remove from Power Automate flow ownership and Apps Script triggers (this is the step everyone forgets, and it breaks automation).
5. Wipe or retire company data on mobile devices (Intune or Google endpoint management).
6. Remove the licence; delete the account after the retention period.

### Reports and health

Monthly: **Reports → Usage** (active users, mailbox sizes near quota, OneDrive storage), **Entra → Sign-in logs** filtered to failures and risky sign-ins, **SharePoint → Sharing reports** for anonymous links, and **Message trace** in the Exchange admin center when "the client did not get my email". Google's counterparts are **Reporting → Reports** and **Audit and investigation**, with the Email log search for message tracing.

> **Interview note:** "How would you remove a leaver?" is a standard question for operations and VA roles because the wrong answer (delete the account) loses mail, files and every automation they owned. The strong answer starts with "block sign-in and revoke sessions", keeps data, and mentions transferring flow and script ownership.

### Try It Yourself

```text
Leaver runbook: sara.khan@firm.com (last day 2026-09-30)

T-1 day  Manager confirms handover doc; list her flows (Power Automate → My flows) and Apps Script triggers
Day 0    09:00  Block sign-in; Revoke-MgUserSignInSession -UserId sara.khan@firm.com
         09:05  Reset password; remove MFA methods; retire Intune device
         09:15  Convert mailbox to shared; grant manager FullAccess; auto-reply "Sara has left; contact orders@firm.com"
         09:30  Delegate OneDrive to manager (SharePoint admin center → user → OneDrive → Manage access), 90 days
         09:45  Remove from: All Staff (licence group), Operations security group, orders@ Send As, Teams
         10:00  Re-own flows to svc-automation@; reinstall Apps Script triggers under svc-automation@
         10:15  Remove licence (group removal handles it); document in the offboarding log
Day 90   Delete account; OneDrive retained per SharePoint admin setting; mailbox stays shared
```

### Quiz

1. Which of these needs no licence in Microsoft 365?
- [ ] A user who only uses Outlook on the web
- [x] A shared mailbox under 50 GB
- [ ] A user with desktop Office
> Shared and resource mailboxes are free; users always need a licence.

2. What is the first step when offboarding a leaver?
- [ ] Delete the account
- [x] Block sign-in and revoke active sessions
- [ ] Remove the licence
> Blocking preserves data while cutting access; deletion comes months later.

3. Which group type should carry SharePoint permissions?
- [ ] Distribution list
- [x] Security group (or mail-enabled security group)
- [ ] A personal contact list
> Distribution lists are addresses only; security groups are permission principals.

4. Why is transferring flow ownership part of offboarding?
- [x] Flows and scripts stop running when their owner's account is disabled
- [ ] Flows are deleted automatically
- [ ] Licences depend on it
> Automation tied to a leaver's identity dies silently unless re-owned.

### Exercises

1. **Licence audit** — Write the Graph PowerShell to list users who have no licence but are enabled.
<details><summary>Solution</summary>

```text
Get-MgUser -All -Property DisplayName,UserPrincipalName,AccountEnabled,AssignedLicenses |
  Where-Object { $_.AccountEnabled -and $_.AssignedLicenses.Count -eq 0 } |
  Select-Object DisplayName, UserPrincipalName
```

</details>

2. **Group design** — A 12-person firm has Operations, Sales and two admins, plus a `support@` address. Choose the groups.
<details><summary>Solution</summary>

Security groups: SG-Operations, SG-Sales, SG-Admins (used for Conditional Access and SharePoint). Licensing: SG-AllStaff with group-based licensing if Entra P1 is available, otherwise assign per user. Teams: "Operations" and "Sales" (each creates a Microsoft 365 group with its site). `support@` is a shared mailbox with SG-Operations members given FullAccess and Send As. No distribution lists are needed; "everyone" mail goes to the All Company Team's group address.

</details>

### Interview Questions

**Q: A new starter joins Monday. What do you do as the tenant admin?**
Create the account from the naming standard with a temporary password that must change at first sign-in and usage location set, put them in the licensing group so Business Premium is assigned, add them to the department security group and the relevant Team, add them to any shared mailboxes with the right send permission, and register their device with Intune so Conditional Access passes. I send a welcome mail with the MFA enrolment link and the SOP for email, files and naming. On day one I check that MFA is enrolled and that they can open the shared mailbox, because those are the two things that generate the first support ticket.

**Q: What is the difference between a Microsoft 365 group, a security group and a distribution list?**
A Microsoft 365 group is a collaboration container: it owns a shared mailbox, calendar, SharePoint site and optionally a Team, and its membership also works for permissions. A security group is purely a permission principal, used in Conditional Access, group-based licensing and SharePoint access, with no mailbox. A distribution list is an email address that expands to its members and nothing else. I use Teams for working groups, security groups for anything policy-related, and distribution lists only for one-way announcement addresses, and I document which is which because a security group accidentally used as a distribution list becomes impossible to clean up later.

**Q: How would you investigate "the client never received my email"?**
Message trace in the Exchange admin center, or Email log search in Google, for the sender, recipient and time window; it shows delivered, quarantined, deferred or rejected with the reason. If it was delivered, the problem is at the client's end and I send them the message ID; if it bounced, the NDR code tells me whether it was their spam filter, a DMARC failure on our side or a typo in the address. I also check our domain's SPF, DKIM and DMARC records, because a missing DKIM signature is the most common reason a small business's mail lands in spam.

## Automation with Zapier/Make and APIs (Graph API, Google APIs overview)

Power Automate and Apps Script live inside their own suites. When a workflow crosses products, such as a Fiverr order email creating a Trello card, a Google Sheet row and a Slack message, you reach for a cross-platform integrator (Zapier, Make) or for the underlying APIs directly (Microsoft Graph, Google APIs). This chapter explains when each is the right tool, how authentication works, and the shape of the calls you will make most.

### Choosing the layer

| Need | Tool | Why |
|---|---|---|
| Connect two SaaS apps, no code, low volume | Zapier | Largest connector library, linear "Zap" model, easiest to hand over |
| Branching, loops, data transforms, more volume per dollar | Make (formerly Integromat) | Visual scenarios with routers, iterators, aggregators; ops-priced |
| Anything inside Microsoft 365 | Power Automate | Included in the licence, deepest connectors |
| Anything inside Google Workspace | Apps Script | Free, runs as you, full access |
| High volume, custom logic, versioned code | Direct API calls from Python or Node | No per-task fees, testable, but you own auth and errors |

Pricing shapes the decision: Zapier charges per **task** (each action step), Make per **operation** (each module run), so a scenario that processes 200 rows in a loop costs 200 operations on Make but may be one multi-step Zap with a looping plan on Zapier. Read the current plan limits before promising a client a monthly cost.

### Zapier: a Zap

A Zap is a trigger plus one or more actions, with optional Filter, Formatter, Paths and Delay steps.

```text
Zap: Fiverr order email -> project tracker
Trigger : Gmail - New Email Matching Search   query: from:fiverr.com subject:"New order"
Filter  : only continue if Body contains "Order #"
Format  : Formatter - Text - Extract Pattern   regex: Order #(\w+)   -> order_id
Action  : Google Sheets - Create Spreadsheet Row   Orders / columns: Date, Order ID, Subject, Status=New
Action  : Slack - Send Channel Message   #orders  "New Fiverr order {{order_id}}: {{subject}}"
```

Zapier polls most triggers every 1 to 15 minutes depending on plan; instant triggers exist where the app supports webhooks. **Zap History** shows every run with the data at each step, which is where you debug.

### Make: a scenario

Make's canvas has modules connected by lines, with **routers** for branching, **iterators** to split arrays into bundles and **aggregators** to combine them. A typical scenario: **Watch emails** (Gmail) → **Iterator** over attachments → **Upload a file** (Google Drive) → **Router** (PDF vs DOCX) → **Add a row** (Google Sheets). Error handlers (**Ignore**, **Resume**, **Rollback**, **Break**) are attached per module, which is more granular than Zapier. Scenarios run on a schedule (every 15 minutes on the free tier, as low as 1 minute on paid) or instantly via webhook.

### Webhooks: the universal glue

A webhook is an HTTP URL that receives a POST when something happens. Zapier's **Webhooks by Zapier** and Make's **Custom webhook** module give you a URL; anything that can make an HTTP request (Apps Script's `UrlFetchApp`, Power Automate's HTTP action, a Python script, Microsoft Forms via Power Automate) can trigger the workflow.

```javascript
// Apps Script: notify a Make scenario when a Sheet row is marked Delivered (installable onEdit trigger)
function notifyMake(e) {
  const sheet = e.range.getSheet();
  if (sheet.getName() !== 'Tracker' || e.value !== 'Delivered') return;
  const row = sheet.getRange(e.range.getRow(), 1, 1, sheet.getLastColumn()).getValues()[0];
  UrlFetchApp.fetch(PropertiesService.getScriptProperties().getProperty('MAKE_WEBHOOK'), {
    method: 'post', contentType: 'application/json',
    payload: JSON.stringify({ order: row[0], client: row[2], deliveredAt: new Date().toISOString() })
  });
}
```

### Microsoft Graph API

Graph is the single REST API for Microsoft 365: users, mail, calendar, files, Teams, SharePoint lists. Base URL `https://graph.microsoft.com/v1.0`. Authentication is OAuth 2.0 through Entra ID: an **app registration** with either **delegated** permissions (acting as a signed-in user, e.g. `Mail.Read`) or **application** permissions (a daemon with no user, e.g. `Mail.Read` for all mailboxes, admin-consented). Explore at `developer.microsoft.com/graph/graph-explorer`.

```text
GET  /me/messages?$filter=isRead eq false and hasAttachments eq true&$top=20&$select=subject,from,receivedDateTime
GET  /users/orders@firm.com/mailFolders/inbox/messages?$search="subject:invoice"
POST /me/sendMail                       body: { "message": { "subject": "...", "toRecipients": [...] } }
GET  /sites/{site-id}/drive/root:/Orders/Orders.xlsx:/workbook/tables/OrdersTable/rows
POST /sites/{site-id}/drive/root:/Orders/Orders.xlsx:/workbook/tables/OrdersTable/rows   body: { "values": [[ ... ]] }
GET  /drives/{drive-id}/items/{item-id}/content?format=pdf      convert DOCX to PDF
GET  /me/calendarView?startDateTime=2026-09-16T00:00:00Z&endDateTime=2026-09-17T00:00:00Z
```

OData query options `$filter`, `$select`, `$top`, `$orderby`, `$expand` and paging via `@odata.nextLink` apply everywhere. Throttling returns HTTP 429 with a `Retry-After` header; a client must honour it. The Excel endpoints (`/workbook/...`) are the same ones Power Automate's Excel connector uses, which is why a table is required there too.

```python
import requests, msal
app = msal.ConfidentialClientApplication(CLIENT_ID, authority=f"https://login.microsoftonline.com/{TENANT}", client_credential=SECRET)
token = app.acquire_token_for_client(scopes=["https://graph.microsoft.com/.default"])["access_token"]
r = requests.get("https://graph.microsoft.com/v1.0/users/orders@firm.com/mailFolders/inbox/messages",
                 params={"$filter": "isRead eq false", "$select": "subject,from,receivedDateTime", "$top": 10},
                 headers={"Authorization": f"Bearer {token}"})
for m in r.json()["value"]:
    print(m["receivedDateTime"], m["from"]["emailAddress"]["address"], m["subject"])
```

### Google APIs

Google exposes one API per product: Gmail API, Drive API v3, Sheets API v4, Calendar API v3, Docs API, plus the Admin SDK. Enable them in a Google Cloud project, create OAuth credentials (user consent) or a **service account** (server-to-server; share the Sheet or Drive folder with its email, or use domain-wide delegation in Workspace to impersonate users). Scopes are URLs such as `https://www.googleapis.com/auth/spreadsheets`.

```python
from google.oauth2 import service_account
from googleapiclient.discovery import build
creds = service_account.Credentials.from_service_account_file("svc.json", scopes=["https://www.googleapis.com/auth/spreadsheets"])
sheets = build("sheets", "v4", credentials=creds)
sheets.spreadsheets().values().append(
    spreadsheetId=SHEET_ID, range="Tracker!A:F", valueInputOption="USER_ENTERED",
    body={"values": [["2026-09-16", "FO4A2B7C9", "S. Lee", "PDF form", "2026-09-18", "New"]]}).execute()
```

Sheets API quotas are per minute per project (300 read requests per minute per project by default); batch with `values().batchGet` and `batchUpdate` rather than one call per cell. Drive's `files.export` with `mimeType=application/pdf` converts a Google Doc to PDF, the analogue of Graph's `?format=pdf`.

### Reliability rules that apply to all of them

- Store secrets in the platform's secret store (Zapier/Make connections, Script Properties, environment variables), never in a Sheet.
- Make every step idempotent; integrators retry on failure, and a retried "create row" without a key check makes duplicates.
- Handle 429 and 5xx with exponential backoff (`Retry-After` where given).
- Log each run with an ID that appears in the destination row, so a support question can be traced back.
- Review costs monthly: task and operation counts drift up as clients add volume.

> **Tip:** Before building on an integrator, check whether the two products already talk: Microsoft Forms to Excel, Google Forms to Sheets, and Outlook to Teams need nothing. The cheapest automation is the one you do not have to run.

### Try It Yourself

```python
# Graph: list unread order emails and append them to a SharePoint Excel table (application permissions).
import requests, msal, os
TENANT, CLIENT_ID, SECRET = os.environ["TENANT"], os.environ["CLIENT_ID"], os.environ["SECRET"]
SITE, PATH = os.environ["SITE_ID"], "/Orders/Orders.xlsx"
app = msal.ConfidentialClientApplication(CLIENT_ID, authority=f"https://login.microsoftonline.com/{TENANT}", client_credential=SECRET)
tok = app.acquire_token_for_client(scopes=["https://graph.microsoft.com/.default"])["access_token"]
H = {"Authorization": f"Bearer {tok}"}
G = "https://graph.microsoft.com/v1.0"
msgs = requests.get(f"{G}/users/orders@firm.com/mailFolders/inbox/messages",
                    params={"$filter": "isRead eq false and hasAttachments eq true", "$select": "id,subject,from,receivedDateTime", "$top": 25},
                    headers=H).json()["value"]
rows = [[m["receivedDateTime"][:16].replace("T", " "), m["from"]["emailAddress"]["address"], m["subject"], "New", m["id"][:24]] for m in msgs]
if rows:
    r = requests.post(f"{G}/sites/{SITE}/drive/root:{PATH}:/workbook/tables/OrdersTable/rows", headers=H, json={"values": rows})
    r.raise_for_status()
    for m in msgs:
        requests.patch(f"{G}/users/orders@firm.com/messages/{m['id']}", headers=H, json={"isRead": True})
print(f"logged {len(rows)} messages")
```

### Quiz

1. What is the main pricing difference between Zapier and Make?
- [x] Zapier bills per task (action step); Make bills per operation (module run)
- [ ] Make is free for business use
- [ ] Zapier only charges for triggers
> Loops over many items can cost very differently on each platform.

2. What does HTTP 429 from Graph or a Google API mean?
- [ ] Authentication failed
- [x] You are throttled; wait for `Retry-After` and retry
- [ ] The resource does not exist
> Backoff is mandatory in any production integration.

3. Which permission type lets a nightly script read every mailbox without a user signed in?
- [ ] Delegated
- [x] Application (admin-consented)
- [ ] Guest
> Delegated permissions act as a signed-in user; application permissions run as the app itself.

4. Why should integrations be idempotent?
- [ ] To use fewer tasks
- [x] Because platforms retry failed runs and a non-idempotent step creates duplicates
- [ ] Because APIs require it
> Key checks or unique IDs in the destination prevent double rows and double emails.

### Exercises

1. **Choose the tool** — A client wants every Upwork contract email to create a folder in SharePoint and a card in Trello. Which tool and why?
<details><summary>Solution</summary>

Power Automate: the trigger (Outlook email) and one action (SharePoint create folder) are native and included in the licence, and Trello has a standard connector. Zapier would work but adds a monthly cost for something the licence already covers. If the mailbox were Gmail instead of Outlook, Make or Zapier becomes the natural bridge, or Apps Script with a Graph call for the SharePoint side.

</details>

2. **Backoff** — Add retry with exponential backoff to a `requests.get` call against Graph.
<details><summary>Solution</summary>

```python
import time
def get(url, **kw):
    for attempt in range(6):
        r = requests.get(url, **kw)
        if r.status_code not in (429, 500, 502, 503, 504):
            return r
        time.sleep(float(r.headers.get("Retry-After", 2 ** attempt)))
    r.raise_for_status()
```

</details>

### Interview Questions

**Q: When would you use Zapier or Make instead of Power Automate or Apps Script?**
When the workflow crosses ecosystems that the native tools do not connect well, when the client has no developer and needs to maintain it themselves from a visual canvas, or when time to deliver matters more than per-task cost. Inside Microsoft 365 or Google Workspace the native tools are cheaper and deeper. For high volume or complex logic I go to the APIs directly from Python, because per-task pricing becomes expensive and code is testable and version-controlled. A concrete case: Fiverr order emails to a Google Sheet and Slack was a five-minute Zap; a nightly reconciliation of 3,000 SharePoint list items was a Python script against Graph.

**Q: Explain how authentication to Microsoft Graph works for an unattended script.**
Register an application in Entra ID, grant it application permissions such as `Mail.Read` or `Sites.ReadWrite.All`, have an admin consent, and give it a client secret or certificate. The script uses MSAL's client-credentials flow to get a bearer token for the `.default` scope, sends it in the Authorization header, and refreshes when it expires after about an hour. Application permissions apply tenant-wide, so I restrict mailbox access with an application access policy in Exchange to just the mailboxes the script needs, and I prefer certificates over secrets with an expiry reminder in the calendar.

**Q: What goes wrong in integrations after they have been running for months?**
Expired credentials and secrets, renamed columns or sheets, a connector's API version being deprecated, quota changes as volume grows, and duplicates from retries when steps were not idempotent. I counter with alerts on failed runs, a run ID written into every destination row, a monthly review of run counts and costs, and documentation listing every place a workflow reads from or writes to. The one that catches most teams is the owner leaving; business-critical integrations sit under a service account with shared credentials in a vault.

## SOP for a virtual back office

A standard operating procedure turns "how Ali does it" into "how it is done". For a virtual back office, which may be one assistant covering several clients or a small team covering one, the SOP is what lets someone else take over for a week, what you point to when a client asks "what exactly do you do?", and what makes quality measurable. This chapter shows how to write one that gets used, with the structure, the daily and weekly routines, and the metrics.

### What an SOP is and is not

An SOP is a numbered procedure with an owner, a trigger, steps, checks and an escalation path. It is not a policy essay or a training manual. Each SOP fits on one or two pages and answers: when does this start, what do I do, how do I know it is done, and who do I ask.

```text
SOP-EM-01  Inbound email triage (orders@firm.com)
Owner: Ali Raza          Reviewed: 2026-09-01     Next review: 2026-12-01
Trigger: 09:00, 13:00, 17:00 PKT and on Desktop Alert for Red category
Inputs: orders@ Inbox; Order tracker (Sheet); Templates folder
Steps
  1. Open orders@ in Outlook; sort by received.
  2. For each unread message:
     a. Client order or revision -> category Red, move to 01 New, add tracker row (SOP-TR-02), send "received" template within 1 h.
     b. Question on an open order -> reply from thread, category Yellow, update tracker status.
     c. Invoice/payment -> forward billing@, archive.
     d. Newsletter/vendor -> archive; unsubscribe if recurring.
     e. Suspicious -> Report phishing; do not click; note in the security log.
  3. Inbox zero for unread by end of slot; unresolved items stay in 03 Waiting client with a follow-up date.
Checks: no unread older than 4 business hours; every 01 New item has a tracker row.
Escalate: any request for payment detail changes -> phone the client; any legal or dispute language -> owner.
```

### The SOP set for a document production back office

| Code | SOP | Trigger |
|---|---|---|
| EM-01 | Inbound email triage | Three daily slots |
| EM-02 | Client status updates | Daily 16:00 client time for jobs over two days |
| TR-02 | Order tracker maintenance | Every new order, status change, delivery |
| PR-03 | Job intake and scope confirmation | New order or brief |
| PR-04 | Production checklist per deliverable type (DOCX, fillable PDF, EPUB, handbook) | Job starts |
| PR-05 | QA and delivery | Job complete |
| FI-06 | Invoicing and payment follow-up | Delivery; 7 and 14 days after |
| FS-07 | File naming, folders and retention | Every file |
| SC-08 | Security incidents and phishing | Suspicious mail or lost device |
| CA-09 | Calendar and meeting scheduling across time zones | Meeting request |
| HR-10 | Cover and handover | Planned absence |

Each production checklist (PR-04) is where domain knowledge lives: for a fillable PDF, "field names match the client list, tab order tested, Reader-extended if the client needs saving, tested in Acrobat Reader and Chrome, form summary exported"; for a handbook, "TOC updated, heading numbering continuous, page count matches, PDF/A exported, bookmarks present".

### Daily and weekly rhythm

```text
Daily (PKT)          09:00 triage | 09:30 tracker review, plan the day | 13:00 triage
                     16:00 status updates for US clients (07:00 CT start of their day)
                     17:00 triage | 17:30 delivery/QA slot | 18:00 log hours, tomorrow's top three
Weekly (Fri 17:00)   metrics (below), template review, open items older than 5 days, invoice follow-ups
Monthly (1st)        retention sweep, sharing-link review, SOP review dates, licence/cost check
Quarterly            SOP audit: pick 3 SOPs, follow them literally, fix what does not match reality
```

The three fixed triage slots matter more than any tool: they set the client's expectation ("replies at 9, 1 and 5 PKT, which is overnight, early morning and morning US Central") and stop the inbox from running the day.

### Metrics that say whether the back office works

| Metric | Source | Target |
|---|---|---|
| First response time (median) | Tracker or platform stats | Under 1 h in working hours |
| Unread older than 4 business hours | Outlook search `received:<4h isread:no` | 0 |
| On-time delivery rate | Tracker | 98 percent |
| Revision rounds per job | Tracker | Under 1.2 average |
| Invoices over 14 days | Billing sheet | 0 |
| SOP steps skipped (audit) | Quarterly audit | 0 critical |

A one-page weekly report with these six numbers, sent to the client or manager on Friday, is the deliverable that makes a virtual back office visible; the work itself is invisible when it goes well.

### Writing SOPs people follow

- Write while doing the task, not from memory; screenshots for anything with a menu path.
- One trigger, one owner, one page. Split anything longer.
- Use the imperative ("Open", "Move", "Send"), number the steps, and put checks at the end.
- Store in a SharePoint library or Drive folder with version history; link from the tracker.
- Review dates in the header; a quarterly audit where someone else follows the SOP literally reveals every step that lives only in your head.
- Templates referenced by name and path, so the SOP does not paste template text that then drifts.

### Handover and cover

HR-10 exists so the business survives your holiday. It lists: mailbox and calendar delegation set (Advanced level), tracker link, SOP index, client-specific notes (who wants same-day replies, who prefers calls), open jobs with dates, and what not to do (never send contracts, never change payment details). A cover person who has the SOP set and this page can run the office for a week; the quality of the handover is a direct test of the SOP quality.

> **Interview note:** "Tell me about a process you documented" is answered best with the SOP's code, its trigger, one specific check and the metric it improved. "I wrote an email triage SOP with three fixed slots and a four-hour unread check, and median first response dropped from 5 hours to 40 minutes" is a hiring answer; "I documented our processes" is not.

### Try It Yourself

```text
SOP-PR-05  QA and delivery (fillable PDF)
Owner: Ali Raza     Reviewed: 2026-09-01     Next review: 2026-12-01
Trigger: production checklist PR-04 complete
Steps
  1. Open the PDF in Acrobat Reader (not Acrobat Pro): confirm every field accepts input and the file can be saved.
  2. Tab through all fields from the first; order matches reading order; note any jump.
  3. Export field summary (Acrobat: Prepare Form -> More -> Export Data / or pdftk dump_data_fields) and compare names to the client list; count must match (e.g. 168/168).
  4. Test in Chrome and in Edge; note any dropdown or calculation that does not render.
  5. Run the naming check (FS-07): 2026-09-18_SLee_IntakeForm_v01_FINAL.pdf
  6. Copy to 03 Delivered; upload to the platform order page with the delivery template; include the validation summary
     ("168 fields, tab order verified, tested in Reader 2024, Chrome 129, Edge 129").
  7. Tracker: status Delivered, delivered date, revision count 0/2; calendar reminder +3 days for follow-up.
Checks: field count matches; tested in 3 viewers; tracker updated; file in 03 Delivered matches the file sent.
Escalate: client list and form disagree -> message the client before delivery, not after.
```

### Quiz

1. What must every SOP have in its header?
- [ ] A company history
- [x] An owner, a trigger and a review date
- [ ] A cost estimate
> Without a trigger nobody knows when it starts; without an owner nobody maintains it.

2. Why fixed triage slots instead of continuous inbox checking?
- [x] They set client expectations and protect production time
- [ ] Email servers require it
- [ ] To reduce storage
> Three slots at 9, 1 and 5 PKT still cover US clients' morning.

3. Which metric best shows the office is not silently failing clients?
- [ ] Total emails received
- [x] Unread messages older than four business hours (target zero)
- [ ] Number of templates
> Old unread mail is the earliest signal of a dropped request.

4. How do you find steps that exist only in the author's head?
- [ ] Ask the author
- [x] Have someone else follow the SOP literally in a quarterly audit
- [ ] Add more screenshots
> The audit is the only test of whether an SOP is complete.

### Exercises

1. **Write an SOP** — Draft SOP-FI-06 (invoicing and follow-up) in the same format, for a freelancer with direct clients paid by bank transfer.
<details><summary>Solution</summary>

Header: owner, reviewed, next review. Trigger: job status set to Delivered and accepted. Steps: create invoice from template with date-first name; send with the delivery thread as reference and a due date 7 days out; tracker column Invoice date; day 7 reminder template "gentle"; day 14 reminder "firm" plus pause new work for that client; day 21 escalate to owner or platform dispute where applicable; on payment, record date and mark Paid. Checks: no invoice over 14 days without a logged reminder. Escalate: any request to change bank details from the client side is confirmed by phone.

</details>

2. **Metric design** — A client says "responses feel slow" but your median is 40 minutes. Which metric do you add and why?
<details><summary>Solution</summary>

The 90th percentile first response time and the count of replies over 4 business hours, broken down by time of day in the client's zone. A good median hides a tail: messages arriving at 17:30 PKT wait until the next morning, which is the client's early afternoon. The fix is likely a fourth slot or an auto-acknowledgement with a promised time, and the tail metric proves whether it worked.

</details>

### Interview Questions

**Q: How would you set up a virtual back office for a small firm from scratch?**
First week: shared mailbox for the role address, a tracker, a folder structure with naming rules, templates for the ten recurring messages and MFA everywhere. Second week: SOPs for triage, intake, delivery, invoicing and security, each one page with owner, trigger, steps and checks, and three fixed triage slots aligned to the client's morning. Third week: the weekly six-metric report and the automation that is free with the licence, such as Forms to Excel and a delivery-note flow. I resist tools until the SOP exists, because a tool automating an undefined process automates the confusion.

**Q: How do you keep SOPs from going stale?**
Review dates in the header and a calendar task that fires them; a quarterly audit where a colleague follows three SOPs literally and logs every point where reality differs; templates referenced by path so the SOP does not duplicate content; version history on the SOP library so changes are visible; and treating every incident or client complaint as a trigger to check which SOP step was missing. Stale SOPs come from being written once and stored where nobody looks, so they are linked from the tracker people open every day.

**Q: What metrics would you report to a client for back-office work, and why those?**
Median and 90th percentile first response time, unread older than four business hours, on-time delivery rate, revision rounds per job, invoices over 14 days and hours logged by category. They cover speed, reliability, quality and cash, they come from the tracker and platform stats without extra work, and each has a target the client agreed to. I send them on a single page every Friday. The tail metric is there because a good median with a bad tail is exactly what a client experiences as "slow".

## Interview questions for VA/operations/back-office roles

Virtual assistant, operations coordinator, back-office and executive-support interviews test three things: whether you can run the tools without supervision, whether you can be trusted with access and money, and whether you can communicate with people who are busier than you. This chapter collects the questions that come up, in the order interviewers tend to ask them, with the shape of a strong answer. Use it as a rehearsal script.

### How these interviews run

| Stage | Format | What is assessed |
|---|---|---|
| Screening (30 min) | Video call, often with the founder or manager | Communication, time-zone fit, availability, English |
| Practical test | Take-home or live: inbox triage, calendar puzzle, spreadsheet task, a mock client email | Tool fluency, judgement, speed |
| Scenario interview | "What would you do if…" | Security, prioritisation, escalation |
| Reference and trial | Paid trial week or month | Reliability |

For Fiverr and Upwork, the "interview" is the profile, the proposal and the first message; the same answers, shortened, belong there.

### Tools and fluency

```text
Q  Which email client do you prefer and why?
A  Whichever the client uses; the workflow matters more: three triage slots, folders by stage,
   categories for urgency, rules for platforms, templates for the ten recurring messages.
   In Outlook I use Quick Steps and Quick Parts; in Gmail, filters, templates and multiple inboxes.

Q  How do you schedule a meeting between Lahore, London and Dallas?
A  Find the overlap first: 16:00 PKT = 12:00 BST = 06:00 CDT, so the window is roughly
   18:00-21:00 PKT. Send the invite with the client's zone in the subject, use FindTime or
   Calendar's Find a time, and confirm in writing with all three times listed.

Q  What is the difference between sharing a OneDrive link and attaching the file?
A  A link is one copy with version history and revocable access; an attachment is a snapshot
   that drifts. I send links for anything that will change and attachments only for final
   deliverables to people outside the tenant who cannot sign in.
```

Expect a live task: "here are 15 emails, triage them" or "the CEO's calendar has a double booking, fix it". Narrate your reasoning as you go; the interviewer is watching the judgement, not the clicks.

### Trust and security

```text
Q  You receive an email from the CEO asking you to buy gift cards urgently. What do you do?
A  Treat it as phishing until confirmed by voice on a known number. Gift-card requests, urgency
   and secrecy are the three signs. I would not reply to the email, would report it, and would
   tell the CEO on Teams or by phone.

Q  A client asks you to share your login so they can check something. What do you say?
A  No, politely, and offer the right mechanism: delegation, a shared mailbox, a shared folder
   with their own account. Shared credentials void the audit trail and usually the platform's
   terms.

Q  How do you handle client documents containing personal data?
A  Encrypted storage only, no sync to personal devices, expiring links to named people,
   deletion on delivery, and it is written in the scope confirmation.
```

### Prioritisation and judgement

```text
Q  Three things arrive at once: a client revision due today, a payment reminder to send,
   and the manager asking for a report by end of day. Order them.
A  Ask one question if anything is unclear, then: the client revision (external deadline,
   revenue at risk), the manager's report (internal deadline), the reminder (no deadline
   today). I tell the manager the order and when each will be done, so nothing is a surprise.

Q  A client is angry about a late delivery that was late because their files arrived late.
A  Acknowledge, state the facts once with dates from the tracker, propose the fix and a new
   time in their zone, and do not argue. Later, tighten the intake SOP so the delivery date
   is confirmed as "N days from receipt of files".

Q  What do you do when you do not know how to do something asked of you?
A  Say so, estimate how long to learn it, and check whether there is a faster route. I once
   built a Power Automate approval flow for a client in a day by starting from a template
   and the run history rather than pretending I had done it before.
```

### Communication

```text
Q  Write a two-line status update for a delayed job.
A  "Quick update on the 767-page handbook: TOC and numbering are done, the PDF/A export is
   running now, and you will have the file by 10 am CT tomorrow instead of today because
   the source had 40 unlinked cross-references I have now fixed. No action needed."

Q  How do you say no to a client?
A  With an alternative: what I can do, by when, and at what cost, in writing on the platform.
```

### Questions to ask them

Interviewers rate candidates on their questions. Good ones: Which tools and tenant will I work in, and will I have my own account? What does a good week look like in this role, measured how? Who do I escalate to, and what is the expected response time in each direction? Is there an SOP set, or would you like me to build one? What is the overlap window you need?

### Portfolio evidence that shortens the interview

- An anonymised SOP page (triage or delivery) as a PDF.
- A screenshot of a tracker with the metric row.
- A sample template set with the personal first line filled in.
- Platform stats: response time, on-time rate, review count (400+ reviews is a number to say early).
- One automation story with before and after numbers.

> **Tip:** Interviewers for these roles are often the person you would be supporting, and they are hiring to get time back. Every answer that ends with "so you do not have to think about it" lands, provided the mechanics behind it are real.

### Try It Yourself

```text
Rehearsal card: 60-second self-introduction (operations / VA)

Who    : Ali Raza, Lahore (UTC+5), 7+ years across BPO team leadership (20 agents), US title-insurance
         production support (weekly status reports, rate matrices) and 400+ freelance document projects.
Tools  : Microsoft 365 and Google Workspace end to end; Outlook/Gmail systems, SharePoint/Drive, Forms,
         Power Automate, Apps Script; Excel and Power BI reporting.
How    : Fixed triage slots, one tracker, written SOPs, weekly six-metric report.
Proof  : Fiverr response time under 1 hour across 400+ orders; on-time delivery 98 percent;
         built an intake form + flow that removed three emails per order.
Ask    : Overlap window you need, tools you use, who I escalate to.
```

### Quiz

1. What is the safest answer to "please share your login so I can check"?
- [ ] Share it once and change the password after
- [x] Decline and offer delegation or shared access under their own account
- [ ] Share only if the client is long-standing
> Shared credentials destroy accountability and usually breach terms of service.

2. In the three-tasks scenario, why does the client revision come first?
- [x] It has an external deadline today and revenue at risk
- [ ] Clients are always more important than managers
- [ ] It is the shortest task
> Order by deadline and consequence, then tell the manager the plan.

3. What makes a status update strong?
- [ ] Apologising several times
- [x] What is done, what is next, a new time in the client's zone and whether action is needed
- [ ] Explaining every technical detail
> Busy readers want state, next step and whether they must do anything.

4. Which portfolio item shortens a VA interview most?
- [ ] A list of software logos
- [x] Platform metrics and an anonymised SOP page
- [ ] A long CV
> Evidence of speed and process beats claims.

### Exercises

1. **Live triage** — Fifteen emails: 4 client questions, 2 revisions, 3 newsletters, 1 invoice, 1 phishing attempt, 2 meeting invites, 2 vendor pitches. Describe your first five minutes.
<details><summary>Solution</summary>

Report the phishing attempt first (one click, removes risk). Accept or propose times for the two invites (calendar accuracy affects others). Categorise the two revisions Red and reply "received, delivering by X" (client-facing clock is running). Reply to the four questions in order of client deadline, using templates with a personal first line. Forward the invoice to billing, archive newsletters and vendor pitches, unsubscribe from the recurring ones. Narrate each decision aloud.

</details>

2. **Story bank** — Write one STAR story (situation, task, action, result) for "tell me about a process you improved".
<details><summary>Solution</summary>

Situation: a title-insurance production team received status requests by email all day. Task: reduce interruptions without losing visibility. Action: built a weekly status report from the production tracker with a fixed Friday send, an intake form for requests, and a rule routing platform notifications into a single labelled queue. Result: ad-hoc status emails dropped from roughly 30 a week to under 5, and the report became the artefact managers used in their own meetings.

</details>

### Interview Questions

**Q: Why should we trust a remote assistant with access to our mailbox and files?**
Because access is structured, not personal: delegation or a shared mailbox rather than shared passwords, MFA on my accounts with an authenticator app, separate browser profiles per client, expiring links, and deletion of personal data on delivery, all written into the scope. Every action I take is visible in your audit logs under my own identity. I also tell you what I will not do without a call: change payment details, send contracts, or share files externally. Trust comes from you being able to see and revoke everything, which is how I set it up on day one.

**Q: What would you do in your first week supporting an executive?**
Get delegated access to mailbox and calendar, learn who the twenty people they reply to fastest are, agree the triage slots and the rules for what I answer versus flag, build the folder and category scheme, and draft the ten templates from their own past replies so the voice matches. By Friday they get a one-page summary of what came in, what I handled, what needs them, and the questions I could not answer. The goal of week one is that they open a smaller inbox on Monday and nothing was missed.

**Q: How do you work with a client whose working day barely overlaps yours?**
By making the overlap explicit and the asynchronous parts reliable: my triage at 17:00 PKT is their 07:00 CT, so they wake to replies; my status update at 16:00 their time is my late evening slot for jobs that need it; every promised time is written in their zone; and a shared tracker means they never need to ask where something is. For anything requiring discussion I offer two slots in the overlap window each week. Clients in Texas have told me the time difference felt like an advantage because work happened overnight.

**Q: What is your process when a task is ambiguous?**
Ask one precise question rather than several vague ones, propose a default if I do not hear back by a stated time, and start on the parts that are not ambiguous. For example, "You asked for the handbook as PDF; I will export PDF/A-2b with bookmarks unless you need a print-shop PDF/X by 10 am CT, and I am proceeding with the TOC either way." That keeps the work moving, respects the client's time and records the decision in writing.
