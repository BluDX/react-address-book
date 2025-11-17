// ============================================================================
// EDIT-CONTACT.TSX - Form to edit a contact's information
// ============================================================================
// This page shows when you click "Edit" on a contact
// URL pattern: /contacts/:contactId/edit (e.g., /contacts/ryan-florence/edit)

// Import React Router components and hooks
import type { Route } from "./+types/edit-contact";
import { Form, redirect, useNavigate } from "react-router";

// Import data functions
import { getContact, updateContact } from "../data";

// ============================================================================
// LOADER FUNCTION: Fetches the contact to edit
// ============================================================================
// This runs before the page renders to load the current contact data
export async function loader({ params }: Route.LoaderArgs) {
  // params contains URL parameters like { contactId: "ryan-florence" }
  // Get the contact we want to edit
  const contact = await getContact(params.contactId);
  
  // If contact doesn't exist, throw a 404 error
  if (!contact) {
    throw new Response("Not Found", { status: 404 });
  }
  
  // Return the contact to the component
  return { contact };
}

// ============================================================================
// MAIN COMPONENT: The edit form
// ============================================================================
export default function EditContact({
  loaderData, // Data from the loader function above
}: Route.ComponentProps) {
  // Extract the contact from loaderData
  const { contact } = loaderData;
  
  // useNavigate gives us a function to navigate programmatically
  const navigate = useNavigate();

  return (
    // Form component from React Router
    <Form 
      key={contact.id}      // Key forces React to reset form if contact changes
      id="contact-form"     // ID for CSS styling
      method="post"         // POST method triggers the action function below
    >
      
      {/* NAME SECTION: First and last name inputs */}
      <p>
        <span>Name</span>
        
        {/* FIRST NAME INPUT */}
        <input
          aria-label="First name"           // Accessibility label
          defaultValue={contact.first}       // Pre-fill with current first name
          name="first"                       // Form field name (becomes key in form data)
          placeholder="First"                // Placeholder text
          type="text"                        // Text input type
        />
        
        {/* LAST NAME INPUT */}
        <input
          aria-label="Last name"
          defaultValue={contact.last}        // Pre-fill with current last name
          name="last"                        // Form field name
          placeholder="Last"
          type="text"
        />
      </p>
      
      {/* TWITTER SECTION */}
      <label>
        <span>Twitter</span>
        <input
          defaultValue={contact.twitter}     // Pre-fill with current twitter handle
          name="twitter"                     // Form field name
          placeholder="@jack"                // Example placeholder
          type="text"
        />
      </label>
      
      {/* AVATAR URL SECTION */}
      <label>
        <span>Avatar URL</span>
        <input
          aria-label="Avatar URL"
          defaultValue={contact.avatar}      // Pre-fill with current avatar URL
          name="avatar"                      // Form field name
          placeholder="https://example.com/avatar.jpg"
          type="text"
        />
      </label>
      
      {/* NOTES SECTION: Multi-line text area */}
      <label>
        <span>Notes</span>
        <textarea
          defaultValue={contact.notes}       // Pre-fill with current notes
          name="notes"                       // Form field name
          rows={6}                           // Show 6 rows of text
        />
      </label>
      
      {/* FORM BUTTONS */}
      <p>
        {/* SAVE BUTTON: Submits the form */}
        <button type="submit">Save</button>
        
        {/* CANCEL BUTTON: Goes back without saving */}
        <button 
          onClick={() => navigate(-1)}       // navigate(-1) goes back one page in history
          type="button"                      // type="button" prevents form submission
        >
          Cancel
        </button>
      </p>
    </Form>
  );
}

// ============================================================================
// ACTION FUNCTION: Saves the edited contact
// ============================================================================
// This runs when the form is submitted (when "Save" is clicked)
export async function action({
  params,  // URL parameters (contains contactId)
  request, // The HTTP request object with form data
}: Route.ActionArgs) {
  // Get all the form data from the request
  const formData = await request.formData();
  
  // Convert formData to a regular JavaScript object
  // Object.fromEntries() turns form data into: { first: "John", last: "Doe", ... }
  const updates = Object.fromEntries(formData);
  
  // Update the contact in the database with the new values
  await updateContact(params.contactId, updates);
  
  // After saving, redirect to the contact's detail page
  // Example: /contacts/ryan-florence
  return redirect(`/contacts/${params.contactId}`);
}

// ============================================================================
// HOW EDIT-CONTACT.TSX CONNECTS TO OTHER FILES:
// ============================================================================
// 1. routes.ts declares this route as /contacts/:contactId/edit
// 2. Clicking "Edit" in contact.tsx navigates here
// 3. The loader() calls getContact() from data.ts to get current values
// 4. The form displays in the <Outlet /> of sidebar.tsx
// 5. When the form is submitted, action() runs
// 6. action() calls updateContact() from data.ts to save changes
// 7. After saving, user is redirected back to contact.tsx
// 8. Clicking "Cancel" uses navigate(-1) to go back without saving
