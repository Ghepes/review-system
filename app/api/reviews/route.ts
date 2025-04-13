import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase, serializeDocument } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const productId = searchParams.get("productId") || ""
  const website = searchParams.get("website") || ""
  const filter = searchParams.get("filter") || "all"
  const sort = searchParams.get("sort") || "newest"

  if (!productId || !website) {
    return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
  }

  try {
    const { db } = await connectToDatabase()

    // Build query
    const query: any = { productId, website }

    if (filter && filter !== "all") {
      query.rating = Number.parseInt(filter)
    }

    // Build sort options
    let sortOptions: any = {}

    switch (sort) {
      case "newest":
        sortOptions = { date: -1 }
        break
      case "oldest":
        sortOptions = { date: 1 }
        break
      case "highest":
        sortOptions = { rating: -1 }
        break
      case "lowest":
        sortOptions = { rating: 1 }
        break
      default:
        sortOptions = { date: -1 }
    }

    // Get reviews from MongoDB
    const reviews = await db.collection("reviews").find(query).sort(sortOptions).toArray()

    // Serialize the MongoDB documents to plain objects
    return NextResponse.json(serializeDocument(reviews))
  } catch (error) {
    console.error("Error getting reviews:", error)
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }
}
