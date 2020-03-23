# Web Monitor tool

## Setup
run: npm install

## Running in development
run: npm start

To change how often the server sends requests, set SCHEDULE environment variable. Uses cron schedule.

E.g: SCHEDULE="*/2 * * * *" node server.js

## Running in production
Run program with NODE_ENV="production".

SCHEDULE="*/1 * * * *" NODE_ENV="production" node server.js

## console logs sample:
> node server.js

Monitoring web pages with cron schedule: */1 * * * *
server running on port 3000
Requests are being sent...
url: http://httpstat.us, status: 200, took: 411 ms, content found: OK
url: http://httpstat.us/500?sleep=1000, returned an error with status: 500, took: 1409 ms
url: http://google.com, status: 200, took: 210 ms, content found: Google
url: http://bing.com, status: 200, took: 960 ms, content found: Bing
url: https://www.google.com/asdfvdsafvadsd, returned an error with status: 404, took: 126 ms
Requests are being sent...
url: http://httpstat.us, status: 200, took: 384 ms, content found: OK
url: http://httpstat.us/500?sleep=1000, returned an error with status: 500, took: 1388 ms
url: http://google.com, status: 200, took: 199 ms, content found: Google
url: http://bing.com, status: 200, took: 370 ms, content found: Bing
url: https://www.google.com/asdfvdsafvadsd, returned an error with status: 404, took: 74 ms