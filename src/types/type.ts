type Profile = {
  userId: string;
  pronouns?: string;
  introduction?: string;
  name: string;
  imageUrl?: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  favoriteColor?: string;
};

type Server = {
  id: string;
  name: string;
  imageUrl: string;
  inviteCode: string;
  profileId: string;
  members?: Member[];
  channels?: Channel[];
  createdAt: string;
  updatedAt: string;
};

type Member = {
  id: string;
  role: string;
  profileId: string;
  serverId: string;
  createdAt: string;
  updatedAt: string;
  profile?: Profile;
};

type Channel = {
  id: string;
  name: string;
  type: string;
  profileId: string;
  serverId: string;
  messages?: Message[];
  createdAt: string;
  updatedAt: string;
  description?: string;
};

type Message = {
  id: string;
  content?: string;
  fileUrls?: fileType[];
  memberId?: string;
  channelId: string;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  member?: Member;
};

type fileType = {
  type: string;
  url: string;
  fileName?: string;
  size?: number;
};

type Friends = {
  id: string;
  memberOneId: string;
  memberTwoId: string;
  messages?: DirectMessage[];
  createdAt: string;
  updatedAt: string;
  memberOne?: Profile;
  memberTwo?: Profile;
  lastMessage?: DirectMessage;
};

type DirectMessage = {
  id: string;
  content?: string;
  fileUrls?: fileType[];
  memberId: string;
  conversationId: string;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  member?: Profile;
};

type FriendRequests = {
  id: string;
  senderId?: string;
  receiverId?: string;
  sender?: Profile;
  receiver?: Profile;
  createdAt: string;
  updatedAt: string;
  status: string;
};

enum StatusFriendRequest {
  PENDING = "pending",
  ACCEPTED = "accept",
  REJECTED = "reject",
}
enum MemberRole {
  ADMIN = "ADMIN",
  MODERATOR = "MODERATOR",
  GUEST = "GUEST",
}
enum ChannelType {
  TEXT = "TEXT",
  AUDIO = "AUDIO",
  VIDEO = "VIDEO",
}
enum MessageType {
  TEXT = "TEXT",
  RECORD = "RECORD",
  PDF = "PDF",
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
  FILE = "FILE",
}
export {
  FriendRequests,
  StatusFriendRequest,
  DirectMessage,
  Friends,
  Message,
  Channel,
  Member,
  Server,
  Profile,
  ChannelType,
  MemberRole,
  MessageType,
  fileType,
};
