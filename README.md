# IntraBis Landing Page

🚀 **Landing page enterprise untuk platform transportasi terintegrasi IntraBis**

Landing page ini didesain dengan gaya cinematic dark theme dan dilengkapi dengan animasi CSS yang subtle untuk menciptakan pengalaman visual yang profesional.

## 🎨 Features

- ✅ **Fully Responsive** - Desktop, tablet, dan mobile optimized
- ✅ **Pure CSS Animations** - No JavaScript dependencies untuk animasi
- ✅ **Production Ready** - Siap deploy dengan Docker
- ✅ **SEO Optimized** - Meta tags dan semantic HTML
- ✅ **Fast Loading** - Menggunakan Tailwind CDN dan optimasi Nginx
- ✅ **Security Headers** - Production-grade security configuration

## 🛠️ Tech Stack

- **HTML5** + **Tailwind CSS**
- **Nginx** (Alpine Linux)
- **Docker** + **Docker Compose**

## 🚀 Quick Start

### Option 1: Docker Compose (Recommended)

```bash
# Clone repository
git clone https://github.com/Aldhie/intrabis-landing.git
cd intrabis-landing

# Run dengan Docker Compose
docker-compose up -d

# Akses di browser
http://localhost:8080
```

### Option 2: Docker Manual

```bash
# Build image
docker build -t intrabis-landing:latest .

# Run container
docker run -d \
  --name intrabis-landing \
  -p 8080:80 \
  --restart unless-stopped \
  intrabis-landing:latest

# Akses di browser
http://localhost:8080
```

### Option 3: Langsung Buka File HTML

```bash
# Cukup buka index.html di browser
open index.html
```

## 📦 Deployment ke Production

### Deploy ke VPS/Cloud Server

```bash
# SSH ke server
ssh user@your-server.com

# Clone repository
git clone https://github.com/Aldhie/intrabis-landing.git
cd intrabis-landing

# Run dengan Docker Compose
docker-compose up -d

# Untuk production dengan domain, edit docker-compose.yml
# Ubah port 8080:80 menjadi 80:80
```

### Deploy ke Docker Hub

```bash
# Login ke Docker Hub
docker login

# Build dan tag
docker build -t aldhie/intrabis-landing:latest .

# Push ke Docker Hub
docker push aldhie/intrabis-landing:latest

# Di server production
docker pull aldhie/intrabis-landing:latest
docker run -d -p 80:80 --name intrabis-landing aldhie/intrabis-landing:latest
```

### Deploy dengan Reverse Proxy (Nginx/Traefik)

Edit `docker-compose.yml` dan tambahkan labels untuk reverse proxy:

```yaml
labels:
  - "traefik.enable=true"
  - "traefik.http.routers.intrabis.rule=Host(`intrabis.id`)"
  - "traefik.http.services.intrabis.loadbalancer.server.port=80"
```

## 🔧 Management Commands

```bash
# Lihat logs
docker-compose logs -f

# Stop container
docker-compose down

# Restart container
docker-compose restart

# Update code dan rebuild
git pull
docker-compose up -d --build

# Remove semua (container + image)
docker-compose down --rmi all
```

## 📁 Struktur Project

```
intrabis-landing/
├── index.html           # Landing page utama
├── Dockerfile          # Docker configuration
├── docker-compose.yml  # Docker Compose configuration
├── nginx.conf         # Nginx server configuration
├── .dockerignore      # Docker ignore patterns
└── README.md          # Dokumentasi ini
```

## 🎯 Page Sections

1. **Hero Section** - Headline utama dengan animated background
2. **Problem Section** - Statement masalah industri transportasi
3. **Solution Section** - Visualisasi ekosistem IntraBis
4. **Capabilities Section** - 6 kapabilitas inti platform
5. **Positioning Section** - Value proposition statement
6. **CTA Section** - Call-to-action untuk demo
7. **Footer** - Contact info dan copyright

## 🔐 Security Features

Nginx configuration sudah include:
- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: no-referrer-when-downgrade`

## ⚡ Performance Optimization

- **Gzip Compression** enabled untuk semua text assets
- **Browser Caching** 1 tahun untuk static assets
- **Alpine Linux** base image (~5MB vs Ubuntu ~72MB)
- **Health Check** untuk monitoring container

## 🎨 Customization

Untuk mengubah konten:
1. Edit `index.html`
2. Rebuild Docker image: `docker-compose up -d --build`

Untuk mengubah styling:
- Semua styling ada di `<style>` tag dalam `index.html`
- Menggunakan Tailwind utility classes

## 📝 License

© 2025 IntraBis. All rights reserved.

## 👤 Author

**Aldhie**  
GitHub: [@Aldhie](https://github.com/Aldhie)

---

**Live Demo**: [https://aldhie.github.io/intrabis-landing](https://aldhie.github.io/intrabis-landing)  
**Repository**: [https://github.com/Aldhie/intrabis-landing](https://github.com/Aldhie/intrabis-landing)