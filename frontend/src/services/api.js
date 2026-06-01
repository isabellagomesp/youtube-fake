const API_URL = "http://127.0.0.1:8000";

export async function getUsers() {
  const response = await fetch(`${API_URL}/users`);
  return response.json();
}

export async function getAllVideos() {
  const response = await fetch(`${API_URL}/videos`);
  return response.json();
}

export async function getUserVideos(userId) {
  const response = await fetch(`${API_URL}/users/${userId}/videos`);
  return response.json();
}

export async function subscribeToChannel(userId, channelOwnerId) {
  await fetch(`${API_URL}/users/${userId}/subscribe/${channelOwnerId}`, {
    method: "POST",
  });
}

export async function publishUserVideo(userId, video) {
  const response = await fetch(`${API_URL}/users/${userId}/videos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
        title: video.title,
        description: video.description,
        fileName: video.fileName,
        thumbnailFileName: video.thumbnailFileName,
    }),
  });

  return response.json();
}

export async function likeVideo(videoId, userId) {
  await fetch(`${API_URL}/videos/${videoId}/like/${userId}`, {
    method: "POST",
  });
}

export async function dislikeVideo(videoId, userId) {
  await fetch(`${API_URL}/videos/${videoId}/dislike/${userId}`, {
    method: "POST",
  });
}

export async function getUserLikedVideos(userId) {
    const response = await fetch(`${API_URL}/users/${userId}/liked-videos`);
    return response.json();
  }