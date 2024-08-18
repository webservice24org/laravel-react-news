import React from 'react';
import { createBrowserRouter, RouterProvider, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import MasterLayout from './layouts/admin/MasterLayout';
import Dashboard from './components/admin/Dashboard';
import Profile from './components/admin/Profile';
import AuthRole from './components/admin/auth/AuthRole';
import UserPermissions from './components/admin/auth/UserPermissions';
import Users from './components/admin/auth/Users';
import Division from './components/admin/division/Division';
import District from './components/admin/division/District';
import Category from './components/admin/category/Category';
import SubCategory from './components/admin/category/SubCategory';
import Tags from './components/admin/category/Tags';
import PostList from './components/admin/posts/PostList';
import PostForm from './components/admin/posts/PostForm';

import MainLayout from './layouts/frontend/MainLayout';
import Home from './components/frontend/Home';
import SinglePost from './components/frontend/SinglePost';
import PrivateRoute from './components/PrivateRoute'; 

const router = createBrowserRouter([
  {
    path: "/admin",
    element: <PrivateRoute />, 
    children: [
      {
        path: "/admin",
        element: <MasterLayout />,
        children: [
          { path: "", element: <Dashboard /> },
          { path: "profile", element: <Profile /> },
          { path: "role", element: <AuthRole /> },
          { path: "permission", element: <UserPermissions /> },
          { path: "users", element: <Users /> },
          { path: "division", element: <Division /> },
          { path: "district", element: <District /> },
          { path: "categories", element: <Category /> },
          { path: "sub-categories", element: <SubCategory /> },
          { path: "tags", element: <Tags /> },
          { path: "posts", element: <PostList /> },
          { path: "posts/create", element: <PostForm /> },
          { path: "posts/edit/:postId", element: <PostForm /> },
        ],
      },
    ],
  },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/post/:postId", element: <SinglePost /> }, // Route for single post view
    ],
  },
]);

function App() {
  return (
    <div>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;
