---
id: title-insurance
title: Title Insurance & Title Search Fundamentals
icon: 🏠
track: Operations & Career
color: #1B4F72
runner: none
tagline: The US real-estate domain knowledge behind your production data and rate matrices.
description: US title insurance for production and data analysts: what title insurance is, owner's vs lender's policies, the title search and examination process, public records (deeds, mortgages, liens, judgments), chain of title, commitments and exceptions, closing and escrow basics, endorsements, rate structures (filed rates, simultaneous issue, reissue rates), underwriters and agents, state differences, ALTA forms, rate calculators and combined rate matrices, production workflows and KPIs, and industry interview questions.
---

# LEVEL: Beginner

## What title insurance is and why lenders require it

**Title** is the legal right to own, use and sell a piece of land. When someone buys a house in the United States they are not really buying bricks; they are buying the seller's title, and everything wrong with that title comes along with it. **Title insurance** is a policy that pays the insured if a defect in the title that existed before the policy date later causes a loss.

It is unlike every other insurance you know:

| Feature | Car or health insurance | Title insurance |
|---|---|---|
| Insures against | Future events | Past events already in the records (or hidden) |
| Premium | Monthly or yearly | One payment at closing, covers as long as you own the property |
| Main cost to the insurer | Paying claims | Searching and curing problems before issuing (loss prevention) |
| Claims ratio | High (70–80% of premium) | Low (around 4–6% of premium) |

Because the insurer's money goes mainly into **searching** public records and **fixing** problems before closing, the title-search and examination workforce, including offshore production teams in Lahore, is the engine of the industry.

### What can go wrong with a title

```text
Unreleased mortgage    The seller paid off a loan in 2015 but the bank never recorded the release.
Unknown heir           The previous owner died; a child not named in probate still owns a share.
Forged deed            A deed in the chain was signed by someone pretending to be the owner.
Tax lien               Unpaid property taxes or an IRS lien attach to the land, not the person.
Judgment lien          A court judgment against the seller became a lien on all their real estate in the county.
Easement               The utility company has a recorded right to run lines across the back yard.
Boundary dispute       The garage sits two feet onto the neighbour's lot.
Clerical error         The legal description says Lot 12 when the house is on Lot 21.
```

A title search finds most of these. Title insurance covers the rest, including the ones no search could find, such as forgery, incapacity of a signer, or a recording clerk's mistake.

### Why lenders require it

A mortgage lender's collateral is the house. If the borrower's title turns out to be defective, the lender's lien may be worthless. So every lender that sells loans to Fannie Mae, Freddie Mac or the secondary market requires a **lender's policy** (also called a **loan policy** or **mortgagee policy**) in the amount of the loan. The borrower pays for it, but the lender is the insured. This requirement is why title insurance is written on nearly every financed purchase and every refinance in the country, and why loan volume drives production volume.

### The one-time premium

The premium is paid once at closing. A **rate** is expressed per $1,000 of coverage (or from a table by amount) and varies by state and by whether the state sets rates, insurers file them, or competition sets them. A $300,000 owner's policy might cost $1,500 in one state and $2,200 in another. Rate structures are the Advanced level of this course and the reason a data analyst in a title company spends so much time in rate matrices.

```excel
=ROUND(MIN(A2,100000)*5.75/1000 + MAX(0,MIN(A2,1000000)-100000)*5.00/1000, 2)
```

That formula computes a Florida owner's premium for an amount in `A2` up to $1,000,000, using Florida's promulgated tiers of $5.75 per thousand on the first $100,000 and $5.00 per thousand on the next $900,000. Every rate calculator you build is a version of it.

### The size of the industry

Title premiums in the US run around $15–25 billion a year depending on the housing cycle. Four underwriter families write about 80% of it: Fidelity National Financial (Fidelity, Chicago Title, Commonwealth), First American, Old Republic and Stewart. Thousands of independent agents and attorneys write policies on their behalf.

> **Tip:** When someone in an interview asks "what does a title company actually do", answer in one line: it searches the public records to prove who owns the land and what claims exist against it, fixes what can be fixed, insures what remains, and handles the money and documents at closing.

### Try It Yourself

```text
Read this like an examiner. Which items would a search find, and which would only insurance cover?

1. A 2012 mortgage from Wells Fargo with no recorded satisfaction.
2. The 2009 deed was signed by "John A. Smith"; the 2004 deed vested "John Smith and Mary Smith".
3. The seller's brother claims their late mother meant to leave him the house.
4. A recorded 1978 easement for a gas pipeline.
5. The notary on the 2019 deed was later convicted of notarising forged signatures.

Search finds: 1, 2, 4 (all in the record).  Search cannot find: 3 (off-record heir claim), 5 (forgery).
Both categories are covered by an owner's policy; only the first group can be cured before closing.
```

### Quiz

1. Title insurance mainly protects against:
- [ ] Fire and flood damage after purchase
- [x] Defects in ownership that already existed when the policy was issued
- [ ] Falling house prices
> Title insurance looks backward at the record; hazard insurance looks forward at events.

2. Who is the insured under a lender's policy?
- [ ] The buyer
- [x] The mortgage lender
- [ ] The seller
> The borrower pays the premium, but the policy indemnifies the lender's lien.

3. Why is the claims ratio for title insurance so low compared with other lines?
- [ ] Claims are rarely reported
- [x] Most of the premium is spent on searching and curing defects before the policy is issued
- [ ] Policies expire after one year
> Loss prevention through search and examination is the industry's core cost.

4. How often is a title premium paid?
- [x] Once, at closing
- [ ] Monthly
- [ ] Annually
> An owner's policy lasts as long as the insured or their heirs own the property, with no renewal.

### Exercises

1. **Explain to a client** — Write three sentences telling a first-time buyer why they should buy an owner's policy when the lender already requires a loan policy.
<details><summary>Solution</summary>

```text
The lender's policy protects only the bank's loan and shrinks as you pay it down; it pays you
nothing if a defect costs you your equity. An owner's policy protects your ownership and equity,
including against forgery and unknown heirs that no search can find, for as long as you own the
home. It is a one-time cost at closing, usually discounted when bought with the lender's policy.
```

</details>

2. **Compute a premium** — Using the Florida tiers ($5.75 per $1,000 up to $100,000, then $5.00 per $1,000 up to $1,000,000), compute the owner's premium for $350,000.
<details><summary>Solution</summary>

```text
First 100,000 x 5.75 / 1000 = 575.00
Next  250,000 x 5.00 / 1000 = 1,250.00
Total owner's premium        = 1,825.00
```

</details>

### Interview Questions

**Q: What is title insurance and how is it different from other insurance?**
Title insurance indemnifies the insured against loss from defects in title that existed on or before the policy date: forged or missing deeds, unreleased liens, unknown heirs, errors in the public record, and similar problems. Unlike auto or homeowner's insurance it covers the past, not the future, and it is bought with a single premium at closing that lasts as long as the insured holds an interest. Its economics are inverted too: most of the premium funds the search and examination that prevent claims, so the loss ratio sits around 5% while the expense ratio is high. A strong candidate adds that this is why production quality directly drives profitability: every defect caught in examination is a claim that never happens.

**Q: Why do lenders insist on a loan policy when the borrower is the one who might lose the house?**
The lender's asset is the mortgage lien, and a lien is only as good as the borrower's title. If a prior owner's heir surfaces or a senior lien was missed, the lender's collateral evaporates, and loans sold to Fannie Mae, Freddie Mac or securitised pools must carry a loan policy for exactly this reason. The policy insures the lender for the loan amount, decreasing as the balance falls, and it adds coverage the lender specifically needs, such as the priority and validity of the lien. Because the borrower pays for a policy that protects someone else, most states allow a heavily discounted owner's policy when both are issued together, the simultaneous issue rate.

**Q: Who are the biggest players in the US title industry and how is the work distributed?**
Four underwriter groups write roughly 80% of premium: Fidelity National Financial, First American, Old Republic and Stewart, with Doma, WFG and regional underwriters sharing the rest. Underwriters set the forms, rates where permitted, underwriting standards and bear the risk, but most policies are actually produced by independent agents, attorney agents in states like New York and Georgia, and underwriter-owned direct operations. Production work, meaning searches, examinations, commitment typing and data entry, is heavily outsourced to specialised vendors and offshore teams, which is where a data-processing team lead in Lahore fits into the chain. Understanding that chain explains who your client is, who their client is, and whose rules govern the file.

## Owner's versus lender's policies and coverage

Two policies are issued on most purchases, and they protect different people for different amounts. Confusing them is the most common beginner mistake in production data, where the same file can carry an owner's amount, a loan amount and two premiums.

### Owner's policy

The **owner's policy** insures the buyer (and later their heirs) for the purchase price. It never decreases. It stays in force as long as the insured owns the property or remains liable under warranties in a deed they later give. If a covered defect appears, the underwriter either pays the loss up to the policy amount or pays to defend and cure the title.

### Lender's (loan) policy

The **loan policy** insures the lender for the original loan amount, decreasing as principal is repaid, and ends when the loan is paid off. It insures not only that the borrower owns the land but that the **mortgage is valid, enforceable and has the priority stated**. When the loan is refinanced, the old loan policy dies with the old loan and a new one is required, which is why refinances generate title orders even though the owner has not changed.

| | Owner's policy | Loan policy |
|---|---|---|
| Insured | Buyer and heirs | Lender and assignees of the loan |
| Amount | Purchase price (can be higher) | Loan amount |
| Duration | As long as ownership lasts | Until the loan is paid off |
| Required by | Nobody (optional, strongly recommended) | The lender |
| Who pays | Varies by state and custom (seller in much of FL and TX, buyer elsewhere) | Borrower, almost always |
| Typical premium | Full rate | Simultaneous issue rate (small) when issued with an owner's policy; full rate on a refinance |

### Standard versus extended coverage

The industry uses standard ALTA (American Land Title Association) forms, updated in 2006 and again in 2021.

- **Standard coverage** insures against defects in the public record and hidden risks such as forgery and incapacity, subject to a set of standard exceptions for matters a survey or inspection would reveal.
- **Extended coverage** removes some or all of those standard exceptions (survey matters, parties in possession, unrecorded easements, mechanic's liens) in exchange for a survey, an owner's affidavit and, usually, a higher premium.
- The **ALTA Homeowner's Policy** is an enhanced owner's policy for one-to-four family residences that adds post-policy coverage (for example, forgery after the policy date, and building-permit and zoning violations up to limits) and automatic inflation increases up to 150% of the amount.

Lender's policies are routinely issued with extended coverage because lenders demand it; owner's policies are often standard unless the buyer pays for more.

### Covered risks, in plain language

The 2021 ALTA Owner's Policy lists covered risks including that title is vested other than as stated, any defect, lien or encumbrance on the title, unmarketable title, no right of access, and the enforcement of governmental police power only as recorded. The standard **exclusions** are just as important:

```text
Excluded from coverage (every policy):
- Zoning, building and environmental laws, unless a notice is recorded
- Matters created, agreed to, or known by the insured but not disclosed
- Matters resulting in no loss to the insured
- Matters arising after the policy date (with limited Homeowner's exceptions)
- Federal bankruptcy and creditors' rights issues
- Unpaid taxes and assessments not shown as liens in the records
```

If a buyer knew about a neighbour's fence encroachment and did not tell the title company, that is a "known to the insured" exclusion. If the city rezones the street after closing, that is post-policy and excluded.

### Amounts in the data

A production report row typically carries both figures:

```text
File        State  Type      Owner's Amt   Loan Amt    Owner's Prem   Loan Prem   Simultaneous?
WY-24-0187  WY     Purchase  425,000       340,000     1,912.50       125.00      Y
WY-24-0188  WY     Refinance         0     280,000          0.00     1,070.00     N
TN-24-0912  TN     Purchase  310,000       310,000     1,517.50       100.00      Y
```

A refinance has no owner's policy. A purchase with a loan larger than the price (rare, but rehab loans do it) needs the loan policy amount to exceed the owner's amount, and many states charge extra for the excess.

> **Interview note:** "Does the owner's policy cover the loan?" No. Two separate contracts, two insureds. The seller's old owner's policy also does nothing for the buyer; it may only earn the buyer a **reissue** discount in states that offer one.

### Try It Yourself

```excel
' Classify a file from its amounts (put owner's amount in B2, loan amount in C2)
=IF(AND(B2>0,C2>0),"Purchase: owner's + simultaneous loan",IF(AND(B2=0,C2>0),"Refinance: loan policy only",IF(AND(B2>0,C2=0),"Cash purchase: owner's only","Check amounts")))
```

### Quiz

1. Which policy amount decreases over time?
- [ ] Owner's policy
- [x] Loan policy
- [ ] Both
> The loan policy tracks the unpaid principal; the owner's policy stays at the purchase price or grows under the Homeowner's form.

2. A buyer's owner's policy is issued in 2024. In 2031 they discover a 2019 forged deed in the chain. Covered?
- [x] Yes, forgery before the policy date is a covered risk
- [ ] No, the policy expired after five years
- [ ] Only if the lender also claims
> Owner's coverage lasts as long as ownership and covers hidden pre-policy defects such as forgery.

3. What does "extended coverage" typically remove?
- [ ] The exclusion for zoning laws
- [x] Standard exceptions for survey matters, parties in possession and unrecorded easements
- [ ] The policy amount limit
> Extended coverage trades a survey and affidavits for deleting the standard exceptions.

4. On a refinance file, what is the owner's policy amount?
- [ ] The new loan amount
- [ ] The home's current value
- [x] There is no owner's policy on a refinance
> The owner has not changed; only the lender needs a new policy for the new loan.

### Exercises

1. **Spot the error** — A report shows a refinance file with owner's premium $1,200 and loan premium $100 marked simultaneous. What is wrong and how would you flag it?
<details><summary>Solution</summary>

```text
A refinance has no owner's policy, so the owner's premium should be 0 and the loan policy
must carry the full (or refinance-rate) premium, not the $100 simultaneous rate. Flag with a
validation rule: IF(type="Refinance" AND (ownersPrem>0 OR simultaneous="Y")) -> error, and
ask production to confirm whether the file was mis-typed as Refinance or the premiums were swapped.
```

</details>

2. **Coverage check** — For each event, say whether a standard owner's policy responds: (a) an IRS lien recorded against the seller two years before closing and missed in the search; (b) the county rezones the parcel a year after closing; (c) a neighbour proves by survey that the fence is on their land, and the policy carries the standard survey exception.
<details><summary>Solution</summary>

```text
(a) Yes: a recorded lien existing before the policy date is a covered defect.
(b) No: post-policy governmental action is excluded.
(c) No under standard coverage: the survey exception excludes it. Extended coverage or an
    ALTA survey endorsement would have covered it.
```

</details>

### Interview Questions

**Q: Explain the difference between an owner's policy and a loan policy to a data analyst who will never see a closing.**
They are two contracts on the same file. The owner's policy insures the buyer for the purchase price, never decreases and lasts as long as they own the property; the loan policy insures the lender for the loan amount, decreases with the balance and ends when the loan is paid off. In the data this means a purchase file usually has both amounts and both premiums, with the loan premium at a small simultaneous-issue rate, while a refinance file has a loan amount and premium only. When validating a production report I check those relationships mechanically: refinances with owner's premiums, purchases with zero loan premium but a loan amount, or simultaneous flags where the loan amount exceeds the owner's amount are the three patterns that catch most keying errors.

**Q: What are the standard exceptions and why do they exist?**
Standard exceptions are matters excluded from a standard-coverage policy because a records search cannot discover them: rights of parties in possession, encroachments and boundary matters a survey would show, unrecorded easements, mechanic's liens for work not yet filed, and taxes or assessments not yet due. They exist because the insurer only searched the record, so it will not insure against what only a site inspection or survey would reveal. They can be removed for extended coverage when the insurer receives a survey, an owner's or seller's affidavit about possession and construction, and sometimes indemnities, which is routine on loan policies and commercial deals. In the commitment they appear in Schedule B Part II, and getting them removed is a large part of a closer's pre-closing work.

**Q: What does the ALTA Homeowner's Policy add and when would you recommend it?**
It is an enhanced owner's form for one-to-four family residential property that adds coverages the standard policy lacks: certain post-policy risks such as forgery or adverse possession after the policy date, encroachment of structures onto neighbouring land, violations of recorded restrictions and building permits up to stated limits, and an automatic inflation feature increasing the amount by 10% a year to 150%. It costs typically 10 to 20% more than the standard owner's policy and requires the property to be improved residential land with the insured a natural person or trust. I would recommend it to any owner-occupant buyer; the extra premium is small relative to the purchase price and the added coverages address the disputes homeowners actually have, such as fences, sheds and HOA restrictions.

## The parties: underwriter, agent, title company, escrow and lender

A title file passes through many hands, and every report you build names one of these parties in a column. Learn what each does and who pays whom.

### The underwriter

The **underwriter** is the insurance company that issues the policy and pays claims: Stewart Title Guaranty Company, First American Title Insurance Company, Chicago Title, Fidelity National Title, Commonwealth Land Title, Old Republic National Title, and smaller ones such as WFG and Doma. Underwriters are licensed by each state's insurance department, hold reserves, write the policy forms (based on ALTA templates), publish underwriting manuals and bulletins, and file or follow rates. They also run their own direct offices in many markets.

### The title agent

A **title agent** is a company or attorney licensed by the state and appointed by one or more underwriters to search, examine, issue commitments and policies, and often close. The agent keeps most of the premium (a **split** of commonly 80–90% to the agent and 10–20% remitted to the underwriter) and is responsible for the search and for following the underwriter's guidelines. An agent appointed by several underwriters chooses which one to place a given policy with, which is where multi-underwriter rate matrices come from.

```text
Premium $1,500 on an owner's policy in an 85/15 split
  Agent keeps    $1,275   (search, exam, closing, overhead, profit)
  Underwriter    $  225   (risk, reserves, claims, forms, regulation)
```

### Title company, escrow company and closing attorney

"**Title company**" is the everyday name for the agent or direct operation the customer deals with. In many western states (California, Washington, Arizona, Nevada) an **escrow company** or the title company's escrow department holds the money and documents and closes the deal as a neutral third party. In **attorney states** (New York, Georgia, South Carolina, Massachusetts, Connecticut and others) a lawyer must conduct the closing and often acts as the title agent. In Texas, title companies close through licensed escrow officers. Every state has a custom, and the custom decides who your production client is.

### Lender, borrower, buyer, seller, real-estate agents

The **lender** orders the loan policy, issues closing instructions, and wires the loan funds. The **buyer/borrower** and **seller** sign the deed and loan documents. **Real-estate agents** on both sides refer the business, which is why marketing in title is relationship-driven and why RESPA rules on kickbacks matter. **Surveyors**, **appraisers** and **notaries** appear at the edges.

### The offshore production vendor

Underwriters and large agents outsource high-volume steps: order entry, search from online title plants, examination support, commitment and policy typing, post-closing document tracking, and data projects such as building rate matrices or indexing a county's back records. The vendor's team lead reports to the client's production manager. Quality is measured against the client's SOP and, ultimately, the underwriter's guidelines, because an error in a typed commitment can become a claim.

| Party | Main job | Paid by |
|---|---|---|
| Underwriter | Bears risk, issues policy, sets guidelines | Share of premium |
| Agent / title company | Search, examine, commit, issue, often close | Share of premium plus fees |
| Escrow / closer / attorney | Holds funds, prepares statement, disburses, records | Settlement or escrow fee |
| Lender | Funds the loan, requires loan policy | Interest and loan fees |
| Production vendor (offshore) | Search, exam support, typing, data | Per-file or per-hour fee from agent or underwriter |

### Regulators and industry bodies

Each state's **Department of Insurance** (Texas Department of Insurance, Florida Office of Insurance Regulation, Wyoming Department of Insurance, Tennessee Department of Commerce and Insurance, California Department of Insurance) licenses underwriters and agents and approves or promulgates rates. The **ALTA** trade association publishes the policy and endorsement forms and Best Practices for agents. The federal **CFPB** enforces **RESPA** (no kickbacks for referrals, rules on affiliated businesses) and **TRID** (the Loan Estimate and Closing Disclosure timing rules).

> **Warning:** Never describe the underwriter as "the title company's insurer" in a client report. The underwriter insures the property owner or lender; the agent is its appointed representative. The distinction matters legally, and clients notice when a vendor gets it wrong.

### Try It Yourself

```text
Map the money and the paper on one purchase with a 90/10 agent split.

Purchase price 400,000   Loan 320,000   Owner's premium 1,900   Loan premium (simultaneous) 100

Buyer  -> pays 1,900 + 100 premiums and a 450 settlement fee at closing (in a buyer-pays state)
Agent  -> keeps 1,710 + 90 = 1,800 of premium, plus the 450 fee; remits 190 + 10 = 200 to the underwriter
Lender -> wires 320,000 loan funds to the escrow account; receives the loan policy after recording
Escrow -> disburses seller proceeds, payoffs, commissions; records the deed and mortgage
Vendor -> billed the agent 35 per file for search-and-exam support (separate invoice, not from premium)
```

### Quiz

1. Who bears the risk of a claim on a title policy?
- [ ] The title agent
- [x] The underwriter
- [ ] The lender
> The agent produces the policy; the underwriter issued it and pays covered losses.

2. In a typical agency split, who keeps most of the premium?
- [x] The agent
- [ ] The underwriter
- [ ] The state
> Agents keep 80–90% because they carry the search, examination and closing cost.

3. In which type of state must a lawyer conduct the closing?
- [ ] Escrow states such as California
- [x] Attorney states such as New York and Georgia
- [ ] Promulgated-rate states such as Texas
> Attorney-closing states require a licensed attorney at the settlement table.

4. Which federal law prohibits paying real-estate agents for referrals of title business?
- [ ] TRID
- [x] RESPA
- [ ] ALTA
> RESPA Section 8 bans kickbacks and unearned fees for settlement-service referrals.

### Exercises

1. **Name the party** — Who does each: (a) publishes the policy form; (b) wires the loan funds; (c) decides which underwriter gets a policy; (d) keys a commitment from a search package overnight in Lahore?
<details><summary>Solution</summary>

```text
(a) ALTA publishes the template; the underwriter adopts and files it.
(b) The lender.
(c) The title agent (when appointed by several underwriters).
(d) The offshore production vendor's agent, under the title agent's or underwriter's SOP.
```

</details>

2. **Split the premium** — An agent has an 88/12 split. Compute the underwriter's remittance on a $2,350 owner's policy and a $125 simultaneous loan policy.
<details><summary>Solution</summary>

```text
Owner's: 2,350 x 12% = 282.00     Loan: 125 x 12% = 15.00     Total remittance 297.00
Agent retains 2,475 - 297 = 2,178.00
```

</details>

### Interview Questions

**Q: What is the relationship between a title underwriter and a title agent?**
The underwriter is the licensed insurer that bears the risk, holds reserves, sets underwriting standards and files rates where the state requires; the agent is an independent company or attorney the underwriter appoints by contract to search, examine, issue commitments and policies on its paper, and often to close. The agent keeps most of the premium, typically 80–90%, because it does the work; the underwriter receives the remainder for the risk. The agency agreement obliges the agent to follow the underwriter's manual, remit premiums monthly, keep escrow accounts reconciled and submit to audits, and the underwriter can cancel the appointment. Agents appointed by several underwriters place each policy according to rate, guideline and relationship, and in my production data work that placement decision is exactly what a combined multi-underwriter rate matrix supports.

**Q: How does the closing process differ between an escrow state and an attorney state, and why does it matter to a vendor?**
In escrow states such as California and Arizona a neutral escrow officer, often inside the title company, holds funds and documents, follows written instructions from both sides and the lender, and closes when all conditions are met, so the title company is the natural single point of contact. In attorney states such as New York, Georgia and South Carolina a licensed attorney must conduct the closing and frequently is the title agent, so the client is a law firm with its own procedures and the title company may only issue the policy. For a vendor this changes who sends the order, what document set arrives, what the SOP looks like and who signs off on quality; a Georgia closing attorney expects an attorney-style title opinion package while a Texas title company expects a T-7 commitment in the underwriter's format.

**Q: What does RESPA restrict and how does it affect a title agent's business?**
RESPA, the Real Estate Settlement Procedures Act, prohibits giving or receiving anything of value for the referral of settlement services on federally related mortgage loans, and it bans fee splits for work not actually performed. For a title agent that means no paying real-estate agents or lenders for orders, no free marketing services in exchange for business, and strict rules on affiliated business arrangements, which must be disclosed and cannot require use of the affiliate. It also gives borrowers the right to choose their own title company on purchase loans and underlies the Closing Disclosure's fee itemisation under TRID. Violations bring CFPB enforcement and licence risk, so compliance reviews of marketing spend are a normal part of agent operations.

## The real-estate transaction timeline

Every title file follows the same skeleton from order to policy. Production KPIs, SLA clocks and status codes all hang off these steps, so learn the sequence before you learn the software.

### From contract to policy

```text
Day 0    Purchase contract signed; buyer applies for a mortgage
Day 1    Title order opened (by the real-estate agent, lender or attorney) -> file number assigned
Day 1-5  Search: pull the chain of title, liens, judgments, taxes, plats from public records / title plant
Day 3-7  Examination: examiner reads the search, determines vesting, requirements, exceptions
Day 5-10 Commitment issued to lender, buyer, seller and attorneys (Schedule A, B-I, B-II)
Day 7-30 Curative: payoff letters, lien releases, probate documents, surveys, HOA estoppels, corrective deeds
Day 25   Lender's Closing Disclosure delivered (must be received 3 business days before consummation)
Day 30   Closing / settlement: documents signed, funds collected, disbursement
Day 30-31 Funding and recording: deed and mortgage recorded with the county; e-recording same day in many counties
Day 31-60 Post-closing: recorded documents returned, final policies issued (owner's and loan), file audited
Later    Policy delivered; claims, if any, handled by the underwriter
```

Refinances skip the purchase-contract and deed steps but follow the same search, commitment, closing, recording and loan-policy path, usually faster (two to three weeks).

### The order

An **order** arrives by email, a lender portal or an integration (Encompass, Qualia, ResWare, SoftPro) with the property address, parties, sale price, loan amount, lender and the closing date target. Order entry creates the **file** and its number, which is the primary key of everything that follows. Duplicate orders on the same property are common and must be caught.

### Search and examination

The **searcher** (abstractor) assembles the documents; the **examiner** decides what they mean. Chapter 6 and 7 cover both in detail. The output is the commitment.

### Commitment and curative

The **commitment** is the insurer's promise to issue a policy if the listed **requirements** are met, subject to the listed **exceptions**. Requirements might be "record a release of the 2015 mortgage", "obtain probate of the estate of Jane Doe", "pay 2024 taxes". Working those requirements is **curative** work and is the biggest source of delay. The closer collects payoff statements, releases and affidavits while the lender finishes underwriting the loan.

### Closing

At **closing** (called settlement in the east, escrow closing in the west) the deed, mortgage, note, affidavits and settlement statement are signed; the buyer's funds and lender's funds are collected; the seller's mortgage is paid off; commissions and fees are paid; and the seller receives proceeds. In a "dry" closing state funds disburse only after recording; in a "wet" state they disburse at the table.

### Recording and policy

The deed and mortgage are **recorded** with the county to give public notice and establish priority. Once recording confirms and the requirements are satisfied, the final **owner's policy** and **loan policy** are typed, dated as of recording, and delivered. In production data this is the "policy issued" milestone that ends the file's SLA clock.

### Milestones as data

| Milestone | Typical field | KPI built on it |
|---|---|---|
| Order received | `order_date` | Volume per day, per client, per state |
| Search complete | `search_done` | Search TAT (hours from order) |
| Commitment issued | `commit_date` | Commitment TAT; SLA typically 24–72 h |
| Cleared to close | `ctc_date` | Curative cycle time |
| Closed | `close_date` | Closing volume, fall-through rate |
| Recorded | `record_date` | Recording gap; e-recording adoption |
| Policy issued | `policy_date` | Post-closing TAT; unissued-policy backlog |

Files that never close are **cancelled** (financing fell through, inspection failed). Cancellation rate is a real KPI: 10–20% of purchase orders is normal, and searches on cancelled files are unpaid work in many contracts.

> **Tip:** When you build a weekly status report, put the milestone dates side by side and compute the gaps. "Average 4.2 days order-to-commitment, 21 days commitment-to-close, 9 days close-to-policy" tells a manager where the time goes, which a count of open files never does.

### Try It Yourself

```excel
' Milestone gaps for a file: order_date in B2, commit_date in C2, close_date in D2, policy_date in E2
=C2-B2                           ' days from order to commitment
=NETWORKDAYS(B2,C2)-1            ' business days, excluding weekends
=IF(E2="","OPEN",E2-D2)          ' close-to-policy gap, or OPEN if the policy is not issued
=IF(AND(C2="",TODAY()-B2>3),"SLA BREACH","")   ' commitment SLA of 3 days
```

### Quiz

1. Which document is issued after examination and before closing?
- [ ] The owner's policy
- [x] The title commitment
- [ ] The Closing Disclosure
> The commitment states requirements and exceptions; the policy follows recording.

2. When is the final loan policy typically issued?
- [ ] At order entry
- [ ] At the signing table
- [x] After the mortgage is recorded and requirements are satisfied
> The policy is dated as of recording so the insured mortgage's priority is established.

3. What is "curative" work?
- [x] Clearing the commitment's requirements such as payoffs, releases and probate documents
- [ ] Repairing the house before closing
- [ ] Re-running the search after closing
> Curative resolves title problems so the policy can issue without those exceptions.

4. Why does a refinance generate a new title order?
- [ ] The owner's policy must be reissued
- [x] The new loan needs its own loan policy and a fresh search for intervening liens
- [ ] The county requires it
> The old loan policy ends with the old loan; the new lender needs its own coverage.

### Exercises

1. **Compute the TATs** — A file: order 3 Mar, commitment 6 Mar, cleared 22 Mar, closed 28 Mar, recorded 29 Mar, policy 14 Apr. Give order-to-commitment, commitment-to-close and close-to-policy in calendar days.
<details><summary>Solution</summary>

```text
Order -> commitment:  3 days
Commitment -> close: 22 days
Close -> policy:     17 days   (the post-closing gap; likely a KPI concern if the SLA is 10 days)
```

</details>

2. **Status model** — Propose the status codes for a title file that let you compute every milestone gap and the cancellation rate.
<details><summary>Solution</summary>

```text
OPENED -> SEARCH_IN_PROGRESS -> SEARCH_COMPLETE -> EXAM_IN_PROGRESS -> COMMITMENT_ISSUED
-> CURATIVE -> CLEARED_TO_CLOSE -> CLOSED -> RECORDED -> POLICY_ISSUED
Side states: ON_HOLD (reason code), CANCELLED (reason code, date)
Store a timestamp per transition (status history table), not just the current status,
so gaps and rework loops (CURATIVE -> COMMITMENT_ISSUED for a revised commitment) are measurable.
```

</details>

### Interview Questions

**Q: Walk me through a purchase transaction from the title company's point of view.**
The order arrives from the agent, lender or attorney with the contract details and we open a file. The search pulls the chain of title, open mortgages, liens, judgments, taxes and plats from the county records or a title plant; the examiner reads it and produces a commitment listing what must happen before we insure (requirements) and what we will not insure (exceptions). Curative work then clears the requirements: payoff statements, lien releases, probate or divorce documents, surveys, HOA letters. Meanwhile the lender underwrites the loan and delivers the Closing Disclosure at least three business days before closing. At closing the parties sign, we collect and disburse funds according to the settlement statement, record the deed and mortgage, and after recording we issue the owner's and loan policies and close the file. Each step has a date, and those dates are the raw material of every production KPI.

**Q: Where do delays typically occur in the timeline and what can operations do about them?**
Curative is the long pole: waiting for payoff statements from servicers, releases of old mortgages that were paid but never satisfied of record, estate documents, and HOA estoppel letters. Search delays happen when a county's records are not online or the title plant is behind, and post-closing delays come from recording backlogs and from policies simply not being typed. Operations can attack each with data: order payoffs and HOA letters the day the commitment issues rather than the week before closing, maintain a curative task list with owners and due dates, use e-recording where the county supports it, and run an unissued-policy report weekly because unissued policies are both a compliance finding and unremitted premium. In a status report I would show the gap distribution per stage, not just averages, because one stuck estate file hides behind a healthy mean.

**Q: What is the difference between a wet and a dry closing?**
In a wet closing, used in most states, funds are disbursed at or immediately after the signing, often before the deed and mortgage are recorded, relying on a gap search and the title company's control of the documents. In a dry closing, common in some western escrow states, documents are signed but nothing disburses until recording is confirmed, so the seller may wait a day or two for proceeds. Wet closings shift more risk to the title company, which is why gap coverage, same-day e-recording and careful funding authorisation matter, while dry closings reduce risk at the cost of delay. From a reporting angle, the close date and the funding date differ in dry-closing states, and a KPI that uses only one of them will misstate cycle times.

## Public records and recording

Title insurance exists because the United States decided, county by county, that ownership of land is proven by **recorded documents** in a public office rather than by a government-guaranteed register (the Torrens system used in Australia and in a few US counties). A title search is a trip through that office's indexes. Understanding what is there, how it is indexed and what "recording" legally does is the foundation of every search you will ever run or process.

### The recording office

Each of the roughly 3,100 US counties (parishes in Louisiana, boroughs in Alaska) has a recording office: the **County Recorder**, **Register of Deeds**, **County Clerk** or **Clerk of Court** depending on the state. Anyone may record a document affecting land in that county by paying a fee; the office stamps it with a **recording date and time** and a **book and page** or **instrument number**, images it, and indexes it.

```text
Recorded: 2024-03-29 10:42:17   Instrument No. 2024-004512   Book 1187, Page 233
Doc type: WARRANTY DEED
Grantor:  SMITH, JOHN A; SMITH, MARY L
Grantee:  KHAN, ALI R
Legal:    LOT 12, BLOCK 3, WESTVIEW SUBDIVISION, PLAT BOOK 9, PAGE 44
Consideration: $425,000.00   Transfer tax: $850.00
```

### What gets recorded

| Document | What it does | Who it binds |
|---|---|---|
| **Deed** (warranty, special warranty, quitclaim) | Transfers ownership from grantor to grantee | Future buyers know who owns |
| **Mortgage / deed of trust** | Pledges the land as security for a loan | Establishes lien priority by recording time |
| **Release / satisfaction / reconveyance** | Cancels a mortgage of record | Clears the lien |
| **Assignment** | Transfers a mortgage to a new lender | Tracks who holds the lien |
| **Lien** (mechanic's, tax, HOA, judgment abstract) | Claims money against the land | Buyer takes subject to it |
| **Lis pendens** | Notice of a pending lawsuit about the land | Warns buyers |
| **Easement, covenant, restriction, plat** | Rights and rules that run with the land | Every future owner |
| **Power of attorney, affidavit, probate order** | Proves authority or facts | Supports a deed in the chain |

Other offices hold records that also affect title: the **court clerk** (judgments, probate, divorce, bankruptcy), the **tax collector** (property taxes), the **Secretary of State** (UCC fixture filings, business entity status) and federal courts (bankruptcy, federal tax liens are recorded locally).

### Why recording matters: notice and priority

Recording gives **constructive notice**: the law treats everyone as knowing what is in the record, whether they looked or not. That is what lets a buyer rely on the record and what makes an unrecorded deed dangerous to its holder. **Priority** among competing claims is generally "first in time, first in right" by recording date, subject to the state's recording statute:

- **Race** statutes (a few states): whoever records first wins, knowledge irrelevant.
- **Notice** statutes: a later buyer without notice of an earlier unrecorded interest wins even if they have not yet recorded.
- **Race-notice** statutes (most states): the later buyer wins only if they had no notice **and** recorded first.

Property tax liens jump the queue and are senior to everything; mechanic's liens in many states relate back to when work started, which is why the standard mechanic's lien exception exists.

### Indexes: how you actually find things

The recorder does not organise documents by property. Most counties keep a **grantor–grantee index** (two alphabetical name indexes: who gave and who received) and the search walks names backwards through time. Some states and counties also keep a **tract index** organised by legal description, which is far easier to search; title companies build their own private tract-indexed databases called **title plants**, mandatory in Texas.

```text
Grantee index search, backwards:
Khan, Ali R          grantee 2024  <- from Smith, John A & Mary L (warranty deed)
Smith, John A        grantee 2009  <- from Westview Homes LLC (warranty deed)
Westview Homes LLC   grantee 2007  <- from Miller Family Trust (deed) ... and so on to the search period limit
Then run each owner as GRANTOR for their ownership period: mortgages, easements, liens they created.
```

### Legal descriptions

Every recorded instrument identifies the land by a **legal description**, never just an address:

- **Lot and block**: "Lot 12, Block 3, Westview Subdivision, according to the plat recorded in Plat Book 9, Page 44" (platted subdivisions).
- **Metes and bounds**: a survey narrative of bearings and distances from a point of beginning (rural and older parcels).
- **Government survey** (PLSS): township, range and section, "the NW 1/4 of the SE 1/4 of Section 14, Township 2 North, Range 68 West" (most western states including Wyoming).
- **Condominium**: unit number plus the declaration's book and page.

A **parcel ID** or APN from the tax assessor is an index key, not a legal description, though searches usually start from it.

> **Warning:** A transposed lot number or a missing "Block" is enough to put a deed outside the chain of title. Data-entry accuracy on legal descriptions is the single most consequential quality metric on an indexing project, and a good QC sampling plan weights it accordingly.

### Try It Yourself

```text
Index this instrument for a title plant. Fill the fields; every blank is a QC-checkable value.

Source image: Deed of Trust recorded 2023-11-02, Inst. 2023-031877, Laramie County, WY
Trustor (borrower):  RAZA, ALI; RAZA, SARA
Trustee:             FIRST AMERICAN TITLE INSURANCE COMPANY
Beneficiary (lender): WELLS FARGO BANK NA
Amount:              $312,000.00
Legal:               LOT 7, BLOCK 2, SADDLE RIDGE ESTATES 3RD FILING, CITY OF CHEYENNE
Doc type code:       DOT          Related instrument: (none; release will reference 2023-031877)
Index as grantor: RAZA, ALI / RAZA, SARA    Index as grantee: WELLS FARGO BANK NA
```

### Quiz

1. What does recording a deed provide?
- [ ] Government guarantee of ownership
- [x] Constructive notice to the world and a place in the priority order
- [ ] Insurance against defects
> Recording is a notice system, which is exactly why title insurance is needed on top of it.

2. Under a race-notice statute, a later buyer beats an earlier unrecorded deed if:
- [ ] They paid more
- [x] They had no notice of it and recorded first
- [ ] They recorded at any time
> Both conditions, no notice and first to record, must be met.

3. Which index is organised by property rather than by name?
- [ ] Grantor–grantee index
- [x] Tract index
- [ ] Judgment index
> Tract indexes and title plants organise instruments by legal description.

4. Which lien is generally senior to a first mortgage regardless of recording date?
- [x] Property tax lien
- [ ] HOA lien
- [ ] Judgment lien
> Real-property tax liens have statutory super-priority in every state.

### Exercises

1. **Classify the description** — Identify the type of legal description: (a) "Beginning at an iron pin on the north line of Elm Road, thence N 02°14' E 210.5 feet…"; (b) "Unit 4B, The Meridian Condominium, Declaration recorded in Book 512, Page 1"; (c) "The S 1/2 of the NE 1/4 of Section 22, T13N, R67W of the 6th P.M."
<details><summary>Solution</summary>

```text
(a) Metes and bounds
(b) Condominium unit description (references the recorded declaration)
(c) Government (PLSS) survey description, typical of Wyoming; the 6th Principal Meridian
```

</details>

2. **Priority puzzle** — Bank A's mortgage recorded 2 May; a mechanic's lien for work begun 20 April is filed 15 June; a judgment against the owner is docketed 1 May but recorded 10 May; property taxes for the year are unpaid. Order the claims in a typical relation-back state.
<details><summary>Solution</summary>

```text
1. Property taxes (statutory super-priority)
2. Mechanic's lien (relates back to 20 April, before the mortgage)
3. Judgment lien (effective when docketed or recorded per state law; assume 1 May docketing gives it priority over the 2 May mortgage in states where docketing creates the lien)
4. Bank A's mortgage (2 May)
The exact order of 3 and 4 depends on the state's judgment-lien statute; the examiner must cite it.
```

</details>

### Interview Questions

**Q: Explain the difference between the recording system and a Torrens or registered-title system, and why title insurance follows from it.**
In a recording system the government merely files and indexes documents; it does not decide who owns what, so a buyer must reconstruct ownership by examining the chain of recorded instruments, and the record can contain forgeries, gaps and errors that the recorder has no duty to catch. In a registered system such as Torrens or the English Land Registry, the state examines and certifies the title, and the certificate is conclusive, backed by a government indemnity fund. Because the US chose recording, private parties had to fill the assurance gap, first with abstracts and attorney opinions and then, from the 1870s, with title insurance that both searches the record and insures against what the record cannot reveal. A handful of US counties still have Torrens parcels, and searchers must recognise them because the procedures differ.

**Q: How would you explain grantor–grantee indexing to a new data-entry agent, and what errors would you QC for?**
Every document has parties who give (grantors) and receive (grantees); the county indexes each document under every grantor name and every grantee name, and a search runs the current owner backwards as a grantee to find where they got the land, then each owner forwards as a grantor to find what they did while they owned it. So the index entry we key is the whole search's navigation system, and the errors that break it are name misspellings and inversions, missing co-grantors such as a spouse, wrong document type codes, a wrong recording date or instrument number, and the legal description keyed against the wrong lot. I would QC with a mandatory second-key on names and legals for the first two weeks, a 10% blind sample thereafter, and a defect taxonomy that weights legal-description and party-name errors highest because they make instruments unfindable.

**Q: What are the main categories of instrument you expect to see in a residential chain, and which ones commonly cause requirements?**
Deeds establish each link of ownership; mortgages or deeds of trust and their releases show liens created and cleared; assignments show who holds an open mortgage; plats, easements and restrictive covenants define what runs with the land; affidavits, powers of attorney and probate or divorce orders explain how a party had authority to sign. Requirements typically arise from mortgages with no release of record even when paid, deeds signed by an attorney-in-fact without a recorded power of attorney, deaths in the chain without probate or an affidavit of heirship, name variances between deeds that need an identity affidavit, judgments and tax liens against a party that must be paid or shown not to be the same person, and legal descriptions that do not match the plat. A good examiner also flags the absence of an expected instrument, such as a subdivision plat referenced by a deed but never recorded.

# LEVEL: Intermediate

## The title search: chain of title, indexes and search periods

A **title search** is the systematic retrieval of every recorded instrument that affects a parcel, organised into a **chain of title** and a list of open matters. It is the raw material for examination, and in production it is the step most often outsourced, most often measured, and most often the source of claims when done badly.

### The three questions a search answers

1. **Who owns it?** The current vested owner and how they acquired it.
2. **What is against it?** Open mortgages, liens, judgments, taxes, lawsuits.
3. **What runs with it?** Easements, covenants, restrictions, plats, mineral reservations.

### Search period

How far back you go is set by the underwriter's guidelines, state law and the type of order.

| Search type | Typical period | Used for |
|---|---|---|
| Full search | 40–60 years, or to a root of title under a Marketable Record Title Act (MRTA) | First policy on a parcel, commercial |
| Two-owner search | Back through the two most recent arm's-length conveyances | Residential purchase where a prior policy or reliable base exists |
| Current-owner search | The present owner's period plus open liens | Refinance, home-equity loan, foreclosure prep |
| Bring-down / update | From the last search date to now | Just before closing (the gap check) |
| Limited / lien search | Liens and judgments only, no chain | Non-insured products, property reports |

An **MRTA** (Florida's is 30 years; Ohio, Michigan and others have variants) lets a searcher stop at a "root of title" deed older than the statutory period because earlier interests are extinguished unless preserved by re-recording. Texas underwriters typically search to a 25-year sovereignty-based base or use a title plant's prior examined file, called a **starter** or **back title**; using a prior policy as a starter is the most common way to shorten a search.

### Running the chain

Start with the current owner and walk backwards in the grantee index, then forwards in the grantor index for each owner's period of ownership. Every deed out must match a deed in: same parties, same legal description.

```text
CHAIN OF TITLE     Lot 12, Block 3, Westview Subdivision, Laramie County, WY

Date        Inst No.       Type              Grantor                    Grantee                 Notes
1998-06-12  1998-009871    Plat              Westview Development Co    (public)                Plat Bk 9 Pg 44; 20' utility esmt rear
2007-03-01  2007-002114    Warranty Deed     Miller Family Trust        Westview Homes LLC      Lots 1-40 Block 3
2009-08-14  2009-011302    Warranty Deed     Westview Homes LLC         Smith, John A & Mary L  Lot 12 Blk 3; JTWROS
2009-08-14  2009-011303    Mortgage          Smith, John A & Mary L     Bank of Laramie         $180,000
2015-04-20  2015-005519    Release           Bank of Laramie            Smith, John A & Mary L  Releases 2009-011303
2015-04-20  2015-005520    Mortgage          Smith, John A & Mary L     Wells Fargo Bank NA     $210,000  OPEN
2021-01-05  2021-000233    Death Certificate Smith, Mary L              (rec. by John A Smith)  JTWROS survivor
2024-03-29  2024-004512    Warranty Deed     Smith, John A              Khan, Ali R             $425,000  CURRENT OWNER
```

Each line is a **link**. The 2015 Wells Fargo mortgage has no release, so it is an **open lien** and becomes a requirement. Mary Smith's death converts joint tenancy to sole ownership in John, proven by the recorded death certificate, so the 2024 deed from John alone is good.

### Name searches: liens and judgments

For each owner during their ownership period, and for the buyer and borrower on the incoming side, search the **general index** and court records for judgments, federal and state tax liens, child-support liens, bankruptcy and lis pendens. Names are searched with variations: "Smith, John A", "Smith, John", "Smith, J A", "Smith, Jon". A hit on a common name must be resolved by address, middle name or date of birth, or it becomes a requirement for an identity affidavit.

### Taxes and assessments

Pull the tax collector's record: current year paid or due, prior years delinquent, special assessments, and, in some states, municipal utility and code-enforcement liens that are not in the recorder's index at all. Texas and Florida searches routinely include a **municipal lien search** ordered separately.

### Sources

- County recorder websites and image portals (many free; some charge per image).
- **Title plants**: privately built, tract-indexed databases with images, updated daily from the recorder (DataTrace, TitlePoint, Property Insight, underwriter-owned plants, mandatory in Texas under TDI rules).
- Court e-filing portals for judgments, probate and divorce.
- Tax collector and assessor sites for taxes, parcel maps and legal descriptions.
- Prior policies, prior commitments and prior search packages as starters.

> **Tip:** The **gap** is the period between the date the records were last indexed and the moment your deed records. Counties index days or weeks behind; a mortgage recorded yesterday may not appear until next week. Every closing gets a bring-down search as close to recording as possible, and gap coverage in the commitment handles what still cannot be seen.

### Search deliverable

A production search package usually contains: a chain-of-title table, copies of every open instrument (deed into current owner, open mortgages, easements, restrictions, plat), the tax record, judgment and lien search results with resolution notes, and a **search notes** sheet listing anything odd: unreleased mortgages, breaks, name variances, missing plats.

### Try It Yourself

```text
Build the search plan for this order and list the index runs you would perform.

Order: Refinance, borrower KHAN, ALI R, property Lot 12 Blk 3 Westview Sub, Laramie County WY
Starter: owner's policy issued 2024-04-15 to Khan by Stewart (search can rely on it as base)

Plan:
1. Grantor index: KHAN, ALI R  from 2024-03-29 to today  -> any deeds, mortgages, easements he created
2. Grantee index: KHAN, ALI R  same period                -> any additional interests acquired
3. General index / judgments: KHAN, ALI R; KHAN, ALI; KHAN, A R  -> 10 years (state judgment-lien life)
4. Federal tax liens (recorder + Secretary of State), state tax liens, child support: same names
5. Tax collector: parcel 12-3-WESTVIEW, current and prior 3 years
6. Bring-down date noted; gap = days between last index date and today
Expected open items: 2024 purchase-money mortgage (will be paid off), possible HOA lien.
```

### Quiz

1. What is a "starter" in a title search?
- [ ] The first deed in the county
- [x] A prior policy or examined file used as a base so the search covers only the period since
- [ ] The tax record
> Starters shorten searches legitimately by relying on a prior insured examination.

2. What does a Marketable Record Title Act do?
- [x] Extinguishes most interests older than a root of title beyond the statutory period unless preserved
- [ ] Requires a 60-year search
- [ ] Guarantees title
> MRTAs let searchers stop at a root deed, for example 30 years in Florida.

3. The "gap" refers to:
- [ ] The space between lots
- [x] The period between the last indexed records and the recording of the insured deed
- [ ] Missing pages in a deed book
> Recorder indexing lags, so instruments may exist that the search cannot yet see.

4. Why are name variations searched in the judgment index?
- [ ] To find the owner's relatives
- [x] Because a lien docketed under "Smith, J A" still attaches to John A Smith's land
- [ ] To fill the report
> Judgment liens attach by name; a missed variant is a missed lien and a future claim.

### Exercises

1. **Find the break** — Chain: 2005 deed Lopez to Garcia; 2012 deed Garcia to Garcia & Nguyen; 2019 deed Nguyen to Patel. What is wrong and what requirement results?
<details><summary>Solution</summary>

```text
Garcia acquired a share in 2012 with Nguyen but never conveyed out; the 2019 deed from Nguyen
alone conveys only Nguyen's interest. Break in the chain. Requirement: a deed from Garcia (or
Garcia's estate/heirs) to Patel, or evidence Garcia's interest terminated (e.g., survivorship
on a JTWROS deed plus a death certificate).
```

</details>

2. **Choose the search type** — For each order, choose full, two-owner, current-owner or update: (a) HELOC on a home bought with an owner's policy in 2020; (b) first-ever policy on a farm being subdivided; (c) day-of-closing check; (d) purchase where the seller has a 2018 owner's policy.
<details><summary>Solution</summary>

```text
(a) Current-owner search from the 2020 policy date
(b) Full search (40-60 years or to the MRTA root), with a survey
(c) Bring-down / update from the commitment's effective date
(d) Two-owner or starter-based search using the seller's 2018 policy as base, per underwriter rules
```

</details>

### Interview Questions

**Q: How do you perform a title search from scratch on a residential lot?**
I identify the parcel precisely from the assessor's parcel number and the legal description on the last deed, then run the current owner backwards in the grantee index to find each vesting deed until I reach the search period or a valid starter, building a chain where every grantor was a prior grantee of the same legal description. For each owner's period I run them forwards in the grantor index to capture mortgages, easements, releases and any conveyances out, and I pull the plat and any recorded restrictions. I then search each owner and the incoming buyer and borrower in the judgment, lien and court indexes with name variations, pull the tax record and any municipal lien sources, and read every open instrument rather than relying on the index entry. The deliverable is the chain table, copies of open documents and a notes sheet flagging breaks, unreleased liens and name variances, with the effective date of the records stated so the gap is known.

**Q: When is it acceptable to rely on a prior policy as a starter, and what are the risks?**
Underwriters allow a starter when a prior policy or examined file from a reputable underwriter covers the same legal description and the search then covers everything from that policy's date forward, because the prior insurer already examined and insured the earlier chain and would bear the loss on it. The risks are that the starter's legal description is narrower or different from the current parcel, that the prior policy carried exceptions or was issued on a limited search, that it came from an insurer the current underwriter does not accept, or that matters like easements shown in the old Schedule B are simply copied forward without re-reading them. I would verify the legal description matches exactly, carry forward the old exceptions consciously, and still run full name searches for judgments and liens on the current owner, since those do not depend on the chain.

**Q: What is a title plant and why does Texas require one?**
A title plant is a privately maintained, geographically indexed database of every recorded instrument in a county, built by copying the recorder's daily filings, indexing them by legal description rather than by name, and storing images, so a searcher can pull everything affecting a lot in one query instead of walking name indexes. Texas requires title agents to own or lease a plant covering at least 25 years for each county they operate in, under TDI rules, because the state treats the plant as the guarantee that searches are complete and current. Plants are expensive to build and keep current, which is why they are shared through joint plant arrangements and why offshore data-processing teams get large indexing projects: converting scanned back-files into plant-quality indexed records with legal descriptions is exactly the work a 20-agent team does for months.

## Title examination and common defects

The **examiner** turns a search package into a legal opinion of who owns the land and what must be done before insuring. Examination is judgement, guided by the underwriter's manual and state law, and it is where the claims-prevention value of the industry is created.

### The examiner's process

```text
1. Confirm the land: legal description on the vesting deed = plat = order = survey (if any)
2. Establish vesting: who owns, in what capacity (individual, spouses, LLC, trust, estate), what tenancy
3. Verify each link: grantor of each deed was the grantee of the previous one; proper execution, acknowledgment, delivery
4. Identify encumbrances: open mortgages, liens, judgments, taxes, lis pendens
5. Identify matters running with the land: easements, covenants, restrictions, mineral reservations, plat notes
6. Check authority and capacity: entity documents, powers of attorney, probate, guardianship, divorce decrees
7. Decide: requirement (must be fixed) or exception (will be excluded) for each finding
8. Write the commitment
```

### Common defects and their cures

| Defect | What it looks like | Typical cure |
|---|---|---|
| Unreleased mortgage | Mortgage of record, no satisfaction | Payoff and release at closing; or a recorded release if already paid; lost-release affidavit or indemnity from the prior insurer |
| Judgment lien | Docketed judgment against an owner | Pay from proceeds; or affidavit that the debtor is a different person of the same name; or lapse (judgment liens expire, 10 years in many states) |
| Federal tax lien | IRS Form 668 recorded | Pay; or IRS certificate of discharge; expires after 10 years unless refiled |
| Break in the chain | Grantor never received title of record | Corrective or quitclaim deed from the missing party or heirs; quiet-title suit as last resort |
| Death of an owner | Recorded owner deceased | Probate order, personal representative's deed, affidavit of heirship (Texas), or survivorship proof under JTWROS or tenancy by the entirety |
| Name variance | "J. A. Smith" vs "John Smith" | Affidavit of identity ("one and the same person") |
| Marital interest | Deed by one spouse in a community-property or homestead state | Joinder of spouse, or evidence of non-marital status |
| Entity authority | Deed by "ABC LLC" signed by someone | Operating agreement, resolution, certificate of good standing |
| Legal description error | Lot 12 vs Lot 21, missing block | Corrective deed re-recorded, or scrivener's affidavit if state allows |
| Easement | Recorded utility or access easement | Shown as an exception (rarely cured); insured with endorsement if it does not interfere |
| Restrictive covenants | Subdivision CC&Rs | Exception; ALTA 9 endorsement insures against violations |
| Encroachment | Survey shows the garage over the line | Exception; boundary line agreement; or endorsement if minor |
| Mechanic's lien risk | Recent construction, no lien filed yet | Lien waivers, owner's affidavit, indemnity, or exception |
| Foreclosure in chain | Trustee's or sheriff's deed | Verify notice, sale and redemption period compliance; underwriter approval |
| Bankruptcy | Owner filed while owning | Trustee's abandonment or court order authorising sale |

### Requirement or exception?

A **requirement** is something that must happen before the policy issues without that matter: "Record release of mortgage 2015-005520." An **exception** is something the policy will not cover: "Easement to Cheyenne Light, Fuel & Power recorded in Book 812, Page 55." The examiner chooses based on whether the matter can be cleared, whether the buyer and lender can live with it, and what the underwriter's manual allows.

```text
Finding: 2015 Wells Fargo mortgage $210,000, open              -> REQUIREMENT: payoff and release
Finding: 20' rear utility easement on the plat                 -> EXCEPTION: shown in Schedule B-II
Finding: Judgment vs "John Smith" $8,400, Cheyenne, 2020        -> REQUIREMENT: affidavit of identity or payoff
Finding: 2024 taxes not yet due                                 -> EXCEPTION (standard): taxes for 2024 and subsequent years
Finding: Death of Mary L Smith, JTWROS                          -> REQUIREMENT satisfied by recorded death certificate; note in file
```

### Vesting and tenancy

How co-owners hold matters for who must sign and what happens on death:

- **Joint tenants with right of survivorship (JTWROS)**: survivor takes automatically; a death certificate cures.
- **Tenants in common**: each share passes by will or intestacy; probate is needed for a deceased co-owner's share.
- **Tenancy by the entirety**: spouses only, in about half the states; creditors of one spouse alone generally cannot reach it.
- **Community property** (TX, CA, AZ, NV, WA and others): both spouses must join in a conveyance of community real estate even if titled in one name.
- **Homestead**: Texas and Florida require both spouses to sign a conveyance or mortgage of the homestead regardless of title.

### Reading a deed

Execution defects are silent in an index and only found by reading the image: missing or defective **acknowledgment** (notary block), a notary whose commission had expired, a deed signed by a power of attorney not recorded, a deed to a grantee who was dead, a corporate deed without a title under the signature, or a deed with no legal description at all. Texas and Florida additionally require two witnesses on some instruments (Florida deeds).

> **Interview note:** Interviewers ask "what is the most common title defect?" The honest answer is an unreleased mortgage that was actually paid years ago, followed by name-match judgments against common names. Both are cheap to cure and both become expensive claims when missed, which is why production QC focuses on lien release matching.

### Try It Yourself

```text
Examine these findings and write the decision column.

1. Deed of Trust 2019-004432, $250,000, to Quicken Loans; assignment to Rocket Mortgage 2021; no release.
2. Plat note: "10 ft drainage easement along west lot line."
3. Judgment: CHEYENNE MEDICAL CTR v. ALI RAZA, $2,150, 2022, Laramie County District Court. Borrower is ALI R RAZA.
4. Deed 2016 from "Westview Homes LLC" signed "Tom Reed" with no title; LLC dissolved 2017 per Secretary of State.
5. Special assessment: Sewer Improvement District #4, $3,600 balance, payable over 10 years.

Decisions:
1. REQUIREMENT - payoff and release from Rocket Mortgage (current holder per assignment).
2. EXCEPTION - drainage easement per plat, Schedule B-II.
3. REQUIREMENT - pay from proceeds or affidavit that borrower is not the judgment debtor; likely the same person, so payoff.
4. REQUIREMENT - evidence of Reed's authority (operating agreement/resolution) or ratification; escalate to underwriter (dissolved entity).
5. EXCEPTION - assessment shown; lender may require payoff of the balance; note on settlement statement.
```

### Quiz

1. A deed in the chain was signed under a power of attorney that was never recorded. This is a:
- [x] Requirement (record the POA or obtain a confirmatory deed)
- [ ] Standard exception
- [ ] Exclusion
> Authority defects must be cured, not excepted, because they make the link unreliable.

2. Which co-ownership form passes the deceased owner's share automatically without probate?
- [ ] Tenants in common
- [x] Joint tenants with right of survivorship
- [ ] Sole ownership
> Survivorship is the defining feature of JTWROS and of tenancy by the entirety.

3. A recorded utility easement across the rear 20 feet of the lot is normally handled as:
- [ ] A requirement to remove the easement
- [x] An exception in Schedule B-II
- [ ] Grounds to decline to insure
> Easements run with the land; the policy simply does not insure against them.

4. Why must both spouses sign a mortgage of a Texas homestead?
- [ ] Texas requires two signatures on all documents
- [x] Homestead protection requires joinder of both spouses regardless of whose name is on title
- [ ] The lender's policy requires it
> Texas and Florida homestead law makes a one-spouse conveyance or lien of the homestead void.

### Exercises

1. **Write the requirements** — Search shows: owner "R. Patel" (deed in as "Rajesh Patel"); open 2018 mortgage to Chase; a 2020 federal tax lien against "Rajesh Patel" $14,000; a lis pendens for a boundary suit filed 2023. Draft Schedule B-I requirements.
<details><summary>Solution</summary>

```text
1. Affidavit of identity establishing that R. Patel and Rajesh Patel are one and the same person.
2. Payoff and recorded release of Mortgage to JPMorgan Chase Bank NA recorded 2018-______.
3. Payment and recorded release, or IRS certificate of discharge, of Federal Tax Lien recorded 2020-______ in the amount of $14,000.
4. Dismissal of the action described in Lis Pendens recorded 2023-______ or final judgment resolving the boundary; underwriter approval required. Company reserves the right to add requirements/exceptions.
```

</details>

2. **Tenancy scenario** — Deed vests "Ana Cruz and Luis Cruz, as tenants in common." Luis died in 2022. Ana wants to sell. What is required?
<details><summary>Solution</summary>

```text
Luis's one-half passes by will or intestacy, not to Ana automatically. Requirement: probate of
Luis Cruz's estate with a personal representative's deed of his half, or a recorded affidavit of
heirship where the state permits (Texas) plus deeds from all heirs, and confirmation no estate
creditors' claims or estate taxes attach. Ana can convey only her half until then.
```

</details>

### Interview Questions

**Q: What is the difference between a requirement and an exception, and how do you decide?**
A requirement is a condition that must be satisfied before the policy issues, such as a payoff and release, a corrective deed, or probate documents, and it clears the matter so the policy insures over it; an exception is a matter the policy will insure subject to, such as recorded easements, covenants, taxes not yet due, or an encroachment the parties accept. I decide by asking whether the matter can be cleared at reasonable cost before closing, whether the buyer and lender would accept coverage that excludes it, and what the underwriter's manual permits; liens and authority defects are almost always requirements, while rights that run with the land are exceptions. The practical skill is writing them so a closer can act on them, with instrument numbers, amounts and the party who must sign, and flagging which exceptions can later be removed by endorsement or survey.

**Q: Describe a title defect that a search would find and one it would not, and how the policy treats each.**
A search would find an unreleased 2015 mortgage, because it is recorded and indexed under the owner's name; the examiner lists it as a requirement, the closer obtains a payoff and release, and the policy issues clear of it, so no claim ever arises. A search would not find that the 2009 deed into the seller was forged by a relative using a fake ID and a complicit notary, because the recorded instrument looks regular on its face; the owner's policy covers this as a defect existing before the policy date, and the underwriter defends the insured or pays the loss. The distinction explains the industry's structure: examination eliminates the first category, which is most of the volume, and the premium's risk component pays for the second, which is most of the severity.

**Q: How would you QC an offshore examination-support team's output?**
I would define a defect taxonomy tied to consequences: critical defects such as a missed open mortgage, a missed judgment against the right person, or a wrong legal description; major defects such as an easement omitted from exceptions or a mis-typed instrument number; and minor formatting issues. Sample by risk rather than uniformly, for example 100% review of the first thirty files per agent and of every file with an estate, entity or foreclosure in the chain, and a 10–15% random sample otherwise, with results tracked per agent and per defect type. Feedback loops matter more than the score: weekly calibration sessions on real files, an SOP updated with each new pattern, and re-training triggered by two critical defects in a month. The metric reported to the client should be critical-defect rate per hundred files with the trend, because that is what predicts claims.

## Commitments, Schedule A and B, requirements and exceptions

The **title commitment** (called a **preliminary report** in California and some western states, and a **title binder** in older usage) is the document the examiner produces and everyone at the table reads. It is the underwriter's offer: "we will issue the policies described in Schedule A if the requirements in Schedule B Part I are met, subject to the exceptions in Schedule B Part II." Learning to read it is the fastest way to understand a file.

### The ALTA Commitment (2021 form) structure

```text
COMMITMENT FOR TITLE INSURANCE  issued by STEWART TITLE GUARANTY COMPANY
Commitment No. WY-24-0187          Commitment Date (effective date): March 20, 2024 at 8:00 a.m.

SCHEDULE A
1. Commitment Date: March 20, 2024 at 8:00 a.m.
2. Policy to be issued:
   (a) ALTA Owner's Policy (07/01/2021)        Proposed Insured: Ali R. Khan          Amount: $425,000.00
   (b) ALTA Loan Policy (07/01/2021)           Proposed Insured: Wells Fargo Bank, N.A., ISAOA/ATIMA   Amount: $340,000.00
3. The estate or interest in the Land at the Commitment Date is: Fee Simple
4. Title to the estate or interest is at the Commitment Date vested in: John A. Smith
5. The Land is described as follows: Lot 12, Block 3, Westview Subdivision, according to the plat recorded in Plat Book 9, Page 44, Laramie County, Wyoming.

SCHEDULE B, PART I - Requirements
1. Pay the agreed amount for the estate or interest to be insured.
2. Pay the premiums, fees, and charges for the Policy.
3. Documents satisfactory to the Company that convey the Title or create the Mortgage to be insured must be signed, delivered, and recorded:
   (a) Warranty Deed from John A. Smith, a single person, to Ali R. Khan.
   (b) Mortgage from Ali R. Khan to Wells Fargo Bank, N.A. in the amount of $340,000.00.
4. Release of Mortgage from John A. Smith and Mary L. Smith to Wells Fargo Bank, N.A. recorded April 20, 2015 as Instrument No. 2015-005520, in the original amount of $210,000.00.
5. Affidavit of identity from John A. Smith regarding Judgment No. CV-2020-1187, or satisfaction of same.
6. Payment of 2023 taxes, Parcel 12-3-WV, in the amount of $2,914.10, now due.

SCHEDULE B, PART II - Exceptions
1. Any defect, lien, encumbrance, adverse claim, or other matter that appears for the first time in the Public Records or is created, attaches, or is disclosed between the Commitment Date and the date on which all of the Schedule B, Part I - Requirements are met.  (the "gap" exception)
2. Rights or claims of parties in possession not shown by the Public Records.   (standard)
3. Easements, or claims of easements, not shown by the Public Records.          (standard)
4. Encroachments, overlaps, boundary line disputes, or other matters which would be disclosed by an accurate survey.   (standard)
5. Any lien for services, labor, or material not shown by the Public Records.  (standard)
6. Taxes and assessments for the year 2024 and subsequent years, not yet due and payable.
7. Easement for utilities over the rear 20 feet of the Land as shown on the plat recorded in Plat Book 9, Page 44.
8. Covenants, conditions and restrictions recorded in Book 812, Page 101, but omitting any covenant based on race, color, religion, sex, handicap, familial status or national origin.
9. Mineral reservation in deed recorded in Book 201, Page 77.
```

### Reading it in order

**Schedule A** answers: as of when, what policies, for whom, how much, what estate, who owns now, what land. Item 4 must be the seller; if it names someone else there is a chain problem. Item 5 is the legal description, which must match the deed, plat and survey exactly. **ISAOA/ATIMA** ("its successors and/or assigns as their interests may appear") lets the loan policy follow the loan when it is sold.

**Schedule B-I** is the closer's to-do list. Items 1–3 are boilerplate on every commitment; the numbered items after them are the file-specific curative work. Each one should name the instrument, the party who must act and the amount.

**Schedule B-II** is what the policy will not cover. Items 2–5 are the **standard exceptions** removed for extended coverage on receipt of a survey and affidavits; the specific exceptions (7–9 here) are matters the examiner found and the buyer takes subject to. The **gap exception** (item 1) is deleted at closing when the underwriter provides gap coverage after the bring-down.

### From commitment to policy

At closing the requirements are satisfied, the standard exceptions are deleted or retained per the coverage purchased, and the policy's Schedule B repeats the surviving specific exceptions plus, on a loan policy, nothing senior to the insured mortgage. A commitment is valid for six months (180 days) and must be updated after that.

### Marked-up commitment and pro forma

Lenders on commercial deals ask for a **marked-up commitment** at closing: the closer strikes each satisfied requirement and each deleted exception and initials it, which functions as the policy until the final is typed. A **pro forma policy** is a specimen of what the final policy will say, used the same way.

> **Warning:** The commitment's effective date is the date the records were last checked, not the date it was typed. If the commitment date is three weeks old at closing, the bring-down search is not optional; a judgment or mortgage recorded in the gap is the classic source of a priority claim.

### Common typing errors in production

Because commitments are typed from examination notes, production QC concentrates on: the proposed insured's name spelled exactly as on the contract and loan approval; amounts matching the order; the legal description character-for-character from the plat or vesting deed; instrument numbers and book/page in requirements; and no standard exception omitted or duplicated. Templates in the title production system (ResWare, SoftPro, Qualia, RamQuest) generate items 1–5 of B-II automatically; the file-specific items are keyed.

### Try It Yourself

```text
Correct this Schedule A against the order data, listing each discrepancy.

Order: Buyer ALI RAZA KHAN; Lender WELLS FARGO BANK NA; Price 425,000; Loan 340,000;
       Seller JOHN A SMITH; Legal: Lot 12, Block 3, Westview Subdivision, Plat Book 9, Page 44

Typed Schedule A:
2(a) Owner's Policy  Proposed Insured: Ali R. Kahn      Amount: $425,000.00
2(b) Loan Policy     Proposed Insured: Wells Fargo Bank  Amount: $304,000.00
4.   Vested in: John A. Smith and Mary L. Smith
5.   Lot 12, Block 2, Westview Subdivision, Plat Book 9, Page 44

Discrepancies: (1) "Kahn" vs KHAN; use the full name Ali Raza Khan as on the contract.
(2) Lender name incomplete: "Wells Fargo Bank, N.A., ISAOA/ATIMA".  (3) Loan amount transposed: 340,000.
(4) Vesting should be John A. Smith alone (Mary L. Smith deceased, JTWROS) with the death noted in requirements/notes.
(5) Block 2 should be Block 3.  Every one of these is a critical defect in QC terms.
```

### Quiz

1. Where in the commitment is the list of things the closer must obtain before closing?
- [ ] Schedule A
- [x] Schedule B Part I
- [ ] Schedule B Part II
> Part I is requirements; Part II is exceptions.

2. What does "ISAOA/ATIMA" on the loan policy's proposed insured mean?
- [ ] The lender's licence number
- [x] The policy covers the lender's successors and assigns as their interests may appear
- [ ] The loan is insured by the government
> Loans are sold; the phrase keeps the policy with whoever holds the note.

3. The commitment date is:
- [x] The effective date of the records searched
- [ ] The closing date
- [ ] The date the policy will issue
> Anything recorded after the commitment date is in the gap until the bring-down.

4. Which of these is a standard exception removable for extended coverage?
- [ ] The recorded utility easement on the plat
- [x] Matters an accurate survey would disclose
- [ ] The mineral reservation in a 1950 deed
> Standard exceptions are generic; specific exceptions are found matters that stay unless cured.

### Exercises

1. **Draft the requirement** — The search shows a deed of trust to Bank of Laramie, Instrument 2019-007712, $198,500, assigned to Freedom Mortgage by Instrument 2022-001203. Write the Schedule B-I item.
<details><summary>Solution</summary>

```text
Payoff and recorded release or reconveyance of the Deed of Trust from [current owner] to
Bank of Laramie, recorded [date] as Instrument No. 2019-007712, in the original amount of
$198,500.00, as assigned to Freedom Mortgage Corporation by Assignment recorded as
Instrument No. 2022-001203. Payoff statement to be obtained from Freedom Mortgage Corporation.
```

</details>

2. **Policy Schedule B** — Given the sample commitment above, list what remains as exceptions on an extended-coverage loan policy after closing with a survey showing no encroachments.
<details><summary>Solution</summary>

```text
Deleted: gap exception (bring-down done), standard exceptions 2-5 (survey + affidavits).
Remaining: 6 (2024 taxes not yet due), 7 (plat utility easement), 8 (CC&Rs), 9 (mineral reservation).
Requirements 4-6 satisfied at closing and not carried into the policy.
```

</details>

### Interview Questions

**Q: Explain the three parts of a title commitment and who uses each.**
Schedule A states the effective date, the policies to be issued with insureds and amounts, the estate (usually fee simple), the current vested owner and the legal description; the lender's closer and the buyer's attorney check it against the contract and loan approval. Schedule B Part I lists the requirements, the actions and documents needed before the policy can issue, from the deed and mortgage themselves to payoffs, releases, affidavits and probate documents; this is the closer's and curative team's work list. Schedule B Part II lists the exceptions, matters the policy will not insure against, split into standard exceptions that can be removed with a survey and affidavits and specific exceptions found in the search that the buyer takes subject to; the buyer's lawyer and the lender review these to decide whether the property is acceptable. Reading them in that order, A then B-I then B-II, tells you what is being insured, what must happen, and what is left out.

**Q: What is the gap and how does the commitment deal with it?**
The gap is the period between the commitment's effective date, when the records were last examined, and the moment the insured deed and mortgage are recorded, during which new instruments, a judgment, a mechanic's lien or another mortgage, can attach without appearing in the search. The 2021 commitment form addresses it with exception 1 in Schedule B Part II, which excludes matters arising between the commitment date and the satisfaction of the requirements, and underwriters typically remove that exception at closing in exchange for a bring-down search run as close to recording as the county's indexing allows plus a seller's and borrower's affidavit. States with long indexing lags rely more on gap affidavits and indemnities; e-recording with same-day indexing shrinks the gap to hours. When I audit a file, the bring-down date relative to the recording date is one of the first things I check.

**Q: A lender asks for a marked-up commitment at closing. What is it and why do they want it?**
It is the commitment with each satisfied requirement struck through and each deleted exception crossed out, initialled by the closing agent on behalf of the underwriter, sometimes with the policy's endorsements listed, so that it reads as the final policy will. Lenders on commercial and large residential loans want it because the final policy may take weeks to type after recording, and they need written evidence at funding that the requirements were met and that their mortgage will be insured with the agreed exceptions and endorsements. It binds the underwriter as a policy would, so the closer must be certain every strike-through is backed by a document in hand. A pro forma policy serves the same purpose in a cleaner format on larger deals.

## Closing, settlement statements and escrow

**Closing** is where the title company earns its settlement fee: documents are signed, money moves, and the deal becomes real. For a data analyst the closing generates the numbers on the settlement statement and the wire records, which feed revenue reports and, unfortunately, most fraud investigations.

### Escrow

**Escrow** is the arrangement in which a neutral third party (the escrow officer, closer, settlement agent or closing attorney) holds funds and documents and releases them only when all conditions in the parties' instructions and the lender's closing instructions are met. The **escrow account** (trust account) is a separate bank account that must never be commingled with operating funds and must be **three-way reconciled** monthly: bank balance = book balance = sum of individual file balances. Underwriters audit it, and unreconciled escrow is the fastest way to lose an agency appointment.

### The documents at the table

```text
Seller signs:   Deed, seller's affidavit (possession, liens, marital status), 1099-S, payoff authorisation, transfer tax forms
Buyer signs:    Promissory note, mortgage/deed of trust, Closing Disclosure, owner's affidavit, occupancy affidavit, tax and insurance escrow setup
Both sign:      Settlement statement, proration agreements, corrections agreement
Title company:  Commitment mark-up, receipts, wire confirmations, recording package
```

### The settlement statement

The **Closing Disclosure (CD)** is the federally mandated five-page form under TRID (since October 2015) that the lender must ensure the borrower receives at least **three business days** before consummation on most residential mortgage loans; it replaced the HUD-1 for those loans (HUD-1 survives for reverse mortgages and some others). The **ALTA Settlement Statement** is the industry form that itemises everything for buyer, seller and cash deals, and it is usually what the title company prepares alongside the lender's CD.

```text
ALTA SETTLEMENT STATEMENT (combined)                 File WY-24-0187      Closing 2024-03-28
                                                  Seller Debit  Seller Credit  Buyer Debit  Buyer Credit
Sales price                                          425,000.00                 425,000.00
Deposit / earnest money                                                                       10,000.00
New loan (Wells Fargo)                                                                       340,000.00
Payoff: Wells Fargo mortgage 2015-005520            206,412.55
County taxes 2023 (due)                                2,914.10
Tax proration 2024 (Jan 1 - Mar 28, 87 days)           692.60                        692.60
Owner's title policy ($425,000)                                                   1,912.50
Loan title policy (simultaneous)                                                    125.00
Settlement fee                                          400.00                       400.00
Recording: deed $30, mortgage $95                                                   125.00
Lender endorsements (ALTA 8.1, 9)                                                   150.00
Real estate commission 5%                            21,250.00
Transfer tax                                             850.00
Subtotals                                            232,519.25   425,000.00   427,712.50   350,692.60
Cash to seller / cash from buyer                     192,480.75                   77,019.90
```

Every line is either a **charge** or a **credit**, and the statement must balance: total receipts equal total disbursements, per party and for the file as a whole. **Prorations** split annual items such as taxes and HOA dues between seller and buyer at the closing date. Who pays which title charge is set by the contract and local custom: in much of Florida and Texas the seller pays the owner's premium; in Wyoming and Tennessee the buyer usually does, or it is negotiated.

### Disbursement and recording

After signing, the closer verifies the lender's funds arrived by wire, the buyer's funds are in **good funds** (wire or cashier's check per state good-funds law), and the lender authorises funding. Then: record the deed and mortgage (e-recording returns a recording number in minutes in many counties), pay off the seller's mortgage by wire against the written payoff statement, pay commissions, taxes and fees, and wire the seller's proceeds. The file's disbursement ledger must match the settlement statement to the cent.

### Wire safety

Title companies move hundreds of thousands of dollars per file, which makes closings a target. Standard controls:

- Verify **every** wire instruction by calling a known phone number, never one in the email.
- Seller proceeds go only to an account verified by voice with the seller.
- Payoffs go only to the address or account on the servicer's written payoff statement, verified.
- Never change instructions on the day of closing on the strength of an email.
- Positive pay and dual authorisation on the escrow account.

> **Warning:** Business email compromise against title companies is the industry's largest single fraud loss. A fraudulent "updated wire instructions" email arriving the morning of closing is the pattern; the control is a call-back to a verified number every time, with no exceptions for urgency.

### After closing

Recorded originals come back from the county (or images from e-recording), the final policies are typed with the recording data, escrow is reconciled, the file is audited (statement balanced, all requirements documented, wires verified), and a 1099-S goes to the IRS for the seller. Files that miss any of these show up on post-closing exception reports.

### Try It Yourself

```excel
' Tax proration: annual tax in B2, closing date in C2, tax year = calendar year, seller pays through the day before closing
=ROUND(B2*(C2-DATE(YEAR(C2),1,1))/(DATE(YEAR(C2),12,31)-DATE(YEAR(C2),1,1)+1),2)
' Balance check for a settlement statement: buyer debits in D:D, buyer credits in E:E
=IF(ROUND(SUM(D:D)-SUM(E:E),2)=0,"BALANCED","CASH DUE FROM BUYER "&TEXT(SUM(D:D)-SUM(E:E),"#,##0.00"))
```

### Quiz

1. How many business days before consummation must the borrower receive the Closing Disclosure?
- [ ] One
- [x] Three
- [ ] Seven
> TRID's three-business-day rule applies to most residential mortgage loans since 2015.

2. What is a three-way reconciliation of an escrow account?
- [ ] Buyer, seller and lender sign off
- [x] Bank balance equals book balance equals the sum of individual file balances
- [ ] Three people count the cash
> Underwriters require monthly three-way reconciliations to detect shortages and misapplied funds.

3. A tax proration at closing does what?
- [x] Splits the year's tax between seller and buyer based on the closing date
- [ ] Pays next year's tax in advance
- [ ] Waives the tax lien
> The seller is charged for their days of ownership and the buyer credited, or the reverse if taxes were prepaid.

4. The safest response to an emailed change of wire instructions on closing day is:
- [ ] Comply if the email is from the seller's address
- [x] Call a previously verified phone number to confirm before sending anything
- [ ] Send a smaller test wire first
> Call-back verification to a known number is the control that defeats business email compromise.

### Exercises

1. **Balance the statement** — Buyer: price 300,000; loan 240,000; earnest money 5,000; owner's policy 1,600; loan policy 100; settlement fee 350; recording 110; tax credit from seller 1,250. Compute cash from buyer.
<details><summary>Solution</summary>

```text
Debits:  300,000 + 1,600 + 100 + 350 + 110 = 302,160
Credits: 240,000 + 5,000 + 1,250 = 246,250
Cash from buyer = 302,160 - 246,250 = 55,910.00
```

</details>

2. **Proration** — Annual taxes $4,380 for calendar 2024, unpaid, closing 15 May 2024. Who pays what at closing?
<details><summary>Solution</summary>

```text
Seller's days: 1 Jan - 14 May = 135 days.  4,380 x 135 / 366 (leap year) = 1,615.57
Seller is debited 1,615.57 and buyer credited 1,615.57; buyer pays the full bill when due.
(Some contracts use a 365-day or 360-day convention; state the convention on the statement.)
```

</details>

### Interview Questions

**Q: Describe the role of escrow in a closing and the controls that protect it.**
The escrow officer or settlement agent is a neutral stakeholder who receives the buyer's and lender's funds and all signed documents, holds them until every condition in the contract and the lender's closing instructions is met, and then records and disburses in the agreed order, so no party has to trust the other to perform first. The controls are structural: a dedicated trust account per state rules, no commingling, monthly three-way reconciliation reviewed by someone who does not post transactions, dual authorisation and positive pay on outgoing wires, written payoff statements and call-back verification of every wire instruction, disbursement only against a balanced settlement statement, and underwriter audits. In production reporting the escrow ledger is the source of truth for revenue and fees, so I reconcile reported premiums to the ledger, not to the commitment.

**Q: What is the difference between the Closing Disclosure and the ALTA Settlement Statement?**
The Closing Disclosure is the CFPB's mandatory form under TRID for most closed-end residential mortgage loans; the lender is responsible for it, it must reach the borrower three business days before consummation, it follows a fixed layout with loan terms, projected payments and itemised costs, and it must reconcile to the Loan Estimate within tolerance rules. The ALTA Settlement Statement is an industry form the title company prepares to show the full accounting for the file, including seller-side figures the CD does not show the borrower, cash transactions with no lender, and items the CD groups differently, such as the owner's policy shown at the simultaneous rate. Both must agree on the borrower's figures; when they do not, the CD governs for the lender and a corrected CD may be needed after closing.

**Q: A seller's proceeds were wired to a fraudster's account. Walk me through what should have prevented it and what happens next.**
Prevention rests on the call-back: proceeds go only to an account the seller confirmed by voice on a number obtained at the start of the file, never from an email, with any change treated as a red flag and re-verified in person if possible, and with staff trained that urgency is the attacker's tool. Technically, multi-factor authentication on email, alerts on mailbox forwarding rules and dual authorisation on wires reduce the chance the fraud starts or completes. Once it happens, the first hours matter: call the sending bank to request a recall and the receiving bank to freeze, file an IC3 complaint with the FBI, notify the underwriter and the E&O and cyber insurers, and preserve the emails for forensics; recovery is possible when the freeze lands within a day or two and unlikely after that. The operational lesson is to measure it: count wire changes per month and how each was verified, because what is measured gets done.

## Endorsements: the ALTA endorsement catalogue

An **endorsement** modifies a policy: it adds coverage, deletes an exception, or clarifies what is insured. Lenders specify the ones they require in their closing instructions; buyers rarely ask but should. ALTA numbers them, states file which ones are available and at what price, and production teams type and charge for them, which is why endorsement codes appear as columns in every premium report and rate matrix.

### How endorsements are priced

Three patterns appear across states: **flat fee** (for example $25 or $50 per endorsement in many filed-rate states), **percentage of the premium** (10% of the basic rate for an ALTA 9 in some states), or **no charge** when included by rule (Texas promulgates prices per endorsement; some are free with the policy). A calculator therefore needs an endorsement table per state per underwriter.

### The ones you will see on residential loan policies

| ALTA number | Name | What it insures | Typical requirement |
|---|---|---|---|
| **4 / 4.1** | Condominium | The unit is a lawful condominium unit; assessments not delinquent | Condo property |
| **5 / 5.1** | Planned Unit Development | HOA assessments, restrictions, rights of first refusal | Property in a PUD with an HOA |
| **6 / 6.2** | Variable Rate Mortgage | Priority not lost by interest-rate changes or negative amortisation | ARM loans |
| **7 / 7.1** | Manufactured Housing Unit | The manufactured home is part of the land | Manufactured homes |
| **8.1** | Environmental Protection Lien | No recorded environmental liens with priority over the mortgage | Almost every residential loan |
| **9 / 9.10** | Restrictions, Encroachments, Minerals (CC&R) | No violations of covenants that would cause loss, no enforced encroachments, no mineral-extraction damage | Nearly every lender; owner's versions 9.1/9.2 |
| **22** | Location | The land's street address and the improvements are as described | Lenders wanting address certainty |
| **3 / 3.1** | Zoning | The zoning classification and permitted uses | Commercial mostly |
| **14 series** | Future Advance | Priority for advances after the policy date | HELOCs, construction loans |
| **17 / 17.1** | Access and Entry | The land has actual vehicular and pedestrian access to a public street | Rural, flag lots |
| **18 / 18.1** | Single Tax Parcel | The land is one tax parcel (or several) with no other land | Commercial; some residential |
| **19** | Contiguity | Multiple parcels are contiguous with no gaps | Assemblages |
| **25** | Same as Survey | The land is the same as shown on a specified survey | When a survey is furnished |
| **28** | Easement Damage or Enforced Removal | Loss if an easement holder's use damages improvements | Improvements over an easement |
| **35** | Minerals and Other Subsurface Substances | Damage from mineral extraction | Mineral-rich states such as Texas and Wyoming |
| **39** | Policy Authentication | The policy is valid even if electronically issued or unsigned | Electronic policies |

A typical residential loan policy in a filed-rate state carries 8.1, 9 and, for condos or PUDs, 4 or 5, and 6 for adjustable loans. Owner's policies more often get the Homeowner's form instead of endorsements.

### Endorsements as data

```text
File        Policy   Endorsements            Charges
WY-24-0187  LOAN     8.1; 9; 22              25.00 + 75.00 + 25.00 = 125.00   (WY filed flat fees, illustrative)
TN-24-0912  LOAN     8.1; 9; 5               0 + 10% of basic + 25.00          (TN: 9 at 10% of loan rate)
TX-24-0333  LOAN     T-19 (=ALTA 9); T-36 (=8.1); T-17 (=5)   promulgated by TDI: T-19 at 5% (or 10% w/out survey) of basic, T-36 $25, T-17 $25
```

Texas uses its own **T-form** numbering (T-1 owner's, T-2 loan, T-7 commitment, T-19 restrictions/encroachments/minerals, T-36 environmental protection lien, T-17 PUD, T-3 general endorsement) promulgated by the Texas Department of Insurance with promulgated prices, which is why a multi-state rate matrix needs a cross-reference from ALTA numbers to state forms. California uses **CLTA** numbers alongside ALTA (CLTA 100 is the old equivalent of ALTA 9; CLTA 116 of ALTA 22).

### When an endorsement can be issued

Each endorsement has conditions. ALTA 9 on a loan policy needs no survey in most states but the underwriter expects the examiner to have read the covenants for enforceable rights of reverter or first refusal; ALTA 25 needs the actual survey; ALTA 17 needs a recorded easement or frontage to a public road; ALTA 3.1 needs a zoning report or letter. Issuing an endorsement without meeting its conditions is an underwriting violation that agents get audited for.

### Deleting standard exceptions versus endorsing

Extended coverage (deleting the survey exception on receipt of a survey) and endorsements overlap. The survey exception deletion plus an ALTA 25 is the belt-and-braces approach on commercial loans; on a residential loan most lenders accept the ALTA 9 without a survey in lieu of both.

> **Interview note:** Be ready to explain 8.1 and 9 without notes. 8.1 says no environmental lien recorded ahead of the mortgage (federal CERCLA and state superliens can prime a mortgage). 9 says the covenants and easements in Schedule B will not be enforced in a way that costs the lender the lien, and existing improvements do not encroach onto easements or adjoining land in a way that will be removed. Those two are on nearly every US residential loan policy.

### Try It Yourself

```javascript
// Endorsement pricing by state rule: flat fee, percent of basic premium, or promulgated table
const rules = {
  WY: { "8.1": { flat: 25 }, "9": { flat: 75 }, "22": { flat: 25 }, "5": { flat: 25 } },
  TN: { "8.1": { flat: 0 }, "9": { pct: 0.10 }, "5": { flat: 25 }, "22": { flat: 25 } },
  TX: { "T-36": { flat: 25 }, "T-19": { pct: 0.05, pctNoSurvey: 0.10 }, "T-17": { flat: 25 } },
};
function endorsementCharge(state, code, basicPremium, opts = {}) {
  const r = rules[state]?.[code];
  if (!r) throw new Error(`No rule for ${code} in ${state}`);
  if (r.flat !== undefined) return r.flat;
  const pct = opts.noSurvey && r.pctNoSurvey ? r.pctNoSurvey : r.pct;
  return Math.round(basicPremium * pct * 100) / 100;
}
console.log(endorsementCharge("TN", "9", 1517.50));                 // 151.75
console.log(endorsementCharge("TX", "T-19", 1359, { noSurvey: true })); // 135.9
console.log(["8.1", "9", "22"].reduce((s, c) => s + endorsementCharge("WY", c, 0), 0)); // 125
```

### Quiz

1. Which endorsement protects a lender against recorded environmental liens with priority over the mortgage?
- [ ] ALTA 9
- [x] ALTA 8.1
- [ ] ALTA 22
> 8.1 is the Environmental Protection Lien endorsement, on almost every residential loan policy.

2. Texas form T-19 corresponds to which ALTA endorsement?
- [ ] ALTA 4
- [x] ALTA 9 (restrictions, encroachments, minerals)
- [ ] ALTA 22
> Texas promulgates its own forms and prices; T-19 is the CC&R/encroachment endorsement.

3. Which endorsement would a lender want on a rural lot with no frontage on a public road?
- [x] ALTA 17 (Access and Entry)
- [ ] ALTA 6 (Variable Rate)
- [ ] ALTA 39 (Policy Authentication)
> ALTA 17 insures actual access, which is the key risk on landlocked or easement-access parcels.

4. How are endorsements usually priced in a filed-rate state?
- [ ] Always free
- [x] A flat fee or a percentage of the basic premium, as filed by each underwriter
- [ ] By negotiation at closing
> Pricing rules are filed per underwriter, which is why a matrix needs a per-state endorsement table.

### Exercises

1. **Pick the set** — A lender is making an ARM loan on a condominium unit in a Tennessee PUD-style development with an HOA. Which endorsements would you expect on the loan policy?
<details><summary>Solution</summary>

```text
ALTA 4 (condominium) rather than 5 since it is a condo unit; ALTA 6 (variable rate) for the ARM;
ALTA 8.1 (environmental lien); ALTA 9 (restrictions/encroachments/minerals). Optionally ALTA 22.
If the HOA is a master association over a PUD, some lenders ask for both 4 and 5; follow the closing instructions.
```

</details>

2. **Cross-reference** — Build the mapping rows a multi-state matrix needs for the environmental lien and CC&R endorsements in WY, TN, TX and CA.
<details><summary>Solution</summary>

```text
Concept                      WY        TN        TX      CA (CLTA/ALTA)
Environmental protection lien ALTA 8.1  ALTA 8.1  T-36    ALTA 8.1 (CLTA 110.9)
Restrictions/encroach/minerals ALTA 9   ALTA 9    T-19    ALTA 9 (formerly CLTA 100)
Store: concept_id, state, form_code, pricing_rule, requires_survey, underwriter (if pricing differs).
```

</details>

### Interview Questions

**Q: What are the ALTA 8.1 and ALTA 9 endorsements and why are they on almost every residential loan policy?**
ALTA 8.1 insures the lender that no environmental protection lien is recorded ahead of the insured mortgage, except as listed, addressing the risk that federal or state clean-up liens, which can have super-priority in some states, would prime the loan. ALTA 9 insures against loss from existing violations of recorded covenants that would result in forfeiture or reversion, from enforced removal of improvements that encroach onto easements or adjoining land, and from damage caused by mineral extraction, effectively making the Schedule B exceptions for CC&Rs and easements harmless to the lender. Fannie Mae and Freddie Mac selling guides accept these as standard, so lender closing instructions request them by default; production systems add them automatically to loan policies and rate them by the state's filed or promulgated rule, which is a flat fee in many states and a percentage of the basic premium in others.

**Q: How do you handle endorsements in a rate calculator that must work across several states?**
I separate the concept from the form: a table keyed by concept (environmental lien, CC&R, PUD, condo, variable rate, location, access) maps to each state's form code, since Texas uses T-numbers and California uses CLTA numbers alongside ALTA, and then a pricing table keyed by state, underwriter and form gives the rule type and parameters: flat amount, percentage of basic premium, percentage varying with survey status, or a promulgated schedule. The calculator resolves the requested concepts to forms for the state, applies each rule against the correct base (loan premium, not owner's), rounds per the state's rounding rule, and returns an itemised list, because closers need the per-endorsement charges on the settlement statement. Version each pricing table with an effective date so a file closed under last year's filing recomputes correctly, and log the rule version on every quote.

**Q: A lender asks for an ALTA 25 Same-as-Survey endorsement on a residential loan with no survey. What do you do?**
Explain that ALTA 25 certifies the insured land is the same as depicted on a specific survey, so it cannot be issued without one; offer the alternatives that meet the lender's underlying concern, which is usually that the improvements sit on the insured land with no encroachments: an ALTA 9 for encroachment coverage, an ALTA 22 to tie the address to the land, or, if they want survey-level assurance, ordering a survey and then issuing the 25 plus deleting the survey exception. I would also check the lender's closing instructions, since many national lenders list ALTA 25 in a generic template but accept 9 and 22 on residential loans when asked. Whatever is agreed, the file should document the lender's written acceptance so the audit trail shows why the requested endorsement was not issued.

