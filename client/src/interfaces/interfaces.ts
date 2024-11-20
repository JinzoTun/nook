export interface Post {
    _id: string;
    title: string;
    body: string;
    author: {
      _id: string;
      username: string;
      avatar: string;
    };
    votes: number;  
    createdAt: string;
    comments: Comment[];
  }

export interface Den {
    _id: string;
    name: string;
    description: string;
    categories: string;
    avatar?: string;
    banner?: string;
    members: 
      {
        _id: string;
        username: string;
        avatar: string;
      }[];
    posts: Post[];
  }

export interface Comment {
  _id: string;
  author: {
    username: string 
    avatar: string;
  };
  content: string;
  createdAt: string;
  votes: number;

}

export interface NewComment {
  userId : string;
  postId: string;
  content: string;
}