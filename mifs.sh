#!/usr/bin/bash

while read -r dir file; do
  
  echo $dir $file

  (
    cd $dir
    if [ $dir = describes ]; then
        echo describes
    else
        if [[ $file == *.filepart ]]; then    
            echo -n
        elif [[ $file == *.webp ]]; then
            jpgthumb 200x200 $file
        elif [[ $file == *.webp.jpg ]]; then
            echo tumb done
        else
            img2ext $file webp
        fi
    fi
  )

done < <(inotifywait -m -e create -e moved_to --format "%w %f" /var/www/html/mj/styles  /var/www/html/mj/describes/  /var/www/html/mj/mifs)

