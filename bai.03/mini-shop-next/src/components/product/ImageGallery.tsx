'use client';

import React, { useState } from 'react';

interface ImageGalleryProps {
  mainImage: string;
  gallery?: string[];
  productName: string;
}

export default function ImageGallery({ mainImage, gallery, productName }: ImageGalleryProps) {
  const images = gallery && gallery.length > 0 ? gallery : [mainImage];
  const [selectedImage, setSelectedImage] = useState(images[0] || mainImage);

  return (
    <div className="detail-gallery-wrap">
      {/* Thumbnails Sidebar */}
      {images.length > 1 && (
        <div className="gallery-thumbnails-col">
          {images.map((img, index) => (
            <button
              key={index}
              type="button"
              className={`gallery-thumb-btn ${selectedImage === img ? 'active' : ''}`}
              onClick={() => setSelectedImage(img)}
            >
              <img src={img} alt={`${productName} thumb ${index + 1}`} />
            </button>
          ))}
        </div>
      )}

      {/* Main Image Display */}
      <div className="gallery-main-image-wrap">
        <img
          src={selectedImage}
          alt={productName}
          id="mainProductImage"
        />
      </div>
    </div>
  );
}
