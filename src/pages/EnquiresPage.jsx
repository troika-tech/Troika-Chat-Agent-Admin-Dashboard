import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { User2, Mail, MessageSquare } from "lucide-react";

export default function EnquiriesPage({chatbotId}) {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!chatbotId) return;
    const fetchQueries = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/enquiry?chatbotId=${chatbotId}`);
        setQueries(res.data);
      } catch (err) {
        console.error("Failed to fetch queries", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQueries();
  }, [chatbotId]);

  const markAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/enquiry/${id}/read`);
      setQueries(prev => prev.map(q => (q._id === id ? { ...q, read: true } : q)));
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  const total = queries.length;
  const read = queries.filter(q => q.read).length;
  const unread = total - read;

  return (
    <Layout>
      <div className="ml-64 px-6 py-8 min-h-screen bg-[#f7f8fc] text-gray-800 font-[Inter,sans-serif]">
        {/* Search + Filter */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 bg-white p-4 rounded-lg shadow-sm ">
          <input
            type="text"
            placeholder="Search enquiries..."
            className="w-full md:w-2/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select className="border px-3 py-2 rounded-md border-gray-300 text-sm">
            <option>All Enquiries</option>
            <option>Unread</option>
            <option>Read</option>
          </select>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow text-center py-4">
            <p className="text-3xl font-bold text-blue-600">{total}</p>
            <p className="text-gray-500 text-sm">Total Enquiries</p>
          </div>
          <div className="bg-white rounded-lg shadow text-center py-4">
            <p className="text-3xl font-bold text-orange-500">{unread}</p>
            <p className="text-gray-500 text-sm">Unread</p>
          </div>
          <div className="bg-white rounded-lg shadow text-center py-4">
            <p className="text-3xl font-bold text-green-600">{read}</p>
            <p className="text-gray-500 text-sm">Read</p>
          </div>
        </div>

        {/* Enquiries */}
        {loading ? (
          <p className="text-gray-600">Loading enquiries...</p>
        ) : queries.length === 0 ? (
          <p className="text-gray-600">No enquiries found.</p>
        ) : (
          <div className="space-y-4">
            {queries.map((q) => (
              <div
                key={q._id}
                className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
              >
                {/* Top Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-blue-600 font-semibold">
                    <User2 size={16} />
                    {q.name || "Anonymous"}
                    {/* Example tags - customize based on your data */}
                    {q.tags?.map((tag, i) => (
                      <span
                        key={i}
                        className="ml-2 text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  {!q.read && (
                    <button
                      onClick={() => markAsRead(q._id)}
                      className="flex items-center gap-1 border border-blue-500 text-blue-500 px-3 py-1 rounded text-sm hover:bg-blue-50"
                    >
                      <MessageSquare size={14} />
                      Mark as Read
                    </button>
                  )}
                </div>

                {/* Email */}
                <div className="flex items-center text-sm text-gray-500 gap-2 mb-2">
                  <Mail size={14} />
                  {q.email}
                </div>

                {/* Message */}
                <p className="text-sm text-gray-700">{q.question}</p>

                {/* Time */}
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(q.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between mt-8 text-sm text-gray-600">
          <span>
            Showing 1 to {queries.length} of {queries.length} enquiries
          </span>
          <div className="space-x-2">
            <button className="px-3 py-1 rounded border bg-white hover:bg-gray-100">
              &lt; Previous
            </button>
            <span>Page 1 of 1</span>
            <button className="px-3 py-1 rounded border bg-white hover:bg-gray-100">
              Next &gt;
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
