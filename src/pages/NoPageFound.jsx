export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center px-4">
      <h1 className="text-5xl font-bold text-gray-800 mb-4">🚧 404 🚧</h1>
      <p className="text-xl text-gray-600">Oops! The page you are looking for isn’t here 😕</p>
      <p className="text-lg text-gray-500 mt-2">Try checking the URL or go back to the dashboard 🏠</p>
    </div>
  );
}