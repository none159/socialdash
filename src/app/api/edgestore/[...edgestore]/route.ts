import { initEdgeStore } from "@edgestore/server";
import { createEdgeStoreNextHandler } from "@edgestore/server/adapters/next/app";

// Initialize Edge Store
const es = initEdgeStore.create(); // No arguments here

// Define the router
const edgeStoreRouter = es.router({
  myPublicImages: es.imageBucket(),
});

// Create the handler
const handler = createEdgeStoreNextHandler({
  router: edgeStoreRouter,
});

// Export the handlers
export { handler as GET, handler as POST };
export type EdgeStoreRouter = typeof edgeStoreRouter;
