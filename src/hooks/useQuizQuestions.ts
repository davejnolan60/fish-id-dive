import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { getVideoPublicUrl } from "@/lib/videoUrls";

export type QuizQuestion = {
  id: string;
  videoUrl: string;
  options: string[];
  correctAnswer: string;
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function sample<T>(arr: T[], n: number): T[] {
  return shuffle(arr).slice(0, n);
}

async function buildQuestions(targetCount = 12): Promise<QuizQuestion[]> {
  const [{ data: species, error: speciesError }, { data: videos, error: videosError }] = await Promise.all([
    supabase.from("fish_species").select("id, name, scientific_name, region").order("name"),
    supabase.from("fish_videos").select("id, species_id, file_path")
  ]);

  if (speciesError) throw speciesError;
  if (videosError) throw videosError;
  if (!species || !videos) return [];

  const videosBySpecies = new Map<string, { id: string; file_path: string }[]>();
  for (const v of videos) {
    if (!v.species_id) continue;
    const list = videosBySpecies.get(v.species_id) ?? [];
    list.push({ id: v.id as string, file_path: v.file_path as string });
    videosBySpecies.set(v.species_id as string, list);
  }

  const eligibleSpecies = species.filter((s: any) => videosBySpecies.has(s.id));
  const pickedSpecies = sample(eligibleSpecies, Math.min(targetCount, eligibleSpecies.length));
  const allNames: string[] = species.map((s: any) => s.name);

  const questions: QuizQuestion[] = pickedSpecies.map((s: any) => {
    const vids = videosBySpecies.get(s.id)!;
    const video = sample(vids, 1)[0];
    const correct = s.name as string;
    const distractors = sample(allNames.filter((n) => n !== correct), Math.min(3, allNames.length - 1));
    const options = shuffle([correct, ...distractors]);
    return {
      id: video.id,
      videoUrl: getVideoPublicUrl(video.file_path),
      options,
      correctAnswer: correct,
    };
  });

  return questions;
}

export function useQuizQuestions(count = 12) {
  return useQuery({ queryKey: ["quiz_questions", count], queryFn: () => buildQuestions(count) });
}


