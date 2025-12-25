# Use official Nginx Alpine image for lightweight container
FROM nginx:alpine

# Set maintainer label
LABEL maintainer="Aldhie <info@intrabis.id>"
LABEL description="IntraBis Landing Page - Integrated Transportation Platform"

# Remove default Nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy landing page to Nginx web directory
COPY index.html /usr/share/nginx/html/

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]