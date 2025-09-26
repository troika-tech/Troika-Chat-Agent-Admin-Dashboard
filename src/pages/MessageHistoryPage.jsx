import { useEffect, useState } from "react";
import {
  Mail,
  Eye,
  Clock,
  User,
  ChevronDown,
  Filter,
  X,
  Download,
  Users,
  Search,
  Calendar,
} from "lucide-react";
import api from "../services/api";
import { toast } from "react-toastify";
import { Dialog, Menu } from "@headlessui/react";
import Layout from "../components/Layout";
import { saveAs } from "file-saver";

const isEmail = (v = "") => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

// Helper function to detect guest users
const isGuestUser = (msg) => {
  return !msg.email && !msg.phone && msg.session_id;
};

// --- Skeleton Loader Components ---
const SkeletonRow = () => (
  <tr className="animate-pulse">
    <td className="w-20 md:w-32 lg:w-40 px-2 md:px-4 py-3 md:py-4 text-center">
      <div className="h-3 md:h-4 bg-gray-200 rounded w-16 md:w-20 mx-auto"></div>
      <div className="h-2 md:h-3 bg-gray-200 rounded w-12 md:w-16 mx-auto mt-1"></div>
    </td>
    <td className="w-24 md:w-32 lg:w-40 px-2 md:px-4 py-3 md:py-4 text-center">
      <div className="h-4 md:h-5 bg-gray-200 rounded-full w-12 md:w-16 mx-auto"></div>
      <div className="h-2 md:h-3 bg-gray-200 rounded w-8 md:w-12 mx-auto mt-1"></div>
    </td>
    <td className="px-2 md:px-4 py-3 md:py-4">
      <div className="h-3 md:h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-3 md:h-4 bg-gray-200 rounded w-3/4 mt-1"></div>
    </td>
    <td className="w-20 md:w-32 lg:w-36 px-2 md:px-4 py-3 md:py-4 text-center">
      <div className="h-4 md:h-5 bg-gray-200 rounded-full w-12 md:w-16 mx-auto"></div>
    </td>
    <td className="w-16 md:w-20 lg:w-24 px-2 md:px-4 py-3 md:py-4 text-center">
      <div className="h-4 w-4 md:h-5 md:w-5 bg-gray-200 rounded-full mx-auto"></div>
    </td>
  </tr>
);

const TableSkeleton = ({ rows = 10 }) => (
  <div className="shadow-md rounded-lg table-container bg-white rounded-2xl">
    <table className="w-full text-xs md:text-sm lg:text-base text-left text-gray-700">
      <thead className="bg-gray-50 text-gray-700 uppercase text-xs md:text-sm font-semibold border-b border-gray-200">
        <tr>
          <th scope="col" className="w-20 md:w-32 lg:w-40 px-2 md:px-4 py-3 md:py-4 text-center">
            <div className="flex items-center justify-center gap-1">
              <Clock className="w-3 h-3 md:w-4 md:h-4" /> <span className="hidden sm:inline">Time</span>
            </div>
          </th>
          <th scope="col" className="w-24 md:w-32 lg:w-40 px-2 md:px-4 py-3 md:py-4 text-center">
            <div className="flex items-center justify-center gap-1">
              <User className="w-3 h-3 md:w-4 md:h-4" /> <span className="hidden sm:inline">Sender</span>
            </div>
          </th>
          <th scope="col" className="px-2 md:px-4 py-3 md:py-4">
            <span className="hidden sm:inline">Message</span>
            <span className="sm:hidden">Msg</span>
          </th>
          <th scope="col" className="w-20 md:w-32 lg:w-36 px-2 md:px-4 py-3 md:py-4 text-center">
            <div className="flex items-center justify-center gap-1">
              <Mail className="w-3 h-3 md:w-4 md:h-4" /> <span className="hidden sm:inline">Contact</span>
            </div>
          </th>
          <th scope="col" className="w-16 md:w-20 lg:w-24 px-2 md:px-4 py-3 md:py-4 text-center">
            Action
          </th>
        </tr>
      </thead>
      <tbody className="text-sm md:text-base divide-y divide-gray-700">
        {Array.from({ length: rows }).map((_, index) => (
          <SkeletonRow key={index} />
        ))}
      </tbody>
    </table>
  </div>
);
// --- End Skeleton Components ---

export default function MessageHistoryPage() {
  const [messages, setMessages] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [emailFilter, setEmailFilter] = useState("");
  const [phoneFilter, setPhoneFilter] = useState("");
  const [guestFilter, setGuestFilter] = useState(false);
  const [separateSessionFilter, setSeparateSessionFilter] = useState("");
  const [page, setPage] = useState(1);
  const [allEmails, setAllEmails] = useState([]);
  const [allPhoneNumbers, setAllPhoneNumbers] = useState([]);
  const [allSessions, setAllSessions] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [loadingChat, setLoadingChat] = useState(false);
  const [showGuests, setShowGuests] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isDateRange, setIsDateRange] = useState(false);
  const token = localStorage.getItem("token");

  // Load Exo 2 font
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Exo+2:wght@300;400;500;600;700;800;900&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);

  useEffect(() => {
    fetchMessages();
    fetchEmailsAndPhoneNumbers();
    fetchSessions();
  }, [page, emailFilter, phoneFilter, guestFilter, separateSessionFilter, showGuests, searchTerm, dateFilter, startDate, endDate]);

  const fetchMessages = async () => {
    try {
      setLoadingMessages(true);
      
      // If searching, fetch all messages first, then paginate on client side
      if (searchTerm.trim()) {
        // For search, we need to fetch all messages and filter client-side
        let url = `/user/messages`;
        // Add parameters for fetching all messages
        const params = new URLSearchParams();
        params.append('limit', '1000'); // Fetch more messages for search
        params.append('page', '1');
        
        // Enable email filter
        if (emailFilter) {
          params.append('email', emailFilter);
        }
        
        // Enable phone filter
        if (phoneFilter) {
          params.append('phone', phoneFilter);
        }
        
        // Enable guest filter
        if (guestFilter) {
          params.append('is_guest', 'true');
        }
        
        // Enable session filter
        if (separateSessionFilter) {
          params.append('session_id', separateSessionFilter);
        }
        
        url += `?${params.toString()}`;

        const res = await api.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        // Handle nested response structure
        const messageData = res.data.data || res.data;
        let allMessages = messageData.messages || [];
        
        // Debug: Log first few messages to understand data structure
        console.log("API Response structure:", {
          rawResponse: res.data,
          messageData,
          firstFewMessages: allMessages.slice(0, 3)
        });
        
        // Filter by guest status
        if (!showGuests) {
          allMessages = allMessages.filter(msg => !isGuestUser(msg));
        }
        
        // Filter by search term
        allMessages = allMessages.filter(msg => 
          msg.content.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        // Client-side date filtering
        if (dateFilter) {
          const selectedDate = new Date(dateFilter);
          allMessages = allMessages.filter(msg => {
            const msgDate = new Date(msg.timestamp);
            return msgDate.toDateString() === selectedDate.toDateString();
          });
        }
        
        if (startDate && endDate) {
          const start = new Date(startDate);
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999); // Include the entire end date
          allMessages = allMessages.filter(msg => {
            const msgDate = new Date(msg.timestamp);
            return msgDate >= start && msgDate <= end;
          });
        }
        
        // Client-side pagination for search results
        const startIndex = (page - 1) * 20;
        const endIndex = startIndex + 20;
        const paginatedMessages = allMessages.slice(startIndex, endIndex);
        
        setMessages(paginatedMessages);
        setTotalPages(Math.ceil(allMessages.length / 20) || 1);
      } else {
        // Check if date filters are active - if so, use client-side pagination
        if (dateFilter || (startDate && endDate)) {
          // Fetch all messages for client-side filtering and pagination
          let url = `/user/messages`;
          // Add parameters for fetching all messages for date filtering
          const params = new URLSearchParams();
          params.append('limit', '1000'); // Fetch more messages for date filtering
          params.append('page', '1');
          
          // Enable email filter
          if (emailFilter) {
            params.append('email', emailFilter);
          }
          
          // Enable phone filter
          if (phoneFilter) {
            params.append('phone', phoneFilter);
          }
          
          // Enable guest filter
          if (guestFilter) {
            params.append('is_guest', 'true');
          }
          
          // Enable session filter
          if (separateSessionFilter) {
            params.append('session_id', separateSessionFilter);
          }
          
          url += `?${params.toString()}`;
          // ...existing code...

          const res = await api.get(url, {
            headers: { Authorization: `Bearer ${token}` },
          });
          
          // Handle nested response structure
          const messageData = res.data.data || res.data;
          let allMessages = messageData.messages || [];
          
          // Debug: Log first few messages to understand data structure
          console.log("API Response structure (date filter):", {
            rawResponse: res.data,
            messageData,
            firstFewMessages: allMessages.slice(0, 3)
          });
          
          // Filter by guest status
          if (!showGuests) {
            allMessages = allMessages.filter(msg => !isGuestUser(msg));
          }
          
          // Client-side date filtering
          if (dateFilter) {
            const selectedDate = new Date(dateFilter);
            allMessages = allMessages.filter(msg => {
              const msgDate = new Date(msg.timestamp);
              return msgDate.toDateString() === selectedDate.toDateString();
            });
          }
          
          if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999); // Include the entire end date
            allMessages = allMessages.filter(msg => {
              const msgDate = new Date(msg.timestamp);
              return msgDate >= start && msgDate <= end;
            });
          }
          
          // Client-side pagination
          const startIndex = (page - 1) * 20;
          const endIndex = startIndex + 20;
          const paginatedMessages = allMessages.slice(startIndex, endIndex);
          
          setMessages(paginatedMessages);
          setTotalPages(Math.ceil(allMessages.length / 20) || 1);
        } else {
          // Normal server-side pagination when no date filters
          let url = `/user/messages`;
          // Add pagination parameters
          const params = new URLSearchParams();
          params.append('page', page);
          params.append('limit', '20');
          
          // Enable email filter
          if (emailFilter) {
            params.append('email', emailFilter);
          }
          
          // Enable phone filter
          if (phoneFilter) {
            params.append('phone', phoneFilter);
          }
          
          // Enable guest filter
          if (guestFilter) {
            params.append('is_guest', 'true');
          }
          
          // Enable session filter
          if (separateSessionFilter) {
            params.append('session_id', separateSessionFilter);
          }
          
          url += `?${params.toString()}`;
          // ...existing code...

          const res = await api.get(url, {
            headers: { Authorization: `Bearer ${token}` },
          });
          
          // Handle nested response structure
          const messageData = res.data.data || res.data;
          let filteredMessages = messageData.messages || [];
          
          // Debug: Log first few messages to understand data structure
          console.log("API Response structure (normal):", {
            rawResponse: res.data,
            messageData,
            firstFewMessages: filteredMessages.slice(0, 3)
          });
          
          // Filter by guest status
          if (!showGuests) {
            filteredMessages = filteredMessages.filter(msg => !isGuestUser(msg));
          }
          
          setMessages(filteredMessages);
          setTotalPages(messageData.totalPages || 1);
        }
      }
    } catch (err) {
      toast.error("Failed to fetch messages");
    } finally {
      setLoadingMessages(false);
    }
  };

  const fetchEmailsAndPhoneNumbers = async () => {
    try {
      const res = await api.get("/user/messages/unique-emails-and-phones", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Handle nested response structure
      const emailData = res.data.data || res.data;
      console.log("📊 Emails/Phones response:", res.data);
      console.log("📊 Extracted emails:", emailData.emails?.length || 0);
      console.log("📊 Extracted phone numbers:", emailData.phoneNumbers?.length || 0);
      
      setAllEmails(emailData.emails || []);
      setAllPhoneNumbers(emailData.phoneNumbers || []);
    } catch (err) {
      console.error("Failed to fetch emails and phone numbers", err);
    }
  };

  const fetchSessions = async () => {
    try {
      // Fetch all sessions from the dedicated endpoint
      const res = await api.get("/user/sessions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const sessionData = res.data.data || res.data;
      const sessionsRaw = sessionData.sessions || [];

      // For accuracy, query one message per session to determine guest status
      const sessionChecks = sessionsRaw.map(async (session) => {
        try {
          // Fetch more messages (up to 100) for this session and check if any are guest messages
          const resp = await api.get(`/user/messages?session_id=${encodeURIComponent(session.session_id)}&limit=100`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const d = resp.data.data || resp.data;
          const msgs = d.messages || [];
          const isGuest = msgs.some(m => m.is_guest === true);
          console.log(`Session check for ${session.session_id}: msgs=${msgs.length} is_guest=${isGuest}`);
          // Log up to first 3 messages for inspection
          console.log(msgs.slice(0,3));
          return {
            id: session.session_id,
            name: `Session: ${session.session_id}`,
            is_guest: isGuest,
          };
        } catch (e) {
          // If request fails, default to false (user session) but log the error
          console.error(`Failed to fetch messages for session ${session.session_id}`, e);
          return {
            id: session.session_id,
            name: `Session: ${session.session_id}`,
            is_guest: false,
          };
        }
      });

      const settled = await Promise.allSettled(sessionChecks);
      const sessions = settled.map(s => (s.status === 'fulfilled' ? s.value : { id: '', name: '', is_guest: false })).filter(s => s.id);
  setAllSessions(sessions);
  console.log("📊 All sessions fetched:", sessions.length, sessions.slice(0,10));
    } catch (err) {
      console.error("Failed to fetch sessions from /user/sessions", err);
      setAllSessions([]);
    }
  };

  const openChatModal = async (contact) => {
    if (!contact) return; // safety

    setSelectedChat(contact);
    setLoadingChat(true);

    try {
      // Test basic API connectivity
      const testUrl = `/user/messages`;
      const testRes = await api.get(testUrl, { headers: { Authorization: `Bearer ${token}` } });
      
      // Build URL with proper parameters for the existing endpoint
      const params = new URLSearchParams();
      params.append('limit', '1000'); // Fetch more messages for chat history
      params.append('page', '1');
      
      if (contact.includes('Session:')) {
        // Handle guest session
        const sessionId = contact.replace('Session: ', '');
        params.append('session_id', sessionId);
        console.log("Filtering by session_id:", sessionId);
      } else {
        // Handle regular email/phone
        const key = isEmail(contact) ? "email" : "phone";
        const value = isEmail(contact) ? contact.toLowerCase() : contact;
        params.append(key, value);
        console.log(`Filtering by ${key}:`, value);
      }

      const url = `/user/messages?${params.toString()}`;
      console.log("Fetching chat history for contact:", contact);
      console.log("Constructed URL:", url);
      console.log("URLSearchParams entries:", Array.from(params.entries()));

      const res = await api.get(url, { headers: { Authorization: `Bearer ${token}` } });

      // Handle the response structure as documented
      if (res.data.success && res.data.data) {
        const msgs = (res.data.data.messages ?? [])
          .slice()
          .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        console.log(`Found ${msgs.length} messages for contact:`, contact);
        setChatHistory(msgs);
      } else {
        console.warn("Unexpected response structure:", res.data);
        setChatHistory([]);
      }
    } catch (err) {
      console.error("Error fetching chat history:", err);
      console.error("Error response:", err.response?.data);
      console.error("Error status:", err.response?.status);
      console.error("Error headers:", err.response?.headers);
      
      if (err.response?.status === 400) {
        const errorMessage = err.response?.data?.message || "Invalid request parameters";
        const errorDetails = err.response?.data?.details || [];
        console.error("Backend error message:", errorMessage);
        console.error("Backend error details:", errorDetails);
        console.error("Full error response:", err.response?.data);
        
        // Log each detail item individually
        if (Array.isArray(errorDetails)) {
          errorDetails.forEach((detail, index) => {
            console.error(`Error detail ${index}:`, detail);
          });
        }
        toast.error(`Bad Request: ${errorMessage}`);
      } else if (err.response?.status === 404) {
        toast.error("No messages found for this contact.");
      } else {
        toast.error("Failed to load chat history. Please try again.");
      }
      
      // Try fallback approach - fetch all messages and filter client-side
      console.log("Attempting fallback: fetch all messages and filter client-side");
      try {
        // First try with minimal parameters
        console.log("Testing basic API call with minimal parameters...");
        const basicUrl = `/user/messages`;
        const basicRes = await api.get(basicUrl, { headers: { Authorization: `Bearer ${token}` } });
        
        if (basicRes.data.success && basicRes.data.data) {
          console.log("Basic API call successful, now filtering client-side");
          let allMessages = basicRes.data.data.messages || [];
          
          // Filter client-side based on contact type
          if (contact.includes('Session:')) {
            const sessionId = contact.replace('Session: ', '');
            allMessages = allMessages.filter(msg => msg.session_id === sessionId);
          } else if (isEmail(contact)) {
            allMessages = allMessages.filter(msg => msg.email === contact.toLowerCase());
          } else {
            // Try different phone number formats for filtering
            const phoneFormats = [
              contact,
              `+91${contact}`,
              `+91-${contact}`,
              `91${contact}`,
              contact.replace(/(\d{5})(\d{5})/, '$1-$2'),
            ];
            
            allMessages = allMessages.filter(msg => 
              phoneFormats.includes(msg.phone) || msg.phone === contact
            );
          }
          
          const msgs = allMessages
            .slice()
            .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
            
          console.log(`Fallback: Found ${msgs.length} messages for contact:`, contact);
          setChatHistory(msgs);
          toast.success(`Found ${msgs.length} messages using fallback method`);
        } else {
          console.log("Basic API call failed, trying with parameters...");
          // If basic call fails, try with parameters
          const fallbackUrl = `/user/messages?limit=1000&page=1`;
          const fallbackRes = await api.get(fallbackUrl, { headers: { Authorization: `Bearer ${token}` } });
          
          if (fallbackRes.data.success && fallbackRes.data.data) {
            let allMessages = fallbackRes.data.data.messages || [];
            
            // Filter client-side based on contact type
            if (contact.includes('Session:')) {
              const sessionId = contact.replace('Session: ', '');
              allMessages = allMessages.filter(msg => msg.session_id === sessionId);
            } else if (isEmail(contact)) {
              allMessages = allMessages.filter(msg => msg.email === contact.toLowerCase());
            } else {
              // Try different phone number formats for filtering
              const phoneFormats = [
                contact,
                `+91${contact}`,
                `+91-${contact}`,
                `91${contact}`,
                contact.replace(/(\d{5})(\d{5})/, '$1-$2'),
              ];
              
              allMessages = allMessages.filter(msg => 
                phoneFormats.includes(msg.phone) || msg.phone === contact
              );
            }
            
            const msgs = allMessages
              .slice()
              .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
              
            console.log(`Fallback with params: Found ${msgs.length} messages for contact:`, contact);
            setChatHistory(msgs);
            toast.success(`Found ${msgs.length} messages using fallback method`);
          } else {
            setChatHistory([]);
          }
        }
      } catch (fallbackErr) {
        console.error("Fallback also failed:", fallbackErr);
        console.error("Fallback error details:", fallbackErr.response?.data);
        setChatHistory([]);
      }
    } finally {
      setLoadingChat(false);
    }
  };

  const closeModal = () => {
    setSelectedChat(null);
    setChatHistory([]);
  };

  const downloadChatPDF = async () => {
    if (!selectedChat) return;

    try {
      const isMail = isEmail(selectedChat);
      const url = isMail
        ? `/user/messages/${encodeURIComponent(selectedChat.toLowerCase())}/pdf`
        : `/user/messages/phone/${encodeURIComponent(selectedChat)}/pdf`;

      const res = await api.get(url, {
        responseType: "blob",
        headers: { Authorization: `Bearer ${token}` },
      });

      const blob = new Blob([res.data], { type: "application/pdf" });
      const safeName = selectedChat.replace(/[^a-zA-Z0-9+@.]/g, "_");
      saveAs(blob, `chat_${safeName}.pdf`);
    } catch (err) {
      toast.error("Failed to download chat PDF");
      console.error(err);
    }
  };


  const handleSearch = () => {
    setSearchTerm(searchInput.trim());
    setPage(1); // Reset to first page when searching
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSearchInput("");
    setPage(1);
  };

  const handleDateFilter = () => {
    setPage(1); // Reset to first page when applying date filter
    // Trigger the useEffect to refetch messages with date filters
    fetchMessages();
  };

  const clearDateFilter = () => {
    setDateFilter("");
    setStartDate("");
    setEndDate("");
    setIsDateRange(false);
    setPage(1);
    // Trigger the useEffect to refetch messages without date filters
    fetchMessages();
  };

  const handleFilterSelection = (filterType, value) => {
    if (filterType === "email") {
      setEmailFilter(value);
      setPhoneFilter("");
      setGuestFilter(false);
      setSeparateSessionFilter("");
    } else if (filterType === "phone") {
      setPhoneFilter(value);
      setEmailFilter("");
      setGuestFilter(false);
      setSeparateSessionFilter("");
    } else if (filterType === "guest") {
      setGuestFilter(value);
      setEmailFilter("");
      setPhoneFilter("");
      setSeparateSessionFilter("");
    } else if (filterType === "session") {
      setSeparateSessionFilter(value);
      setEmailFilter("");
      setPhoneFilter("");
      setGuestFilter(false);
    }
    setPage(1);
  };

  return (
    <Layout>
      <div className="p-3 sm:p-4 md:p-6 bg-white min-h-screen font-['Exo_2',sans-serif]">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-5">
            <div className="bg-gradient-to-r from-[#3a2d9c] to-[#017977] text-white p-3 rounded-2xl shadow-lg">
              <Mail className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Message History
              </h2>
            </div>
          </div>
          <p className="text-gray-500 text-base leading-relaxed mb-4">
            View and manage all your message conversations in one place. Track user interactions, analyze engagement patterns, and export conversation data effortlessly.
          </p>
        </div>

        {/* Enhanced Action Bar */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8 shadow-sm">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-600">
                {searchTerm ? `${messages.length} messages found` : `${messages.length} messages loaded`}
              </span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="inline-flex cursor-pointer items-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-medium hover:from-red-600 hover:to-red-700 focus:outline-none transition-all duration-300 shadow-md hover:shadow-lg text-base w-fit"
                >
                  <X className="w-5 h-5" />
                  <span>Clear Search</span>
                </button>
              )}
              
              <button
                onClick={() => setShowGuests(!showGuests)}
                className={`inline-flex cursor-pointer items-center gap-3 px-6 py-3 rounded-xl font-medium focus:outline-none transition-all duration-300 shadow-md hover:shadow-lg text-base w-fit ${
                  showGuests 
                    ? "bg-gradient-to-r from-[#3a2d9c] to-[#017977] text-white border-0" 
                    : "bg-gray-700 text-gray-300 border border-gray-600 hover:border-[#3a2d9c]"
                }`}
              >
                <Users className="w-5 h-5" />
                <span>{showGuests ? "Hide Guests" : "Show Guests"}</span>
              </button>
              
            </div>
          </div>
        </div>

        {/* Enhanced Filter Container */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8 relative z-50">
          {/* Enhanced Filter Section */}
          <div className="flex-1 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 relative group filter-dropdown">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-r from-[#3a2d9c] to-[#017977] text-white p-3 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                    <Filter className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1">Filter Messages</h3>
                    <p className="text-sm text-gray-600">Filter by contact details</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-gray-800">
                    {allEmails.length + allPhoneNumbers.length}
                  </div>
                  <div className="text-sm text-gray-600">contacts available</div>
                </div>
              </div>
            
            <Menu as="div" className="relative inline-block text-left w-full">
              <Menu.Button className="w-full inline-flex cursor-pointer items-center justify-between gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-[#3a2d9c] to-[#017977] text-white font-semibold hover:from-[#2a1d7c] hover:to-[#015a58] focus:outline-none transition-all duration-300 border border-gray-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <Filter className="w-5 h-5 text-white flex-shrink-0" />
                  <span className="truncate text-base">
                    {emailFilter || phoneFilter || guestFilter ? emailFilter || phoneFilter || (guestFilter ? "Guest Messages" : "") : "All Messages"}
                  </span>
                </div>
                <ChevronDown className="w-5 h-5 text-white flex-shrink-0" />
              </Menu.Button>

              <Menu.Items className="absolute left-0 top-full mt-2 w-full origin-top-left bg-white border border-gray-200 rounded-2xl shadow-xl focus:outline-none z-[10000] animate-in slide-in-from-top-2 duration-200">
                <div className="py-3 max-h-80 overflow-y-auto overflow-x-hidden">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => {
                          setEmailFilter("");
                          setPhoneFilter("");
                          setGuestFilter(false);
                          setSeparateSessionFilter("");
                          setPage(1);
                        }}
                        className={`w-full cursor-pointer text-left px-6 py-3 text-sm transition-all duration-200 rounded-lg mx-2 ${
                          !emailFilter && !phoneFilter && !guestFilter
                            ? "bg-gradient-to-r from-[#3a2d9c] to-[#017977] font-semibold text-white shadow-md"
                            : active
                            ? "bg-gray-100"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-[#3a2d9c] rounded-full"></div>
                          <span className={!emailFilter && !phoneFilter && !guestFilter ? "text-white" : "text-gray-800"}>All Messages</span>
                        </div>
                      </button>
                    )}
                  </Menu.Item>
                  {allEmails.map((email, idx) => (
                    <Menu.Item key={idx}>
                      {({ active }) => (
                        <button
                          onClick={() => handleFilterSelection("email", email)}
                        className={`w-full text-left px-6 py-3 text-sm transition-all duration-200 rounded-lg mx-2 ${
                          emailFilter === email
                            ? "bg-gradient-to-r from-[#3a2d9c] to-[#017977] font-semibold text-white shadow-md"
                            : active
                            ? "bg-gray-100"
                            : "hover:bg-gray-100"
                        }`}
                        >
                          <div className="flex items-center gap-3">
                            <Mail className="w-4 h-4 text-[#3a2d9c]" />
                            <span className={emailFilter === email ? "text-white" : "text-gray-800"}>{email}</span>
                          </div>
                        </button>
                      )}
                    </Menu.Item>
                  ))}
                  {allPhoneNumbers.map((phone, idx) => (
                    <Menu.Item key={idx}>
                      {({ active }) => (
                        <button
                          onClick={() => handleFilterSelection("phone", phone)}
                        className={`w-full text-left px-6 py-3 text-sm transition-all duration-200 rounded-lg mx-2 ${
                          phoneFilter === phone
                            ? "bg-gradient-to-r from-[#3a2d9c] to-[#017977] font-semibold text-white shadow-md"
                            : active
                            ? "bg-gray-100"
                            : "hover:bg-gray-100"
                        }`}
                        >
                          <div className="flex items-center gap-3">
                            <User className="w-4 h-4 text-[#3a2d9c]" />
                            <span className={phoneFilter === phone ? "text-white" : "text-gray-800"}>{phone}</span>
                          </div>
                        </button>
                      )}
                    </Menu.Item>
                  ))}
                  
                  {/* Guest Messages Filter */}
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => handleFilterSelection("guest", true)}
                        className={`w-full text-left px-6 py-3 text-sm transition-all duration-200 rounded-lg mx-2 ${
                          guestFilter
                            ? "bg-gradient-to-r from-[#3a2d9c] to-[#017977] font-semibold text-white shadow-md"
                            : active
                            ? "bg-gray-100"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Users className="w-4 h-4 text-[#3a2d9c]" />
                          <span className={guestFilter ? "text-white" : "text-gray-800"}>Guest Messages</span>
                        </div>
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Menu>
            </div>
          </div>

          {/* Separate Session Filter */}
          <div className="flex-1 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 relative group filter-dropdown">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-r from-[#3a2d9c] to-[#017977] text-white p-3 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                    <Users className="w-6 h-6" />
                  </div>
                    <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1">Filter by Session</h3>
                    <p className="text-sm text-gray-600">Filter by sessions</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-gray-800">
                    {allSessions.length}
                  </div>
                  <div className="text-sm text-gray-600">sessions available</div>
                </div>
              </div>
            
            <Menu as="div" className="relative inline-block text-left w-full">
              <Menu.Button className="w-full inline-flex cursor-pointer items-center justify-between gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-[#3a2d9c] to-[#017977] text-white font-semibold hover:from-[#2a1d7c] hover:to-[#015a58] focus:outline-none transition-all duration-300 border border-gray-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <Users className="w-5 h-5 text-white flex-shrink-0" />
                  <span className="truncate text-base">
                    {separateSessionFilter ? `Session: ${separateSessionFilter.substring(0, 8)}...` : "All Sessions"}
                  </span>
                </div>
                <ChevronDown className="w-5 h-5 text-white flex-shrink-0" />
              </Menu.Button>

              <Menu.Items className="absolute left-0 top-full mt-2 w-full origin-top-left bg-white border border-gray-200 rounded-2xl shadow-xl focus:outline-none z-[10001] animate-in slide-in-from-top-2 duration-200">
                <div className="py-3 max-h-80 overflow-y-auto overflow-x-hidden">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => {
                          setSeparateSessionFilter("");
                          setEmailFilter("");
                          setPhoneFilter("");
                          setPage(1);
                        }}
                        className={`w-full cursor-pointer text-left px-6 py-3 text-sm transition-all duration-200 rounded-lg mx-2 ${
                          !separateSessionFilter
                            ? "bg-gradient-to-r from-[#3a2d9c] to-[#017977] font-semibold text-white shadow-md"
                            : active
                            ? "bg-gray-100"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-[#3a2d9c] rounded-full"></div>
                          <span className={!separateSessionFilter ? "text-white" : "text-gray-800"}>All Sessions</span>
                        </div>
                      </button>
                    )}
                  </Menu.Item>
                  {allSessions.map((session, idx) => (
                    <Menu.Item key={`separate-session-${idx}`}>
                      {({ active }) => (
                        <button
                          onClick={() => handleFilterSelection("session", session.id)}
                          className={`w-full text-left px-6 py-3 text-sm transition-all duration-200 rounded-lg mx-2 ${
                            separateSessionFilter === session.id
                              ? "bg-gradient-to-r from-[#3a2d9c] to-[#017977] font-semibold text-white shadow-md"
                              : active
                              ? "bg-gray-100"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Users className="w-4 h-4 text-[#3a2d9c]" />
                            <div className="flex flex-col">
                              <span className={`font-medium ${separateSessionFilter === session.id ? "text-white" : "text-gray-800"}`}>Session: {session.id.substring(0, 8)}...</span>
                              {/* Removed guest/user tag - only show session id */}
                              <span className={`text-xs ${separateSessionFilter === session.id ? "text-gray-300" : "text-gray-500"}`}></span>
                            </div>
                          </div>
                        </button>
                      )}
                    </Menu.Item>
                  ))}
                </div>
              </Menu.Items>
            </Menu>
            </div>
          </div>
        </div>


         {/* Search and Date Filter Sections - Side by Side */}
         <div className="flex flex-col lg:flex-row gap-6 mb-8">
           {/* Search Bar */}
           <div className="flex-1 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
             <div className="flex items-center gap-4">
               <div className="bg-gradient-to-r from-[#3a2d9c] to-[#017977] text-white p-3 rounded-2xl shadow-lg">
                 <Search className="w-6 h-6" />
               </div>
               <div className="flex-1">
                 <h3 className="text-lg font-bold text-gray-800 mb-2">Search Messages</h3>
                 <p className="text-sm text-gray-600 mb-4">Type a word and click search to find messages</p>
                 <div className="flex gap-3">
                   <div className="relative flex-1">
                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                     <input
                       type="text"
                       placeholder="Type any word to search in messages..."
                       value={searchInput}
                       onChange={(e) => setSearchInput(e.target.value)}
                       onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                       className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-[#3a2d9c]/50 focus:border-[#3a2d9c]/50 focus:bg-white transition-all duration-200"
                     />
                   </div>
                   <button
                     onClick={handleSearch}
                     disabled={!searchInput.trim()}
                     className="px-6 py-3 bg-gradient-to-r from-[#3a2d9c] to-[#017977] text-white font-medium rounded-xl hover:from-[#2a1d7c] hover:to-[#015a58] focus:outline-none transition-all duration-300 shadow-md hover:shadow-lg disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                   >
                     Search
                   </button>
                   {searchTerm && (
                     <button
                       onClick={clearSearch}
                       className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-xl hover:from-red-600 hover:to-red-700 focus:outline-none transition-all duration-300 shadow-md hover:shadow-lg"
                     >
                       Clear
                     </button>
                   )}
                 </div>
                 {searchTerm && (
                   <div className="mt-3 flex items-center gap-2">
                     <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                     <span className="text-sm text-gray-600">
                       Showing messages containing "{searchTerm}"
                     </span>
                   </div>
                 )}
               </div>
             </div>
           </div>

           {/* Date Filter Section */}
           <div className="flex-1 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
             <div className="space-y-6">
               {/* Header */}
               <div className="flex items-center gap-4">
                 <div className="bg-gradient-to-r from-[#3a2d9c] to-[#017977] text-white p-3 rounded-2xl shadow-lg">
                   <Calendar className="w-6 h-6" />
                 </div>
                 <div>
                   <h3 className="text-lg font-bold text-gray-800">Date Filter</h3>
                   <p className="text-sm text-gray-600">Filter messages by specific date or date range</p>
                 </div>
               </div>

               {/* Date Range Toggle */}
               <div className="flex items-center gap-3">
                 <label className="flex items-center gap-2 text-sm text-gray-700">
                   <input
                     type="checkbox"
                     checked={isDateRange}
                     onChange={(e) => {
                       setIsDateRange(e.target.checked);
                       if (!e.target.checked) {
                         setStartDate("");
                         setEndDate("");
                       }
                     }}
                     className="w-4 h-4 text-[#3a2d9c] border-gray-300 rounded focus:ring-[#3a2d9c] focus:ring-2"
                   />
                   Date Range
                 </label>
               </div>

               {/* Date Inputs */}
               <div className="space-y-4">
                 {!isDateRange ? (
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                     <input
                       type="date"
                       value={dateFilter}
                       onChange={(e) => setDateFilter(e.target.value)}
                       className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:ring-2 focus:ring-[#3a2d9c]/50 focus:border-[#3a2d9c]/50 focus:bg-white transition-all duration-200"
                     />
                   </div>
                 ) : (
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                       <input
                         type="date"
                         value={startDate}
                         onChange={(e) => setStartDate(e.target.value)}
                         className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:ring-2 focus:ring-[#3a2d9c]/50 focus:border-[#3a2d9c]/50 focus:bg-white transition-all duration-200"
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                       <input
                         type="date"
                         value={endDate}
                         onChange={(e) => setEndDate(e.target.value)}
                         min={startDate}
                         className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:ring-2 focus:ring-[#3a2d9c]/50 focus:border-[#3a2d9c]/50 focus:bg-white transition-all duration-200"
                       />
                     </div>
                   </div>
                 )}
               </div>

               {/* Action Buttons */}
               <div className="flex gap-3">
                 <button
                   onClick={handleDateFilter}
                   disabled={!dateFilter && !startDate && !endDate}
                   className="px-6 py-3 bg-gradient-to-r from-[#3a2d9c] to-[#017977] text-white font-medium rounded-xl hover:from-[#2a1d7c] hover:to-[#015a58] focus:outline-none transition-all duration-300 shadow-md hover:shadow-lg disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                 >
                   Apply Filter
                 </button>
                 
                 {(dateFilter || startDate || endDate) && (
                   <button
                     onClick={clearDateFilter}
                     className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-xl hover:from-red-600 hover:to-red-700 focus:outline-none transition-all duration-300 shadow-md hover:shadow-lg"
                   >
                     Clear Filter
                   </button>
                 )}
               </div>

               {/* Active Filter Display */}
               {(dateFilter || startDate || endDate) && (
                 <div className="flex items-center gap-2">
                   <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                   <span className="text-sm text-gray-600">
                     {isDateRange 
                       ? `Showing messages from ${startDate} to ${endDate}`
                       : `Showing messages for ${dateFilter}`
                     }
                   </span>
                 </div>
               )}
             </div>
           </div>
         </div>

        {/* Enhanced Table Container */}
        <>
          {loadingMessages ? (
            <TableSkeleton />
          ) : (
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden relative z-10">
            <div className="table-container">
              <table className="w-full text-xs md:text-sm lg:text-base text-left text-gray-800">
                <thead className="bg-gradient-to-r from-[#3a2d9c] to-[#017977] text-white uppercase text-xs md:text-sm font-semibold">
                <tr>
                  <th scope="col" className="w-20 md:w-32 lg:w-40 px-2 md:px-4 py-3 md:py-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Clock className="w-3 h-3 md:w-4 md:h-4" />
                      <span className="hidden sm:inline">Time</span>
                    </div>
                  </th>
                  <th scope="col" className="w-24 md:w-32 lg:w-40 px-2 md:px-4 py-3 md:py-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <User className="w-3 h-3 md:w-4 md:h-4" />
                      <span className="hidden sm:inline">Sender</span>
                    </div>
                  </th>
                  <th scope="col" className="px-2 md:px-4 py-3 md:py-4">
                    <span className="hidden sm:inline">Message</span>
                    <span className="sm:hidden">Msg</span>
                  </th>
                  <th scope="col" className="w-20 md:w-32 lg:w-36 px-2 md:px-4 py-3 md:py-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Mail className="w-3 h-3 md:w-4 md:h-4" />
                      <span className="hidden sm:inline">Contact</span>
                    </div>
                  </th>
                  <th scope="col" className="w-16 md:w-20 lg:w-24 px-2 md:px-4 py-3 md:py-4 text-center">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm md:text-base divide-y divide-gray-200">
                {messages.map((msg, idx) => {
                  const isGuest = isGuestUser(msg);
                  const contact = msg.email || msg.phone || (isGuest ? `Session: ${msg.session_id}` : 'Unknown');
                  
                  // Debug logging for first few messages
                  if (idx < 3) {
                    console.log(`Message ${idx}:`, {
                      email: msg.email,
                      phone: msg.phone,
                      session_id: msg.session_id,
                      isGuest,
                      contact,
                      fullMessage: msg
                    });
                  }
                  return (
                    <tr
                      key={idx}
                      onClick={() => openChatModal(contact)}
                      className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 cursor-pointer transition-all duration-300 group"
                    >
                      <td className="w-20 md:w-32 lg:w-40 px-2 md:px-4 py-3 md:py-4 text-center text-gray-600">
                        <div className="text-xs md:text-sm">
                          {new Date(msg.timestamp).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "2-digit",
                          })}
                        </div>
                        <div className="text-xs md:text-sm text-gray-400">
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </td>
                      <td className="w-24 md:w-32 lg:w-40 px-2 md:px-4 py-3 md:py-4 text-center">
                        <div className="flex flex-col items-center gap-1 md:gap-2">
                          {isGuest ? (
                            <>
                              <span className="px-2 py-1 bg-gradient-to-r from-[#3a2d9c] to-[#017977] text-white text-xs md:text-sm font-medium rounded-full shadow-md">
                                Guest
                              </span>
                              <span className="text-gray-600 text-xs md:text-sm">{msg.sender}</span>
                            </>
                          ) : (
                            <div className="flex flex-col items-center gap-1 md:gap-2">
                              <div className="w-2 h-2 md:w-3 md:h-3 bg-green-400 rounded-full"></div>
                              <span className="text-gray-600 text-xs md:text-sm">{msg.sender}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-2 md:px-4 py-3 md:py-4">
                        <div className="text-gray-600 group-hover:text-gray-800 transition-colors duration-200 text-xs md:text-sm lg:text-base line-clamp-2 md:line-clamp-3">
                          {msg.content}
                        </div>
                      </td>
                      <td className="w-20 md:w-32 lg:w-36 px-2 md:px-4 py-3 md:py-4 text-center">
                        {isGuest ? (
                          <span className="inline-flex items-center gap-1 text-[#3a2d9c] bg-gradient-to-r from-purple-100 to-teal-100 px-2 py-1 rounded-full text-xs md:text-sm font-medium shadow-sm">
                            <Users className="w-3 h-3 md:w-4 md:h-4" />
                            <span className="hidden sm:inline">Guest</span>
                          </span>
                        ) : (
                          <div className="flex flex-col items-center gap-1">
                            <span className="inline-flex items-center gap-1 text-[#3a2d9c] bg-gradient-to-r from-purple-100 to-teal-100 px-2 py-1 rounded-full text-xs md:text-sm font-medium shadow-sm">
                              {isEmail(contact) ? (
                                <Mail className="w-3 h-3 md:w-4 md:h-4" />
                              ) : (
                                <User className="w-3 h-3 md:w-4 md:h-4" />
                              )}
                              <span className="hidden sm:inline">
                                {isEmail(contact) ? 'Email' : 'Phone'}
                              </span>
                            </span>
                            <span className="text-xs text-gray-600 truncate max-w-[120px]" title={contact}>
                              {contact}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="w-16 md:w-20 lg:w-24 px-2 md:px-4 py-3 md:py-4 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // avoid double triggering row click
                            openChatModal(contact);
                          }}
                          className="text-[#3a2d9c] cursor-pointer hover:text-[#2a1d7c] hover:scale-110 transition-all duration-200 p-1 md:p-2 rounded-lg hover:bg-purple-50"
                          title="View full chat"
                        >
                          <Eye className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Enhanced Pagination */}
            <div className="flex flex-col sm:flex-row justify-between items-center px-4 md:px-6 py-4 md:py-6 bg-gradient-to-r from-[#3a2d9c] to-[#017977] text-sm md:text-base text-white gap-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="font-medium text-sm md:text-base">
                  Showing {messages.length} messages
                </span>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="text-white font-medium text-sm md:text-base">
                  Page {page} of {totalPages}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    disabled={page === 1}
                    className={`px-4 md:px-6 py-2 md:py-3 rounded-xl font-medium transition-all duration-200 text-sm md:text-base ${
                      page === 1
                        ? "bg-white/20 text-white/50 cursor-not-allowed"
                        : "bg-white/20 hover:bg-white/30 text-white shadow-md hover:shadow-lg"
                    }`}
                  >
                    <span className="hidden sm:inline">Previous</span>
                    <span className="sm:hidden">Prev</span>
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                    disabled={page === totalPages}
                    className={`px-4 md:px-6 py-2 md:py-3 rounded-xl font-medium transition-all duration-200 text-sm md:text-base ${
                      page === totalPages
                        ? "bg-white/20 text-white/50 cursor-not-allowed"
                        : "bg-white/20 hover:bg-white/30 text-white shadow-md hover:shadow-lg"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
          </div>
          )}
        </>

        {/* Enhanced Chat Modal */}
        <Dialog
          open={!!selectedChat}
          onClose={closeModal}
          className="fixed z-50 inset-0 overflow-y-auto"
        >
          <div className="flex items-center justify-center min-h-screen bg-black/60 backdrop-blur-md p-3 sm:p-4">
            <Dialog.Panel className="bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 backdrop-blur-xl w-full max-w-3xl rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-600/50 overflow-hidden relative">
              {/* Animated Background Elements */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 opacity-50"></div>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
              
              {/* Enhanced Modal Header */}
              <div className="relative bg-gradient-to-r from-gray-700/90 via-gray-600/90 to-gray-700/90 backdrop-blur-sm px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-600/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                    <div className="relative flex-shrink-0">
                      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-2 sm:p-3 rounded-xl sm:rounded-2xl shadow-xl group-hover:shadow-2xl transition-all duration-300">
                        {selectedChat?.includes('Session:') ? (
                          <Users className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                        ) : (
                          <Mail className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                        )}
                      </div>
                      <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl sm:rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-1 truncate">Chat History</h3>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse flex-shrink-0"></div>
                        <p className="text-xs sm:text-sm text-gray-300 truncate font-medium">
                          {selectedChat}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                    <button
                      onClick={downloadChatPDF}
                      className="group p-2 sm:p-3 text-gray-400 hover:text-blue-400 hover:bg-blue-900/30 rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-lg"
                      title="Download Chat"
                    >
                      <Download className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform duration-200" />
                    </button>
                    <button
                      onClick={closeModal}
                      className="group p-2 sm:p-3 text-gray-400 hover:text-red-400 hover:bg-red-900/30 rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-lg"
                      title="Close"
                    >
                      <X className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform duration-200" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Enhanced Chat Messages */}
              <div className="relative p-4 sm:p-6 space-y-4 sm:space-y-6 max-h-[65vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                {loadingChat ? (
                  <div className="flex justify-center items-center py-16">
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600/30 border-t-indigo-600"></div>
                        <div className="absolute inset-0 animate-ping rounded-full h-12 w-12 border-2 border-indigo-600/20"></div>
                      </div>
                      <p className="text-sm text-gray-400 font-medium">Loading chat history...</p>
                    </div>
                  </div>
                ) : (
                  chatHistory.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`group max-w-[85%] rounded-3xl p-5 text-sm shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] ${
                        msg.sender === "user"
                          ? "ml-auto bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 text-white rounded-tr-lg"
                          : "bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 text-gray-200 rounded-tl-lg border border-gray-600/50"
                      }`}
                    >
                      {/* Message Header */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-3 h-3 rounded-full shadow-lg ${
                          msg.sender === "user" ? "bg-white/80" : "bg-indigo-400"
                        }`}></div>
                        <p className="text-xs font-bold opacity-90 tracking-wide uppercase">
                          {msg.sender === "user" ? "You" : msg.sender}
                        </p>
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                      </div>
                      
                      {/* Message Content */}
                      <p className="whitespace-pre-wrap leading-relaxed text-base mb-4 font-medium">
                        {msg.content}
                      </p>
                      
                      {/* Message Timestamp */}
                      <div className="flex justify-end">
                        <p className={`text-xs px-3 py-1 rounded-full font-medium ${
                          msg.sender === "user" 
                            ? "bg-white/20 text-white/80" 
                            : "bg-gray-600/50 text-gray-400"
                        }`}>
                          {new Date(msg.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                
                {/* Empty State */}
                {!loadingChat && chatHistory.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center mb-4">
                      <Mail className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-300 mb-2">No Messages Found</h3>
                    <p className="text-sm text-gray-500">This conversation appears to be empty.</p>
                  </div>
                )}
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </div>
    </Layout>
  );
}
