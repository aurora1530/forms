'use server';

import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import type { CreateFormType } from '@/schemas/createSchema';
import type { QuestionInputType } from '@/schemas/createSchema';

export async function createFormAction(
  data: CreateFormType,
): Promise<object> {
  const session = await auth();

  if (!session?.user?.email) {
    return { success: false, error: 'LOGIN_REQUIRED' };
  }

  const user = await prisma.user.findUnique({
      where: { email: session.user.email },
  });
  if (!user) {
    return { success: false, error: 'USER_NOT_FOUND' };
  }

  try {
    const createdFormId = await prisma.$transaction(async (tx) => {
      // フォームを保存
      const createdForm = await tx.form.create({
        data: {
          formTitle: data.formTitle,
          description: data.description ?? '',
          createdBy: user.userId,
        },
      });

      // formId と紐付けて、質問を保存
      const questions = data.questions.map((question: QuestionInputType) => ({
        formId: createdForm.formId,
        questionText: question.questionText,
        questionType: question.questionType,
        choices: question.choices
          ? question.choices.map((choice) => choice.choiceText)
          : [],
      }));
      await tx.question.createMany({
        data: questions,
      });
      return createdForm.formId;
    });

    return {
      success: true,
      successType: 'ACTION_SUCCESS',
      formId: createdFormId,
    };
  } catch (error) {
    console.error('createFormAction Error: ', error);
    return { success: false, error: 'ACTION_FAILED' };
  }
}