// src/app/api/notifications/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

type DocumentRow = {
  id: string;
  title: string;
  expiry_date: string | null;
  created_at?: string;
};

type NotificationStatus = "success" | "warning" | "danger" | "info";

type Notification = {
  id: string;
  text: string;
  status: NotificationStatus;
  createdAt?: string;
};

// GET /api/notifications?userId=xxxx
export async function GET(req: NextRequest) {
  const supabase = supabaseServer;

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("documents")
    .select("id, title, expiry_date, created_at")
    .eq("user_id", userId)
    .not("expiry_date", "is", null);

  if (error) {
    console.error("Error fetching documents for notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }

  const today = new Date();
  const todayDate = new Date(today.toISOString().slice(0, 10));

  const notifications: Notification[] = [];

  (data as DocumentRow[]).forEach((doc) => {
    if (!doc.expiry_date) return;

    const expDate = new Date(doc.expiry_date);
    const expiryDateOnly = new Date(expDate.toISOString().slice(0, 10));

    const diffMs = expiryDateOnly.getTime() - todayDate.getTime();
    const daysRemaining = Math.round(diffMs / (1000 * 60 * 60 * 24));

    let status: NotificationStatus | null = null;
    let text = "";

    if (daysRemaining < 0) {
      status = "danger";
      text = `⚠️ ${doc.title} expired ${Math.abs(daysRemaining)} day(s) ago.`;
    } else if (daysRemaining === 0) {
      status = "danger";
      text = `⚠️ ${doc.title} expires today.`;
    } else if (daysRemaining <= 7) {
      status = "danger";
      text = `⚠️ ${doc.title} will expire in ${daysRemaining} day(s).`;
    } else if (daysRemaining <= 30) {
      status = "warning";
      text = `⏳ ${doc.title} will expire in ${daysRemaining} day(s).`;
    } else {
      // Long term valid docs → no notification (you can change this to "info" if you want)
      return;
    }

    notifications.push({
      id: doc.id,
      text,
      status,
      createdAt: doc.created_at,
    });
  });

  // You could also sort by urgency here if you want
  return NextResponse.json({
    notifications,
    unreadCount: notifications.length,
  });
}
