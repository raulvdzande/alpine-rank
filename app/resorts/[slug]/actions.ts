"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export interface ReviewData {
  terrain: number;
  snow: number;
  lifts: number;
  apres: number;
  family: number;
  value: number;
  scenery: number;
}

async function recalcResort(resortId: string) {
  const agg = await prisma.review.aggregate({
    where: { resortId },
    _avg: { overall: true },
    _count: true,
  });
  await prisma.resort.update({
    where: { id: resortId },
    data: {
      averageOverallRating: parseFloat((agg._avg.overall ?? 0).toFixed(3)),
      reviewCount: agg._count,
    },
  });
}

export async function submitReview(resortId: string, data: ReviewData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const resort = await prisma.resort.findUnique({ where: { id: resortId }, select: { slug: true } });
  if (!resort) redirect("/resorts");

  const avg = (data.terrain + data.snow + data.lifts + data.apres + data.family + data.value + data.scenery) / 7;
  const overall = parseFloat((avg / 2).toFixed(3));

  await prisma.review.upsert({
    where: { userId_resortId: { userId: user.id, resortId } },
    create: { userId: user.id, resortId, overall, ...data },
    update: { overall, ...data },
  });

  await recalcResort(resortId);

  revalidatePath(`/resorts/${resort.slug}`);
  revalidatePath("/resorts");
  revalidatePath("/");
  redirect(`/resorts/${resort.slug}`);
}

export async function deleteReview(resortId: string) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const resort = await prisma.resort.findUnique({ where: { id: resortId }, select: { slug: true } });
  if (!resort) redirect("/resorts");

  await prisma.review.deleteMany({ where: { resortId, userId: user.id } });
  await recalcResort(resortId);

  revalidatePath(`/resorts/${resort.slug}`);
  revalidatePath("/resorts");
  revalidatePath("/");
  redirect(`/resorts/${resort.slug}`);
}
