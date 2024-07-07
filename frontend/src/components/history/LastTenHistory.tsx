'use client';

import axiosClient from '@/lib/axiosClient';
import { SessionHistory } from '@/types/user';
import { useEffect, useState } from 'react';
import { DateTime } from 'luxon';

function LastTenHistory() {
  const [history, setHistory] = useState<SessionHistory[]>([]);

  useEffect(() => {
    const getHistory = async () => {
      try {
        const res = await axiosClient.get('/session/history');
        console.log(res.data);
        if (res.data.success) {
          setHistory(res.data.session as SessionHistory[]);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getHistory();
  }, []);

  return (
    <div className="max-w-lg flex flex-col self-center">
      <p className="title text-center">Historique :</p>
      <table className="table-fixed w-full border-spacing-2">
        <caption className="caption-top subtitle !text-xs">
          10 dernières sessions
        </caption>
        <thead>
          <tr>
            <th className="subtitle text-center">id</th>
            <th className="subtitle text-center">jeu</th>
            <th className="subtitle text-center">vainqueur</th>
            <th className="subtitle text-center">date</th>
          </tr>
        </thead>
        <tbody>
          {history.map((h) => {
            return (
              <tr key={h.id}>
                <td className="text-center">{h.id}</td>
                <td className="text-center">
                  {h.game === 'uno_pokemon' ? 'Uno Pokemon' : h.game}
                </td>
                <td className="text-center">{h.users[0]?.username ?? '~'}</td>
                <td className="text-center">
                  {DateTime.fromISO(h.updatedAt)
                    .setLocale('fr')
                    .toFormat('MMMM dd, yyyy')}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default LastTenHistory;
