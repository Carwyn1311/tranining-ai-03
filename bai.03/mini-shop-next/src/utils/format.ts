/**
 * Định dạng tiền tệ VND chuẩn Việt Nam (ví dụ: 290.000đ, 3.490.000đ)
 */
export function formatVND(amount: number | string | undefined | null): string {
  if (amount === undefined || amount === null) return '0đ';
  const num = typeof amount === 'number' ? amount : Number(amount) || 0;
  return num.toLocaleString('vi-VN') + 'đ';
}
