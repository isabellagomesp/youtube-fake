from fastapi import APIRouter
from bson import ObjectId
from app.database import db
from datetime import datetime, timezone

router = APIRouter()


def serialize_comment(comment: dict):
    return {
        "userId": comment.get("userId", ""),
        "userName": comment.get("userName", ""),
        "text": comment.get("text", ""),
        "createdAt": comment.get("createdAt", ""),
    }


def serialize_video(video: dict):
    comments = [
        serialize_comment(comment)
        for comment in video.get("comments", [])
    ]

    return {
        "id": str(video["_id"]),
        "title": video.get("title", ""),
        "description": video.get("description", ""),
        "fileName": video.get("fileName", ""),
        "thumbnailFileName": video.get("thumbnailFileName", ""),
        "ownerId": video.get("ownerId", ""),
        "ownerName": video.get("ownerName", ""),
        "channelName": video.get("channelName", ""),
        "likedBy": video.get("likedBy", []),
        "dislikedBy": video.get("dislikedBy", []),
        "likesCount": len(video.get("likedBy", [])),
        "dislikesCount": len(video.get("dislikedBy", [])),
        "comments": comments,
    }

@router.post("/users/{user_id}/videos")
def publish_video(user_id: str, video: dict):
    user = db.users.find_one({"_id": ObjectId(user_id)})

    if not user:
        return {"message": "Usuário não encontrado"}

    new_video = {
        "title": video["title"],
        "description": video["description"],
        "fileName": video['fileName'],
        "thumbnailFileName": video["thumbnailFileName"],
        "ownerId": user_id,
        "ownerName": user.get("name", ""),
        "channelName": user.get("channelName", ""),
        "likedBy": [],
        "dislikedBy": [],
        "comments": [],
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
        videos.append(serialize_video(video))

    return videos

@router.get("/videos")
def list_videos():
    videos = []

    for video in db.videos.find():
        videos.append(serialize_video(video))

    return videos


@router.post("/videos/{video_id}/comments")
def create_video_comment(video_id: str, payload: dict):
    user_id = payload.get("userId", "")
    text = payload.get("text", "").strip()

    if not user_id or not text:
        return {"message": "Dados do comentario invalidos"}

    user = db.users.find_one({"_id": ObjectId(user_id)})

    if not user:
        return {"message": "Usuario nao encontrado"}

    video = db.videos.find_one({"_id": ObjectId(video_id)})

    if not video:
        return {"message": "Video nao encontrado"}

    new_comment = {
        "userId": user_id,
        "userName": user.get("name", ""),
        "text": text,
        "createdAt": datetime.now(timezone.utc).isoformat(),
    }

    db.videos.update_one(
        {"_id": ObjectId(video_id)},
        {"$push": {"comments": new_comment}},
    )

    return {
        "message": "Comentario criado com sucesso",
        "comment": serialize_comment(new_comment),
    }

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

        db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$pull": {"likedVideos": video_id}}
        )

        return {"message": "Like removido"}

    db.videos.update_one(
        {"_id": ObjectId(video_id)},
        {
            "$addToSet": {"likedBy": user_id},
            "$pull": {"dislikedBy": user_id}
        }
    )

    db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$addToSet": {"likedVideos": video_id}}
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

    db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$pull": {"likedVideos": video_id}}
    )

    return {"message": "Vídeo descurtido"}

@router.get("/users/{user_id}/liked-videos")
def list_user_liked_videos(user_id: str):
    user = db.users.find_one({"_id": ObjectId(user_id)})

    if not user:
        return {"message": "Usuário não encontrado"}

    liked_video_ids = user.get("likedVideos", [])

    videos = []

    for video_id in liked_video_ids:
        video = db.videos.find_one({"_id": ObjectId(video_id)})

        if video:
            videos.append(serialize_video(video))

    return videos