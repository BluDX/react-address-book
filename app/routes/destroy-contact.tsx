// ============================================================================
// DESTROY-CONTACT.TSX - Handles deleting a contact
// ============================================================================
// This is a special "action-only" route - it has no UI component
// It only handles the deletion and then redirects away
// URL pattern: /contacts/:contactId/destroy

// Import redirect function from React Router
import { redirect } from "react-router";

// Import TypeScript types
import type { Route } from "./+types/destroy-contact";

// Import the delete function from our data layer
import { deleteContact } from "../data";

// ============================================================================
// ACTION FUNCTION: Deletes the contact and redirects
// ============================================================================
// This is the only export in this file - no UI component needed!
// This runs when a POST request is made to /contacts/:contactId/destroy
export async function action({ params }: Route.ActionArgs) {
  // params contains URL parameters like { contactId: "ryan-florence" }
  
  // Delete the contact from our fake database
  await deleteContact(params.contactId);
  
  // After deleting, redirect to the home page ("/")
  // This takes the user back to the contact list
  return redirect("/");
}

// ============================================================================
// HOW DESTROY-CONTACT.TSX CONNECTS TO OTHER FILES:
// ============================================================================
// 1. routes.ts declares this route as /contacts/:contactId/destroy
// 2. In contact.tsx, the Delete button submits a POST form to this route
// 3. The action() function runs, calling deleteContact() from data.ts
// 4. After deletion, the user is redirected to "/" (the home page)
// 5. The contact disappears from the sidebar list
// 
// NOTE: This file has NO default export (no component)
//       It's an "action-only" route that just processes the deletion
