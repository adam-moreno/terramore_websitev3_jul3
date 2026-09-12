import { CAPABILITY_HEROES } from "@/lib/capability-heroes"
import { type Capability, type CapabilityOffering } from "@/lib/capabilities"
import { StoryCta, StoryHero, StorySection } from "@/components/story-page"
import { StoryRevealTiles } from "@/components/story-reveal-tiles"

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
      </StorySection>
      <StorySection title={capability.howWeHelpTitle}>
        <StoryRevealTiles image={image} imageAlt={capability.title} items={capability.howWeHelp} />
      </StorySection>
      <StorySection title={capability.workTitle}>
        <StoryRevealTiles image={image} imageAlt={capability.title} items={capability.work} />
      </StorySection>
      <StoryCta />
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
  return (
    <div className="min-h-screen bg-cream">
      <StoryHero
        title={offering.title}
        lede={offering.story[0]}
        follow={offering.story[1]}
        image={CAPABILITY_HEROES[capability.slug]}
        imageAlt={offering.title}
        parent={{ href: `/solutions/${capability.slug}`, label: capability.title }}
      />
      <StorySection title={`How We Help with ${offering.title}`}>
        <StoryRevealTiles
          image={CAPABILITY_HEROES[capability.slug]}
          imageAlt={offering.title}
          items={offering.help}
        />
      </StorySection>
      <StoryCta />
    </div>
  )
}
