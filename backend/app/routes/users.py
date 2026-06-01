from fastapi import APIRouter
from bson import ObjectId
from app.database import db

router = APIRouter()

@router.post("/users")
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
            "videos": user.get("videos", [])
        })

    return users

@router.post("/users/{user_id}/subscribe/{channel_owner_id}")
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

@router.delete("/users/delete-test-users")
def delete_test_users():
    result = db.users.delete_many({
        "name": {"$regex": "Teste", "$options": "i"}
    })

    return {
        "message": "Usuários de teste removidos",
        "deleted_count": result.deleted_count
    }