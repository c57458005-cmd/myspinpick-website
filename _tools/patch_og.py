"""Add og:image / twitter:image (latest official og-image.png) to every page that lacks them.

Pages that already reference og-image.png are left untouched (the regenerated file
already serves the new official logo). For pages missing it, we insert the OG image
block after the `og:url` meta and upgrade twitter:card to summary_large_image.
"""
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

OG_BLOCK = (
    '  <meta property="og:image" content="https://myspinpick.com/og-image.png" />\n'
    '  <meta property="og:image:width" content="1200" />\n'
    '  <meta property="og:image:height" content="630" />\n'
    '  <meta property="og:image:alt" content="MySpinPick \u2014 free wheel spinner and random picker tools" />\n'
    '  <meta name="twitter:card" content="summary_large_image" />\n'
    '  <meta name="twitter:image" content="https://myspinpick.com/og-image.png" />\n'
)

added = []
skipped = []

for dirpath, _dirs, files in os.walk(ROOT):
    if "node_modules" in dirpath or "_tools" in dirpath:
        continue
    if "index.html" not in files:
        continue
    path = os.path.join(dirpath, "index.html")
    with open(path, "r", encoding="utf-8") as f:
        html = f.read()

    rel = os.path.relpath(path, ROOT)
    if 'og:image' in html:
        skipped.append(rel)
        continue

    # upgrade twitter:card to large image
    html = html.replace(
        '<meta name="twitter:card" content="summary" />',
        '<meta name="twitter:card" content="summary_large_image" />',
    )

    # insert OG block right after the og:url line
    html, n = re.subn(
        r'(<meta property="og:url"[^>]*/>)\n',
        lambda m: m.group(1) + "\n" + OG_BLOCK,
        html,
        count=1,
    )
    if n == 0:
        print("WARN: no og:url anchor in", rel)
        continue

    with open(path, "w", encoding="utf-8") as f:
        f.write(html)
    added.append(rel)

print("ADDED og:image to", len(added), "pages:")
for r in added:
    print("  +", r)
print("SKIPPED (already had og:image):", len(skipped))
for r in skipped:
    print("  =", r)
