'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';

type Me = { fid: number };

type Stats = {
  todayChecked: boolean;
  streak: number;
  best: number;
  today: string;
};

export default function Page(): JSX.Element {
  const [me, setMe] = useState<Me | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMe = useCallback(async () => {
    try {
      const res = await sdk.quickAuth.fetch('/api/me');
      if (!res.ok) throw new Error('auth failed');
      const data: Me = await res.json();
      setMe(data);
    } catch {
      setError('로그인 오류가 있어요. Farcaster 앱 안에서 열었는지 확인해주세요.');
    }
  }, []);

  const fetchStats = useCallback(async () => {
    const res = await sdk.quickAuth.fetch('/api/checkin', { method: 'GET' });
    if (res.ok) setStats(await res.json());
  }, []);

  const doCheckIn = useCallback(async () => {
    const res = await sdk.quickAuth.fetch('/api/checkin', { method: 'POST' });
    if (res.ok) {
      const data = await res.json();
      setStats(data);
      sdk.actions.haptics?.notification?.('success');
    } else {
      sdk.actions.haptics?.notification?.('error');
    }
  }, []);

  useEffect(() => {
    (async () => {
      await fetchMe();
      await fetchStats();
      await sdk.actions.ready();
      setLoading(false);
    })();
  }, [fetchMe, fetchStats]);

  if (loading) return null;
  if (error) {
    return (
      <main className="p-6 text-center">
        <h1 className="text-2xl font-bold">Streak Check-in</h1>
        <p style={{ color: '#ef4444' }}>{error}</p>
      </main>
    );
  }
  if (!me || !stats) return <main className="p-6">로딩 중…</main>;

  return (
    <main className="p-6 flex flex-col items-center gap-4">
      <h1 className="text-2xl font-bold">연속 출석: {stats.streak}일</h1>
      <p>최고 기록: {stats.best}일</p>
      <p>오늘({stats.today}) 상태: {stats.todayChecked ? '✅ 완료' : '⬜ 미완료'}</p>
      <button
        className="mt-2 rounded-2xl border px-6 py-3 text-lg"
        onClick={doCheckIn}
        disabled={stats.todayChecked}
      >
        {stats.todayChecked ? '오늘은 이미 체크했어요' : '오늘 출석 체크하기'}
      </button>
    </main>
  );
}
