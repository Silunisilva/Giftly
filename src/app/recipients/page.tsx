"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Users,
  Plus,
  Trash2,
  Sparkles,
  Calendar,
  Heart,
  Tag,
  Gift,
  ArrowRight,
  X
} from "lucide-react";
import { RecipientProfile } from "@/types";
import { formatLKR } from "@/lib/utils";
import { useAuth } from "@/lib/auth/auth-context";

export default function RecipientsPage() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const [profiles, setProfiles] = useState<RecipientProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState("Girlfriend");
  const [interests, setInterests] = useState("");
  const [preferredStyles, setPreferredStyles] = useState("Romantic, Cute");
  const [minBudget, setMinBudget] = useState(3000);
  const [maxBudget, setMaxBudget] = useState(8000);
  const [birthday, setBirthday] = useState("");
  const [notes, setNotes] = useState("");

  const loadProfiles = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/recipients?userId=${currentUser.id}`);
      const json = await res.json();
      if (json.success) {
        setProfiles(json.data);
      }
    } catch (err) {
      console.error("Error loading recipient profiles:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfiles();
  }, [currentUser.id]);

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !relationship) return;

    try {
      const res = await fetch("/api/recipients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id,
          name,
          relationship,
          interests: interests.split(",").map(s => s.trim()).filter(Boolean),
          preferredStyles: preferredStyles.split(",").map(s => s.trim()).filter(Boolean),
          minBudget,
          maxBudget,
          birthday,
          notes,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setIsModalOpen(false);
        setName("");
        setInterests("");
        setBirthday("");
        setNotes("");
        loadProfiles();
      }
    } catch (err) {
      console.error("Error creating recipient:", err);
    }
  };

  const handleDeleteProfile = async (id: string) => {
    if (!confirm("Are you sure you want to remove this profile?")) return;
    try {
      const res = await fetch(`/api/recipients?id=${id}&userId=${currentUser.id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        setProfiles(profiles.filter(p => p.id !== id));
      }
    } catch (err) {
      console.error("Error deleting recipient:", err);
    }
  };

  const handleFindGiftsForRecipient = (profile: RecipientProfile) => {
    const searchString = `${profile.interests.join(" ")} ${profile.preferredStyles.join(" ")}`;
    router.push(
      `/gifts?recipient=${encodeURIComponent(profile.relationship)}&maxPrice=${profile.maxBudget || 10000}&query=${encodeURIComponent(searchString)}`
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold tracking-wider uppercase text-rose-600">Personalized Profiles</span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
            Saved Loved Ones
          </h1>
          <p className="text-stone-500 text-sm mt-1">
            Save information for people you frequently buy gifts for to get instant 1-click tailored gift ideas anytime.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-rose-600 to-pink-600 hover:opacity-95 text-white font-bold text-xs rounded-2xl shadow-md shadow-rose-200 transition-transform active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Person</span>
        </button>
      </div>

      {/* Recipient Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(n => (
            <div key={n} className="bg-white rounded-3xl h-64 animate-pulse border border-stone-200/60"></div>
          ))}
        </div>
      ) : profiles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className="bg-white rounded-3xl p-6 border border-stone-200/80 hover:border-rose-300 shadow-subtle gift-card-hover flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-xl text-stone-900">{profile.name}</h3>
                    <span className="text-xs font-semibold text-rose-600">{profile.relationship}</span>
                  </div>

                  <button
                    onClick={() => handleDeleteProfile(profile.id)}
                    className="p-2 text-stone-400 hover:text-rose-600 rounded-xl hover:bg-stone-50 transition-colors"
                    title="Delete profile"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Birthday Tag */}
                {profile.birthday && (
                  <div className="inline-flex items-center gap-1.5 text-xs text-stone-600 bg-stone-100 px-3 py-1 rounded-full font-medium">
                    <Calendar className="w-3.5 h-3.5 text-rose-500" />
                    <span>Birthday: {profile.birthday}</span>
                  </div>
                )}

                {/* Interests */}
                <div className="space-y-1">
                  <span className="text-[11px] text-stone-400 font-bold uppercase block">Interests</span>
                  <div className="flex flex-wrap gap-1">
                    {profile.interests.map(item => (
                      <span key={item} className="text-xs bg-rose-50 text-rose-800 font-medium px-2 py-0.5 rounded-md">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Budget */}
                <div className="space-y-1">
                  <span className="text-[11px] text-stone-400 font-bold uppercase block">Target Budget</span>
                  <p className="text-xs font-bold text-stone-800">
                    {formatLKR(profile.minBudget || 2000)} &ndash; {formatLKR(profile.maxBudget || 10000)}
                  </p>
                </div>

                {/* Notes */}
                {profile.notes && (
                  <p className="text-xs text-stone-500 italic bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                    &ldquo;{profile.notes}&rdquo;
                  </p>
                )}
              </div>

              {/* 1-Click Action */}
              <button
                onClick={() => handleFindGiftsForRecipient(profile)}
                className="w-full py-3 bg-stone-900 hover:bg-rose-600 text-white font-bold text-xs rounded-2xl flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Find Gifts for {profile.name}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 max-w-md mx-auto space-y-4">
          <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto">
            <Users className="w-7 h-7" />
          </div>
          <h3 className="font-serif font-bold text-xl text-stone-900">No Saved Profiles Yet</h3>
          <p className="text-xs text-stone-500">
            Add profiles for your girlfriend, mom, boyfriend, or best friends to find gifts tailored to them in seconds.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 bg-rose-600 text-white text-xs font-bold rounded-xl"
          >
            Create First Profile
          </button>
        </div>
      )}

      {/* Add Recipient Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-stone-200 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-serif font-bold text-xl text-stone-900">Add Loved One Profile</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProfile} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-stone-800 block mb-1">Nickname / Title *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. My Girlfriend ❤️, Amma, Bestie Kasun"
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-rose-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-800 block mb-1">Relationship *</label>
                  <select
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-rose-400"
                  >
                    <option value="Girlfriend">Girlfriend</option>
                    <option value="Boyfriend">Boyfriend</option>
                    <option value="Mom">Mom</option>
                    <option value="Dad">Dad</option>
                    <option value="Sister">Sister</option>
                    <option value="Brother">Brother</option>
                    <option value="Friend">Friend</option>
                    <option value="Wife">Wife</option>
                    <option value="Husband">Husband</option>
                    <option value="Colleague">Colleague</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-stone-800 block mb-1">Birthday (Optional)</label>
                  <input
                    type="text"
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                    placeholder="e.g. May 14"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-rose-400"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-800 block mb-1">Interests (Comma separated)</label>
                <input
                  type="text"
                  value={interests}
                  onChange={(e) => setInterests(e.target.value)}
                  placeholder="e.g. Skincare, Flowers, Coffee, Chocolates"
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-rose-400"
                />
              </div>

              <div>
                <label className="font-bold text-stone-800 block mb-1">Preferred Gift Style</label>
                <input
                  type="text"
                  value={preferredStyles}
                  onChange={(e) => setPreferredStyles(e.target.value)}
                  placeholder="e.g. Cute, Romantic, Useful, Luxurious"
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-rose-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-800 block mb-1">Min Budget (LKR)</label>
                  <input
                    type="number"
                    value={minBudget}
                    onChange={(e) => setMinBudget(Number(e.target.value))}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-rose-400"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-800 block mb-1">Max Budget (LKR)</label>
                  <input
                    type="number"
                    value={maxBudget}
                    onChange={(e) => setMaxBudget(Number(e.target.value))}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-rose-400"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-800 block mb-1">Special Notes / Preferences</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Loves pastel pink packaging and artisan cookies!"
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-rose-400"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-stone-500 hover:text-stone-800 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-sm"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
