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


# LEVEL: Advanced

## Rate structures: filed vs promulgated rates, tiers, simultaneous issue, reissue/refinance rates

A title premium is not negotiated file by file. Every state regulates it in one of three ways, and the way it is regulated decides how many rate tables your calculator needs, who publishes them and how often they change.

### Three regulatory models

| Model | How the rate is set | Example states | Tables a calculator needs |
|---|---|---|---|
| **Promulgated** | The regulator fixes one rate for every underwriter | Texas (TDI), Florida (OIR), New Mexico | One table per state |
| **Filed (file-and-use / prior approval)** | Each underwriter files its own schedule with the Department of Insurance | Wyoming, Tennessee, California, most states | One table per underwriter per state |
| **Rating bureau** | Member underwriters file jointly through a bureau | Pennsylvania (TIRBOP), New York (TIRSA), New Jersey (NJRB) | One table per state, bureau-published manual |

Two further distinctions matter. **All-inclusive** rates (Texas, Florida, New Mexico) include the search and examination; **risk-rate** states charge search, exam and closing fees separately, so the premium on the settlement statement is smaller but the total is not. And Iowa prohibits private title insurance entirely; the state-run Iowa Title Guaranty issues certificates instead.

### Tiers: rate per $1,000 in bands

Almost every schedule is expressed as an amount per $1,000 of coverage that falls as the amount rises. Florida's promulgated original rate is the cleanest example:

```text
Florida original rate (Rule 69O-186.003), per $1,000 or fraction thereof
  Up to $100,000                       5.75
  $100,001 to $1,000,000               5.00
  $1,000,001 to $5,000,000             2.50
  $5,000,001 to $10,000,000            2.25
  Over $10,000,000                     2.00
  Minimum premium                      100.00

Owner's policy, $350,000:
  100,000 x 5.75 / 1,000 =   575.00
  250,000 x 5.00 / 1,000 = 1,250.00
  Total                    1,825.00
```

The bands are **marginal**, like income tax: the first $100,000 is always charged at 5.75 even on a $5 million policy. A common calculator bug is applying the band rate of the total amount to the whole amount.

Texas uses a different shape: a lookup table for policies up to $100,000, then a base amount plus a per-thousand rate for the excess, rounded to the nearest dollar:

```text
Texas Basic Premium Rate (TDI order effective 1 Sept 2019)
  $100,000 policy                       832
  $100,001 to $1,000,000    832 + 5.27 per $1,000 over 100,000
  $1,000,001 to $5,000,000  5,575 + 4.35 per $1,000 over 1,000,000
  $350,000 owner's policy:  832 + 250 x 5.27 = 832 + 1,317.50 = 2,149.50 -> $2,150 (rounded)
  $1,000,000 policy:        832 + 900 x 5.27 = 5,575
```

### Simultaneous issue

When an owner's and a loan policy are issued on the same transaction, the loan policy is nearly free because the search was done once. Florida charges **$25** for a simultaneous loan policy up to the owner's amount; Texas Rate Rule **R-5** charges **$100**. In filed-rate states each underwriter files its own simultaneous rate, often a flat $150 to $300 or a small percentage. Any loan amount above the owner's amount is charged at the ordinary loan tier on the excess, which is why the calculator needs both amounts, not just one.

### Reissue and refinance rates

A **reissue rate** is a discount because a recent policy already insured the same land, so the search risk is lower. Florida applies its reissue schedule to the amount of a prior owner's policy issued within the last three years, charging the original rate only on the excess. Texas Rate Rule **R-8** gives a credit on a loan policy that refinances a lien insured within the last eight years: 40% of the prior premium if the prior policy is up to four years old, then 35%, 30%, 25% and 20% for years five to eight. Filed-rate states have refinance rates (a lower per-thousand schedule for loan policies on refinances) and reissue credits with underwriter-specific look-back periods, and many require a copy of the prior policy as proof.

```javascript
// Marginal tier engine used by every rate calculator
function tieredPremium(amount, tiers, roundUpTo = 1000) {
  const amt = Math.ceil(amount / roundUpTo) * roundUpTo;   // "per $1,000 or fraction thereof"
  let total = 0, prev = 0;
  for (const [upTo, ratePer1000] of tiers) {
    const slice = Math.max(0, Math.min(amt, upTo) - prev);
    total += slice / 1000 * ratePer1000;
    prev = upTo;
    if (amt <= upTo) break;
  }
  return Math.round(total * 100) / 100;
}
const FL = [[100000, 5.75], [1000000, 5.00], [5000000, 2.50], [10000000, 2.25], [Infinity, 2.00]];
console.log(tieredPremium(350000, FL));   // 1825
console.log(Math.max(100, tieredPremium(12000, FL))); // 100 minimum premium
```

> **Warning:** A rate schedule is a dated legal document. Texas rates changed on 1 September 2019, Florida's rule is amended by the Office of Insurance Regulation, and filed-rate underwriters refile at will. Store `effective_from` and `effective_to` on every table row and never overwrite a rate; the file that closed under the old rate must still recalculate correctly in an audit.

### Try It Yourself

```excel
' Tier table in B2:B6 (lower bounds 0, 100000, 1000000, 5000000, 10000000)
' Marginal rate per $1,000 in C2:C6 (5.75, 5.00, 2.50, 2.25, 2.00)
' Differential rate in D2: =C2  and D3:D6: =C3-C2 filled down
' Coverage amount in A1, rounded up to the next $1,000:
=MAX(100, SUMPRODUCT((CEILING(A1,1000)>B2:B6)*(CEILING(A1,1000)-B2:B6)*D2:D6)/1000)
' A1 = 350000 -> 1825   A1 = 12000 -> 100 (minimum premium applied)
```

### Quiz

1. In a promulgated-rate state, how many owner's-policy rate tables does a multi-underwriter calculator need?
- [x] One, because every underwriter must charge the same rate
- [ ] One per underwriter
- [ ] One per county
> Texas and Florida fix the rate by regulation; competition is on service, not price.

2. What is wrong with charging a $5,000,000 Florida owner's policy at $2.50 per $1,000 on the whole amount?
- [ ] Nothing, the top band applies
- [x] Bands are marginal; the first $100,000 is at 5.75 and the next $900,000 at 5.00
- [ ] The rate should be 2.25
> Tiers work like tax brackets: each slice is charged at its own rate.

3. Which Texas rate rule gives a credit on a loan policy that refinances a recently insured lien?
- [ ] R-5
- [x] R-8
- [ ] T-19
> R-8 gives 40% down to 20% depending on the age of the prior policy, up to eight years.

4. Why does a simultaneous-issue calculation need both the owner's and the loan amount?
- [ ] To compute the seller's share
- [x] The flat simultaneous rate covers only the loan amount up to the owner's amount; the excess is charged at the loan tier
- [ ] It does not; only the loan amount matters
> A $400,000 loan on a $350,000 owner's policy pays the flat rate plus the loan tier on $50,000.

### Exercises

1. **Texas refinance** — A borrower refinances a $300,000 loan whose loan policy was issued five years ago. The prior premium was $1,890. New loan policy basic premium is $1,886. What is the R-8 credit and the net premium?
<details><summary>Solution</summary>

```text
Prior policy age: 5 years -> credit rate 35%
Credit = 35% x 1,890 = 661.50
Net premium = 1,886 - 661.50 = 1,224.50 -> round per TDI rule to $1,225 (check the current rule for rounding of credits)
```

</details>

2. **Model the table** — Design the columns of a rate table that can hold Florida's tiers, Texas's base-plus-rate shape and an underwriter's filed simultaneous fee in one schema.
<details><summary>Solution</summary>

```text
rate_table(state, underwriter_id NULL for promulgated, policy_type, rate_kind, effective_from, effective_to)
rate_band(rate_table_id, band_lower, band_upper, per_1000, base_amount, round_rule)
  Florida owner's:  bands with per_1000 only, base_amount 0, round_rule 'ceil_1000'
  Texas basic:      band 100001-1000000 with base_amount 832, per_1000 5.27, round_rule 'nearest_dollar'
  Simultaneous:     rate_kind 'flat', one band 0-inf, base_amount 25 (FL) or 100 (TX)
rate_credit(state, underwriter_id, credit_kind 'reissue'|'refinance', years_max, pct, requires_prior_policy)
```

</details>

### Interview Questions

**Q: Explain the difference between promulgated, filed and rating-bureau rates and how each affects a production team.**
Promulgated rates, as in Texas and Florida, are set by the regulator and identical for every underwriter, so a production team needs one table per state and competes on turnaround and service. Filed rates, which cover most states including Wyoming, Tennessee and California, are set by each underwriter in a filing with the state insurance department, so a team that issues for several underwriters must maintain one schedule per underwriter per state and watch for refilings. Rating-bureau states such as Pennsylvania, New York and New Jersey publish a joint manual through TIRBOP, TIRSA or NJRB, which behaves like a promulgated rate operationally. The practical consequence is data volume and change control: at Stewart my matrices for filed-rate states had several times the rows of the Texas one, and every refiling meant a dated new version rather than an edit.

**Q: How do simultaneous issue and reissue rates work, and where do calculators get them wrong?**
Simultaneous issue applies when an owner's and a loan policy are issued on the same transaction; the loan policy is charged a flat fee such as Florida's $25 or Texas's $100 up to the owner's amount, with any excess loan amount charged at the loan tier. Reissue and refinance rates discount a new policy because a recent policy insured the same land; Florida looks back three years on the prior policy amount, Texas R-8 looks back eight years with a sliding credit from 40% to 20%. Calculators go wrong by applying the flat simultaneous fee when the loan exceeds the owner's amount, by applying reissue to the full new amount instead of the prior policy amount, by using the top band rate on the whole amount instead of marginal bands, and by rounding at the wrong step; Florida rounds the amount up to the next $1,000 first, Texas rounds the final premium to the nearest dollar. I test every calculator against the regulator's own published examples before release.

**Q: A rate table changed last month. How do you make sure quotes and closed files stay correct?**
Never overwrite a schedule. Each rate table row carries an effective date range, the calculator picks the row where the quote date falls, and every quote stores the table version it used. A file that closed under the old rate recomputes identically during an audit, and a quote issued before the change but closing after it can be flagged for re-rating, which some states require and others prohibit for a locked quote. I also keep the regulator's or underwriter's filing document with the version, since an auditor will ask for the source, and I diff old and new tables to produce a change summary for the closers so they can explain fee differences to lenders.

## Building a rate calculator (six policy types, competitor comparison logic)

A production-grade rate calculator does three things: it turns inputs (state, county, amounts, transaction type, prior policy facts) into itemised charges for every policy and endorsement, it does so for every underwriter the agency can issue for, and it explains its arithmetic so a closer can defend the number. This chapter builds one around the six policy types that cover nearly every residential order.

### The six policy types

| # | Product | Base amount | Rate source | Typical adjustment |
|---|---|---|---|---|
| 1 | Owner's policy (ALTA Owner's 2021 or state form) | Purchase price | Owner's tier schedule | Reissue credit if prior owner's policy is recent |
| 2 | Homeowner's (enhanced) owner's policy | Purchase price | Owner's schedule x 110% (typical filing) or separate schedule | Same reissue rule |
| 3 | Loan policy, standalone (refinance) | Loan amount | Loan or refinance schedule | Refinance/reissue credit against prior loan policy |
| 4 | Loan policy, simultaneous with owner's | Loan amount | Flat simultaneous fee up to owner's amount | Loan tier on the excess |
| 5 | Expanded coverage residential loan policy | Loan amount | Loan schedule x 110% or filed surcharge | Simultaneous rule still applies |
| 6 | Junior loan / HELOC policy (ALTA Residential Limited Coverage Junior Loan) | Line amount | Flat fee schedule (for example $125 up to $250,000) | Rarely discounted |

Endorsements sit on top as a separate itemised list using the rules from the endorsement chapter.

### Input model

```javascript
const order = {
  state: "TN", county: "Davidson", underwriters: ["A", "B", "C"],
  transaction: "purchase",           // purchase | refinance | heloc
  purchasePrice: 425000, loanAmount: 340000,
  ownerProduct: "homeowners",        // standard | homeowners
  loanProduct: "standard",           // standard | expanded | junior
  priorPolicy: { kind: "owners", amount: 380000, date: "2023-05-10" },
  endorsements: ["8.1", "9", "5"],
  quoteDate: "2026-09-16",
};
```

The quote date drives table selection; the prior policy drives credits; the transaction type decides whether product 3 or 4 applies to the loan.

### The engine

```javascript
function quote(order, tables) {
  const out = [];
  for (const uw of order.underwriters) {
    const t = tables.pick(order.state, uw, order.quoteDate);   // versioned rate tables
    const lines = [];
    if (order.transaction === "purchase") {
      let own = tieredPremium(order.purchasePrice, t.owners);
      if (order.ownerProduct === "homeowners") own = own * t.homeownersFactor;   // often 1.10
      own -= reissueCredit(order.priorPolicy, order.purchasePrice, t);
      lines.push({ item: "Owner's policy", amount: round2(own) });
      const covered = Math.min(order.loanAmount, order.purchasePrice);
      let loan = t.simultaneousFlat + tieredPremium(Math.max(0, order.loanAmount - covered), t.loan);
      if (order.loanProduct === "expanded") loan *= t.expandedFactor;
      lines.push({ item: "Loan policy (simultaneous)", amount: round2(loan) });
    } else if (order.transaction === "refinance") {
      let loan = tieredPremium(order.loanAmount, t.refinance || t.loan);
      loan -= refinanceCredit(order.priorPolicy, loan, t);
      lines.push({ item: "Loan policy (refinance)", amount: round2(Math.max(loan, t.minimumPremium)) });
    } else {
      lines.push({ item: "Junior loan policy", amount: flatSchedule(order.loanAmount, t.junior) });
    }
    for (const code of order.endorsements) {
      lines.push({ item: `Endorsement ALTA ${code}`, amount: endorsementCharge(order.state, uw, code, lines, t) });
    }
    out.push({ underwriter: uw, lines, total: round2(lines.reduce((s, l) => s + l.amount, 0)), version: t.version });
  }
  return out;
}
```

Every line carries the item, the amount and, in the full implementation, the band-by-band working (`explain` array) so the UI can show "100,000 x 5.75 = 575.00" on hover. Closers trust a number they can see the arithmetic for.

### Competitor comparison logic

Agencies that issue for several underwriters in a filed-rate state need to know which is cheapest for this order and by how much. The comparison layer runs the engine once per underwriter and then:

1. Ranks by total, then by owner's premium (the buyer-visible line), then by underwriter preference weight set by management.
2. Reports the delta to the cheapest in dollars and percent, with a threshold below which it reports "equivalent" (a $4 difference on $2,000 is noise; rate rounding rules differ).
3. Flags **non-comparable** results: an underwriter whose filing lacks the requested endorsement, or whose reissue look-back excludes the prior policy, shows the reason rather than a silently higher total.
4. Honours business rules: a lender that requires a specific underwriter, or a state where the agent's contract caps volume with one underwriter, overrides price.

```text
Quote 2026-09-16  TN / Davidson  Purchase 425,000 / Loan 340,000 (Homeowner's + simultaneous loan, 8.1, 9, 5)
Underwriter   Owner's   Loan   8.1     9        5      Total      Delta    Note
B             2,167.00  175.00  0.00   17.50   25.00   2,384.50   0.00     cheapest
A             2,205.50  200.00  0.00   20.00   25.00   2,450.50  +66.00   (+2.8%)
C             2,145.00  250.00  25.00  25.00   25.00   2,470.00  +85.50   ALTA 5 filed as flat 25; reissue not applied (look-back 2 yrs)
Rate versions: A 2026-03-01, B 2025-11-15, C 2026-07-01
```

Notice that C has the cheapest owner's line but the highest total; ranking on one line would mislead the closer.

### Testing the calculator

Build a regression sheet of known-good quotes: the regulator's published examples for promulgated states, and for filed states three or four quotes per underwriter confirmed by the underwriter's own online calculator. Every table update reruns the sheet. Cases to include: amount exactly on a band boundary ($100,000 and $100,001), amount below the minimum premium, loan greater than purchase price, prior policy one day inside and one day outside the look-back, and an endorsement not filed by one underwriter.

> **Interview note:** When asked "how would you build a rate calculator", interviewers want the data model and the edge cases, not the UI. Lead with versioned tables, marginal bands, simultaneous and reissue logic, itemised output with explanations, and a regression suite tied to the regulator's examples.

### Try It Yourself

```javascript
// Compare three filed schedules on the same order and rank them
const tieredPremium = (amount, tiers) => {
  const amt = Math.ceil(amount / 1000) * 1000; let total = 0, prev = 0;
  for (const [upTo, r] of tiers) { total += Math.max(0, Math.min(amt, upTo) - prev) / 1000 * r; prev = upTo; if (amt <= upTo) break; }
  return Math.round(total * 100) / 100;
};
const uw = {
  A: { owners: [[100000, 5.80], [1000000, 4.90], [Infinity, 3.00]], simul: 200, homeowners: 1.10 },
  B: { owners: [[100000, 5.75], [1000000, 4.80], [Infinity, 3.00]], simul: 175, homeowners: 1.10 },
  C: { owners: [[100000, 5.50], [1000000, 4.85], [Infinity, 3.00]], simul: 250, homeowners: 1.05 },
};
const price = 425000, loan = 340000;
const results = Object.entries(uw).map(([name, t]) => {
  const owners = Math.round(tieredPremium(price, t.owners) * t.homeowners * 100) / 100;
  const total = owners + t.simul;
  return { name, owners, loan: t.simul, total };
}).sort((a, b) => a.total - b.total);
const best = results[0].total;
results.forEach(r => console.log(r.name, r.owners.toFixed(2), r.loan.toFixed(2), r.total.toFixed(2), "+" + (r.total - best).toFixed(2)));
```

### Quiz

1. Which amount is the base for a loan policy issued simultaneously with an owner's policy?
- [ ] The purchase price
- [x] The loan amount, with the flat simultaneous fee covering the portion up to the owner's amount
- [ ] The larger of the two amounts
> Only the excess of loan over owner's amount is charged at the loan tier.

2. Why should the competitor comparison rank on total rather than on the owner's premium?
- [ ] Owner's premiums are always identical
- [x] An underwriter can be cheapest on one line and most expensive overall because of simultaneous fees and endorsements
- [ ] Lenders only see the total
> Rank on total, show the lines, and flag non-comparable quotes with a reason.

3. What should a calculator do when one underwriter has not filed a requested endorsement?
- [ ] Charge zero
- [ ] Use another underwriter's price
- [x] Mark that quote non-comparable with the reason
> Silent substitution produces a quote the agent cannot issue.

4. Which test case catches the most common tier bug?
- [x] An amount exactly at a band boundary, such as $100,000 and $100,001
- [ ] A negative amount
- [ ] A very large amount
> Boundary amounts expose off-by-one and non-marginal band errors immediately.

### Exercises

1. **Add the junior policy** — Write the `flatSchedule` function for a HELOC policy priced at $125 up to $250,000, $175 up to $500,000 and $250 above.
<details><summary>Solution</summary>

```javascript
function flatSchedule(amount, schedule = [[250000, 125], [500000, 175], [Infinity, 250]]) {
  for (const [upTo, fee] of schedule) if (amount <= upTo) return fee;
}
console.log(flatSchedule(180000), flatSchedule(250000), flatSchedule(600000)); // 125 125 250
```

</details>

2. **Regression sheet** — List eight quote scenarios you would lock into a regression sheet for a Tennessee three-underwriter calculator.
<details><summary>Solution</summary>

```text
1. Purchase 100,000 / loan 80,000 (boundary)          2. Purchase 100,001 / loan 80,000 (boundary + 1)
3. Purchase 15,000 cash (minimum premium)             4. Purchase 300,000 / loan 320,000 (loan > owner's)
5. Refinance 250,000, prior loan policy 23 months old 6. Refinance 250,000, prior policy 1 day past look-back
7. Purchase with ALTA 5 where underwriter C has no ALTA 5 filing
8. Quote dated the day before and the day of a rate refiling
Each row stores expected totals per underwriter and the table versions used.
```

</details>

### Interview Questions

**Q: Walk me through the design of a rate calculator you built.**
At Stewart I built calculators in Excel and later as a script that took state, county, amounts, transaction type, prior-policy facts and endorsements, and produced itemised charges per underwriter. The core was a marginal tier function over versioned rate tables, wrapped by product logic for six products: standard and Homeowner's owner's policies, standalone and simultaneous loan policies, expanded-coverage loan policies and junior-loan policies, with reissue and refinance credits computed against the prior policy amount and age. Output included the band-by-band working for each line so closers could explain fees, and a comparison layer ranked underwriters by total with deltas and non-comparable flags. The part interviewers rarely expect is the regression sheet: dozens of known-good quotes, including band boundaries and look-back edges, re-run after every table update, which is what let us change tables with confidence.

**Q: How do you handle a loan amount that exceeds the purchase price in a simultaneous issue?**
It happens with renovation loans, closing-cost financing and some VA loans. The simultaneous flat fee applies only up to the owner's policy amount, so the excess loan amount is charged at the loan tier; some underwriters instead require the owner's policy to be issued for the higher amount. The calculator should never silently cap the loan at the purchase price, because the lender's policy amount must equal the loan; it should compute the excess, show it as a separate line and, where the filing requires it, raise the owner's amount and show that change explicitly for the closer to confirm with the buyer.

**Q: What makes a multi-underwriter comparison fair?**
Same inputs, same quote date, same product definitions, and explicit handling of anything one underwriter cannot match. Differences in rounding rules and in what counts as a reissue can create small deltas that are not real price differences, so I report a tolerance band as "equivalent". When an underwriter lacks a filing for a requested endorsement or its look-back excludes the prior policy, the quote is marked non-comparable with the reason instead of ranking last on a number the closer would not understand. Finally, price is one input: management can weight underwriters for claims service or contractual volume, and the tool should show both the raw ranking and the business-rule ranking.

## Multi-underwriter rate matrices & zone harmonisation (Tennessee 3,346-row example)

A **rate matrix** is the flat, long-format table that a calculator, a Power BI report or a closer's lookup sheet reads. It is the opposite of the underwriter's filing, which is a PDF written for a regulator. Turning five filings into one matrix is a data-modelling job, and the hard part is not the numbers but the **zones**.

### Why zones exist

In filed-rate states underwriters may vary rates by geography. One underwriter files a single statewide schedule; another splits the state into "Zone 1" (metropolitan counties) and "Zone 2" (everything else); a third uses county groups that overlap neither. California underwriters commonly file county-level schedules. A matrix that is keyed by county therefore needs a **county-to-zone map per underwriter** before any rate can be looked up.

```text
Tennessee, 95 counties, 3 underwriters
  Underwriter A: statewide                       -> 1 zone
  Underwriter B: Zone 1 = Davidson, Shelby, Knox, Hamilton, Williamson, Rutherford; Zone 2 = other 89 -> 2 zones
  Underwriter C: Middle / East / West grand divisions -> 3 zones
Harmonised key: county -> (uw, zone_id) so every row can be reached from the county the closer types
```

### The long-format schema

```text
rate_matrix
  state        TN
  county       Davidson                 (repeated per county, even for statewide filings)
  underwriter  B
  zone_id      B-Z1
  policy_type  OWN_STD | OWN_HO | LOAN_STD | LOAN_SIM | LOAN_REFI | LOAN_JR
  band_lower   100001
  band_upper   1000000
  per_1000     4.80
  base_amount  0
  flat_fee     NULL
  min_premium  100
  round_rule   ceil_1000
  effective_from 2025-11-15
  effective_to   NULL
  source       "B TN filing 2025-11, page 4"
```

The Tennessee matrix I maintained came to **3,346 rows**: 95 counties multiplied by the policy types and bands each underwriter filed, minus the products some underwriters did not file (no junior-loan schedule from one, no separate refinance schedule from another). Repeating the county on every row looks wasteful, but it lets a `SUMIFS`/`XLOOKUP` or a SQL query filter on county directly without a join, and it makes zone changes explicit: when underwriter B moved Rutherford County from Zone 2 to Zone 1, only Rutherford's rows changed and the diff showed exactly that.

### Building the matrix from filings

1. **Extract** each filing into a staging sheet per underwriter, keeping the filing's own structure (its zone names, its band edges) and page references.
2. **Normalise policy types** to the six canonical codes. A filing that calls the Homeowner's rate "Enhanced Owner's, 110% of Schedule A" becomes `OWN_HO` with `per_1000` computed, or a factor column if you prefer to derive it at run time (I store computed values so the matrix is self-contained and auditable).
3. **Normalise band edges.** Underwriter A's bands end at $100,000; B's at $150,000. Do not split bands to a common grid; keep each underwriter's own edges. The marginal tier engine handles arbitrary edges.
4. **Explode zones to counties** with the county-zone map, producing one row per county.
5. **Validate**: every county has every filed product for every underwriter, no overlapping or gapped bands, every row has a source and effective date.
6. **Publish** as a versioned file (`TN_rate_matrix_2026-07-01.xlsx` plus CSV) and never edit a published version.

```excel
' Validation formulas on the matrix sheet (data in Table "rm")
' 1. Rows per county x underwriter x product should be identical for all counties in a statewide filing
=COUNTIFS(rm[county],[@county],rm[underwriter],[@underwriter],rm[policy_type],[@policy_type])
' 2. Band continuity: the next row's lower bound must equal this row's upper + 1 (sorted by uw, product, county, band_lower)
=IF(AND([@underwriter]=OFFSET([@underwriter],1,0),[@policy_type]=OFFSET([@policy_type],1,0),[@county]=OFFSET([@county],1,0)),OFFSET([@band_lower],1,0)-[@band_upper]=1,TRUE)
' 3. Lookup used by the calculator for a $425,000 owner's policy in Davidson for underwriter B, top band containing the amount
=XLOOKUP(1,(rm[county]="Davidson")*(rm[underwriter]="B")*(rm[policy_type]="OWN_STD")*(rm[band_lower]<=425000)*(rm[band_upper]>=425000),rm[per_1000])
```

### Comparing across underwriters

Once every underwriter is on the county key, comparison is a pivot: county on rows, underwriter on columns, premium for a standard test amount (say $300,000) as the value. That heat-map view is how management sees where each underwriter is competitive; three test amounts ($150,000, $300,000, $750,000) cover the residential range. Because bands differ, compare computed premiums, never the per-thousand rates.

### Change control

Underwriter refilings arrive as PDFs by email. The process that kept the matrix trustworthy: log the filing (underwriter, state, effective date, received date), stage it, run the six validation checks, generate a **diff report** against the current version (rows added, removed, changed with old and new values), have a second person sign off, then publish the new version and update the calculator's table pointer with the effective date. The diff report is what closers and management actually read.

> **Tip:** Keep the county-zone map as its own versioned table. Underwriters rezone more often than they change per-thousand rates, and a map change re-explodes the matrix without touching the staged filings.

### Try It Yourself

```javascript
// Explode zone-level filings into county-level rows and count them
const counties = { Davidson: "B-Z1", Shelby: "B-Z1", Knox: "B-Z1", Rutherford: "B-Z2", Sevier: "B-Z2", Maury: "B-Z2" };
const filingB = {
  "B-Z1": { OWN_STD: [[100000, 5.75], [1000000, 4.80], [Infinity, 3.0]], LOAN_STD: [[100000, 5.0], [Infinity, 4.0]] },
  "B-Z2": { OWN_STD: [[100000, 5.60], [1000000, 4.70], [Infinity, 3.0]], LOAN_STD: [[100000, 4.9], [Infinity, 3.9]] },
};
const rows = [];
for (const [county, zone] of Object.entries(counties)) {
  for (const [product, bands] of Object.entries(filingB[zone])) {
    let lower = 0;
    for (const [upper, per1000] of bands) {
      rows.push({ state: "TN", county, underwriter: "B", zone, product, band_lower: lower, band_upper: upper, per_1000: per1000 });
      lower = upper + 1;
    }
  }
}
console.log(rows.length, "rows");            // 6 counties x (3 + 2 bands) = 30
console.log(rows.filter(r => r.county === "Rutherford" && r.product === "OWN_STD"));
```

### Quiz

1. Why is the county repeated on every row even for a statewide filing?
- [ ] To make the file bigger
- [x] So lookups can filter on the county the closer types without a join, and zone changes become row-level diffs
- [ ] Regulators require it
> Long format trades size for simplicity and auditability.

2. What is the correct way to handle underwriters whose band edges differ?
- [ ] Split every band to a common grid
- [x] Keep each underwriter's own edges; the marginal tier engine handles any edges
- [ ] Use the most common edges for all
> Re-gridding changes nothing mathematically but invites transcription errors.

3. Which artefact should be versioned separately from the rate rows?
- [x] The county-to-zone map per underwriter
- [ ] The validation formulas
- [ ] The pivot table
> Rezoning happens more often than rate changes and re-explodes the matrix.

4. What should management compare across underwriters?
- [ ] Per-thousand rates
- [x] Computed premiums at a few test amounts
- [ ] Number of bands
> Different band edges make per-thousand rates incomparable.

### Exercises

1. **Count the rows** — Underwriter A files statewide with 5 owner's bands, 4 loan bands, a 1-row simultaneous fee and 3 junior-loan bands. Underwriter B files 2 zones with 4 owner's, 4 loan and 1 simultaneous row each, no junior schedule. How many county-level rows does a 95-county Tennessee matrix hold for these two?
<details><summary>Solution</summary>

```text
A: (5 + 4 + 1 + 3) = 13 rows per county x 95 = 1,235
B: (4 + 4 + 1) = 9 rows per county x 95 = 855   (zones do not multiply rows; each county belongs to one zone)
Total 2,090 rows
```

</details>

2. **Write the diff** — Describe the columns of the diff report you would send closers after a refiling.
<details><summary>Solution</summary>

```text
change_type (added | removed | changed), underwriter, county or zone, policy_type, band_lower, band_upper,
old_per_1000, new_per_1000, old_flat_fee, new_flat_fee, effective_from, example_delta_at_300k, source_page
Plus a summary line: "B TN 2026-07-01: 3 counties rezoned, owner's bands +0.10 on 100,001-1,000,000, simultaneous fee 175 -> 200."
```

</details>

### Interview Questions

**Q: Tell me about the largest rate matrix you maintained and how you kept it correct.**
The Tennessee matrix combined three underwriters' filings into 3,346 county-level rows keyed by county, underwriter, policy type and amount band, with effective dates and a source reference on every row. Correctness came from a fixed pipeline: staging each filing in its own structure, normalising products to six codes, exploding zones through a versioned county-zone map, then running validation checks for band continuity, product completeness per county and missing sources before publishing a new dated version. Every refiling produced a diff report reviewed by a second person and a change summary for closers. The design choice I would defend is long format with the county repeated: it looked redundant but made every lookup a simple filter and every rezoning a visible row change.

**Q: Two underwriters define zones differently. How do you compare them?**
Resolve both to the county, which is the only geography a closer actually types. I keep a county-to-zone map per underwriter, explode each filing to county rows, then compute premiums for standard test amounts and pivot county by underwriter. Comparing zone definitions directly is meaningless because they do not align; comparing per-thousand rates is misleading because band edges differ; comparing computed premiums at the county level is the only apples-to-apples view, and it is also what the calculator does at quote time.

**Q: What validation would you automate on a rate matrix before publishing it?**
Band continuity (each band starts one dollar after the previous ends, with no gaps or overlaps), completeness (each county has the same set of products and band counts as every other county in the same zone), referential integrity (every county appears in the zone map, every zone in the map appears in the filing), monotonic sanity (per-thousand rates do not increase with amount unless the filing genuinely says so), non-empty source and effective date on every row, and a recomputation of the regulator's or underwriter's published example quotes to the cent. I run these in a script or in structured-reference Excel formulas and refuse to publish on any failure.

## State differences (WY, TN, TX, FL, CA) & regulators

Title insurance is regulated state by state. The five states below cover the range of models a multi-state production team meets, and knowing which regulator, which forms and which closing customs apply to a file is the difference between a clean closing and a compliance finding.

### Side-by-side

| Topic | Wyoming | Tennessee | Texas | Florida | California |
|---|---|---|---|---|---|
| Regulator | Wyoming Department of Insurance | Tennessee Department of Commerce & Insurance | Texas Department of Insurance (TDI) | Office of Insurance Regulation (rates); Dept. of Financial Services (agent licensing) | California Department of Insurance |
| Rates | Filed per underwriter | Filed per underwriter | Promulgated by TDI | Promulgated by OIR (Rule 69O-186.003) | Filed per underwriter, often by county |
| Rate basis | Risk rate; search and closing fees separate | Filed; search and closing fees typically separate | All-inclusive | All-inclusive (title search may be charged separately as a closing service) | Filed; escrow charged separately |
| Forms | ALTA | ALTA | TDI T-forms (T-1, T-2, T-7, T-19 ...) | ALTA with Florida modifications | ALTA and CLTA |
| Who closes | Title/escrow company | Title company or attorney | Title company escrow officer (licensed) | Title agent or attorney | Escrow company (south) or title company escrow (north) |
| Who pays owner's policy (custom) | Seller, commonly | Seller or negotiated | Seller, commonly | Seller in most counties; buyer in Miami-Dade, Broward, Sarasota and a few others | Seller in most southern counties; varies by county |
| Notable rule | Small market; abstract tradition; few underwriters filed | Many small agents; attorney involvement common | Escrow officers licensed by TDI; Texas Title Insurance Guaranty Association; promulgated endorsement prices | Butler rebate: agents may rebate their share of premium; agent retains most of the premium | Independent escrow licensed by DFPI; title company escrow under CDI; county-level rate schedules |

### What "attorney state" and "escrow state" mean for production

In **escrow states** (California, Wyoming and the rest of the West) a neutral escrow holder collects documents and money and disburses when conditions are met; the parties rarely meet. In **table-closing** or attorney-influenced states (Tennessee, Florida in practice, Texas through licensed escrow officers) the closer sits with the parties. Some states require an attorney to conduct or supervise closings (Georgia, South Carolina, Massachusetts among others); Tennessee does not require it but attorneys act as agents widely. Production support for an escrow-state file focuses on the commitment and the escrow instructions; for a table-closing file it also includes the settlement statement and the signing package.

### Texas in detail

Texas is the most regulated market. TDI promulgates the rate, every policy and endorsement form (the T-series), the rate rules (R-1 to R-30 or so, with R-5 simultaneous issue and R-8 refinance credit the ones production sees daily), and the **Procedural Rules** (P-rules) that govern what an agent may and may not do. Escrow officers must hold a TDI licence. Because there is no price competition, Texas agencies compete on turnaround and relationships, and the promulgated forms mean Schedule B exceptions follow standard TDI wording that examiners memorise.

### Florida in detail

Rates are promulgated but the market is unusual: agents keep most of the premium and may rebate part of their share to the buyer under the *Chicago Title v. Butler* (2000) decision, so "the same rate" can still produce different buyer costs. The Florida Department of Financial Services licenses agents and agencies; the Office of Insurance Regulation sets rates. Closing services (search, exam, closing fee) are itemised as separate charges. County custom on who pays the owner's policy splits the state, which matters for the settlement statement.

### Tennessee and Wyoming

Both are filed-rate states with search and closing fees separate from premium. Tennessee has a large number of small agencies and attorney agents, three or four active underwriters in most counties, and zone-based filings, which is why its matrix is so large. Wyoming is a thin market: few underwriters file, agents are often the only office in a county, and a production team's job is mostly commitments and policies rather than competitive quoting. Both states' regulators publish filed rate manuals on request and expect the exact filed rate to be charged; charging less is an illegal rebate in Tennessee, unlike Florida.

### California in detail

Each underwriter files its own schedule with the California Department of Insurance, often with county or regional variations, so a quote needs the county. Escrow is a separate business: in Southern California independent escrow companies licensed by the Department of Financial Protection and Innovation handle closings; in Northern California the title company's escrow department does. Forms are ALTA and CLTA (the CLTA Standard Coverage owner's policy is still common), and California requires "good funds" before disbursement.

```text
File routing rules a multi-state production queue applies
  TX -> use T-7 commitment, T-1/T-2 policies, TDI promulgated rate; P-rule review on any rebate or discount
  FL -> check county for owner's policy payer; itemise closing services; agent retention per contract
  TN -> select underwriter by county zone; charge exact filed rate; attorney agent may issue
  WY -> filed rate; risk-rate premium + separate search/closing fees; escrow closing
  CA -> county-level schedule; CLTA vs ALTA owner's choice; escrow company or title escrow per region
```

> **Warning:** The same word means different things by state. "Simultaneous issue" in Texas is R-5 at $100; in Florida $25; in Tennessee whatever the underwriter filed. "Reissue" has a 3-year look-back in Florida and 8-year R-8 in Texas. Never copy a rule across states without reading that state's filing.

### Try It Yourself

```text
State checklist card (keep one per state in the production wiki)
State: Texas
Regulator: TDI  |  Rate model: promulgated  |  Forms: T-series  |  Last rate change: 2019-09-01
Simultaneous: R-5 $100  |  Refinance credit: R-8 40/35/30/25/20% by year 1-4/5/6/7/8
Closer: TDI-licensed escrow officer  |  Owner's policy custom: seller pays
Endorsement prices: promulgated (T-19 5% or 10% w/o survey; T-36 $25; T-17 $25)
Rebates: prohibited (P-53)  |  Guaranty fund: Texas Title Insurance Guaranty Association
Watch-outs: P-rule compliance on discounts; T-19 survey requirement; homestead rules on refinances
```

### Quiz

1. Which state promulgates both rates and policy forms?
- [ ] Florida
- [x] Texas
- [ ] California
> Florida promulgates rates but uses ALTA forms with Florida modifications; Texas promulgates T-forms too.

2. In which state may an agent legally rebate part of the premium to the buyer?
- [x] Florida
- [ ] Tennessee
- [ ] Texas
> The Butler decision allows Florida agents to rebate their share; Texas and Tennessee prohibit rebates.

3. Who licenses independent escrow companies in Southern California?
- [ ] California Department of Insurance
- [x] Department of Financial Protection and Innovation
- [ ] The county recorder
> Title company escrow departments fall under the CDI; independent escrow under DFPI.

4. Why does a California quote need the county?
- [ ] Recording fees differ
- [x] Underwriters file county or regional rate schedules
- [ ] Forms differ by county
> Filed rates in California commonly vary by county.

### Exercises

1. **Route the file** — A refinance in Shelby County, Tennessee, insured by underwriter B, prior loan policy 30 months old. List the checks the production team makes before rating.
<details><summary>Solution</summary>

```text
1. Zone: Shelby is B-Z1 -> use B's Zone 1 refinance schedule (or loan schedule if no refinance schedule filed)
2. Refinance credit: B's filed look-back (say 3 years) -> 30 months qualifies; request copy of prior policy
3. Charge exact filed rate; no discounts beyond the filing (TN prohibits rebates)
4. Endorsements per lender instructions priced from B's TN endorsement filing
5. Search and closing fees itemised separately from premium
```

</details>

2. **Explain to a lender** — A lender from Texas is closing its first loan in Florida and asks why the loan policy premium is only $25. Write the answer.
<details><summary>Solution</summary>

```text
Florida's promulgated simultaneous issue rate charges $25 for a loan policy issued at the same time as the
owner's policy, up to the owner's amount; the risk was priced into the owner's premium. Any loan amount above
the owner's amount is charged at the original rate. Texas's equivalent is Rate Rule R-5 at $100. Closing
services (search, exam, closing fee) appear as separate lines in Florida, unlike Texas's all-inclusive rate.
```

</details>

### Interview Questions

**Q: You supported production for several states. What differed most between them?**
Three things: how the rate is set, who closes, and what the forms are. Texas promulgates rate and T-forms through TDI with licensed escrow officers, so the work is standardised and compliance-driven; Florida promulgates the rate but lets agents rebate and itemises closing services, with county customs deciding who pays the owner's policy; Tennessee and Wyoming are filed-rate states where the exact underwriter's schedule must be charged and search and closing fees are separate; California adds county-level schedules and a split escrow industry. Operationally this meant separate checklists, separate rate tables with different shapes, and separate QA rules per state, and the reporting had to be by state because a Texas commitment and a California commitment are not the same unit of work.

**Q: What is the Butler rebate and why does it matter for quoting in Florida?**
In *Chicago Title Insurance Co. v. Butler* (2000) the Florida Supreme Court struck down the anti-rebate provision as applied to the agent's share of the premium, so Florida agents may give back part of their retained premium to the customer, while the underwriter's share and the promulgated rate itself remain fixed. For quoting, the promulgated premium is the same across agencies but the effective buyer cost is not, so comparison tools must distinguish the rate from the net charge, and any rebate must be disclosed and applied consistently. Most other states, including Texas and Tennessee, prohibit rebates outright, so this is a Florida-specific rule that must not leak into other states' logic.

**Q: Which regulator would you contact for a rate question in each of Texas, Florida and Tennessee?**
Texas: the Texas Department of Insurance, Title Division, which publishes the Basic Manual with rate rules, P-rules and T-forms. Florida: the Office of Insurance Regulation for the promulgated rate under Rule 69O-186.003, and the Department of Financial Services for agent licensing questions. Tennessee: the Department of Commerce and Insurance, which holds each underwriter's filed rate manual; in practice the first call is to the underwriter's state agency manager, who has the current filing and its effective date, then the regulator if the filing itself needs confirmation.

## Data processing for title plants & title-search projects

Before any commitment exists, someone had to index the public record. Title plants and title-search projects are where BPO data-processing teams meet the title industry, and they are judged on accuracy, throughput and turnaround.

### What a title plant is

A **title plant** is a privately maintained, geographically indexed copy of the county's records. The county recorder indexes by grantor and grantee name; the plant re-indexes every document by **parcel or legal description** (lot, block, subdivision; section-township-range; condominium unit) so an examiner can pull everything affecting a parcel in one query. Plants are updated daily from the recorder's feed; the **plant date** is the last day fully posted, and the gap between the plant date and today is covered by a "gap" search or gap coverage in the commitment. Some states (Texas, Arizona, Nevada) require agents to own or lease a plant meeting statutory standards.

### The data-processing work

| Task | Input | Output | Typical quality target |
|---|---|---|---|
| Document classification | Recorder images | Document type (WD, QCD, DOT, MTG, REL, LIS, JUDG, LIEN, EASE, PLAT) | 99.5% |
| Index keying | Image | Grantor(s), grantee(s), recording date, instrument number, book/page, consideration, legal description | 99.0% field accuracy; 99.9% on instrument number |
| Legal-description parsing | Free text | Structured lot/block/subdivision or S-T-R, parcel ID | 98.5% |
| Chain assembly (search project) | Indexed records for an order | Chain of title report, open mortgages, judgments, taxes | 100% on open liens (defect = claim) |
| QC | Sample of output | Error log by field and agent | 5% sample, 100% on high-risk fields |

### A search project as a BPO workflow

A typical **title-search project** has the client (an underwriter, an agency or a search vendor) send orders with a property address or parcel number and a search period (30, 40 or 60 years, or back to a prior policy). The team pulls the plant or online recorder, assembles the chain, lists open mortgages and liens, checks judgments and taxes, and returns a search report or an abstract. The workflow I ran at Systems Limited looked like this:

```text
Intake (order sheet, county, search type, TAT)  ->  Assignment (queue by county skill)  ->  Search & keying
  ->  Self-check (checklist)  ->  QC sample (quality checker)  ->  Rework loop  ->  Delivery  ->  Client feedback log
KPIs: orders/agent/day, field accuracy, first-pass yield, TAT vs SLA, client-reported defects per 100 orders
```

### Keying standards that prevent downstream errors

Names are the biggest source of error. The rules that stop them: key names exactly as written, including suffixes (Jr., III) and middle initials; key business names with the entity suffix (LLC, Inc.) but without punctuation; key "aka" and "fka" as additional index entries, never as replacements; and flag illegible characters rather than guessing. Instrument numbers are double-keyed (two agents key blind, the system compares) because a wrong instrument number breaks the link between a mortgage and its release.

```excel
' QC sheet: field-level accuracy per agent (columns: Agent, Field, Keyed, Verified, Match)
=COUNTIFS(Agent,"A17",Match,TRUE)/COUNTIFS(Agent,"A17")                          ' agent accuracy
=COUNTIFS(Field,"instrument_no",Match,FALSE)                                     ' errors on the critical field
=SUMPRODUCT((Field="grantor")*(Match=FALSE))/SUMPRODUCT((Field="grantor")*1)     ' grantor error rate
' Release matching check: every MTG should have at most one REL pointing to its instrument number
=COUNTIFS(DocType,"REL",RefInstrument,[@InstrumentNo])
```

### Validation rules worth automating

- Recording date must be on or after the document date (a deed cannot be recorded before it is signed) and within the plant date.
- Book/page or instrument number format must match the county's pattern (`^\d{4}-\d{6}$` for a year-sequence county, `B\d{3,5}P\d{1,4}` for book/page).
- A release must reference an instrument that exists and is a mortgage or deed of trust.
- Grantee on a deed should appear as grantor on the next deed in the chain; a break is either a missed document or a name variant to be reconciled.
- Legal description on a deed must match the parcel being searched; a partial match is a flag, not an error, because splits and combinations happen.

```javascript
// Chain-of-title continuity check on indexed deeds sorted by recording date
const deeds = [
  { inst: "2001-004512", grantor: "SMITH JOHN A", grantee: "LOPEZ MARIA" },
  { inst: "2012-118844", grantor: "LOPEZ MARIA", grantee: "TITLEWAVE HOLDINGS LLC" },
  { inst: "2019-032110", grantor: "TITLEWAVE HOLDING LLC", grantee: "KHAN ALI R" },
];
const norm = s => s.toUpperCase().replace(/[^A-Z0-9 ]/g, "").replace(/\s+/g, " ").trim();
for (let i = 1; i < deeds.length; i++) {
  const prev = norm(deeds[i - 1].grantee), cur = norm(deeds[i].grantor);
  if (prev !== cur) console.log(`Break before ${deeds[i].inst}: "${prev}" -> "${cur}"`);
}
// Output: Break before 2019-032110: "TITLEWAVE HOLDINGS LLC" -> "TITLEWAVE HOLDING LLC"  (name variant, examiner to reconcile)
```

### Productivity without sacrificing accuracy

A team lead's levers are county specialisation (agents keyed the same county's forms faster and more accurately), templates for common document types, a daily error feedback loop from the quality checker to each agent, and separating high-risk fields for 100% verification while sampling the rest. Reporting throughput without the accuracy rate beside it is how vendors lose contracts.

> **Interview note:** "How did you measure quality?" wants field-level accuracy, first-pass yield and client-reported defects, with numbers. "We had 20 agents, 99.2% field accuracy on a 5% sample, 100% verification of instrument numbers and open-lien status, and client-reported defects fell from 3.1 to 0.8 per 100 orders after county specialisation" is the shape of a good answer.

### Try It Yourself

```text
Index record layout for a title plant feed (pipe-delimited, one row per party per document)
county|instrument_no|book|page|doc_type|doc_date|rec_date|party_role|party_name|party_type|legal_type|subdivision|lot|block|section|township|range|parcel_id|ref_instrument|consideration|keyed_by|verified_by
KNOX|2026-045512||  |DOT|2026-09-10|2026-09-12|GRANTOR|KHAN ALI R|IND|LOT|RIVERBEND PH 2|14|C||||094-123.00||340000|A17|Q03
KNOX|2026-045512||  |DOT|2026-09-10|2026-09-12|GRANTEE|FIRST HOME LENDING LLC|ORG|LOT|RIVERBEND PH 2|14|C||||094-123.00||340000|A17|Q03
KNOX|2026-045513||  |REL|2026-09-11|2026-09-12|GRANTOR|OLD BANK NA|ORG|||||||||2019-032111||A17|Q03
Validation: rec_date >= doc_date; REL.ref_instrument must exist and be MTG/DOT; parcel_id required for LOT and STR legal types
```

### Quiz

1. What distinguishes a title plant from the county recorder's index?
- [ ] It is public
- [x] It is indexed by parcel or legal description rather than only by name
- [ ] It contains only deeds
> Parcel indexing lets an examiner pull everything affecting one property in one query.

2. Which field should be double-keyed in a title-plant feed?
- [ ] Consideration
- [x] Instrument number
- [ ] Subdivision name
> A wrong instrument number breaks the link between a mortgage and its release.

3. What does a break in grantee-to-grantor continuity most often indicate?
- [x] A missed document or a name variant to reconcile
- [ ] Fraud
- [ ] A recording error by the county
> Most breaks are variants such as "HOLDINGS" vs "HOLDING"; examiners reconcile them.

4. Which quality metric should always be reported alongside throughput?
- [ ] Agent attendance
- [x] Field-level accuracy or first-pass yield
- [ ] Number of counties covered
> Throughput without accuracy is how search vendors lose clients.

### Exercises

1. **Write validation rules** — List five automated checks for an indexing feed and the action each triggers.
<details><summary>Solution</summary>

```text
1. rec_date < doc_date            -> reject row, return to keyer
2. instrument_no format mismatch  -> reject row
3. REL with ref_instrument not found -> hold, search for the mortgage, then release or flag
4. GRANTEE of deed N != GRANTOR of deed N+1 (normalised) -> flag chain break for examiner
5. LOT legal with empty parcel_id -> hold for parcel lookup
```

</details>

2. **QC plan** — Design the sampling plan for a 20-agent team keying 4,000 documents a day.
<details><summary>Solution</summary>

```text
100% verification: instrument_no, doc_type, rec_date, ref_instrument on releases (double-key or checker review)
5% random sample of all other fields per agent per day (about 10 documents per agent)
Targeted 20% sample for any agent below 99% in the previous week, or in their first 10 working days
Daily error log by field and agent; weekly accuracy chart; retraining trigger at 2 consecutive weeks under 99%
```

</details>

### Interview Questions

**Q: Describe the title-search project you led and how the work was organised.**
The client sent daily batches of search orders by county with a target turnaround, and a 20-agent team searched online recorder sites and plant data, keyed the index records, assembled chains of title, listed open mortgages, liens, judgments and taxes, and returned search reports. I organised agents by county so they learned local document forms and indexing quirks, set a checklist for self-review, and ran a quality checker who sampled 5% of output and verified 100% of high-risk fields such as instrument numbers and open-lien status. Errors were fed back to the agent the same day and tracked by field, which let us target retraining. The result was field accuracy above 99% and a client-reported defect rate that fell steadily as county specialisation took hold.

**Q: What are the highest-risk errors in title-search data and how do you guard against them?**
A missed open mortgage or lien, because the commitment will omit it and the policy will insure over it, which is a claim; a wrong instrument number, because it disconnects a mortgage from its release and either creates a false open lien or hides a real one; and a name error that breaks or falsely completes the chain. Guards are double-keying of instrument numbers, 100% checker verification of open-lien status, normalised name matching with human reconciliation of variants, and validation rules that reject impossible data such as a recording date before the document date. I treat these fields differently from descriptive fields like consideration, where sampling is enough.

**Q: How would you set up a new county for a title-plant feed?**
Start with the county's indexing conventions: instrument-number format, whether it uses book and page, the document-type codes it uses, and how it records legal descriptions (platted lots, section-township-range, or metes and bounds). Build a keying guide with examples of each common document type from that county, configure format validation to the county's patterns, and run a pilot batch with 100% verification to calibrate. Then measure accuracy per field for two weeks before moving to sample-based QC, and record the plant date discipline, meaning how far behind the recorder the posting runs, because that gap is what the examiner must cover with a gap search.

# LEVEL: Expert

## Production operations: workflows, queues, quality & SLA for title production

Title production is a factory whose product is a correct commitment and a correct policy delivered on a date. Running it well means seeing the work as queues with service levels, measuring the right things, and building quality into the process rather than inspecting it in at the end.

### The production pipeline

```text
Order entry  ->  Search (plant / online / abstractor)  ->  Examination  ->  Commitment typed & issued
  ->  Curative (payoffs, releases, probate, corrective deeds)  ->  Clear to close  ->  Closing / funding
  ->  Recording  ->  Policy issuance (jacket, Schedule A/B final)  ->  Policy delivery  ->  Remittance to underwriter
Support loops: rate & fee calculation, endorsement selection, CPL request, lender instruction review, data entry into the production system
```

Each arrow is a queue. Work sits in a queue until someone with the right skill and licence picks it up, and the age of items in each queue is the earliest warning of a missed date.

### Service levels that lenders and agents expect

| Stage | Residential SLA (typical) | Measured from | Common failure cause |
|---|---|---|---|
| Search complete | 24 to 48 hours | Order received | County online outage, abstractor backlog |
| Commitment issued | 48 to 72 hours (24 in competitive markets) | Order received | Exam capacity, complex chain |
| Curative items resolved | Before closing date | Commitment issued | Payoff letters, probate documents |
| Clear to close | 24 hours before closing | Lender's final instructions | Late lender changes |
| Policy issued | 30 days after closing (many underwriter contracts require 30 to 60) | Funding | Recording return delay, missing final documents |
| Remittance to underwriter | Monthly by contract | Policy issued | Reconciliation errors |

Remote production support teams typically own search, exam support, commitment typing, policy typing, rate calculation and data entry, and are held to their own internal SLAs inside the agency's dates.

### Queue design

Skill-based routing beats first-in-first-out. A Texas commitment needs someone who knows T-7 wording; a Florida policy needs someone who knows the Florida modifications; a probate chain needs a senior examiner. The queue model that worked at scale: one intake queue, then per-state queues with a **due-by** timestamp calculated from the SLA, sorted by due-by not by arrival, with a "rush" flag that jumps the sort only with a supervisor's approval so rushes stay rare. Work-in-progress limits (no examiner holds more than eight open files) prevent hoarding.

```excel
' Ageing and SLA columns on the WIP sheet (Received in B, Stage in C, SLA hours per stage in a lookup table)
=B2+VLOOKUP(C2,SLA_Table,2,FALSE)/24                       ' Due-by timestamp
=IF(NOW()>D2,"BREACHED",IF(NOW()>D2-4/24,"AT RISK","OK"))   ' Status with a 4-hour warning window
=COUNTIFS(State,"TX",Status,"BREACHED")                    ' Breaches by state for the daily stand-up
=AVERAGEIFS(CycleHours,Stage,"Commitment",State,"TN")      ' Average commitment cycle time, Tennessee
```

### Quality system

Quality has three layers. **Prevention**: templates with locked Schedule B standard exceptions per state and underwriter, rate tables that cannot be edited at quote time, checklists inside the production system. **Detection**: a second-person review of every commitment before issue on new agents and a sample (10% is common) on experienced ones, 100% review of policies over a dollar threshold set by the underwriter (often $1 million to $2 million, where underwriter approval is needed anyway). **Correction**: an error taxonomy so trends are visible.

| Error class | Examples | Severity |
|---|---|---|
| Coverage | Missed open mortgage, wrong vesting, wrong legal description | Critical (potential claim) |
| Pricing | Wrong tier, missed reissue credit, wrong endorsement fee | Major (refund or under-collection; regulatory in promulgated states) |
| Form | Wrong policy form or endorsement version, missing Florida modification | Major |
| Data | Typo in name spelling, wrong loan number | Minor unless it reaches the policy |
| Process | Late file note, missing lender instruction review | Minor |

First-pass yield (files with zero errors at review) is the single best quality KPI; a team at 92% first-pass yield reworks 8% of its output, which is both cost and delay.

### Capacity planning

Cycle-time data lets you staff by arithmetic. If Tennessee commitments take 55 minutes of examiner time on average and the week's forecast is 420 orders, that is 385 examiner-hours, or about 11 examiners at 35 productive hours. Forecast from the lender pipeline (rate locks, purchase contracts) rather than from last week's count; refinance volume moves with interest rates within days.

> **Tip:** Report ageing as a distribution, not an average. "Average commitment age 31 hours" hides the twelve files at 70 hours that will breach tomorrow; "12 files over 48 hours, oldest 71" tells the supervisor what to do this morning.

### Try It Yourself

```text
Daily production stand-up sheet (one row per state; filled from the WIP table at 08:30)
State  Open  DueToday  AtRisk  Breached  Oldest(h)  FPY(7d)  Notes
TX      142     38        6        1        52       94%     One rush from lender X; T-19 survey pending on 3
TN      211     54       11        3        71       91%     Shelby county site down yesterday; 3 breaches from that
FL       96     22        2        0        39       96%
WY       18      4        0        0        22       100%
CA       64     15        4        0        44       93%     Two probate chains with senior examiner
Actions: reassign 2 TN examiners from CA queue until 14:00; call Shelby recorder for ETA; supervisor to approve rush
```

### Quiz

1. What is the best early warning of a missed SLA?
- [ ] Yesterday's completed count
- [x] The age of items in each queue relative to their due-by time
- [ ] The number of agents online
> Ageing shows breaches before they happen; completed counts show them after.

2. Why sort queues by due-by rather than by arrival?
- [ ] It is simpler
- [x] Different stages and states have different SLAs, so the earliest arrival is not always the most urgent
- [ ] Lenders require it
> A file received later with a 24-hour SLA can be more urgent than one received earlier with 72 hours.

3. Which quality KPI best captures rework cost?
- [ ] Number of reviews performed
- [x] First-pass yield
- [ ] Average cycle time
> Every file below 100% first-pass yield is reworked, adding cost and delay.

4. How should capacity be forecast for next week?
- [ ] From last week's completed volume
- [x] From the lender pipeline and average handling time per stage and state
- [ ] From headcount
> Refinance volume tracks interest rates; the pipeline leads, last week lags.

### Exercises

1. **Staff it** — Florida commitments take 40 minutes of examiner time, Texas 65 minutes. Forecast: 300 FL and 250 TX orders next week. Examiners have 34 productive hours. How many examiners per state?
<details><summary>Solution</summary>

```text
FL: 300 x 40 / 60 = 200 hours -> 200 / 34 = 5.9 -> 6 examiners
TX: 250 x 65 / 60 = 270.8 hours -> 270.8 / 34 = 8.0 -> 8 examiners (9 if you want 10% headroom for rushes)
```

</details>

2. **Error taxonomy** — Classify these findings: (a) ALTA 9 charged at $25 in a state where it is 10% of premium, (b) Schedule A vesting shows "John A Smith" for "John A. Smith Jr.", (c) a 2019 deed of trust not listed in Schedule B.
<details><summary>Solution</summary>

```text
(a) Pricing / Major: under-collection and, in a promulgated state, a regulatory issue
(b) Coverage / Critical if it changes the insured party (Jr. vs Sr. are different people); Data / Minor if purely punctuation
(c) Coverage / Critical: missed open lien, the policy would insure over it
```

</details>

### Interview Questions

**Q: How would you run a multi-state production support team to hit SLAs?**
I would model every stage as a queue with a due-by time computed from the state and stage SLA, route work by skill and licence rather than round-robin, cap work in progress per examiner, and run a daily stand-up on ageing by state with the oldest file and the at-risk count. Quality would be built in with locked templates and rate tables, second-person review at 100% for new staff and a sample for experienced staff, and an error taxonomy that separates coverage errors from pricing and data errors. Capacity would be planned weekly from the lender pipeline multiplied by measured handling time per state. At Stewart the weekly status report was the instrument that made all of this visible to management: volumes, SLA attainment, first-pass yield and risks by state.

**Q: A lender complains that commitments are late. How do you diagnose it?**
Pull the cycle-time distribution by stage for that lender's files and compare it with the team average, because "late" is usually one stage, not the whole pipeline. Common findings are a county whose online records were down, orders arriving without the information needed to start (missing legal description or borrower names), exam capacity in one state, or the lender's own late changes restarting the clock. I would report the finding with numbers, fix the stage (reassign examiners, escalate the county issue, change the intake form), and agree with the lender how the SLA clock is measured so both sides count the same way.

**Q: What is first-pass yield and why do you prefer it to error counts?**
First-pass yield is the share of files that pass review with zero findings on the first attempt. Error counts rise with volume and with how hard the reviewer looks, so they are not comparable across weeks or teams; first-pass yield is a rate, is easy to trend, and directly measures rework, since every file below it is touched twice. Paired with an error taxonomy it also says what kind of training is needed: a team at 95% first-pass yield whose failures are all pricing errors needs a locked rate tool, not more examiners.

## Fraud, claims & risk (wire fraud, forged deeds)

Title insurance exists because the public record can be wrong, and increasingly because people lie to it. A production team is the first line of defence: the patterns below are what examiners, closers and support staff are trained to notice.

### Wire fraud and business email compromise

The most expensive fraud in the industry is not a title defect at all. Criminals compromise or spoof an email account belonging to a party in the transaction (agent, lender, attorney, buyer) and send "updated wiring instructions" days before closing. The buyer wires the down payment to the criminal's account; the money is gone within hours. Defences that have become standard:

- Wire instructions are delivered once, in person or through a secured portal, and **never changed by email**; any change request is verified by a phone call to a number already on file, not one in the email.
- Outgoing wires (payoffs, seller proceeds) are verified by call-back to the payee at a known number, and payoff statements obtained directly from the lender's portal.
- Two-person approval on every outgoing wire over a threshold; daily three-way reconciliation of the escrow account (bank, book, trial balance) so a diverted wire is caught the same day.
- Positive pay with the bank, and secure email or a closing portal for anything containing account numbers.

### Forged deeds and seller impersonation

The second pattern is a fake seller. A criminal finds a vacant lot or a mortgage-free property with an out-of-area owner, impersonates the owner with forged identification, lists it below market for a quick cash sale, and signs at a remote notary. The forged deed is void, so the buyer's owner's policy pays, and the underwriter absorbs the loss. Red flags production and closing staff are trained on:

| Signal | Why it matters |
|---|---|
| Vacant land or unencumbered property, owner's mailing address far away | Ideal target: no lender scrutiny, owner will not notice |
| Seller refuses in-person signing, insists on their own notary, or wants a remote notary the agency does not know | Identity cannot be controlled |
| Price well below market and pressure for a fast cash close | Speed prevents verification |
| Proceeds to be wired to a third party or a new account, or to a foreign bank | Diversion |
| Seller's ID address does not match the tax-bill mailing address; signature differs from recorded deeds | Impersonation |

Controls: compare the signature on the deed in the chain with the seller's new signature, send a letter to the owner's mailing address of record, verify identity through a knowledge-based or credential-analysis service, and require signing with a notary the agency selects.

### Other fraud and defect patterns

Fraudulent releases (a forged satisfaction of mortgage recorded so a property looks free and clear), straw-buyer flips with inflated appraisals, undisclosed liens the seller hides, and deed theft against elderly owners. Examiners flag a release that was recorded shortly before a sale, a release from a lender that no longer exists, or a chain with several transfers within months at rising prices.

### How a claim runs

```text
Claim notice from insured (letter or claim form)  ->  Underwriter claims counsel opens file, sets a reserve
  ->  Coverage analysis: is the loss within the policy date, insuring provisions and not excluded?
  ->  Options: defend title (litigation), cure the defect (obtain a release or corrective deed), pay the loss, or deny with reasons
  ->  Agent audit: was the search, exam and closing done to underwriting standards? (agent may be liable to the underwriter under its agency agreement)
  ->  Recovery: subrogation against the responsible party (forger, prior lender, negligent abstractor)
```

Title insurers' loss ratios run around 4% to 6% of premium in normal years, far below other lines, because the premium mostly funds prevention. Claims spike two to four years after a real-estate boom, when defects created in the rush surface.

### Closing protection letters and agent risk

A **closing protection letter (CPL)** is the underwriter's promise to the lender (and in some states the buyer) that it will cover losses caused by the closing agent's fraud or failure to follow written closing instructions, within limits. Lenders require a CPL before funding, so production teams request it per file through the underwriter's portal or API. The underwriter's exposure under CPLs is why agents are audited: escrow reconciliations, licences, the agent's own fraud controls, and the **ALTA Best Practices** framework (seven pillars: licensing, escrow controls, privacy and information security, settlement procedures, policy production and remittance, insurance coverage, consumer complaints).

### Risk for the production team

Production support rarely holds money, but it handles data that enables fraud: borrower names, loan numbers, account details in payoff letters. Least-privilege access, no personal email, masked account numbers in reports, and audit logs are contract conditions with US agencies, and a breach ends the contract.

> **Warning:** The email that says "our bank changed, here are the new wire instructions" is the single most dangerous message in real estate. Every closing staff member should know that the answer is a phone call to a known number, never a reply.

### Try It Yourself

```text
Seller-impersonation screening checklist (run before a cash sale of vacant or unencumbered property)
[ ] Owner mailing address on tax roll vs address on seller's ID vs address on purchase contract
[ ] Signature comparison: vesting deed in chain vs seller's signed listing agreement or ID
[ ] Letter mailed to owner of record at tax-roll address confirming the sale
[ ] Identity verified by credential analysis (ID scan) and knowledge-based questions, or in-person notary selected by agency
[ ] Proceeds payee = seller of record; payee account verified by call-back to a number obtained independently
[ ] Price vs county assessed value and recent sales; pressure for speed noted
Any two red flags -> escalate to underwriter before closing; underwriter may require in-person signing or decline
```

### Quiz

1. What is the correct response to an email changing wire instructions two days before closing?
- [ ] Reply asking for confirmation
- [x] Call a known phone number on file to verify; never act on the email
- [ ] Wire a small test amount first
> The sending account may be compromised or spoofed; only an out-of-band call is trustworthy.

2. Which property profile is most targeted by seller impersonation?
- [x] Vacant or mortgage-free property with an out-of-area owner
- [ ] A newly built house with a large mortgage
- [ ] A condominium with an HOA
> No lender scrutiny and an absent owner make the scam hard to detect before closing.

3. What does a closing protection letter cover?
- [ ] Defects in the title
- [x] Loss caused by the closing agent's fraud or failure to follow the lender's written instructions
- [ ] Recording fees
> CPLs address closing risk, which the policy itself does not cover.

4. Why do title claims rise a few years after a boom?
- [ ] Policies expire
- [x] Defects created during high-volume rushes surface when properties are resold or refinanced
- [ ] Underwriters raise rates
> Claims lag the transaction that caused the defect.

### Exercises

1. **Escrow control design** — List the controls on an escrow account that catch a diverted wire the same day.
<details><summary>Solution</summary>

```text
Daily three-way reconciliation (bank statement, escrow ledger, file trial balance) by someone who cannot initiate wires
Two-person approval on outgoing wires; call-back verification of payee account at an independently obtained number
Positive pay and ACH debit block on the escrow account; wire instructions locked per file after first delivery
Exception report: any wire to an account first used in the last 30 days, or to a payee not on the settlement statement
```

</details>

2. **Classify the claim** — A buyer discovers, 18 months after closing, that the seller's deed to them was signed by an impostor. Which policy pays, what does the underwriter do, and who might it pursue?
<details><summary>Solution</summary>

```text
The buyer's owner's policy: forgery and impersonation are covered risks and the defect predates the policy date.
The underwriter sets a reserve, investigates, and either quiets title (rarely possible against a void deed), pays the
insured's loss up to the policy amount, or negotiates with the true owner. The lender's loan policy also responds for
the lender. Recovery: subrogation against the impostor (usually uncollectable) and the notary or agent if their
verification failed standards; the agent's audit examines the identity checks it performed.
```

</details>

### Interview Questions

**Q: What are the two biggest fraud risks in a title and escrow operation and how do you control them?**
Wire fraud through business email compromise and seller impersonation with forged deeds. Wire fraud is controlled by process: wire instructions delivered once through a secure channel, no changes accepted by email, call-back verification at known numbers for every outgoing wire, two-person approval, positive pay and daily three-way reconciliation so a diversion is caught the same day. Seller impersonation is controlled by examination and identity checks: flagging vacant or unencumbered property with absent owners, comparing signatures with recorded deeds, mailing the owner of record, verifying identity with credential analysis and using a notary the agency selects. Both rely on staff who treat urgency and pressure as red flags rather than reasons to skip a step.

**Q: Explain a closing protection letter and why lenders require it.**
A CPL is the underwriter's undertaking to the lender, and in some states the buyer, to reimburse loss caused by the closing agent's fraud, dishonesty or failure to comply with the lender's written closing instructions, up to the loan amount and subject to conditions. The loan policy insures the title, not the closing, so without a CPL a lender that funds through an agent who absconds with the money has a policy on a lien that may never attach; the CPL fills that gap. Because it exposes the underwriter to the agent's conduct, underwriters audit agents' escrow accounts and controls and can decline to issue CPLs for an agent, which effectively shuts the agent out of lender business.

**Q: Why are title insurance loss ratios so low and what does that imply about production quality?**
Loss ratios sit around 4% to 6% of premium because the product is preventive: most of the premium pays for the search, examination and curative work that removes defects before the policy is issued, whereas casualty lines pay out on events they cannot prevent. The implication is that production is the risk-management function. A missed lien or an unverified identity in production is a direct claim, so quality metrics like first-pass yield and 100% verification of open-lien status are underwriting controls, not just operational niceties, and underwriters price agent relationships partly on claims experience attributable to the agent's work.

## Technology (title plants, e-recording, RON, APIs)

The title industry runs on a small number of production systems, a handful of data vendors, and a growing set of standards that let lenders, agents, underwriters and counties exchange documents electronically. A production analyst who understands the plumbing can automate what others retype.

### The production system

Agencies run a **title production system** that holds the order, parties, property, commitment, settlement statement, policies and escrow ledger: SoftPro, RamQuest, ResWare, Qualia and underwriter-provided systems (AIM+ at Stewart, for example) are the common names. Everything a support team types goes into one of these, and every report starts from their exports. Two things matter for a data analyst: the **export format** (most offer CSV/Excel reports, ODBC or SQL access, and increasingly REST APIs) and the **document generation engine** (Word templates with merge fields or built-in forms), which is where document-automation skills apply directly.

### Title plants and data vendors

Modern plants are databases fed by daily recorder images with indexing done by vendors or offshore teams. National data vendors (DataTrace, First American's DataTree, CoreLogic, Black Knight's Data & Analytics) provide online plants and property data through web portals and APIs, which is how a remote examiner searches a county in a state they have never visited. Coverage varies by county; the examiner's job includes knowing where the vendor plant ends and a local abstractor begins.

### E-recording

**Electronic recording** submits documents to the county recorder through a vendor (Simplifile, CSC eRecording, ePN) that transmits the image and index data and returns the recording stamp within minutes to hours. PRIA (Property Records Industry Association) defines the standards and three levels: Level 1 (scanned paper images with index data), Level 2 (electronically signed images plus data), Level 3 (fully electronic documents where data and document are one XML file). Most US counties accept e-recording; the remaining paper counties are why "recording return" is still a queue. For production, e-recording means the recorded deed and mortgage come back the same day, so policies can be issued days earlier and gap risk shrinks.

### Remote online notarization and eClosing

**RON** lets a notary commissioned for it notarise over audio-video with identity verification (credential analysis plus knowledge-based authentication), recording the session. Virginia's 2012 law started it; most states now have RON statutes, with MISMO's RON standards defining the process and the SECURE Notarization Act proposing a federal floor. An **eClosing** ranges from hybrid (borrower e-signs disclosures, wet-signs the note and deed) to full (eNote registered on the MERS eRegistry, deed of trust e-notarised and e-recorded). For a title agency the operational questions are which underwriters accept RON in which states, which platforms (Notarize, DocVerify, Pavaso, Snapdocs and the production system's own module) the lender uses, and how the recorded electronic document flows back into the file.

### APIs the support team touches

| Integration | What it does | Typical protocol |
|---|---|---|
| Underwriter portal/API (CPL and jacket) | Requests a closing protection letter and policy jacket, returns a numbered PDF | REST/JSON or the underwriter's web service; MISMO-style fields |
| Rate API | Returns premium and endorsement charges for a state, underwriter and amounts | REST; often the underwriter's own calculator |
| Lender integration | Receives the order, sends fees and the commitment; Encompass and other LOS platforms connect through partner networks | XML/JSON; MISMO 3.x for closing data (UCD) |
| E-recording vendor | Submits documents, returns recording data | Vendor API or portal |
| Data vendor | Property, tax and document search | REST; per-search billing |

MISMO (Mortgage Industry Standards Maintenance Organization) is the vocabulary: the **Uniform Closing Dataset** describes every fee on the Closing Disclosure in XML, so title fees flow into the lender's disclosure without retyping. An analyst who can read a MISMO XML and map it to the settlement statement is unusually valuable.

```javascript
// Mapping an itemised quote into the fee names lenders expect (Closing Disclosure section B/C style)
const quote = [
  { item: "Owner's policy", amount: 1825.00 },
  { item: "Loan policy (simultaneous)", amount: 25.00 },
  { item: "Endorsement ALTA 8.1", amount: 0 },
  { item: "Endorsement ALTA 9", amount: 182.50 },
  { item: "Settlement fee", amount: 495.00 },
];
const cdNames = {
  "Owner's policy": "Title - Owner's Title Policy (optional)",
  "Loan policy (simultaneous)": "Title - Lender's Title Policy",
  "Settlement fee": "Title - Settlement Agent Fee",
};
const lines = quote.map(q => ({
  cdLabel: cdNames[q.item] || `Title - ${q.item}`,
  amount: q.amount.toFixed(2),
}));
console.log(lines);
// Note: TRID requires the lender's policy shown at full (non-simultaneous) rate and the owner's at the
// simultaneous-adjusted figure on the CD in states with simultaneous rates; keep both numbers available.
```

That last comment is a real trap: the CFPB's TRID rule dictates how simultaneous-issue pricing is disclosed (the lender's policy at the full rate and the owner's policy reduced accordingly), which differs from how the state rate and the settlement statement present it. Systems keep both the "rate" view and the "TRID" view.

### Automation opportunities

Repetitive production tasks that scripts remove: keying lender orders from email attachments into the production system (parse the PDF or XML, post through the API), generating commitments from search data with templated Schedule B exceptions per state, calculating rates and endorsements, requesting CPLs in bulk, reconciling recording returns to files, and building the weekly status report from system exports instead of by hand. Each of these was a spreadsheet or a Python script before it was a feature.

> **Interview note:** Questions about technology in a title interview are really questions about whether you can work inside the agency's stack. Name the production system you know, say how you got data out of it (exports, ODBC, API), and give one automation you built on top of it, with the hours it saved.

### Try It Yourself

```text
Integration map for a mid-size multi-state agency (what the support analyst must know for each)
Lender LOS (Encompass) --order--> Production system (SoftPro/Qualia) --CPL/jacket--> Underwriter API
                                        |                                   ^
                            --rate call-+-> Rate engine (state tables)      |
                            --search---> Data vendor plant (DataTrace/DataTree) / local abstractor
                            --docs-----> Word templates (commitment, policy, letters) via merge fields
                            --closing--> eClosing platform (RON notary, eNote to MERS eRegistry)
                            --record---> E-recording vendor (Simplifile/CSC) --stamp--> back to file
                            --fees-----> MISMO UCD XML to lender's Closing Disclosure
Exports for reporting: nightly CSV of orders, stages, timestamps, state, underwriter, premium -> Excel/Power BI
```

### Quiz

1. What does PRIA Level 3 e-recording mean?
- [ ] A scanned paper document with index data
- [x] A fully electronic document where the data and document are one XML file
- [ ] Recording by fax
> Level 1 is image plus data; Level 2 adds electronic signatures; Level 3 is data-native.

2. Which identity checks does RON typically require?
- [x] Credential analysis of the ID plus knowledge-based authentication, over recorded audio-video
- [ ] A selfie only
- [ ] A witness in the room
> State RON statutes and MISMO standards define these steps.

3. What is the MISMO Uniform Closing Dataset used for?
- [ ] Recording deeds
- [x] Exchanging Closing Disclosure fee data between title and lender systems in XML
- [ ] Rate filings
> UCD lets title fees flow into the lender's disclosure without retyping.

4. How does TRID disclosure of a simultaneous-issue loan policy differ from the state rate?
- [ ] It does not
- [x] The lender's policy is shown at the full rate and the owner's policy is reduced by the difference
- [ ] Only the total is shown
> Systems must keep both the rate view and the TRID view.

### Exercises

1. **Automate CPL requests** — Describe the steps of a script that requests closing protection letters for every file scheduled to close in the next three business days.
<details><summary>Solution</summary>

```text
1. Export from the production system: files with closing date in [today, today+3 business days] and CPL status empty
2. For each: gather lender name and address, loan amount, property, borrower names, closing agent (fields the underwriter API requires)
3. Call the underwriter's CPL endpoint; store the returned CPL number and PDF against the file; log errors (missing lender ID, unlicensed agent)
4. Post status back to the production system; email the closer a summary of successes and failures
5. Run daily at 07:00; alert if any file within 24 hours of closing still lacks a CPL
```

</details>

2. **Choose e-recording** — A county still accepts paper only. What changes in the production timeline and what do you tell the lender?
<details><summary>Solution</summary>

```text
Recording happens by courier or mail; recording return (stamped copies) can take days to weeks. The policy cannot be
finalised with recording data until return, so the policy-issuance SLA is at risk; the gap between closing and recording
is covered by the commitment's gap provision or gap coverage. Tell the lender the expected recording date, that the
insured mortgage is protected for the gap, and set a follow-up task to chase the recorder.
```

</details>

### Interview Questions

**Q: Which title production systems have you worked with and how did you get data out of them?**
I have worked with underwriter-hosted and agency systems in a support role, where my job was data, rates and reporting rather than closing. Data came out through scheduled report exports to CSV and Excel, which I cleaned and loaded into a reporting workbook and later Power BI, and through the system's document templates, which I maintained in Word with merge fields. When an API was available I used it for read-only pulls of order status and timestamps to feed the weekly status report. The principle I follow is to never hand-key what the system already knows: if a report needs a field, the export includes it, and if the export cannot, that is a request to the system administrator rather than a manual workaround.

**Q: What is remote online notarization and what should a title agency check before using it?**
RON is notarisation over a recorded audio-video session by a notary commissioned for remote work, with the signer's identity verified by credential analysis of their ID and knowledge-based authentication, and the notarial act performed electronically on the document. Before using it the agency checks that the property state permits RON and, if not, whether it recognises out-of-state RON notarisations; that the underwriter accepts RON for the document types in question; that the lender's eClosing platform and the county's e-recording accept the resulting electronic document; and that the session recording and audit trail are retained for the statutory period. It is fast and fraud-resistant when the identity checks are real, but a RON platform chosen by a seller is itself a red flag in impersonation cases.

**Q: Describe an automation you built for title production and its impact.**
Rate calculation was manual and error-prone across states, so I built a calculator on versioned rate tables that produced itemised premiums and endorsement charges per underwriter with the band-by-band working, plus a comparison view. It replaced per-file manual lookups and reduced pricing errors found in review to near zero, and the same tables fed the weekly report's premium figures so management numbers matched what closers charged. The lesson I took is that the tables, their validation and their change control were the product; the arithmetic was the easy part.

## Reporting to management: weekly status reports for multi-state production

Management does not read the production system. It reads the weekly status report, and that report decides staffing, lender conversations and whether the support team keeps its contract. This chapter is the report I produced at Stewart for multi-state production support, generalised so you can build it from any system's exports.

### What the report must answer

1. **Volume**: how much came in, how much went out, how much is open, by state and by stage.
2. **Service**: did we meet SLAs, where did we breach, and why.
3. **Quality**: first-pass yield, error classes, anything that reached a lender or an underwriter.
4. **Risk**: what threatens next week (county outages, capacity gaps, lender rushes, rate refilings).
5. **Asks**: decisions or resources needed from management, stated plainly.

Five sections, one page for the summary, appendices for detail. If a reader cannot get the state of the operation from the first ten lines, the report has failed.

### The one-page layout

```text
WEEKLY PRODUCTION STATUS  -  Week 37 (7-13 Sep 2026)  -  Multi-state support team (TX, TN, FL, WY, CA)
HEADLINES
  Received 1,284 (+6% WoW)  |  Completed 1,251  |  Open WIP 611 (+33)  |  SLA attainment 96.1% (target 95%)
  First-pass yield 93.4% (target 95%)  |  Breaches 49, 31 of them TN (Shelby County site outage Tue-Wed)
  Risk: FL refinance forecast +18% next week; one TN examiner on leave; underwriter B TN refiling effective 1 Oct
BY STATE
  State  Recv  Done  Open  Oldest(h)  SLA%   FPY%   Premium quoted ($)   Note
  TX      412   405   188     58      97.8   95.2     612,400           T-19 survey holds: 7 files
  TN      386   361   214     71      91.2   90.1     404,900           Shelby outage; 31 breaches
  FL      281   279   121     44      98.6   94.6     388,250           refi surge starting
  WY       48    50    19     30     100.0   98.0      41,300
  CA      157   156    69     47      97.5   93.7     226,800           2 probate chains escalated
ACTIONS AGREED / REQUESTED
  1. Approve 2 temporary TN examiners for 3 weeks (cost X) to clear backlog by 20 Sep
  2. Lender Y to confirm rush policy; 14 rushes this week vs 5 average
  3. Rate matrix TN v2026-10-01 in validation; publish by 25 Sep
```

### Building it from exports

The source is a nightly export of orders with timestamps per stage, state, underwriter, lender, product, premium and review results. From that one table every number above is a formula, which is what makes the report reproducible and defensible.

```excel
' Data in Table "orders": ReceivedAt, CompletedAt, State, Stage, DueBy, SLA_Met (TRUE/FALSE), FPY (TRUE/FALSE), Premium
' Week boundaries in cells: WkStart (Monday 00:00), WkEnd (next Monday 00:00)
=COUNTIFS(orders[ReceivedAt],">="&WkStart,orders[ReceivedAt],"<"&WkEnd,orders[State],"TN")                ' Received TN
=COUNTIFS(orders[CompletedAt],">="&WkStart,orders[CompletedAt],"<"&WkEnd,orders[State],"TN")              ' Completed TN
=COUNTIFS(orders[State],"TN",orders[CompletedAt],"")                                                      ' Open WIP TN
=(NOW()-MINIFS(orders[ReceivedAt],orders[State],"TN",orders[CompletedAt],""))*24                          ' Oldest open, hours
=COUNTIFS(orders[CompletedAt],">="&WkStart,orders[CompletedAt],"<"&WkEnd,orders[State],"TN",orders[SLA_Met],TRUE)
   /COUNTIFS(orders[CompletedAt],">="&WkStart,orders[CompletedAt],"<"&WkEnd,orders[State],"TN")           ' SLA attainment TN
=SUMIFS(orders[Premium],orders[CompletedAt],">="&WkStart,orders[CompletedAt],"<"&WkEnd,orders[State],"TN") ' Premium quoted TN
=COUNTIFS(orders[ReceivedAt],">="&WkStart-7,orders[ReceivedAt],"<"&WkStart)                                ' Prior week for WoW
```

Week-over-week deltas, targets and conditional formatting (red below target, amber within two points) turn the table into something a director scans in a minute. In Power BI the same table becomes a matrix visual with state on rows and measures as columns, a line chart of SLA attainment by week, and slicers for state and lender; the weekly PDF export replaces the manual sheet.

### Writing the narrative

Numbers explain what; the narrative explains why and what next. Three rules that kept my reports read:

- **Attribute every breach.** "31 of 49 breaches were TN files delayed by the Shelby County recorder outage on Tuesday and Wednesday; excluding those, TN attainment was 97.4%." Management can act on a cause; it cannot act on a percentage.
- **Forecast, do not just report.** Volume next week from the lender pipeline, capacity next week from the roster, and the gap between them, with the ask stated in people or hours.
- **Close the loop.** Last week's actions with their status at the top of this week's report. An action list that is never revisited trains readers to ignore it.

### Distribution and cadence

Weekly to the operations director and state managers on Monday morning, with a daily one-line stand-up summary during incidents. Monthly, the same data rolls into a management pack with trend charts, quality by error class, and premium by underwriter, which is what the underwriter relationship managers use. Keep every weekly file; auditors and lenders ask for history, and trend questions ("was TN always slower?") need it.

> **Tip:** Publish the report from a saved workbook or Power BI model that reads the export, never from a copy-pasted sheet. When a number is questioned, you can trace it to rows in seconds, and next week's report takes twenty minutes instead of a morning.

### Try It Yourself

```excel
' Weekly SLA attainment trend table for a line chart: WeekStart in A2:A14, State in B1:F1
' Cell B2 (copy across and down); orders table as above
=IFERROR(COUNTIFS(orders[CompletedAt],">="&$A2,orders[CompletedAt],"<"&$A2+7,orders[State],B$1,orders[SLA_Met],TRUE)
        /COUNTIFS(orders[CompletedAt],">="&$A2,orders[CompletedAt],"<"&$A2+7,orders[State],B$1),"")
' Conditional formatting rule on B2:F14: cell value < 0.95 -> red fill; between 0.95 and 0.97 -> amber
' Headline WoW delta for received volume:
=TEXT((COUNTIFS(orders[ReceivedAt],">="&WkStart,orders[ReceivedAt],"<"&WkEnd)
      /COUNTIFS(orders[ReceivedAt],">="&WkStart-7,orders[ReceivedAt],"<"&WkStart))-1,"+0%;-0%")
```

### Quiz

1. What should the first ten lines of a weekly production report contain?
- [ ] The full file list
- [x] Headline volume, SLA, quality and risk figures with targets and week-over-week change
- [ ] The methodology
> Readers decide in seconds whether to read on; lead with the state of the operation.

2. Why attribute breaches to causes in the narrative?
- [x] Management can act on a cause but not on a percentage
- [ ] It makes the report longer
- [ ] Auditors require it
> "31 breaches from a county outage" leads to an action; "91% attainment" leads to a question.

3. Which source should the report be built from?
- [ ] Numbers emailed by each state lead
- [x] A system export of orders with timestamps, computed by formulas or a BI model
- [ ] Last week's report edited by hand
> Reproducibility lets you trace any number to rows and rebuild the report quickly.

4. What belongs in the actions section?
- [ ] A list of every task done this week
- [x] Decisions or resources needed from management, with last week's actions and their status
- [ ] Individual agent performance
> Actions close the loop and make the report an instrument, not a record.

### Exercises

1. **Write the narrative** — TN attainment fell to 91.2% because of a two-day county outage; FL refinances are forecast up 18%; one TN examiner is on leave for three weeks. Write the risk and ask paragraph.
<details><summary>Solution</summary>

```text
TN attainment of 91.2% reflects 31 breaches caused by the Shelby County recorder outage on 9-10 Sep; excluding those,
TN attained 97.4%. The 214-file TN backlog will not clear at current capacity with one examiner on leave until 4 Oct.
FL refinance intake is forecast up 18% next week from the lender pipeline. Ask: approve two temporary TN examiners for
three weeks and authorise cross-training of one CA examiner on FL refinance files by 18 Sep.
```

</details>

2. **Design the export** — List the columns the nightly export must include for the report to be fully formula-driven.
<details><summary>Solution</summary>

```text
FileNo, State, County, Underwriter, Lender, Product, Transaction, ReceivedAt, SearchDoneAt, CommitmentAt,
ClearToCloseAt, ClosedAt, RecordedAt, PolicyIssuedAt, CompletedAt, Stage (current), DueBy, SLA_Met, Rush (Y/N),
ReviewResult (pass/fail), ErrorClass, Premium, EndorsementTotal, AssignedTo, Notes
```

</details>

### Interview Questions

**Q: Describe the weekly status report you produced and how management used it.**
It was a one-page summary with appendices covering multi-state production support: volumes received, completed and open by state, oldest open file, SLA attainment against a 95% target, first-pass yield, premium quoted, and a narrative of causes, risks and asks, with last week's actions and their status at the top. It was built from a nightly export with COUNTIFS, SUMIFS and MINIFS formulas and later a Power BI model, so every figure traced to rows. Management used it on Monday mornings to move examiners between states, to approve temporary staff, and in lender calls to explain breaches with causes; the underwriter relationship team used the monthly roll-up for premium by underwriter. Its real value was consistency: the same definitions every week made trends believable.

**Q: A director says your SLA number is wrong because the lender counts differently. What do you do?**
First, agree the definition, because the disagreement is almost always about when the clock starts and stops: we measured from complete order receipt to commitment issued, and the lender measured from its order date, which included a day when the order lacked the legal description. I would show both measures side by side in the report, note the definition used for each, and propose the intake fix that removes the difference, such as an order-completeness check with a timestamp the lender can see. Reports should carry the definition of every metric in a footnote; it prevents this argument from recurring.

**Q: How do you keep a weekly report from becoming stale or ignored?**
Lead with what changed and why, keep the summary to one page, tie every risk to a concrete ask, and revisit last week's actions at the top so readers see that the report drives decisions. Automate the numbers so the time goes into the narrative rather than into copying cells, and review the metric set quarterly with the readers: when a number has not changed a decision in three months, drop it or move it to the appendix. Finally, be honest in it; a report that only carries good news is the one people stop reading.

## Title-insurance interview questions

Interviewing for a title-production, title-search or title-data role means proving two things at once: that you understand the domain (what a policy is, how a search works, why exceptions matter) and that you can turn that understanding into reliable production work and reporting. This chapter gathers the questions that come up for these roles, with the answers a strong candidate gives, drawing on real production experience.

### What title interviews test

| They ask about | They are checking |
|---|---|
| Owner's vs lender's policy | Do you understand what the product actually insures? |
| The search and examination process | Can you follow the chain of title and spot defects? |
| Schedule B exceptions | Do you understand what is and is not covered? |
| Rate calculation | Can you apply filed rates, simultaneous issue, reissue correctly? |
| Production quality and SLA | Can you hit targets and accuracy under a deadline? |
| Fraud and risk | Are you alert to wire fraud and forged instruments? |

### Domain plus production, together

The strongest candidates connect the domain to the work. Knowing that a lender's policy protects the loan is knowledge; explaining how you built a rate matrix that harmonised six underwriters' zones so production could quote consistently is knowledge applied. Interviewers for BSS/production roles especially want the second kind.

### Handling "you don't have a US real-estate background"

A common concern for offshore production analysts is not having closed US transactions personally. The answer is to show that you have worked the data and the process rigorously — title-search data processing, rate matrices, weekly multi-state reporting — and that you understand the domain well enough to catch errors. Domain fluency plus production discipline beats transactional experience for a back-office data role.

> **Interview note:** Always tie a domain answer to something you did. "Reissue rates give a discount on a refinance when a prior policy exists" is fine; "...which is why our rate calculator asked for the prior policy date and applied the reissue tier automatically" is what gets the offer.

### Try It Yourself

```text
Build your title-role story bank (one specific example each)

  [ ] Explain owner's vs lender's policy in 30 seconds, plainly
  [ ] Walk through a title search: chain of title -> defects -> commitment
  [ ] Describe a Schedule B exception you understand and why it matters
  [ ] Tell the rate-calculator story: policy types, competitor comparison, Excel export
  [ ] Tell the combined-rate-matrix story: 3,346 rows, six underwriters, zone harmonisation
  [ ] Describe how you hit a 100% daily target with accuracy under SLA
  [ ] Name one fraud risk (wire fraud) and how production guards against it
```

### Quiz

1. A title interview for a production/data role is testing:
- [x] Domain understanding AND the ability to turn it into reliable production/reporting
- [ ] Only textbook definitions
- [ ] Only typing speed
> These roles want both the domain (policies, search, exceptions, rates) and applied production discipline.

2. The strongest way to answer a domain question is to:
- [x] Give the definition and tie it to something you actually did
- [ ] Recite the definition only
- [ ] Say you would look it up
> Connecting "reissue rates" to a calculator you built that applied them is what distinguishes a strong candidate.

3. For an offshore analyst without US closing experience, the best framing is:
- [x] Deep work with the data and process plus domain fluency to catch errors
- [ ] Apologising for the gap repeatedly
- [ ] Claiming closing experience you don't have
> A back-office data role values production rigour and domain understanding over personal transactional experience.

4. Interviewers raise fraud (e.g. wire fraud) to check whether you:
- [x] Are alert to real production risks and how the process guards against them
- [ ] Have memorised statutes
- [ ] Can draw a house
> They want awareness of practical risks like wire fraud and forged deeds, and the controls that mitigate them.

### Exercises

1. **Answer plainly** — In two sentences, explain owner's vs lender's title insurance to a non-expert interviewer.
<details><summary>Solution</summary>

An owner's policy protects the buyer's ownership stake in the property for as long as they own it, against title defects like undisclosed liens or forged prior deeds. A lender's policy protects the mortgage lender's interest up to the loan amount and is usually required by the lender; a buyer often pays for both, sometimes at a discount when issued together (simultaneous issue).

</details>

2. **Tell the applied story** — Draft two sentences that turn "I understand rate structures" into evidence.
<details><summary>Solution</summary>

"I built a rate calculator covering six policy types with competitor comparison and Excel export, so production could quote instantly instead of by hand. I also compiled a 3,346-row combined rate matrix across six underwriters, harmonising their different zone definitions into one comparable table, which became the standard for multi-underwriter comparison."

</details>

### Interview Questions

**Q: Explain the difference between an owner's and a lender's title policy, and who pays for each.**
An owner's policy protects the buyer's equity in the property against title defects — undisclosed liens, forged prior deeds, recording errors — for as long as they own it, up to the purchase price. A lender's policy protects the mortgage lender's security interest up to the outstanding loan balance and decreases as the loan is paid down; lenders almost always require it. Who pays varies by state and custom, but the buyer frequently pays for both, and when the two are issued together the second comes at a reduced simultaneous-issue rate rather than full price. The key distinction I keep clear is that the two policies protect different parties and different amounts, which is exactly what the rate calculation has to reflect.

**Q: Walk me through what happens in a title search and examination.**
The search assembles the chain of title by pulling the recorded history of the property from the public records — deeds, mortgages, liens, judgments, easements — usually via a title plant or county indexes, back through the required search period. The examination then analyses that chain to confirm the seller can convey clear title and to find defects: gaps in the chain, open mortgages, tax or judgment liens, easements, or discrepancies in names and legal descriptions. Anything found becomes a requirement to clear before closing or an exception on Schedule B of the commitment, which tells the insured what the policy will not cover. In a production setting, the discipline is doing this consistently and accurately at volume, which is where quality checks and clear data standards matter as much as the legal knowledge.

**Q: How would your production and data experience transfer to a US title role even without personally closing transactions?**
My experience is exactly the back-office production and data side these roles run on. I have processed title-search data at volume on an international project, built a rate calculator across six policy types with competitor comparison, and compiled a 3,346-row combined rate matrix that harmonised six underwriters' zone definitions into one comparable table. I prepare weekly status reports consolidating multi-state production into management-ready reporting, and I run the quality checks and SLA discipline that keep accuracy high under daily targets. I understand the domain — policies, search, exceptions, rate structures — well enough to catch errors in the data, which is what a production role needs. Not having personally sat at a closing table matters far less for a data and reporting role than proven rigour with the process and the numbers.

**Q: What fraud and risk issues are you aware of in title and closing, and how does the process guard against them?**
The prominent ones are wire fraud, where a criminal spoofs closing instructions to divert funds, and forged or fraudulent instruments such as a forged deed or a release of a lien that was never actually paid. Title insurance itself protects against many recorded defects, but wire fraud in particular is a process risk at closing that insurance may not cover, so the defences are procedural: verified call-backs on wiring instructions, secure communication, identity verification, and never acting on changed payment details from an email alone. On the production and data side, the guard is accuracy and consistency — a rigorous search, careful examination, and quality checks — because a missed lien or a mis-keyed name is how defects slip through. Being visibly alert to these risks is part of what a title employer is listening for.
