// Query resolvers
import protectedAuth from "../protectedAuth.js";
import { models } from "../../models/index.js";

async function user(parent, args, context) {
  protectedAuth(context);
  const user = await models.User.findById(args.id);
  return user;
}

async function users(parent, args, context) {
  try {
    // protectedAuth(context);
    const users = await models.User.find({});
    return users;
  } catch (error) {
    return { success: false, message: error.message };
  }
}

async function userChats(parent, args, context) {
  // protectedAuth(context);
  //console.log(context);
  console.log(args)
  const chats = await models.Chat.findById(args.id);
  return chats;
}

async function verifyJwt(parent, args, context) {
  console.log('verifying jwt')
  console.log(context.tokenPayload)
  try {
    const userId = protectedAuth(context);
    console.log('auth good')
    const user = await models.User.findById(userId);
    console.log('query good')
    return user;
  } catch (error) {
    console.log('error')
    return { success: false, message: error.message };
  }
}

export default {
  user,
  users,
  userChats,
  verifyJwt
};
