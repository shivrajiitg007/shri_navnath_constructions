import os
import numpy as np
from PIL import Image, ImageEnhance, ImageOps, ImageFilter
import cv2

SRC_DIR = "/mnt/user-data/uploads"
OUT_DIR = "/home/claude/snc/public/images"
os.makedirs(OUT_DIR, exist_ok=True)

# Image 1 = founder portrait (per user). Images 2-7 = real project/site photos.
FILES = [
    ("IMG20250720180119.jpg", "founder", 1600),
    ("P_20170619_171506.jpg", "project-institutional", 2200),
    ("P_20150303_122711.jpg", "project-residence-foundation", 2000),
    ("P_20171213_102930.jpg", "project-campus", 2200),
    ("Photo-0129.jpg", "project-residence-detail", 2000),
    ("Photo-0273.jpg", "project-residence-facade", 2200),
    ("Photo-0370.jpg", "project-structure", 2400),
]


def clahe_local_contrast(pil_img, clip=2.2, grid=8):
    arr = np.array(pil_img.convert("RGB"))
    lab = cv2.cvtColor(arr, cv2.COLOR_RGB2LAB)
    l, a, b = cv2.split(lab)
    clahe = cv2.createCLAHE(clipLimit=clip, tileGridSize=(grid, grid))
    l2 = clahe.apply(l)
    lab2 = cv2.merge((l2, a, b))
    rgb2 = cv2.cvtColor(lab2, cv2.COLOR_LAB2RGB)
    return Image.fromarray(rgb2)


def denoise(pil_img, strength=3):
    arr = np.array(pil_img.convert("RGB"))
    den = cv2.fastNlMeansDenoisingColored(arr, None, strength, strength, 7, 21)
    return Image.fromarray(den)


def enhance(path_in, path_out_base, target_w):
    img = Image.open(path_in)
    img = ImageOps.exif_transpose(img)
    img = img.convert("RGB")
    orig_size = img.size

    # downscale first if huge, for speed, keeping generous headroom
    w, h = img.size
    if w > target_w * 2:
        scale = (target_w * 1.5) / w
        img = img.resize((int(w * scale), int(h * scale)), Image.LANCZOS)

    img = denoise(img, strength=3)
    img = clahe_local_contrast(img, clip=2.2, grid=8)
    img = ImageOps.autocontrast(img, cutoff=0.4)

    img = ImageEnhance.Color(img).enhance(1.16)
    img = ImageEnhance.Contrast(img).enhance(1.07)
    img = ImageEnhance.Brightness(img).enhance(1.02)
    img = ImageEnhance.Sharpness(img).enhance(1.5)
    img = img.filter(ImageFilter.UnsharpMask(radius=1.6, percent=55, threshold=2))

    # cap by the LONG edge so tall portrait shots don't balloon in file size
    w, h = img.size
    long_edge = max(w, h)
    if long_edge < target_w:
        scale = min(target_w / long_edge, 1.6)
        img = img.resize((int(w * scale), int(h * scale)), Image.LANCZOS)
    elif long_edge > target_w:
        scale = target_w / long_edge
        img = img.resize((max(1, int(w * scale)), max(1, int(h * scale))), Image.LANCZOS)

    jpg_path = path_out_base + ".jpg"
    webp_path = path_out_base + ".webp"
    img.save(jpg_path, "JPEG", quality=85, optimize=True)
    img.save(webp_path, "WEBP", quality=82, method=6)
    return orig_size, img.size, os.path.getsize(jpg_path)


if __name__ == "__main__":
    for src, name, target_w in FILES:
        in_path = os.path.join(SRC_DIR, src)
        out_base = os.path.join(OUT_DIR, name)
        orig, new, kb = enhance(in_path, out_base, target_w)
        print(f"{src:28s} -> {name:28s} {orig} -> {new}  {kb/1024:.0f}KB")
