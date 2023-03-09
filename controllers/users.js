import User from "../models/User.js";
import { fileService } from "../services/file.js";

/* GET USER */
export const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

/* GET USER FRIENDS */
export const getUserFriends = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { friends } = await User.findById(userId).getFriends();

    res.status(200).json(friends);
  } catch (error) {
    next(error);
  }
};

/* SEARCH USERS BY NAME */
export const getUsersByName = async (req, res, next) => {
  try {
    const { query, page = 1, limit = 20 } = req.query;
    let users = [];
    let count = 0;

    if (query) {
      users = await User.findByName(query).getPage(page, limit).selectMainFields();
      count = await User.findByName(query).countDocuments();
    } else {
      users = await User.find().getPage(page, limit).selectMainFields();
      count = await User.find().countDocuments();
    }

    res.status(200).json({ users, count });
  } catch (error) {
    next(error);
  }
};

/* UPDATE USER */
export const updateUser = async (req, res, next) => {
  try {
    const { userId } = req;

    const newData = req.body;

    if (req.file) {
      const userPicture = await User.getUserPicturePath(userId);

      fileService.deleteFromStorage(userPicture.picturePath);
      newData.picturePath = fileService.getFullPath(req.file);
    } else {
      delete newData.picture;
      delete newData.picturePath;
    }

    for (let link in newData.links) {
      const url = newData.links[link];

      if (url && !url.startsWith("http")) {
        newData.links[link] = `http://${url}`;
      }
    }

    const user = await User.findByIdAndUpdate(userId, newData, { new: true });

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

/* UPDATE FRIENDS */
export const addRemoveFriend = async (req, res, next) => {
  try {
    const { userId, friendId } = req.params;

    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId);
      friend.friends = friend.friends.filter((id) => id !== userId);
    } else {
      user.friends.push(friendId);
      friend.friends.push(userId);
    }

    await user.save();
    await friend.save();

    res.status(200).json(user.friends);
  } catch (error) {
    next(error);
  }
};
