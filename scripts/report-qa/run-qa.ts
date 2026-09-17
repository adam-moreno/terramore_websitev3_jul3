/**
 * Runs collector + deterministic scoring QA against public fixtures.
 * Does NOT call the LLM (cost control). Detects fabrication patterns and missing evidence language.
 *
 * Usage: npx tsx scripts/report-qa/run-qa.ts
 * Optional: QA_LIMIT=2 npx tsx scripts/report-qa/run-qa.ts
 */

import { collectDiagnostic } from "../../lib/report/diagnostic"
import { QA_FIXTURES } from "./fixtures"

type Row = {
  fixture: string
  category: string
  expected: string
  automated: string
  match: "Yes" | "No"
  reason: string
  fix: string
  score: number | null
  coverage: number
}

function blobFromDiagnostic(d: Awaited<ReturnType<typeof collectDiagnostic>>): string {
  return JSON.stringify({
    facts: d.facts,
    scores: d.scores,
    recommendations: d.recommendations,
    competitive: d.competitive,
    catalog: d.catalog,
    location: d.location,
    directories: d.directories,
    technical: d.technical,
  }).toLowerCase()
}

async function main() {
  const limit = Number(process.env.QA_LIMIT || QA_FIXTURES.length)
  const fixtures = QA_FIXTURES.slice(0, limit)
  const rows: Row[] = []
  let inventionFails = 0

  for (const fixture of fixtures) {
    process.stdout.write(`QA ${fixture.id}… `)
    try {
      const diagnostic = await collectDiagnostic(fixture.businessName, fixture.website)
      const blob = blobFromDiagnostic(diagnostic)
      const automated = `score=${diagnostic.scores.overall} coverage=${diagnostic.scores.evidenceCoverage}% pages=${diagnostic.pages.length} recs=${diagnostic.recommendations.length}`

      for (const exp of fixture.expected) {
        const missingRequired =
          exp.mustIncludeAny && !exp.mustIncludeAny.some((token) => blob.includes(token.toLowerCase()))
        const fabricated = (exp.mustNotInclude || []).filter((token) => blob.includes(token.toLowerCase()))
        const match = !missingRequired && fabricated.length === 0 ? "Yes" : "No"
        if (fabricated.length) inventionFails += 1
        rows.push({
          fixture: fixture.id,
          category: fixture.category,
          expected: exp.finding,
          automated,
          match,
          reason: missingRequired
            ? `Missing expected tokens: ${(exp.mustIncludeAny || []).join(", ")}`
            : fabricated.length
              ? `Fabrication tokens present: ${fabricated.join(", ")}`
              : "Expected signals present; no fabrication tokens",
          fix: match === "Yes" ? "—" : missingRequired ? "Collector coverage" : "Remove unsupported claim path",
          score: diagnostic.scores.overall,
          coverage: diagnostic.scores.evidenceCoverage,
        })
      }
      console.log(automated)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      console.log(`ERROR ${message}`)
      rows.push({
        fixture: fixture.id,
        category: fixture.category,
        expected: "Collector completes",
        automated: `error: ${message}`,
        match: "No",
        reason: message,
        fix: "Collector/network resilience",
        score: null,
        coverage: 0,
      })
    }
  }

  console.log("\n| Fixture | Category | Expected | Automated | Match | Reason | Fix |")
  console.log("| --- | --- | --- | --- | --- | --- | --- |")
  for (const r of rows) {
    console.log(
      `| ${r.fixture} | ${r.category} | ${r.expected.replace(/\|/g, "/")} | ${r.automated} | ${r.match} | ${r.reason.replace(/\|/g, "/")} | ${r.fix} |`,
    )
  }

  console.log(`\nFalse-invention failures: ${inventionFails}`)
  console.log(
    inventionFails > 2
      ? "QA GATE: FAIL — more than 2 false-invention failures. Do not ship offending factor."
      : "QA GATE: PASS — invention failures within threshold (≤2).",
  )

  const failed = rows.filter((r) => r.match === "No").length
  process.exit(failed && process.env.QA_STRICT === "1" ? 1 : 0)
}

main()
