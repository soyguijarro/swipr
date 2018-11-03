# ♥️ Swipr

_Tinder is broken, let's break it back!_

## Run once

```
npm start
```

:information_source: On the first run you'll be prompted to complete the login process and select some preferences

## Change config

```
npm start setup
```

## Scheduled run

A simple way is to set up a cron job. For example, to run it every day at 10 pm and redirect the output to `path/to/log`, add the following entry to your crontab file (edit it with `crontab -e`):

```
00 22 * * * cd /path/to/repo && npm start &>> /path/to/log
```

See this [guide to the `crontab` command](https://www.computerhope.com/unix/ucrontab.htm) for more info.
