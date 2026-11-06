// app/layout.js
// The HTML shell that wraps every page. Change the title to your app's name.
export const metadata = { title: "SoDA Hackathon Starter" }; // TODO(team): rename

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily: "system-ui, sans-serif",
          maxWidth: 720,
          margin: "40px auto",
          padding: "0 16px",
        }}
      >
        {children}
      </body>
    </html>
  );
}
