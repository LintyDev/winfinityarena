'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';

function ChangeLogs() {
  const [github, setGihub] = useState<any[]>([]);

  useEffect(() => {
    const getGithubData = async () => {
      const formatedData: any[] = [];
      try {
        const res = await axios.get(
          'https://api.github.com/repos/LintyDev/winfinityarena/milestones'
        );
        if (res.status !== 200) {
          return;
        }

        const promises = res.data.map(async (m: any) => {
          const res = await axios.get(
            `https://api.github.com/repos/LintyDev/winfinityarena/issues?milestone=${m.number}&state=closed`
          );
          if (res.status !== 200) {
            return null;
          }
          const issues = res.data.map((i: any) => ({
            title: i.title,
            description: i.body,
            url: i.html_url,
            user: {
              username: i.assignee?.login,
              avatar: i.assignee?.avatar_url,
              url: i.assignee?.html_url,
            },
            labels: i.labels,
            date: i.closed_at,
          }));
          return { title: m.title, issues };
        });

        const results = await Promise.all(promises);
        console.log('github api', results);
        setGihub(results);
      } catch (error) {
        console.log(error);
      }
    };
  }, []);

  return (
    <>
      <p className="subtitle mt-5">ChangeLogs</p>
      <div className="max-w-4xl w-full mx-auto overflow-auto">
        {/* {github.map((d: any, i: number) => {
          return (
            <div key={i}>
              <p className="subtitle text-left">Version : {d.title}</p>
              <div className="flex flex-col gap-4">
                {d.issues.map((i: any, index: number) => {
                  return (
                    <a key={index} className="flex">
                      <div>
                        <p>{i.title}</p>
                        <p>{i.date}</p>
                      </div>
                      <div>
                        <div className="flex">
                          {i.labels.map((l: any, indexLabel: number) => {
                            return <p key={indexLabel}>{l.name}</p>;
                          })}
                        </div>
                        <p>{i.description}</p>
                        <p>{i.user.username}</p>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          );
        })} */}
        <p className="title">
          Pour le moment rendez-vous sur{' '}
          <a
            href="https://github.com/LintyDev/winfinityarena/issues?q=is%3Aissue+is%3Aclosed+milestone%3A1.0.0RC1"
            target="_blank"
          >
            github
          </a>
        </p>
      </div>
    </>
  );
}

export default ChangeLogs;
