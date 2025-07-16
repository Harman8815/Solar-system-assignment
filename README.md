# 🌌 3D Solar System Simulation – Three.js

An interactive and visually rich **3D Solar System simulation** built using **Three.js** and **Vite**. This project is designed to replicate the motion of planets orbiting the Sun with realistic textures, orbital speeds, and axial tilts. Users can freely explore the solar system, pause or adjust planetary speeds, and interactively learn about each celestial body. With its smooth animations, hover tooltips, and dynamic lighting, this project serves both as an educational tool and a fun space exploration experience.

---

## 🚀 Features

- **Realistic Orbits & Rotation:** Planets revolve around the sun based on proportional orbital speeds while rotating on their axes.
- **High-Quality Textures:** Uses planet-specific textures to make each planet visually accurate.
- **Axial Tilt & Retrograde Rotation:** Includes tilt and reverse spin for planets like Venus and Uranus.
- **Saturn Rings & Moon:** Procedurally generated Saturn rings with random points and an orbiting Earth moon.
- **Starfield Environment:** Thousands of randomly placed stars for a true deep-space feeling.
- **Interactive GUI Controls:**
  - Pause or resume the entire simulation.
  - Toggle dark/light background.
  - Enable/disable textures for a minimalistic look.
  - Adjust the orbital speed of each planet individually.
  - Show/hide planets with checkboxes.
- **Tooltips on Hover:** Display planet names dynamically on mouse hover.
- **Responsive:** Fully resizes with your screen, optimized for desktops.

---

## 📂 Project Structure

```
/public
 ├── textures/        # Planet textures (PNG)
 ├── models/          # 3D Sun model (GLB) if used
 ├── stars.js         # Generates the 3D star background
/src
 ├── main.js          # Main simulation & animation logic
 ├── getSun.js        # Loads sun (GLTF model or procedural sphere)
 └── index.html       # Entry point
```

---

## 🛠️ Installation & Running

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/threejs-solar-system.git
   cd threejs-solar-system
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run locally:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

---

## 🌐 Deployment

### ✅ Netlify
- **Build Command:** `vite build`
- **Publish Directory:** `dist`

### ✅ Vercel
- Select **Vite** framework.
- **Output Directory:** `dist`.

---

## 🖼️ Preview

<img width="1920" height="946" alt="image" src="https://github.com/user-attachments/assets/57adbe71-9aed-406f-9992-5b4ca85be968" />


https://github.com/user-attachments/assets/23cf57e2-e6ea-4bca-b294-6ec55e4d5744


---

## 🛠️ Technologies Used

- [Three.js](https://threejs.org/) – 3D rendering
- [Vite](https://vitejs.dev/) – Fast build tool
- JavaScript (ES6 Modules)
- HTML5 & CSS3

---

## 📜 License

This project is open-source and available under the MIT License.

---

## 💡 Future Improvements

- Adding asteroid belts and more moons.
- Implementing camera fly-through animations.
- Adding a detailed planet info panel with real-world data.

---

**✨ Explore the Universe – One Planet at a Time!**
