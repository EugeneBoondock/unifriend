"use client";

import Image from "next/image";

export default function TestPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Image Test Page</h1>
      
      <div className="space-y-8">
        {/* Test with fill */}
        <div>
          <h2 className="text-xl mb-2">Test 1: Image with fill</h2>
          <div className="relative w-[200px] h-[100px] border border-gray-300">
            <Image
              src="/images/unifriend.png"
              alt="Unifriend Logo Test 1"
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          </div>
        </div>

        {/* Test with dimensions */}
        <div>
          <h2 className="text-xl mb-2">Test 2: Image with dimensions</h2>
          <Image
            src="/images/unifriend.png"
            alt="Unifriend Logo Test 2"
            width={200}
            height={100}
            priority
          />
        </div>

        {/* Test with dimensions and auto height */}
        <div>
          <h2 className="text-xl mb-2">Test 3: Image with auto height</h2>
          <Image
            src="/images/unifriend.png"
            alt="Unifriend Logo Test 3"
            width={200}
            height={100}
            style={{ height: 'auto' }}
            priority
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Test 3: Regular img tag</h2>
          <Image
            src="/images/unifriend.png"
            alt="Unifriend Logo Test 3"
            width={200}
            height={100}
            className="h-auto w-auto"
            priority
            quality={100}
          />
        </div>
      </div>
    </div>
  );
} 