const getData = async () => {
  const res = await fetch(
    'https://api.github.com/repos/LintyDev/winfinityarena/issues?state=closed'
  );
  if (!res) {
    console.log('error');
    return;
  }
  const ress = await res.json();
  return ress;
};

async function ChangeLogs() {
  const data = await getData();
  console.log(data as []);
  return (
    <div>
      <p className="subtitle mt-5">ChangeLogs</p>
      {data.map((v: any) => {
        return v.url;
      })}
    </div>
  );
}

export default ChangeLogs;
