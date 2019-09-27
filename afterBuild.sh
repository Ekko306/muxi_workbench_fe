curl ''$DINGTALK_URL'' \
   -H 'Content-Type: application/json' \
   -d '
  {"msgtype": "text", 
    "text": {
        "content": "部署🐔叫你部署啦！版本号：'$TRAVIS_TAG'"
     }
  }'