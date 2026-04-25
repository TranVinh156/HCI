# shadcn/ui Components

Clean React Router workspace that keeps only the shadcn/ui component set and the minimal configuration needed to build it.

## Structure

- `app/components/ui`: shadcn/ui components.
- `app/lib/utils.ts`: shared `cn` utility used by the components.
- `app/hooks/use-mobile.ts`: mobile hook required by the sidebar component.
- `app/app.css`: Tailwind and shadcn theme tokens.

## Development

Install the dependencies:

```bash
npm install
```

Start the development server with HMR:

```bash
npm run dev
```

## Build

Create a production build:

```bash
npm run build
```
