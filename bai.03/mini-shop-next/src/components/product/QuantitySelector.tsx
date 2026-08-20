'use client';

import React from 'react';

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (qty: number) => void;
  min?: number;
  max?: number;
}

export default function QuantitySelector({
  quantity,
  onQuantityChange,
  min = 1,
  max = 99
}: QuantitySelectorProps) {
  const handleDecrease = () => {
    if (quantity > min) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < max) {
      onQuantityChange(quantity + 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val >= min && val <= max) {
      onQuantityChange(val);
    }
  };

  return (
    <div className="quantity-selector">
      <button
        type="button"
        className="qty-btn"
        onClick={handleDecrease}
        disabled={quantity <= min}
        aria-label="Giảm số lượng"
      >
        -
      </button>
      <input
        type="text"
        className="qty-input"
        value={quantity}
        onChange={handleInputChange}
        aria-label="Số lượng"
      />
      <button
        type="button"
        className="qty-btn"
        onClick={handleIncrease}
        disabled={quantity >= max}
        aria-label="Tăng số lượng"
      >
        +
      </button>
    </div>
  );
}
