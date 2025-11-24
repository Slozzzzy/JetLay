// src/components/screens/VisaResultScreen.tsx
"use client";

import React, { useEffect, useState } from 'react';
import Header from '@/components/core/Header';
import { ScreenProps } from '@/types';
import { supabase } from "@/lib/supabaseClient";
import { ExternalLink, Calendar, Check, Loader2, FileText } from 'lucide-react'; // Added icons

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
          if (savedError) console.error(savedError);

          if (saved?.checked_items) {
            setChecked(saved.checked_items as Record<string, boolean>);
          } else {
            const initial: Record<string, boolean> = {};
            list.forEach((r) => (initial[r.id] = !!r.default_checked));
            setChecked(initial);
          }
        } else {
          const initial: Record<string, boolean> = {};
          list.forEach((r) => (initial[r.id] = !!r.default_checked));
          setChecked(initial);
        }
      } catch (err) {
        console.error(err);
        showAlert?.("Failed to load visa requirements.", "error");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [profile?.id]);

  const handleToggle = async (id: string) => {
    const updated = { ...checked, [id]: !checked[id] };
    setChecked(updated);

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
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <Header
          title="Requirements"
          onBack={() => showScreen("visa")}
          showProfileIcon={true}
          showScreen={showScreen}
          profile={profile}
        />
        <div className="flex-1 flex flex-col items-center justify-center text-gray-500 gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
          <p className="font-medium">Checking latest rules...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-20">
      <Header 
        title="Checklist" 
        onBack={() => showScreen('visa')} 
        showProfileIcon={true} 
        showScreen={showScreen} 
        profile={profile} 
      />
      
      <div className="p-6 flex-1 max-w-3xl mx-auto w-full">
          
          {/* Glass Card Container */}
          <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[32px] shadow-xl ring-1 ring-white/60 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                    <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Required Documents</h3>
              </div>

              <div className="space-y-3">
                  {requirements.map((item) => {
                    const isChecked = checked[item.id];
                    return (
                        <label 
                            key={item.id} 
                            className={`
                                group flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 cursor-pointer
                                ${isChecked 
                                    ? 'bg-purple-50 border-purple-200 shadow-inner' 
                                    : 'bg-white border-white/50 shadow-sm hover:shadow-md hover:border-purple-200'
                                }
                            `}
                        >
                            <span className={`font-medium text-lg flex-1 pr-4 transition-colors ${isChecked ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                                {item.label}
                            </span>
                            
                            <div className="relative">
                                <input 
                                    type="checkbox" 
                                    checked={isChecked} 
                                    onChange={() => handleToggle(item.id)} 
                                    className="peer sr-only"
                                />
                                <div className={`
                                    w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all duration-200
                                    ${isChecked 
                                        ? 'bg-purple-600 border-purple-600 scale-110' 
                                        : 'bg-white border-gray-300 group-hover:border-purple-400'
                                    }
                                `}>
                                    <Check className={`w-4 h-4 text-white transition-opacity ${isChecked ? 'opacity-100' : 'opacity-0'}`} strokeWidth={3} />
                                </div>
                            </div>
                        </label>
                    );
                  })}
              </div>
          </div>

        {/* Buttons Section */}
        <div className="mt-8 space-y-4">
          
          {/* Big Beautiful Calendar Button (Primary Action) */}
          <button 
            onClick={() => showScreen('calendar')}
            className="
                group relative w-full overflow-hidden rounded-[24px] 
                bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 
                bg-[length:200%_auto] p-5 shadow-xl shadow-indigo-500/30 
                transition-all duration-500 
                hover:bg-right hover:shadow-2xl hover:shadow-purple-500/40 hover:-translate-y-1 
                active:scale-[0.98]
            "
          >
            <div className="relative flex items-center justify-center gap-3">
                 <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                    <Calendar className="w-6 h-6 text-white" strokeWidth={2.5} />
                 </div>
                 <span className="text-xl font-bold text-white tracking-wide">
                    Add deadlines to Calendar
                 </span>
            </div>
          </button>

          {/* Official Source Button (Secondary Action) */}
          <button 
            onClick={handleOpenOfficial}
            className="
                w-full py-4 rounded-[24px] 
                bg-white border border-gray-200 text-gray-600 font-bold text-lg
                flex items-center justify-center gap-2
                shadow-sm hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300 transition-all active:scale-[0.98]
            "
          >
            <ExternalLink className="w-5 h-5" />
            Verify on Official Site
          </button>

        </div>
      </div>
    </div>
  );
};

export default VisaResultScreen;