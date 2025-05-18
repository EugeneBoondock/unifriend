import Image from 'next/image';

export default function TestBackground() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Background Image Test</h1>
        <div className="relative w-full max-w-2xl h-64 bg-gray-800 rounded-lg overflow-hidden">
          <Image
            src="/images/background.png"
            alt="Background Test"
            fill
            className="object-cover"
          />
        </div>
        <p className="mt-4">If you can see the image above, the path is correct.</p>
      </div>
    </div>
  );
}
