import Link from "next/link"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8 text-center">Product Review System</h1>
      <p className="text-lg text-center mb-8">
        This is a review system that allows users to submit reviews for products. Reviews are stored in MongoDB and can
        be accessed via API.
      </p>

      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Demo Pages</h2>
        <ul className="space-y-2">
          <li>
            <Link href="/reviews/product-1" className="text-blue-600 hover:underline">
              Example Product 1 Reviews
            </Link>
          </li>
          <li>
            <Link href="/reviews/product-2" className="text-blue-600 hover:underline">
              Example Product 2 Reviews
            </Link>
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">API Endpoints</h2>
        <ul className="space-y-2 text-sm">
          <li>
            <code className="bg-gray-100 p-1 rounded">GET /api/reviews?productId=product-1&website=ui-app.com</code>
          </li>
          <li>
            <code className="bg-gray-100 p-1 rounded">
              GET /api/reviews/stats?productId=product-1&website=ui-app.com
            </code>
          </li>
        </ul>
      </div>
    </div>
  )
}
