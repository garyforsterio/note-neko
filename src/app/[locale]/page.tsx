import Link from 'next/link';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Life Tracker</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/diary"
          className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-2xl font-semibold mb-2">Daily Diary</h2>
          <p className="text-gray-600">
            Write and manage your daily entries with markdown support and person
            mentions.
          </p>
        </Link>

        <Link
          href="/people"
          className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-2xl font-semibold mb-2">People Profiles</h2>
          <p className="text-gray-600">
            Keep track of people you know, their details, and your interactions
            with them.
          </p>
        </Link>
      </div>
    </div>
  );
}
