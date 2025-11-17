// ============================================================================
// ROUTES.TS - This file defines the structure of your application's pages
// ============================================================================
// Think of this as a "map" that tells React Router which components to show
// for different URLs in your application

// Import the types and functions we need to define routes
import type { RouteConfig } from "@react-router/dev/routes";
import { index, layout, route } from "@react-router/dev/routes";

// Export the route configuration as an array
// This array defines all the different pages/URLs your app can handle
export default [
  // LAYOUT WRAPPER: The sidebar.tsx file wraps around multiple child routes
  // This means the sidebar will be visible on all these pages
  layout("layouts/sidebar.tsx", [
    // INDEX ROUTE: When someone visits "/" (the root of your site)
    // Show the home.tsx component
    index("routes/home.tsx"),
    
    // DYNAMIC ROUTE: ":contactId" is a placeholder that can be any value
    // Example: /contacts/123 or /contacts/john_doe
    // This shows the contact.tsx component with the specific contact's details
    route("contacts/:contactId", "routes/contact.tsx"),
    
    // NESTED ROUTE: This handles deleting a contact
    // Example URL: /contacts/123/destroy
    // The ":contactId" part matches the contact ID to delete
    route(
      "contacts/:contactId/destroy",
      "routes/destroy-contact.tsx",
    ),
    
    // NESTED ROUTE: This handles editing a contact
    // Example URL: /contacts/123/edit
    // Shows a form to edit the contact with the matching ID
    route(
      "contacts/:contactId/edit",
      "routes/edit-contact.tsx",
    ),
  ]),
  
  // STANDALONE ROUTE: This is outside the layout, so no sidebar
  // When someone visits "/about", show the about.tsx component
  route("about", "routes/about.tsx"),
] satisfies RouteConfig; // This ensures TypeScript checks that we defined routes correctly

// ============================================================================
// HOW ROUTES CONNECT:
// ============================================================================
// 1. routes.ts defines WHICH components show for WHICH URLs
// 2. The components (like sidebar.tsx, home.tsx, etc.) are the actual pages
// 3. When a user navigates to a URL, React Router looks at this file
//    to decide which component to render
