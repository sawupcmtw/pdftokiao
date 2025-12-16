#!/usr/bin/env python3
"""
Code Review Agent - Multi-language code review tool
Usage:
    python review.py <file_or_dir> [options]
    git diff | python review.py --stdin
"""

import argparse
import json
import sys
from pathlib import Path
from dataclasses import dataclass, field
from enum import Enum
from typing import Optional

class Severity(Enum):
    CRITICAL = "critical"
    ERROR = "error"
    WARNING = "warning"
    INFO = "info"

@dataclass
class Issue:
    severity: Severity
    line: Optional[int]
    message: str
    suggestion: str = ""
    rule: str = ""

@dataclass
class ReviewResult:
    file_path: str
    language: str
    issues: list[Issue] = field(default_factory=list)
    positives: list[str] = field(default_factory=list)
    lines_reviewed: int = 0

# Language detection mapping
EXTENSION_MAP = {
    '.js': 'javascript', '.jsx': 'javascript', '.mjs': 'javascript',
    '.ts': 'typescript', '.tsx': 'typescript',
    '.py': 'python', '.pyi': 'python',
    '.go': 'go',
    '.rs': 'rust',
    '.java': 'java',
    '.c': 'c', '.h': 'c', '.cpp': 'cpp', '.hpp': 'cpp', '.cc': 'cpp',
    '.rb': 'ruby',
    '.php': 'php',
    '.swift': 'swift',
    '.kt': 'kotlin', '.kts': 'kotlin',
}

def detect_language(file_path: Path) -> str:
    """Detect language from file extension."""
    ext = file_path.suffix.lower()
    return EXTENSION_MAP.get(ext, 'unknown')

def calculate_score(issues: list[Issue]) -> str:
    """Calculate overall score based on issues."""
    critical = sum(1 for i in issues if i.severity == Severity.CRITICAL)
    errors = sum(1 for i in issues if i.severity == Severity.ERROR)
    warnings = sum(1 for i in issues if i.severity == Severity.WARNING)
    
    if critical > 0:
        return 'F'
    elif errors > 2:
        return 'D'
    elif errors > 0 or warnings > 5:
        return 'C'
    elif warnings > 2:
        return 'B'
    return 'A'

def format_markdown(result: ReviewResult) -> str:
    """Format review result as markdown."""
    score = calculate_score(result.issues)
    
    output = [
        f"## Code Review: {result.file_path}\n",
        f"**Language:** {result.language}",
        f"**Lines Reviewed:** {result.lines_reviewed}",
        f"**Overall Score:** {score}\n",
    ]
    
    # Group issues by severity
    for severity in Severity:
        severity_issues = [i for i in result.issues if i.severity == severity]
        if severity_issues:
            header_map = {
                Severity.CRITICAL: "### 🚨 Critical Issues (must fix)",
                Severity.ERROR: "### ❌ Errors (should fix)",
                Severity.WARNING: "### ⚠️ Warnings (consider fixing)",
                Severity.INFO: "### ℹ️ Suggestions",
            }
            output.append(f"\n{header_map[severity]}")
            for issue in severity_issues:
                line_ref = f"[LINE:{issue.line}] " if issue.line else ""
                output.append(f"- **{line_ref}**{issue.message}")
                if issue.suggestion:
                    output.append(f"  - Fix: {issue.suggestion}")
    
    if result.positives:
        output.append("\n### ✅ Positive Observations")
        for p in result.positives:
            output.append(f"- {p}")
    
    return "\n".join(output)

def format_json(result: ReviewResult) -> str:
    """Format review result as JSON."""
    return json.dumps({
        'file': result.file_path,
        'language': result.language,
        'lines_reviewed': result.lines_reviewed,
        'score': calculate_score(result.issues),
        'issues': [
            {
                'severity': i.severity.value,
                'line': i.line,
                'message': i.message,
                'suggestion': i.suggestion,
                'rule': i.rule,
            }
            for i in result.issues
        ],
        'positives': result.positives,
    }, indent=2)

def review_file(file_path: Path, focus: list[str]) -> ReviewResult:
    """
    Review a single file.
    
    This is a template - actual review logic should be implemented
    by loading appropriate language-specific rules from references/
    and applying pattern matching or AST analysis.
    """
    language = detect_language(file_path)
    content = file_path.read_text(errors='replace')
    lines = content.splitlines()
    
    result = ReviewResult(
        file_path=str(file_path),
        language=language,
        lines_reviewed=len(lines),
    )
    
    # Placeholder: actual implementation would apply language-specific rules
    # This demonstrates the structure for the agent to follow
    
    return result

def main():
    parser = argparse.ArgumentParser(description='Code Review Agent')
    parser.add_argument('path', nargs='?', help='File or directory to review')
    parser.add_argument('--stdin', action='store_true', help='Read from stdin')
    parser.add_argument('--recursive', '-r', action='store_true', help='Review directories recursively')
    parser.add_argument('--focus', default='all', help='Focus areas: security,performance,maintainability,testing,all')
    parser.add_argument('--format', choices=['markdown', 'json', 'sarif'], default='markdown')
    parser.add_argument('--output', '-o', help='Output file (default: stdout)')
    
    args = parser.parse_args()
    focus = args.focus.split(',')
    
    if args.stdin:
        # Handle piped input (e.g., git diff)
        content = sys.stdin.read()
        print("Reviewing diff input...", file=sys.stderr)
        # Process diff content
        return
    
    if not args.path:
        parser.print_help()
        return
    
    path = Path(args.path)
    results = []
    
    if path.is_file():
        results.append(review_file(path, focus))
    elif path.is_dir():
        pattern = '**/*' if args.recursive else '*'
        for ext in EXTENSION_MAP.keys():
            for file in path.glob(f'{pattern}{ext}'):
                results.append(review_file(file, focus))
    
    # Format output
    formatter = format_json if args.format == 'json' else format_markdown
    output = '\n\n---\n\n'.join(formatter(r) for r in results)
    
    if args.output:
        Path(args.output).write_text(output)
    else:
        print(output)

if __name__ == '__main__':
    main()
