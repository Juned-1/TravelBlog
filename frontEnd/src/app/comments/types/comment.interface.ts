export interface CommentInterface {
  id: string;
  body: string;
  username: string;
  userId: string; 
  parentId: null | string;// Nested Comment 
  createdAt: string;// date and time
  haveReplies: boolean;
}
