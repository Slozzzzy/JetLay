// src/components/screens/VisaResultScreen.tsx
"use client";

import React, {useEffect, useState}from 'react';
import Header from '@/components/core/Header';
import { ScreenProps } from '@/types';
import { supabase } from "@/lib/supabaseClient";

type Requirement = {
  id: string;
  label: string;
  default_checked: boolean | null;
};

const VisaResultScreen: React.FC<ScreenProps> = ({ showScreen, showAlert, profile }) => {
  const [loading, setLoading] = useState(true);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [officialUrl, setOfficialUrl] = useState<string | null>(null);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [ruleId, setRuleId] = useState<string | null>(null);


  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      // every time we come to this screen, start fresh
      setLoading(true);
      setRequirements([]);
      setChecked({});
      setRuleId(null);
      setOfficialUrl(null);

      try {
        const raw = localStorage.getItem("visaSearch");
        if (!raw) {
          showAlert?.("No visa selection found.", "error");
          return;
        }

        const { nationality, destination } = JSON.parse(raw);

        // Fetch visa rule
        const { data: rule, error: ruleError } = await supabase
          .from("visa_rules")
          .select("id, official_url")
          .ilike("nationality", nationality)
          .ilike("destination", destination)
          .maybeSingle();

        if (ruleError || !rule) {
          console.error(ruleError);
          showAlert?.("No visa requirements found for this route.", "error");
          return;
        }

        if (!isMounted) return;

        setOfficialUrl(rule.official_url);
        setRuleId(rule.id);

        // Fetch requirements
        const { data: reqs, error: reqError } = await supabase
          .from("visa_requirements")
          .select("id, label, default_checked")
          .eq("visa_rule_id", rule.id)
          .order("sort_order", { ascending: true });

        if (reqError) {
          console.error(reqError);
          showAlert?.(reqError.message, "error");
          return;
        }

        const list = reqs ?? [];
        if (!isMounted) return;
        setRequirements(list);

        // Try to load saved checklist for this user + rule
        if (profile?.id) {
          const { data: saved, error: savedError } = await supabase
            .from("visa_user_checklist")
            .select("checked_items")
            .eq("user_id", profile.id)
            .eq("visa_rule_id", rule.id)
            .maybeSingle();

          if (!isMounted) return;

          if (savedError) {
            console.error(savedError);
          }

          if (saved?.checked_items) {
            // Use saved state
            setChecked(saved.checked_items as Record<string, boolean>);
          } else {
            // Fallback to default_checked from requirements
            const initial: Record<string, boolean> = {};
            list.forEach((r) => (initial[r.id] = !!r.default_checked));
            setChecked(initial);
          }
        } else {
        // No profile (not logged in?) → just use default_checked
          const initial: Record<string, boolean> = {};
          list.forEach((r) => (initial[r.id] = !!r.default_checked));
          setChecked(initial);
        }
      } catch (err) {
        console.error(err);
        showAlert?.("Failed to load visa requirements.", "error");
      } finally {
        if (isMounted) {
        setLoading(false); // always executed, even when there’s an error
      }
    }
  };

  loadData();

  // if user leaves the page while loading, avoid setting state on unmounted
  return () => {
    isMounted = false;
  };
}, [profile?.id]);

  // Save when user checks/unchecks
  const handleToggle = async (id: string) => {
    const updated = { ...checked, [id]: !checked[id] };
    setChecked(updated);

    // Only save if user + ruleId exist
    if (!ruleId || !profile?.id) return;

    const { error } = await supabase.from("visa_user_checklist").upsert({
      user_id: profile.id,
      visa_rule_id: ruleId,
      checked_items: updated,
    });

    if (error) {
      console.error(error);
      showAlert?.("Failed to save checklist state.", "error");
    }
  };

  const handleOpenOfficial = () => {
    if (officialUrl) {
      window.open(officialUrl, "_blank", "noopener,noreferrer");
    } else {
      showAlert?.("No official website available", "info");
    }
  };

  if (loading) {
    return (
      <div className="bg-purple-50 p-6">
        <Header
          title="Requirements Checklist"
          onBack={() => showScreen("visa")}
          showProfileIcon={true}
          showScreen={showScreen}
          profile={profile}
        />
        <p className="text-gray-600 mt-6">Loading requirements...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-purple-50 pb-20">
      <Header title={`Requirements Checklist`} onBack={() => showScreen('visa')} showProfileIcon={true} showScreen={showScreen} profile={profile} />
      <div className="p-6 flex-1 max-w-3xl mx-auto w-full">
          <div className="bg-white p-6 rounded-xl shadow-xl border border-purple-200">
              <h3 className="text-xl font-bold text-purple-700 mb-3">Visa Checklist</h3>
              <div className="space-y-3">
                  {requirements.map((item) => (
                    <label key={item.id} className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-200 cursor-pointer hover:bg-gray-50 h-20">
                      <span className="font-medium text-gray-900 pr-4 flex-1">
                      {item.label}
                      </span>
                      <input type="checkbox" checked={checked[item.id]} onChange={() => handleToggle(item.id)} 
                      className="w-5 h-5 border-2 border-gray-300 rounded text-purple-600 focus:ring-purple-500 focus:ring-offset-0"
                      style={{ minWidth: "20px", minHeight: "20px" }}
                      />
                    </label>
                  ))}
              </div>
          </div>
        <div className="mt-6 space-y-3">
          <button className="w-full py-3 text-white font-bold rounded-xl shadow-md" style={{background: 'linear-gradient(90deg, #d8b4fe, #fbcfe8)', color: '#1e1b4b'}} onClick={handleOpenOfficial}>
            Open Official Source
          </button>
          <button className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl shadow-md hover:bg-gray-700" onClick={() => showScreen('calendar')}>
            Add deadlines to Calendar
          </button>
        </div>
      </div>
    </div>
  );
};

export default VisaResultScreen;