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
      <div className="relative container-narrow">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">Got Questions?</p>
          <h2 className="font-display mb-4 text-4xl font-bold leading-tight lg:text-5xl">{title}</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Everything you need to know about the IJMB programme and registration process.
          </p>
        </div>
        <Accordion type="single" collapsible className="mx-auto max-w-3xl space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="rounded-2xl border border-border/75 bg-card px-5 shadow-[0_8px_28px_rgba(11,54,36,0.04)] transition-all data-[state=open]:border-primary/20 data-[state=open]:shadow-[0_14px_36px_rgba(11,54,36,0.08)] sm:px-6">
              <AccordionTrigger className="py-5 text-left text-base font-bold hover:no-underline sm:py-6">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="pb-5 leading-relaxed text-muted-foreground sm:pb-6">
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
