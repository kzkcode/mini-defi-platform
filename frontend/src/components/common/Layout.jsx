import Header from "./Header";

export default function Layout({
  children,
  onConnect,
}) {
  return (
    <div className="min-h-screen bg-[#0B0F17] text-white flex flex-col">

      <Header onConnect={onConnect} />

      <main className="flex-1 px-4 py-6 max-w-md mx-auto w-full overflow-x-hidden">
        {children}
      </main>

    </div>
  );
}