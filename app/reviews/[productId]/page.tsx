import ReviewWidget from "@/components/review-widget"

export default function ReviewPage({ params }: { params: { productId: string } }) {
  const { productId } = params
  const website = "ui-app.com"

  return (
    <div className="container mx-auto px-4 py-8">
      <ReviewWidget productId={productId} website={website} />
    </div>
  )
}
