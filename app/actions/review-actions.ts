"use server"

import { connectToDatabase, serializeDocument } from "@/lib/mongodb"
import { revalidatePath } from "next/cache"

export type Review = {
  id: string
  productId: string
  name: string
  rating: number
  title: string
  content: string
  date: string
  website: string
}

export async function saveReview(review: Review) {
  try {
    const { db } = await connectToDatabase()

    // Insert the review into MongoDB
    await db.collection("reviews").insertOne(review)

    // Revalidate the reviews page to show the new review
    revalidatePath(`/reviews/${review.productId}`)

    return { success: true }
  } catch (error) {
    console.error("Error saving review:", error)
    return { success: false, error: "Failed to save review" }
  }
}

export async function getReviews(productId: string, website: string, filter?: string, sort?: string) {
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
    return serializeDocument(reviews)
  } catch (error) {
    console.error("Error getting reviews:", error)
    return []
  }
}

export async function getReviewStats(productId: string, website: string) {
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
      return {
        totalReviews: result[0].totalReviews,
        averageRating: Math.round(result[0].averageRating * 10) / 10,
      }
    }

    return { totalReviews: 0, averageRating: 0 }
  } catch (error) {
    console.error("Error getting review stats:", error)
    return { totalReviews: 0, averageRating: 0 }
  }
}
