let images = JSON.parse(localStorage.getItem("gallery")) || [];

let currentIndex = 0;

const gallery = document.getElementById("gallery");
const upload = document.getElementById("upload");
const dropZone = document.getElementById("dropZone");


// ---------- TOAST ----------
function toast(msg) {
  const t = document.getElementById("toast");
  t.innerText = msg;
  t.style.display = "block";

  setTimeout(() => {
    t.style.display = "none";
  }, 2000);
}


// ---------- SAVE ----------
function save() {
  localStorage.setItem("gallery", JSON.stringify(images));
}


// ---------- RENDER ----------
function render() {
  gallery.innerHTML = "";

  images.forEach((img, index) => {
    const div = document.createElement("div");
    div.className = "image";
    div.dataset.category = img.category;
    div.dataset.index = index; // ✅ FIX for drag reorder

    div.draggable = true;

    div.innerHTML = `
      <img src="${img.src}" loading="lazy" onclick="openLightbox(${index})">
    `;

    gallery.appendChild(div);
  });

  enableDragSort();
}

render();


// ---------- ADD IMAGE ----------
function addImage(file) {
  if (!file) return;

  const reader = new FileReader();

  reader.onload = () => {
    images.push({
      src: reader.result,
      category: "nature"
    });

    save();
    render();
    toast("Image added ✔");
  };

  reader.readAsDataURL(file);
}


// ---------- DELETE ----------
function deleteImg(index) {
  images.splice(index, 1);
  save();
  render();
  toast("Deleted 🗑");
}


// ---------- CATEGORY ----------
function changeCategory(index, value) {
  images[index].category = value;
  save();
  toast("Category updated");
}


// ---------- FILTER ----------
function filterImages(cat) {
  document.querySelectorAll(".image").forEach(el => {
    el.style.display =
      cat === "all" || el.dataset.category === cat ? "block" : "none";
  });
}


// ---------- DRAG & DROP UPLOAD ----------
dropZone.onclick = () => upload.click();

dropZone.ondragover = e => {
  e.preventDefault();
  dropZone.style.borderColor = "#4f9cff";
};

dropZone.ondragleave = () => {
  dropZone.style.borderColor = "gray";
};

dropZone.ondrop = e => {
  e.preventDefault();
  addImage(e.dataTransfer.files[0]);
};

upload.onchange = () => addImage(upload.files[0]);


// ---------- LIGHTBOX ----------
function openLightbox(i) {
  currentIndex = i;
  document.getElementById("lightbox").style.display = "flex";
  show();
}

function closeLightbox() {
  document.getElementById("lightbox").style.display = "none";
}

function show() {
  document.getElementById("lightbox-img").src = images[currentIndex].src;
}

function nextImage() {
  currentIndex = (currentIndex + 1) % images.length;
  show();
}

function prevImage() {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  show();
}


// ---------- DARK MODE ----------
function toggleDarkMode() {
  document.body.classList.toggle("light");

  localStorage.setItem(
    "theme",
    document.body.classList.contains("light") ? "light" : "dark"
  );
}

if (localStorage.getItem("theme") === "light") {
  document.body.classList.add("light");
}


// ---------- DRAG TO REORDER ----------
function enableDragSort() {
  const items = document.querySelectorAll(".image");

  items.forEach(item => {
    item.addEventListener("dragstart", e => {
      e.dataTransfer.setData("from", item.dataset.index);
    });

    item.addEventListener("dragover", e => e.preventDefault());

    item.addEventListener("drop", e => {
      e.preventDefault();

      const from = e.dataTransfer.getData("from");
      const to = item.dataset.index;

      const moved = images.splice(from, 1)[0];
      images.splice(to, 0, moved);

      save();
      render();
      toast("Reordered 🔄");
    });
  });
}