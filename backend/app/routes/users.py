from fastapi import APIRouter
from bson import ObjectId
from app.database import db
from datetime import datetime, timezone

router = APIRouter()


def serialize_playlist(playlist: dict):
    video_ids = playlist.get("videoIds", [])

    return {
        "id": playlist.get("id", ""),
        "name": playlist.get("name", ""),
        "visibility": playlist.get("visibility", "public"),
        "videoIds": video_ids,
        "videosCount": len(video_ids),
        "createdAt": playlist.get("createdAt", ""),
    }

@router.post("/users")
def create_user(user: dict):
    new_user = {
        "name": user["name"],
        "channelName": user["channelName"],
        "subscribedChannels": [],
        "subscribers": [],
        "videos": [],
        "likedVideos": [],
        "playlists": [],
    }

    result = db.users.insert_one(new_user)

    return {
        "message": "Usuário criado com sucesso!",
        "id": str(result.inserted_id)
    }

@router.get("/users")
def list_users():
    users = []

    for user in db.users.find():
        users.append({
            "id": str(user["_id"]),
            "name": user.get("name", ""),
            "channelName": user.get("channelName", ""),
            "subscribedChannels": user.get("subscribedChannels", []),
            "subscribers": user.get("subscribers", []),
            "videos": user.get("videos", []),
            "likedVideos": user.get("likedVideos", []),
            "playlists": [
                serialize_playlist(playlist)
                for playlist in user.get("playlists", [])
            ],
        })

    return users


@router.get("/users/{user_id}/playlists")
def list_user_playlists(user_id: str):
    user = db.users.find_one({"_id": ObjectId(user_id)})

    if not user:
        return {"message": "Usuário não encontrado"}

    return [
        serialize_playlist(playlist)
        for playlist in user.get("playlists", [])
    ]


@router.post("/users/{user_id}/playlists")
def create_user_playlist(user_id: str, payload: dict):
    user = db.users.find_one({"_id": ObjectId(user_id)})

    if not user:
        return {"message": "Usuário não encontrado"}

    name = payload.get("name", "").strip()
    visibility = payload.get("visibility", "public")

    if not name:
        return {"message": "Nome da playlist é obrigatório"}

    if visibility not in {"public", "private"}:
        return {"message": "Visibilidade da playlist inválida"}

    new_playlist = {
        "id": str(ObjectId()),
        "name": name,
        "visibility": visibility,
        "videoIds": [],
        "createdAt": datetime.now(timezone.utc).isoformat(),
    }

    db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$push": {"playlists": new_playlist}},
    )

    return {
        "message": "Playlist criada com sucesso",
        "playlist": serialize_playlist(new_playlist),
    }


@router.post("/users/{user_id}/playlists/{playlist_id}/videos/{video_id}")
def add_video_to_playlist(user_id: str, playlist_id: str, video_id: str):
    user = db.users.find_one({"_id": ObjectId(user_id)})

    if not user:
        return {"message": "Usuário não encontrado"}

    playlist = next(
        (
            playlist
            for playlist in user.get("playlists", [])
            if playlist.get("id") == playlist_id
        ),
        None,
    )

    if not playlist:
        return {"message": "Playlist não encontrada"}

    video = db.videos.find_one({"_id": ObjectId(video_id)})

    if not video:
        return {"message": "Vídeo não encontrado"}

    db.users.update_one(
        {"_id": ObjectId(user_id), "playlists.id": playlist_id},
        {"$addToSet": {"playlists.$.videoIds": video_id}},
    )

    return {"message": "Vídeo adicionado à playlist"}

@router.post("/users/{user_id}/subscribe/{channel_owner_id}")
def subscribe_to_channel(user_id: str, channel_owner_id: str):
    user = db.users.find_one({"_id": ObjectId(user_id)})
    channel_owner = db.users.find_one({"_id": ObjectId(channel_owner_id)})

    if not user:
        return {"message": "Usuário não encontrado"}

    if not channel_owner:
        return {"message": "Canal não encontrado"}

    already_subscribed = channel_owner_id in user.get("subscribedChannels", [])

    if already_subscribed:
        db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$pull": {"subscribedChannels": channel_owner_id}}
        )

        db.users.update_one(
            {"_id": ObjectId(channel_owner_id)},
            {"$pull": {"subscribers": user_id}}
        )

        return {
            "message": f"{user['name']} se desinscreveu do {channel_owner['channelName']}."
        }

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

@router.delete("/users/delete-test-users")
def delete_test_users():
    result = db.users.delete_many({
        "name": {"$regex": "Teste", "$options": "i"}
    })

    return {
        "message": "Usuários de teste removidos",
        "deleted_count": result.deleted_count
    }