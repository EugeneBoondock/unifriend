import AdList from '@/components/ads/AdList';
import CreateAdForm from '@/components/ads/CreateAdForm';

export default async function BusinessAdsPage() {
  const response = await fetch(`${process.env.NEXTAUTH_URL}/api/ads`);
  const ads = await response.json();

  return (
    <div className="container py-8 md:py-12 pattern-container">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Business Ads</h1>
          <CreateAdForm />
        </div>
        <AdList ads={ads} />
      </div>
    </div>
  );
}