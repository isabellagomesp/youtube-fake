from fastapi import FastAPI
from app.database import db
from bson import ObjectId
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "message": "Hello World vindo do backend!"
    }

@app.post("/users")
def create_user(user: dict):

    new_user = {
        "name": user["name"],
        "channelName": user["channelName"],
        "subscribedChannels": [],
        "subscribers": [],
        "videos": []
    }

    result = db.users.insert_one(new_user)

    return {
        "message": "Usuário criado com sucesso!",
        "id": str(result.inserted_id)
    }

@app.get("/users")
def list_users():
    users = []

    for user in db.users.find():
        users.append({
            "id": str(user["_id"]),
            "name": user.get("name", ""),
            "channelName": user.get("channelName", ""),
            "subscribedChannels": user.get("subscribedChannels", []),
            "subscribers": user.get("subscribers", []),
            "videos": user.get("videos", [])
        })

    return users

@app.post("/users/{user_id}/subscribe/{channel_owner_id}")
def subscribe_to_channel(user_id: str, channel_owner_id: str):
    user = db.users.find_one({"_id": ObjectId(user_id)})
    channel_owner = db.users.find_one({"_id": ObjectId(channel_owner_id)})

    if not user:
        return {"message": "Usuário não encontrado"}

    if not channel_owner:
        return {"message": "Canal não encontrado"}

    db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$addToSet": {"subscribedChannels": channel_owner_id}}
    )

    db.users.update_one(
        {"_id": ObjectId(channel_owner_id)},
        {"$addToSet": {"subscribers": user_id}}
    )

    return {
        "message": f"{user['name']} se inscreveu no {channel_owner['channelName']}!"
    }

@app.delete("/users/delete-test-users")
def delete_test_users():
    result = db.users.delete_many({
        "name": {"$regex": "Teste", "$options": "i"}
    })

    return {
        "message": "Usuários de teste removidos",
        "deleted_count": result.deleted_count
    }

@app.post("/users/{user_id}/videos")
def publish_video(user_id: str, video: dict):
    user = db.users.find_one({"_id": ObjectId(user_id)})

    if not user:
        return {"message": "Usuário não encontrado"}

    new_video = {
        "title": video["title"],
        "description": video["description"],
        "fileName": video["fileName"],
        "ownerId": user_id,
        "ownerName": user.get("name", ""),
        "channelName": user.get("channelName", ""),
        "likedBy": [],
        "dislikedBy": []
    }

    result = db.videos.insert_one(new_video)
    video_id = str(result.inserted_id)

    db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$push": {"videos": video_id}}
    )

    return {
        "message": "Vídeo publicado com sucesso!",
        "id": video_id
    }

@app.get("/users/{user_id}/videos")
def list_user_videos(user_id: str):
    videos = []

    for video in db.videos.find({"ownerId": user_id}):
        videos.append({
            "id": str(video["_id"]),
            "title": video.get("title", ""),
            "description": video.get("description", ""),
            "fileName": video.get("fileName", ""),
            "ownerId": video.get("ownerId", ""),
            "ownerName": video.get("ownerName", ""),
            "channelName": video.get("channelName", ""),
            "likedBy": video.get("likedBy", []),
            "dislikedBy": video.get("dislikedBy", []),
            "likesCount": len(video.get("likedBy", [])),
            "dislikesCount": len(video.get("dislikedBy", []))
        })

    return videos

@app.get("/videos")
def list_videos():
    videos = []

    for video in db.videos.find():
        videos.append({
            "id": str(video["_id"]),
            "title": video.get("title", ""),
            "description": video.get("description", ""),
            "fileName": video.get("fileName", ""),
            "ownerId": video.get("ownerId", ""),
            "ownerName": video.get("ownerName", ""),
            "channelName": video.get("channelName", ""),
            "likedBy": video.get("likedBy", []),
            "dislikedBy": video.get("dislikedBy", []),
            "likesCount": len(video.get("likedBy", [])),
            "dislikesCount": len(video.get("dislikedBy", []))
        })

    return videos

@app.post("/videos/{video_id}/like/{user_id}")
def like_video(video_id: str, user_id: str):
    video = db.videos.find_one({"_id": ObjectId(video_id)})
    user = db.users.find_one({"_id": ObjectId(user_id)})

    if not video:
        return {"message": "Vídeo não encontrado"}

    if not user:
        return {"message": "Usuário não encontrado"}

    already_liked = user_id in video.get("likedBy", [])

    if already_liked:
        db.videos.update_one(
            {"_id": ObjectId(video_id)},
            {"$pull": {"likedBy": user_id}}
        )

        return {"message": "Like removido"}
    
    db.videos.update_one(
        {"_id": ObjectId(video_id)},
        {
            "$addToSet": {"likedBy": user_id},
            "$pull": {"dislikedBy": user_id}
        }
    )

    return {"message": "Vídeo curtido"}

@app.post("/videos/{video_id}/dislike/{user_id}")
def dislike_video(video_id: str, user_id: str):
    video = db.videos.find_one({"_id": ObjectId(video_id)})
    user = db.users.find_one({"_id": ObjectId(user_id)})

    if not video:
        return {"message": "Vídeo não encontrado"}

    if not user:
        return {"message": "Usuário não encontrado"}

    already_disliked = user_id in video.get("dislikedBy", [])

    if already_disliked:
        db.videos.update_one(
            {"_id": ObjectId(video_id)},
            {"$pull": {"dislikedBy": user_id}}
        )

        return {"message": "Dislike removido"}
    
    db.videos.update_one(
        {"_id": ObjectId(video_id)},
        {
            "$addToSet": {"dislikedBy": user_id},
            "$pull": {"likedBy": user_id}
        }
    )

    return {"message": "Vídeo descurtido"}