// ============================================================================
// CONTACT.TSX - Display a single contact's details
// ============================================================================
// This page shows when you click on a contact name in the sidebar
// URL pattern: /contacts/:contactId (e.g., /contacts/ryan-florence)

// Import React Router components
import { Form, useFetcher } from "react-router";

// Import TypeScript types and data functions
import type { ContactRecord } from "../data";
import { getContact, updateContact } from "../data";
import type { Route } from "./+types/contact";

// ============================================================================
// LOADER FUNCTION: Fetches the contact data
// ============================================================================
// This runs on the server before the page renders
// It loads the specific contact based on the ID in the URL
export async function loader({ params }: Route.LoaderArgs) {
  // params contains URL parameters like { contactId: "ryan-florence" }
  // Get the specific contact from our fake database
  const contact = await getContact(params.contactId);
  
  // If contact doesn't exist, throw a 404 error
  if (!contact) {
    throw new Response("Not Found", { status: 404 });
    // This will be caught by ErrorBoundary in root.tsx
  }
  
  // Return the contact data to the component
  return { contact };
}

// ============================================================================
// ACTION FUNCTION: Handles favorite button clicks
// ============================================================================
// This runs when a form is submitted to this route
// In this case, it's the favorite/unfavorite button
export async function action({
  params,  // URL parameters (contains contactId)
  request, // The HTTP request object
}: Route.ActionArgs) {
  // Get the form data from the request
  const formData = await request.formData();
  
  // Update the contact's favorite status in the database
  return updateContact(params.contactId, {
    // formData.get("favorite") returns a string: "true" or "false"
    // We compare it to "true" to get a boolean value
    favorite: formData.get("favorite") === "true",
  });
}

// ============================================================================
// MAIN COMPONENT: Displays the contact details
// ============================================================================
export default function Contact({
  loaderData, // Data from the loader function
}: Route.ComponentProps) {
  // Extract the contact from loaderData
  const { contact } = loaderData;

  return (
    // Main container for contact details
    <div id="contact">
      
      {/* AVATAR SECTION: Profile picture */}
      <div>
        <img
          alt={`${contact.first} ${contact.last} avatar`} // Accessibility text
          key={contact.avatar} // Key forces React to reload image if URL changes
          src={contact.avatar}  // Image URL
        />
      </div>

      {/* DETAILS SECTION: Name and information */}
      <div>
        {/* CONTACT NAME */}
        <h1>
          {/* Show name or "No Name" if both first and last are empty */}
          {contact.first || contact.last ? (
            <>
              {contact.first} {contact.last}
            </>
          ) : (
            <i>No Name</i>
          )}
          
          {/* FAVORITE BUTTON - rendered by Favorite component below */}
          <Favorite contact={contact} />
        </h1>

        {/* TWITTER LINK: Only shows if contact has twitter */}
        {contact.twitter ? (
          <p>
            <a
              href={`https://twitter.com/${contact.twitter}`}
            >
              {contact.twitter}
            </a>
          </p>
        ) : null}

        {/* NOTES: Only shows if contact has notes */}
        {contact.notes ? <p>{contact.notes}</p> : null}

        {/* ACTION BUTTONS SECTION */}
        <div>
          {/* EDIT BUTTON */}
          <Form action="edit">
            {/* action="edit" navigates to /contacts/:contactId/edit */}
            <button type="submit">Edit</button>
          </Form>

          {/* DELETE BUTTON */}
          <Form
            action="destroy"  // Navigates to /contacts/:contactId/destroy
            method="post"     // POST method triggers the action function
            onSubmit={(event) => {
              // Show a confirmation dialog before deleting
              const response = confirm(
                "Please confirm you want to delete this record.",
              );
              
              // If user clicks "Cancel", prevent form submission
              if (!response) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// FAVORITE COMPONENT: The favorite/unfavorite button
// ============================================================================
// This is a separate component that handles the star button
function Favorite({
  contact, // The contact object (only needs the favorite property)
}: {
  contact: Pick<ContactRecord, "favorite">; // TypeScript: only require favorite field
}) {
  // useFetcher creates a form that submits without navigation
  // Regular forms cause page navigation; fetchers don't
  const fetcher = useFetcher();
  
  // Determine the current favorite state
  // If the fetcher has form data (submission in progress), use that
  // Otherwise, use the contact's current favorite status
  const favorite = fetcher.formData
    ? fetcher.formData.get("favorite") === "true" // Optimistic UI update
    : contact.favorite; // Current saved state

  return (
    // fetcher.Form submits without causing navigation
    <fetcher.Form method="post">
      <button
        // Accessibility label for screen readers
        aria-label={
          favorite
            ? "Remove from favorites" // If favorited
            : "Add to favorites"      // If not favorited
        }
        name="favorite" // Form field name
        // The value toggles: if favorite, send "false"; if not, send "true"
        value={favorite ? "false" : "true"}
      >
        {/* Display filled or empty star based on favorite status */}
        {favorite ? "★" : "☆"}
        {/* ★ is a filled star, ☆ is an empty star */}
      </button>
    </fetcher.Form>
  );
}

// ============================================================================
// HOW CONTACT.TSX CONNECTS TO OTHER FILES:
// ============================================================================
// 1. routes.ts declares this route as /contacts/:contactId
// 2. The loader() calls getContact() from data.ts
// 3. Clicking a contact in sidebar.tsx navigates here
// 4. This component appears in the <Outlet /> of sidebar.tsx
// 5. Clicking "Edit" navigates to edit-contact.tsx
// 6. Clicking "Delete" submits to destroy-contact.tsx
// 7. Clicking the star calls the action() which calls updateContact() from data.ts
// 8. The Favorite component uses useFetcher for optimistic UI updates
