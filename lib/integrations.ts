export type HelpItem = {
  title: string
  body: string
}

export type IntegrationTool = {
  slug: string
  title: string
  icon: string
  deck: string
  story: string[]
  help: HelpItem[]
}

export type IntegrationCategory = {
  slug: string
  navTitle: string
  title: string
  story: string[]
  toolsTitle: string
  tools: IntegrationTool[]
  connectTitle: string
  connect: HelpItem[]
  revenueTitle: string
  revenue: HelpItem[]
}

export const INTEGRATION_LOGOS = [
  { name: "Google", slug: "google" },
  { name: "Meta", slug: "meta" },
  { name: "Shopify", slug: "shopify" },
  { name: "TikTok", slug: "tiktok" },
  { name: "YouTube", slug: "youtube" },
  { name: "Instagram", slug: "instagram" },
  { name: "Facebook", slug: "facebook" },
  { name: "X", slug: "x" },
  { name: "Pinterest", slug: "pinterest" },
  { name: "Reddit", slug: "reddit" },
  { name: "Snapchat", slug: "snapchat" },
  { name: "WhatsApp", slug: "whatsapp" },
  { name: "Spotify", slug: "spotify" },
  { name: "Google Ads", slug: "googleads" },
  { name: "Google Analytics", slug: "googleanalytics" },
  { name: "Mailchimp", slug: "mailchimp" },
  { name: "HubSpot", slug: "hubspot" },
  { name: "Stripe", slug: "stripe" },
  { name: "Notion", slug: "notion" },
  { name: "Zapier", slug: "zapier" },
  { name: "Calendly", slug: "calendly" },
  { name: "WordPress", slug: "wordpress" },
  { name: "WooCommerce", slug: "woocommerce" },
  { name: "Zoom", slug: "zoom" },
  { name: "Figma", slug: "figma" },
  { name: "Airtable", slug: "airtable" },
  { name: "Gmail", slug: "gmail" },
  { name: "PayPal", slug: "paypal" },
  { name: "Square", slug: "square" },
  { name: "Etsy", slug: "etsy" },
  { name: "eBay", slug: "ebay" },
  { name: "Discord", slug: "discord" },
  { name: "Messenger", slug: "messenger" },
  { name: "GitHub", slug: "github" },
  { name: "Apple", slug: "apple" },
  { name: "Twitch", slug: "twitch" },
] as const

export const INTEGRATION_CATEGORIES: IntegrationCategory[] = [
  {
    slug: "email-marketing",
    navTitle: "Email Marketing",
    title: "Email Marketing",
    story: [
      "Email is the channel you own. Terramore connects it to the store and the visit so a first-time buyer, a leftover cart, or a refill date gets the next right note.",
      "If Mailchimp or HubSpot is already in the stack, we work inside it. If email is missing, we introduce the smallest tool that can send from your list. The point is not another login. It is a message that becomes an order.",
    ],
    toolsTitle: "The Software",
    tools: [
      {
        slug: "mailchimp",
        title: "Mailchimp",
        icon: "mailchimp",
        deck: "Lists, automations, and first-time buyer notes that start from a paid order, not a guess.",
        story: [
          "Mailchimp is already on many small-business stacks. We connect it to the store so a purchase writes the next email.",
          "If you do not have it, we introduce it only when a list and a first automation will produce revenue. You do not get a tool for its own sake.",
        ],
        help: [
          {
            title: "Connect to the store you have",
            body: "A paid order in Shopify or WooCommerce should land on the same list, with the product they viewed still attached.",
          },
          {
            title: "Introduce it if email is missing",
            body: "If there is no list, we stand up Mailchimp, move contacts you already have, and start with one path: welcome or first-time buyer.",
          },
          {
            title: "Turn the send into revenue",
            body: "The note offers what they already looked at or are due to buy again. Opens are not the win. A repeat order or a booking is.",
          },
        ],
      },
      {
        slug: "hubspot",
        title: "HubSpot",
        icon: "hubspot",
        deck: "CRM and email in one place, so sales and marketing see the same lead and the same next step.",
        story: [
          "HubSpot is useful when email and the pipeline need to share one record. We connect it to the inbox, the calendar, and the store.",
          "If you already pay for HubSpot, we use it. If the CRM is a spreadsheet, we only move you here when the volume of leads needs a shared view.",
        ],
        help: [
          {
            title: "Connect to what you already run",
            body: "Gmail, the calendar, and the store feed the same contact. A lead does not live in three places.",
          },
          {
            title: "Introduce it when the pipeline is the leak",
            body: "If follow-up dies in a shared inbox, HubSpot becomes the one record. We do not migrate for the logo.",
          },
          {
            title: "Turn the record into revenue",
            body: "Every contact has a next step: a send, a hold, or a close. Mystery leads stop sitting still.",
          },
        ],
      },
      {
        slug: "gmail",
        title: "Gmail",
        icon: "gmail",
        deck: "The inbox you already live in. We keep it in the path so a customer reply does not vanish.",
        story: [
          "Most owners already work in Gmail. We do not take you out of it. We make sure the same lead shows up in email, the CRM, and the calendar.",
          "If Gmail is the only system, we start there. A new platform waits until the inbox can hand a lead off without losing it.",
        ],
        help: [
          {
            title: "Keep the inbox in the path",
            body: "Replies, invoices, and booking notes stay attached to the same customer.",
          },
          {
            title: "Add a list only when Gmail is not enough",
            body: "One-to-one mail stays in Gmail. Broadcast and automations move to Mailchimp or HubSpot when the list needs it.",
          },
          {
            title: "A reply should become a hold or an order",
            body: "The inbox is not a archive. It is a door to a booked time or a paid cart.",
          },
        ],
      },
    ],
    connectTitle: "How We Connect It",
    connect: [
      {
        title: "Start with the list you have",
        body: "Contacts from the store, the inbox, and paper forms. We do not ask you to start a new list from zero.",
      },
      {
        title: "Fill the gap, do not replace the stack",
        body: "If email is missing, we add the smallest tool. If it is already there, we wire the store and the visit into it.",
      },
      {
        title: "One customer, one next note",
        body: "The visit writes the brief. The send matches what they viewed or bought.",
      },
    ],
    revenueTitle: "How It Becomes Revenue",
    revenue: [
      {
        title: "First-time buyer follow-up",
        body: "After the confirmation, the next email offers the product they already viewed. The visit paid for the ask.",
      },
      {
        title: "Carts and refills",
        body: "A leftover cart and a due date are revenue sitting in the list. We send those before we buy more ads.",
      },
    ],
  },
  {
    slug: "communications",
    navTitle: "Calls, texts, and chat",
    title: "Calls, Texts, and Chat",
    story: [
      "Calls, texts, and chat are how a service business takes work after hours. Terramore connects the phone, WhatsApp, and Messenger to the calendar so a missed call can still become a booked job.",
      "If you already text customers, we stay in that channel. If nights go quiet, we introduce a simple reply that sends a booking link. The owner does not need to live on the phone at 9 pm.",
    ],
    toolsTitle: "The Software",
    tools: [
      {
        slug: "whatsapp",
        title: "WhatsApp",
        icon: "whatsapp",
        deck: "The thread customers already open. Booking links and order updates without a new app for them.",
        story: [
          "Many customers already write on WhatsApp. We keep the conversation there and attach it to the calendar and the CRM.",
          "If you do not use it, we only add it when your buyers already live there. We do not invent a channel they will ignore.",
        ],
        help: [
          {
            title: "Connect to the calendar you have",
            body: "A yes on WhatsApp should become a hold the team can see.",
          },
          {
            title: "Introduce it where the customer already is",
            body: "If the phone is the only door, we add WhatsApp as a second door, not a replacement.",
          },
          {
            title: "A thread that books",
            body: "Updates and holds. Not a chat that dies in the owner’s pocket.",
          },
        ],
      },
      {
        slug: "messenger",
        title: "Messenger",
        icon: "messenger",
        deck: "Facebook and Instagram replies that become a lead, a hold, or an order, not a forgotten DM.",
        story: [
          "Ads send people into Messenger. We connect that inbox to the same lead the owner and sales can see.",
          "If DMs are the leak, we add a simple next step: a book link or a store link. We do not add a helpdesk you will not open.",
        ],
        help: [
          {
            title: "Connect ads to the inbox",
            body: "A Meta click should land in a thread the team can answer.",
          },
          {
            title: "Introduce a next step if DMs sit",
            body: "If nobody answers after hours, an automatic book or buy link covers the gap.",
          },
          {
            title: "A DM that pays",
            body: "The thread ends in a hold or a checkout, not a thank you.",
          },
        ],
      },
      {
        slug: "gmail",
        title: "Gmail",
        icon: "gmail",
        deck: "Email replies sit next to texts and chat so the same customer is not split across inboxes.",
        story: [
          "Communications is not only SMS. Gmail is still how many customers write back. We keep it in the same path.",
          "If the inbox is chaos, we do not replace Gmail. We attach it to the CRM and the calendar so a reply has an owner.",
        ],
        help: [
          {
            title: "Same customer across channels",
            body: "A WhatsApp yes and a Gmail question should point at one record.",
          },
          {
            title: "Add chat only when email is not the door",
            body: "Some buyers will only text. We add that channel. We do not force everyone into one app.",
          },
          {
            title: "A reply with a next step",
            body: "Every thread gets a hold, an invoice, or a clear no.",
          },
        ],
      },
    ],
    connectTitle: "How We Connect It",
    connect: [
      {
        title: "Use the number and the apps you have",
        body: "The business phone, WhatsApp, and Messenger stay. We wire them to the calendar.",
      },
      {
        title: "Cover the hours you cannot sit on the phone",
        body: "If nights are quiet, we add a text that sends a book link. If the team already replies, we do not add noise.",
      },
      {
        title: "One lead, every channel",
        body: "Owner, sales, and the assistant see the same name.",
      },
    ],
    revenueTitle: "How It Becomes Revenue",
    revenue: [
      {
        title: "After-hours bookings",
        body: "A missed call gets a book link. Morning jobs come from that window.",
      },
      {
        title: "DMs that close",
        body: "Ad replies stop dying in Messenger. They become a hold or a checkout.",
      },
    ],
  },
  {
    slug: "advertising",
    navTitle: "Advertising",
    title: "Advertising",
    story: [
      "Paid media only pays when the click can finish. Terramore connects Google Ads, Meta, TikTok, and the rest to the store and the list so spend follows people who already showed interest.",
      "If you already buy ads, we work in those accounts. If a channel is missing and your buyer is there, we open it with the same tracking code and the same offer. Views are not the win. An order or a booking is.",
    ],
    toolsTitle: "The Software",
    tools: [
      {
        slug: "google-ads",
        title: "Google Ads",
        icon: "googleads",
        deck: "Search and YouTube spend tied to the page that can finish, and to the order that actually paid.",
        story: [
          "Google Ads is how people who already want the job find you. We connect the account to Analytics and the store.",
          "If you do not have it, we open it when search is a real door. We do not start a campaign to a page that cannot convert.",
        ],
        help: [
          {
            title: "Connect to the site and the store",
            body: "The same conversion shows in Google and in Shopify or the CRM.",
          },
          {
            title: "Introduce it when search is the leak",
            body: "If people type the job and you are invisible, we open the account and point it at a page that books or sells.",
          },
          {
            title: "Pay for orders, not clicks",
            body: "We keep the queries that buy. We pause the ones that only cost.",
          },
        ],
      },
      {
        slug: "meta",
        title: "Meta",
        icon: "meta",
        deck: "Facebook and Instagram ads built from people who already visited, not from everyone in the city.",
        story: [
          "Meta is useful when you can talk to people who already looked. We connect the Meta tracking code (the pixel) to the store and your email list.",
          "If your Meta ad account already exists, we use it. If it does not, we set it up with the same events the site already tracks.",
        ],
        help: [
          {
            title: "Connect the tracking code to the purchase",
            body: "A paid order should train the next ad. A view should not.",
          },
          {
            title: "Introduce Meta when the buyer is already there",
            body: "If Instagram is the door, we open ads on that door. We do not add a network your customer ignores.",
          },
          {
            title: "Spend on people who already looked",
            body: "Retarget the visit. Cut the audience that never buys.",
          },
        ],
      },
      {
        slug: "tiktok",
        title: "TikTok",
        icon: "tiktok",
        deck: "Short-form ads that send people to a page they can finish, not to a profile that cannot sell.",
        story: [
          "TikTok works when the ad and the landing page tell the same story. We connect the TikTok tracking code to the store.",
          "If you already post, we can turn the posts that work into spend. If the channel is new, we try one offer before we scale.",
        ],
        help: [
          {
            title: "Connect creative to checkout",
            body: "The product in the video is the product on the page.",
          },
          {
            title: "Introduce it on one offer",
            body: "We do not open five ad sets on day one.",
          },
          {
            title: "Keep what sells",
            body: "The video that books stays. The rest pause.",
          },
        ],
      },
      {
        slug: "pinterest",
        title: "Pinterest",
        icon: "pinterest",
        deck: "Intent that lasts longer than a feed. Catalog and pins pointed at a page that can sell.",
        story: [
          "Pinterest is a planning channel. We connect the catalog so a pin can become a cart.",
          "If your buyer already pins, we open it. If they do not, we do not buy traffic for the logo.",
        ],
        help: [
          {
            title: "Connect the catalog you have",
            body: "Price and availability match the store.",
          },
          {
            title: "Introduce it for product businesses that already get saved",
            body: "Organic pins first. Ads after the page can finish.",
          },
          {
            title: "A pin that checks out",
            body: "Saves are not revenue. The cart is.",
          },
        ],
      },
    ],
    connectTitle: "How We Connect It",
    connect: [
      {
        title: "Work in the accounts you already pay for",
        body: "Google, Meta, TikTok. We do not rebuild your ad accounts for sport.",
      },
      {
        title: "Open a channel only when the buyer is there",
        body: "A missing network is not a gap if your customer is not on it. Missing tracking on a live channel is a gap.",
      },
      {
        title: "Same offer on the ad and the page",
        body: "If they clicked the pack, they land on the pack.",
      },
    ],
    revenueTitle: "How It Becomes Revenue",
    revenue: [
      {
        title: "Clicks that can finish",
        body: "Spend points at checkout or a book link, not at a page that scares people.",
      },
      {
        title: "Audiences that already looked",
        body: "Your email list and the site tracking feed the next ad. Paid stops feeling like a tax on the whole city.",
      },
    ],
  },
  {
    slug: "ecommerce",
    navTitle: "Ecommerce",
    title: "Ecommerce",
    story: [
      "The store is where traffic becomes cash. Terramore connects Shopify, WooCommerce, or WordPress to ads, email, and payments so a visit can finish and the next note already knows what they bought.",
      "If the store exists, we fix the leak on that store first. If you are still on a site that cannot take money, we introduce the smallest commerce setup that can. A second door waits until the first one can complete an order.",
    ],
    toolsTitle: "The Software",
    tools: [
      {
        slug: "shopify",
        title: "Shopify",
        icon: "shopify",
        deck: "Catalog, checkout, and order data that ads and email can use the same day.",
        story: [
          "Shopify is the store we see most. We connect it to ads, Mailchimp or HubSpot, and the payment you already use.",
          "If you are on WordPress with no checkout, we move commerce here when the catalog is ready. We do not migrate for a theme.",
        ],
        help: [
          {
            title: "Connect the stack you have",
            body: "Ad tracking, the email list, and Stripe or PayPal see the same paid order.",
          },
          {
            title: "Introduce Shopify when the site cannot sell",
            body: "A brochure site gets a store. The catalog comes with it. Ads wait until checkout works.",
          },
          {
            title: "A cart that becomes an order",
            body: "Shipping, the form, and the confirmation are the revenue work.",
          },
        ],
      },
      {
        slug: "woocommerce",
        title: "WooCommerce",
        icon: "woocommerce",
        deck: "Commerce on the WordPress site you already run, wired to the same ads and list.",
        story: [
          "If WordPress is the site, WooCommerce can be the register. We connect it instead of forcing a move.",
          "If WooCommerce is broken, we fix checkout first. A new platform is the last option, not the first.",
        ],
        help: [
          {
            title: "Stay on WordPress when it can sell",
            body: "The theme, the catalog, and the payment stay. We wire the leaks.",
          },
          {
            title: "Introduce Woo only when the site has no register",
            body: "A content site that needs to sell gets Woo, not a second brand.",
          },
          {
            title: "Orders that show up everywhere",
            body: "The list and the ads see the same purchase.",
          },
        ],
      },
      {
        slug: "wordpress",
        title: "WordPress",
        icon: "wordpress",
        deck: "The site many owners already have. We make it able to book or sell, or we move commerce off it on purpose.",
        story: [
          "WordPress is often the brochure. We decide if it should take money or send people to Shopify.",
          "If pages rank, we keep them. We do not throw away search to chase a new theme.",
        ],
        help: [
          {
            title: "Keep the pages that already work",
            body: "Titles and offers stay. Checkout is the change.",
          },
          {
            title: "Add commerce or a book link if it is missing",
            body: "A contact form is not a store. We add the door that takes money or time.",
          },
          {
            title: "Traffic that can finish",
            body: "Search and ads should land on a page that converts.",
          },
        ],
      },
      {
        slug: "etsy",
        title: "Etsy",
        icon: "etsy",
        deck: "A second door only after the main store can finish an order, with the same facts.",
        story: [
          "Etsy is a channel, not the company. We copy the catalog when the first store is clean.",
          "If Etsy is the only store, we still connect email and ads to those orders. Then we decide if you need a site you own.",
        ],
        help: [
          {
            title: "Match price and ship dates",
            body: "The same product cannot tell two stories.",
          },
          {
            title: "Introduce Etsy after checkout works at home",
            body: "A second door on a broken first door is waste.",
          },
          {
            title: "Orders you can follow up",
            body: "The list should still see the buyer.",
          },
        ],
      },
    ],
    connectTitle: "How We Connect It",
    connect: [
      {
        title: "Fix the store you have",
        body: "Shopify, Woo, or a marketplace. We do not open a second register until this one can finish.",
      },
      {
        title: "Introduce commerce only when money has no door",
        body: "A site without checkout gets a store. A store without a list gets email. In that order.",
      },
      {
        title: "One order across tools",
        body: "Ads, email, and the inbox all see the same paid cart.",
      },
    ],
    revenueTitle: "How It Becomes Revenue",
    revenue: [
      {
        title: "Checkout that finishes",
        body: "Shipping and doubt at the last step are the leak. Fixing that page is often more revenue than another ad.",
      },
      {
        title: "The visit writes the next ask",
        body: "What they viewed in the store becomes the email and the retarget.",
      },
    ],
  },
  {
    slug: "payments",
    navTitle: "Payments",
    title: "Payments",
    story: [
      "A sale is not real until the money lands and the rest of the stack hears it. Terramore connects Stripe, PayPal, or Square to the store and the list so a paid order does not vanish between tools.",
      "If the processor is already in checkout, we keep it. If people cannot pay the way they expect, we add the rail they already use. The goal is a captured payment that starts follow-up the same day.",
    ],
    toolsTitle: "The Software",
    tools: [
      {
        slug: "stripe",
        title: "Stripe",
        icon: "stripe",
        deck: "Cards and checkout that report the same paid order to the store, the list, and the books.",
        story: [
          "Stripe is the rail under many Shopify and custom checkouts. We make sure a successful charge writes the next step.",
          "If you invoice by hand, we introduce Stripe when cards should hit the same day work starts.",
        ],
        help: [
          {
            title: "Connect the charge to the order",
            body: "Shopify, the CRM, and email all see paid. A success page is not enough.",
          },
          {
            title: "Introduce cards if you still chase invoices",
            body: "A pay link at the yes is faster than a PDF that sits.",
          },
          {
            title: "Paid means the path continues",
            body: "The confirmation, the first-time buyer email, and the ad tracking all fire.",
          },
        ],
      },
      {
        slug: "paypal",
        title: "PayPal",
        icon: "paypal",
        deck: "The pay button customers already trust, wired so the store still owns the order.",
        story: [
          "Some buyers will only pay with PayPal. We keep that button and still attach the order to the list.",
          "If PayPal is missing and carts die at card, we add it. We do not remove Stripe to do it.",
        ],
        help: [
          {
            title: "Keep the button in checkout",
            body: "The store remains the system of record.",
          },
          {
            title: "Add it when card fear is the leak",
            body: "A second rail at the last step is cheaper than more ads.",
          },
          {
            title: "The same order, either rail",
            body: "Follow-up does not care which button they used.",
          },
        ],
      },
      {
        slug: "square",
        title: "Square",
        icon: "square",
        deck: "In-person and online payments in one view, so a counter sale can still start an email.",
        story: [
          "Square is how many shops take money at the counter. We connect those sales to the list when we can.",
          "If online and the counter tell two stories, we join them. A customer should not be new twice.",
        ],
        help: [
          {
            title: "Connect the counter to the list",
            body: "A paid ticket can still earn a first-time buyer note.",
          },
          {
            title: "Introduce online pay if the counter is the only rail",
            body: "A remote buyer needs a link. Square or Stripe can be that link.",
          },
          {
            title: "One customer in the shop and on the site",
            body: "Repeat purchase does not start from zero after they walk in.",
          },
        ],
      },
    ],
    connectTitle: "How We Connect It",
    connect: [
      {
        title: "Keep the processor you already trust",
        body: "Stripe, PayPal, or Square. We wire the event, not a new bank relationship.",
      },
      {
        title: "Add a rail only when carts die at pay",
        body: "If they want PayPal and you only have cards, that is the gap.",
      },
      {
        title: "Paid is a fact the stack can use",
        body: "Ads, email, and the inbox hear it the same day.",
      },
    ],
    revenueTitle: "How It Becomes Revenue",
    revenue: [
      {
        title: "Fewer carts lost at the last step",
        body: "The pay button they trust is the one we keep or add.",
      },
      {
        title: "A paid order that starts the next sale",
        body: "Confirmation is not the end. It is the start of the note that brings them back.",
      },
    ],
  },
  {
    slug: "analytics",
    navTitle: "Analytics",
    title: "Analytics",
    story: [
      "Analytics should tell you what to cut, scale, or rebuild. Terramore connects Google Analytics, ads, and the store so the leak is in plain language, not a vanity dashboard.",
      "If tracking is already on the site, we use it. If ads and the store disagree, we join them. A new tool waits until the facts you already have can explain the week.",
    ],
    toolsTitle: "The Software",
    tools: [
      {
        slug: "google-analytics",
        title: "Google Analytics",
        icon: "googleanalytics",
        deck: "The visit, the cart, and the purchase in one view, tied to the ads that sent them.",
        story: [
          "GA is on most sites. We make it match the store so a purchase is a fact, not a guess.",
          "If it is missing, we add it before we scale ads. You should see the leak before you buy more traffic.",
        ],
        help: [
          {
            title: "Connect to ads and the store",
            body: "The same order shows in Analytics and in Shopify or the CRM.",
          },
          {
            title: "Introduce it before more spend",
            body: "A site without measurement gets the tag first. Campaigns second.",
          },
          {
            title: "Decisions that move money",
            body: "Cut the page or the query that does not convert. Keep the one that does.",
          },
        ],
      },
      {
        slug: "google",
        title: "Google",
        icon: "google",
        deck: "Tags, Search Console, and the Google stack you already signed into, used as one story.",
        story: [
          "Google is more than ads. Search Console and the tag sit next to Analytics. We keep them together.",
          "If login is a mess of old accounts, we clean that before we trust the numbers.",
        ],
        help: [
          {
            title: "One Google story",
            body: "Search, ads, and the site agree on what happened.",
          },
          {
            title: "Fix access if the facts are locked",
            body: "An owner who cannot open Analytics cannot run the week.",
          },
          {
            title: "Queries that can pay",
            body: "We send search traffic to a page that books or sells.",
          },
        ],
      },
      {
        slug: "zapier",
        title: "Zapier",
        icon: "zapier",
        deck: "The bridge when two tools will not talk. A lead, an order, or a book should still arrive.",
        story: [
          "Zapier is for the handoff the native apps will not do. We use it to move a fact, not to build a second company in zaps.",
          "If the native connection exists, we use that first. Zapier fills the gap.",
        ],
        help: [
          {
            title: "Connect the broken handoff",
            body: "Store to list. Form to calendar. Inbox to CRM.",
          },
          {
            title: "Introduce a zap only when the native link is missing",
            body: "Fewer zaps. The ones that move money.",
          },
          {
            title: "A lead that does not die in the gap",
            body: "The next person sees it in time to close.",
          },
        ],
      },
    ],
    connectTitle: "How We Connect It",
    connect: [
      {
        title: "Join the numbers you already have",
        body: "Ads, the site, and sales. If they disagree, we fix the join before we add a dashboard.",
      },
      {
        title: "Add measurement before more media",
        body: "A missing tag is cheaper to fix than a month of blind spend.",
      },
      {
        title: "Plain language for the owner",
        body: "You should explain the leak in one minute.",
      },
    ],
    revenueTitle: "How It Becomes Revenue",
    revenue: [
      {
        title: "Cut what does not pay",
        body: "Queries, pages, and audiences that never convert lose budget.",
      },
      {
        title: "Scale what already sells",
        body: "The path that produces orders gets the next dollar.",
      },
    ],
  },
  {
    slug: "scheduling",
    navTitle: "Scheduling",
    title: "Scheduling",
    story: [
      "Time on the calendar is inventory. Terramore connects Calendly, Zoom, and the inbox so a lead can take a hold without a back-and-forth that dies overnight.",
      "If you already book by link, we keep that link and attach it to ads, email, and the CRM. If people still email to ask for times, we introduce a scheduler. A booked hour is the revenue.",
    ],
    toolsTitle: "The Software",
    tools: [
      {
        slug: "calendly",
        title: "Calendly",
        icon: "calendly",
        deck: "A book link that ads, email, and after-hours texts can send, with the hold visible to the team.",
        story: [
          "Calendly is the simplest door to a hold. We put the link where the lead already is.",
          "If you book by email tennis, we introduce Calendly so the night lead can still pick a time.",
        ],
        help: [
          {
            title: "Connect the link to the path",
            body: "Ads, Mailchimp, WhatsApp, and the site send the same calendar.",
          },
          {
            title: "Introduce it when back-and-forth is the leak",
            body: "A missed call or a late email should still book.",
          },
          {
            title: "A hold the team can see",
            body: "Owner and sales share the week. No mystery appointments.",
          },
        ],
      },
      {
        slug: "zoom",
        title: "Zoom",
        icon: "zoom",
        deck: "The room for the consult. The hold, the link, and the follow-up sit together.",
        story: [
          "Zoom is the meeting. We attach it to the calendar so a booked consult has a room and a next step.",
          "If you already use Zoom, we keep it. We do not move you to a new video tool.",
        ],
        help: [
          {
            title: "Connect the room to the hold",
            body: "Calendly or the inbox creates the Zoom. Nobody hunts for a link.",
          },
          {
            title: "Introduce video only if consults are remote",
            body: "A shop that books in person does not need Zoom. A consultant does.",
          },
          {
            title: "The consult that closes",
            body: "Show-up and a next step. The hour should end in a yes, a no, or a dated follow-up.",
          },
        ],
      },
    ],
    connectTitle: "How We Connect It",
    connect: [
      {
        title: "One book link everywhere",
        body: "Site, ads, email, and texts. People should not hunt for a time.",
      },
      {
        title: "Add a scheduler if the inbox is the calendar",
        body: "Email tennis loses night leads. A link does not.",
      },
      {
        title: "The hold shows up for the team",
        body: "CRM and inbox see the same appointment.",
      },
    ],
    revenueTitle: "How It Becomes Revenue",
    revenue: [
      {
        title: "Leads that take a time",
        body: "A book link after the ad or the missed call fills the week.",
      },
      {
        title: "Consults that do not go cold",
        body: "The room exists. The follow-up exists. The hour can close.",
      },
    ],
  },
]

export function getIntegrationCategory(slug: string) {
  return INTEGRATION_CATEGORIES.find((item) => item.slug === slug)
}

export function getIntegrationTool(categorySlug: string, toolSlug: string) {
  const category = getIntegrationCategory(categorySlug)
  if (!category) return null
  const tool = category.tools.find((item) => item.slug === toolSlug)
  if (!tool) return null
  return { category, tool }
}

export function integrationPath(slug: string) {
  return `/integrations/${slug}`
}

export function integrationToolPath(categorySlug: string, toolSlug: string) {
  return `/integrations/${categorySlug}/${toolSlug}`
}

export const DEFAULT_INTEGRATION_PATH = integrationPath(INTEGRATION_CATEGORIES[0].slug)
