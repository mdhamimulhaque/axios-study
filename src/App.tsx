import axios from "axios";
import { useEffect, useState } from "react";
import "./App.css";
import AddPost from "./components/AddPost";
import EditPost from "./components/EditPost";
import Posts from "./components/Posts";
import { PostType } from "./types/PostTypes";

export default function App() {
  const [posts, setPosts] = useState<PostType[] | []>([]);
  const [post, setPost] = useState<PostType | null>(null); // post I am editing
  const [error, setError] = useState<string | null>(null);

  const handleAddPost = async (newPost: { title: string; body: string }) => {
    try {
      const id = posts.length ? Number(posts[posts.length - 1].id) + 1 : 1;

      const newPostData = {
        id: id.toString(),
        ...newPost,
      };
      const response = await axios.post(
        `http://localhost:8000/posts`,
        newPostData
      );

      setPosts([...posts, response.data]);
    } catch (err) {
      if (err.response) {
        // error came from server
        setError(
          `Error from server: status: ${err.response.status} - message: ${err.response.statusText}`
        );
      }
    }
  };

  const handleDeletePost = async (postId) => {
    if (confirm("Are you sure you want to delete the post?")) {
      try {
        await axios.delete(`http://localhost:8000/posts/${postId}`);
        const newPosts = posts.filter((post: PostType) => post.id !== postId);
        setPosts(newPosts);
      } catch (err) {
        if (err.response) {
          // error came from server
          setError(
            `Error from server: status: ${err.response.status} - message: ${err.response.statusText}`
          );
        }
      }
    } else {
      console("You chose not to delete the post!");
    }
  };

  const handleEditPost = (updatedPost) => {
    const updatedPosts = posts.map((post: PostType) =>
      post.id === updatedPost.id ? updatedPost : post
    );

    setPosts(updatedPosts);
  };

  // ---> fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/posts");
        if (response && response?.data) {
          setPosts(response?.data);
        }
      } catch (err) {
        if (err.response) {
          // error came from server
          setError(
            `Error from server: status: ${err.response.status} - message: ${err.response.statusText}`
          );
        }
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <div>
        <h1>Learn API Request with Axios</h1>
        <hr />

        <div>
          <Posts
            posts={posts}
            onDeletePost={handleDeletePost}
            onEditClick={setPost}
          />

          <hr />

          {!post ? (
            <AddPost onAddPost={handleAddPost} />
          ) : (
            <EditPost post={post} onEditPost={handleEditPost} />
          )}
        </div>

        {error && (
          <>
            <hr />
            <div className="error">{error}</div>
          </>
        )}
      </div>
    </div>
  );
}
