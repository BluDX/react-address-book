// ============================================================================
// HOME.TSX - The homepage / index route
// ============================================================================
// This is the simplest component in the app
// It shows when you visit the root URL ("/")

// No imports needed - this is just plain JSX

// ============================================================================
// DEFAULT EXPORT: The Home component
// ============================================================================
// This component displays a simple welcome message with a link
export default function Home() {
  return (
    // A paragraph with an ID for CSS styling
    <p id="index-page">
      {/* Simple text explaining what this app is */}
      This is a demo for React Router.
      <br /> {/* Line break */}
      Check out{" "} {/* The {" "} adds a space */}
      
      {/* A link to the React Router documentation */}
      <a href="https://reactrouter.com">
        the docs at reactrouter.com
      </a>
      . {/* Period after the link */}
    </p>
  );
}

// ============================================================================
// HOW HOME.TSX CONNECTS TO OTHER FILES:
// ============================================================================
// 1. routes.ts declares this as the index route (shows at "/")
// 2. This component appears inside the <Outlet /> in sidebar.tsx
// 3. The sidebar and navigation appear around this content
// 4. The Layout from root.tsx wraps everything in HTML structure
// 5. The CSS from app.css styles the #index-page ID
