import type { ReactNode } from 'react';
export const metadata = { title: 'Bibliotheca', description: 'Deine persönliche YouTube-Bibliothek' };
export default function RootLayout({ children }: { children: ReactNode }) { return <html lang="de"><body style={{margin:0,background:'#f6f2e9',color:'#28231e',fontFamily:'Georgia,serif'}}>{children}</body></html>; }
