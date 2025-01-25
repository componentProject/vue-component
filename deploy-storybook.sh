#!/bin/bash
cd .vitepress/dist
git init
git remote add origin https://github.com/componentProject/vue-component-storybook.git
git add .
git commit -m 'test'
git push -u origin main