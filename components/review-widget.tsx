"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { saveReview, getReviews, getReviewStats, type Review } from "@/app/actions/review-actions"

interface ReviewWidgetProps {
  productId: string
  website: string
}

export default function ReviewWidget({ productId, website }: ReviewWidgetProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState("all")
  const [sort, setSort] = useState("newest")
  const [stats, setStats] = useState({ totalReviews: 0, averageRating: 0 })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [name, setName] = useState("")
  const [rating, setRating] = useState(0)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")

  useEffect(() => {
    fetchReviews()
    fetchStats()
  }, [filter, sort])

  const fetchReviews = async () => {
    const fetchedReviews = await getReviews(productId, website, filter, sort)
    setReviews(fetchedReviews)
  }

  const fetchStats = async () => {
    const fetchedStats = await getReviewStats(productId, website)
    setStats(fetchedStats)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!rating) {
      alert("Please select a rating")
      return
    }

    setIsSubmitting(true)

    const review: Review = {
      id: Date.now().toString(),
      productId,
      name,
      rating,
      title,
      content,
      date: new Date().toISOString(),
      website,
    }

    await saveReview(review)

    // Reset form
    setName("")
    setRating(0)
    setTitle("")
    setContent("")
    setShowForm(false)
    setIsSubmitting(false)

    // Refresh data
    fetchReviews()
    fetchStats()
  }

  const getStarIcons = (rating: number) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(
          <span key={i} className="star-display">
            ★
          </span>,
        )
      } else {
        stars.push(
          <span key={i} className="star-empty">
            ★
          </span>,
        )
      }
    }
    return stars
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 my-4">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Product Reviews</h2>

      {/* Review Summary */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 p-4 bg-gray-50 rounded-lg">
        <div className="mb-4 md:mb-0">
          <div className="flex items-center">
            <span className="text-3xl font-bold text-gray-800">{stats.averageRating.toFixed(1)}</span>
            <div className="ml-2">
              <div className="flex text-xl">{getStarIcons(stats.averageRating)}</div>
              <p className="text-sm text-gray-600">{stats.totalReviews} reviews</p>
            </div>
          </div>
        </div>
        <div className="w-full md:w-auto">
          <button
            onClick={() => setShowForm(true)}
            className={`w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-200 ${
              showForm ? "hidden" : ""
            }`}
          >
            Write a Review
          </button>
        </div>
      </div>

      {/* Review Form */}
      {showForm && (
        <div className="mb-8 p-6 border border-gray-200 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Write Your Review</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="reviewer-name" className="block text-sm font-medium text-gray-700 mb-1">
                Your Name
              </label>
              <input
                type="text"
                id="reviewer-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
              <div className="star-rating">
                {[5, 4, 3, 2, 1].map((value) => (
                  <div key={value} className="inline-block">
                    <input
                      type="radio"
                      id={`star${value}`}
                      name="rating"
                      value={value}
                      checked={rating === value}
                      onChange={() => setRating(value)}
                      className="hidden"
                      required
                    />
                    <label
                      htmlFor={`star${value}`}
                      title={`${value} stars`}
                      className="cursor-pointer text-2xl px-1"
                      onClick={() => setRating(value)}
                    >
                      ★
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="review-title" className="block text-sm font-medium text-gray-700 mb-1">
                Review Title
              </label>
              <input
                type="text"
                id="review-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="review-content" className="block text-sm font-medium text-gray-700 mb-1">
                Your Review
              </label>
              <textarea
                id="review-content"
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              ></textarea>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition duration-200 disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter Options */}
      <div className="flex flex-wrap items-center justify-between mb-6">
        <div className="mb-2 md:mb-0">
          <label htmlFor="filter-rating" className="text-sm font-medium text-gray-700 mr-2">
            Filter by:
          </label>
          <select
            id="filter-rating"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
        <div>
          <label htmlFor="sort-by" className="text-sm font-medium text-gray-700 mr-2">
            Sort by:
          </label>
          <select
            id="sort-by"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No reviews yet. Be the first to review this product!</div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-200 pb-6 new-review">
              <div className="flex items-center mb-2">
                <div className="flex text-lg">{getStarIcons(review.rating)}</div>
                <span className="ml-2 text-sm text-gray-600">{review.rating}/5</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-800 mb-1">{review.title}</h4>
              <p className="text-gray-600 mb-3">{review.content}</p>
              <div className="flex items-center text-sm text-gray-500">
                <span className="font-medium">{review.name}</span>
                <span className="mx-2">•</span>
                <span>{formatDate(review.date)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
