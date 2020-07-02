<div align="center">
<img src="app/assets/logo.png" width="64px" />

## Underdog Addon Manager

</div>

<br>

<p>
  An addon manager for World of Warcraft. Let's you upgrade and install addons directly.
</p>

<br>

## Install

First, clone the repo via git and install dependencies:

```bash
git clone git@github.com:Birkbjo/underdog.git
cd underdog
yarn
```

## Starting Development

Start the app in the `dev` environment. This starts the renderer process in [**hot-module-replacement**](https://webpack.js.org/guides/hmr-react/) mode and starts a webpack dev server that sends hot updates to the renderer process:

```bash
yarn dev
```

Start hacking!

## Packaging for Production

To package apps for the local platform:

```bash
yarn package
```
