import { NextResponse } from "next/server";
import { getParcoursState } from "@/lib/parcours";

export async function GET() {
  const state = await getParcoursState();
  return NextResponse.json(state);
}
