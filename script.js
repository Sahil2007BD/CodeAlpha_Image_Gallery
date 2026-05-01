const gallery = document.getElementById("gallery");
const uploadInput = document.getElementById("upload");
const dropZone = document.getElementById("dropZone");

let images = [
  {src:"https://picsum.photos/id/1018/400/300", category:"nature"},
  {src:"https://picsum.photos/id/1015/400/300", category:"city"},
  {src:"https://picsum.photos/id/1005/400/300", category:"people"},
];

let currentIndex = 0;

// Render
function renderGallery() {
  gallery.innerHTML = "";

  images.forEach((img, index) => {
    const div = document.createElement("div");
    div.classList.add("image");
    div.dataset.category = img.category;

    div.innerHTML = `
      <img src="${img.src}" loading="lazy" onclick="openLightbox(${index})">

      <div class="actions">
        <button onclick="deleteImage(${index})">🗑</button>
        <button onclick="editCategory(${index})">✏️</button>
      </div>
    `;

    gallery.appendChild(div);
  });
}
renderGallery();


// ---------------- FILTER ----------------
function filterImages(category) {
  document.querySelectorAll(".image").forEach(item => {
    if (category === "all" || item.dataset.category === category) {
      item.classList.remove("hide");
    } else {
      item.classList.add("hide");
    }
  });
}


// ---------------- LIGHTBOX ----------------
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");

function openLightbox(index) {
  currentIndex = index;
  lightbox.style.display = "flex";
  showImage();
}

function closeLightbox() {
  lightbox.style.display = "none";
}

function showImage() {
  lightboxImg.src = images[currentIndex].src;
}

function nextImage() {
  currentIndex = (currentIndex + 1) % images.length;
  showImage();
}

function prevImage() {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  showImage();
}


// ---------------- DRAG & DROP ----------------

// Click to open file picker
dropZone.addEventListener("click", () => uploadInput.click());

// Drag events
dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("dragover");
});

dropZone.addEventListener("dragleave", () => {
  dropZone.classList.remove("dragover");
});

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("dragover");

  const file = e.dataTransfer.files[0];
  handleFile(file);
});

// File input fallback
uploadInput.addEventListener("change", () => {
  const file = uploadInput.files[0];
  handleFile(file);
});

function handleFile(file) {
  if (!file || !file.type.startsWith("image/")) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    images.push({
      src: e.target.result,
      category: "custom"
    });
    renderGallery();
  };
  reader.readAsDataURL(file);
}


// ---------------- DELETE ----------------
function deleteImage(index) {
  if (confirm("Delete this image?")) {
    images.splice(index, 1);
    renderGallery();
  }
}


// ---------------- EDIT ----------------
function editCategory(index) {
  const newCategory = prompt("Enter category (nature/city/people/custom):");

  if (newCategory) {
    images[index].category = newCategory.toLowerCase();
    renderGallery();
  }
}


// ---------------- SWIPE ----------------
let startX = 0;

lightbox.addEventListener("touchstart", e => {
  startX = e.touches[0].clientX;
});

lightbox.addEventListener("touchend", e => {
  let endX = e.changedTouches[0].clientX;

  if (startX - endX > 50) nextImage();
  if (endX - startX > 50) prevImage();
});


// ---------------- DARK MODE ----------------
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