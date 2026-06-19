"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";

function field(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

export async function moderateResource(formData: FormData) {
  const { supabase } = await requireAdmin();
  const resourceId = field(formData, "resourceId");
  const decision = field(formData, "decision");
  const notes = field(formData, "notes");
  const blockHash = formData.get("blockHash") === "on";

  if (!resourceId || !["approve", "reject"].includes(decision)) {
    redirect("/owner/moderacion?error=invalid_action");
  }

  const { error } = await supabase.rpc("moderate_resource", {
    target_resource_id: resourceId,
    moderation_decision: decision,
    moderation_notes_input: notes || null,
    block_hash: blockHash
  });

  if (error) {
    redirect(`/owner/moderacion?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/owner/moderacion");
  redirect("/owner/moderacion?updated=1");
}

export async function resolveReport(formData: FormData) {
  const { supabase } = await requireAdmin();
  const reportId = field(formData, "reportId");
  const status = field(formData, "status");
  const notes = field(formData, "notes");

  if (!reportId || !["resolved", "rejected"].includes(status)) {
    redirect("/owner/moderacion?error=invalid_report_action");
  }

  const { error } = await supabase.rpc("resolve_resource_report", {
    target_report_id: reportId,
    report_status: status,
    resolution_notes_input: notes || null
  });

  if (error) {
    redirect(`/owner/moderacion?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/owner/moderacion");
  redirect("/owner/moderacion?updated=1");
}
