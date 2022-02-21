import React, { Component } from "react";
import http from "./services/httpService";
import "./App.css";

//we have hidden axios behind http service module.
const apiEndpoint = "https://jsonplaceholder.typicode.com/posts";

class App extends Component {
  state = {
    posts: [],
  };

  async componentDidMount() {
    //when we crete a promise, intially its in PENDING STATE -> RESOLVED (success) OR REJECTED (failure)
    const { data: posts } = await http.get(apiEndpoint);
    this.setState({ posts });
  }
  // const promise = http.get("https://jsonplaceholder.typicode.com/posts");
  // const response = await promise;

  //Promise is an object that holds result of an asynchronus operation.
  //An asynchronus operation is an operation which is going to complete in future.
  // Await is a keyword. whenever we use await, we should declare the function with async keyword.

  handleAdd = async () => {
    const obj = { title: "a", body: "b" };
    const { data: post } = await http.post(apiEndpoint, obj);

    const posts = [post, ...this.state.posts];
    this.setState({ posts });
  };

  //Creating a new object obj and display at the top following with rest of the data.
  //Using post request we can send data to the server and update our database.
  //apiEndpoint is the URL which we have defined and obj is the object which we are sending as a post request.

  handleUpdate = async (post) => {
    post.title = "UPDATED";
    await http.put(apiEndpoint + "/" + post.id, post);
    //await http.patch(apiEndpoint + "/" + post.id, {title: post.title});

    const posts = [...this.state.posts];
    const index = posts.indexOf(post);
    posts[index] = { ...post };
    this.setState({ posts });
  };

  //for updating we have 2 methods: patch and put.
  //Patch is used to update one or more properties, Put is used to update all properties.
  //apiEndpoint + "/" + post.id, post This means in our api endpoint we need to go to posts, find the post id and update the data which is second argument.

  handleDelete = async (post) => {
    const originalPosts = this.state.posts;

    const posts = this.state.posts.filter((p) => p.id !== post.id);
    this.setState({ posts });

    try {
      await http.delete(apiEndpoint + "/" + post.id);
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        alert("This post has already been deleted.");

      this.setState({ posts: originalPosts });
    }
  };
  //this.state.posts.filter((p) => p.id !== post.id) This will exclude the post we want to delete.

  render() {
    return (
      <React.Fragment>
        <button className="btn btn-primary" onClick={this.handleAdd}>
          Add
        </button>
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {this.state.posts.map((post) => (
              <tr key={post.id}>
                <td>{post.title}</td>
                <td>
                  <button
                    className="btn btn-info btn-sm"
                    onClick={() => this.handleUpdate(post)}
                  >
                    Update
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => this.handleDelete(post)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </React.Fragment>
    );
  }
}

export default App;
