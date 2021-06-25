const tambahBtn = document.getElementById("tambah-btn");
const cariBtn = document.getElementById("cari-btn");
const judul = document.getElementById("judul");
const penulis = document.getElementById("penulis");
const tahun = document.getElementById("tahun");
const selesai = document.querySelector("#selesai");
const blmSelesaiDiv = document.getElementById("blm-selesai-div");
const selesaiDiv = document.getElementById("selesai-div");
const tambahForm = document.querySelector("form");
const cariForm = document.querySelector("form:nth-of-type(2)");
const pindahBtn = document.querySelectorAll(".pindah-btn");
const cariJudul = document.getElementById("cariJudul");
const modal = document.getElementById("modal");
const key = "buku";
// Modal
const btnClose = document.querySelectorAll(
  ".modal-footer .btn-success, .btn-close"
);
const btnSave = document.querySelector(".modal-footer .btn-danger");

btnClose.forEach((item) => item.addEventListener("click", () => toggleModal()));

localStorage.getItem(key) === null ? null : updateRak();
tambahForm.addEventListener("submit", (e) => {
  e.preventDefault();
  e.target.classList.add("was-validated");

  if (!tambahForm.checkValidity()) {
    return;
  }

  const id = +new Date();
  const bukuBaru = {
    id: id,
    title: judul.value,
    author: penulis.value,
    year: tahun.value,
    isComplete: selesai.checked,
  };
  if (localStorage.getItem(key) === null) {
    localStorage.setItem(key, JSON.stringify([bukuBaru]));
    return updateRak();
  }
  const buku = JSON.parse(localStorage.getItem(key));
  buku.push(bukuBaru);
  localStorage.setItem(key, JSON.stringify(buku));
  updateRak();
});

cariForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (localStorage.getItem(key) === null || !cariJudul.value)
    return updateRak();
  const data = JSON.parse(localStorage.getItem(key));
  const result = data.filter((item) => item.title.includes(cariJudul.value));
  updateRak(result);
});

function updateRak(q) {
  const data = JSON.parse(localStorage.getItem(key));
  const buku = data.map((item) => {
    const bukuBaru = document.createElement("div");
    bukuBaru.classList.add("card", "p-2", "mb-3");
    const ul = document.createElement("ul");
    ul.classList.add("list-group-flush", "px-2");
    const arr = ["title", "author", "year"];
    for (let i of arr) {
      const li = document.createElement("li");
      li.innerHTML = item[i];
      li.classList.add("list-group-item");
      ul.append(li);
    }
    ul.firstElementChild.classList.add("card-title");
    ul.children[1].prepend("Penulis: ");
    ul.children[2].prepend("Tahun Terbit: ");
    ul.children[2].classList.add("border-bottom-0", "mb-1");
    ul.append(bukuBtn(item.id, item.isComplete));
    bukuBaru.append(ul);

    return bukuBaru;
  });

  blmSelesaiDiv.innerHTML = "";
  let h = document.createElement("h3");
  h.innerHTML = "Belum selesai dibaca";
  h.classList.add("text-center", "text-primary", "mb-4");
  blmSelesaiDiv.append(h);
  selesaiDiv.innerHTML = "";
  h = document.createElement("h3");
  h.innerHTML = "Selesai dibaca";
  h.classList.add("text-center", "text-primary", "mb-4");
  selesaiDiv.append(h);

  buku.forEach((item, index) => {
    if (data[index].isComplete) {
      return selesaiDiv.append(item);
    }
    blmSelesaiDiv.append(item);
  });

  if (q) {
    buku.forEach((item) => item.classList.add("d-none"));
    let collection = document.querySelectorAll(".card-title");
    collection = Array.from(collection);
    const result = collection.filter((item) =>
      item.innerHTML.includes(cariJudul.value)
    );

    result.forEach((item) =>
      item.parentElement.parentElement.classList.remove("d-none")
    );
  }
}

function bukuBtn(id, isComplete) {
  const data = JSON.parse(localStorage.getItem(key));
  const li = document.createElement("li");
  li.classList.add("btn-group");
  const btnPindah = document.createElement("button");
  btnPindah.classList.add("btn", "btn-success", "pindah-btn");
  btnPindah.innerHTML = isComplete ? "Belum dibaca" : "Sudah dibaca";
  const btnHapus = document.createElement("button");
  btnHapus.classList.add("btn", "btn-danger", "hapus-btn");
  btnHapus.innerHTML = "Hapus";
  li.append(btnPindah, btnHapus);

  btnPindah.addEventListener("click", () => {
    const result = data.filter((v) => v.id == id);
    result[0].isComplete = !result[0].isComplete;
    localStorage.setItem(key, JSON.stringify(data));

    updateRak();
  });
  btnHapus.addEventListener("click", () => {
    toggleModal(true);
  });
  btnSave.addEventListener("click", () => {
    const result = data.filter((v) => v.id != id);
    localStorage.setItem(key, JSON.stringify(result));
    toggleModal();
    updateRak();
  });

  return li;
}

function toggleModal(open) {
  if (open) {
    modal.style.display = "block";
    modal.classList.add("show");
    modal.style.background = "rgba(0, 0, 0, 0.5)";
    document.body.style.overflow = "hidden";
    return;
  }
  modal.style.display = "";
  modal.classList.remove("show");
  modal.style.background = "";
  document.body.style.overflow = "";
}
