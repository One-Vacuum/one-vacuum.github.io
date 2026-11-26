"""Cut the hero's product photos out of their near-white backgrounds.

Writes public/images/hero/<part>.webp (transparent WebP) for the parts shown in
src/components/Hero.astro. Regenerate after replacing one of those photos:

    python3 -m venv .venv && .venv/bin/pip install pillow numpy
    .venv/bin/python scripts/build-hero-cutouts.py

Background = pixels connected to the image border whose colour is within HI of
the border colour; opacity ramps from LO to HI, so edges and soft shadows fade
instead of leaving a white fringe. Tuned for light backdrops.
"""
import json
from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
PARTS = ['L13020', 'L13005', 'L70201']  # keep in sync with Hero.astro
LO, HI = 4.0, 70.0
SIZE = 900


def cutout(src: Path, dst: Path) -> None:
    a = np.asarray(Image.open(src).convert('RGB')).astype(np.float32)
    h, w, _ = a.shape
    bg = np.median(np.concatenate([a[0], a[-1], a[:, 0], a[:, -1]]), axis=0)
    d = np.abs(a - bg).max(axis=2)

    reached = np.zeros((h, w), bool)
    queue = deque()
    for y, x in [(y, x) for x in range(w) for y in (0, h - 1)] + [(y, x) for y in range(h) for x in (0, w - 1)]:
        if d[y, x] < HI and not reached[y, x]:
            reached[y, x] = True
            queue.append((y, x))
    while queue:
        y, x = queue.popleft()
        for ny, nx in ((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)):
            if 0 <= ny < h and 0 <= nx < w and not reached[ny, nx] and d[ny, nx] < HI:
                reached[ny, nx] = True
                queue.append((ny, nx))

    t = np.clip((d - LO) / (HI - LO), 0, 1)
    alpha = np.where(reached, t * t * (3 - 2 * t), 1.0)
    # Remove the background colour from partly transparent pixels (no halo).
    al = np.maximum(alpha[..., None], 1e-3)
    rgb = np.clip((a - bg * (1 - al)) / al, 0, 255)
    img = Image.fromarray(np.dstack([rgb, alpha * 255]).astype(np.uint8), 'RGBA')
    img = img.crop(img.getchannel('A').point(lambda v: 255 if v > 8 else 0).getbbox())
    img.thumbnail((SIZE, SIZE), Image.LANCZOS)
    img.save(dst, 'WEBP', quality=86, method=6)
    print(f'{dst.relative_to(ROOT)} {img.size[0]}x{img.size[1]}')


def main() -> None:
    products = {p['partNumber']: p for p in json.loads((ROOT / 'public/products/products.json').read_text())}
    out = ROOT / 'public/images/hero'
    out.mkdir(parents=True, exist_ok=True)
    for part in PARTS:
        cutout(ROOT / 'public/products/images' / products[part]['image'], out / f'{part}.webp')


if __name__ == '__main__':
    main()
