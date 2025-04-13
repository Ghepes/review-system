import type { Metadata } from "next"
import ReviewWidget from "@/components/review-widget"

export const metadata: Metadata = {
  title: "Review Widget",
}

export default function EmbedPage({ params }: { params: { productId: string } }) {
  const { productId } = params
  const website = "ui-app.com"

  return (
    <div className="p-0 m-0">
      <ReviewWidget productId={productId} website={website} />
    </div>
  )
}
