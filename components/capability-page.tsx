import { CAPABILITY_HEROES } from "@/lib/capability-heroes"
import { offeringPath, type Capability, type CapabilityOffering } from "@/lib/capabilities"
import { SiteFooter } from "@/components/site-footer"
import { StoryCta, StoryHero, StoryLinkList, StoryNextStep, StorySection } from "@/components/story-page"
import { StoryRevealTiles } from "@/components/story-reveal-tiles"

function ServiceNextStep() {
  return <StoryNextStep surface="service" />
}

export function CapabilityPage({ capability }: { capability: Capability }) {
  const image = CAPABILITY_HEROES[capability.slug]

  return (
    <div className="min-h-screen bg-cream">
      <StoryHero
        title={capability.title}
        lede={capability.story[0]}
        follow={capability.story[1]}
        image={image}
        imageAlt={capability.title}
        parent={{ href: "/solutions", label: "Solutions" }}
        next={<ServiceNextStep />}
      />
      <StorySection title={capability.offeringsTitle}>
        <StoryRevealTiles
          image={image}
          imageAlt={capability.title}
          items={capability.offerings.map((offering) => ({
            title: offering.title,
            body: offering.deck,
          }))}
        />
        <div className="mt-8">
          <StoryLinkList
            label={`All ${capability.title} services`}
            items={capability.offerings.map((offering) => ({
              href: offeringPath(capability.slug, offering.slug),
              title: offering.title,
            }))}
          />
        </div>
      </StorySection>
      <StorySection title={capability.howWeHelpTitle}>
        <StoryRevealTiles image={image} imageAlt={capability.title} items={capability.howWeHelp} />
      </StorySection>
      <StorySection title={capability.workTitle}>
        <StoryRevealTiles image={image} imageAlt={capability.title} items={capability.work} />
      </StorySection>
      <StoryCta mode="lookup" />
      <SiteFooter showDualCtas={false} />
    </div>
  )
}

export function OfferingPage({
  capability,
  offering,
}: {
  capability: Capability
  offering: CapabilityOffering
}) {
  const siblings = capability.offerings.filter((item) => item.slug !== offering.slug)

  return (
    <div className="min-h-screen bg-cream">
      <StoryHero
        title={offering.title}
        lede={offering.story[0]}
        follow={offering.story[1]}
        image={CAPABILITY_HEROES[capability.slug]}
        imageAlt={offering.title}
        parent={{ href: `/solutions/${capability.slug}`, label: capability.title }}
        next={<ServiceNextStep />}
      />
      <StorySection title={`How We Help with ${offering.title}`}>
        <StoryRevealTiles
          image={CAPABILITY_HEROES[capability.slug]}
          imageAlt={offering.title}
          items={offering.help}
        />
        {siblings.length > 0 ? (
          <div className="mt-10">
            <StoryLinkList
              label={`Related in ${capability.title}`}
              items={siblings.map((item) => ({
                href: offeringPath(capability.slug, item.slug),
                title: item.title,
              }))}
            />
          </div>
        ) : null}
      </StorySection>
      <StoryCta mode="lookup" />
      <SiteFooter showDualCtas={false} />
    </div>
  )
}
