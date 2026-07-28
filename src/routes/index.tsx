import { createBrowserRouter, type RouteObject } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import HomePage from '@/pages/HomePage'
import PortfolioPage from '@/pages/PortfolioPage'
import CategoryPage from '@/pages/CategoryPage'
import WorkDetailPage from '@/pages/WorkDetailPage'
import VideosPage from '@/pages/VideosPage'
import NotFoundPage from '@/pages/NotFoundPage'

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'portfolio', element: <PortfolioPage /> },
      { path: 'portfolio/:category', element: <CategoryPage /> },
      { path: 'portfolio/:category/:workId', element: <WorkDetailPage /> },
      { path: 'videos', element: <VideosPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]

export const router = createBrowserRouter(routes)
