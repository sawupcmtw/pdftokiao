# Test Files Guide

This directory contains organized test cases for the PDF to Kiao parser.

## Folder Structure

```
test_files/
├── my-test/                      # Any folder name
│   ├── CONTENT-[1].pdf           # Required: PDF with page range
│   ├── INST.txt                  # Optional: Instructions
│   ├── IMAGE-1.jpg               # Optional: Hint images
│   ├── IMAGE-2.png
│   ├── SUPP-all.pdf              # Optional: Supplementary PDF (answers)
│   └── SUPP-pages-1-3.pdf        # Optional: Supplementary PDF (scoped)
│
├── exam/
│   ├── CONTENT-[3,7].pdf         # Pages 3-7
│   ├── SUPP-all.pdf              # Answer key for all questions
│   └── INST.txt
│
└── README.md
```

## PDF Naming Convention

The page range is specified in the PDF filename:

| Format | Example | Description |
|--------|---------|-------------|
| `CONTENT-[page].pdf` | `CONTENT-[1].pdf` | Single page (page 1) |
| `CONTENT-[start,end].pdf` | `CONTENT-[1,5].pdf` | Page range (pages 1-5) |

## File Descriptions

### CONTENT-[pages].pdf (Required)

The PDF file to be parsed. The filename specifies which pages to parse:
- `CONTENT-[1].pdf` - Parse page 1 only
- `CONTENT-[3,10].pdf` - Parse pages 3 through 10

### INST.txt (Optional)

Plain text file containing parsing instructions.

Example content:
```
Focus on multiple choice questions. Ignore headers and footers.
```

### IMAGE-*.jpg / IMAGE-*.png (Optional)

Hint images that provide additional context. Files must:
- Start with `IMAGE-`
- End with `.jpg`, `.jpeg`, or `.png`

Examples: `IMAGE-1.jpg`, `IMAGE-answer-key.png`

### SUPP-*.pdf (Optional)

Supplementary PDFs containing answer keys, explanations, or additional context. These are used to:
- Verify and enrich parsed answers
- Extract explanations and rationales
- Add vocabulary notes and translations

**Naming Convention:**

| Format | Example | Description |
|--------|---------|-------------|
| `SUPP-all.pdf` | `SUPP-all.pdf` | Applies to all questions |
| `SUPP-pages-X.pdf` | `SUPP-pages-5.pdf` | Applies to a single page |
| `SUPP-pages-X-Y.pdf` | `SUPP-pages-1-5.pdf` | Applies to a page range |
| `SUPP-type-TYPE.pdf` | `SUPP-type-single_select.pdf` | Applies to a question type |
| `SUPP-questions-X,Y,Z.pdf` | `SUPP-questions-1,5,10.pdf` | Applies to specific questions |

**Supported Types:** `single_select`, `multi_select`, `fill_in`, `short_answer`

**Examples:**
```
SUPP-all.pdf                    # Answer key for all questions
SUPP-pages-3-7.pdf              # Explanations for pages 3-7
SUPP-type-fill_in.pdf           # Answers for fill-in questions only
SUPP-questions-1,2,5.pdf        # Answers for questions 1, 2, and 5
```

**Processing Priority:** When multiple supplementary PDFs provide answers for the same question, the extraction with highest confidence is used. Scope order: `all` > `pages` > `type` > `questions`.

## CLI Usage

```bash
# List all test cases
pdftokiao test --list

# View test case details
pdftokiao test my-test

# Run parser on test case
pdftokiao test my-test --run

# Run with custom output
pdftokiao test my-test --run --output ./results
```

## Quick Start

1. Create a folder:
   ```bash
   mkdir test_files/mytest
   ```

2. Add your PDF with page range in filename:
   ```bash
   cp /path/to/your.pdf "test_files/mytest/CONTENT-[1,3].pdf"
   ```

3. (Optional) Add instructions:
   ```bash
   echo "Parse all questions" > test_files/mytest/INST.txt
   ```

4. (Optional) Add hint images:
   ```bash
   cp /path/to/hint.png test_files/mytest/IMAGE-1.png
   ```

5. (Optional) Add answer key / supplementary PDF:
   ```bash
   cp /path/to/answers.pdf test_files/mytest/SUPP-all.pdf
   ```

6. Run:
   ```bash
   pdftokiao test mytest --run
   ```
