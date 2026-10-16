#!/usr/bin/env python3
# pip install Pillow

import PIL.Image
import os
import sys

atlas_source = "atlas"
atlas_output = "atlas.png"
atlas_size_x = 16
atlas_size_y = 16
image_res_x = 32
image_res_y = 32
atlas_size_res_x = atlas_size_x * image_res_x
atlas_size_res_y = atlas_size_y * image_res_y

color_mode = "RGBA"

atlas = PIL.Image.new(color_mode, (atlas_size_res_x, atlas_size_res_y), color=(0, 0, 0, 0))

def add_image_to_atlas(atlas_slot_x, atlas_slot_y, path):
    image = PIL.Image.open(path)
    image = image.resize((image_res_x, image_res_y), PIL.Image.LANCZOS)

    offset_x = atlas_slot_x * image_res_x
    offset_y = atlas_slot_y * image_res_y

    for ix in range(image_res_x):
        for iy in range(image_res_y):
            pixel = image.getpixel((ix, iy))
            atlas.putpixel((ix + offset_x, iy + offset_y), pixel)

    image.close()

current_x = 0
current_y = 0

def fail(err):
    print(err, file=sys.stderr)
    exit(1)

def iterate_atlas():
    global current_x
    global current_y

    current_x += 1
    if current_x >= atlas_size_x:
        current_y += 1
        if current_y >= atlas_size_y:
            fail(f"atlas overflows. max images count: {image_res_x * image_res_y}")

def sort_number(name):
    arr = name.split("_")

    try:
        return int(arr[0])
    except ValueError:
        fail(f"the texture \"{name}\" is not numbered")

for name in sorted(os.listdir(atlas_source), key=sort_number):
    path = os.path.join(atlas_source, name)
    if os.path.isfile(path):
        add_image_to_atlas(current_x, current_y, path)
        iterate_atlas()

atlas.save(atlas_output)
atlas.close()
