export interface Post {
    _id: string;
    title: string;
    body: string;
    author: User;
    votes: number;  
    createdAt: string;
    comments: Comment[];
  }

export interface User {
    _id: string;
    bio: string;
    username: string;
    email: string;
    avatar: string;
    banner: string;
    joinedDens: Den[];
    posts: Post[];
    comments: Comment[];
  }


export interface Den {
    _id: string;
    name: string;
    description: string;
    categories: string;
    avatar?: string;
    banner?: string;
    members: User[];
    moderators: User[];
    posts: Post[];
    visibility: string;
  }

export interface Comment {
  _id: string;
  postId: string;
  author: User;
  content: string;
  createdAt: string;
  votes: number;

}

export interface NewComment {
  userId : string;
  postId: string;
  content: string;
}

export interface newUser {
  username: string;
  email: string;
  password: string;
}