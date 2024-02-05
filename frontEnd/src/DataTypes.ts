export interface LikeObj {
  id: string;
  value: string;
}
export interface CountLike {
    likeCount : number;
    dislikeCount : number;
}

export interface LikeData {
    countLike : CountLike;
}

export interface Post{
  id : string,
  title : string,
  subtitle : string,
  content  : string,
  time : string,
  firstName : string,
  lastName : string,
  likeCount : number,
  dislikeCount : number,
}
export interface PostData {
  post : Post
};