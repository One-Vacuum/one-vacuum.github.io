"""Cut the filter photos out of their white backgrounds.

Filters are white, and a white body multiplied onto the grey image well takes
the well's colour, so it barely shows. A transparent cut-out keeps it white.

Writes public/products/cutouts/<stem>.webp (transparent, same 1000x1000
framing as the photo) for every product that is not an oil, or only for the
files named on the command line. Run it after normalize-product-images.py when
a filter photo is added or replaced; until a cut-out exists the card shows the
photo itself. Needs rembg, which runs on Python 3.13 or older. The first run
downloads the ~1 GB BiRefNet model:

    python3.13 -m venv .venv-cutouts && .venv-cutouts/bin/pip install "rembg[cpu]"
    .venv-cutouts/bin/python scripts/build-product-cutouts.py [file ...]

The mask's soft fringe is tightened (alpha LO..HI ramps to 0..1), so faint
traces of the photo's own shadow drop out; the site draws a shadow instead.
"""
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image
from rembg import new_session, remove

ROOT = Path(__file__).resolve().parent.parent
IMAGES = ROOT / 'public/products/images'
OUT = ROOT / 'public/products/cutouts'
MODEL = 'birefnet-general'
# BiRefNet drops most of the thin gasket that comes with these two; ISNet keeps it.
MODEL_OVERRIDES = {
    '18972Exhaust.filterFE16-25.jpeg': 'isnet-general-use',
    '18973Exhaust.filterFE40-65.jpeg': 'isnet-general-use',
}
LO, HI = 0.15, 0.85


def main() -> None:
    products = json.loads((ROOT / 'public/products/products.json').read_text())
    names = sys.argv[1:] or sorted({p['image'] for p in products if p['category'] != 'oil'})
    OUT.mkdir(exist_ok=True)
    sessions = {}
    for name in names:
        model = MODEL_OVERRIDES.get(name, MODEL)
        if model not in sessions:
            sessions[model] = new_session(model)
        session = sessions[model]
        im = Image.open(IMAGES / name).convert('RGB')
        mask = np.asarray(remove(im, session=session, only_mask=True)).astype(np.float32) / 255
        t = np.clip((mask - LO) / (HI - LO), 0, 1)
        alpha = t * t * (3 - 2 * t)
        # Edge pixels are part white background: take the white back out.
        a = np.asarray(im).astype(np.float32)
        cover = np.maximum(mask, 0.05)[..., None]
        rgb = np.clip((a - 255 * (1 - cover)) / cover, 0, 255)
        rgba = np.dstack([rgb, alpha * 255]).round().astype(np.uint8)
        dst = OUT / (Path(name).stem + '.webp')
        Image.fromarray(rgba, 'RGBA').save(dst, 'WEBP', quality=86, method=6)
        print(f'{dst.relative_to(ROOT)} {dst.stat().st_size // 1024} KB')


if __name__ == '__main__':
    main()
