fetch("https://api.github.com/repos/trisbman/aplikasi-rak-buku/branches/master")
  .then((response) => response.json())
  .then((data) => {
    let date = data.commit.commit.committer.date;
    let lastUpdate = new Date(date).toString().split(" ");
    let now = new Date().toString().split(" ");
    let isToday;
    for (let i = 1; i <= 3; i++) {
      isToday = lastUpdate[i] === now[i];
    }
    lastUpdate = date.toString().split(/[TZ]/);
    lastUpdate[1] += " UTC";
    const span = document.getElementById("last-update");
    span.innerText = lastUpdate[+isToday];
  });
