export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-surface rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-md text-center">
        <div className="text-5xl mb-4">🔗</div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">No payment link here</h1>
        <p className="text-sm text-gray-500">
          Visit a payment link shared with you by a merchant, or contact the sender for the correct URL.
        </p>
      </div>
    </div>
  )
}
