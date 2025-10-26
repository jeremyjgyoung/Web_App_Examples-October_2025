export function LayoutExamples() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="container mx-auto space-y-16 py-8">
        {/* One Column Layout */}
        <section>
          <h2 className="mb-4 text-2xl font-bold">One Column Layout</h2>
          <div className="grid grid-cols-1 gap-4">
            <div className="rounded-lg bg-blue-100 p-6 shadow">Column 1</div>
          </div>
        </section>

        {/* Two Columns Layout */}
        <section>
          <h2 className="mb-4 text-2xl font-bold">Two Columns Layout</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-lg bg-green-100 p-6 shadow">Column 1</div>
            <div className="rounded-lg bg-green-100 p-6 shadow">Column 2</div>
          </div>
        </section>

        {/* Three Columns Layout */}
        <section>
          <h2 className="mb-4 text-2xl font-bold">Three Columns Layout</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-lg bg-purple-100 p-6 shadow">Column 1</div>
            <div className="rounded-lg bg-purple-100 p-6 shadow">Column 2</div>
            <div className="rounded-lg bg-purple-100 p-6 shadow">Column 3</div>
          </div>
        </section>

        {/* Masonry Grid Layout */}
        <section>
          <h2 className="mb-4 text-2xl font-bold">Masonry Grid Layout</h2>
          <div className="grid auto-rows-min grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="row-span-2 rounded-lg bg-yellow-100 p-6 shadow">
              Item 1 (Span 2)
            </div>
            <div className="rounded-lg bg-yellow-100 p-6 shadow">Item 2</div>
            <div className="rounded-lg bg-yellow-100 p-6 shadow">Item 3</div>
            <div className="rounded-lg bg-yellow-100 p-6 shadow">Item 4</div>
            <div className="row-span-2 rounded-lg bg-yellow-100 p-6 shadow">
              Item 5 (Span 2)
            </div>
            <div className="rounded-lg bg-yellow-100 p-6 shadow">Item 6</div>
          </div>
        </section>

        {/* Sidebar + Content Layout */}
        <section>
          <h2 className="mb-4 text-2xl font-bold">Sidebar + Content Layout</h2>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
            <aside className="rounded-lg bg-gray-100 p-6 shadow lg:col-span-1">
              Sidebar
            </aside>
            <main className="rounded-lg bg-white p-6 shadow lg:col-span-3">
              Main Content
            </main>
          </div>
        </section>

        {/* Responsive Multi-Column Layout */}
        <section>
          <h2 className="mb-4 text-2xl font-bold">
            Responsive Multi-Column Layout
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-lg bg-red-100 p-6 shadow">
                Item {i + 1}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
