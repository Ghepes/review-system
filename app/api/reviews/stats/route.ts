import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const productId = searchParams.get("productId") || ""
  const website = searchParams.get("website") || ""

  if (!productId || !website) {
    return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
  }

  try {
    const { db } = await connectToDatabase()

    const pipeline = [
      { $match: { productId, website } },
      {
        $group: {
          _id: null,
          totalReviews: { $sum: 1 },
          averageRating: { $avg: "$rating" },
        },
      },
    ]

    const result = await db.collection("reviews").aggregate(pipeline).toArray()

    if (result.length > 0) {
      return NextResponse.json({
        totalReviews: result[0].totalReviews,
        averageRating: Math.round(result[0].averageRating * 10) / 10,
      })
    }

    return NextResponse.json({ totalReviews: 0, averageRating: 0 })
  } catch (error) {
    console.error("Error getting review stats:", error)
    return NextResponse.json({ error: "Failed to fetch review stats" }, { status: 500 })
  }
}
