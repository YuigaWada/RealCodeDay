#!/bin/bash

for size in 16 48 128
do
  convert ./source.png -resize ${size}x  -unsharp 1.5x1+0.7+0.02 ./${size}.png
done


#cf. https://qiita.com/ygkn/items/efa1e311006f5c900123
#Thanks for @ygkn.
