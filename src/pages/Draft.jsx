import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EmailList from "../components/EmailList";
import EmailDetails from "../components/EmailDetails";
import { useTheme } from "../context/ThemeContext";

const Draft = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [drafts, setDrafts] = useState([]);
  const [selectedDraft, setSelectedDraft] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ---------------- FETCH DRAFTS ---------------- */
  useEffect(() => {
    fetchDrafts();
  }, []);

  const fetchDrafts = async () => {
    try {
      setLoading(true);

      // 🔹 Backend-ready
      // const res = await mailAPI.getDrafts();
      // if (res.data?.success) setDrafts(res.data.data.drafts || []);

      // TEMP fallback
      setDrafts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDraft = (draft) => {
    setSelectedDraft(draft);
  };

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div
        className="flex items-center justify-center h-screen"
        style={{ backgroundColor: theme.bg }}
      >
        <div
          className="animate-spin rounded-full h-10 w-10 border-b-2"
          style={{ borderColor: theme.accent }}
        />
      </div>
    );
  }

  /* ---------------- MAIN UI ---------------- */
  return (
    <div className="h-full flex flex-col overflow-hidden bg-transparent">
      {selectedDraft ? (
        <EmailDetails
          email={selectedDraft}
          onBack={() => setSelectedDraft(null)}
          onReply={(draft) =>
            navigate("/compose", {
              state: {
                draft,
              },
            })
          }
        />
      ) : (
        <>
          {/* HEADER */}
          <div
            className="p-4 sm:p-5 border-b flex items-center justify-between shrink-0 bg-transparent"
            style={{ borderColor: theme.border }}
          >
            <h2
              className="text-base font-bold flex items-center gap-2"
              style={{ color: theme.text }}
            >
              Drafts
              <span
                className="ml-2 text-xs font-normal"
                style={{ color: theme.subText }}
              >
                ({drafts.length})
              </span>
            </h2>
          </div>

          {/* EMAIL LIST CONTAINER */}
          <div className="flex-1 overflow-y-auto hidden-scrollbar pb-12">
            {drafts.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
                <span className="text-5xl mb-3">📝</span>
                <p
                  className="text-base font-semibold mb-1"
                  style={{ color: theme.text }}
                >
                  No drafts
                </p>
                <p className="text-sm mb-4" style={{ color: theme.subText }}>
                  Draft emails you save will appear here
                </p>
                <button
                  onClick={() => navigate("/compose")}
                  className="px-4 py-2 rounded-full text-white text-sm cursor-pointer shadow-sm hover:shadow hover:-translate-y-0.5 transition-all"
                  style={{ backgroundColor: theme.accent }}
                >
                  Compose Email
                </button>
              </div>
            ) : (
              <EmailList
                emails={drafts}
                selectedEmailId={selectedDraft?.uid}
                onSelectEmail={handleSelectDraft}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Draft;
