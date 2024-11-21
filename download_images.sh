#!/bin/bash

# Create directories if they don't exist
mkdir -p public/assets/images/products/nike/air-force-1
mkdir -p public/assets/images/products/nike/dunk
mkdir -p public/assets/images/products/nike/vaporfly
mkdir -p public/assets/images/products/nike/phantom
mkdir -p public/assets/images/products/nike/lebron

# Air Force 1 remaining images
for i in {5..10}; do
  curl -o "public/assets/images/products/nike/air-force-1/af1-$i.jpg" "https://placehold.co/600x400/png?text=AF1+$i"
done

# Dunk remaining images
for i in {5..10}; do
  curl -o "public/assets/images/products/nike/dunk/dunk-$i.jpg" "https://placehold.co/600x400/png?text=Dunk+$i"
done

# Vaporfly all images
for i in {1..10}; do
  curl -o "public/assets/images/products/nike/vaporfly/vaporfly-$i.jpg" "https://placehold.co/600x400/png?text=Vaporfly+$i"
done

# Phantom all images
for i in {1..10}; do
  curl -o "public/assets/images/products/nike/phantom/phantom-$i.jpg" "https://placehold.co/600x400/png?text=Phantom+$i"
done

# LeBron all images
for i in {1..10}; do
  curl -o "public/assets/images/products/nike/lebron/lebron-$i.jpg" "https://placehold.co/600x400/png?text=LeBron+$i"
done
