// ============================================================================
// ABOUT.TSX - The about page
// ============================================================================
// This page provides information about the app
// It's accessed by clicking the title in the sidebar or visiting "/about"

// Import the Link component for navigation
import { Link } from "react-router";

// ============================================================================
// DEFAULT EXPORT: The About component
// ============================================================================
export default function About() {
  return (
    // Main container for the about page content
    <div id="about">
      
      {/* BACK LINK: Returns to the main demo */}
      <Link to="/">← Go to demo</Link>
      {/* The arrow (←) is a Unicode character for a left arrow */}
      {/* Clicking this navigates to "/" (the home page) */}
      
      {/* PAGE TITLE */}
      <h1>About React Router Contacts</h1>

      {/* CONTENT SECTION */}
      <div>
        {/* INTRODUCTION PARAGRAPH */}
        <p>
          This is a demo application showing off some of the
          powerful features of React Router, including
          dynamic routing, nested routes, loaders, actions,
          and more.
        </p>

        {/* FEATURES SECTION */}
        <h2>Features</h2>
        <p>
          Explore the demo to see how React Router handles:
        </p>
        
        {/* LIST OF FEATURES */}
        <ul>
          <li>
            Data loading and mutations with loaders and
            actions
            {/* loaders fetch data, actions handle form submissions */}
          </li>
          <li>
            Nested routing with parent/child relationships
            {/* Like how sidebar.tsx wraps around other routes */}
          </li>
          <li>
            URL-based routing with dynamic segments
            {/* Like /contacts/:contactId where :contactId can be anything */}
          </li>
          <li>
            Pending and optimistic UI
            {/* Showing loading states and updating UI before server responds */}
          </li>
        </ul>

        {/* LEARN MORE SECTION */}
        <h2>Learn More</h2>
        <p>
          Check out the official documentation at{" "}
          {/* External link to React Router docs */}
          <a href="https://reactrouter.com">
            reactrouter.com
          </a>{" "}
          to learn more about building great web
          applications with React Router.
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// HOW ABOUT.TSX CONNECTS TO OTHER FILES:
// ============================================================================
// 1. routes.ts declares this as a standalone route (not in the sidebar layout)
// 2. Clicking "React Router Contacts" in the sidebar navigates here
// 3. This route does NOT show the sidebar - it's completely separate
// 4. The Layout from root.tsx still wraps this in HTML structure
// 5. Clicking "← Go to demo" navigates back to the home page
