import Link from "next/link";

export default function PostNotFound() {
  return (
    <div className="container mx-auto py-16 px-4 text-center">
      <h2 className="text-2xl font-bold mb-4">{"Post Not Found"}</h2>
      <p className="mb-8">
        {
          "Sorry, the post you're looking for doesn't exist or has been removed."
        }
      </p>
      <Link
        href="/"
        className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
      >
        {"Return to Home"}
      </Link>
    </div>
  );
}
