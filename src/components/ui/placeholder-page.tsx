export function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">{title}</h1>
      <div className="p-6 rounded-lg border bg-card text-card-foreground">
        <p className="text-lg mb-4">This page is currently under development.</p>
        <p>We're working hard to bring you the best experience. Check back soon for updates!</p>
      </div>
    </div>
  );
}
