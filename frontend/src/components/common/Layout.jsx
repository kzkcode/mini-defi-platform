import Header from "./Header";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-[#0B0F17] text-white">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}