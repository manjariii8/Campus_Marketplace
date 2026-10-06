import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getActiveWantedPosts,
  getMyWantedPosts,
} from "../services/wantedPostService";

const WantedBoard = () => {
  const [posts, setPosts] = useState([]);
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const loadWantedPosts = async () => {
    try {
      setLoading(true);
      setError("");

      const [allResponse, mineResponse] = await Promise.all([
        getActiveWantedPosts(),
        getMyWantedPosts(),
      ]);

      const allData = Array.isArray(allResponse?.data)
        ? allResponse.data
        : allResponse?.data?.data ?? [];

      const mineData = Array.isArray(mineResponse?.data)
        ? mineResponse.data
        : mineResponse?.data?.data ?? [];

      setPosts(allData);
      setMyPosts(mineData);
    } catch (err) {
      console.error("Failed to load wanted posts:", err);
      setError("Failed to load wanted requests. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWantedPosts();
  }, []);

  const displayedPosts = activeTab === "all" ? posts : myPosts;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600">
              CampusLoop
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Wanted Board
            </h1>

            <p className="mt-2 max-w-2xl text-slate-600">
              See what students on campus are looking for and help items find
              a second life.
            </p>
          </div>

          <Link
            to="/wanted/create"
            className="inline-flex items-center justify-center rounded-xl px-6 py-3 font-semibold text-white shadow-lg transition hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #2563eb, #4f46e5)",
            }}
          >
            + Request an Item
          </Link>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex w-fit rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
              activeTab === "all"
                ? "bg-blue-600 text-white shadow"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            All Requests
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("mine")}
            className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
              activeTab === "mine"
                ? "bg-blue-600 text-white shadow"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            My Requests
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
              <p className="text-slate-500">
                Loading wanted requests...
              </p>
            </div>
          </div>
        ) : displayedPosts.length === 0 ? (
          /* Empty state */
          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mb-4 text-6xl">🔎</div>

            <h2 className="text-2xl font-bold text-slate-900">
              No requests yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-slate-500">
              {activeTab === "mine"
                ? "You haven't posted any wanted requests yet."
                : "There are currently no active wanted requests."}
            </p>

            <Link
              to="/wanted/create"
              className="mt-6 inline-flex rounded-xl px-6 py-3 font-semibold text-white shadow-md transition hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #2563eb, #4f46e5)",
              }}
            >
              Request an Item
            </Link>
          </div>
        ) : (
          /* Cards */
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {displayedPosts.map((post) => (
              <Link
                key={post.id}
                to={`/wanted/${post.id}`}
                className="group block"
              >
                <article className="h-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 group-hover:-translate-y-1 group-hover:shadow-xl">

                  {/* Image */}
                  <div className="flex h-52 items-center justify-center overflow-hidden bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">
                    {post.imageData ? (
                      <img
                        src={post.imageData}
                        alt={post.title}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="text-center text-slate-400">
                        <div className="text-5xl">📦</div>
                        <p className="mt-2 text-sm font-medium">
                          No image
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">

                    {/* Category + Status */}
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      {post.categoryName && (
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                          {post.categoryName}
                        </span>
                      )}

                      {post.active && (
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                          Active
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h2 className="line-clamp-2 text-xl font-bold text-slate-900 transition group-hover:text-blue-600">
                      {post.title}
                    </h2>

                    {/* Description */}
                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">
                      {post.description || "No description provided."}
                    </p>

                    {/* Budget */}
                    <div className="mt-5 rounded-xl bg-emerald-50 px-4 py-3">
                      <p className="text-xs font-medium uppercase tracking-wide text-emerald-600">
                        Maximum Budget
                      </p>

                      <p className="mt-1 text-xl font-bold text-emerald-800">
                        ₹
                        {Number(post.maxBudget || 0).toLocaleString(
                          "en-IN"
                        )}
                      </p>
                    </div>

                    {/* Requester */}
                    <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                      <span>
                        By{" "}
                        <span className="font-semibold text-slate-700">
                          {post.requesterName || "Campus Student"}
                        </span>
                      </span>

                      <span>
                        {post.createdAt
                          ? new Date(
                              post.createdAt
                            ).toLocaleDateString("en-IN")
                          : ""}
                      </span>
                    </div>

                    {/* View Details */}
                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                      <span className="text-sm font-semibold text-blue-600">
                        View Request
                      </span>

                      <span className="text-lg text-blue-600 transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default WantedBoard;
