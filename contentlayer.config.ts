import { defineDocumentType, makeSource } from "contentlayer/source-files";

export const Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: `posts/**/*.md`,
  fields: {
    title: { type: "string", required: true },
    date: { type: "date", required: true },
    subtitle: { type: "string" },
    tags: { type: "list", of: { type: "string" }, default: [] },
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (post) =>
        `/blog/${post._raw.flattenedPath.replace("posts/", "")}`,
    },
    category: {
      type: "string",
      resolve: () => "posts",
    },
  },
}));

export const Note = defineDocumentType(() => ({
  name: "Note",
  filePathPattern: `notes/**/*.md`,
  fields: {
    title: { type: "string" },
    tags: { type: "list", of: { type: "string" }, default: [] },
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (note) =>
        `/blog/${note._raw.flattenedPath.replace("notes/", "")}`,
    },
    category: {
      type: "string",
      resolve: () => "notes",
    },
    date: {
      type: "date",
      resolve: (note) => {
        // note_250722.md 형식에서 날짜 추출
        const filename = note._raw.sourceFileName;
        const dateMatch = filename.match(/note_(\d{6})\.md/);
        if (dateMatch) {
          const dateStr = dateMatch[1]; // 250722
          const year = `20${dateStr.slice(0, 2)}`; // 2025
          const month = dateStr.slice(2, 4); // 07
          const day = dateStr.slice(4, 6); // 22
          return new Date(`${year}-${month}-${day}`);
        }
        return new Date();
      },
    },
    title: {
      type: "string",
      resolve: (note) => {
        if (note.title) return note.title;

        // 파일명에서 기본 제목 생성
        const filename = note._raw.sourceFileName;
        const dateMatch = filename.match(/note_(\d{6})\.md/);
        if (dateMatch) {
          const dateStr = dateMatch[1];
          const year = `20${dateStr.slice(0, 2)}`;
          const month = dateStr.slice(2, 4);
          const day = dateStr.slice(4, 6);
          return `Note ${year}.${month}.${day}`;
        }
        return filename.replace(".md", "");
      },
    },
  },
}));

export default makeSource({
  contentDirPath: "./",
  documentTypes: [Post, Note],
});
