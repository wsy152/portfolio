import { Suspense } from 'react';
import { Routes } from 'react-router-dom';
import { AppRoutes } from './routes';

export default function App() {
  return (
    <Suspense fallback={null}>
      <Routes>{AppRoutes()}</Routes>
    </Suspense>
  );
}
