Want a quick and dirty way to start a project? This repository might grab your attention.

Based on output of

`yarn create react-app react-typescript-styled-for-prototyping --template typescript`

## Keep in mind

Since this template has built-in proxy setup, any local 404 on traffic passed via proxy
will result in error simmilar to
`Error occurred while trying to proxy: localhost:3000/api/hey`
Which is 504 Gateway Timeout and not 404.

## Setup

- Run `yarn`
- Run `yarn start`
- `secret.env` will appear (it is git-ignored and used only locally)
- Populate backend info if you want to use one, but it is optional.

## Changes to original CRA output

Removed:
- Tests -> most likely you will pick something else
- Default styles
- WebVitals reporter

Added:
- style for body in `public/index.html`
- styled-components and types for it
- proxy to backend (done in "optional" way)
- start script is now executed via react-app-rewired
- "local" script - "local" uses localhost backend, "start" uses remote backend

Changed:
- default imports are using doublequotes - my personal preference
- removed autoopening project on start (see .env file)
- change unused expression error to be warn

