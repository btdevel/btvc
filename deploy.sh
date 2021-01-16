#!/bin/bash

npm run-script build && (cd upload; ./upload_all.sh)

