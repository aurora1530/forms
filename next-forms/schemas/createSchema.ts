import { z } from 'zod';

// 入力欄で共通のバリデーション
const nonEmptyString = (field: string) =>
  z
    .string({ message: `${field}を入力してください。` })
    .max(255, { message: `${field}は255文字以内で入力してください。` })
    .refine((v) => Boolean(v.trim()), {
      message: `${field}を入力してください。`,
    });

// 選択肢のスキーマ
export const choiceInputSchema = z.object({
  choiceText: nonEmptyString('選択肢'),
});
export type ChoiceInputType = z.infer<typeof choiceInputSchema>;

// 質問１件のスキーマ
// 質問全てに共通するスキーマ
const baseQuestionSchema = z.object({
  questionText: nonEmptyString('質問'),
  questionType: z.enum(['text', 'paragraph', 'radiobutton', 'checkboxes']),
});
// questionType によって場合分け
export const questionInputSchema = z.discriminatedUnion('questionType', [
  baseQuestionSchema.extend({
    questionType: z.enum(['text', 'paragraph']),
    choices: z.array(choiceInputSchema).max(0).optional(),
  }),
  baseQuestionSchema.extend({
    questionType: z.enum(['radiobutton', 'checkboxes']),
    choices: z
      .array(choiceInputSchema)
      .min(1, { message: '選択肢を追加してください。' }),
  }),
]);
export type QuestionInputType = z.infer<typeof questionInputSchema>;

// 新規作成フォームの全体スキーマ
export const createFormSchema = z.object({
  formTitle: nonEmptyString('タイトル'),
  description: z
    .string()
    .max(255, { message: '説明は255文字以内で入力してください。' })
    .optional(),
  questions: z
    .array(questionInputSchema)
    .min(1, { message: '質問を追加してください。' }),
});
export type CreateFormType = z.infer<typeof createFormSchema>;