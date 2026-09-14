"""Regenerate og-image.png (1200x630) using the official brand logo (V12)."""
import os
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
W, H = 1200, 630
BG = (246, 248, 251)  # #f6f8fb site bg

img = Image.new("RGB", (W, H), BG)

logo_path = os.path.join(ROOT, "brand-logo@2x.png")
logo = Image.open(logo_path).convert("RGBA")

# Scale official horizontal lockup to a comfortable width on the 1200 canvas
lw = 760
lh = int(round(logo.height * lw / logo.width))
logo = logo.resize((lw, lh), Image.LANCZOS)

x = (W - lw) // 2
y = (H - lh) // 2 - 34  # nudge up to leave room for tagline
img.paste(logo, (x, y), logo)

# Tagline below the logo (matches og:image:alt)
draw = ImageDraw.Draw(img)
text = "Free wheel spinner & random picker tools"
try:
    font = ImageFont.truetype("C:/Windows/Fonts/arial.ttf", 30)
except Exception:
    try:
        font = ImageFont.truetype("C:/Windows/Fonts/seguiemj.ttf", 30)
    except Exception:
        font = ImageFont.load_default()

bbox = draw.textbbox((0, 0), text, font=font)
tw = bbox[2] - bbox[0]
tx = (W - tw) // 2
ty = y + lh + 26
draw.text((tx, ty), text, font=font, fill=(100, 116, 139))  # #64748b

out = os.path.join(ROOT, "og-image.png")
img.save(out, "PNG")
print("wrote", out, img.size)
