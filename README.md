# React 18 + TypeScript + Vite + TailwindCSS based TodoApp

**Note**: This might be a good starting point for your own projects. Give it a go.

![Screenshot](./Screenshot%202025-05-18%20at%2017-40-34%20Vite%20React%20TS.png)
Integrates with local storage for persistence.

# Setup

1. Install Node.js 22+
2. `npm install`
3. `npx playwright install`


## Run dev server

`npm run dev`

## Storybook for component driven design

[Storybook](https://storybook.js.org/)
Start storybook server:

`npm run storybook`

Run storybook tests useful for component specific testing:

```
npm run test:storybook
```

## playwright tests

[Playright](https://playwright.dev/)

`npm run test:e2e`


## Dev notes


After vite starter, to bring in tailwindcss:

`npm install -D tailwindcss@3.4.1 postcss@8 autoprefixer@10`


