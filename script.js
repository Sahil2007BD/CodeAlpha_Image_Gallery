const gallery = document.getElementById("gallery");
const uploadInput = document.getElementById("upload");

let images = [
  {src:"https://picsum.photos/id/1018/400/300", category:"nature"},
  {src:"https://picsum.photos/id/1015/400/300", category:"city"},
  {src:"https://picsum.photos/id/1005/400/300", category:"people"},
];

let currentIndex = 0;

// Render images
function renderGallery() {
  gallery.innerHTML = "";
  images.forEach((img, index) => {
    const div = document.createElement("div");
    div.classList.add("image");
    div.dataset.category = img.category;

    div.innerHTML = `
      <img src="${img.src}" loading="lazy" onclick="openLightbox(${index})">
    `;

    gallery.appendChild(div);
  });
}
renderGallery();

// Filter with animation
function filterImages(category) {
  document.querySelectorAll(".image").forEach(item => {
    if (category === "all" || item.dataset.category === category) {
      item.classList.remove("hide");
    } else {
      item.classList.add("hide");
    }
  });
}

// Lightbox
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

// Swipe support
let startX = 0;

lightbox.addEventListener("touchstart", e => {
  startX = e.touches[0].clientX;
});

lightbox.addEventListener("touchend", e => {
  let endX = e.changedTouches[0].clientX;
  if (startX - endX > 50) nextImage();
  if (endX - startX > 50) prevImage();
});

// Dark mode with localStorage
function toggleDarkMode() {
  document.body.classList.toggle("light");
  localStorage.setItem("theme", document.body.classList.contains("light") ? "light" : "dark");
}

// Load saved theme
if (localStorage.getItem("theme") === "light") {
  document.body.classList.add("light");
}

// Upload image
uploadInput.addEventListener("change", () => {
  const file = uploadInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    images.push({
      src: e.target.result,
      category: "custom"
    });
    renderGallery();
  };
  reader.readAsDataURL(file);
});