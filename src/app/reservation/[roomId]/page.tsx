"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/stores/useAuthStore";

import {
  fetchRoom,
  fetchRoomReservations,
  createReservation,
} from "@/lib/api";

import type { Room, Reservation } from "@/types/reservation";

export default function RoomDetailPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const { isLoggedIn } = useAuthStore();

  const [room, setRoom] = useState<Room | null>(null);

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const [selectedStart, setSelectedStart] = useState<string | null>(null);
  const [selectedEnd, setSelectedEnd] = useState<string | null>(null);

  const [purpose, setPurpose] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // 시간 슬롯 생성 (09~21)
  const TIME_SLOTS = Array.from({ length: 13 }, (_, i) => {
    const hour = i + 9;
    return `${hour.toString().padStart(2, "0")}:00`;
  });

  // 방 정보 로드
  useEffect(() => {
    if (!roomId) return;
    fetchRoom(roomId).then(setRoom);
  }, [roomId]);

  // 날짜 변경 시 예약 로드
  useEffect(() => {
    if (!roomId) return;

    const load = async () => {
      const data = await fetchRoomReservations(roomId, selectedDate);
      setReservations(data);
    };

    load();

    setSelectedStart(null);
    setSelectedEnd(null);
  }, [selectedDate, roomId]);

  // 특정 시간 예약 확인
  const getReservationForSlot = (time: string) => {
    return reservations.find(
      (r) => r.startTime <= time && r.endTime > time
    );
  };

  // 시간 클릭
  const handleSlotClick = (time: string) => {
    if (getReservationForSlot(time)) return;
    if (!isLoggedIn) return;

    if (!selectedStart || (selectedStart && selectedEnd)) {
      setSelectedStart(time);
      const nextHour = `${(parseInt(time) + 1)
        .toString()
        .padStart(2, "0")}:00`;
      setSelectedEnd(nextHour);
    } else {
      const endTime = `${(parseInt(time) + 1)
        .toString()
        .padStart(2, "0")}:00`;

      if (selectedStart && endTime > selectedStart) {
        setSelectedEnd(endTime);
      }
    }
  };

  // 예약
  const handleReserve = async () => {
    if (!selectedStart || !selectedEnd || !purpose.trim()) {
      alert("시간과 예약 목적을 입력해주세요.");
      return;
    }

    setSubmitting(true);
    try {
      await createReservation({
        roomId,
        date: selectedDate,
        startTime: selectedStart,
        endTime: selectedEnd,
        purpose,
      });

      alert("예약이 완료되었습니다!");

      const updated = await fetchRoomReservations(roomId, selectedDate);
      setReservations(updated);

      setSelectedStart(null);
      setSelectedEnd(null);
      setPurpose("");
    } catch (err: any) {
  console.log("예약 실패 전체 에러:", err);
  console.log("예약 실패 응답:", err.response?.data);

  const message =
    err.response?.data?.message ||
    err.response?.data?.error ||
    err.response?.data?.detail ||
    "예약에 실패했습니다.";

  alert(message);
} finally {
  setSubmitting(false);
}
  };

  if (!room) return <div>로딩 중...</div>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold">{room.name}</h1>
      <p className="text-sm text-gray-600">
        {room.location} · {room.capacity}인
      </p>

      {/* 날짜 */}
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        className="mt-4 border p-2 w-full"
      />

      {/* 시간표 */}
      <div className="mt-4 border rounded">
        {TIME_SLOTS.map((time) => {
          const reservation = getReservationForSlot(time);

          const isSelected =
            selectedStart &&
            selectedEnd &&
            time >= selectedStart &&
            time < selectedEnd;

          return (
            <div
              key={time}
              onClick={() => handleSlotClick(time)}
              className={`flex items-center border-b p-3 ${
                reservation
                  ? "bg-gray-200 cursor-not-allowed"
                  : isSelected
                  ? "bg-blue-100 cursor-pointer"
                  : "hover:bg-gray-50 cursor-pointer"
              }`}
            >
              <span className="w-16 font-mono text-sm">{time}</span>

              <span className="flex-1 text-sm">
                {reservation
                  ? `${reservation.purpose} (${reservation.username})`
                  : isSelected
                  ? "선택됨"
                  : ""}
              </span>
            </div>
          );
        })}
      </div>

      {/* 예약 영역 */}
      {isLoggedIn ? (
        <div className="mt-4 space-y-3">
          {selectedStart && selectedEnd && (
            <p className="text-sm">
              선택한 시간: {selectedStart} ~ {selectedEnd}
            </p>
          )}

          <input
            type="text"
            placeholder="예약 목적을 입력하세요"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />

          <button
            onClick={handleReserve}
            disabled={
              !selectedStart || !selectedEnd || !purpose.trim() || submitting
            }
            className="w-full bg-blue-500 text-white py-2 rounded disabled:opacity-50"
          >
            {submitting ? "예약 중..." : "예약하기"}
          </button>
        </div>
      ) : (
        <p className="mt-4 text-sm text-gray-500">
          <Link href="/login" className="underline">
            로그인
          </Link>{" "}
          후 예약할 수 있습니다.
        </p>
      )}
    </div>
  );
}

function useAuth(): { isLoggedIn: any; } {
    throw new Error("Function not implemented.");
}
