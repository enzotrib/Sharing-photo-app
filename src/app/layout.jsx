// app/layout.jsx

import './globals.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="">
        <main>{children}</main>
        <ToastContainer />
      </body>
    </html>
  );
}
