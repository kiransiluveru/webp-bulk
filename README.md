


**Convert multiple images at a time to **webp** format.
You can execute as both CLI and via Script.**

Current Latest Version: 1.0.0

**Features:**

# Multiple images converted at a time
# Multiple extensions (jpg, png, etc) of images can be converted at a time
# All images in Current directory and it's sub directories are recursively checked
# All Output images can be in the separate directory or to its directory(sub directory, if) itself.



**Example Usage:**

```
From CLI Usage like this         : webp-bulk convert -e [image_extensions] -o
To Run as a script Use like this : node index.js convert -e [image extensions] -o

Flags:
-e, --extensions : provide extensions seperated by spaces ex: -e png jpg jpeg 
to convert all this extension images to webp format in current directory recursively.

-o, --output : It is optional parameter,
If you want all converted images to output to separate directory then provide this flag
By default output image is stored in its same directory(sub directory, if) path

```
