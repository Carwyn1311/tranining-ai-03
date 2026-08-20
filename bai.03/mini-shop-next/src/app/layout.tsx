import type { Metadata } from 'next';
import '@/styles/globals.css';
import { ToastProvider } from '@/context/ToastContext';
import { ShopProvider } from '@/context/ShopContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { AuthProvider } from '@/context/AuthContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Mini Shop - Nội thất & Đồ thủ công mỹ nghệ tinh tuyển',
  description: 'Trang mua sắm nội thất gia đình, đồ gốm sứ nghệ thuật và đồ thủ công mây tre đan phong cách Scandinavia tối giản hiện đại.',
  keywords: 'nội thất, đồ thủ công, đồ mỹ nghệ, sofa nordic, bàn ăn gỗ sồi, gốm decor'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>
        <ToastProvider>
          <ShopProvider>
            <CartProvider>
              <WishlistProvider>
                <AuthProvider>
                  <Header />
                  <main style={{ flex: 1 }}>{children}</main>
                  <Footer />
                </AuthProvider>
              </WishlistProvider>
            </CartProvider>
          </ShopProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
