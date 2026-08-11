#!/usr/bin/env python3
"""Fail when a meaningful Hestiva implementation diff has no docs/ companion change."""

from __future__ import annotations

import io
import re
import subprocess
import sys
import tokenize
from pathlib import Path

CODE = {".c", ".cc", ".cpp", ".css", ".go", ".java", ".js", ".jsx", ".mjs", ".py", ".rs", ".scss", ".ts", ".tsx"}
IMPLEMENTATION = CODE | {".json", ".jsonc", ".sql", ".toml", ".yaml", ".yml"}
SPECIAL_IMPLEMENTATION_FILES = {"package.json", "bun.lock", "wrangler.jsonc"}


def git(*args: str, check: bool = True) -> str:
    return subprocess.run(
        ["git", *args], check=check, text=True, capture_output=True
    ).stdout


def content(revision: str, path: str) -> str:
    return git("show", f"{revision}:{path}", check=False)


def normalized(text: str, suffix: str) -> str:
    if suffix == ".py":
        try:
            tokens = tokenize.generate_tokens(io.StringIO(text).readline)
            text = "".join(value for kind, value, *_ in tokens if kind != tokenize.COMMENT)
        except (IndentationError, tokenize.TokenError):
            return text
    else:
        output: list[str] = []
        index = 0
        quote: str | None = None
        while index < len(text):
            char = text[index]
            if quote:
                output.append(char)
                if char == "\\" and index + 1 < len(text):
                    index += 1
                    output.append(text[index])
                elif char == quote:
                    quote = None
            elif char in {'"', "'", "`"}:
                quote = char
                output.append(char)
            elif text.startswith("//", index):
                newline = text.find("\n", index)
                index = len(text) if newline < 0 else newline - 1
            elif text.startswith("/*", index):
                end = text.find("*/", index + 2)
                index = len(text) if end < 0 else end + 1
            else:
                output.append(char)
            index += 1
        text = "".join(output)
    return re.sub(r"\s+", "", text)


def comment_only(base: str, head: str, path: str) -> bool:
    suffix = Path(path).suffix.lower()
    return suffix in CODE and normalized(content(base, path), suffix) == normalized(
        content(head, path), suffix
    )


def guidance(path: str) -> str:
    lower = path.lower()
    if path.startswith(".github/"):
        return "CI/CD: docs/README, DEPLOYMENT/RECOVERY as applicable, work log, changelog, and any applicable ADR"
    if "cloudflare" in lower or "wrangler" in lower:
        return "Cloudflare/deployment: DEPLOYMENT, RECOVERY_GUIDE, ARCHITECTURE when applicable, work log, changelog, and any applicable ADR"
    if path in {"package.json", "bun.lock"}:
        return "dependencies/build: ARCHITECTURE/DEPLOYMENT when applicable, work log, changelog, and any applicable ADR"
    if path.startswith("src/lib/") or path.startswith("src/routes/") or path.startswith("src/components/"):
        return "application/workflow: ARCHITECTURE when boundaries change, work log, changelog, and any applicable ADR"
    if path.startswith("scripts/"):
        return "repository tooling: docs/README, work log, changelog, and any applicable ADR"
    return "implementation/tooling: apply the AGENTS.md matrix; work log and changelog are normally required"


def main() -> int:
    if len(sys.argv) != 3:
        print(f"Usage: {sys.argv[0]} <base-revision> <head-revision>", file=sys.stderr)
        return 2

    base, head = sys.argv[1:]
    changed = git("diff", "--name-only", "--diff-filter=ACMRT", f"{base}...{head}").splitlines()

    if any(path.startswith("docs/") for path in changed):
        print("Documentation policy passed: docs/ was updated in this change.")
        return 0

    meaningful: list[str] = []
    for path in changed:
        name = Path(path).name
        suffix = Path(path).suffix.lower()
        if name.startswith("LICENSE") or name == "COPYING" or suffix == ".md":
            continue
        if suffix in IMPLEMENTATION or name in SPECIAL_IMPLEMENTATION_FILES:
            if not comment_only(base, head, path):
                meaningful.append(path)

    if not meaningful:
        print("Documentation policy passed: no meaningful implementation change requires docs/ updates.")
        return 0

    print(
        "Documentation policy failed: implementation/configuration changed, but docs/ was not modified.",
        file=sys.stderr,
    )
    print("Review these changes and update verified applicable documentation:", file=sys.stderr)
    for path in meaningful:
        print(f"  - {path}: {guidance(path)}", file=sys.stderr)
    print(
        "See AGENTS.md. Do not add an unrelated docs edit merely to pass this check.",
        file=sys.stderr,
    )
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
