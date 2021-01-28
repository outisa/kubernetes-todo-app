#!/bin/bash

file_to_read=$(curl -I https://en.wikipedia.org/wiki/Special:Random | grep -Fi Location | cut -d " " -f2)
file_no_whitespace="$(echo "${file_to_read}" | tr -d '[:space:]')"
json=$(cat << EOF
{
"todo": "Read $file_no_whitespace"
}
EOF
)

curl -X POST -H 'Content-Type: application/json' -d "$(echo $json)"  'http://todo-backend-svc/api/todos'