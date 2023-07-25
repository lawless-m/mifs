#!/usr/bin/bash -x

newimage() {
    if [[ $1 == *.webp ]]; then
       lossy $1 || cwebp -quiet -q 80 $1 -o $1
       jpgthumb 200x200 $1
    elif [[ $1 == *.webp.jpg ]]; then
        echo -n
    else
       jpgthumb 200x200 `img2ext $1 webp 2>&1`
    fi
}

while read -r dir file; do
  (
    cd $dir
    if [[ $file != *.filepart ]]; then
        (
          if [[ `file -b --mime-type $file` == image/* ]]; then
              newimage $file
          fi
        ) &
    fi
  )

done < <(
  inotifywait -m -e create -e moved_to --format "%w %f" \
    /var/www/html/mj/styles \
    /var/www/html/mj/mifs   \
    /var/www/html/mj/chikas \
    /var/www/html/mj/rooms  \
    /var/www/html/mj/objects
)
