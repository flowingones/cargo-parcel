# Cargo Parcel: Server-Side and Dynamic Frontend Components

Cargo Parcel provides a solution for server-side rendered and dynamic frontend
components to bring your websites alive. It was developed with a server-side
first approach in mind and is implemented Deno first, but does support other
runtimes and platforms as well.

## Key Features:

- Based on `TSX` components
- Server-side rendering first
- Reactive state in the frontend
- Does not send any JavaScript to the browser by default
- Small bundle size in the frontend (3.5kb)

## On the roadmap (Not implemented yet)

- Component lifecycle hooks/effects for asynchronous calls and cleanup logic

## Integration with Cargo

This module exports a `Task` called `Parcel` for Cargo, which can be used in the
`tasks.onBootstrap` hook of Cargo's config.
