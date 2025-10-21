import { z } from 'zod'

export const ExplainSchema = z.object({
  topic: z.string().min(2),
  level: z
    .enum(['beginner', 'intermediate', 'advanced'])
    .optional()
    .default('beginner'),
})

export const HintSchema = z.object({
  problem: z.string().min(10),
  context: z.string().optional(),
})

export const RecommendSchema = z.object({
  history: z.array(z.string()).default([]),
})

export const QuizSchema = z.object({
  topic: z.string().min(2),
  count: z.number().int().min(1).max(10).default(5),
})

export const ProgressUpsertSchema = z.object({
  topic_id: z.string().uuid(),
  status: z.enum(['not_started', 'in_progress', 'completed']),
  score: z.number().int().min(0).max(100).optional(),
})
