import "./globals.css"; // <--- THIS LINE IS MISSING IN YOUR CODE

export const metadata = {
  title: "Live Bidding Platform",
  description: "Real-time auction app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}