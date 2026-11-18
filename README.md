# doc-processing-notebooks

Jupyter notebooks (TypeScript, Deno kernel) for stepping through the [doc-processing](https://github.com/Abhaysoft-inc/doc-processing) pipeline cell by cell. They import the real modules from that repo; nothing is copied or reimplemented.

| Notebook | What it does |
|---|---|
| [pipeline.ipynb](pipeline.ipynb) | Load → validate → triage/extract → Markdown → persist, plus a batch run over a folder |

## Setup

This repo expects `doc-processing` checked out next to it:

```
D:\doc-processing\              ← main repo (npm install done)
D:\doc-processing-notebooks\    ← this repo
```

If yours lives somewhere else, change the three `../doc-processing/` paths in [deno.json](deno.json).

```powershell
cd ..\doc-processing; npm install    # the notebooks use this node_modules
winget install DenoLand.Deno         # Deno 2.x
deno jupyter --install               # registers the "Deno" kernel
```

Open `pipeline.ipynb`, select the **Deno** kernel, set `INPUT_PATH` in the first cell and run all. Credentials (Gemini, AWS) come from `doc-processing/.env`; digital PDFs and Word files need none.

## What's in deno.json

- `@doc/` points at `doc-processing/src/`, and `pino` / `dotenv` point into its `node_modules`, so there is no second install here.
- `sloppy-imports` lets the main repo's `.js` import specifiers resolve to its `.ts` files.
- `unsafe-proto` re-enables `__proto__`, which `mammoth` (DOCX extraction) needs. Without it DOCX silently falls back to the legacy DOC parser.

## Layout

- `samples/` holds test inputs, regenerated with `deno run -A scripts/make-samples.ts`
- `notebook-output/` holds the AST and Markdown from each run (gitignored)
