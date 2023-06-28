#!/usr/bin/bash

newimage() {
    if [[ $1 == *.webp ]]; then
        jpgthumb 200x200 $1
    elif [[ $1 == *.webp.jpg ]]; then
        echo -n
    else
        img2ext $1 webp
    fi
}

while read -r dir file; do
  (
    cd $dir
    if [[ $file != *.filepart ]]; then
        if [[ `file -b --mime-type $file` == image/* ]]; then
            newimage $file
        fi
    fi
  )

done < <(inotifywait -m -e create -e moved_to --format "%w %f" /var/www/html/mj/styles  /var/www/html/mj/describes/  /var/www/html/mj/mifs)

