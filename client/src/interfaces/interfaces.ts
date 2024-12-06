export interface Post {
    _id: string;
    title: string;
    body: string;
    image: string;
    video: string;
    author: User;
    votes: number;  
    createdAt: string;
    comments: Comment[];
    location : location;
    locationType: string;
    
  }

export interface location {
  _id: string;
  name: string;
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
    following: User[] 
    followers: string[];
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
    createdBy: User;
    rules: string;
    flair: string;
    tags: string;
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

export interface Notification {
  _id: string;
  userId: string;
  postId: string;
  type: string;
  read: boolean;
  createdAt: string;
  sender: User;
  receiver: User;
}