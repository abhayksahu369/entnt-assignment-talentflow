export default function Loader() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="flex flex-col items-center space-y-6">
                <div className="flex space-x-2">
                    <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-4 h-4 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.2s]"></div>
                    <div className="w-4 h-4 bg-blue-300 rounded-full animate-bounce [animation-delay:-0.4s]"></div>
                </div>
                <p className="text-lg font-semibold text-gray-700">
                    Just a moment <span className="text-blue-600">...</span>
                </p>
                <p className="text-sm text-gray-500">
                    We’re getting everything ready for you
                </p>
            </div>
        </div>

    )
}
