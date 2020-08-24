# English Wikipedia - Picture of the day

A simple viewer for English Wikipedia's picture of the day:

https://wppotd.vercel.app/

![screen shot of the above website](Screen-Shot-2020-08-24-at-12.30.06.png)

## API

https://wppotd.vercel.app/api/get?date=2020-08-23

the date must be in ISO date format or omitted, if omitted, today's date (UTC) will be used.

## Known issues

Pictures outsides Wikimedia Commons will fail, such as 2020-05-23, the
corresponding picture is
https://en.wikipedia.org/wiki/File:Paulette_del_Baye_-_Photograph_in_Les_Modes_75_(1907-03).jpg
