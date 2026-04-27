import axios from "axios";
import type { Post, PostDetail } from "../types/post";
import type {
  LoginRequest,
  RegisterRequest,
  TokenResponse,
  User,
} from "../types/auth";
import type { Room, Reservation, ReservationCreate } from "@/types/reservation";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

/* 게시글 API */
export const fetchPosts = async (): Promise<Post[]> => {
  const res = await api.get("/posts");
  return res.data;
};

export const fetchPost = async (id: number): Promise<PostDetail> => {
  const res = await api.get(`/posts/${id}`);
  return res.data;
};

export const createPost = async (data: {
  title: string;
  content: string;
}) => {
  const res = await api.post("/posts", data);
  return res.data;
};

export const toggleLike = async (id: number): Promise<PostDetail> => {
  const res = await api.patch(`/posts/${id}/like`);
  return res.data;
};

export const deletePost = async (id: number) => {
  const res = await api.delete(`/posts/${id}`);
  return res.data;
};

export const createComment = async (
  postId: number,
  data: { content: string }
): Promise<PostDetail> => {
  const res = await api.post(`/posts/${postId}/comments`, data);
  return res.data;
};

export const deleteComment = async (
  postId: number,
  commentId: number
): Promise<PostDetail> => {
  const res = await api.delete(`/posts/${postId}/comments/${commentId}`);
  return res.data;
};

/* 인증 API */
export const register = async (data: RegisterRequest) => {
  const res = await api.post<TokenResponse>("/auth/register", data);
  return res.data;
};

export const login = async (data: LoginRequest) => {
  const res = await api.post<TokenResponse>("/auth/login", data);
  return res.data;
};

export const getMe = async () => {
  const res = await api.get<User>("/auth/me");
  return res.data;
};

/* 스터디룸 API */
export const fetchRooms = async (): Promise<Room[]> => {
  const res = await api.get<Room[]>("/rooms");
  return res.data;
};

export const fetchRoom = async (roomId: string): Promise<Room> => {
  const res = await api.get<Room>(`/rooms/${roomId}`);
  return res.data;
};

export const fetchRoomReservations = async (
  roomId: string,
  date: string
): Promise<Reservation[]> => {
  const res = await api.get<Reservation[]>(
    `/rooms/${roomId}/reservations?date=${date}`
  );
  return res.data;
};

/* 예약 API */
export const createReservation = async (
  data: ReservationCreate
): Promise<Reservation> => {
  const res = await api.post<Reservation>("/reservations", data);
  return res.data;
};

export const fetchMyReservations = async (): Promise<Reservation[]> => {
  const res = await api.get<Reservation[]>("/reservations/me");
  return res.data;
};

export const cancelReservation = async (
  reservationId: string
): Promise<void> => {
  await api.delete(`/reservations/${reservationId}`);
};

export default api;