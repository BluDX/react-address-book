// ============================================================================
// SIDEBAR.TSX - The main layout with sidebar navigation
// ============================================================================
// This component shows on most pages and provides:
// 1. A sidebar with a list of contacts
// 2. A search bar to filter contacts
// 3. A "New" button to create contacts
// 4. A main content area where child routes appear

// Import React Router components we need
import {
  Form,           // A form component that works with React Router
  Link,           // For navigation without page reload
  NavLink,        // Like Link but adds CSS classes for active/pending states
  Outlet,         // Placeholder where child routes appear
  useNavigation,  // Hook to check navigation status (loading, etc.)
  useSubmit,      // Hook to submit forms programmatically
} from "react-router";

// Import our data fetching function
import { getContacts } from "../data";

// Import TypeScript types for this route
import type { Route } from "./+types/sidebar";

// Import React hook
import { useEffect } from "react";

// ============================================================================
// LOADER FUNCTION: Fetches data before the component renders
// ============================================================================
// This runs on the SERVER before the page loads
// It fetches the contact list and passes it to the component
export async function loader({
  request, // The incoming HTTP request object
}: Route.LoaderArgs) {
  // Create a URL object from the request to access query parameters
  const url = new URL(request.url);
  
  // Get the "q" parameter from the URL (the search query)
  // Example: /contacts?q=john would give us "john"
  const q = url.searchParams.get("q");
  
  // Fetch contacts from our fake database, optionally filtered by query
  const contacts = await getContacts(q);
  
  // Return an object with the data we want to pass to the component
  // This will be available in the component as loaderData
  return { contacts, q };
}

// ============================================================================
// MAIN COMPONENT: The sidebar layout
// ============================================================================
// This component receives data from the loader and displays the UI
export default function SidebarLayout({
  loaderData, // The data returned from the loader function above
}: Route.ComponentProps) {
  // Destructure the data from loaderData
  const { contacts, q } = loaderData;
  
  // useNavigation gives us info about the current navigation state
  // We can use this to show loading indicators
  const navigation = useNavigation();
  
  // useSubmit gives us a function to submit forms programmatically
  const submit = useSubmit();
  
  // Check if we're currently searching
  // navigation.location exists when navigating to a new page
  const searching =
    navigation.location && // Are we navigating?
    new URLSearchParams(navigation.location.search).has("q"); // Does the URL have a search query?

  // ============================================================================
  // EFFECT: Sync the search input with the URL
  // ============================================================================
  // This runs after the component renders
  // It updates the search input to match the URL query parameter
  useEffect(() => {
    // Get the search input element by ID
    const searchField = document.getElementById("q");
    
    // Make sure it's actually an input element (TypeScript check)
    if (searchField instanceof HTMLInputElement) {
      // Set the input's value to match the query parameter (or empty string)
      searchField.value = q || "";
    }
  }, [q]); // Run this effect whenever 'q' changes

  // ============================================================================
  // RENDER THE UI
  // ============================================================================
  return (
    // Fragment (<></>) groups multiple elements without adding extra HTML
    <>
      {/* SIDEBAR: The left panel with navigation */}
      <div id="sidebar">
        
        {/* HEADER: App title with link to About page */}
        <h1>
          <Link to="about">React Router Contacts</Link>
          {/* Link creates a clickable link that navigates without page reload */}
        </h1>
        
        {/* SEARCH AND NEW BUTTON SECTION */}
        <div>
          {/* SEARCH FORM */}
          <Form
            id="search-form"
            // onChange triggers whenever any input in the form changes
            onChange={(event) => {
              // Check if this is the first search (q is null)
              const isFirstSearch = q === null;
              
              // Submit the form programmatically
              submit(event.currentTarget, {
                // replace: true updates the URL without adding a history entry
                // We don't want the back button to go through each search letter
                replace: !isFirstSearch, // Only replace if NOT the first search
              });
            }}
            role="search" // Accessibility: tells screen readers this is a search
          >
            {/* SEARCH INPUT */}
            <input
              aria-label="Search contacts" // Accessibility label for screen readers
              // Add "loading" class when navigation is happening but NOT searching
              className={navigation.state === "loading" && !searching
                ? "loading"
                : ""}
              defaultValue={q || ""} // Set initial value from URL query
              id="q" // ID for finding this element and for form submission
              name="q" // Name attribute - this becomes the URL parameter
              placeholder="Search" // Placeholder text when input is empty
              type="search" // HTML5 search input type
            />
            
            {/* SEARCH SPINNER: Shows when searching */}
            <div
              aria-hidden // Hidden from screen readers (decorative only)
              hidden={!searching} // Only visible when searching is true
              id="search-spinner" // ID for CSS styling (spinning animation)
            />
          </Form>
          
          {/* NEW CONTACT FORM */}
          <Form method="post">
            {/* method="post" makes this a POST request to create new data */}
            {/* When submitted, this calls the action() function in root.tsx */}
            <button type="submit">New</button>
          </Form>
        </div>
        
        {/* NAVIGATION: List of contacts */}
        <nav>
          {/* Check if we have any contacts */}
          {contacts.length ? (
            // IF we have contacts, show a list
            <ul>
              {/* Map over each contact and create a list item */}
              {contacts.map((contact) => (
                // key helps React identify which items changed
                <li key={contact.id}>
                  {/* NavLink is like Link but adds active/pending classes */}
                  <NavLink
                    // className can be a function that receives state
                    className={({ isActive, isPending }) =>
                      isActive
                        ? "active"   // Contact is currently being viewed
                        : isPending
                        ? "pending"  // Navigation to this contact is in progress
                        : ""         // Default state
                    }
                    to={`contacts/${contact.id}`} // URL to navigate to
                  >
                    {/* Regular Link inside NavLink (Note: This seems redundant) */}
                    <Link to={`contacts/${contact.id}`}>
                      {/* Show contact name or "No Name" if empty */}
                      {contact.first || contact.last ? (
                        <>
                          {contact.first} {contact.last}
                        </>
                      ) : (
                        <i>No Name</i> // Italicized "No Name" text
                      )}
                      
                      {/* Show star if contact is favorited */}
                      {contact.favorite ? (
                        <span>★</span> // Filled star
                      ) : null}
                    </Link>
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            // ELSE (no contacts), show a message
            <p>
              <i>No contacts</i>
            </p>
          )}
        </nav>
      </div>
      
      {/* DETAIL PANEL: Main content area on the right */}
      <div 
        // Add "loading" class when navigation is happening
        className={navigation.state === "loading" ? "loading" : ""}
        id="detail"
      >
        {/* Outlet is where child routes appear */}
        {/* This is where home.tsx, contact.tsx, etc. will be rendered */}
        <Outlet />
      </div>
    </>
  );
}

// ============================================================================
// HOW SIDEBAR.TSX CONNECTS TO OTHER FILES:
// ============================================================================
// 1. routes.ts declares this as a LAYOUT that wraps other routes
// 2. The loader() function calls getContacts() from data.ts
// 3. The component displays the contacts in a sidebar
// 4. Clicking a contact name navigates to contact.tsx
// 5. The "New" button triggers the action() in root.tsx
// 6. Child routes (home.tsx, contact.tsx, etc.) appear in the <Outlet />
// 7. The search form updates the URL, which re-runs the loader
