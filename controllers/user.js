import { User } from "../models/User.js";
import { Blog } from "../models/Blog.js";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";
import {Notification} from "../models/Notification.js"

dotenv.config();

const bukcetName = process.env.BUCKET_NAME;
const region = process.env.BUCKET_REGION;
const accessKeyId = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;


const s3 = new S3Client({
    credentials: {
        accessKeyId,
        secretAccessKey,
    },
    region
});


//Routes to be written : 
// router.get("/:id/blogs", getUserBlogs);
// router.get("/:id/following", getUserFollowing);
// router.get("/:id/followers", getUserFollowers);
// router.get("/:id", getUser);
// router.patch("/:id/following/:followingID", addRemoveFollowing);
// router.patch("/:id/followers/:followerID", addRemoveFollower);

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getUser = async (req, res) => {
    try {
        var user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const getObjectParams = {
            Bucket: bukcetName,
            Key: user.picture,
        }
        const command = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
        res.status(200).json({ user, url });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}

export const getUserBlogs = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const blogs = await Blog.find({ owner: req.params.id });
        res.status(200).json({ blogs });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// export const getUserFollowing = async (req, res) => {
//     try {
//         const user = await User.findById(req.params.id).populate('following');
//         if (!user) {
//             return res.status(404).json({ error: "User not found" });
//         }
//         const followings = user.following;
//         followings.map(async user => {
//             const getObjectParams = {
//                 Bucket: bukcetName,
//                 Key: user.picture,
//             }
//             const command = new GetObjectCommand(getObjectParams);
//             const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
//             user.url = url;
//             await user.save();
//         })
//         const temp = await User.findById(req.params.id).populate(
//             "following"
//         );
//         const following = temp.following;

//         res.status(200).json({ following });
//     }
//     catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// }

export const getUserConnections = async (req, res) => {
	try {
		const user = await User.findById(req.params.id).populate("connections");
        
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}
		const temp2 = user.connections;
		temp2.map(async (user) => {
			const getObjectParams = {
				Bucket: bukcetName,
				Key: user.picture,
			};
			const command = new GetObjectCommand(getObjectParams);
			const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
			user.url = url;
			await user.save();
		});
		const temp = await User.findById(req.params.id).populate("connections");
         console.log(temp);
		const connections = temp.connections;

       

		res.status(200).json({ connections });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// export const getUserFollowers = async (req, res) => {
//     try {
//         const user = await User.findById(req.params.id).populate("followers");
//         if (!user) {
//             return res.status(404).json({ error: "User not found" });
//         }
//         const followers = user.followers;
//         res.status(200).json({ followers });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// export const addRemoveFollowing = async (req, res) => {
//     try {
//         const user = await User.findById(req.params.id);
//         if (!user) {
//             return res.status(404).json({ error: "User not found" });
//         }
//         const following = await User.findById(req.params.followingID);
//         if (!following) {
//             return res.status(404).json({ error: "User not found" });
//         }
//         if (user.following.includes(req.params.followingID)) {
//             user.following.pull(req.params.followingID);
//             following.followers.pull(req.params.id);
//         }
//         else {
//             user.following.push(req.params.followingID);
//             following.followers.push(req.params.id);
//         }

//         await user.save();
//         await following.save();
//         res.status(200).json({ user });
//     }
//     catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// }

export const addRemoveConnection = async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}
		const connection = await User.findById(req.params.connectionID);
		if (!connection) {
			return res.status(404).json({ error: "User not found" });
		}
		if (user.connections.includes(req.params.connectionID)) {
			user.connections.pull(req.params.connectionID);
            connection.connections.pull(user._id);
		} else {
			user.connections.push(req.params.connectionID);
            connection.connections.push(user._id);
		}

		await user.save();
		await connection.save();
		res.status(200).json({ user });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};


// export const addRemoveFollower = async (req, res) => {
//     try {
//         const user = await User.findById(req.params.id);
//         if (!user) {
//             return res.status(404).json({ error: "User not found" });
//         }
//         const follower = await User.findById(req.params.followerID);
//         if (!follower) {
//             return res.status(404).json({ error: "User not found" });
//         }
//         if (user.followers.includes(req.params.followerID)) {
//             user.followers.pull(req.params.followerID);
//             follower.following.pull(req.params.id);
//         }
//         else {
//             user.followers.push(req.params.followerID);
//             follower.following.push(req.params.id);
//         }
//         await user.save();
//         await follower.save();
//         res.status(200).json({ user });
//     }
//     catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// }

export const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (req.body.username) {
            user.username = req.body.username;
        }

        if (req.body.collegeName) {
            user.collegeName = req.body.collegeName;
        }

        if (req.body.year) {
            user.year = req.body.year;
        }

        if (req.body.branch) {
            user.branch = req.body.branch;
        }

        if (req.body.interests) {
            user.interests = req.body.interests;
        }

        if (req.body.title) {
            user.title = req.body.title;
        }

        if (req.body.about) {
            user.about = req.body.about;
        }

        

        

        const updatedUser = await user.save();
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getAllBlogsByUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const blogs = await Blog.find({ owner: user._id });
        res.json(blogs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

//My Approach

// export const searchByAllInterests = async (req, res) => {
// 	try {
// 		const currentUser = await User.findById(req.params.id);
// 		let currentUserInterests = currentUser.interests;
// 		let matchingUsers = await User.find({
// 			interests: { $in: currentUserInterests },
// 			_id: { $ne: currentUser._id },
// 		});

// 		let usersWithCommonInterests = matchingUsers.map((user) => {
// 			let commonInterests = user.interests.filter((interest) =>
// 				currentUserInterests.includes(interest)
// 			);
// 			return { user, commonInterests };
// 		});

// 		let arr1 = usersWithCommonInterests.sort(
// 			(a, b) => b.commonInterests.length - a.commonInterests.length
// 		);

//         currentUserInterests = currentUser.likedTags;
//         matchingUsers = await User.find({
//             likedTags: { $in: currentUserInterests },
//             _id: { $ne: currentUser._id },
//         });

//         usersWithCommonInterests = matchingUsers.map((user) => {
//             let commonInterests = user.likedTags.filter((interest) =>
//                 currentUserInterests.includes(interest)
//             );
//             return { user, commonInterests };
//         });

//         let arr2 = usersWithCommonInterests.sort(
//             (a, b) => b.commonInterests.length - a.commonInterests.length
//         );

//         let set = new Set(arr1.concat(arr2));
                
//         let sortedUsers = [];
//         sortedUsers = [...set];

// 		res.json(sortedUsers);
// 	} catch (err) {
// 		console.error(err.message);
// 		res.status(500).send("Server Error");
// 	}
// };

// GPT Approach :

export const searchByAllInterests = async (req, res) => {
	try {
		// Get the logged-in user's interests and liked tags
		const currentUser = await User.findById(req.params.id);
		const currentUserInterests = currentUser.interests.concat(
			currentUser.likedTags
		);

		// Find other users who have at least one common interest or liked tag with the logged-in user
		const matchingUsers = await User.find({
			$and: [
				{
					$or: [
						{ interests: { $in: currentUserInterests } },
						{ likedTags: { $in: currentUser.likedTags } },
					],
				},
				{ _id: { $ne: currentUser._id } },
				{ _id: { $nin: currentUser.connections } },
			],
		});

		// Calculate the number of common interests and liked tags between the logged-in user and each user found in step 2
		const usersWithCommonInterests = matchingUsers.map((user) => {
			const commonInterests = user.interests
				.concat(user.likedTags)
				.filter((interest) => currentUserInterests.includes(interest));
			return { user, commonInterests };
		});

		// Sort the list of users based on the number of matching interests and liked tags
		const sortedUsers = usersWithCommonInterests.sort(
			(a, b) => b.commonInterests.length - a.commonInterests.length
		);

		res.json(sortedUsers);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
	}
};


export const searchByOneInterest = async (req, res) => {
	try {
		// Get the logged-in user's interests
		const target_interest = req.params.interest;
        const currentUser = await User.findById(req.params.id);
        const currentUserInterests = currentUser.interests;
        
		// Find other users who have at least one common interest with the logged-in user
		const matchingUsers = await User.find({
			interests: target_interest,
			_id: { $ne: currentUser._id },
		});

		// Calculate the number of common interests between the logged-in user and each user found in step 2
		const usersWithCommonInterests = matchingUsers.map((user) => {
			const commonInterests = user.interests.filter((interest) =>
				currentUserInterests.includes(interest)
			);
			return { user, commonInterests };
		});

		// Sort the list of users based on the number of matching interests
		const sortedUsers = usersWithCommonInterests.sort(
			(a, b) => b.commonInterests.length - a.commonInterests.length
		);

       

		// Present the list of similar users to the logged-in user
		res.json(sortedUsers);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
	}
};


export const notifyUser = async (req, res) => {
	try {
		let {sender, receiver, message} = req.body;
		receiver = await User.findById(receiver);

		if (!receiver) {
			return res.status(404).json({ message: "Receiver not found" });
		}

		const notification = new Notification({
			sender : sender,
			receiver : receiver._id,
			message : message,
		});
		const savedNotification = await notification.save();
		receiver.notifications.push(notification);
		const updatedUser = await receiver.save();
		res.json(updatedUser);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
}

export const getUserNotifications = async (req, res) => {
	try {
		const user = await User.findById(req.params.id).populate({
			path: "notifications",
			populate: [
				{ path: "sender"},
			],
		});
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		const notifications = user.notifications;
		res.status(200).json({ notifications });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
