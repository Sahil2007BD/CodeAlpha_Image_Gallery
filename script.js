let images = JSON.parse(localStorage.getItem("gallery")) || [];

let pendingFile = null;
let selectedCategory = "nature";

const gallery = document.getElementById("gallery");
const upload = document.getElementById("upload");
const dropZone = document.getElementById("dropZone");
let currentFilter = "all";

// ---------- SAVE ----------
function save() {
  localStorage.setItem("gallery", JSON.stringify(images));
}

// ---------- RENDER ----------
function render() {
  gallery.innerHTML = "";

  images.forEach((img, i) => {
    const div = document.createElement("div");
    div.className = "image";

    div.innerHTML = `
      <img src="${img.src}" onclick="openLightbox(${i})">
      <button onclick="deleteImg(${i})">🗑</button>
    `;

    gallery.appendChild(div);
  });

  // 🔥 re-apply filter after every render
  applyFilter();
}

render();

// ---------- TOAST ----------
function toast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;

  t.innerText = msg;
  t.style.display = "block";

  setTimeout(() => {
    t.style.display = "none";
  }, 2000);
}

// ---------- ADD FLOW ----------
function addImage(file) {
  if (!file || !file.type.startsWith("image/")) {
    toast("Invalid file ❌");
    return;
  }

  pendingFile = file;
  openPopup();
}

// ---------- POPUP OPEN ----------
function openPopup() {
  const popup = document.getElementById("popup");
  if (!popup) return;

  popup.classList.remove("hidden");

  // reset selection UI
  document.querySelectorAll(".cat-btn").forEach(btn => {
    btn.classList.remove("active");
  });

  // default selection
  selectedCategory = "nature";
  const firstBtn = document.querySelector(".cat-btn");
  if (firstBtn) firstBtn.classList.add("active");
}

// ---------- CATEGORY SELECT ----------
function setCategory(cat, event) {
  selectedCategory = cat;

  document.querySelectorAll(".cat-btn").forEach(btn => {
    btn.classList.remove("active");
  });

  if (event && event.target) {
    event.target.classList.add("active");
  }
}

// ---------- CONFIRM UPLOAD ----------
function confirmUpload() {
  if (!pendingFile) {
    toast("No file selected ❌");
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    images.push({
      src: reader.result,
      category: selectedCategory
    });

    save();
    render();
    toast("Uploaded ✔");
  };

  reader.readAsDataURL(pendingFile);

  closePopup();
  pendingFile = null;
}

// ---------- CLOSE POPUP ----------
function closePopup() {
  const popup = document.getElementById("popup");
  if (popup) popup.classList.add("hidden");
}

// ---------- DELETE ----------
function deleteImg(i) {
  images.splice(i, 1);
  save();
  render();
  toast("Deleted 🗑");
}

// ---------- UPLOAD EVENTS ----------
dropZone.onclick = () => upload.click();

dropZone.ondragover = (e) => e.preventDefault();

dropZone.ondrop = (e) => {
  e.preventDefault();
  addImage(e.dataTransfer.files[0]);
};

upload.onchange = () => addImage(upload.files[0]);

// ---------- LIGHTBOX ----------
function openLightbox(i) {
  document.getElementById("lightbox").style.display = "flex";
  document.getElementById("lightbox-img").src = images[i].src;
}

function closeLightbox() {
  document.getElementById("lightbox").style.display = "none";
}

// ---------- DARK MODE ----------
function toggleDarkMode() {
  document.body.classList.toggle("light");
}


function filterImages(cat) {
  currentFilter = cat;

  const buttons = document.querySelectorAll(".filter");

  buttons.forEach(btn => btn.classList.remove("active"));
  event.target.classList.add("active");

  applyFilter();
}
function applyFilter() {
  const items = document.querySelectorAll(".image");

  items.forEach((el, i) => {
    const match =
      currentFilter === "all" ||
      images[i].category === currentFilter;

    el.style.display = match ? "block" : "none";
  });
}