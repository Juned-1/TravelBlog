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

export interface sendPostBulk{
  title : string,
  subtitle : string,
  content : string
}

export interface SearchParameter{
  page : number,
  title? : string,
  subtitle? : string
}

export interface blogs{
  content: string,
  id: string;
  title: string;
  subtitle: string;
  time: string;
  firstName : string;
  lastName : string;
  imageURL : string | null;
}
export interface data{
  blogs: any;
}
export interface UserData {
  user: {
    id: String;
    email: String;
    firstName: String;
    lastName: String;
  };
}
export interface userDetails {
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  email: string;
  // password: string;
}
export interface data1 {
  userDetails;
}
export interface userData1 {
  user: {
    id: String;
    firstName: String;
    lastName: String;
    email: String;
    dob: Date;
    gender: String;
  };
}