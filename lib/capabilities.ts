export type HelpItem = {
  title: string
  body: string
}

export type CapabilityOffering = {
  slug: string
  title: string
  deck: string
  story: string[]
  help: HelpItem[]
}

export type Capability = {
  slug: string
  navTitle: string
  title: string
  story: string[]
  offeringsTitle: string
  offerings: CapabilityOffering[]
  howWeHelpTitle: string
  howWeHelp: HelpItem[]
  workTitle: string
  work: HelpItem[]
}

export const CAPABILITIES: Capability[] = [
  {
    slug: "marketing-and-sales",
    navTitle: "Marketing and Sales",
    title: "Marketing and Sales",
    story: [
      "Marketing and sales give a growing business a way to turn attention into revenue. Terramore helps owners connect advertising, the store, and follow-up so a visit can become an order or a booked appointment.",
      "Most companies already spend on ads, a website, and email. The gap is the path between the click and the sale. We find that gap, fix the first bottleneck, and leave a system your team can run.",
    ],
    offeringsTitle: "Our Marketing and Sales Services",
    offerings: [
      {
        slug: "e-commerce",
        title: "E-Commerce",
        deck: "Set a plan for the online store, then make catalog, checkout, shipping, and return emails work as one system.",
        story: [
          "An online store only pays for itself when a visitor can finish the purchase. We help you set a clear plan for the channel you already have, then make it real.",
          "Customers leave at shipping, a slow cart, or a page that creates doubt. We find that step first so more carts become paid orders.",
        ],
        help: [
          {
            title: "Find the page that loses the sale",
            body: "We review the visit and name the step that creates doubt. Then we change that page, not the entire catalog.",
          },
          {
            title: "Keep one order across tools",
            body: "The store, the payment, and the inbox should all see the same purchase. A paid order should not disappear between systems.",
          },
          {
            title: "Grow the channel you have",
            body: "We do not open a second store until this one can complete a sale with confidence.",
          },
        ],
      },
      {
        slug: "digital-marketing",
        title: "Digital Marketing",
        deck: "Reach the right customer, in the right channel, with an offer you can measure in orders and bookings.",
        story: [
          "Digital marketing works when speed, targeting, and a real offer sit together. Terramore helps you build that habit inside the tools you already pay for.",
          "You pay to be seen. We send those people to a page they can finish, and we stop spend that only buys views.",
        ],
        help: [
          {
            title: "Spend on people who already showed interest",
            body: "The audience is built from visits and intent, not from everyone in the city.",
          },
          {
            title: "Keep what books or sells",
            body: "Creative that produces revenue stays. Ads that only collect impressions pause.",
          },
          {
            title: "Count revenue, not vanity",
            body: "A click is not a win. An order or a booked appointment is.",
          },
        ],
      },
      {
        slug: "digital-sales",
        title: "Digital Sales",
        deck: "See the path from first click to a booked call or a paid order, and close the gaps in between.",
        story: [
          "Customers now learn and buy in a different order than they did a few years ago. We help you put the tools and the data that direct sales into one plan.",
          "A click should become a call, a hold, or a paid order. We show you where that path breaks and who owns the next step.",
        ],
        help: [
          {
            title: "Draw the revenue path",
            body: "From first click to money, in plain language. The leak is named so the team can act.",
          },
          {
            title: "Connect inbox, CRM, and calendar",
            body: "The same lead should appear for the owner, sales, and support. No one should hunt for the record.",
          },
          {
            title: "Give every hold a next step",
            body: "Partners can see the week. Mystery leads stop sitting in a shared inbox.",
          },
        ],
      },
      {
        slug: "sales-channel-strategy",
        title: "Sales Channel Strategy",
        deck: "Put the right offer in the right channel, and stop funding doors that do not produce revenue.",
        story: [
          "Owners need a clear view of partners, marketplaces, and direct channels. We make sure the right pieces are in place before you add another door.",
          "Instagram, Google, the store, a partner. We keep the channels that sell and close the ones that only cost money.",
        ],
        help: [
          {
            title: "Name the job of each channel",
            body: "Which door books, which one teaches, and which one should be cut.",
          },
          {
            title: "Stop competing for the same lead",
            body: "Partner and direct sales share one view so two people do not chase one customer.",
          },
          {
            title: "Move budget to what closes",
            body: "Weekly spend follows the channel that produces revenue.",
          },
        ],
      },
      {
        slug: "personalization",
        title: "Personalization",
        deck: "Show the next right offer based on what a customer already viewed, bought, or is due to refill.",
        story: [
          "Personalization works when the next note is based on what a person already did, not on a generic calendar.",
          "If they looked at a specific product, that is the offer. One first-time buyer path. Not a maze of forty emails.",
        ],
        help: [
          {
            title: "Start with one proven path",
            body: "Welcome, the first upsell, the refill. Prove it, then copy it.",
          },
          {
            title: "Use the page they already saw",
            body: "The visit is the brief. We do not invent an add-on they never considered.",
          },
          {
            title: "Measure a purchase or a booking",
            body: "Opens only matter if they lead to revenue or a hold.",
          },
        ],
      },
      {
        slug: "marketing-function-excellence",
        title: "A Cheaper Marketing Week",
        deck: "Make the marketing week cheaper and clearer. Fewer tools. One owner per channel. A plan the team can run.",
        story: [
          "By making marketing more effective and less wasteful, we improve the return on spend you already have.",
          "Fewer tools. One owner per channel. A 90-day list that still works after we leave.",
        ],
        help: [
          {
            title: "Cut software nobody opens",
            body: "The stack matches the week, not a vendor wish list.",
          },
          {
            title: "Give each channel an owner",
            body: "Ads, email, and the store are not a shared mystery.",
          },
          {
            title: "Leave a 90-day plan",
            body: "The team keeps the work when the engagement ends.",
          },
        ],
      },
    ],
    howWeHelpTitle: "How We Help Marketing and Sales Functions",
    howWeHelp: [
      {
        title: "One path, not five disconnected teams",
        body: "Owners live with constant change. That can still be an opening. We help you rethink the week so ads, the site, and follow-up share the same facts. A lead does not die between tools.",
      },
      {
        title: "AI where it saves a real step",
        body: "Customers expect faster replies and a clearer next step. We use AI to draft, sort, and follow up. A person still owns the send and the price.",
      },
      {
        title: "Prove one offer, then scale",
        body: "We prove one offer on one list. Then we copy the path that worked. That is how a small team grows without a large department.",
      },
      {
        title: "Sales can see the week",
        body: "We put the tools and the data that direct sales into the same plan. Every hold has a name and a next step.",
      },
    ],
    workTitle: "Our Client Work in Marketing and Sales",
    work: [
      {
        title: "Checkout that finishes",
        body: "Shapewear brand. The store was losing customers at the shipping step on mobile. We fixed that one page and kept the same catalog. More carts became orders.",
      },
      {
        title: "First-time buyer follow-up",
        body: "Skincare brand. After the order confirmation, the first-time buyer email offered the product they had already viewed. The visit wrote the email.",
      },
      {
        title: "One folder for a drop",
        body: "Apparel brand. Photos, copy, and prices live in one shared folder. The team sends the same files every time, so the drop and the ads match.",
      },
    ],
  },
  {
    slug: "artificial-intelligence",
    navTitle: "Artificial Intelligence",
    title: "Artificial Intelligence",
    story: [
      "For a small business, AI is an assistant that answers the phone at 9 pm, drafts the reply, and books the job. Terramore sets it up inside the tools you already run. A person still approves every message and every price.",
      "We do not start with a tool. We start with the job that keeps slipping: the missed call, the leftover cart, the refill nobody sent. Then we add a helper only where it gives you back hours or orders you can count.",
    ],
    offeringsTitle: "What We Set Up",
    offerings: [
      {
        slug: "agentic-ai",
        title: "An Assistant That Answers and Books",
        deck: "A helper that watches for a missed call, a new lead, or a refill date and takes the first step. A person still closes the sale.",
        story: [
          "A teammate that works when you cannot. It watches for one job you name and takes the first step.",
          "A missed call gets a booking link. A new lead hits the phone and the calendar. A person still closes.",
        ],
        help: [
          {
            title: "Pick one workflow",
            body: "One owner. One job. We do not turn on ten agents at once.",
          },
          {
            title: "The agent moves. You close.",
            body: "It can text, log, or book. You still own the price and the yes.",
          },
          {
            title: "You can turn it off",
            body: "If the step is wrong, it stops. Off is a real option.",
          },
        ],
      },
      {
        slug: "deploy-ai",
        title: "AI in the Daily Work",
        deck: "Drafts, research, and replies handled inside the tools you already pay for, so the team is faster this month.",
        story: [
          "AI in the daily work means a draft you can approve, a reply that is ready before you open the inbox, and a list that updates itself.",
          "You do not need a science project. You need a draft you can approve and a list that updates itself.",
        ],
        help: [
          {
            title: "Size the work that eats the week",
            body: "We pick the tasks that steal hours, then we put a helper there.",
          },
          {
            title: "Use the tools you already pay for",
            body: "We do not start with a new platform.",
          },
          {
            title: "Prove the time back",
            body: "One list first. Then we copy it.",
          },
        ],
      },
      {
        slug: "reshape-workflows",
        title: "Rebuild the Path from Lead to Done",
        deck: "A new tool on a broken path still fails. We fix the steps so marketing, sales, and follow-up share one flow.",
        story: [
          "The most important work is the path from a new lead to a finished job. We rebuild that path with AI in it, not bolted on.",
          "A new tool on a broken path still fails. We rebuild the steps from lead to done.",
        ],
        help: [
          {
            title: "Draw the old path and the leak",
            body: "Everyone can see where the lead dies.",
          },
          {
            title: "Cut steps no one owns",
            body: "Fewer handoffs. Same quality.",
          },
          {
            title: "Leave a Monday that works",
            body: "The team can run the flow when we go.",
          },
        ],
      },
      {
        slug: "responsible-ai",
        title: "Rules for What It Can Say and See",
        deck: "Clear rules for what the helper may say, send, and see, before the first customer message goes out.",
        story: [
          "A responsible approach means rules from day one, not after a mistake.",
          "Clear limits on what the helper may say, send, and see. Your customers stay yours.",
        ],
        help: [
          {
            title: "No list in a tool you do not trust",
            body: "Customer data stays in the apps you chose.",
          },
          {
            title: "A person reviews first sends",
            body: "Trust is built on the first week, not a policy slide.",
          },
          {
            title: "You can stop it",
            body: "Off is a real option.",
          },
        ],
      },
    ],
    howWeHelpTitle: "How We Do It",
    howWeHelp: [
      {
        title: "Start with the job, not the tool",
        body: "We pick the missed call, the leftover cart, or the refill. The tool is a small part of the fix. The rest is the path, the owner, and the habit.",
      },
      {
        title: "A person approves every message",
        body: "AI drafts. Your team approves. That is how trust stays, and how a small team still sounds like itself.",
      },
      {
        title: "Count it every week",
        body: "Hours saved, replies sent, jobs booked. Not a slide about the future.",
      },
    ],
    workTitle: "Our Client Work in Artificial Intelligence",
    work: [
      {
        title: "After-hours coverage",
        body: "Home services. A missed call now gets a booking link by text. Morning jobs come from that night window. The owner is not on the phone at 9 pm.",
      },
      {
        title: "A lead gets a calendar spot",
        body: "Professional services. A new lead reaches the owner, sales, and the assistant at the same time. The calendar gets a spot before the lead goes cold.",
      },
    ],
  },
  {
    slug: "customer-insights",
    navTitle: "Customer Insights",
    title: "Customer Insights",
    story: [
      "Customer insights give a business the means to capture growth and solve the problem in front of you. Terramore turns visits, orders, and calls into a decision you can act on this month.",
      "Most owners have more customer information than they use. We pick the facts that answer the question, then we change the offer, the page, or the list.",
    ],
    offeringsTitle: "Our Customer Insights Services",
    offerings: [
      {
        slug: "customer-demand",
        title: "Customer Demand",
        deck: "See what customers want, what they skip, and what they will pay for, using the orders and visits you already have.",
        story: [
          "Demand work uses what people already do to show what they will buy next.",
          "We read past orders and site views. We name the offer that sells. We cut the product or class that sits.",
        ],
        help: [
          {
            title: "Read what already happened",
            body: "Orders and views, not a guess in a meeting.",
          },
          {
            title: "Name the offer that sells",
            body: "The pack, the SKU, or the class that already works stays.",
          },
          {
            title: "Cut what sits",
            body: "Space and spend go back to what people want.",
          },
        ],
      },
      {
        slug: "customer-journeys",
        title: "Customer Journeys",
        deck: "Watch the path from first look to purchase, and fix the step that breaks before you spend more on traffic.",
        story: [
          "Journey work helps you see how people move, and where they leave.",
          "We record the visit: page, cart, pay, email. You see the leak before we charge you to fix it.",
        ],
        help: [
          {
            title: "Record the path in plain language",
            body: "Page, scroll, products they view, cart, pay.",
          },
          {
            title: "Show the leak first",
            body: "You see the broken step before we change it.",
          },
          {
            title: "Keep one story",
            body: "Ads, site, and inbox say the same thing.",
          },
        ],
      },
      {
        slug: "customer-experience",
        title: "Customer Experience",
        deck: "Make the next visit easier than the last, from checkout and booking through the note they receive after.",
        story: [
          "Experience work makes shipping, booking, and follow-up feel like one brand.",
          "We fix the moment of doubt at checkout or on the phone. Then we ask them back on a day that makes sense.",
        ],
        help: [
          {
            title: "Fix the moment of doubt",
            body: "Shipping, the form, or the after-hours gap.",
          },
          {
            title: "Send the note they earned",
            body: "The first-time buyer email matches what they bought and what they viewed.",
          },
          {
            title: "Ask on the right day",
            body: "Refill and restock follow the product, not a generic calendar.",
          },
        ],
      },
    ],
    howWeHelpTitle: "How We Turn Customer Insight into Advantage",
    howWeHelp: [
      {
        title: "Questions first",
        body: "The usual approach is research that never meets the decision. We start with the question. Why did the cart die. Why did calls stop at 5. Then we pick only the facts that answer it.",
      },
      {
        title: "Watch the visit",
        body: "Page, scroll, products they view, cart, pay. Then the email that should follow. Insight that sits in a deck is waste.",
      },
      {
        title: "Act the same week",
        body: "We change the page or the list. You should feel the work on Monday, not next quarter.",
      },
    ],
    workTitle: "Our Client Work in Customer Insights",
    work: [
      {
        title: "The visit wrote the offer",
        body: "Skincare brand. We logged the product each visitor viewed. The first-time buyer email offered that item, not a random add-on.",
      },
      {
        title: "Who is ready",
        body: "Online store. We watched who noticed the brand, who came to the site, and who was close to buying. Ad spend went there, not to everyone.",
      },
    ],
  },
  {
    slug: "digital-technology-and-data",
    navTitle: "Digital and Data",
    title: "Digital, Technology, and Data",
    story: [
      "Your ads, your store, your email, and your analytics should tell one story. Most of the time they do not: the store says sold, the inbox never heard, and the ad report counts a sale that never happened. Terramore connects the tools you already have so the numbers match.",
      "You do not need new software. You need the pieces you already pay for to talk to each other. We join them, fix the broken handoff, and leave you a map of how it all connects.",
    ],
    offeringsTitle: "What We Set Up",
    offerings: [
      {
        slug: "digital-strategy",
        title: "A 90-Day Plan",
        deck: "A 90-day plan with owners and dates. What we turn on, what we cut, and how we know it worked.",
        story: [
          "A plan is one page with the owners, the dates, and the numbers we are moving.",
          "We write the 90-day map first. Each tool has one owner. The stack stays small enough for your team.",
        ],
        help: [
          {
            title: "Write the map first",
            body: "Dates, owners, and the number we are moving.",
          },
          {
            title: "One owner per tool",
            body: "Nothing is a shared mystery.",
          },
          {
            title: "Keep the stack small",
            body: "Big enough to sell. Small enough to run.",
          },
        ],
      },
      {
        slug: "data-and-analytics",
        title: "One View of Ads, Site, and Sales",
        deck: "One place to see ads, the site, and sales, so you know what to cut, scale, or rebuild.",
        story: [
          "Analytics should tell you what to cut, scale, or rebuild.",
          "We connect the ad tracking and the store. The problem is written in plain language. No vanity dashboards.",
        ],
        help: [
          {
            title: "Join the ad and the store",
            body: "The same order shows in both.",
          },
          {
            title: "Show the leak in plain language",
            body: "You can explain it to the team in one minute.",
          },
          {
            title: "No vanity view",
            body: "If it is not in the store or the CRM, it is not a fact.",
          },
        ],
      },
      {
        slug: "data-and-digital-platform",
        title: "Connect the Tools You Have",
        deck: "Use the CRM, the store, and email you have. We connect them so a lead does not vanish.",
        story: [
          "Every setup starts with the apps you already pay for.",
          "If the store says sold and the inbox never heard, you lose the next sale. We map every handoff.",
        ],
        help: [
          {
            title: "Map every handoff",
            body: "You see where the record dies.",
          },
          {
            title: "Fix the broken link first",
            body: "We do not add a platform to hide a leak.",
          },
          {
            title: "The client dashboard comes after we start",
            body: "Our client dashboard, Terra IQ, is set up for you after work starts. It is not a public sign-up.",
          },
        ],
      },
      {
        slug: "digital-maturity",
        title: "Score the Stack",
        deck: "One honest score of your tools, owners, and gaps. Then the one gap that costs money, and a list your team can run.",
        story: [
          "The score is a picture of the foundation, not a trophy.",
          "We score the stack once. We pick the gap that costs money. We leave a list.",
        ],
        help: [
          {
            title: "Score the stack once",
            body: "Tools, owners, and the leaks, in one view.",
          },
          {
            title: "Pick the gap that costs money",
            body: "Not the trend. The leak.",
          },
          {
            title: "Leave a list",
            body: "The team knows what to do next month.",
          },
        ],
      },
      {
        slug: "emerging-technologies",
        title: "Try New Tools Safely",
        deck: "Try a new tool on one job. Keep the old path until it works. Drop it if it does not help.",
        story: [
          "New technology only matters if it helps the week you already run.",
          "We try it on one job. We keep the old path until it works. We drop it if it does not help.",
        ],
        help: [
          {
            title: "Try it on one job",
            body: "One owner. One outcome.",
          },
          {
            title: "Keep the old path until it works",
            body: "Customers should not feel the experiment.",
          },
          {
            title: "Drop it if it does not help",
            body: "A failed trial is cheaper than a new platform.",
          },
        ],
      },
    ],
    howWeHelpTitle: "How We Do It",
    howWeHelp: [
      {
        title: "Start in your tools",
        body: "We work inside Google, Meta, Shopify, HubSpot, and Mailchimp. You do not start over.",
      },
      {
        title: "Outcomes you can see",
        body: "Orders, bookings, and time back. Not a new dashboard for its own sake.",
      },
      {
        title: "Data that matches the week",
        body: "Ads, the site, and sales tell the same story.",
      },
    ],
    workTitle: "Our Client Work in Digital, Technology, and Data",
    work: [
      {
        title: "Same order, two systems",
        body: "Online store. Shopify said sold. The inbox never heard, so no follow-up went out. We fixed the handoff and the next sale got its email.",
      },
      {
        title: "WordPress to Shopify",
        body: "Apparel brand. The catalog moved with the same product facts. Checkout could finish on a phone. Ads pointed at a page that worked.",
      },
    ],
  },
  {
    slug: "pricing-and-revenue-management",
    navTitle: "Pricing and Revenue",
    title: "Pricing and Revenue Management",
    story: [
      "By changing price and the timing of the ask, a company can move real value to the bottom line. Terramore helps you build the habit, the process, and the mindset that unlock pricing in good weeks and hard ones.",
      "There is no textbook price for a local shop or a small brand. We look at what customers almost bought, what they will pay, and which promo trains them to wait.",
    ],
    offeringsTitle: "Our Pricing and Revenue Management Services",
    offerings: [
      {
        slug: "b2c-pricing",
        title: "B2C Pricing",
        deck: "See what customers almost bought, offer what they viewed, and stop scaring them at shipping.",
        story: [
          "Consumer pricing is about the end buyer and the moment of doubt.",
          "We look at what they almost bought. We offer the thing they viewed. We do not scare them at shipping.",
        ],
        help: [
          {
            title: "See what they almost bought",
            body: "The cart and the views are the brief.",
          },
          {
            title: "Offer the thing they viewed",
            body: "The next ask matches the look.",
          },
          {
            title: "Do not scare them at shipping",
            body: "A surprise fee at the last step is a lost order.",
          },
        ],
      },
      {
        slug: "b2b-pricing",
        title: "B2B Pricing",
        deck: "Write the offer on one page, give sales a floor, and invoice when work starts.",
        story: [
          "B2B pricing is about saying the value in a way a buyer can approve.",
          "We write the offer on one page. Sales gets a floor. You invoice when work starts.",
        ],
        help: [
          {
            title: "Write the offer on one page",
            body: "Scope, price, and the start date are clear.",
          },
          {
            title: "Give sales a floor",
            body: "Discounting has a limit the owner set.",
          },
          {
            title: "Invoice when work starts",
            body: "Cash follows the yes, not a long chase.",
          },
        ],
      },
      {
        slug: "revenue-growth-management",
        title: "Revenue Growth Management",
        deck: "Ask on dates that match the product, keep the pack that works, and cut the promo that trains people to wait.",
        story: [
          "Growth management is the calendar of the ask, not a bigger discount.",
          "We ask on dates that match the product. We keep the pack that works. We cut the promo that trains people to wait.",
        ],
        help: [
          {
            title: "Ask on dates that match the product",
            body: "Refill and restock follow use, not a generic sale.",
          },
          {
            title: "Keep the pack that works",
            body: "The bundle that already sells stays.",
          },
          {
            title: "Cut the promo that trains people to wait",
            body: "A sale that only moves the same order later is not growth.",
          },
        ],
      },
    ],
    howWeHelpTitle: "How We Help Companies Master Pricing and Revenue Management",
    howWeHelp: [
      {
        title: "There is no textbook price",
        body: "We start with what your customers already do, then we change the ask, the pack, or the fee that stops the sale.",
      },
      {
        title: "B2B is about saying the value",
        body: "A clear page and a floor beat a long custom quote that never sends.",
      },
      {
        title: "B2C is about the end buyer",
        body: "The view, the cart, and shipping are the pricing conversation.",
      },
    ],
    workTitle: "Our Client Work in Pricing and Revenue Management",
    work: [
      {
        title: "Drive repeat purchase",
        body: "Skincare brand. The refill email went out on the day the product runs out. Repeat orders rose without a deeper discount.",
      },
      {
        title: "The pack that works",
        body: "Fitness studio. We kept the class pack that already sold and stopped the promo that only trained people to wait.",
      },
    ],
  },
  {
    slug: "operations",
    navTitle: "Operations",
    title: "Operations",
    story: [
      "Operations is the week the business actually runs. Terramore helps owners take the stuck step, give everyone the same facts, and keep the tools they already have.",
      "A smoother week is not a new platform. It is after-hours coverage, a board that fills overnight, and a promise date you can hit.",
    ],
    offeringsTitle: "Our Operations Services",
    offerings: [
      {
        slug: "service-operations",
        title: "Service Operations",
        deck: "After-hours text, a shared lead, and a board that fills overnight so morning work is already booked.",
        story: [
          "Service work dies when the phone stops and the lead sits.",
          "We add the after-hours text. Everyone sees the lead. The board fills overnight.",
        ],
        help: [
          {
            title: "After-hours coverage",
            body: "A missed call gets a booking link. Morning jobs come from that window.",
          },
          {
            title: "Everyone sees the lead",
            body: "Owner, sales, and the assistant share one record.",
          },
          {
            title: "The board fills overnight",
            body: "The calendar is not empty at 8 am.",
          },
        ],
      },
      {
        slug: "supply-chain-management",
        title: "Ship Dates You Can Hit",
        deck: "Promise dates you can hit. Do not sell a ghost date. Tell the customer when it left.",
        story: [
          "Fulfillment is a promise. A ghost date is a refund and a bad review.",
          "We promise dates you can hit. We do not sell a date you cannot ship. We tell them when it left.",
        ],
        help: [
          {
            title: "Promise dates you can hit",
            body: "The site and the warehouse agree.",
          },
          {
            title: "Do not sell a ghost date",
            body: "Live means you can fulfill.",
          },
          {
            title: "Tell them when it left",
            body: "The customer should not have to ask.",
          },
        ],
      },
      {
        slug: "operational-excellence",
        title: "Operational Excellence",
        deck: "Write the path once, cut the losing handoff, and leave a chart the team can run on Monday.",
        story: [
          "Excellence is a path the team can repeat.",
          "We write the path once. We cut the losing handoff. We leave the chart.",
        ],
        help: [
          {
            title: "Write the path once",
            body: "Everyone can see the steps from lead to done.",
          },
          {
            title: "Cut the losing handoff",
            body: "Fewer owners. Same quality.",
          },
          {
            title: "Leave the chart",
            body: "The week still works when we go.",
          },
        ],
      },
    ],
    howWeHelpTitle: "How We Unlock New Value from Operations",
    howWeHelp: [
      {
        title: "Start with the stuck step",
        body: "The phone, the board, or the ship date. We do not rebuild the company to fix one leak.",
      },
      {
        title: "Same facts for everyone",
        body: "Owner, sales, and support see the same lead and the same promise.",
      },
      {
        title: "Keep the tools you have",
        body: "We connect what you already pay for.",
      },
    ],
    workTitle: "Our Client Work in Operations",
    work: [
      {
        title: "Missed calls that still book",
        body: "Home services. Missed calls now get a text with a booking link. Morning work comes from the night window.",
      },
      {
        title: "Fill the appointment book",
        body: "Clinic. The calendar and the inbox see the same appointment. The lead does not go cold between them.",
      },
    ],
  },
  {
    slug: "cost-management",
    navTitle: "Cost Management",
    title: "Cost Management",
    story: [
      "Cost work is not a slash-and-burn exercise. Terramore helps owners see the leak first, cut what has no owner, and put the save back into the channel that produces revenue.",
      "Paid media feels expensive when it talks to everyone. Software feels expensive when nobody opens it. We list both, then we move the save.",
    ],
    offeringsTitle: "Our Cost Management Services",
    offerings: [
      {
        slug: "cost-advantage",
        title: "Cost Advantage",
        deck: "List every tool and ad set, pause what has no owner, and move the save into work that produces revenue.",
        story: [
          "Advantage comes from a clear list, not a surprise cut.",
          "We list every tool and ad set. We pause what has no owner. We move the save.",
        ],
        help: [
          {
            title: "List every tool and ad set",
            body: "You see the full bill in one place.",
          },
          {
            title: "Pause what has no owner",
            body: "If nobody can explain it, it stops.",
          },
          {
            title: "Move the save",
            body: "The money goes back into the path that works.",
          },
        ],
      },
      {
        slug: "marketing-spend",
        title: "Marketing Spend",
        deck: "Cut the old creative, keep the ads that book, and give the week one number.",
        story: [
          "Spend should follow the ads that book or sell.",
          "We cut the old videos. We keep the ads that book. The week has one number.",
        ],
        help: [
          {
            title: "Cut the old creative",
            body: "People have already seen it.",
          },
          {
            title: "Keep the ads that book",
            body: "Revenue is the filter.",
          },
          {
            title: "One number for the week",
            body: "The owner can see it without a deck.",
          },
        ],
      },
      {
        slug: "tool-stack",
        title: "Tool Stack",
        deck: "Name what people open, cancel or park the rest, and do not add a tool to hide a leak.",
        story: [
          "The stack should match the week.",
          "We name what people open. We cancel or park the rest. We do not add a tool to hide a leak.",
        ],
        help: [
          {
            title: "Name what people open",
            body: "Use is the score.",
          },
          {
            title: "Cancel or park the rest",
            body: "The bill matches the work.",
          },
          {
            title: "Do not add a tool to hide a leak",
            body: "Fix the handoff first.",
          },
        ],
      },
    ],
    howWeHelpTitle: "How We Help Build Cost Advantage",
    howWeHelp: [
      {
        title: "Show the leak first",
        body: "You see the waste before we cut. That is how trust stays.",
      },
      {
        title: "Cut, then reinvest",
        body: "A save that sits in the account is not a plan. We move it to the path that works.",
      },
      {
        title: "No repeat slash",
        body: "The list has owners so the same waste does not return next quarter.",
      },
    ],
    workTitle: "Our Client Work in Cost Management",
    work: [
      {
        title: "Paid felt expensive again",
        body: "Apparel brand. Spend moved off the audience that never buys. The same budget produced more orders.",
      },
      {
        title: "The leak on the site",
        body: "Online store. Checkout was the waste, not the ad. We fixed the page before we cut more ad spend.",
      },
    ],
  },
  {
    slug: "innovation-strategy-and-delivery",
    navTitle: "Launch Something New",
    title: "Launch Something New",
    story: [
      "A new product, a class, a second location, or a drop. Terramore helps you name who it is for, put it on one page people can buy from, and give it a date.",
      "A small first launch beats a large plan that never ships. We put the files in one folder, the offer on one page, and tell the people who already care first.",
    ],
    offeringsTitle: "How a Launch Comes Together",
    offerings: [
      {
        slug: "innovation-strategy",
        title: "Decide What to Launch",
        deck: "Name the buyer and the job it does for them. Drop the ideas that would need a second company. Put a date on the one you try.",
        story: [
          "Deciding is choosing who you serve and what you will not build.",
          "We name the buyer and the job. We drop what would need a second company. We put a date on the one you try.",
        ],
        help: [
          {
            title: "Name the buyer and the job",
            body: "The offer has a person and a reason.",
          },
          {
            title: "Drop what would need a second company",
            body: "This business cannot fund a second business. We say so early.",
          },
          {
            title: "Put a date on the one you try",
            body: "A date turns a slide into work.",
          },
        ],
      },
      {
        slug: "innovation-delivery",
        title: "Ship It",
        deck: "One folder for the files, one page they can buy from, and one list to tell first.",
        story: [
          "Shipping is files, a page, and a list.",
          "One folder for the launch. One page they can buy from. One list to tell first.",
        ],
        help: [
          {
            title: "One folder for the launch",
            body: "Photos, copy, and prices live together so the ad and the page match.",
          },
          {
            title: "One page they can buy from",
            body: "The offer is live before the ads.",
          },
          {
            title: "One list to tell first",
            body: "People who already care hear it first.",
          },
        ],
      },
      {
        slug: "business-and-scale-up",
        title: "Do It Again",
        deck: "Write down the steps that worked, hand the team the files and dates, and turn ads on after the page is real.",
        story: [
          "Scale is a copy of a path that already worked.",
          "We write the steps. We give the team the files and dates. Ads turn on after the path is real.",
        ],
        help: [
          {
            title: "Write the steps that worked",
            body: "The next drop does not start from memory.",
          },
          {
            title: "Give the team the files and dates",
            body: "Owners do not have to be in every send.",
          },
          {
            title: "Turn ads on after the path is real",
            body: "Paid should not hit a broken page.",
          },
        ],
      },
    ],
    howWeHelpTitle: "How We Do It",
    howWeHelp: [
      {
        title: "A plan and a date on the same page",
        body: "A plan without a date is a meeting. We put both on the same page.",
      },
      {
        title: "Small first",
        body: "One drop, one class, one offer. Then we copy it.",
      },
      {
        title: "The team keeps it",
        body: "Files and dates stay when we leave.",
      },
    ],
    workTitle: "Launches We Have Shipped",
    work: [
      {
        title: "A drop that shipped on time",
        body: "Apparel brand. The photos, the product page, and the email went out the same morning. The ads matched the page.",
      },
      {
        title: "The next three launches",
        body: "Fitness studio. The next three class launches had owners and dates before the first one opened.",
      },
    ],
  },
  {
    slug: "business-transformation",
    navTitle: "How We Work With You",
    title: "How We Work With You",
    story: [
      "This is the method behind every page on this site. We find the step where you lose sales, fix it, and leave a plan your team can run. We do it inside the week you already have.",
      "Owners usually call at a turning point: a new channel, a flat year, or a team that cannot see the same numbers. We start with one change, not ten.",
    ],
    offeringsTitle: "The Three Habits",
    offerings: [
      {
        slug: "always-on-transformation",
        title: "A Weekly Review",
        deck: "One review each week, one change at a time, and the same person on your account so the habit sticks.",
        story: [
          "A weekly review, not a one-time offsite.",
          "One review each week. One change, not ten. The same owner.",
        ],
        help: [
          {
            title: "One review each week",
            body: "The leak is named while it is still cheap to fix.",
          },
          {
            title: "One change, not ten",
            body: "The team can finish the work.",
          },
          {
            title: "The same owner",
            body: "Accountability does not rotate away.",
          },
        ],
      },
      {
        slug: "ninety-day-start",
        title: "The First 90 Days",
        deck: "Talk first, pay when work starts, and leave with a plan at day 90.",
        story: [
          "The first 90 days prove whether we are the right partner.",
          "We talk first. You pay when work starts. We leave the plan.",
        ],
        help: [
          {
            title: "Talk first",
            body: "We map the work before anyone pays.",
          },
          {
            title: "Pay when work starts",
            body: "No retainer for a conversation.",
          },
          {
            title: "Leave the plan",
            body: "The team knows the next 90 days.",
          },
        ],
      },
      {
        slug: "value-creation",
        title: "One Number We Are Moving",
        deck: "Name the number on day one, show it in your own tools, and stop work that does not move it.",
        story: [
          "Value is a number the owner can see.",
          "We name it on day one. We show it in your tools. We stop work that does not move it.",
        ],
        help: [
          {
            title: "Name the number on day one",
            body: "Orders, bookings, or time back.",
          },
          {
            title: "Show it in your tools",
            body: "No private dashboard you cannot open.",
          },
          {
            title: "Stop work that does not move it",
            body: "Activity is not the goal.",
          },
        ],
      },
    ],
    howWeHelpTitle: "Why It Sticks",
    howWeHelp: [
      {
        title: "Find, fix, leave the plan",
        body: "That is the whole method. The team should be able to say it in one sentence.",
      },
      {
        title: "Work in your week",
        body: "We do not ask you to pause the business to transform it.",
      },
      {
        title: "The dashboard comes after we start",
        body: "Our client dashboard, Terra IQ, is for current clients. New work starts with a talk.",
      },
    ],
    workTitle: "What It Looks Like for Clients",
    work: [
      {
        title: "The 90-day plan on the wall",
        body: "Local shop. The owner could see the first broken step, who was fixing it, and the date. They still run Monday from it.",
      },
      {
        title: "One step at a time",
        body: "Service business. They saw the broken step before we charged to fix it. Then we fixed only that.",
      },
    ],
  },
  {
    slug: "discoverability",
    navTitle: "Get Found",
    title: "Get Found",
    story: [
      "People cannot buy what they cannot find. Terramore gets the shop or the service live in more than one place, and the facts stay the same.",
      "A second store. Google Maps. Your own search. The listing sites people already open. We put you there, then we keep names, hours, and products in sync.",
    ],
    offeringsTitle: "Our Discoverability Services",
    offerings: [
      {
        slug: "multiple-stores",
        title: "Multiple Stores",
        deck: "Your store first, then Amazon, Etsy, or the next door, only when the first one can finish an order.",
        story: [
          "More than one store only helps if the first one can finish an order.",
          "We fix checkout on the main store first. Then we copy the catalog with the same facts.",
        ],
        help: [
          {
            title: "Fix the main store first",
            body: "A second door on a broken checkout is waste.",
          },
          {
            title: "Copy the catalog with the same facts",
            body: "Price and ship dates match.",
          },
          {
            title: "Do not open a door you cannot ship from",
            body: "Live means you can fulfill.",
          },
        ],
      },
      {
        slug: "google-maps",
        title: "Google Maps",
        deck: "If people look nearby, you must be on the map with hours, photos, and a path to book or call.",
        story: [
          "Local work starts on the map.",
          "We claim and clean the listing. The site and the phone match. We ask for a review after a good job.",
        ],
        help: [
          {
            title: "Claim and clean the listing",
            body: "Hours, photos, and the category are true.",
          },
          {
            title: "Match the site and the phone",
            body: "A wrong number is a lost job.",
          },
          {
            title: "Ask after a good job",
            body: "Reviews follow work you are proud of.",
          },
        ],
      },
      {
        slug: "search-and-seo",
        title: "Search and SEO",
        deck: "Your own site should show up when someone types the job, not only your name.",
        story: [
          "Search is how new people find you without a paid click every time.",
          "We fix titles and the pages that can rank. The page matches the offer. We write pages people need.",
        ],
        help: [
          {
            title: "Fix the pages that can rank",
            body: "Titles and the offer match what people type.",
          },
          {
            title: "Make the page match the offer",
            body: "They can buy or book when they land.",
          },
          {
            title: "Write pages people need",
            body: "We do not buy fake links.",
          },
        ],
      },
      {
        slug: "aggregators",
        title: "Aggregators",
        deck: "Yelp, Thumbtack, and the boards your buyers already use. Claim them. Keep them true.",
        story: [
          "Aggregators are the listing sites people already open.",
          "We list the boards that send work. We turn off the ones that only send tire kickers. Same name, same hours, same book link.",
        ],
        help: [
          {
            title: "List the boards that send work",
            body: "Keep the ones that book.",
          },
          {
            title: "Turn off the boards that waste time",
            body: "Time is a cost too.",
          },
          {
            title: "Same facts everywhere",
            body: "Name, hours, and the book link match.",
          },
        ],
      },
    ],
    howWeHelpTitle: "How We Help You Get Found",
    howWeHelp: [
      {
        title: "More than one door",
        body: "Stores for product. Maps and boards for services. Search for both. If you only show up when someone types your name, you are invisible.",
      },
      {
        title: "Same facts everywhere",
        body: "If the price or the hours change, every listing changes. That is how trust stays.",
      },
      {
        title: "Found, then followed",
        body: "A listing that cannot book or buy is a leak. We wire the next step.",
      },
    ],
    workTitle: "Our Client Work in Discoverability",
    work: [
      {
        title: "Maps, search, and stores",
        body: "Home goods shop. It only showed up when someone typed its name. Now it is live on Maps, search, and the stores people open first. Hours and prices match in every place.",
      },
    ],
  },
  {
    slug: "audience",
    navTitle: "Audience",
    title: "Audience",
    story: [
      "Talk to people who will buy. Terramore watches who notices you, who comes to the site, and who is ready. Then ads and email go to those people.",
      "Spend on everyone is how paid media feels expensive. We build a short list of people who already looked, then we reach them again.",
    ],
    offeringsTitle: "Our Audience Services",
    offerings: [
      {
        slug: "notice-you",
        title: "Notice You",
        deck: "See who taps the ad or the post, and who never comes back, so creative and budget follow what works.",
        story: [
          "The first clock is notice. Who taps, and who never returns.",
          "We keep the creative that brings new people. We pause the videos they have already seen.",
        ],
        help: [
          {
            title: "Keep what brings new people",
            body: "The creative that works stays.",
          },
          {
            title: "Pause what they have seen",
            body: "The old videos stop.",
          },
          {
            title: "Name the city and the channel",
            body: "You know where notice comes from.",
          },
        ],
      },
      {
        slug: "on-the-site",
        title: "On the Site",
        deck: "Watch the visit. Products they view. Carts they leave. Purchases they finish.",
        story: [
          "The second clock is the visit.",
          "We record the path. The next email uses that look. We do not guess the upsell.",
        ],
        help: [
          {
            title: "Record the path",
            body: "Page, products, cart, pay.",
          },
          {
            title: "Use that look in the next email",
            body: "The product they viewed is the ask.",
          },
          {
            title: "Do not guess the upsell",
            body: "The visit is the brief.",
          },
        ],
      },
      {
        slug: "ready-to-buy",
        title: "Ready to Buy",
        deck: "A short list of people who are close. Ads and sales go there first.",
        story: [
          "Ready is the list that matters.",
          "Views, visits, and replies make the score. Sales gets the names. Spend follows that list.",
        ],
        help: [
          {
            title: "Score from views, visits, and replies",
            body: "Close is a fact, not a feeling.",
          },
          {
            title: "Give sales the ready list",
            body: "They call the people who are close.",
          },
          {
            title: "Spend follows the list",
            body: "Paid does not go to everyone.",
          },
        ],
      },
      {
        slug: "paid-reach",
        title: "Paid Reach",
        deck: "Reach, leads, deals, and purchases in one view. Cut the audience that never buys.",
        story: [
          "Paid reach is the last clock. Reach, leads, deals, and purchases in one view.",
          "Numbers light when they are ready. No invented percents. We cut the audience that never buys.",
        ],
        help: [
          {
            title: "Light the number when they are ready",
            body: "The card stays dim until the list is true.",
          },
          {
            title: "No invented percents",
            body: "We do not invent a win.",
          },
          {
            title: "Cut the crowd that never buys",
            body: "That is how paid gets cheaper.",
          },
        ],
      },
    ],
    howWeHelpTitle: "How We Help You Reach the Right People",
    howWeHelp: [
      {
        title: "Four steps, no skipping",
        body: "Notice you. On the site. The city. Ready. We do not skip a step. Talking to everyone is how paid feels expensive.",
      },
      {
        title: "Then more people buy",
        body: "Reach, leads, deals, and purchases go up after the list is true. Spend follows people who already looked.",
      },
      {
        title: "Same story as the visit",
        body: "If they viewed a product, that is the ask. The email and the ad match the look.",
      },
    ],
    workTitle: "Our Client Work in Audience",
    work: [
      {
        title: "Wrong people, fixed",
        body: "Apparel brand. The list of people close to buying went live. Ad spend moved to people who already looked. Paid stopped feeling like a tax on the whole city.",
      },
    ],
  },
]

export function getCapability(slug: string) {
  return CAPABILITIES.find((item) => item.slug === slug)
}

export function getOffering(capabilitySlug: string, offeringSlug: string) {
  const capability = getCapability(capabilitySlug)
  if (!capability) return null
  const offering = capability.offerings.find((item) => item.slug === offeringSlug)
  if (!offering) return null
  return { capability, offering }
}

export function capabilityPath(slug: string) {
  return `/solutions/${slug}`
}

export function offeringPath(capabilitySlug: string, offeringSlug: string) {
  return `/solutions/${capabilitySlug}/${offeringSlug}`
}

export const DEFAULT_CAPABILITY_PATH = capabilityPath(CAPABILITIES[0].slug)

export type OwnerJob = {
  label: string
  href: string
  deck: string
}

// The jobs owners ask for, in their words. Each one points at the page that does it.
export const OWNER_JOBS: OwnerJob[] = [
  {
    label: "Sell more from the store",
    href: capabilityPath("marketing-and-sales"),
    deck: "Ads, the store, and follow-up as one path. More carts finish.",
  },
  {
    label: "Fill the appointment book",
    href: capabilityPath("operations"),
    deck: "Missed calls and after-hours texts turn into booked jobs.",
  },
  {
    label: "Bring customers back",
    href: "/integrations/email-marketing",
    deck: "The next email offers what they already looked at or are due to buy again.",
  },
  {
    label: "Get found online",
    href: capabilityPath("discoverability"),
    deck: "Maps, search, a second store, and the listing sites people already open.",
  },
  {
    label: "Reach people ready to buy",
    href: capabilityPath("audience"),
    deck: "Ads go to people who already looked, not the whole city.",
  },
  {
    label: "Spend less on tools and ads",
    href: capabilityPath("cost-management"),
    deck: "See the waste first, cut what has no owner, move the money to what sells.",
  },
]
