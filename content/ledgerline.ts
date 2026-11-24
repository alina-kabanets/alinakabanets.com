// Content for the Ledgerline concept page: the design-process material from
// the project's deck, kept as data so the page can draw it in code.

export const phases = [
  {
    name: "Discover",
    mode: "Diverge",
    items: ["Product pages, demo videos, competitors and domain reading", "Every form a receipt takes", "Five personas around a document"],
  },
  {
    name: "Define",
    mode: "Converge",
    items: ["One primary persona: the finance lead", "Empathy map and two journeys, on paper first", "Assumptions where answers never came"],
  },
  {
    name: "Develop",
    mode: "Diverge",
    items: ["What competitors already do", "AI ideas, each with a trigger, a check and a measure", "The key decision: two tabs or one list"],
  },
  {
    name: "Deliver",
    mode: "Converge",
    items: ["Five screens, built and tested", "Every journey finding traced to a screen", "Edge cases, gaps, risks and metrics"],
  },
] as const;

export const documents = [
  {
    name: "Invoice",
    what: "A request for payment. Paid from the platform.",
    states: ["Draft", "Ready to Pay", "Paid"],
    needs: ["A supplier with bank details", "GL and tax codes on every line", "A due date the money must meet"],
  },
  {
    name: "Receipt",
    what: "Proof of something already paid. Never paid again.",
    states: ["Draft", "Submitted"],
    needs: ["Only a merchant name", "One line by default, itemised when tax is mixed", "Who sent it, and how"],
  },
] as const;

export const channels = ["Email", "WhatsApp", "Upload", "Xero"];
export const futureErps = ["NetSuite", "Campfire", "Light"];

// Each quirk as a tiny receipt: [text, amount, is this the odd line?]
export type SlipLine = readonly [string, string, boolean?];
export const receiptQuirks: { name: string; handling: string; title: string; lines: SlipLine[]; stamp?: string; stack?: boolean }[] = [
  { name: "Card slip", handling: "Flagged; stays one line", title: "CARD PAYMENT", lines: [["TOTAL", "£64.00"], ["VISA ••4242", "", true]] },
  { name: "Mixed VAT", handling: "Itemised, a rate per line", title: "GROCER", lines: [["Bread 0%", "1.20"], ["Milk 0%", "0.95"], ["Wine 20%", "8.00", true]] },
  { name: "Tip", handling: "A line with no tax", title: "BISTRO", lines: [["Lunch × 2", "42.00"], ["Service", "5.25", true]] },
  { name: "Foreign currency", handling: "Paid from a euro account", title: "HÔTEL LYON", lines: [["2 nights", "€142.00", true]] },
  { name: "No VAT shown", handling: "Recorded as No VAT", title: "CITY TAXI", lines: [["Fare", "18.40"], ["VAT", "—", true]] },
  { name: "Refund", handling: "A negative amount", title: "TECH STORE", lines: [["Returned hub", "−40.00", true]] },
  { name: "Recurring", handling: "Not flagged as a duplicate", title: "FIGMA · NOV", lines: [["Professional", "45.00"]], stack: true },
  { name: "Paid “invoice”", handling: "Read as a receipt", title: "INVOICE #2291", lines: [["Workspace", "57.60"]], stamp: "PAID · card 4242" },
];

export const personas = [
  { id: "lead", tier: "Primary", name: "Finance lead", role: "Owns invoices end to end, reviews everyone’s receipts", facts: ["50–300 docs a month", "1–2 pay runs a week"] },
  { id: "employee", tier: "Contributor", name: "Employee", role: "Paid for something; sends the proof", link: "sends receipts" },
  { id: "founder", tier: "Secondary", name: "Founder", role: "Signs off what goes out", link: "approves payments" },
  { id: "accountant", tier: "Secondary", name: "Accountant", role: "Works in the ERP at month end", link: "gets the books" },
  { id: "fund", tier: "Secondary", name: "Fund finance", role: "Same job across several entities", link: "same job, bigger stakes" },
] as const;

// "~" marks items drawn from public material; the rest are hypotheses.
export const empathy = {
  says: ["Has this one been paid already?", "Who approved this?", "Can we pay it Friday with the rest?"],
  thinks: ["Is this the same bank account as last time?", "If the AI coded it wrong, I find out at month end.", "I don’t want to pull money out of the fund early."],
  does: ["Batches work into one or two pay runs a week", "Checks supplier, amount and bank details by eye", "Chases receipts in the last week of the month"],
  feels: ["Responsible", "Interrupted", "Wary of automation they can’t inspect", "Relieved when the list is empty"],
  pains: ["Re-keying data from PDFs", "~Withdrawals from the fund take 1–2 business days", "~Receipts filed among paid invoices", "Fear of paying a duplicate or a fraudster"],
  gains: ["A list that shows only what needs them", "Paying a whole batch in one go", "Books already right when the accountant looks"],
};

// [stage, does, thinks, mood (-1, 0, 1), friction, what the page should do]
export type Stage = readonly [string, string, string, -1 | 0 | 1, string, string];

export const invoiceJourney: Stage[] = [
  ["Intake", "Drags in a batch of PDFs", "“Just take them all.”", 0, "One bad file blocks the batch", "Per-file results; failures say why, the rest carry on"],
  ["Triage", "Scans the list", "“What do I have to look at?”", -1, "Everything looks equally urgent", "Group by what is needed, with counts"],
  ["Review", "Compares fields with the document", "“Can I trust this?”", -1, "Re-reads the whole PDF for five fields", "Document beside the fields; flag only what’s uncertain"],
  ["Code", "Sets GL and tax per line", "“Same as last month.”", 0, "The same choice, every month", "Suggest from history, and say so"],
  ["Check payee", "Looks at where the money goes", "“Is this the real account?”", -1, "Bank detail changes are easy to miss", "Compare with the saved contact; a change blocks payment"],
  ["Ready", "Marks it ready to pay", "“Done with this one.”", 0, "Unclear what is still missing", "A short checklist of what blocks it"],
  ["Fund and pay", "Pays several at once", "“Will the money be there?”", -1, "Settlement lag, low balance, double paying", "Balance against total; safe against double clicks"],
  ["After", "Checks it reached the ERP", "“Is it in Xero?”", 1, "Paid, but the sync failed silently", "Sync state on the row, with retry"],
];

export const receiptJourney: Stage[] = [
  ["Collect", "Looks for what the team sent", "“Who hasn’t sent theirs?”", -1, "Receipts buried under paid invoices", "Their own tab, with sender and channel"],
  ["Check", "Skims merchant, amount, code", "“Fine, fine… what is this?”", 0, "Opening each one for one field", "Enough in the row to decide"],
  ["Fix", "Itemises a mixed receipt", "“Two VAT rates.”", -1, "Splitting a total by hand", "Itemise, and keep lines adding up"],
  ["Close", "Submits the lot", "Relief", 1, "No bulk action", "Select several, submit together"],
];

export const tabsDecision = {
  forTabs: ["Columns, bulk action and headline differ", "Weekly pay runs vs month-end receipts"],
  forList: ["Uploads vanish into the other tab", "Search makes you guess the tab"],
  // Each problem tabs create, and its answer in the build.
  answers: [
    ["Where did my upload go?", "The upload panel names each file’s type"],
    ["Work hidden in the other tab", "A count on each tab"],
    ["Which tab do I search?", "Search covers both"],
  ],
} as const;

// [when, what the AI does, what a person does]
export const aiIdeas = [
  ["Invoice emailed to a person", "Adds it as a draft", "Reviews as usual"],
  ["No AWS invoice by the 5th", "Lists what’s late", "Dismisses or chases"],
  ["Card charge, no receipt in 3 days", "Asks whoever paid", "Sets the rule once"],
  ["Same field missed twice", "Learns where to look", "Can undo"],
  ["Approver opens 15 payments", "Summarises in 3 lines", "Opens the flagged"],
  ["ERP rejects a document", "Asks the ERP’s agent why", "Accepts the fix"],
] as const;

// [stage, found in the journey, what it became, which UI crop shows it]
export const trace = [
  ["Intake", "One bad file blocks the batch", "Each file has its own result and reason", "intake"],
  ["Triage", "Everything looks equally urgent", "The state in words, then the reason", "triage"],
  ["Review", "Re-reading the PDF for five fields", "Focus a field, its source lights up", "review"],
  ["Code", "Same codes, same supplier, every month", "Suggested from history, and labelled", "code"],
  ["Check payee", "Is this the real account?", "Changed details block payment", "payee"],
  ["Fund and pay", "Will the money be there in time?", "Balance against total; late arrival warned", "fund"],
  ["After", "Paid, but the sync failed silently", "Sync state on the row, with retry", "after"],
  ["Receipts", "Buried under paid invoices", "Their own tab, with sender and channel", "receipts"],
] as const;

export const edgeCases = [
  ["Uploading", ["File can’t be read", "Not an invoice or receipt", "Over 2 MB or wrong type", "Some files in a batch fail", "Wrong type: change it, lose nothing", "“Invoice” already paid by card", "Part-paid invoice"]],
  ["Checking", ["Duplicate (but not a monthly subscription)", "Same cost as invoice and receipt", "Totals don’t match the lines", "Tax doesn’t match its code", "Contact isn’t the supplier", "Bank details changed", "New contact, no payment details", "Credit note or zero total", "Code no longer in the ERP"]],
  ["Paying", ["First payment to a supplier", "Foreign currency", "Not enough funds", "Due before the money can leave", "Double click, or two tabs", "Payment fails, money returns", "Balance drops before the date"]],
  ["After", ["Paid but not synced", "Edited after Ready to Pay", "Refresh mid-request", "Stops being ready while selected", "Receipt proving a paid invoice", "Card slip", "Refund", "Tip or mixed VAT"]],
] as const;

export const metrics = [
  { name: "Treasury link", what: "Share of invoices paid from treasury, and whether AP users grow their deposits.", star: true },
  { name: "Time to value", what: "From first upload to first invoice paid." },
  { name: "Automation rate", what: "Fields a person corrects per document." },
  { name: "Coding acceptance", what: "How often the suggested GL code is kept." },
  { name: "Stuck work", what: "Documents in Draft, and for how long." },
  { name: "Safety signals", what: "Duplicates caught, bank changes flagged." },
] as const;

export const events = [
  "document_uploaded",
  "ai_suggestion_accepted",
  "field_corrected",
  "duplicate_flagged",
  "bank_change_flagged",
  "payment_scheduled",
  "invoice_paid",
  "receipt_submitted",
];

export const domains = [
  {
    name: "Supply operations",
    flow: ["Purchase order", "Delivery note", "Invoice"],
    body: "Three documents matched against each other, with mismatches surfaced first.",
  },
  {
    name: "Regulatory and compliance",
    flow: ["Filing", "Evidence per value", "Sign-off"],
    body: "Every value backed by its source, flags that must be cleared, and a trail of who changed what.",
  },
  {
    name: "What carries over",
    flow: ["Exception-first queue", "Provenance", "State machine"],
    list: true,
    body: "Batch actions that refuse what isn’t ready, and adapters for the systems around it.",
  },
] as const;
