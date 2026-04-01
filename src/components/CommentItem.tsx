"use client";

import { Comment } from "../types/post";

interface CommentItemProps {
  comment: Comment;
}

export default function CommentItem({ comment }: CommentItemProps) {
  return (
    <div className="rounded border p-3">
<<<<<<< HEAD
      <div className="text-sm font-semibold">{comment.author}</div>
      <p className="mt-1 text-sm text-gray-700">{comment.content}</p>
      <div className="mt-2 text-xs text-gray-400">{comment.createdAt}</div>
=======
      {/* 작성자 */}
      <div className="text-sm font-semibold">
        {comment.author}
      </div>

      {/* 내용 */}
      <p className="mt-1 text-sm text-gray-700">
        {comment.content}
      </p>

      {/* 작성 시간 */}
      <div className="mt-2 text-xs text-gray-400">
        {comment.createdAt}
      </div>
>>>>>>> 7c9f19721b739ad7b79b829663f07c14be1c3ba5
    </div>
  );
}