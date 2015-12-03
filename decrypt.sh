#!/bin/bash
if [[ -z "${CRYPT_PASS}" ]]; then
    printf  '\e[0;31mNo environ CRYPT_PASS specified! Abort!!!\n\e[0m'
    exit 1
fi

DIRNAME="tmp_$(date +'%s')"
mkdir ${DIRNAME}
file_list=$(find . -iname 'private-*' -type f)
for f in ${file_list}; do
    tmp_filename=$(basename ${f})
    openssl enc -d -base64 -aes-256-ecb -in "${f}" -k "${CRYPT_PASS}" 2>/dev/null > ${DIRNAME}/${tmp_filename} && echo "decrypting ${f}" && cp ${DIRNAME}/${tmp_filename} ${f}
    if [ $? -eq 0 ]; then
        printf "\e[0;32m Success decrypting ${f}\n\e[0m"
    else
        printf  "\e[0;31m Fail to decrypt ${f}! Abort!\n\e[0m"
        exit 2
    fi
    rm -rf ${DIRNAME}
done

exit 0
