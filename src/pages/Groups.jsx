import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdGroupAdd, MdEmail, MdGroup } from "react-icons/md";
import { groupAPI } from "../services/api";
import { useTheme } from "../context/ThemeContext";

const Groups = () => {
    const navigate = useNavigate();
    const { theme } = useTheme();

    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showCreate, setShowCreate] = useState(false);
    const [newGroup, setNewGroup] = useState({ name: "", description: "" });
    const [error, setError] = useState("");

    const fetchGroups = async () => {
        try {
            setLoading(true);
            const res = await groupAPI.getAllGroups();
            if (res.data?.success) {
                setGroups(res.data.data || []);
            }
        } catch (err) {
            setError("Failed to load groups");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGroups();
    }, []);

    const handleCreateGroup = async (e) => {
        e.preventDefault();
        setError("");
        if (!newGroup.name) {
            setError("Group name is required");
            return;
        }
        try {
            setLoading(true);
            const res = await groupAPI.createGroup(newGroup);
            if (res.data?.success) {
                setNewGroup({ name: "", description: "" });
                setShowCreate(false);
                fetchGroups();
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create group");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 p-6 h-full overflow-y-auto" style={{ background: theme.bg, color: theme.text }}>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <MdGroup className="text-3xl" style={{ color: theme.accent }} />
                    My Groups
                </h2>
                <button
                    onClick={() => setShowCreate(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-white shadow-md transition-transform hover:scale-105"
                    style={{ background: theme.accent }}
                >
                    <MdGroupAdd size={20} />
                    Create Group
                </button>
            </div>

            {error && (
                <div className="mb-4 p-3 rounded bg-red-50 text-red-700 border border-red-200">
                    {error}
                </div>
            )}

            {showCreate && (
                <form onSubmit={handleCreateGroup} className="mb-6 p-6 rounded-xl shadow-md border" style={{ background: theme.cardBg, borderColor: theme.border }}>
                    <h3 className="text-lg font-semibold mb-4">Create New Group</h3>
                    <div className="mb-4">
                        <label className="block text-sm mb-1" style={{ color: theme.subText }}>Group Name</label>
                        <input
                            autoFocus
                            value={newGroup.name}
                            onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                            className="w-full p-2.5 border rounded-lg bg-transparent focus:ring-2 outline-none transition-all"
                            style={{ borderColor: theme.border, color: theme.text }}
                            placeholder="e.g. Management Team"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm mb-1" style={{ color: theme.subText }}>Description (Optional)</label>
                        <textarea
                            value={newGroup.description}
                            onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                            className="w-full p-2.5 border rounded-lg bg-transparent focus:ring-2 outline-none transition-all"
                            style={{ borderColor: theme.border, color: theme.text }}
                            placeholder="What is this group for?"
                            rows={3}
                        />
                    </div>
                    <div className="flex gap-3">
                        <button type="submit" className="px-5 py-2 rounded-lg text-white" style={{ background: theme.accent }}>
                            Create
                        </button>
                        <button type="button" onClick={() => setShowCreate(false)} className="px-5 py-2 rounded-lg" style={{ background: theme.border, color: theme.text }}>
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {loading && groups.length === 0 ? (
                <div className="flex justify-center p-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2" style={{ borderColor: theme.accent }}></div>
                </div>
            ) : groups.length === 0 ? (
                <div className="text-center p-12 rounded-xl border border-dashed" style={{ borderColor: theme.border }}>
                    <MdGroup size={48} className="mx-auto mb-4 opacity-50" style={{ color: theme.subText }} />
                    <h3 className="text-lg font-medium mb-2">No groups yet</h3>
                    <p style={{ color: theme.subText }}>Create a group to send broadcast emails easily.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {groups.map((group) => (
                        <div
                            key={group.id}
                            onClick={() => navigate(`/groups/${group.id}`, { state: { group } })}
                            className="p-5 rounded-xl border shadow-sm cursor-pointer transition-all hover:-translate-y-1 hover:shadow-md"
                            style={{ background: theme.cardBg, borderColor: theme.border }}
                        >
                            <h3 className="font-bold text-lg mb-1">{group.name}</h3>
                            <p className="text-sm mb-3 line-clamp-2 min-h-[40px]" style={{ color: theme.subText }}>
                                {group.description || "No description provided."}
                            </p>
                            <div className="flex items-center justify-between mt-4 text-sm pt-3 border-t" style={{ borderColor: theme.border, color: theme.subText }}>
                                <span>{new Date(group.createdAt).toLocaleDateString()}</span>
                                <span className="flex items-center gap-1" style={{ color: theme.accent }}>
                                    View details &rarr;
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Groups;
