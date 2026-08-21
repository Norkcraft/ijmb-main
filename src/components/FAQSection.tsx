import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  title?: string;
  faqs: FAQItem[];
  showSchema?: boolean;
}

const FAQSection = ({ title = "Frequently Asked Questions", faqs, showSchema = true }: FAQSectionProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };

  return (
    <section className="section-alt section-padding relative overflow-hidden">
      {showSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      <div className="absolute inset-0 pattern-dots opacity-30 pointer-events-none" />
      <div className="relative container-narrow">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">Got Questions?</p>
          <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-4">{title}</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Everything you need to know about the IJMB programme and registration process.
          </p>
        </div>
        <Accordion type="single" collapsible className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="border border-border/60 rounded-xl px-5 bg-card shadow-sm data-[state=open]:shadow-md transition-shadow">
              <AccordionTrigger className="text-left font-medium text-base hover:no-underline py-5">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
