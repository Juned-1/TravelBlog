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
  userId: string,
  id : string,
  title : string,
  subtitle : string,
  content  : string,
  time : string,
  firstName : string,
  lastName : string,
  likeCount : number,
  dislikeCount : number,
  isfollowed: boolean,
  self: boolean,
}
export interface PostData {
  post : Post
  isfollowed:boolean,
  self:boolean,
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
  bio:string;
  facebookLink:string,
  twitterLink:string,
  instagramLink:string,
  linkedInLink:string,

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

export interface Persons {
  id: string;
  firstName: string;
  lastName: string;
  profilePhoto: string | null;
  profilePhotoId: string | null;
  following: boolean;
  selfFollow: boolean;
}

export interface ApiResponseFollowing {
  status: string;
  data: {
      followings: Persons[];
  };
}

export interface ApiResponseFollower {
  status: string;
  data: {
      followers: Persons[];
  };
}