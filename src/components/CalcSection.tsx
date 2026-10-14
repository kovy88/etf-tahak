import { calc } from "@/content";
import { LeadForm } from "./LeadForm";
import { CalcLeadIntro, CalcPanel, type CalcLabels } from "./CalcPanel";
import { Section } from "./Section";
import { SourceNote } from "./SourceNote";

/** S2/S3 Kalkulačka. Server skládá texty, interaktivní část je CalcPanel. */
export function CalcSection() {
  const labels: CalcLabels = {
    ...calc.labels,
    ...calc.result,
    chartLegend: calc.chartLegend,
  };
  return (
    <Section id="kalkulacka" title={calc.title}>
      <CalcPanel labels={labels} />
      <SourceNote className="mt-3">{calc.assumptionNote}</SourceNote>
      <div className="mt-6">
        <CalcLeadIntro titleTemplate={calc.lead.titleTemplate} textTemplate={calc.lead.textTemplate} />
        <LeadForm location="calc" />
      </div>
      {/* metodika pod formulářem: zdroj zůstává u sekce, ale neodsouvá výzvu od výsledku */}
      <SourceNote className="mt-6">
        {calc.avgFundNote} {calc.methodNote}
      </SourceNote>
    </Section>
  );
}
