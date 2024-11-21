#!/bin/bash

# Create category image directories
mkdir -p public/assets/images/categories/{discover-classics,running,football,basketball}

# Download placeholder images
curl "https://placehold.co/1200x400/f5f5f5/1a1a1a.jpg?text=Discover+Classics" -o "public/assets/images/categories/discover-classics/header.jpg"
curl "https://placehold.co/1200x400/f5f5f5/1a1a1a.jpg?text=Running" -o "public/assets/images/categories/running/running.jpg"
curl "https://placehold.co/1200x400/f5f5f5/1a1a1a.jpg?text=Football" -o "public/assets/images/categories/football/football.jpg"
curl "https://placehold.co/1200x400/f5f5f5/1a1a1a.jpg?text=Basketball" -o "public/assets/images/categories/basketball/basketball.jpg"
