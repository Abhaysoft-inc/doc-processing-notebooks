// Regenerates samples/sample.docx and samples/sample.pdf with doc-processing's own generators.
// Run from this repo's root: deno run -A scripts/make-samples.ts
Deno.env.set('NODE_ENV', 'test');
Deno.env.set('LOG_LEVEL', 'warn');
const { createDefaultCanonicalDocument } = await import('@doc/modules/canonical/canonical.schema.ts');
const { generateDocxBuffer } = await import('@doc/modules/generation/docx-generator.ts');
const { generatePdfBuffer, closeBrowser } = await import('@doc/modules/generation/pdf-generator.ts');

const doc = createDefaultCanonicalDocument('Master Services Agreement', 'sample');
doc.sections = [
  {
    id: 's1',
    title: 'Definitions',
    blocks: [
      { type: 'heading', level: 1, text: 'MASTER SERVICES AGREEMENT' },
      { type: 'heading', level: 2, text: 'Section 1. Definitions' },
      {
        type: 'paragraph',
        runs: [
          { text: 'This Agreement is entered into by and between ' },
          { text: 'Acme Corporation', bold: true },
          { text: ' ("Provider") and the customer identified in the applicable Order Form ("Customer"), effective as of the date of last signature below.' },
        ],
      },
      {
        type: 'list',
        ordered: true,
        items: [
          { runs: [{ text: '"Services" means the professional services described in each Statement of Work.' }] },
          { runs: [{ text: '"Deliverables" means all work product delivered to Customer under this Agreement.' }] },
        ],
      },
      { type: 'heading', level: 2, text: 'Section 2. Fees and Payment' },
      {
        type: 'table',
        headerRows: [{ cells: [{ runs: [{ text: 'Milestone' }] }, { runs: [{ text: 'Amount (USD)' }] }] }],
        bodyRows: [
          { cells: [{ runs: [{ text: 'Kickoff' }] }, { runs: [{ text: '10,000' }] }] },
          { cells: [{ runs: [{ text: 'Final delivery' }] }, { runs: [{ text: '25,000' }] }] },
        ],
      },
      {
        type: 'paragraph',
        runs: [{ text: 'Invoices are payable within thirty (30) days of receipt. Late payments accrue interest at one percent (1%) per month or the maximum rate permitted by law, whichever is lower.' }],
      },
    ],
  },
];

await Deno.mkdir('samples', { recursive: true });
await Deno.writeFile('samples/sample.docx', await generateDocxBuffer(doc));
console.log('wrote sample.docx');
try {
  await Deno.writeFile('samples/sample.pdf', await generatePdfBuffer(doc));
  console.log('wrote sample.pdf');
} finally {
  await closeBrowser();
}
