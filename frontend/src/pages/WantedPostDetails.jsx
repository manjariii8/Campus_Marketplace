import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getActiveWantedPosts,
  getWantedPostMatches,
} from "../services/wantedPostService";

const WantedPostDetails = () => {
  const { id } = useParams();

  const [post, setPost] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [matchesLoading, setMatchesLoading] = useState(true);
  const [error, setError] = useState("");
  const [matchesError, setMatchesError] = useState("");

  useEffect(() => {
    const loadPost = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getActiveWantedPosts();

        const posts = Array.isArray(response?.data)
          ? response.data
          : (response?.data?.data ?? []);

        const foundPost = posts.find((item) => String(item.id) === String(id));

        if (!foundPost) {
          setError("Wanted request not found.");
          return;
        }

        setPost(foundPost);
      } catch (err) {
        console.error("Failed to load wanted post:", err);
        setError("Failed to load this wanted request.");
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [id]);

  useEffect(() => {
    const loadMatches = async () => {
      try {
        setMatchesLoading(true);
        setMatchesError("");

        const response = await getWantedPostMatches(id);

        const data = Array.isArray(response?.data)
          ? response.data
          : (response?.data?.data ?? []);

        setMatches(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load matching products:", err);

        const status = err?.response?.status;

        if (status === 403) {
          setMatchesError(
            "Matching products are only available to the owner of this request.",
          );
        } else {
          setMatchesError("Unable to load matching products right now.");
        }
      } finally {
        setMatchesLoading(false);
      }
    };

    if (id) {
      loadMatches();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
          <p className="text-slate-600">Loading request...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-12">
        <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 text-center shadow-lg">
          <div className="mb-4 text-5xl">🔎</div>

          <h1 className="text-2xl font-bold text-slate-900">
            Request not found
          </h1>

          <p className="mt-2 text-slate-500">
            {error || "This wanted request may no longer be available."}
          </p>

          <Link
            to="/wanted"
            className="mt-6 inline-flex rounded-xl px-6 py-3 font-semibold text-white transition hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #2563eb, #4f46e5)",
            }}
          >
            Back to Wanted Board
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Recently";

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        {/* Back */}
        <Link
          to="/wanted"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800"
        >
          ← Back to Wanted Board
        </Link>

        {/* Main Request */}
        <div className="overflow-hidden rounded-3xl bg-white shadow-xl">
          {/* Image */}
          <div className="flex min-h-[280px] items-center justify-center bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">
            {post.imageData ? (
              <img
                src={post.imageData}
                alt={post.title}
                className="h-full max-h-[420px] w-full object-contain"
              />
            ) : (
              <div className="text-center text-slate-400">
                <div className="text-7xl">📦</div>
                <p className="mt-3 font-medium">No image provided</p>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6 sm:p-10">
            {/* Category + Status */}
            <div className="mb-4 flex flex-wrap items-center gap-3">
              {post.categoryName && (
                <span className="rounded-full bg-blue-50 px-4 py-1.5 text-sm font-semibold text-blue-700">
                  {post.categoryName}
                </span>
              )}

              <span
                className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
                  post.active
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {post.active ? "Active Request" : "Closed"}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {post.title}
            </h1>

            {/* Requester */}
            <p className="mt-3 text-sm text-slate-500">
              Requested by{" "}
              <span className="font-semibold text-slate-700">
                {post.requesterName || "Campus Student"}
              </span>
              {" • "}
              {formattedDate}
            </p>

            {/* Budget */}
            <div className="mt-8 rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
              <p className="text-sm font-medium text-emerald-700">
                Maximum Budget
              </p>

              <p className="mt-1 text-3xl font-bold text-emerald-800">
                ₹{Number(post.maxBudget || 0).toLocaleString("en-IN")}
              </p>

              <p className="mt-1 text-sm text-emerald-600">
                A matching item should be within this budget.
              </p>
            </div>

            {/* Description */}
            <div className="mt-8">
              <h2 className="text-xl font-bold text-slate-900">
                What they're looking for
              </h2>

              <p className="mt-3 whitespace-pre-wrap leading-7 text-slate-600">
                {post.description || "No additional description provided."}
              </p>
            </div>

            {/* CampusLoop message */}
            <div className="mt-8 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-5">
              <h3 className="font-bold text-slate-900">♻️ CampusLoop Match</h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                We found marketplace items that may match this request based on
                category and budget.
              </p>
            </div>
          </div>
        </div>

        {/* Matching Products */}
        <section className="mt-10">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Semester Bridge
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
              Matching Products
            </h2>

            <p className="mt-2 max-w-2xl text-slate-600">
              Products currently listed on CampusLoop that fit this request's
              budget and category.
            </p>
          </div>

          {/* Loading */}
          {matchesLoading && (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
              <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

              <p className="text-slate-500">Finding matching products...</p>
            </div>
          )}

          {/* Error */}
          {!matchesLoading && matchesError && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
              <h3 className="font-bold text-amber-800">Matching unavailable</h3>

              <p className="mt-1 text-sm text-amber-700">{matchesError}</p>
            </div>
          )}

          {/* No matches */}
          {!matchesLoading && !matchesError && matches.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
              <div className="mb-4 text-5xl">🔍</div>

              <h3 className="text-xl font-bold text-slate-900">
                No matching products yet
              </h3>

              <p className="mx-auto mt-2 max-w-lg text-slate-500">
                We couldn't find an active product that matches this request's
                category and budget. Check back later as students add new
                listings.
              </p>

              <Link
                to="/products"
                className="mt-6 inline-flex rounded-xl px-6 py-3 font-semibold text-white shadow-md transition hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, #2563eb, #4f46e5)",
                }}
              >
                Browse Marketplace
              </Link>
            </div>
          )}

          {/* Matching product cards */}
          {!matchesLoading && !matchesError && matches.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {matches.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="group block"
                >
                  <article className="h-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 group-hover:-translate-y-1 group-hover:shadow-xl">
                    {/* Product Image */}
                    <div className="flex h-52 items-center justify-center overflow-hidden bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">
                      {product.imageData ? (
                        <img
                          src={product.imageData}
                          alt={product.name}
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="text-center text-slate-400">
                          <div className="text-5xl">📦</div>

                          <p className="mt-2 text-sm font-medium">No image</p>
                        </div>
                      )}
                    </div>

                    {/* Product Content */}
                    <div className="p-5">
                      {/* Category */}
                      {product.categoryName && (
                        <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                          {product.categoryName}
                        </span>
                      )}

                      {/* Product Name */}
                      <h3 className="mt-3 line-clamp-2 text-xl font-bold text-slate-900 transition group-hover:text-blue-600">
                        {product.name}
                      </h3>

                      {/* Description */}
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                        {product.description || "No description provided."}
                      </p>

                      {/* Price */}
                      <div className="mt-5 flex items-end justify-between">
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Price
                          </p>

                          <p className="mt-1 text-2xl font-bold text-emerald-700">
                            ₹
                            {Number(product.price || 0).toLocaleString("en-IN")}
                          </p>
                        </div>

                        {product.stock > 0 && (
                          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                            Available
                          </span>
                        )}
                      </div>

                      {/* Match indicator */}
                      <div className="mt-4 space-y-2 rounded-xl bg-slate-50 px-4 py-3">
                        <p className="text-xs font-semibold text-emerald-700">
                          ✓ Within requested budget
                        </p>

                        {post.categoryId &&
                          product.categoryId &&
                          String(post.categoryId) ===
                            String(product.categoryId) && (
                            <p className="text-xs font-semibold text-blue-700">
                              ✓ Same category
                            </p>
                          )}

                        {product.stock > 0 && (
                          <p className="text-xs font-semibold text-slate-600">
                            ✓ Currently available
                          </p>
                        )}
                      </div>

                      {/* View */}
                      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                        <span className="text-sm font-semibold text-blue-600">
                          View Product
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
        </section>

        {/* Bottom Actions */}
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/products"
            className="flex-1 rounded-xl px-6 py-3 text-center font-semibold text-white shadow-md transition hover:scale-[1.02]"
            style={{
              background: "linear-gradient(135deg, #2563eb, #4f46e5)",
            }}
          >
            Browse Marketplace
          </Link>

          <Link
            to="/wanted"
            className="flex-1 rounded-xl border border-slate-200 bg-white px-6 py-3 text-center font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            View More Requests
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WantedPostDetails;
