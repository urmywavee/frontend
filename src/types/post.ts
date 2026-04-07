// 댓글 타입
export interface Comment {
  id: number;
  content: string;
  createdAt: string;
}

// 게시글 목록용 타입
export interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  likeCount: number;
  commentCount: number; // ⭐ 중요
}

// 게시글 상세용 타입
export interface PostDetail {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  likeCount: number;
  comments: Comment[]; // ⭐ 여기만 다름
}