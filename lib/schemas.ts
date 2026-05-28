import { z } from "zod";

export const linkSchema = z.object({
  title: z.string().min(1, { message: "링크 제목을 입력해주세요." }),
  url: z.string().min(1, { message: "웹 주소(URL)를 입력해주세요." }).refine(val => {
    try {
      const urlObj = new URL(val.startsWith('http') ? val : `https://${val}`);
      return urlObj.hostname.includes('.');
    } catch {
      return false;
    }
  }, { message: "올바른 웹 주소 형식이 아닙니다. (예: example.com)" })
});

export type LinkFormValues = z.infer<typeof linkSchema>;
