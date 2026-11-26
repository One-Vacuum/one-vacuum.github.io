"""Give every product photo the same framing: a white square with the product
centred and its longer side at FILL of the frame.

Rewrites public/products/images/<file> in place for every image listed in
public/products/products.json (or only the files named on the command line).
Run it after adding or replacing a product photo:

    python3 -m venv .venv && .venv/bin/pip install pillow numpy
    .venv/bin/python scripts/normalize-product-images.py [file ...]

The background (pixels connected to the border and close to its colour) is
faded to white, so pasted-in panels and colour casts disappear; the product's
bounding box is measured on its solid pixels only, so soft shadows and
reflections do not shrink it, and specks away from the product (stray
stamps, QR codes) are left out of it and painted white. The outer EDGE of the
frame fades to white too, so shadows and reflections that run off the photo end
softly: the site multiplies photos onto a grey well, where any off-white pixel
shows. Running it twice gives the same framing.
"""
import json
import sys
from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
IMAGES = ROOT / 'public/products/images'
SIZE = 1000  # output is SIZE x SIZE
FILL = 0.84  # product's longer side, as a share of SIZE
LO, HI = 4.0, 70.0  # background tolerance ramp (max channel difference)
SOLID = 0.9  # opacity a pixel needs to count towards the bounding box
# Products whose body is almost background-white need a lower bar, or the
# box shrinks to their print and the photo is over-enlarged.
SOLID_OVERRIDES = {
    'EK96005Oil_filterSV100B.jpeg': 0.6,  # white filter can
    'L25000LVO2500.3L.jpg': 0.2,  # translucent white cap (cut off at 0.6)
}
GAP = 0.06  # blobs this close to the product (share of the image side) are part of it
BIG_SHARE = 0.1  # blobs this large (share of the largest) are always part of it
# Background further than this from the product fades to pure white
# (share of the image side), so grey gradients and vignettes go.
FADE_FROM, FADE_TO = 0.02, 0.07
EDGE = 0.03  # outermost share of the output frame, faded to white


def background_alpha(a: np.ndarray) -> tuple[np.ndarray, np.ndarray]:
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
    return np.where(reached, t * t * (3 - 2 * t), 1.0), bg


def product_mask(solid: np.ndarray) -> np.ndarray:
    """Solid pixels that belong to the product. Blobs (found on a 4x coarser
    grid) are grouped outward from the largest one: a blob joins when it lies
    within GAP of the group, or is big in its own right. Whatever is left over
    is a speck (a stray stamp or QR code away from the product)."""
    k = 4
    h, w = solid.shape
    grid = solid[: h - h % k, : w - w % k].reshape(h // k, k, w // k, k).any(axis=(1, 3))
    labels = np.zeros(grid.shape, np.int32)
    blobs = []  # (size, y0, x0, y1, x1) per label, label = index + 1
    for start in zip(*np.nonzero(grid)):
        if labels[start]:
            continue
        labels[start] = len(blobs) + 1
        queue, size, y0, x0, y1, x1 = deque([start]), 0, *start, *start
        while queue:
            y, x = queue.popleft()
            size += 1
            y0, x0, y1, x1 = min(y0, y), min(x0, x), max(y1, y), max(x1, x)
            for ny, nx in ((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)):
                if 0 <= ny < grid.shape[0] and 0 <= nx < grid.shape[1] and grid[ny, nx] and not labels[ny, nx]:
                    labels[ny, nx] = labels[start]
                    queue.append((ny, nx))
        blobs.append((size, y0, x0, y1, x1))
    if not blobs:
        raise ValueError('no solid pixels: the product is too close to the background colour')
    largest = max(range(len(blobs)), key=lambda i: blobs[i][0])
    gap = GAP * max(grid.shape)
    group = {largest} | {i for i, b in enumerate(blobs) if b[0] >= BIG_SHARE * blobs[largest][0]}
    changed = True
    while changed:
        changed = False
        gy0 = min(blobs[i][1] for i in group); gx0 = min(blobs[i][2] for i in group)
        gy1 = max(blobs[i][3] for i in group); gx1 = max(blobs[i][4] for i in group)
        for i, (_, y0, x0, y1, x1) in enumerate(blobs):
            if i not in group and y0 <= gy1 + gap and y1 >= gy0 - gap and x0 <= gx1 + gap and x1 >= gx0 - gap:
                group.add(i)
                changed = True
    keep = np.zeros(len(blobs) + 1, bool)
    keep[[i + 1 for i in group]] = True
    kept = np.zeros(solid.shape, bool)
    kept[: h - h % k, : w - w % k] = np.repeat(np.repeat(keep[labels], k, axis=0), k, axis=1)
    return kept


def bbox(mask: np.ndarray) -> tuple[int, int, int, int]:
    rows = np.where(mask.any(axis=1))[0]
    cols = np.where(mask.any(axis=0))[0]
    return cols[0], rows[0], cols[-1] + 1, rows[-1] + 1


def normalize(path: Path) -> str:
    a = np.asarray(Image.open(path).convert('RGB')).astype(np.float32)
    alpha, bg = background_alpha(a)
    solid = alpha >= SOLID_OVERRIDES.get(path.name, SOLID)
    try:
        product = product_mask(solid)
    except ValueError as e:
        sys.exit(f'{path.name}: {e}; give it a lower threshold in SOLID_OVERRIDES')
    # Specks: solid pixels outside the product blobs (plus a small fringe) go white.
    specks = solid & ~product
    if specks.any():
        y, x = np.nonzero(specks)
        pad = 6
        for yy, xx in zip(y, x):
            alpha[max(0, yy - pad) : yy + pad, max(0, xx - pad) : xx + pad] = 0
    x0, y0, x1, y1 = bbox(solid & product)
    h, w = alpha.shape
    dx = np.maximum(np.maximum(x0 - np.arange(w), np.arange(w) - x1), 0)[None, :]
    dy = np.maximum(np.maximum(y0 - np.arange(h), np.arange(h) - y1), 0)[:, None]
    side = max(h, w)
    fade = np.clip((FADE_TO * side - np.hypot(dx, dy)) / ((FADE_TO - FADE_FROM) * side), 0, 1)
    alpha = alpha * fade

    al = np.maximum(alpha[..., None], 1e-3)
    fg = np.clip((a - bg * (1 - al)) / al, 0, 255)  # background colour removed
    on_white = fg * al + 255 * (1 - al)
    img = Image.fromarray(on_white.astype(np.uint8), 'RGB')

    scale = SIZE * FILL / max(x1 - x0, y1 - y0)
    scaled = img.resize((round(img.width * scale), round(img.height * scale)), Image.LANCZOS)
    cx, cy = (x0 + x1) / 2 * scale, (y0 + y1) / 2 * scale
    canvas = Image.new('RGB', (SIZE, SIZE), (255, 255, 255))
    canvas.paste(scaled, (round(SIZE / 2 - cx), round(SIZE / 2 - cy)))
    edge = np.minimum(np.arange(SIZE), np.arange(SIZE)[::-1])
    t = np.clip(np.minimum(edge[:, None], edge[None, :]) / (EDGE * SIZE), 0, 1)[..., None]
    out = 255 - (255 - np.asarray(canvas).astype(np.float32)) * t
    Image.fromarray(out.round().astype(np.uint8), 'RGB').save(path, 'JPEG', quality=86, optimize=True, progressive=True)
    erased = f', erased {int(specks.sum())} speck px' if specks.any() else ''
    return f'{path.name}: product {x1 - x0}x{y1 - y0} of {a.shape[1]}x{a.shape[0]} -> scale {scale:.2f}{erased}'


def main() -> None:
    names = sys.argv[1:] or sorted({p['image'] for p in json.loads((ROOT / 'public/products/products.json').read_text())})
    for name in names:
        print(normalize(IMAGES / name))


if __name__ == '__main__':
    main()
