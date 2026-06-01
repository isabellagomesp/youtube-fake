from fastapi import APIRouter
from bson import ObjectId
from app.database import db

router = APIRouter()

@router.post("/users/{user_id}/videos")
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

@router.get("/users/{user_id}/videos")
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

@router.get("/videos")
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

@router.post("/videos/{video_id}/like/{user_id}")
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

@router.post("/videos/{video_id}/dislike/{user_id}")
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