import { User } from "../models/User.js";
import { Blog } from "../models/Blog.js";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";

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

export const getUserFollowing = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('following');
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const followings = user.following;
        followings.map(async user => {
            const getObjectParams = {
                Bucket: bukcetName,
                Key: user.picture,
            }
            const command = new GetObjectCommand(getObjectParams);
            const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
            user.url = url;
            await user.save();
        })
        const temp = await User.findById(req.params.id).populate(
            "following"
        );
        const following = temp.following;

        res.status(200).json({ following });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getUserFollowers = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate("followers");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const followers = user.followers;
        res.status(200).json({ followers });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const addRemoveFollowing = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const following = await User.findById(req.params.followingID);
        if (!following) {
            return res.status(404).json({ error: "User not found" });
        }
        if (user.following.includes(req.params.followingID)) {
            user.following.pull(req.params.followingID);
            following.followers.pull(req.params.id);
        }
        else {
            user.following.push(req.params.followingID);
            following.followers.push(req.params.id);
        }

        await user.save();
        await following.save();
        res.status(200).json({ user });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const addRemoveFollower = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const follower = await User.findById(req.params.followerID);
        if (!follower) {
            return res.status(404).json({ error: "User not found" });
        }
        if (user.followers.includes(req.params.followerID)) {
            user.followers.pull(req.params.followerID);
            follower.following.pull(req.params.id);
        }
        else {
            user.followers.push(req.params.followerID);
            follower.following.push(req.params.id);
        }
        await user.save();
        await follower.save();
        res.status(200).json({ user });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}

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