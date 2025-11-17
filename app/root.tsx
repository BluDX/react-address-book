// ============================================================================
// ROOT.TSX - The foundation of your entire application
// ============================================================================
// This file wraps around EVERYTHING in your app. It provides the HTML structure,
// handles errors, and shows a loading screen while the app starts up

// Import React Router components we need
import {
  Outlet,              // A placeholder that shows child routes
  Scripts,             // Adds JavaScript to make the app interactive
  ScrollRestoration,   // Remembers scroll position when navigating
  isRouteErrorResponse, // Helper to check if an error came from a route
  redirect,            // Function to send users to a different page
} from "react-router";

// Import TypeScript types for this route
import type { Route } from "./+types/root";

// Import the CSS file that styles the entire application
import appStylesHref from "./app.css?url";

// Import a function to create new contacts
import { createEmptyContact } from "./data";

// ============================================================================
// DEFAULT EXPORT: The main App component
// ============================================================================
// This is super simple - it just shows an <Outlet />
// The <Outlet /> is where child routes (like sidebar, home, etc.) will appear
export default function App() {
  return <Outlet />; // This is where your other components will be rendered
}

// ============================================================================
// LAYOUT COMPONENT: The HTML shell around your entire app
// ============================================================================
// This provides the <html>, <head>, and <body> tags
// It wraps around ALL pages in your application
export function Layout({ children }: { children: React.ReactNode }) {
  // children is whatever content should appear inside the layout
  // (like your App component, error messages, or loading screens)
  
  return (
    // The main HTML document starts here
    <html lang="en"> {/* Sets the language to English */}
      
      {/* HEAD: Contains metadata about your page */}
      <head>
        {/* Tells the browser to use UTF-8 character encoding */}
        <meta charSet="utf-8" />
        
        {/* Makes the site responsive on mobile devices */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Link to your CSS file to style the entire app */}
        <link rel="stylesheet" href={appStylesHref} />
      </head>
      
      {/* BODY: Contains the visible content of your page */}
      <body>
        {/* This is where your actual app content appears */}
        {children}
        
        {/* Remembers and restores scroll position when navigating between pages */}
        <ScrollRestoration />
        
        {/* Adds all the JavaScript needed to make your React app work */}
        <Scripts />
      </body>
    </html>
  );
}

// ============================================================================
// ERROR BOUNDARY: Catches and displays errors in your app
// ============================================================================
// When something goes wrong anywhere in your app, this component catches
// the error and shows a nice error message instead of a blank white screen
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  // Set up default error message values
  let message = "Oops!"; // The main error heading
  let details = "An unexpected error occurred."; // More specific info
  let stack: string | undefined; // Technical error details (for developers)

  // CHECK: Is this a route error (like a 404 page not found)?
  if (isRouteErrorResponse(error)) {
    // If it's a 404 error, customize the message
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found." // 404 message
        : error.statusText || details; // Other error message
  } 
  // CHECK: Are we in development mode AND is this a regular JavaScript error?
  else if (import.meta.env.DEV && error && error instanceof Error) {
    // In development, show detailed error information
    details = error.message; // The error message
    stack = error.stack; // The stack trace (shows where the error happened)
  }

  // Display the error page
  return (
    <main id="error-page"> {/* Main content wrapper with ID for styling */}
      <h1>{message}</h1> {/* Show the main error heading */}
      <p>{details}</p>   {/* Show the detailed error message */}
      
      {/* If we have a stack trace, show it (only in development) */}
      {stack && (
        <pre> {/* Preformatted text to preserve spacing */}
          <code>{stack}</code> {/* Code formatting for the stack trace */}
        </pre>
      )}
    </main>
  );
}

// ============================================================================
// HYDRATE FALLBACK: Loading screen shown while app starts up
// ============================================================================
// "Hydration" is when React takes over the HTML sent from the server
// This component shows while that process happens
export function HydrateFallback() {
  return (
    // A centered loading screen
    <div id="loading-splash"> {/* Wrapper with ID for CSS styling */}
      {/* A spinning circle animation (styled in CSS) */}
      <div id="loading-splash-spinner" />
      {/* Text to tell the user what's happening */}
      <p>Loading, please wait...</p>
    </div>
  );
}

// ============================================================================
// ACTION FUNCTION: Handles the "New Contact" button
// ============================================================================
// This runs when a form with method="post" is submitted to the root route
// In this app, it's triggered by the "New" button in the sidebar
export async function action() {
  // Create a new empty contact in the database
  const contact = await createEmptyContact();
  
  // Redirect the user to the edit page for the new contact
  // Example: if contact.id is "abc123", redirect to "/contacts/abc123/edit"
  return redirect(`/contacts/${contact.id}/edit`);
}

// ============================================================================
// HOW ROOT.TSX CONNECTS TO OTHER FILES:
// ============================================================================
// 1. ROUTES.TS references the route files (home.tsx, contact.tsx, etc.)
// 2. Those route components render INSIDE the <Outlet /> in App()
// 3. App() renders INSIDE the Layout() component
// 4. Layout() provides the HTML structure for everything
// 5. If there's an error, ErrorBoundary() catches it
// 6. While loading, HydrateFallback() shows
// 7. The action() function handles creating new contacts from sidebar.tsx
