import type { StageContent } from "./types";

/** Order for stage pages. Steps 1–7 match the playbook. The last two sit beside that sequence. */
export const STAGE_INDEX: {
  slug: string;
  step: number;
  shortTitle: string;
  cardDescription: string;
}[] = [
  {
    slug: "register-a-business",
    step: 1,
    shortTitle: "Register a business",
    cardDescription: "Name, structure, business number. The first legal steps, in order.",
  },
  {
    slug: "gst-hst-and-taxes",
    step: 2,
    shortTitle: "GST/HST and taxes",
    cardDescription: "Whether you need a GST number, and how to set money aside.",
  },
  {
    slug: "business-bank-account-and-bookkeeping",
    step: 3,
    shortTitle: "Bank account and books",
    cardDescription: "Separate business money, open an account, keep simple books.",
  },
  {
    slug: "wcb-and-insurance",
    step: 4,
    shortTitle: "Insurance and coverage",
    cardDescription: "What coverage you may need before you open, hire or take clients.",
  },
  {
    slug: "estimates-invoices-and-getting-paid",
    step: 5,
    shortTitle: "Quotes, invoices and getting paid",
    cardDescription: "Send a clear quote, invoice properly, get paid without chasing.",
  },
  {
    slug: "tools-that-fit",
    step: 6,
    shortTitle: "Tools that fit",
    cardDescription: "A few apps that talk to each other, not a pile of tabs.",
  },
  {
    slug: "get-found-online",
    step: 7,
    shortTitle: "Get found online",
    cardDescription: "Listings, reviews and a simple site so people can find you.",
  },
  {
    slug: "who-to-call",
    step: 8,
    shortTitle: "Who to call",
    cardDescription:
      "Accountant, insurance, lawyer, suppliers. Vetted, local to you, and we make the introduction.",
  },
  {
    slug: "a-guide-for-the-hard-parts",
    step: 9,
    shortTitle: "A guide for the hard parts",
    cardDescription:
      "When a step needs judgement or a phone call, someone who's already done this picks it up with you.",
  },
];

export const STAGE_PAGES: StageContent[] = [
  {
    slug: "register-a-business",
    step: 1,
    shortTitle: "Register a business",
    cardDescription: "Name, structure, business number. The first legal steps, in order.",
    h1: "How to register a business in Canada",
    heroLead:
      "Name, structure and a business number, in the right order, with someone who has done this before.",
    heroImage: "/hero/stack-hero-01-register.png",
    heroAlign: "left",
    metaDescription:
      "How to register a business in Canada: name, structure and business number, in order, with a real person on the hard parts.",
    primaryQuery: "how to register a business in Canada",
    secondaryQueries: [
      "business number",
      "register a business name",
      "sole proprietorship vs incorporation",
    ],
    whatThisStepIs: [
      "To register a business in Canada you choose a structure, register the name, and get a business number; the exact forms vary by province.",
      "The dashboard asks where you are and adjusts the list. You do not need every form at once, just the next one, then the one after that.",
    ],
    parts: [
      { icon: "structure", label: "Choose a structure that fits how you work" },
      { icon: "name", label: "Register or reserve your business name" },
      { icon: "number", label: "Get a business number when you are ready" },
      { icon: "check", label: "Confirm what else unlocks next in your province" },
    ],
    stuck: [
      "Spending weeks comparing sole prop and incorporation with no clear next move.",
      "Registering a name in the wrong place, then starting over.",
      "Paying for a GST account you didn't need yet.",
    ],
    how: {
      dashboard:
        "Your list shows each registration step in order, with the ones that wait greyed out until the one before is done.",
      you: "You answer a few questions about where you are and what you are starting. Then you work the next item on the list.",
      person:
        "Your guide stays with you on the judgement calls, and an accountant joins when structure or filings need a second set of eyes.",
      withUsRole: "your guide",
    },
    vignette: "register",
    faq: [
      {
        question: "What is a business number, and when do I get one?",
        answer:
          "A business number is the identifier the CRA uses for your business accounts. On Groundwork it sits on your list after name and structure are settled, so you are not applying for accounts you do not need yet. An accountant confirms which ones apply to you.",
      },
      {
        question: "Do I need to register a business name?",
        answer:
          "If you operate under a name other than your own legal name, you usually need to register that trade name where you work. The dashboard flags whether a name search or registration is next for your province, and your guide walks you through the form.",
      },
      {
        question: "Sole proprietorship or incorporation?",
        answer:
          "Sole prop is simpler to start; incorporation adds formality and cost. Groundwork does not decide for you. It lays out what each path involves, then an accountant helps you pick based on how you plan to operate.",
      },
    ],
    headings: {
      what: "What this step is",
      stuck: "Where people get stuck",
      how: "How Groundwork handles it",
      faq: "Questions people ask",
    },
  },
  {
    slug: "gst-hst-and-taxes",
    step: 2,
    shortTitle: "GST/HST and taxes",
    cardDescription: "Whether you need a GST number, and how to set money aside.",
    h1: "How to register for GST/HST in Canada",
    heroLead:
      "The small-supplier threshold, the account on your business number, and a set-aside so the tax is there when you remit.",
    metaDescription:
      "How to register for GST/HST in Canada: the $30,000 small-supplier threshold, opening the account, and setting tax aside before you remit.",
    primaryQuery: "how to register for GST/HST in Canada",
    secondaryQueries: [
      "GST small supplier threshold",
      "do I need a GST number",
      "GST remittance",
    ],
    whatThisStepIs: [
      "To register for GST/HST in Canada you open a program account on the business number you already have. The public small-supplier threshold is $30,000 in taxable supplies, in one calendar quarter or across four quarters in a row. Under it, registration is a choice. Over it, you register.",
      "A few kinds of work, including commercial ride-sharing, register from the first dollar. The dashboard waits until your name and business number are settled, then puts the decision, the account, and the remittance date on the list. An accountant confirms which rule applies to you.",
    ],
    parts: [
      {
        icon: "tax",
        label: "Check the small-supplier threshold against what you expect to bill",
      },
      { icon: "number", label: "Register a GST/HST account on your business number" },
      { icon: "tax", label: "Set the tax aside from every payment you collect" },
      { icon: "check", label: "Put the remittance date where you will see it" },
    ],
    stuck: [
      "Registering on day one and charging tax you did not have to charge yet.",
      "Spending the GST you collected, then owing it when the return is due.",
      "Missing a filing because the date was never written down.",
    ],
    how: {
      dashboard:
        "Your list holds the GST decision until the name and business number are done, then shows the account, the set-aside, and the remittance date.",
      you: "You check the threshold against what you expect to bill. You register when you are over it, or earlier if claiming tax back on expenses is worth charging it. You move a share of every payment into the set-aside.",
      person:
        "Your guide walks the CRA form with you. An accountant confirms the threshold, whether you charge GST or HST, and how often you should file.",
      withUsRole: "your accountant",
    },
    vignette: "money",
    faq: [
      {
        question: "What is the GST small-supplier threshold in Canada?",
        answer:
          "It is $30,000 in taxable supplies. That can land in a single calendar quarter, or across four quarters in a row. Under it, a GST/HST account is optional. Over it, you register. An accountant confirms the count for how you bill, including the kinds of work that register from the first dollar.",
      },
      {
        question: "What is the difference between GST and HST?",
        answer:
          "GST is the federal sales tax. In Ontario, Nova Scotia, New Brunswick, Newfoundland and Labrador, and Prince Edward Island, the provincial portion is combined with it and called HST. Other provinces charge GST, and some add their own sales tax. Quebec charges GST and QST. Which one you charge follows where the supply is made, which is why your province is on the list.",
      },
      {
        question: "How often do I remit GST/HST?",
        answer:
          "The CRA assigns a filing period when you register. Small businesses are often annual, and you can ask for quarterly or monthly if you would rather remit as you go. The date goes on your list the week the account opens. The tax you collected stays set aside until that date.",
      },
    ],
    headings: {
      what: "What GST/HST registration is",
      stuck: "Where GST registration goes wrong",
      how: "How Groundwork handles GST and remittances",
      faq: "GST questions people ask",
    },
  },
  {
    slug: "business-bank-account-and-bookkeeping",
    step: 3,
    shortTitle: "Bank account and books",
    cardDescription: "Separate business money, open an account, keep simple books.",
    h1: "How to open a business bank account in Canada",
    heroLead:
      "A separate account, simple books, and a monthly habit so tax time is a filing, not a reconstruction.",
    heroImage: "/hero/getpaidhero.png",
    heroAlign: "right",
    metaDescription:
      "How to open a business bank account in Canada, keep business money separate, and set up bookkeeping you will actually keep.",
    primaryQuery: "how to open a business bank account in Canada",
    secondaryQueries: [
      "sole proprietor business bank account",
      "small business bookkeeping",
      "separate business and personal finances",
    ],
    whatThisStepIs: [
      "A business bank account is the account you run the business through: customer payments in, business costs out, in the name you invoice under. Pair it with one bookkeeping setup, a spreadsheet or software, that records those movements every month.",
      "The dashboard puts the account and the books after registration. GST you have collected, and income tax you will owe, both depend on this record being clean. A guide helps you pick a setup you will open. A bookkeeper joins when the month is more than you want to do yourself.",
    ],
    parts: [
      { icon: "bank", label: "Open an account in the business name" },
      { icon: "check", label: "Run business money through that account" },
      { icon: "books", label: "Pick one bookkeeping setup you will actually open" },
      { icon: "check", label: "Record the first month and match it to the bank" },
    ],
    stuck: [
      "Running the business through a personal account, then sorting a year of statements in April.",
      "Buying bookkeeping software and never sending the first invoice through it.",
      "No record of what you spent, so the expenses you could claim are gone.",
    ],
    how: {
      dashboard:
        "The account and the books sit on your list after registration, with a monthly bookkeeping item small enough to finish.",
      you: "You open the account in the business name, move business money through it, and record the first month in one place.",
      person:
        "Your guide helps you pick a bookkeeping setup you will keep. A bookkeeper joins when the month is more than you want to do yourself.",
      withUsRole: "your guide",
    },
    vignette: "money",
    faq: [
      {
        question: "Do I need a business bank account for a sole proprietorship?",
        answer:
          "The law does not always require a separate account for a sole proprietorship. You still want one. Income and expenses in their own account are what make bookkeeping, GST, and a CRA review possible. Once you operate under a registered name, open the account in that name so it matches your invoices.",
      },
      {
        question: "What do I need to open a business bank account in Canada?",
        answer:
          "Banks differ. Most ask for government photo ID and something that shows the business exists: a name registration, or articles if you incorporated. Your business number helps once you have it. Open the account after the name is settled, so you are not changing it a month later.",
      },
      {
        question: "Should I use a spreadsheet or bookkeeping software?",
        answer:
          "A spreadsheet is enough while you have a few transactions a week and you will update it. Software earns its place once receipts pile up or you are remitting GST. Either way, use one system, and connect it to the business account if it can pull the feed.",
      },
    ],
    headings: {
      what: "What a business bank account is for",
      stuck: "Where business money gets mixed up",
      how: "How Groundwork handles banking and bookkeeping",
      faq: "Banking and bookkeeping questions",
    },
  },
  {
    slug: "wcb-and-insurance",
    step: 4,
    shortTitle: "Insurance and coverage",
    cardDescription: "What coverage you may need before you open, hire or take clients.",
    h1: "WCB registration and business insurance in Canada",
    heroLead:
      "The workers' board for your province, and liability cover, before you hire or take the job.",
    metaDescription:
      "WCB registration and small business insurance in Canada: workers' compensation when it applies, and liability cover before you hire or take a job.",
    primaryQuery: "WCB registration",
    secondaryQueries: [
      "do I need WSIB",
      "small business liability insurance",
      "workers compensation for self employed",
    ],
    whatThisStepIs: [
      "Workers' compensation and liability insurance solve different problems. The workers' board, WCB in much of the country, WSIB in Ontario, WorkSafeBC in British Columbia, CNESST in Quebec, covers work-related injury. Liability insurance covers injury or damage you cause to a client or their property.",
      "If you employ anyone, you register with the board before they start. If you work alone, some provinces and some industries still require it, and others let you opt in so you are covered yourself. Client contracts often ask for a liability certificate either way. The dashboard names the board for where you work.",
    ],
    parts: [
      { icon: "shield", label: "List the coverage your work actually needs" },
      { icon: "number", label: "Register with the workers' board if it applies" },
      { icon: "shield", label: "Get liability insurance before the first job" },
      { icon: "check", label: "Save the certificate with your other papers" },
    ],
    stuck: [
      "Learning a client contract required insurance after you had already started.",
      "Hiring someone before the workers' board account exists.",
      "Buying a policy that does not cover the work you actually do.",
    ],
    how: {
      dashboard:
        "Coverage sits on the list before you hire or take a job that requires it, with the board for your province named.",
      you: "You note how you work, who you hire, and what a contract already asks for. You register with the board if it applies, and you keep the certificate.",
      person:
        "An insurance broker looks at the work, on client sites or your own, with tools, vehicles, or subcontractors, and quotes the cover that matches. Your guide makes that introduction.",
      withUsRole: "insurance broker",
    },
    vignette: "network",
    faq: [
      {
        question: "Do I need to register for WCB if I work alone?",
        answer:
          "It depends on the province and the industry. Some require coverage even with no employees. Others let a sole proprietor opt in, which is how you get covered yourself. If you hire, registration almost always comes before the first day of work. Your list points at the board where you operate.",
      },
      {
        question: "What is the difference between WCB and liability insurance?",
        answer:
          "WCB, WSIB, WorkSafeBC, or CNESST covers work-related injury for the people doing the work. Liability insurance covers harm you cause to a client or their property. A contract can require a liability certificate even when the workers' board does not apply. Many businesses carry both.",
      },
      {
        question: "When should a new business get insurance?",
        answer:
          "Before the first job that requires it, and before you hire. A broker matches the policy to the work. You bind it and keep the certificate with your registration papers. Groundwork introduces the broker. We do not sell the policy.",
      },
    ],
    headings: {
      what: "What workers' compensation and insurance cover",
      stuck: "Where coverage gets missed",
      how: "How Groundwork handles WCB and insurance",
      faq: "Insurance and WCB questions",
    },
  },
  {
    slug: "estimates-invoices-and-getting-paid",
    step: 5,
    shortTitle: "Quotes, invoices and getting paid",
    cardDescription: "Send a clear quote, invoice properly, get paid without chasing.",
    h1: "How to invoice clients and get paid",
    heroLead:
      "A quote that states the scope, an invoice with a number, and card or e-transfer into the business account.",
    heroImage: "/hero/getpaidhero.png",
    heroAlign: "right",
    metaDescription:
      "How to invoice clients in Canada: a clear quote, a proper invoice with tax handled correctly, and payment by card or e-transfer.",
    primaryQuery: "how to invoice clients",
    secondaryQueries: [
      "what to include on an invoice Canada",
      "quote vs invoice",
      "get paid by e-transfer",
    ],
    whatThisStepIs: [
      "A quote agrees the work and the price before you start. An invoice asks to be paid, for a deposit or for finished work, and it needs a number, a date, and your business details. If you are registered for GST/HST, the invoice shows that tax and your GST/HST number. If you are not, you leave the tax off.",
      "Payment goes to the business account, by e-transfer or by card, on terms you agreed up front. The dashboard walks quote, invoice, then the first payment, so the paperwork exists before the job is done and you are waiting.",
    ],
    parts: [
      { icon: "invoice", label: "Write a quote that states what is included" },
      { icon: "invoice", label: "Send an invoice with a number and a due date" },
      { icon: "check", label: "Take card or e-transfer into the business account" },
      { icon: "check", label: "Mark it paid the day the money lands" },
    ],
    stuck: [
      "A text that says what someone owes you, with no invoice number and no terms.",
      "No deposit and no due date, then weeks of chasing.",
      "The payment landing in a personal account, with nothing in the books.",
    ],
    how: {
      dashboard:
        "Quote, invoice, and getting paid are three items in order, so the first invoice is ready before the job ends.",
      you: "You save a quote you can reuse, send an invoice with a number and a due date, and take payment into the business account.",
      person:
        "Your guide reviews the first quote and the first invoice with you, including the tax line if you are registered.",
      withUsRole: "your guide",
    },
    vignette: "paid",
    faq: [
      {
        question: "What should an invoice include in Canada?",
        answer:
          "Your legal name or registered business name, the date, a unique invoice number, who you are billing, what you did, and the amount. Add payment terms, such as due in 14 days, and how to pay. If you are registered for GST/HST, show that tax and your GST/HST number. If you are not registered, do not add the tax.",
      },
      {
        question: "What is the difference between a quote and an invoice?",
        answer:
          "A quote, sometimes called an estimate, is the price and the scope before the work. An invoice is the request for payment, for a deposit or for the finished job. The quote is what you agreed to do. The invoice, with its own number, is what you billed.",
      },
      {
        question: "How do I get paid by e-transfer or credit card?",
        answer:
          "Agree the method before you start. E-transfer into the business account is enough for many first jobs. A card link from your invoicing tool suits clients who want to pay from the invoice itself. Either way, the money lands in the business account and the invoice is marked paid the same day.",
      },
    ],
    headings: {
      what: "What a proper invoice includes",
      stuck: "Where getting paid stalls",
      how: "How Groundwork handles quotes and invoices",
      faq: "Invoicing questions people ask",
    },
  },
  {
    slug: "tools-that-fit",
    step: 6,
    shortTitle: "Tools that fit",
    cardDescription: "A few apps that talk to each other, not a pile of tabs.",
    h1: "What software does a small business need?",
    heroLead:
      "Estimating, invoicing, scheduling, and a simple CRM. A few tools that share a client, instead of a pile of tabs.",
    metaDescription:
      "What software a small business needs: estimating, invoicing, scheduling, and a CRM that share clients, without a pile of unused apps.",
    primaryQuery: "what software does a small business need",
    secondaryQueries: [
      "invoicing software for small business",
      "scheduling app for contractors",
      "CRM for a small business",
    ],
    whatThisStepIs: [
      "A new business needs software for the jobs it repeats: a quote, an invoice, a place on the calendar, and a record of who the customer is. One tool can cover more than one of those. A second tool is worth it when it talks to the first.",
      "The dashboard starts from your week, not from a catalogue. You keep a few, connect the bank and the books to invoicing, and drop the subscriptions you never open. Your guide helps you choose so the comparison does not become the work.",
    ],
    parts: [
      { icon: "tools", label: "List the jobs you do every week" },
      { icon: "tools", label: "Choose one tool for each of those jobs" },
      { icon: "check", label: "Connect the bank, the books, and invoicing" },
      { icon: "check", label: "Cancel the subscriptions you have not opened" },
    ],
    stuck: [
      "A new app for every task, and none of them share a client.",
      "Paying for software that has never sent an invoice.",
      "Typing the same job into quoting, the calendar, and the books.",
    ],
    how: {
      dashboard:
        "The list starts from the jobs in your week, then keeps one tool per job and a note of where the logins live.",
      you: "You pick the few tools you will open, connect the ones that share a client or an invoice, and cancel the rest.",
      person:
        "Your guide helps you choose and connect them, so the shortlist is based on the work you do.",
      withUsRole: "your guide",
    },
    vignette: "tools",
    faq: [
      {
        question: "What software does a new business need on day one?",
        answer:
          "A way to quote, a way to invoice, a calendar if you book time, and one list of customer names. That can be a single tool. Add something else only when a job in your week has nowhere to go. Bookkeeping can be the same system or the one your bank feed already lands in.",
      },
      {
        question: "Should quoting and invoicing be the same tool?",
        answer:
          "Yes, when you can find one you will use. The quote becomes the invoice without retyping the job, the price, or the tax. Scheduling can live there too, or in a second app, as long as the client name is entered once.",
      },
      {
        question: "Which tools are worth connecting first?",
        answer:
          "The business bank feed into your books, and invoicing into those same books. Those two remove the most retyping. The calendar and the customer list can follow. Connect what you look at every week, and cancel what you have not opened in a month.",
      },
    ],
    headings: {
      what: "What software a small business needs",
      stuck: "Where the tool pile starts",
      how: "How Groundwork handles the tools",
      faq: "Questions about business software",
    },
  },
  {
    slug: "get-found-online",
    step: 7,
    shortTitle: "Get found online",
    cardDescription: "Listings, reviews and a simple site so people can find you.",
    h1: "Local SEO for a small business",
    heroLead:
      "A Google Business Profile, a few real reviews, and a simple page so you show up when people search nearby, including in AI answers.",
    metaDescription:
      "Local SEO for a small business: claim your Google Business Profile, collect real reviews, and publish a simple page so you show up in search and Maps.",
    primaryQuery: "local SEO for a small business",
    secondaryQueries: [
      "Google Business Profile",
      "how to show up on Google Maps",
      "get Google reviews for a new business",
    ],
    whatThisStepIs: [
      "Local SEO is how a nearby customer finds you in search, on Maps, and in AI answers. The foundation is a claimed Google Business Profile in the name you trade under, with the same phone number, address or service area, and hours everywhere else that name appears.",
      "Reviews from real clients, and one page that says what you do and how to book, give people a reason to choose you once the listing is live. The dashboard starts this after the business name is settled, so you are not building two listings under two names. Your guide sets it up with you.",
    ],
    parts: [
      { icon: "search", label: "Claim your Google Business Profile" },
      { icon: "check", label: "Use the same name, phone, and address everywhere" },
      { icon: "review", label: "Ask a few real clients for a review" },
      {
        icon: "web",
        label: "Publish one page that says what you do and how to reach you",
      },
    ],
    stuck: [
      "Two listings for one business, or a listing in a name you no longer use.",
      "A complete profile and no reviews, so you look unproven next to someone who asked.",
      "A website that never says where you work or how to book.",
    ],
    how: {
      dashboard:
        "Listings, reviews, and a simple page sit on the list once the business name is settled, so every listing uses the same details.",
      you: "You claim the profile, ask a few clients who would vouch for you, and publish one page linked from the listing.",
      person:
        "Your guide sets the listing up with you. The ongoing local work is handled so you can stay on the tools.",
      withUsRole: "your guide",
    },
    vignette: "presence",
    faq: [
      {
        question: "What is a Google Business Profile?",
        answer:
          "It is the free listing that can appear on Google Maps and in search when someone looks for a business like yours nearby. Claim it in the name you trade under, with the phone, hours, and service area you use everywhere else. A second, half-finished listing splits your reviews.",
      },
      {
        question: "How do I show up on Google Maps?",
        answer:
          "Maps weighs how well the listing matches the search, how close you are, and how established the profile looks. You influence that with a complete profile, the same name, phone, and address on every listing, and reviews from real clients. There is no switch that puts you first. A complete listing is what gives you a fair chance.",
      },
      {
        question: "Do I need a website for local SEO?",
        answer:
          "A website is not required for a Maps listing. A simple page still helps: what you do, where you work, and how to reach you, linked from the profile. People who want more than a pin, and AI answers that cite a source, both look for that page. One clear page is enough.",
      },
    ],
    headings: {
      what: "What local SEO means for a new business",
      stuck: "Where local listings go wrong",
      how: "How Groundwork handles getting found",
      faq: "Local SEO questions people ask",
    },
  },
  {
    slug: "who-to-call",
    step: 8,
    shortTitle: "Who to call",
    cardDescription:
      "Accountant, insurance, lawyer, suppliers. Vetted, local to you, and we make the introduction.",
    h1: "Who to call when you start a business in Canada",
    eyebrow: "WHEN YOU NEED THEM",
    heroLead:
      "An accountant, an insurance broker, a lawyer, and suppliers. Local to you, introduced when the step needs them.",
    metaDescription:
      "Who to call when you start a business in Canada: an accountant, insurance broker, lawyer, and suppliers, introduced locally when you need them.",
    primaryQuery: "who to call when you start a business",
    secondaryQueries: [
      "accountant for a new business",
      "do I need a lawyer to start a business",
      "small business insurance broker",
    ],
    whatThisStepIs: [
      "Most new businesses need four kinds of people, and not all on day one. An accountant for structure, GST, and year end. An insurance broker before you hire or take a job that needs cover. A lawyer when a contract, a lease, or incorporation needs one. Suppliers once you are ready to buy on account.",
      "Groundwork does not hand you a directory. The person shows up on the list at the step where you need them, and your guide makes the introduction with the context of what you are starting. You take the call and you decide.",
    ],
    parts: [
      { icon: "number", label: "An accountant for setup, remittances, and year end" },
      { icon: "shield", label: "An insurance broker for the cover you actually need" },
      { icon: "structure", label: "A lawyer for contracts and incorporation" },
      { icon: "check", label: "Supplier accounts, opened with an introduction" },
    ],
    stuck: [
      "Searching 'accountant near me' and hoping the first result fits a brand-new business.",
      "Incorporating, then looking for someone to explain what you filed.",
      "A supplier that will not open an account for a business with no history.",
    ],
    how: {
      dashboard:
        "Accountant, broker, lawyer, and suppliers sit on your list at the step where you need them, rather than as a pile of names on day one.",
      you: "You ask for an introduction when the step needs one. You take the call, and you decide whether to hire them.",
      person:
        "Your guide sends the introduction, with a short note on what you are starting, to someone local who does this work. You are on the thread.",
      withUsRole: "your guide",
    },
    vignette: "network",
    faq: [
      {
        question: "When should I hire an accountant for a new business?",
        answer:
          "Before you choose a structure, if that choice is unclear, and before the first GST filing. A bookkeeper can keep the month tidy. An accountant is the person for year end, remittances, and the decisions that change what you owe. Groundwork introduces someone local. You decide whether to hire them.",
      },
      {
        question: "Do I need a lawyer to start a business in Canada?",
        answer:
          "A sole proprietorship does not require a lawyer to register. A lawyer is the right call for incorporation documents you do not want to guess at, a partnership or shareholder agreement, a client contract with real stakes, and a commercial lease. The list marks those steps when they come up.",
      },
      {
        question: "How does a Groundwork introduction work?",
        answer:
          "You ask from your list. Your guide introduces you to an accountant, broker, lawyer, or supplier who fits where you work and what you do, and you are included in that introduction. You talk to them and you choose. The professional does the licensed work.",
      },
    ],
    headings: {
      what: "Who you need when you start a business",
      stuck: "Where finding the right person stalls",
      how: "How Groundwork makes the introduction",
      faq: "Questions about who to call",
    },
  },
  {
    slug: "a-guide-for-the-hard-parts",
    step: 9,
    shortTitle: "A guide for the hard parts",
    cardDescription:
      "When a step needs judgement or a phone call, someone who's already done this picks it up with you.",
    h1: "Help starting a business in Canada",
    eyebrow: "ON THE HARD PARTS",
    heroLead:
      "When a step needs judgement or a phone call, someone who has already done this picks it up with you.",
    metaDescription:
      "Help starting a business in Canada: a guide for the steps that need judgement, and a licensed professional when the form needs one.",
    primaryQuery: "help starting a business in Canada",
    secondaryQueries: [
      "new business mentor",
      "someone to help register a business",
      "startup help for a small business",
    ],
    whatThisStepIs: [
      "Some steps are a form you can finish alone. Some need a judgement call, a phone call, or a second set of eyes: whether to incorporate, whether you are near the GST threshold, which cover a contract is asking for. A guide is the person who has done those steps before and stays on the list with you.",
      "The guide is not your accountant, lawyer, or broker. They tell you which step you are on, walk the fiddly forms, and bring in a licensed professional when the step needs one. You still make the decisions and you still sign.",
    ],
    parts: [
      { icon: "check", label: "A guide who stays on the list with you" },
      { icon: "check", label: "A reply, usually the same day, when a step stalls" },
      { icon: "number", label: "A licensed professional when the step needs one" },
      { icon: "structure", label: "The forms and the decisions that stay yours" },
    ],
    stuck: [
      "A checklist and no one to ask when the form does not match your situation.",
      "Paying for advice before you know which question to ask.",
      "Starting a filing over because the first answer came from a forum.",
    ],
    how: {
      dashboard:
        "Every step shows whether it is yours to finish or marked with us, so you can see who picks it up before you start.",
      you: "You do the forms, the calls, and the decisions that are yours. You ask when a step needs judgement.",
      person:
        "Your guide replies, usually the same day, and stays through the list. An accountant, broker, or lawyer joins when the step needs their licence.",
      withUsRole: "your guide",
    },
    vignette: "person",
    faq: [
      {
        question: "What does a Groundwork guide do?",
        answer:
          "The guide stays on the list with you. They answer whether a step is yours yet, walk a form when it is fiddly, and notice when it needs an accountant, broker, or lawyer. They usually reply the same day. They do not replace those professionals.",
      },
      {
        question: "Is a guide giving tax or legal advice?",
        answer:
          "No. Groundwork guides and refers. We do not give legal, tax, or accounting advice. When a step needs that judgement, the guide brings in someone qualified to give it, and you hire them directly.",
      },
      {
        question: "When does an accountant or broker step in?",
        answer:
          "On the steps that need a licence or a signed opinion. Structure and GST with an accountant. Coverage with a broker. Contracts and incorporation with a lawyer. The guide makes the introduction so you are not searching for a name with a form half finished.",
      },
    ],
    headings: {
      what: "What a guide does on the hard parts",
      stuck: "Where people stall without a person",
      how: "How a guide works with you",
      faq: "Questions about your guide",
    },
  },
];

export function getStageBySlug(slug: string): StageContent | undefined {
  return STAGE_PAGES.find((stage) => stage.slug === slug);
}

export function getAdjacentStages(slug: string) {
  const index = STAGE_INDEX.findIndex((stage) => stage.slug === slug);
  if (index < 0) return { prev: null, next: null };
  return {
    prev: index > 0 ? STAGE_INDEX[index - 1] : null,
    next: index < STAGE_INDEX.length - 1 ? STAGE_INDEX[index + 1] : null,
  };
}

export function stagePath(slug: string) {
  return `/start/${slug}`;
}

export function stepLabel(step: number) {
  return `STEP ${step} OF 7`;
}
